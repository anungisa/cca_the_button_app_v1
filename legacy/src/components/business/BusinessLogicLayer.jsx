/**
 * Business Logic Layer
 * Centralizes all business rules and calculations
 * Single source of truth for business operations
 */

import { enhancedEntityService } from '../services/EnhancedEntityService';
import { performanceMonitor } from '../services/PerformanceMonitoringService';
import { rateLimiter } from '../services/RateLimiter';
import { securityService } from '../services/SecurityService';

export class BusinessLogicLayer {
  
  // ========================================
  // LOYALTY & XP BUSINESS RULES
  // ========================================

  static XP_RATES = {
    // Engagement
    trivia_correct: 10,
    trivia_streak_bonus: 5,
    livestream_watch: 25,
    social_post: 15,
    kudos_received: 10,
    
    // Participation
    event_attend: 100,
    volunteer_hour: 50,
    club_checkin: 20,
    
    // Contributions
    donation_per_dollar: 1, // 1 XP per $1 donated
    referral_success: 200,
    
    // Training (Athletes)
    training_session: 30,
    drill_completion: 20,
    coach_feedback: 15,
    
    // Achievements
    badge_earned: 100,
    tier_advanced: 500,
    milestone_reached: 250
  };

  static TIER_THRESHOLDS = {
    granite_rookie: { min: 0, max: 499, name: 'Granite Rookie' },
    sheet_star: { min: 500, max: 1499, name: 'Sheet Star' },
    house_hero: { min: 1500, max: 4999, name: 'House Hero' },
    button_boss: { min: 5000, max: 9999, name: 'Button Boss' },
    hack_master: { min: 10000, max: 24999, name: 'Hack Master' },
    granite_legacy: { min: 25000, max: Infinity, name: 'Granite Legacy' }
  };

  static calculateXP(actionType, metadata = {}) {
    let baseXP = this.XP_RATES[actionType] || 0;

    // Apply multipliers
    if (metadata.fan_pass_active) {
      baseXP *= 2; // Fan Pass 2x multiplier
    }

    if (metadata.event_multiplier) {
      baseXP *= metadata.event_multiplier; // Event-specific bonus
    }

    if (metadata.streak_count) {
      const streakBonus = Math.min(metadata.streak_count * this.XP_RATES.trivia_streak_bonus, 50);
      baseXP += streakBonus;
    }

    if (metadata.donation_amount) {
      baseXP = metadata.donation_amount * this.XP_RATES.donation_per_dollar;
    }

    return Math.floor(baseXP);
  }

  static calculateTier(totalXP) {
    for (const [tierId, config] of Object.entries(this.TIER_THRESHOLDS)) {
      if (totalXP >= config.min && totalXP <= config.max) {
        return {
          tier: tierId,
          tierName: config.name,
          progress: {
            current_xp: totalXP,
            tier_min: config.min,
            tier_max: config.max === Infinity ? config.min + 25000 : config.max,
            next_tier_xp: config.max === Infinity ? null : config.max + 1,
            progress_percent: config.max === Infinity 
              ? 100 
              : ((totalXP - config.min) / (config.max - config.min)) * 100
          }
        };
      }
    }

    return this.TIER_THRESHOLDS.granite_rookie;
  }

  static async awardXP(userId, actionType, description, metadata = {}) {
    const { LoyaltyProgram, PointTransaction } = await import('@/api/entities');

    // Validate inputs
    if (!userId || !actionType) {
      throw new Error('Invalid XP award parameters');
    }

    // Calculate XP
    const xpAmount = this.calculateXP(actionType, metadata);
    
    if (xpAmount <= 0) {
      console.warn('No XP to award for action:', actionType);
      return { success: false, xp: 0 };
    }

    // Rate limiting
    const allowed = await rateLimiter.checkMutationLimit(userId);
    if (!allowed) {
      throw new Error('Rate limit exceeded');
    }

    const idempotencyKey = `xp-${userId}-${actionType}-${metadata.referenceId || Date.now()}`;

    try {
      // Create transaction record
      await enhancedEntityService.create(
        PointTransaction,
        {
          user_id: userId,
          points_amount: xpAmount,
          transaction_type: actionType,
          description: securityService.sanitizeInput(description, { maxLength: 500 }),
          reference_id: metadata.referenceId,
          multiplier: metadata.fan_pass_active ? 2 : 1,
          source: 'app'
        },
        { idempotencyKey }
      );

      // Update loyalty program
      const loyaltyRecords = await enhancedEntityService.filter(
        LoyaltyProgram,
        { user_id: userId },
        '-created_date',
        1
      );

      let loyaltyRecord = loyaltyRecords[0];

      if (!loyaltyRecord) {
        // Create initial loyalty record
        loyaltyRecord = await enhancedEntityService.create(
          LoyaltyProgram,
          {
            user_id: userId,
            curl_points: xpAmount,
            tier: 'granite_rookie',
            tier_progress: { current_xp: xpAmount, next_tier_xp: 500 },
            badges: [],
            total_earned_points: xpAmount,
            total_redeemed_points: 0,
            fan_pass_status: 'none'
          },
          { idempotencyKey: `loyalty-init-${userId}` }
        );
      } else {
        // Update existing
        const newTotal = (loyaltyRecord.total_earned_points || 0) + xpAmount;
        const newPoints = (loyaltyRecord.curl_points || 0) + xpAmount;
        const tierInfo = this.calculateTier(newTotal);

        await enhancedEntityService.update(
          LoyaltyProgram,
          loyaltyRecord.id,
          {
            curl_points: newPoints,
            total_earned_points: newTotal,
            tier: tierInfo.tier,
            tier_progress: tierInfo.progress
          },
          { idempotencyKey: `${idempotencyKey}-update` }
        );
      }

      performanceMonitor.trackEvent('XPAwarded', {
        userId,
        actionType,
        xpAmount,
        metadata
      });

      return { success: true, xp: xpAmount };
    } catch (error) {
      console.error('Failed to award XP:', error);
      performanceMonitor.trackError(error, { context: 'awardXP', userId, actionType });
      throw error;
    }
  }

  // ========================================
  // CLUB BUSINESS RULES
  // ========================================

  static async affiliateUserToClub(userId, clubId) {
    const { User, Club } = await import('@/api/entities');

    // Validate
    if (!userId || !clubId) {
      throw new Error('Invalid affiliation parameters');
    }

    const idempotencyKey = `affiliate-${userId}-${clubId}`;

    try {
      // Get club details
      const clubs = await enhancedEntityService.filter(Club, { id: clubId }, '-created_date', 1);
      const club = clubs[0];

      if (!club) {
        throw new Error('Club not found');
      }

      // Update user
      await enhancedEntityService.update(
        User,
        userId,
        {
          home_club_id: clubId,
          home_club_name: club.name,
          ma_region: club.ma_region
        },
        { idempotencyKey }
      );

      // Award XP for affiliation
      await this.awardXP(
        userId,
        'club_checkin',
        `Affiliated with ${club.name}`,
        { referenceId: clubId }
      );

      performanceMonitor.trackEvent('ClubAffiliation', {
        userId,
        clubId,
        clubName: club.name
      });

      return { success: true, club };
    } catch (error) {
      console.error('Club affiliation failed:', error);
      throw error;
    }
  }

  // ========================================
  // PAYMENT BUSINESS RULES
  // ========================================

  static async processPayment(userId, amount, productId, metadata = {}) {
    // Validate amount
    if (!securityService.validateAmount(amount)) {
      throw new Error('Invalid payment amount');
    }

    // Rate limiting
    const allowed = await rateLimiter.checkLimit(userId, 'mutations', 1);
    if (!allowed) {
      throw new Error('Too many payment attempts');
    }

    const idempotencyKey = `payment-${userId}-${productId}-${Date.now()}`;

    try {
      const { Purchase } = await import('@/api/entities');

      // Create purchase record
      const purchase = await enhancedEntityService.create(
        Purchase,
        {
          user_id: userId,
          product_id: productId,
          product_name: metadata.productName,
          product_type: metadata.productType,
          amount: amount * 100, // Convert to cents
          currency: 'CAD',
          status: 'pending',
          payment_method: metadata.paymentMethod,
          metadata: securityService.sanitizeInput(JSON.stringify(metadata))
        },
        { idempotencyKey }
      );

      performanceMonitor.trackEvent('PaymentInitiated', {
        userId,
        productId,
        amount
      });

      return { success: true, purchase };
    } catch (error) {
      console.error('Payment processing failed:', error);
      performanceMonitor.trackError(error, { context: 'processPayment', userId });
      throw error;
    }
  }

  // ========================================
  // VALIDATION RULES
  // ========================================

  static validateUserProfile(profileData) {
    const errors = {};

    if (!profileData.full_name || profileData.full_name.trim().length < 2) {
      errors.full_name = 'Full name must be at least 2 characters';
    }

    if (profileData.phone && !securityService.validatePhone(profileData.phone)) {
      errors.phone = 'Invalid phone number format';
    }

    if (profileData.email && !securityService.validateEmail(profileData.email)) {
      errors.email = 'Invalid email format';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static validateClubData(clubData) {
    const errors = {};

    if (!clubData.name || clubData.name.trim().length < 3) {
      errors.name = 'Club name must be at least 3 characters';
    }

    if (!clubData.location?.city) {
      errors.city = 'City is required';
    }

    if (!clubData.location?.province) {
      errors.province = 'Province is required';
    }

    if (!clubData.ma_region) {
      errors.ma_region = 'MA Region is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // ========================================
  // AUTHORIZATION RULES
  // ========================================

  static canEditClub(user, clubId) {
    if (!user) return false;
    
    // Admins can edit any club
    if (user.role === 'admin') return true;
    
    // Club presidents can edit their own club
    if (user.external_access_role === 'club_president' && user.home_club_id === clubId) {
      return true;
    }

    // Staff can edit clubs
    if (['staff', 'executive', 'governance'].includes(user.user_type)) {
      return true;
    }

    return false;
  }

  static canViewSensitiveData(user, dataType) {
    if (!user) return false;
    
    const sensitiveDataRoles = {
      financial: ['admin', 'executive', 'staff'],
      personal_info: ['admin', 'hr', 'executive'],
      safe_sport_cases: ['admin', 'executive', 'governance'],
      audit_logs: ['admin', 'devops']
    };

    const allowedRoles = sensitiveDataRoles[dataType] || [];
    
    return user.role === 'admin' || allowedRoles.includes(user.user_type);
  }

  // ========================================
  // CALCULATIONS
  // ========================================

  static calculateClubHealth(clubMetrics) {
    if (!clubMetrics) return { score: 0, status: 'unknown' };

    let score = 0;
    const weights = {
      membership_growth: 0.3,
      financial_health: 0.25,
      engagement: 0.2,
      compliance: 0.15,
      programs: 0.1
    };

    // Membership score (0-100)
    const membershipScore = clubMetrics.membership_stats?.new_members > 0 ? 80 : 50;
    score += membershipScore * weights.membership_growth;

    // Financial score
    const financialScore = clubMetrics.financial_health?.revenue > clubMetrics.financial_health?.expenses ? 90 : 60;
    score += financialScore * weights.financial_health;

    // Engagement score
    const engagementScore = (clubMetrics.engagement_metrics?.volunteer_hours || 0) > 100 ? 85 : 65;
    score += engagementScore * weights.engagement;

    // Compliance score
    const complianceScore = clubMetrics.compliance_status?.safe_sport_current > 0 ? 95 : 40;
    score += complianceScore * weights.compliance;

    // Programs score
    const programScore = (clubMetrics.engagement_metrics?.events_hosted || 0) > 5 ? 80 : 60;
    score += programScore * weights.programs;

    const finalScore = Math.round(score);

    return {
      score: finalScore,
      status: finalScore >= 80 ? 'excellent' : 
              finalScore >= 60 ? 'good' : 
              finalScore >= 40 ? 'fair' : 'at_risk',
      breakdown: {
        membership: Math.round(membershipScore),
        financial: Math.round(financialScore),
        engagement: Math.round(engagementScore),
        compliance: Math.round(complianceScore),
        programs: Math.round(programScore)
      }
    };
  }

  static calculateEventROI(eventData, eventCosts, eventRevenue) {
    if (!eventCosts || eventCosts === 0) return { roi: 0, status: 'unknown' };

    const totalRevenue = eventRevenue || 0;
    const totalCosts = eventCosts || 0;
    const netProfit = totalRevenue - totalCosts;
    const roi = (netProfit / totalCosts) * 100;

    return {
      roi: Math.round(roi * 10) / 10,
      netProfit,
      totalRevenue,
      totalCosts,
      status: roi > 20 ? 'excellent' : 
              roi > 0 ? 'profitable' : 
              roi > -20 ? 'break_even' : 'loss'
    };
  }

  static calculateSponsorshipValue(contract, deliverables) {
    if (!contract || !deliverables) return 0;

    const baseValue = contract.contract_value || 0;
    const completedDeliverables = deliverables.filter(d => d.status === 'Completed').length;
    const totalDeliverables = deliverables.length;

    const completionRate = totalDeliverables > 0 ? completedDeliverables / totalDeliverables : 0;
    const deliveredValue = baseValue * completionRate;

    return {
      contractValue: baseValue,
      deliveredValue: Math.round(deliveredValue),
      completionRate: Math.round(completionRate * 100),
      remainingValue: baseValue - deliveredValue,
      status: completionRate >= 0.9 ? 'on_track' : 
              completionRate >= 0.7 ? 'needs_attention' : 'at_risk'
    };
  }

  // ========================================
  // WORKFLOW RULES
  // ========================================

  static async processFormSubmission(formData, workflowConfig) {
    // Route to appropriate department/person based on form type
    const routingRules = {
      sponsorship: { department: 'sponsorship', priority: 'high' },
      club_support: { department: 'clubs', priority: 'medium' },
      safe_sport: { department: 'safe_sport', priority: 'critical' },
      general: { department: 'operations', priority: 'low' }
    };

    const category = formData.category || 'general';
    const routing = routingRules[category] || routingRules.general;

    return {
      assigned_department: routing.department,
      priority: routing.priority,
      requires_approval: ['sponsorship', 'safe_sport'].includes(category),
      sla_hours: routing.priority === 'critical' ? 4 : 
                 routing.priority === 'high' ? 24 : 
                 routing.priority === 'medium' ? 72 : 168
    };
  }

  static shouldEscalate(incident, currentStatus, timeElapsed) {
    // Escalation rules
    const escalationRules = {
      critical: 4 * 3600000, // 4 hours
      high: 24 * 3600000, // 24 hours
      medium: 72 * 3600000, // 72 hours
      low: 168 * 3600000 // 1 week
    };

    const threshold = escalationRules[incident.priority] || escalationRules.low;

    return timeElapsed > threshold && currentStatus !== 'resolved';
  }

  // ========================================
  // ANALYTICS & INSIGHTS
  // ========================================

  static calculateEngagementScore(userData, loyaltyData, activityData) {
    let score = 0;

    // Recency (30%)
    const lastActivity = activityData?.lastActivityDate;
    if (lastActivity) {
      const daysSinceActivity = (Date.now() - new Date(lastActivity)) / (1000 * 60 * 60 * 24);
      const recencyScore = Math.max(0, 100 - (daysSinceActivity * 5));
      score += recencyScore * 0.3;
    }

    // Frequency (30%)
    const activitiesLast30Days = activityData?.count30Days || 0;
    const frequencyScore = Math.min(100, activitiesLast30Days * 10);
    score += frequencyScore * 0.3;

    // XP Growth (20%)
    const xpGrowth = loyaltyData?.total_earned_points || 0;
    const xpScore = Math.min(100, (xpGrowth / 1000) * 100);
    score += xpScore * 0.2;

    // Social Connections (20%)
    const connections = userData?.social_connections || 0;
    const socialScore = Math.min(100, connections * 5);
    score += socialScore * 0.2;

    return {
      overall: Math.round(score),
      breakdown: {
        recency: Math.round(score * 0.3),
        frequency: Math.round(score * 0.3),
        growth: Math.round(score * 0.2),
        social: Math.round(score * 0.2)
      },
      status: score >= 80 ? 'highly_engaged' :
              score >= 60 ? 'engaged' :
              score >= 40 ? 'at_risk' : 'inactive'
    };
  }

  static predictChurnRisk(engagementScore, clubMetrics, userHistory) {
    let riskScore = 0;

    // Low engagement is high risk
    if (engagementScore.overall < 40) riskScore += 40;
    else if (engagementScore.overall < 60) riskScore += 20;

    // Declining club health
    if (clubMetrics?.status === 'at_risk') riskScore += 30;

    // No recent activity
    const daysSinceActivity = userHistory?.daysSinceLastActivity || 0;
    if (daysSinceActivity > 60) riskScore += 30;

    return {
      riskScore: Math.min(100, riskScore),
      riskLevel: riskScore > 70 ? 'high' : 
                 riskScore > 40 ? 'medium' : 'low',
      recommendedActions: this.getChurnPreventionActions(riskScore)
    };
  }

  static getChurnPreventionActions(riskScore) {
    if (riskScore > 70) {
      return [
        'Send personalized re-engagement email',
        'Offer exclusive reward or discount',
        'Schedule check-in call',
        'Invite to upcoming event'
      ];
    }
    if (riskScore > 40) {
      return [
        'Send activity reminder',
        'Highlight new features',
        'Suggest relevant content'
      ];
    }
    return [];
  }
}

export default BusinessLogicLayer;