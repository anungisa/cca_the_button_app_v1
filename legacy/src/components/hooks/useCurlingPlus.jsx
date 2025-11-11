
import { useState, useEffect } from 'react';
import { CurlingPlusSubscription } from '@/api/entities';
import { useXP } from '@/components/XPContext';

export const useCurlingPlus = () => {
  const { user } = useXP();
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (user) {
      loadSubscription();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadSubscription = async () => {
    // Add a defensive check to ensure the entity is loaded
    if (!CurlingPlusSubscription || typeof CurlingPlusSubscription.filter !== 'function') {
      console.warn('CurlingPlusSubscription entity not ready, cannot check status.');
      setIsLoading(false);
      setHasAccess(false);
      return;
    }

    try {
      const subscriptions = await CurlingPlusSubscription.filter({ 
        user_id: user.id,
        status: 'active'
      }).catch(() => {
        // Handle potential API errors by returning an empty array
        console.warn('Failed to fetch CurlingPlus subscriptions.');
        return [];
      });
      
      if (subscriptions.length > 0) {
        const activeSub = subscriptions[0];
        setSubscription(activeSub);
        
        // Check if subscription is still valid
        const now = new Date();
        const endDate = new Date(activeSub.end_date);
        const trialEndDate = activeSub.trial_info?.trial_end_date ? new Date(activeSub.trial_info.trial_end_date) : null;
        
        const isTrialActive = activeSub.trial_info?.is_trial && trialEndDate && now < trialEndDate;
        const isSubscriptionActive = now < endDate;
        
        setHasAccess(isTrialActive || isSubscriptionActive);
      } else {
        setSubscription(null);
        setHasAccess(false);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
      setSubscription(null);
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const hasFeature = (feature) => {
    if (!subscription || !hasAccess) return false;
    return subscription.features_enabled?.includes(feature) || false;
  };

  const getSubscriptionStatus = () => {
    if (!subscription) return 'none';
    
    const now = new Date();
    const trialEndDate = subscription.trial_info?.trial_end_date ? new Date(subscription.trial_info.trial_end_date) : null;
    
    if (subscription.trial_info?.is_trial && trialEndDate && now < trialEndDate) {
      return 'trial';
    }
    
    return subscription.status;
  };

  const getTrialDaysRemaining = () => {
    if (!subscription?.trial_info?.is_trial) return 0;
    
    const trialEndDate = new Date(subscription.trial_info.trial_end_date);
    const now = new Date();
    const diffTime = trialEndDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  return {
    subscription,
    hasAccess,
    hasFeature,
    isLoading,
    getSubscriptionStatus,
    getTrialDaysRemaining,
    refreshSubscription: loadSubscription
  };
};
