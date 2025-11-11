import { User } from '@/api/entities';
import { UserMilestone } from '@/api/entities';
import { UserStreak } from '@/api/entities';
import { XPChallenge } from '@/api/entities';
import { UserChallengeProgress } from '@/api/entities';
import WebSocketService from '../services/WebSocketService';

/**
 * Advanced XP and Gamification Engine
 * This extends the basic XP system with dynamic challenges, streaks, and social features
 */

export class AdvancedXPEngine {
  
  // Dynamic challenge generation based on user behavior
  static async generatePersonalizedChallenges(userId, userProfile, loyaltyData) {
    const challenges = [];
    
    // Analyze user's current engagement patterns
    const userType = userProfile.user_type || 'fan';
    const currentXP = loyaltyData?.tier_progress?.current_xp || 0;
    const tier = loyaltyData?.tier || 'granite_rookie';
    
    // Challenge 1: Based on user type
    if (userType === 'curler' && currentXP < 200) {
      challenges.push({
        id: `log_practice_${userId}`,
        title: 'Practice Makes Perfect',
        description: 'Log 3 practice sessions this week',
        xp_reward: 75,
        type: 'weekly',
        target_count: 3,
        current_progress: 0,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        icon: '🥌'
      });
    }
    
    // Challenge 2: Social engagement
    if (currentXP > 100) {
      challenges.push({
        id: `community_engage_${userId}`,
        title: 'Community Builder',
        description: 'Make 5 posts or comments in the community',
        xp_reward: 50,
        type: 'social',
        target_count: 5,
        current_progress: 0,
        expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        icon: '💬'
      });
    }
    
    // Challenge 3: Tier-specific
    if (tier === 'granite_rookie') {
      challenges.push({
        id: `first_milestone_${userId}`,
        title: 'Breaking the Ice',
        description: 'Earn your first 100 XP points',
        xp_reward: 25,
        type: 'milestone',
        target_count: 100,
        current_progress: currentXP,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        icon: '🎯'
      });
    }
    
    // Challenge 4: Seasonal/Event-based
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 9 || currentMonth <= 2) { // Oct-Feb (curling season)
      challenges.push({
        id: `season_special_${userId}`,
        title: 'Curling Season Champion',
        description: 'Complete 10 curling-related activities during the season',
        xp_reward: 200,
        type: 'seasonal',
        target_count: 10,
        current_progress: 0,
        expires_at: new Date(new Date().getFullYear(), 2, 31), // End of March
        icon: '🏆'
      });
    }
    
    return challenges;
  }
  
  // Streak management and bonuses
  static async updateUserStreak(userId, actionType) {
    try {
      const existingStreak = await UserStreak.filter({ 
        user_id: userId, 
        action_type: actionType 
      });
      
      const today = new Date().toISOString().split('T')[0];
      let streak = existingStreak[0];
      
      if (!streak) {
        // Create new streak
        streak = await UserStreak.create({
          user_id: userId,
          action_type: actionType,
          current_streak: 1,
          longest_streak: 1,
          last_action_date: today,
          streak_active: true
        });
      } else {
        const lastActionDate = new Date(streak.last_action_date);
        const todayDate = new Date(today);
        const daysDiff = Math.floor((todayDate - lastActionDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          // Continue streak
          const newStreak = streak.current_streak + 1;
          await UserStreak.update(streak.id, {
            current_streak: newStreak,
            longest_streak: Math.max(streak.longest_streak, newStreak),
            last_action_date: today
          });
          
          // Check for streak bonuses
          await this.checkStreakBonuses(userId, actionType, newStreak);
          
        } else if (daysDiff === 0) {
          // Same day - no change to streak
          return streak;
        } else {
          // Streak broken
          await UserStreak.update(streak.id, {
            current_streak: 1,
            last_action_date: today,
            streak_active: false
          });
        }
      }
      
      return streak;
    } catch (error) {
      console.error('Error updating user streak:', error);
      return null;
    }
  }
  
  static async checkStreakBonuses(userId, actionType, streakCount) {
    const bonusThresholds = {
      trivia: [3, 7, 14, 30],
      patch_scan: [2, 5, 10],
      livestream: [3, 7, 21],
      conversation: [5, 10, 25]
    };
    
    const thresholds = bonusThresholds[actionType] || [];
    
    if (thresholds.includes(streakCount)) {
      const bonusXP = streakCount * 5; // 5 XP per streak day
      
      // Award bonus XP (would integrate with main XP system)
      console.log(`Streak bonus! ${bonusXP} XP for ${streakCount}-day ${actionType} streak`);
      
      // Emit real-time notification
      WebSocketService.emit(`streak-bonus:${userId}`, {
        actionType,
        streakCount,
        bonusXP,
        message: `🔥 ${streakCount}-day ${actionType} streak! +${bonusXP} bonus XP!`
      });
    }
  }
  
  // Social XP features
  static async calculateSocialXPMultiplier(userId, activity) {
    try {
      // Base multiplier
      let multiplier = 1.0;
      
      // Check if user has active club affiliation
      const user = await User.get(userId);
      if (user.home_club_id) {
        multiplier += 0.1; // 10% bonus for club members
      }
      
      // Check for active challenges
      const activechallenges = await UserChallengeProgress.filter({
        user_id: userId,
        status: 'in_progress'
      });
      
      if (activechallenges.length > 0) {
        multiplier += 0.05 * activechallenges.length; // 5% per active challenge
      }
      
      // Time-based bonuses (weekend boost, etc.)
      const currentHour = new Date().getHours();
      if (currentHour >= 18 || currentHour <= 6) { // Evening/night bonus
        multiplier += 0.05;
      }
      
      return Math.min(multiplier, 2.0); // Cap at 2x multiplier
    } catch (error) {
      console.error('Error calculating social XP multiplier:', error);
      return 1.0;
    }
  }
  
  // Leaderboard and competition features
  static async generateClubLeaderboard(clubId, timeframe = 'monthly') {
    try {
      // This would integrate with the main XP system to get actual data
      // For now, we'll simulate the structure
      
      const mockLeaderboard = [
        { userId: '1', name: 'John Doe', xp: 1250, rank: 1, change: '+2' },
        { userId: '2', name: 'Jane Smith', xp: 1100, rank: 2, change: '0' },
        { userId: '3', name: 'Bob Johnson', xp: 950, rank: 3, change: '-1' },
        { userId: '4', name: 'Alice Brown', xp: 800, rank: 4, change: '+1' },
        { userId: '5', name: 'Charlie Wilson', xp: 750, rank: 5, change: '-2' }
      ];
      
      return {
        clubId,
        timeframe,
        lastUpdated: new Date().toISOString(),
        totalParticipants: mockLeaderboard.length,
        leaderboard: mockLeaderboard
      };
    } catch (error) {
      console.error('Error generating club leaderboard:', error);
      return null;
    }
  }
  
  // Achievement system
  static async checkForNewAchievements(userId, activity, context = {}) {
    const achievements = [];
    
    // Activity-based achievements
    if (activity === 'trivia_correct' && context.streak >= 10) {
      achievements.push({
        id: 'trivia_master',
        title: 'Trivia Master',
        description: 'Answered 10 trivia questions correctly in a row',
        icon: '🧠',
        xp_reward: 100,
        rarity: 'rare'
      });
    }
    
    if (activity === 'patch_scan' && context.total_patches >= 25) {
      achievements.push({
        id: 'patch_collector',
        title: 'Patch Collector',
        description: 'Collected 25 event patches',
        icon: '🏷️',
        xp_reward: 150,
        rarity: 'epic'
      });
    }
    
    if (activity === 'volunteer_hours' && context.total_hours >= 50) {
      achievements.push({
        id: 'community_champion',
        title: 'Community Champion',
        description: 'Volunteered for 50+ hours',
        icon: '🤝',
        xp_reward: 300,
        rarity: 'legendary'
      });
    }
    
    // Process achievements
    for (const achievement of achievements) {
      await this.awardAchievement(userId, achievement);
    }
    
    return achievements;
  }
  
  static async awardAchievement(userId, achievement) {
    try {
      // Create milestone record
      await UserMilestone.create({
        user_id: userId,
        milestone_type: achievement.id,
        milestone_count: 1,
        total_actions: 1,
        last_milestone_date: new Date().toISOString()
      });
      
      // Emit real-time notification
      WebSocketService.emit(`achievement-unlocked:${userId}`, {
        achievement,
        message: `🎉 Achievement Unlocked: ${achievement.title}!`
      });
      
      console.log(`Achievement awarded: ${achievement.title} to user ${userId}`);
    } catch (error) {
      console.error('Error awarding achievement:', error);
    }
  }
  
  // Recommendation engine for XP optimization
  static async generateXPRecommendations(userId, userProfile, loyaltyData) {
    const recommendations = [];
    
    const currentXP = loyaltyData?.tier_progress?.current_xp || 0;
    const nextTierXP = loyaltyData?.tier_progress?.next_tier_xp || 500;
    const xpNeeded = nextTierXP - currentXP;
    
    if (xpNeeded <= 100) {
      recommendations.push({
        type: 'urgent',
        title: 'Almost There!',
        description: `You're just ${xpNeeded} XP away from your next tier!`,
        actions: [
          'Complete daily trivia (+15 XP)',
          'Watch a livestream (+20 XP)',
          'Make a community post (+10 XP)'
        ],
        estimatedTime: '15 minutes'
      });
    }
    
    if (userProfile.user_type === 'curler' && !userProfile.home_club_id) {
      recommendations.push({
        type: 'growth',
        title: 'Join Your Local Club',
        description: 'Connect with your home club to unlock exclusive challenges and bonuses',
        actions: ['Browse nearby clubs', 'Set your home club'],
        estimatedTime: '5 minutes',
        xpReward: 50
      });
    }
    
    return recommendations;
  }
}

export default AdvancedXPEngine;