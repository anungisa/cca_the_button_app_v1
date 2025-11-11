/**
 * CurlingOS XP Engine - Core XP logic with throttling, decay, and abuse prevention
 */

export class XPEngine {
  static XP_LIMITS = {
    DAILY_MAX: 500,
    WEEKLY_MAX: 2000,
    MONTHLY_MAX: 6000,
    COOLDOWN_MINUTES: {
      trivia: 5,
      patch_scan: 10,
      volunteer_checkin: 30,
      livestream: 60
    }
  };

  static XP_DECAY_RATES = {
    daily_bonus: 0.1,    // 10% decay per day if not earned
    streak_bonus: 0.2,   // 20% decay if streak broken
    event_multiplier: 0.05 // 5% decay per day after event
  };

  static async awardXP(userId, amount, source, metadata = {}) {
    const now = new Date();
    
    // Check rate limits
    const rateLimitCheck = await this.checkRateLimits(userId, source, now);
    if (!rateLimitCheck.allowed) {
      throw new Error(`Rate limit exceeded: ${rateLimitCheck.reason}`);
    }

    // Apply multipliers
    const multipliers = await this.calculateMultipliers(userId, source, metadata);
    const finalAmount = Math.floor(amount * multipliers.total);

    // Check daily/weekly limits
    const limitsCheck = await this.checkXPLimits(userId, finalAmount, now);
    if (!limitsCheck.allowed) {
      throw new Error(`XP limit exceeded: ${limitsCheck.reason}`);
    }

    // Award the XP
    const transaction = await this.createXPTransaction(userId, finalAmount, source, metadata, multipliers);
    
    // Update user's XP totals
    await this.updateUserXPTotals(userId, finalAmount);
    
    // Check for tier advancement
    await this.checkTierAdvancement(userId);
    
    // Audit log
    await this.logXPAward(userId, finalAmount, source, metadata, multipliers);
    
    return {
      awarded: finalAmount,
      multipliers,
      newTotal: await this.getUserXPTotal(userId),
      transaction
    };
  }

  static async checkRateLimits(userId, source, timestamp) {
    const cooldownKey = `xp_cooldown_${userId}_${source}`;
    const lastActivity = await this.getCachedValue(cooldownKey);
    const cooldownMinutes = this.XP_LIMITS.COOLDOWN_MINUTES[source] || 5;
    
    if (lastActivity) {
      const timeSince = timestamp - new Date(lastActivity);
      
      if (timeSince < cooldownMinutes * 60 * 1000) {
        return {
          allowed: false,
          reason: `Cooldown active for ${Math.ceil((cooldownMinutes * 60 * 1000 - timeSince) / 1000 / 60)} minutes`
        };
      }
    }
    
    // Set new cooldown
    await this.setCachedValue(cooldownKey, timestamp.toISOString(), cooldownMinutes * 60);
    
    return { allowed: true };
  }

  static async calculateMultipliers(userId, source, metadata) {
    const multipliers = {
      base: 1.0,
      fan_pass: 1.0,
      streak: 1.0,
      event: 1.0,
      sponsor: 1.0,
      total: 1.0
    };

    // Fan Pass multiplier
    const user = await this.getUserData(userId);
    if (user && user.fan_pass_status === 'active') {
      multipliers.fan_pass = 2.0;
    }

    // Streak multiplier
    const streak = await this.getUserStreak(userId, source);
    if (streak >= 7) multipliers.streak = 1.5;
    else if (streak >= 3) multipliers.streak = 1.2;

    // Event multiplier
    if (metadata.eventId) {
      const eventMultiplier = await this.getEventMultiplier(metadata.eventId);
      multipliers.event = eventMultiplier;
    }

    // Sponsor campaign multiplier
    if (metadata.sponsorId) {
      const sponsorMultiplier = await this.getSponsorMultiplier(metadata.sponsorId);
      multipliers.sponsor = sponsorMultiplier;
    }

    // Calculate total
    multipliers.total = multipliers.base * multipliers.fan_pass * multipliers.streak * multipliers.event * multipliers.sponsor;
    
    // Cap at 5x to prevent abuse
    if (multipliers.total > 5.0) {
      multipliers.total = 5.0;
    }

    return multipliers;
  }

  static async checkXPLimits(userId, amount, timestamp) {
    const today = timestamp.toISOString().split('T')[0];
    const thisWeek = this.getWeekKey(timestamp);
    const thisMonth = timestamp.toISOString().substring(0, 7);

    const dailyXP = await this.getUserXPForPeriod(userId, 'daily', today);
    const weeklyXP = await this.getUserXPForPeriod(userId, 'weekly', thisWeek);
    const monthlyXP = await this.getUserXPForPeriod(userId, 'monthly', thisMonth);

    if (dailyXP + amount > this.XP_LIMITS.DAILY_MAX) {
      return { allowed: false, reason: 'Daily XP limit reached' };
    }
    
    if (weeklyXP + amount > this.XP_LIMITS.WEEKLY_MAX) {
      return { allowed: false, reason: 'Weekly XP limit reached' };
    }
    
    if (monthlyXP + amount > this.XP_LIMITS.MONTHLY_MAX) {
      return { allowed: false, reason: 'Monthly XP limit reached' };
    }

    return { allowed: true };
  }

  static async applyXPDecay(userId) {
    const user = await this.getUserData(userId);
    if (!user) return { decayed: 0 };
    
    const lastActivity = new Date(user.last_xp_activity || Date.now());
    const daysSinceActivity = Math.floor((Date.now() - lastActivity) / (1000 * 60 * 60 * 24));

    if (daysSinceActivity > 7) {
      // Apply decay to various XP bonuses
      const decayAmount = Math.floor((user.xp_bonuses || 0) * this.XP_DECAY_RATES.daily_bonus * daysSinceActivity);
      await this.updateUserXPBonuses(userId, -decayAmount);
      
      return { decayed: decayAmount, reason: 'Inactivity decay' };
    }

    return { decayed: 0 };
  }

  // Helper methods with safety checks
  static async getCachedValue(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  static async setCachedValue(key, value, ttlSeconds) {
    try {
      localStorage.setItem(key, value);
      setTimeout(() => localStorage.removeItem(key), ttlSeconds * 1000);
    } catch (error) {
      console.warn('Failed to cache value:', error);
    }
  }

  static getWeekKey(date) {
    const year = date.getFullYear();
    const week = Math.ceil((date.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return `${year}-W${week}`;
  }

  static async createXPTransaction(userId, amount, source, metadata, multipliers) {
    // This would create a PointTransaction record
    return {
      id: Date.now().toString(),
      userId,
      amount,
      source,
      metadata,
      multipliers,
      timestamp: new Date().toISOString()
    };
  }

  static async logXPAward(userId, amount, source, metadata, multipliers) {
    // Audit logging for compliance
    console.log(`XP Award: User ${userId} earned ${amount} XP from ${source}`, {
      metadata,
      multipliers,
      timestamp: new Date().toISOString()
    });
  }

  // Mock methods for helper functions that would normally hit the database
  static async getUserData(userId) {
    // Mock implementation - in production this would query the user database
    return {
      id: userId,
      fan_pass_status: 'active',
      xp_bonuses: 100,
      last_xp_activity: new Date().toISOString()
    };
  }

  static async getUserStreak(userId, source) {
    // Mock implementation - would calculate user's current streak
    return Math.floor(Math.random() * 10);
  }

  static async getEventMultiplier(eventId) {
    // Mock implementation - would get event-specific multiplier
    return 1.2;
  }

  static async getSponsorMultiplier(sponsorId) {
    // Mock implementation - would get sponsor campaign multiplier
    return 1.1;
  }

  static async getUserXPForPeriod(userId, period, timeKey) {
    // Mock implementation - would sum XP for the time period
    return Math.floor(Math.random() * 100);
  }

  static async updateUserXPTotals(userId, amount) {
    // Mock implementation - would update user's total XP
    console.log(`Updated user ${userId} XP by ${amount}`);
  }

  static async checkTierAdvancement(userId) {
    // Mock implementation - would check if user advanced tiers
    console.log(`Checked tier advancement for user ${userId}`);
  }

  static async getUserXPTotal(userId) {
    // Mock implementation - would return user's total XP
    return Math.floor(Math.random() * 1000) + 500;
  }

  static async updateUserXPBonuses(userId, amount) {
    // Mock implementation - would update user's XP bonuses
    console.log(`Updated user ${userId} XP bonuses by ${amount}`);
  }
}