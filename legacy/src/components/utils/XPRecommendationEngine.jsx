import { InvokeLLM } from '@/api/integrations';

export class XPRecommendationEngine {
  static async getRecommendations(user, loyaltyData) {
    // ✅ SAFE FALLBACK: Return fallback immediately if no user
    if (!user || !user.id) {
      return {
        missions: this.getFallbackMissions(),
        prediction: this.getFallbackPrediction()
      };
    }

    try {
      // Safe data extraction with fallbacks
      const safeUser = user || {};
      const safeLoyalty = loyaltyData || {};
      
      const currentTier = safeLoyalty.tier || 'granite_rookie';
      const currentPoints = safeLoyalty.curl_points || 0;
      const userType = safeUser.user_type || 'fan';
      const hasClub = Boolean(safeUser.home_club_id);
      const profileComplete = Boolean(safeUser.full_name && safeUser.profile_image_url);

      // Customize missions based on user state
      let customMissions = [...this.getFallbackMissions()];
      
      if (!profileComplete) {
        customMissions.unshift({
          id: 'complete_profile_priority',
          title: 'Complete Your Profile',
          description: 'Add your photo and personal information to unlock more features',
          xp: 50,
          actionUrl: 'Profile'
        });
      }

      if (!hasClub) {
        customMissions.push({
          id: 'find_club',
          title: 'Find Your Home Club',
          description: 'Connect with a local curling club to join leaderboards',
          xp: 75,
          actionUrl: 'Clubs'
        });
      }

      if (userType === 'fan' || userType === 'curler') {
        customMissions.push({
          id: 'support_ftloc',
          title: 'Support Future Champions',
          description: 'Make a donation to For The Love of Curling',
          xp: 100,
          actionUrl: 'FTLOCHub'
        });
      }

      // Customize prediction based on current progress
      let customPrediction = { ...this.getFallbackPrediction() };
      
      if (currentPoints > 0) {
        const tierThresholds = {
          granite_rookie: 500,
          sheet_star: 2000,
          house_hero: 5000,
          button_boss: 10000,
          hack_master: 25000
        };
        
        const nextThreshold = tierThresholds[currentTier];
        if (nextThreshold) {
          const remaining = nextThreshold - currentPoints;
          const weeksEstimate = Math.ceil(remaining / 50); // Assuming ~50 XP per week
          customPrediction.timeframe = `${weeksEstimate} weeks at current pace`;
        }
      }

      return {
        missions: customMissions.slice(0, 4), // Limit to 4 missions
        prediction: customPrediction
      };

    } catch (error) {
      console.error('Error generating XP recommendations:', error);
      
      // Return safe fallback data
      return {
        missions: this.getFallbackMissions(),
        prediction: this.getFallbackPrediction()
      };
    }
  }

  static getFallbackMissions() {
    return [
      {
        id: 'complete_profile',
        title: 'Complete Your Profile',
        description: 'Add your photo, club affiliation, and preferences',
        xp: 25,
        actionUrl: 'Profile'
      },
      {
        id: 'join_community',
        title: 'Join the Conversation',
        description: 'Participate in community discussions and share your curling story',
        xp: 15,
        actionUrl: 'CommunityHub'
      },
      {
        id: 'watch_stream',
        title: 'Watch Live Curling',
        description: 'Tune in to championship events and earn viewing points',
        xp: 10,
        actionUrl: 'Streaming'
      }
    ];
  }

  static getFallbackPrediction() {
    return {
      timeframe: 'Keep participating to advance!',
      message: 'Every action brings you closer to your next tier.',
      tips: [
        'Volunteer at local events for bonus XP',
        'Complete knowledge articles for steady progress',
        'Engage with the community regularly'
      ]
    };
  }

  static formatTierName(tier) {
    if (!tier || typeof tier !== 'string') return 'Granite Rookie';
    return tier.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  static formatUserType(userType) {
    if (!userType || typeof userType !== 'string') return 'Member';
    return userType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}