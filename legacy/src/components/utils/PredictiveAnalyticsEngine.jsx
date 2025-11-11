import { User } from '@/api/entities';

/**
 * A simulated Predictive Analytics Engine.
 * In a real application, these functions would make API calls to a data science backend
 * that runs actual machine learning models. Here, we simulate the logic based on available data.
 */
export const PredictiveAnalyticsEngine = {
  
  /**
   * Simulates calculating a user's churn risk.
   * @param {object} user - The user object.
   * @param {object} loyaltyData - The user's loyalty data.
   * @returns {object} An object with a risk level and score.
   */
  async calculateChurnRisk(user, loyaltyData) {
    if (!user || !loyaltyData) return { score: 0, level: 'low', reason: 'Insufficient data.' };

    let riskScore = 0;
    let reasons = [];

    // Factor 1: Login activity
    const lastLogin = user.last_login ? new Date(user.last_login) : new Date(0);
    const daysSinceLogin = (new Date() - lastLogin) / (1000 * 60 * 60 * 24);
    if (daysSinceLogin > 30) {
        riskScore += 40;
        reasons.push("Inactive for over 30 days");
    } else if (daysSinceLogin > 14) {
        riskScore += 20;
        reasons.push("Inactive for over 14 days");
    }

    // Factor 2: XP Engagement
    if (loyaltyData.total_earned_points < 100) {
        riskScore += 25;
        reasons.push("Low XP engagement");
    }
    
    // Factor 3: Tier
    if (loyaltyData.tier === 'granite_rookie') {
        riskScore += 15;
    }

    // Factor 4: Fan Pass (reduces risk)
    if (loyaltyData.fan_pass_status !== 'none') {
        riskScore -= 20;
    }
    
    riskScore = Math.max(0, Math.min(100, riskScore)); // Clamp score between 0 and 100

    let level;
    if (riskScore > 70) level = 'high';
    else if (riskScore > 40) level = 'medium';
    else level = 'low';

    return {
      score: riskScore,
      level,
      reason: reasons.join(', ') || 'Low risk'
    };
  },

  /**
   * Simulates assessing club health based on various metrics.
   * @param {object} club - The club entity record.
   * @param {object} metrics - Aggregated metrics for the club.
   * @returns {object} An object with a health score and status.
   */
  async getClubHealthScore(club, metrics = {}) {
    if (!club) return { score: 0, status: 'unknown', reason: 'No club data.' };

    let score = 50; // Start at a baseline
    let reasons = [];

    // Simulate metrics if not provided
    const simMetrics = {
        membership_growth: metrics.membership_growth ?? (Math.random() - 0.4) * 10, // -4% to 6%
        youth_percentage: metrics.youth_percentage ?? club.youth_member_percentage ?? Math.random() * 25, // 0-25%
        survey_completed: metrics.survey_completed ?? club.engagement_metrics?.survey_completed ?? (Math.random() > 0.5),
    };
    
    // Membership growth
    if (simMetrics.membership_growth > 5) {
        score += 20;
    } else if (simMetrics.membership_growth < -2) {
        score -= 25;
        reasons.push("Declining membership");
    }

    // Youth engagement
    if (simMetrics.youth_percentage > 20) {
        score += 15;
    } else if (simMetrics.youth_percentage < 5) {
        score -= 10;
        reasons.push("Low youth percentage");
    }

    // Admin engagement
    if (simMetrics.survey_completed) {
        score += 15;
    } else {
        score -= 15;
        reasons.push("Annual survey incomplete");
    }
    
    score = Math.max(0, Math.min(100, score));

    let status;
    if (score > 75) status = 'healthy';
    else if (score > 45) status = 'stable';
    else if (score > 20) status = 'at_risk';
    else status = 'critical';

    return {
      score: Math.round(score),
      status,
      reason: reasons.join(', ') || 'Stable performance'
    };
  }
};