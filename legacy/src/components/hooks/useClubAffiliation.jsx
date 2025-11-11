import { useState, useEffect } from 'react';
import { User, Club } from '@/api/entities';
import { useXP } from '../XPContext';

export const useClubAffiliation = (userId) => {
  const [homeClub, setHomeClub] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [affiliationHistory, setAffiliationHistory] = useState([]);
  const { awardPoints, awardBadge } = useXP();

  useEffect(() => {
    const loadClubAffiliation = async () => {
      try {
        if (!userId) return;
        
        const user = await User.me();
        
        if (user.home_club_id) {
          const club = await Club.filter({ id: user.home_club_id });
          if (club.length > 0) {
            setHomeClub(club[0]);
          }
        }
        
        // Load affiliation history from user data
        if (user.club_history) {
          setAffiliationHistory(user.club_history);
        }
        
      } catch (error) {
        console.error('Error loading club affiliation:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadClubAffiliation();
  }, [userId]);

  const selectHomeClub = async (club) => {
    try {
      setIsLoading(true);
      
      // Update user profile
      const updateData = {
        home_club_id: club?.id || null,
        home_club_name: club?.name || null
      };
      
      await User.updateMyUserData(updateData);
      setHomeClub(club);
      
      // Award XP for selecting a home club (first time only)
      if (club && !homeClub) {
        const success = await awardPoints(50, 'bonus', `Selected ${club.name} as home club`, club.id);
        
        if (success) {
          await awardBadge(
            'rooted_curler',
            'Rooted Curler',
            'Selected a home club to represent in the curling community'
          );
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error selecting home club:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const changeHomeClub = async (newClub, reason = 'user_choice') => {
    try {
      setIsLoading(true);
      
      // Add current club to history if exists
      if (homeClub) {
        const historyEntry = {
          club_name: homeClub.name,
          club_id: homeClub.id,
          start_date: homeClub.affiliation_date || new Date().toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0],
          reason: reason
        };
        
        const updatedHistory = [...affiliationHistory, historyEntry];
        setAffiliationHistory(updatedHistory);
        
        await User.updateMyUserData({
          club_history: updatedHistory
        });
      }
      
      // Select new club
      return await selectHomeClub(newClub);
      
    } catch (error) {
      console.error('Error changing home club:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeHomeClub = async () => {
    return await changeHomeClub(null, 'removed_by_user');
  };

  const getClubStats = async (clubId) => {
    try {
      // Get club-related user stats
      const users = await User.filter({ home_club_id: clubId });
      const club = await Club.filter({ id: clubId });
      
      if (club.length === 0) return null;
      
      return {
        club: club[0],
        affiliated_users_count: users.length,
        total_xp_earned: users.reduce((sum, user) => {
          // This would need to be calculated from loyalty data
          return sum + (user.total_xp || 0);
        }, 0),
        recent_affiliations: users
          .filter(u => u.home_club_id === clubId)
          .sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date))
          .slice(0, 5)
      };
    } catch (error) {
      console.error('Error getting club stats:', error);
      return null;
    }
  };

  const awardClubXP = async (xpAmount, description, activityType = 'club_activity') => {
    if (!homeClub) return false;
    
    try {
      const success = await awardPoints(
        xpAmount, 
        activityType, 
        `${description} (representing ${homeClub.name})`,
        homeClub.id
      );
      
      // Check for club-wide achievements
      if (success) {
        const clubStats = await getClubStats(homeClub.id);
        
        // Award club spirit badge if club reaches milestones
        if (clubStats && clubStats.total_xp_earned >= 5000) {
          await awardBadge(
            'club_spirit',
            'Club Spirit',
            `Your club ${homeClub.name} has earned over 5,000 XP collectively!`
          );
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error awarding club XP:', error);
      return false;
    }
  };

  return {
    homeClub,
    affiliationHistory,
    isLoading,
    selectHomeClub,
    changeHomeClub,
    removeHomeClub,
    getClubStats,
    awardClubXP
  };
};