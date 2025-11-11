import { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { useXP } from '../XPContext';

export const useSafeSportStatus = () => {
  const { awardPoints, awardBadge } = useXP();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
        setStatus({
          status: userData.safe_sport_status,
          expiry: userData.safe_sport_expiry,
        });
      } catch (error) {
        console.error("Error loading user for Safe Sport status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const updateUserStatus = async (newStatus, newExpiryDate) => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      const updateData = {
        safe_sport_status: newStatus,
        safe_sport_expiry: newExpiryDate,
      };
      
      await User.updateMyUserData(updateData);
      setStatus({ status: newStatus, expiry: newExpiryDate });

      // Award XP and badge for becoming compliant
      if (newStatus === 'current') {
        const success = await awardPoints(200, 'safesport', 'Completed Safe Sport certification');
        if (success) {
          await awardBadge(
            'cleared_to_play', 
            'Cleared to Play', 
            'Successfully completed all Safe Sport requirements'
          );
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error updating Safe Sport status:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const markPoliciesAsRead = async () => {
    // This is a simulation as we don't track policy reading state
    // In a real app, we'd check if this badge was already awarded
    const success = await awardPoints(100, 'safesport', 'Reviewed all Safe Sport policies');
    if (success) {
      await awardBadge(
        'informed_curler', 
        'Informed Curler', 
        'Reviewed the official Safe Sport policies and code of conduct'
      );
    }
    return success;
  };

  const fileReport = async () => {
    // This would be triggered after a user is redirected to the reporting portal
    const success = await awardPoints(150, 'safesport', 'Filed a report via the integrity portal');
    if (success) {
      await awardBadge(
        'integrity_ally',
        'Integrity Ally',
        'Took action to uphold community safety and integrity'
      );
    }
    // Redirect to external portal
    window.open('https://app.integritycounts.ca/org/curlingcanada', '_blank');
    return success;
  };
  
  const getRoleRequirements = (role) => {
    switch (role) {
      case 'coach':
        return ['Respect in Sport Training', 'eLearning Modules', 'Background Check', 'Code of Conduct'];
      case 'athlete':
      case 'curler':
        return ['Safe Sport eLearning Module', 'Rowan\'s Law Acknowledgment'];
      case 'volunteer':
        return ['Safe Sport eLearning Module', 'Code of Conduct'];
      case 'ma_admin':
         return ['All Coach Requirements', 'Admin-specific training'];
      default:
        return ['Review Code of Conduct'];
    }
  };

  return {
    user,
    status,
    isLoading,
    updateUserStatus,
    markPoliciesAsRead,
    fileReport,
    getRoleRequirements,
  };
};