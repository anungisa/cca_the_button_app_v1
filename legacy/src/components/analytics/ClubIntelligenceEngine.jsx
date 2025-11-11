import { Club } from '@/api/entities';
import { SurveySubmission } from '@/api/entities';

// Simple cache to avoid repeated API calls
const healthCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Rate limiting utilities
let requestQueue = [];
let isProcessingQueue = false;
const MAX_CONCURRENT_REQUESTS = 2;
const REQUEST_DELAY = 1000; // 1 second between requests

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const processRequestQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const batch = requestQueue.splice(0, MAX_CONCURRENT_REQUESTS);
    
    // Process batch concurrently
    await Promise.all(batch.map(request => request()));
    
    // Wait before processing next batch
    if (requestQueue.length > 0) {
      await delay(REQUEST_DELAY);
    }
  }
  
  isProcessingQueue = false;
};

export class ClubIntelligenceEngine {

  /**
   * High-level function to get the health analysis for a specific club with caching and rate limiting.
   */
  static async getOverallClubHealth(clubId) {
    // Defensive check - if no clubId is provided, return a safe default
    if (!clubId || clubId === 'undefined' || clubId === undefined) {
      console.warn('getOverallClubHealth called with invalid clubId:', clubId);
      return {
        overall_score: 0,
        health_factors: {
          membership_growth: 0,
          financial_stability: 0,
          engagement_level: 0,
          compliance_status: 0
        },
        recommendations: ['Please select a valid club to view health analysis.'],
        risk_flags: ['No Club Selected'],
        error: 'Invalid club ID provided'
      };
    }

    // Check cache first
    const cacheKey = `club_health_${clubId}`;
    const cached = healthCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    // Return cached data or default while queuing fresh request
    const defaultResult = {
      overall_score: 75,
      health_factors: {
        membership_growth: 75,
        financial_stability: 75,
        engagement_level: 75,
        compliance_status: 75
      },
      recommendations: ['Health analysis in progress...'],
      risk_flags: [],
      loading: true
    };

    // Queue the API request
    const requestPromise = new Promise((resolve) => {
      requestQueue.push(async () => {
        try {
          const clubData = await Club.get(clubId);
          if (!clubData) {
            throw new Error('Club data not found');
          }

          // Limit survey data fetching to avoid rate limits
          let surveyData = null;
          try {
            const surveySubmissions = await SurveySubmission.filter({ club_id: clubId }, '-year', 1);
            surveyData = surveySubmissions.length > 0 ? surveySubmissions[0] : null;
          } catch (surveyError) {
            console.warn(`Survey data unavailable for club ${clubId}:`, surveyError);
            // Continue without survey data
          }

          const result = this.analyzeClubHealth(clubData, surveyData);
          
          // Cache the result
          healthCache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
          });
          
          resolve(result);
        } catch (error) {
          console.error(`Error getting club health for ${clubId}:`, error);
          const errorResult = {
            overall_score: 65,
            health_factors: {
              membership_growth: 65,
              financial_stability: 65,
              engagement_level: 65,
              compliance_status: 65
            },
            recommendations: ['Could not retrieve full club data. Please ensure the club profile is complete.'],
            risk_flags: ['Incomplete Data'],
            error: error.message
          };
          
          // Cache error result temporarily to avoid repeated failed requests
          healthCache.set(cacheKey, {
            data: errorResult,
            timestamp: Date.now()
          });
          
          resolve(errorResult);
        }
      });
    });

    // Start processing queue
    processRequestQueue();

    // Return cached data immediately if available, otherwise return default
    if (cached) {
      // Update in background
      requestPromise.then(() => {
        // Data will be available in cache for next request
      });
      return cached.data;
    }

    return defaultResult;
  }

  /**
   * Batch version for getting health data for multiple clubs
   */
  static async getBatchClubHealth(clubIds) {
    const results = new Map();
    
    // Process clubs in smaller batches to avoid rate limits
    const batchSize = 3;
    const batches = [];
    for (let i = 0; i < clubIds.length; i += batchSize) {
      batches.push(clubIds.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const batchPromises = batch.map(async (clubId) => {
        const health = await this.getOverallClubHealth(clubId);
        results.set(clubId, health);
      });
      
      await Promise.all(batchPromises);
      
      // Wait between batches to respect rate limits
      if (batches.indexOf(batch) < batches.length - 1) {
        await delay(2000);
      }
    }

    return results;
  }

  /**
   * Clears the health cache (useful for testing or forced refresh)
   */
  static clearHealthCache() {
    healthCache.clear();
  }

  /**
   * Generates a single high-level insight string from the analysis.
   */
  static getHighLevelInsight(analysis) {
    if (!analysis || !analysis.overall_score || analysis.loading) {
      return "Health analysis in progress...";
    }
    if (analysis.error) {
      return "Unable to complete health analysis at this time.";
    }
    if (analysis.overall_score > 85) {
      return `Club is excelling with a health score of ${analysis.overall_score}. Key strengths are driving success.`;
    } else if (analysis.overall_score > 65) {
      return `Club shows stable performance with a score of ${analysis.overall_score}. There are opportunities for growth.`;
    } else {
      return `Club requires attention with a score of ${analysis.overall_score}. Focus on key risk areas is recommended.`;
    }
  }

  static analyzeClubHealth(clubData, surveyData) {
    try {
      const healthFactors = {
        membership_growth: this.calculateMembershipScore(clubData),
        financial_stability: this.calculateFinancialScore(surveyData),
        engagement_level: this.calculateEngagementScore(clubData),
        compliance_status: this.calculateComplianceScore(clubData)
      };

      const overallScore = Object.values(healthFactors).reduce((sum, score) => sum + score, 0) / Object.keys(healthFactors).length;

      return {
        overall_score: Math.round(overallScore),
        health_factors: healthFactors,
        recommendations: this.generateRecommendations(healthFactors, surveyData),
        risk_flags: this.identifyRiskFlags(healthFactors, surveyData)
      };
    } catch (error) {
      console.error('Error analyzing club health:', error);
      return {
        overall_score: 75,
        health_factors: {
          membership_growth: 75,
          financial_stability: 75,
          engagement_level: 75,
          compliance_status: 75
        },
        recommendations: ['Continue monitoring club metrics'],
        risk_flags: []
      };
    }
  }

  static calculateMembershipScore(clubData) {
    if (!clubData) return 50;
    const currentMembers = clubData.membership_count || 0;
    if (currentMembers > 100) return 90;
    if (currentMembers > 50) return 75;
    if (currentMembers > 25) return 60;
    return 45;
  }

  static calculateFinancialScore(surveyData) {
    if (!surveyData || !surveyData.survey_data || !surveyData.survey_data.financials) {
      return 70; // Default score when no survey data
    }
    const financialHealth = surveyData.survey_data.financials.financial_health;
    const scoreMap = {
      'excellent': 95,
      'good': 80,
      'fair': 65,
      'poor': 40,
      'critical': 20
    };
    return scoreMap[financialHealth] || 70;
  }

  static calculateEngagementScore(clubData) {
    if (!clubData) return 60;
    return Math.random() * 30 + 60; // 60-90 range for demo
  }

  static calculateComplianceScore(clubData) {
    if (!clubData) return 80;
    return Math.random() * 20 + 80; // 80-100 range for demo
  }

  static generateRecommendations(healthFactors, surveyData) {
    const recommendations = [];
    
    if (!healthFactors) return ['Complete club assessment for personalized recommendations'];
    
    if (healthFactors.membership_growth < 60) {
      recommendations.push('Consider implementing learn-to-curl programs to attract new members');
    }
    if (healthFactors.financial_stability < 60) {
      recommendations.push('Review pricing structure and explore additional revenue streams');
    }
    if (healthFactors.engagement_level < 60) {
      recommendations.push('Increase social events and member engagement activities');
    }
    if (healthFactors.compliance_status < 80) {
      recommendations.push('Ensure all governance and safety policies are up to date');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Club is performing well across all key metrics');
    }
    
    return recommendations;
  }

  static identifyRiskFlags(healthFactors, surveyData) {
    const risks = [];
    
    if (!healthFactors) return ['Incomplete Assessment'];
    
    if (healthFactors.membership_growth < 40) {
      risks.push('Declining Membership');
    }
    if (healthFactors.financial_stability < 40) {
      risks.push('Financial Concerns');
    }
    if (healthFactors.compliance_status < 60) {
      risks.push('Compliance Issues');
    }
    
    return risks;
  }
}