import { Club, SurveySubmission, AIInsight } from '@/api/entities';
import { InvokeLLM } from '@/api/integrations';
import { eventBus, EVENTS } from './EventBus';

/**
 * Proactive AI Service
 * Runs background jobs to analyze data and generate predictive insights.
 */
export class ProactiveAIService {

  /**
   * Scans all clubs for potential 'at-risk' status based on recent survey data.
   * This would be run on a schedule (e.g., nightly).
   */
  static async analyzeClubRisk() {
    console.log("Starting proactive club risk analysis...");
    const clubs = await Club.list();
    const surveys = await SurveySubmission.list();

    for (const club of clubs) {
      const clubSurveys = surveys.filter(s => s.club_id === club.id).sort((a, b) => b.year - a.year);
      if (clubSurveys.length === 0) continue;

      const latestSurvey = clubSurveys[0];
      const financialHealth = latestSurvey.survey_data?.financials?.financial_health;
      const membershipGrowth = latestSurvey.survey_data?.participation?.new_members_this_year;

      // Simple rule-based trigger for AI analysis
      if (financialHealth === 'poor' || financialHealth === 'critical' || membershipGrowth < 0) {
        
        const prompt = `
          Analyze the following data for curling club "${club.name}" and determine if it's at risk.
          
          Data:
          - Financial Health Rating: ${financialHealth}
          - New Members This Year: ${membershipGrowth}
          - Total Members: ${latestSurvey.survey_data?.participation?.total_members}
          - MA Relationship Score: ${latestSurvey.survey_data?.member_associations?.ma_relationship}

          If the club is at risk, generate a concise observation and a concrete, actionable suggestion for the Club Services department.
        `;

        const result = await InvokeLLM({
            prompt: prompt,
            response_json_schema: {
                type: "object",
                properties: {
                    is_at_risk: { type: "boolean" },
                    observation: { type: "string" },
                    suggestion: { type: "string" }
                }
            }
        });

        if (result && result.is_at_risk) {
          // Check if a similar insight already exists to avoid duplicates
          const existingInsight = await AIInsight.filter({
            context_id: club.id,
            insight_type: 'club_at_risk',
            status: 'new'
          });

          if (existingInsight.length === 0) {
            const newInsight = await AIInsight.create({
              context_id: club.id,
              context_type: 'club',
              insight_type: 'club_at_risk',
              observation: result.observation,
              suggestion: result.suggestion,
              severity: 'high',
              supporting_metrics: {
                financialHealth,
                membershipGrowth
              }
            });

            eventBus.publish(EVENTS.AI_INSIGHT_GENERATED, { insightId: newInsight.id, clubId: club.id });
          }
        }
      }
    }
    console.log("Club risk analysis complete.");
  }
}