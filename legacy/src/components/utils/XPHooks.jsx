import { useXP } from '@/components/XPContext';
import { PointTransaction } from '@/api/entities';

export const useXPHooks = () => {
  const { awardPoints, awardBadge, user } = useXP();

  const triggerSurveyCompletionXP = async (surveySubmission) => {
    if (!user || !surveySubmission.is_complete) return false;

    try {
      // Check if user already received XP for this survey
      const existingTransactions = await PointTransaction.filter({
        user_id: user.id,
        reference_id: surveySubmission.id,
        transaction_type: 'survey_completion'
      });

      if (existingTransactions.length > 0) {
        console.log('User already received XP for this survey');
        return false;
      }

      // Award XP for survey completion
      await awardPoints(
        250, 
        'survey_completion', 
        'Completed club survey', 
        surveySubmission.id
      );

      // Award badge for first survey completion
      if (surveySubmission.completion_percentage === 100) {
        await awardBadge(
          'survey_champion',
          'Survey Champion',
          'Completed your first comprehensive club survey'
        );
      }

      return true;
    } catch (error) {
      console.error('Error awarding survey completion XP:', error);
      return false;
    }
  };

  const triggerPledgeXP = async (pledgeId, pledgeType, campaignTag) => {
    if (!user) return false;

    try {
      // Check if user already received XP for this campaign
      const existingTransactions = await PointTransaction.filter({
        user_id: user.id,
        transaction_type: `pledge_${pledgeType}`,
        description: { $regex: campaignTag }
      });

      if (existingTransactions.length > 0) {
        console.log('User already received XP for this campaign');
        return false;
      }

      // Award base XP
      let xpAmount = 50;
      
      // Bonus XP for high-impact pledge types
      if (['volunteer', 'become_a_coach', 'become_an_official'].includes(pledgeType)) {
        xpAmount += 25;
      }

      await awardPoints(
        xpAmount,
        `pledge_${pledgeType}`,
        `Made a ${pledgeType.replace('_', ' ')} pledge for ${campaignTag}`,
        pledgeId
      );

      // Store reward metadata
      const metadata = {
        campaign_tag: campaignTag,
        pledge_type: pledgeType,
        timestamp: new Date().toISOString(),
        xp_awarded: xpAmount
      };

      // This would be stored in a separate XP ledger if needed
      console.log('XP Reward Metadata:', metadata);

      return true;
    } catch (error) {
      console.error('Error awarding pledge XP:', error);
      return false;
    }
  };

  const triggerCaseResolutionXP = async (caseId, resolutionTime) => {
    if (!user) return false;

    try {
      let xpAmount = 25; // Base XP for resolving a case
      
      // Bonus for quick resolution (under 24 hours)
      if (resolutionTime < 24) {
        xpAmount += 15;
      }

      await awardPoints(
        xpAmount,
        'case_resolution',
        'Resolved a community case',
        caseId
      );

      return true;
    } catch (error) {
      console.error('Error awarding case resolution XP:', error);
      return false;
    }
  };

  return {
    triggerSurveyCompletionXP,
    triggerPledgeXP,
    triggerCaseResolutionXP
  };
};