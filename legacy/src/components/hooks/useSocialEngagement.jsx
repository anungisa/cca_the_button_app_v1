import { useState, useEffect } from 'react';
import { useXP } from '../XPContext';

export const useSocialEngagement = () => {
  const { awardPoints, awardBadge } = useXP();
  const [socialActions, setSocialActions] = useState({
    follows: [],
    shares: [],
    posts: [],
    campaigns: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const trackSocialAction = async (actionType, platform, postId = null, campaignId = null) => {
    setIsLoading(true);
    try {
      let xpReward = 0;
      let badgeId = null;
      let description = '';

      switch (actionType) {
        case 'follow':
          xpReward = 25;
          description = `Followed Curling Canada on ${platform}`;
          badgeId = 'social_curler';
          break;
        case 'share':
          xpReward = 50;
          description = `Shared Curling Canada post from ${platform}`;
          badgeId = 'amplifier';
          break;
        case 'post':
          xpReward = 75;
          description = `Posted with official curling hashtag`;
          badgeId = 'curling_voice';
          break;
        case 'watch':
          xpReward = 35;
          description = `Watched Curling Canada video on ${platform}`;
          break;
        case 'campaign':
          xpReward = 150;
          description = `Participated in ${campaignId} campaign`;
          badgeId = 'community_builder';
          break;
        default:
          xpReward = 10;
          description = `Engaged with Curling Canada on ${platform}`;
      }

      // Award XP
      const success = await awardPoints(xpReward, 'bonus', description, postId);
      
      if (success && badgeId) {
        await awardBadge(badgeId, getBadgeName(badgeId), getBadgeDescription(badgeId));
      }

      // Update local state
      setSocialActions(prev => ({
        ...prev,
        [actionType + 's']: [...(prev[actionType + 's'] || []), {
          platform,
          postId,
          campaignId,
          timestamp: new Date().toISOString()
        }]
      }));

      return success;
    } catch (error) {
      console.error('Error tracking social action:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeName = (badgeId) => {
    const badges = {
      'social_curler': 'Social Curler',
      'amplifier': 'Amplifier',
      'curling_voice': 'Curling Voice',
      'community_builder': 'Community Builder',
      'fan_tier': 'Fan Tier Unlocked'
    };
    return badges[badgeId] || 'Social Badge';
  };

  const getBadgeDescription = (badgeId) => {
    const descriptions = {
      'social_curler': 'Started following Curling Canada on social media',
      'amplifier': 'Shared official Curling Canada content',
      'curling_voice': 'Posted with official curling hashtags',
      'community_builder': 'Participated in a social media campaign',
      'fan_tier': 'Watched multiple Curling Canada videos'
    };
    return descriptions[badgeId] || 'Engaged with Curling Canada social media';
  };

  const openSocialLink = (platform, url, actionType = 'follow') => {
    // Track the action
    trackSocialAction(actionType, platform);
    
    // Open the link
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const checkVideoWatchProgress = (platform, videoId) => {
    // This would typically integrate with YouTube API or similar
    // For now, we'll award points after a delay to simulate watching
    setTimeout(() => {
      trackSocialAction('watch', platform, videoId);
    }, 30000); // Award after 30 seconds of "watching"
  };

  return {
    socialActions,
    trackSocialAction,
    openSocialLink,
    checkVideoWatchProgress,
    isLoading
  };
};