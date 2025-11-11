
/**
 * CurlingOS Progressive XP Engine - Scalable XP with streaks, milestones, and tier multipliers
 */

import { XPConfiguration } from '@/api/entities/XPConfiguration';
import { UserStreak } from '@/api/entities';
import { UserMilestone } from '@/api/entities';
import { PointTransaction } from '@/api/entities';
import { LoyaltyProgram } from '@/api/entities';
import { User } from '@/api/entities';
import { XPEngine } from './XPEngine';

export class ProgressiveXPEngine extends XPEngine {
  static DEFAULT_CONFIG = {
    mode: 'progressive',
    base_xp_values: {
      trivia_correct: 1,
      livestream_viewed: 2,
      profile_completed: 5,
      join_conversation: 3,
      patch_scan: 2,
      volunteer_checkin: 3,
      drill_logged: 2,
      mission_completed: 5
    },
    streak_bonuses: {
      daily_streak_bonus: 1,
      max_streak_bonus: 5,
      streak_applicable_actions: ['trivia', 'patch_scan', 'livestream', 'conversation']
    },
    milestone_bonuses: {
      trivia_milestone: 15,
      patch_milestone: 20,
      volunteer_milestone: 25,
      drill_milestone: 15
    },
    tier_multipliers: {
      granite_rookie: 1.0,
      sheet_star: 1.25,
      house_hero: 1.5,
      button_boss: 1.75,
      hack_master: 2.0,
      granite_legacy: 2.5
    }
  };

  static async getXPConfiguration() {
    try {
      const configs = await XPConfiguration.filter({ is_active: true });
      return configs.length > 0 ? configs[0] : this.DEFAULT_CONFIG;
    } catch (error) {
      console.warn('Failed to load XP configuration, using defaults:', error);
      return this.DEFAULT_CONFIG;
    }
  }

  static async awardProgressiveXP(userId, action, description, context = {}) {
    try {
      const config = await this.getXPConfiguration();
      
      if (config.mode === 'static') {
        // Fall back to original XP engine
        return await super.awardXP(userId, config.base_xp_values[action] || 0, action, context);
      }

      let breakdown = [];
      let totalPoints = 0;

      // 2. Calculate Base XP
      const baseXP = config.base_xp_values[action] || 0;
      totalPoints += baseXP;
      breakdown.push({ reason: 'Base Action', points: baseXP });

      // 3. Apply Tier Multiplier
      const userTier = await this.getUserTier(userId);
      const tierMultiplier = config.tier_multipliers[userTier] || 1.0;
      
      if (tierMultiplier > 1.0) {
        const pointsBeforeTier = totalPoints;
        totalPoints = Math.floor(totalPoints * tierMultiplier);
        const tierBonus = totalPoints - pointsBeforeTier;
        breakdown.push({ reason: `Tier Multiplier (${userTier})`, points: tierBonus, multiplier: tierMultiplier });
      }

      // 4. Apply Streak Bonus
      const streakBonus = await this.calculateStreakBonus(userId, action, config);
      if (streakBonus > 0) {
        totalPoints += streakBonus;
        breakdown.push({ reason: 'Streak Bonus', points: streakBonus });
      }

      // 5. Apply Milestone Bonus
      const milestoneBonus = await this.checkMilestoneBonus(userId, action, config);
      if (milestoneBonus > 0) {
        totalPoints += milestoneBonus;
        breakdown.push({ reason: 'Milestone Bonus', points: milestoneBonus });
      }
      
      // 6. Apply Contextual Bonuses (e.g., Patch Party)
      if (action === 'patch_scan' && context.event?.is_patch_party) {
          const partyBonus = 50; // Example bonus for a patch party
          totalPoints += partyBonus;
          breakdown.push({ reason: 'Patch Party Bonus', points: partyBonus });
      }

      // 7. Final Calculation
      const awarded = Math.round(totalPoints);

      // Create detailed transaction with breakdown
      const transaction = await PointTransaction.create({
        user_id: userId,
        points_amount: awarded,
        transaction_type: action,
        description: description,
        metadata: {
          ...context,
          breakdown: breakdown,
          finalXP: awarded,
          tierAtTimeOfXP: userTier,
          actionType: action,
          xpMode: 'progressive'
        },
        source: 'progressive_engine'
      });

      // Update user's loyalty data
      await this.updateUserXPTotals(userId, awarded);

      return {
        awarded: awarded,
        breakdown: breakdown,
        transaction: transaction
      };

    } catch (error) {
      console.error('Progressive XP award failed:', error);
      throw error;
    }
  }

  static async awardShotXP(userId, executionResult, coachBonus = false, shotMetadata = {}) {
    const xpLogic = {
      made: 2,
      partial: 1,
      miss: 0,
      coach_bonus: 2,
      max_per_shot: 4
    };

    let baseXP = xpLogic[executionResult] || 0;
    if (coachBonus) {
      baseXP += xpLogic.coach_bonus;
    }

    const finalXP = Math.min(baseXP, xpLogic.max_per_shot);

    if (finalXP <= 0) {
      return { awarded: 0, transaction: null };
    }

    try {
      const transaction = await PointTransaction.create({
        user_id: userId,
        points_amount: finalXP,
        transaction_type: 'shot_logged',
        description: `Shot performance: ${executionResult}${coachBonus ? ' (Bonus)' : ''}`,
        metadata: {
          ...shotMetadata,
          baseXP: finalXP,
          modifiers: [],
          finalXP: finalXP,
          xpMode: 'shot_tracker'
        },
        source: 'shot_tracker'
      });
      
      await this.updateUserXPTotals(userId, finalXP);

      return {
        awarded: finalXP,
        transaction: transaction
      };
    } catch (error) {
      console.error('Shot XP award failed:', error);
      throw error;
    }
  }

  static async calculateStreakBonus(userId, action, config) {
    if (!config.streak_bonuses.streak_applicable_actions.includes(action)) {
      return 0;
    }

    try {
      // Get or create streak record
      let streaks = await UserStreak.filter({ user_id: userId, action_type: action });
      let streak = streaks.length > 0 ? streaks[0] : null;

      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      if (!streak) {
        // Create new streak
        streak = await UserStreak.create({
          user_id: userId,
          action_type: action,
          current_streak: 1,
          longest_streak: 1,
          last_action_date: today,
          streak_active: true
        });
        return 0; // No bonus for first action
      }

      // Check if continuing streak
      if (streak.last_action_date === yesterday) {
        // Continue streak
        const newStreak = streak.current_streak + 1;
        const longestStreak = Math.max(newStreak, streak.longest_streak);
        
        await UserStreak.update(streak.id, {
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_action_date: today,
          streak_active: true
        });

        // Calculate bonus (capped at max)
        const bonus = Math.min(newStreak * config.streak_bonuses.daily_streak_bonus, config.streak_bonuses.max_streak_bonus);
        return bonus;
      } else if (streak.last_action_date === today) {
        // Same day, no additional streak bonus
        return Math.min(streak.current_streak * config.streak_bonuses.daily_streak_bonus, config.streak_bonuses.max_streak_bonus);
      } else {
        // Streak broken, reset
        await UserStreak.update(streak.id, {
          current_streak: 1,
          last_action_date: today,
          streak_active: true
        });
        return 0;
      }
    } catch (error) {
      console.error('Streak calculation failed:', error);
      return 0;
    }
  }

  static async checkMilestoneBonus(userId, action, config) {
    try {
      const milestoneMap = {
        'trivia': { type: 'trivia_10', threshold: 10, bonus: config.milestone_bonuses.trivia_milestone },
        'patch_scan': { type: 'patch_5', threshold: 5, bonus: config.milestone_bonuses.patch_milestone },
        'volunteer_checkin': { type: 'volunteer_3', threshold: 3, bonus: config.milestone_bonuses.volunteer_milestone },
        'drill_logged': { type: 'drill_3', threshold: 3, bonus: config.milestone_bonuses.drill_milestone }
      };

      const milestoneConfig = milestoneMap[action];
      if (!milestoneConfig) return 0;

      // Get or create milestone record
      let milestones = await UserMilestone.filter({ 
        user_id: userId, 
        milestone_type: milestoneConfig.type 
      });
      let milestone = milestones.length > 0 ? milestones[0] : null;

      if (!milestone) {
        milestone = await UserMilestone.create({
          user_id: userId,
          milestone_type: milestoneConfig.type,
          milestone_count: 0,
          total_actions: 1
        });
        return 0;
      }

      // Increment action count
      const newTotal = milestone.total_actions + 1;
      
      // Check if milestone reached
      if (newTotal % milestoneConfig.threshold === 0) {
        const newMilestoneCount = milestone.milestone_count + 1;
        
        await UserMilestone.update(milestone.id, {
          milestone_count: newMilestoneCount,
          total_actions: newTotal,
          last_milestone_date: new Date().toISOString()
        });

        return milestoneConfig.bonus;
      } else {
        // Just update action count
        await UserMilestone.update(milestone.id, {
          total_actions: newTotal
        });
        return 0;
      }
    } catch (error) {
      console.error('Milestone calculation failed:', error);
      return 0;
    }
  }

  static async getUserTier(userId) {
    try {
      const loyaltyPrograms = await LoyaltyProgram.filter({ user_id: userId });
      return loyaltyPrograms.length > 0 ? loyaltyPrograms[0].tier : 'granite_rookie';
    } catch (error) {
      console.error('Failed to get user tier:', error);
      return 'granite_rookie';
    }
  }

  static async getUserStreaks(userId) {
    try {
      return await UserStreak.filter({ user_id: userId, streak_active: true });
    } catch (error) {
      console.error('Failed to get user streaks:', error);
      return [];
    }
  }

  static async getUserMilestones(userId) {
    try {
      return await UserMilestone.filter({ user_id: userId });
    } catch (error) {
      console.error('Failed to get user milestones:', error);
      return [];
    }
  }

  static async updateXPConfiguration(configData) {
    try {
      const configs = await XPConfiguration.filter({ is_active: true });
      
      if (configs.length > 0) {
        return await XPConfiguration.update(configs[0].id, {
          ...configData,
          last_updated: new Date().toISOString()
        });
      } else {
        return await XPConfiguration.create({
          setting_key: 'main_xp_config',
          ...configData,
          is_active: true,
          last_updated: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Failed to update XP configuration:', error);
      throw error;
    }
  }
}
