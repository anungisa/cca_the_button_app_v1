/**
 * Business Logic Hook
 * Provides easy access to business rules and calculations
 */

import { useMemo, useCallback } from 'react';
import BusinessLogicLayer from '../business/BusinessLogicLayer';
import { useXP } from '../XPContext';

export function useBusinessLogic() {
  const { user, loyaltyData } = useXP();

  const calculateTier = useCallback((xp) => {
    return BusinessLogicLayer.calculateTier(xp);
  }, []);

  const calculateXP = useCallback((actionType, metadata = {}) => {
    return BusinessLogicLayer.calculateXP(actionType, metadata);
  }, []);

  const userEngagementScore = useMemo(() => {
    if (!user || !loyaltyData) return null;

    // This would use real activity data in production
    return BusinessLogicLayer.calculateEngagementScore(
      user,
      loyaltyData,
      { lastActivityDate: new Date(), count30Days: 10 }
    );
  }, [user, loyaltyData]);

  const canEditClub = useCallback((clubId) => {
    return BusinessLogicLayer.canEditClub(user, clubId);
  }, [user]);

  const canViewSensitiveData = useCallback((dataType) => {
    return BusinessLogicLayer.canViewSensitiveData(user, dataType);
  }, [user]);

  const validateProfile = useCallback((profileData) => {
    return BusinessLogicLayer.validateUserProfile(profileData);
  }, []);

  const affiliateToClub = useCallback(async (clubId) => {
    if (!user) throw new Error('User not authenticated');
    return await BusinessLogicLayer.affiliateUserToClub(user.id, clubId);
  }, [user]);

  return {
    calculateTier,
    calculateXP,
    userEngagementScore,
    canEditClub,
    canViewSensitiveData,
    validateProfile,
    affiliateToClub,
    BusinessLogicLayer // Expose full layer for advanced use
  };
}