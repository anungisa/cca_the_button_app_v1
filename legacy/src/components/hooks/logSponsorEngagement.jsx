import { PointTransaction, SponsorCampaign } from '@/api/entities';

/**
 * Log sponsor engagement and update campaign metrics
 * @param {string} campaignId - The sponsor campaign ID
 * @param {string} userId - The user ID
 * @param {'impression'|'click'|'completion'} actionType - Type of engagement
 * @param {Object} metadata - Additional tracking data
 */
export const logSponsorEngagement = async (campaignId, userId, actionType, metadata = {}) => {
  try {
    // Get the campaign details
    const campaign = await SponsorCampaign.get(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    // Update campaign metrics
    const updateData = {};
    if (actionType === 'impression') {
      updateData.impressions = (campaign.impressions || 0) + 1;
    } else if (actionType === 'completion') {
      updateData.completions = (campaign.completions || 0) + 1;
    }

    if (Object.keys(updateData).length > 0) {
      await SponsorCampaign.update(campaignId, updateData);
    }

    // For completions, also create a point transaction record
    if (actionType === 'completion') {
      await PointTransaction.create({
        user_id: userId,
        points_amount: campaign.xp_reward || 0,
        transaction_type: 'sponsor_quest',
        description: `Completed sponsor quest: ${campaign.name}`,
        reference_id: campaignId,
        source: 'sponsor_campaign',
        metadata: {
          sponsor_name: campaign.sponsor_name,
          quest_type: campaign.quest_type,
          ...metadata
        }
      });
    }

    // Log detailed engagement for analytics
    const engagementLog = {
      campaign_id: campaignId,
      user_id: userId,
      action_type: actionType,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      page_url: window.location.href,
      ...metadata
    };

    // In production, this would be sent to an analytics service
    console.log('Sponsor Engagement Logged:', engagementLog);

    return {
      success: true,
      campaign_id: campaignId,
      action_type: actionType,
      xp_awarded: actionType === 'completion' ? campaign.xp_reward : 0
    };

  } catch (error) {
    console.error('Error logging sponsor engagement:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get sponsor engagement analytics for a user
 * @param {string} userId - The user ID
 * @returns {Object} User's sponsor engagement stats
 */
export const getUserSponsorStats = async (userId) => {
  try {
    const transactions = await PointTransaction.filter(
      { user_id: userId, transaction_type: 'sponsor_quest' },
      '-created_date',
      100
    );

    const stats = {
      total_quests_completed: transactions.length,
      total_xp_from_sponsors: transactions.reduce((sum, t) => sum + t.points_amount, 0),
      favorite_sponsor: null,
      quest_types_completed: {},
      monthly_activity: {}
    };

    // Analyze quest types
    transactions.forEach(transaction => {
      const questType = transaction.metadata?.quest_type || 'unknown';
      stats.quest_types_completed[questType] = (stats.quest_types_completed[questType] || 0) + 1;
      
      // Monthly activity
      const month = transaction.created_date.substring(0, 7); // YYYY-MM
      stats.monthly_activity[month] = (stats.monthly_activity[month] || 0) + 1;
    });

    // Find favorite sponsor
    const sponsorCounts = {};
    transactions.forEach(transaction => {
      const sponsor = transaction.metadata?.sponsor_name || 'Unknown';
      sponsorCounts[sponsor] = (sponsorCounts[sponsor] || 0) + 1;
    });

    if (Object.keys(sponsorCounts).length > 0) {
      stats.favorite_sponsor = Object.entries(sponsorCounts)
        .sort(([,a], [,b]) => b - a)[0][0];
    }

    return stats;

  } catch (error) {
    console.error('Error getting user sponsor stats:', error);
    return null;
  }
};

export default logSponsorEngagement;