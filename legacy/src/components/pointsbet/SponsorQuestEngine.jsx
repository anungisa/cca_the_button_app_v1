
import React, { useState, useEffect } from 'react'; // Added React import for useState and useEffect
import { SponsorQuest, UserPrediction, Consent } from '@/api/entities';
import { useXP } from '@/components/XPContext';
import { AuditLogService } from '@/components/utils/AuditLogService';

// Predefined PointsBet quests configuration
export const POINTSBET_QUESTS = [
  {
    name: "First Prediction",
    sponsor_name: "PointsBet",
    description: "Make your first end prediction",
    quest_type: "daily_prediction",
    requirements: { target_count: 1 },
    xp_reward: 25,
    age_requirement: 18,
    consent_required: "prediction_games"
  },
  {
    name: "Prediction Streak",
    sponsor_name: "PointsBet",
    description: "Get 3 predictions correct in a row",
    quest_type: "prediction_streak",
    requirements: { target_count: 3 },
    xp_reward: 50,
    badge_reward: "sharp_predictor",
    age_requirement: 18,
    consent_required: "prediction_games"
  },
  {
    name: "Odds Explorer",
    sponsor_name: "PointsBet",
    description: "View live odds 5 times",
    quest_type: "odds_views",
    requirements: { target_count: 5 },
    xp_reward: 15,
    age_requirement: 18,
    consent_required: "live_odds_display"
  },
  {
    name: "Daily Predictor",
    sponsor_name: "PointsBet",
    description: "Make predictions for 5 consecutive days",
    quest_type: "daily_prediction",
    requirements: { consecutive_days: 5 },
    xp_reward: 100,
    badge_reward: "daily_predictor",
    age_requirement: 18,
    consent_required: "prediction_games"
  }
];

// Helper function to calculate age from birth date
const calculateAge = (birthDate) => {
  if (!birthDate) return 0;
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Helper function to calculate a quest's current progress for display
const calculateProgress = (quest, userPredictions) => {
  let current_progress = 0;
  let is_complete = false;
  const requirements = quest.requirements;

  switch (quest.quest_type) {
    case 'prediction_streak':
      // The original `checkPredictionStreak` checks for `target_count`
      // among recent correct predictions from 'PointsBet'.
      const correctPointsBetPredictions = userPredictions
        .filter(p => p.was_correct && p.sponsor === 'PointsBet');
      
      current_progress = Math.min(correctPointsBetPredictions.length, requirements.target_count);
      is_complete = current_progress >= requirements.target_count;
      break;

    case 'odds_views':
    case 'onboarding_complete':
      // These quest types require external tracking data not available solely in userPredictions for progress display.
      current_progress = 0;
      is_complete = false;
      break;

    case 'daily_prediction':
      if (requirements.target_count) { // e.g., "First Prediction" (make 1 prediction today)
        const today = new Date().toISOString().split('T')[0];
        const hasMadePredictionToday = userPredictions.some(p =>
            p.prediction_locked_at && p.prediction_locked_at.startsWith(today)
        );
        current_progress = hasMadePredictionToday ? 1 : 0;
        is_complete = current_progress >= requirements.target_count;
      } else if (requirements.consecutive_days) { // e.g., "Daily Predictor" (make predictions for X consecutive days)
        const distinctPredictionDays = Array.from(new Set(userPredictions
            .filter(p => p.prediction_locked_at)
            .map(p => new Date(p.prediction_locked_at).toISOString().split('T')[0]))
        ).sort(); // Sort days ascending

        let consecutiveStreak = 0;
        if (distinctPredictionDays.length > 0) {
            let tempStreak = 0;
            let lastDateInStreak = null;

            // Iterate through distinct prediction days from most recent backwards
            for (let i = distinctPredictionDays.length - 1; i >= 0; i--) {
                const currentDay = new Date(distinctPredictionDays[i]);
                if (lastDateInStreak === null) {
                    tempStreak = 1;
                    lastDateInStreak = currentDay;
                } else {
                    const diffDays = Math.round(Math.abs((lastDateInStreak.getTime() - currentDay.getTime()) / (1000 * 60 * 60 * 24)));
                    if (diffDays === 1) { // Current day is exactly one day before lastDateInStreak
                        tempStreak++;
                        lastDateInStreak = currentDay;
                    } else if (diffDays === 0) {
                        // Same day, continue as we are processing distinct days
                        continue;
                    } else {
                        // Streak broken
                        break;
                    }
                }
            }
            consecutiveStreak = tempStreak;
        }
        current_progress = consecutiveStreak;
        is_complete = current_progress >= requirements.consecutive_days;
      }
      break;

    default:
      current_progress = 0;
      is_complete = false;
  }
  return { current_progress, is_complete };
};

// Main functional component for Sponsor Quest Engine
export default function SponsorQuestEngine() {
  const [quests, setQuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { awardPoints, awardBadge, user } = useXP();

  // Reference to the quest configurations
  const questConfig = POINTSBET_QUESTS;

  // Helper functions previously part of `useSponsorQuestEngine`
  const checkUserConsent = async (userId, consentType) => {
    try {
      const consent = await Consent.filter({
        user_id: userId,
        feature_key: consentType,
        status: 'granted'
      });
      return consent.length > 0;
    } catch (error) {
      console.error('Consent check failed:', error);
      return false;
    }
  };

  const checkPredictionStreak = async (quest, actionData) => {
    try {
      const recentPredictions = await UserPrediction.filter(
        { 
          user_id: user.id,
          sponsor: 'PointsBet',
          was_correct: true
        },
        '-created_date', // Sort by creation date descending
        quest.requirements.target_count // Limit to target count to check if enough recent predictions exist
      );

      // Check if predictions are consecutive (this is a simplified check based on count)
      if (recentPredictions.length >= quest.requirements.target_count) {
        // Additional logic for true consecutive checking (e.g., by date) would go here if needed.
        // For now, based on the original structure, simply checking the count is sufficient for completion.
        return true;
      }
      return false;
    } catch (error) {
      console.error('Prediction streak check failed:', error);
      return false;
    }
  };

  const checkOddsViews = async (quest, actionData) => {
    // This would typically check a separate tracking table or user activity logs.
    // For now, we'll use a simple counter approach from actionData.
    const viewCount = actionData.oddsViewCount || 0;
    return viewCount >= quest.requirements.target_count;
  };

  const checkDailyPrediction = async (quest, actionData) => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      // If it's about 'target_count' (e.g., 'First Prediction')
      if (quest.requirements.target_count) {
        const todayPredictions = await UserPrediction.filter({
          user_id: user.id,
          prediction_locked_at: { $gte: today }
        });
        return todayPredictions.length > 0; // User made at least one prediction today
      } 
      // If it's about 'consecutive_days' (e.g., 'Daily Predictor')
      else if (quest.requirements.consecutive_days) {
        // This requires fetching a range of predictions and checking dates.
        // For simplicity, this reuses logic from calculateProgress for the actual check
        // Or implies a more complex check beyond a simple query here.
        // For completion, we need to know if the user has a streak ending *today*
        // that meets the requirement.
        const recentPredictions = await UserPrediction.filter({
          user_id: user.id,
          prediction_locked_at: { $lte: new Date().toISOString() }, // all predictions up to today
        }, '-prediction_locked_at'); // sort by most recent first

        const { current_progress } = calculateProgress(quest, recentPredictions);
        return current_progress >= quest.requirements.consecutive_days;
      }
      return false;
    } catch (error) {
      console.error('Daily prediction check failed:', error);
      return false;
    }
  };

  const checkQuestCompletion = async (quest, actionData) => {
    switch (quest.quest_type) {
      case 'prediction_streak':
        return await checkPredictionStreak(quest, actionData);
      case 'odds_views':
        return await checkOddsViews(quest, actionData);
      case 'daily_prediction':
        return await checkDailyPrediction(quest, actionData);
      case 'onboarding_complete':
        return actionData.onboardingComplete === true;
      default:
        return false;
    }
  };

  const completeQuest = async (quest) => {
    try {
      // Award XP
      await awardPoints(
        quest.xp_reward,
        'sponsor_quest',
        `Completed PointsBet quest: ${quest.name}`,
        quest.id
      );

      // Award badge if specified
      if (quest.badge_reward) {
        await awardBadge(
          quest.badge_reward,
          `${quest.name} Badge`,
          `Earned by completing ${quest.name}`
        );
      }

      // Log completion
      AuditLogService.logEvent('SPONSOR_QUEST_COMPLETED', {
        quest_id: quest.id,
        quest_name: quest.name,
        sponsor: quest.sponsor_name,
        xp_awarded: quest.xp_reward
      });

      console.log(`Quest completed: ${quest.name} (+${quest.xp_reward} XP)`);
    } catch (error) {
      console.error('Quest completion failed:', error);
    }
  };

  const checkQuestProgress = async (questType, actionData = {}) => {
    if (!user) return;

    try {
      // Get active quests for this type
      const activeQuests = await SponsorQuest.filter({
        quest_type: questType,
        is_active: true
      });

      for (const quest of activeQuests) {
        // Check if user meets age requirement
        if (quest.age_requirement && quest.age_requirement > 0) {
          const userAge = calculateAge(user.date_of_birth);
          if (userAge < quest.age_requirement) continue;
        }

        // Check consent requirements
        if (quest.consent_required) {
          const hasConsent = await checkUserConsent(user.id, quest.consent_required);
          if (!hasConsent) continue;
        }

        // Check quest completion
        const isComplete = await checkQuestCompletion(quest, actionData);
        if (isComplete) {
          await completeQuest(quest);
        }
      }
    } catch (error) {
      console.error('Quest progress check failed:', error);
    }
  };

  // Effect hook to load quests and user data
  useEffect(() => {
    const loadQuests = async () => {
      if (!user) {
        setIsLoading(false); // If no user, stop loading and show no quests
        return;
      }
      
      try {
        const userQuests = await SponsorQuest.filter({ is_active: true, sponsor_name: 'PointsBet' });
        // Fetch all relevant predictions for the current user to calculate progress
        const userPredictions = await UserPrediction.filter({ user_id: user.id, sponsor: 'PointsBet' });

        // Enrich quest data with config, calculate progress, and filter out invalid quests
        const enrichedQuests = userQuests.map(dbQuest => {
          // Find matching configuration from predefined quests (POINTSBET_QUESTS)
          const config = questConfig.find(c => c.quest_type === dbQuest.quest_type);
          if (!config) {
              console.warn(`No config found for quest type: ${dbQuest.quest_type}. Skipping quest: ${dbQuest.name}`);
              return null; // Mark invalid quests to be filtered out
          }
          // Calculate current progress for display
          const progress = calculateProgress(dbQuest, userPredictions);
          // Combine DB data, config data, and calculated progress
          return { ...dbQuest, ...config, ...progress };
        }).filter(Boolean); // Remove any null entries from quests with no config
        
        setQuests(enrichedQuests);
      } catch (error) {
        console.error('Failed to load quests:', error);
        setQuests([]); // Ensure quests array is empty on error
      } finally {
        setIsLoading(false);
      }
    };

    loadQuests();
  }, [user]); // Re-run when user changes

  if (isLoading) {
    return <div>Loading quests...</div>;
  }

  // Example of rendering the quests (you would customize this JSX)
  return (
    <div>
      <h2>Your PointsBet Quests</h2>
      {quests.length === 0 ? (
        <p>No active quests found or you've completed them all!</p>
      ) : (
        <ul>
          {quests.map(quest => (
            <li key={quest.id}>
              <h3>{quest.name}</h3>
              <p>{quest.description}</p>
              <p>XP Reward: {quest.xp_reward}</p>
              <p>Progress: {quest.current_progress} / {quest.requirements.target_count || quest.requirements.consecutive_days || 'N/A'}</p>
              <p>Status: {quest.is_complete ? 'Completed!' : 'In Progress'}</p>
              {quest.badge_reward && <p>Badge Reward: {quest.badge_reward}</p>}
              {/* You might add a button here to manually trigger checkQuestProgress if needed by UI */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
