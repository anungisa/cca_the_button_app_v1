
import { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { PointTransaction } from '@/api/entities';
import { LoyaltyProgram } from '@/api/entities';
import { useXP } from '../XPContext';

export const useInvolvementProgress = (userId) => {
  const [userPathways, setUserPathways] = useState({});
  const [availableBadges, setAvailableBadges] = useState([]);
  const [progress, setProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { awardPoints, awardBadge } = useXP();

  useEffect(() => {
    if (userId) {
      loadUserProgress();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const loadUserProgress = async () => {
    try {
      setIsLoading(true);
      
      // Load user's involvement progress from transactions and achievements
      const transactions = await PointTransaction.filter({ user_id: userId });
      const involvement_transactions = transactions.filter(t => 
        ['volunteer', 'event_registration', 'training_completion', 'pathway_started'].includes(t.transaction_type)
      );

      // Calculate pathway progress based on transactions
      const pathwayProgress = {};
      involvement_transactions.forEach(transaction => {
        const pathwayId = extractPathwayFromTransaction(transaction);
        if (pathwayId) {
          if (!pathwayProgress[pathwayId]) {
            pathwayProgress[pathwayId] = {
              completedSteps: 0,
              totalXP: 0,
              lastActivity: null,
              achievements: [],
              status: 'started'
            };
          }
          pathwayProgress[pathwayId].completedSteps += 1;
          pathwayProgress[pathwayId].totalXP += transaction.points_amount;
          pathwayProgress[pathwayId].lastActivity = transaction.created_date;
        }
      });

      setUserPathways(pathwayProgress);
      
      // Convert to progress array format
      const progressArray = Object.keys(pathwayProgress).map(pathway => ({
        pathway,
        status: pathwayProgress[pathway].status,
        completedSteps: pathwayProgress[pathway].completedSteps,
        totalXP: pathwayProgress[pathway].totalXP
      }));
      
      setProgress(progressArray);
      
    } catch (error) {
      console.error('Error loading involvement progress:', error);
      setProgress([]);
    } finally {
      setIsLoading(false);
    }
  };

  const extractPathwayFromTransaction = (transaction) => {
    // Map transaction descriptions to pathway IDs
    const description = (transaction.description || '').toLowerCase();
    
    if (description.includes('volunteer')) return 'volunteer';
    if (description.includes('coach')) return 'coach';
    if (description.includes('official')) return 'official';
    if (description.includes('contribute')) return 'contribute';
    
    return null;
  };

  const trackPathwayAction = async (pathwayId, actionType, description, xpReward = 0) => {
    try {
      // Award XP for the action
      if (xpReward > 0) {
        await awardPoints(xpReward, actionType, description, pathwayId);
      }

      // Check for pathway-specific badges
      await checkPathwayBadges(pathwayId, actionType);

      // Update local state
      setUserPathways(prev => ({
        ...prev,
        [pathwayId]: {
          ...prev[pathwayId],
          completedSteps: (prev[pathwayId]?.completedSteps || 0) + 1,
          totalXP: (prev[pathwayId]?.totalXP || 0) + xpReward,
          lastActivity: new Date().toISOString(),
          status: 'in_progress'
        }
      }));

      // Reload progress to reflect changes
      await loadUserProgress();

      return true;
    } catch (error) {
      console.error('Error tracking pathway action:', error);
      return false;
    }
  };

  const checkPathwayBadges = async (pathwayId, actionType) => {
    const badgeMap = {
      'volunteer': {
        'pathway_started': { id: 'volunteer_ready', name: 'Volunteer Ready', description: 'Started the volunteer pathway' },
        'form_submission': { id: 'volunteer_ready', name: 'Volunteer Ready', description: 'Submitted volunteer application' },
        'event_completion': { id: 'community_champion', name: 'Community Champion', description: 'Completed 5+ volunteer events' }
      },
      'coach': {
        'pathway_started': { id: 'mentor_in_training', name: 'Mentor in Training', description: 'Started the coaching pathway' },
        'course_completion': { id: 'certified_coach', name: 'Certified Coach', description: 'Completed NCCP course' }
      },
      'official': {
        'pathway_started': { id: 'future_official', name: 'Future Official', description: 'Started the official pathway' },
        'first_game': { id: 'game_ruler', name: 'Game Ruler', description: 'Officiated your first game' }
      },
      'contribute': {
        'pathway_started': { id: 'skill_contributor', name: 'Skill Contributor', description: 'Started contributing professional skills' }
      }
    };

    const pathwayBadges = badgeMap[pathwayId];
    if (pathwayBadges && pathwayBadges[actionType]) {
      const badge = pathwayBadges[actionType];
      await awardBadge(badge.id, badge.name, badge.description);
    }
  };

  const getPathwayProgress = (pathwayId) => {
    return userPathways[pathwayId] || {
      completedSteps: 0,
      totalXP: 0,
      lastActivity: null,
      achievements: [],
      status: 'not_started'
    };
  };

  const hasStartedPathway = (pathwayId) => {
    return userPathways[pathwayId] && userPathways[pathwayId].completedSteps > 0;
  };

  const getCompletionRate = (pathwayId, totalSteps) => {
    const progress = getPathwayProgress(pathwayId);
    return totalSteps > 0 ? (progress.completedSteps / totalSteps) * 100 : 0;
  };

  return {
    userPathways,
    progress,
    isLoading,
    trackPathwayAction,
    getPathwayProgress,
    hasStartedPathway,
    getCompletionRate,
    loadUserProgress
  };
};
