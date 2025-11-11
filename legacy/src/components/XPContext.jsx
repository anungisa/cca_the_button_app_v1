import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User } from '@/api/entities';
import { LoyaltyProgram } from '@/api/entities';
import { PointTransaction } from '@/api/entities';
import BusinessLogicLayer from './business/BusinessLogicLayer';
import { enhancedEntityService } from './services/EnhancedEntityService';
import { communityMessages, tierConfig } from './utils/brandEthos';
import { performanceMonitor } from './services/PerformanceMonitoringService';
import { securityService } from './services/SecurityService';
import { rateLimiter } from './services/RateLimiter';
import { healthCheckService } from './services/HealthCheckService';
import { gracefulDegradationService } from './services/GracefulDegradationService';

const XPContext = createContext();

export const useXP = () => {
  const context = useContext(XPContext);
  if (!context) {
    throw new Error('useXP must be used within an XPProvider');
  }
  return context;
};

export const XPProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [entitiesReady, setEntitiesReady] = useState(false);
  const [systemHealth, setSystemHealth] = useState('healthy');

  // ✅ START HEALTH MONITORING
  useEffect(() => {
    healthCheckService.startPeriodicChecks(60000);
    
    const handleDegraded = () => setSystemHealth('degraded');
    const handleRecovered = () => setSystemHealth('healthy');
    
    window.addEventListener('system-degraded', handleDegraded);
    window.addEventListener('system-recovered', handleRecovered);
    
    return () => {
      healthCheckService.stopPeriodicChecks();
      window.removeEventListener('system-degraded', handleDegraded);
      window.removeEventListener('system-recovered', handleRecovered);
    };
  }, []);

  const showXPAnimation = useCallback((points) => {
    try {
      const xpElement = document.createElement('div');
      
      xpElement.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: white;
          padding: 12px 20px;
          border-radius: 50px;
          font-weight: bold;
          font-size: 16px;
          z-index: 9999;
          animation: xpBounce 3s ease-out forwards;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          max-width: 320px;
        ">
          <span>⚡</span>
          <div>
            <div style="font-size: 14px;">+${points} Journey XP</div>
          </div>
        </div>
      `;
      
      if (!document.getElementById('xp-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'xp-animation-styles';
        style.textContent = `
          @keyframes xpBounce {
            0% { transform: translateY(-20px) scale(0.8); opacity: 0; }
            20% { transform: translateY(0) scale(1.1); opacity: 1; }
            40% { transform: translateY(-5px) scale(1); opacity: 1; }
            100% { transform: translateY(-50px) scale(1); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
      
      document.body.appendChild(xpElement);
      
      setTimeout(() => {
        if (xpElement.parentNode) {
          xpElement.parentNode.removeChild(xpElement);
        }
      }, 3000);
    } catch (error) {
      console.warn('Failed to show XP animation:', error);
    }
  }, []);

  const loadInitialData = useCallback(async (forceRefresh = false) => {
    const startTime = Date.now();
    setIsLoading(true);
    setHasError(false);

    try {
      // ✅ SAFE: Try to get user, but don't fail if not authenticated
      let userData = null;
      try {
        userData = await User.me();
      } catch (error) {
        console.log('User not authenticated yet, showing public experience');
        setUser(null);
        setLoyaltyData(null);
        setEntitiesReady(true);
        setIsLoading(false);
        return;
      }

      // ✅ Validate user data
      if (!userData || !userData.id || typeof userData.id !== 'string') {
        console.warn('Invalid user data received:', userData);
        setUser(null);
        setLoyaltyData(null);
        setEntitiesReady(true);
        setIsLoading(false);
        return;
      }

      console.log('Loading data for user:', userData.email);
      setUser(userData);

      // ✅ SAFE: Load loyalty data with comprehensive error handling
      let loyaltyRecord = null;
      try {
        console.log('Fetching loyalty data for user:', userData.id);
        
        // Try using standard list first (more reliable)
        const allLoyaltyRecords = await LoyaltyProgram.list('-created_date', 100);
        loyaltyRecord = allLoyaltyRecords.find(record => record.user_id === userData.id);

        if (!loyaltyRecord) {
          console.log('No loyalty record found, creating initial record');
          
          // Create initial loyalty record
          const newLoyaltyData = {
            user_id: userData.id,
            curl_points: 0,
            tier: 'granite_rookie',
            tier_progress: { 
              current_xp: 0, 
              next_tier_xp: 500, 
              next_tier_name: 'Sheet Star' 
            },
            badges: [],
            total_earned_points: 0,
            total_redeemed_points: 0,
            fan_pass_status: 'none'
          };

          try {
            loyaltyRecord = await LoyaltyProgram.create(newLoyaltyData);
            console.log('Created new loyalty record:', loyaltyRecord.id);
          } catch (createError) {
            console.error('Failed to create loyalty record:', createError);
            
            // Use default loyalty data if creation fails
            loyaltyRecord = {
              id: 'temp-' + userData.id,
              ...newLoyaltyData
            };
            console.log('Using temporary loyalty data');
          }
        } else {
          console.log('Found existing loyalty record:', loyaltyRecord.id);
        }

        // ✅ Validate loyalty record structure
        if (!loyaltyRecord.tier_progress) {
          loyaltyRecord.tier_progress = { 
            current_xp: loyaltyRecord.curl_points || 0, 
            next_tier_xp: 500, 
            next_tier_name: 'Sheet Star' 
          };
        }
        
        if (!loyaltyRecord.badges) {
          loyaltyRecord.badges = [];
        }

      } catch (loyaltyError) {
        console.error('Error loading loyalty data:', loyaltyError);
        
        // Create fallback loyalty data
        loyaltyRecord = {
          id: 'fallback-' + userData.id,
          user_id: userData.id,
          curl_points: 0,
          tier: 'granite_rookie',
          tier_progress: { 
            current_xp: 0, 
            next_tier_xp: 500, 
            next_tier_name: 'Sheet Star' 
          },
          badges: [],
          total_earned_points: 0,
          total_redeemed_points: 0,
          fan_pass_status: 'none'
        };
        console.log('Using fallback loyalty data');
      }

      setLoyaltyData(loyaltyRecord);
      setEntitiesReady(true);

      performanceMonitor.trackPageLoad('XPContext.loadInitialData', Date.now() - startTime);
      console.log('XPContext data loaded successfully in', Date.now() - startTime, 'ms');

    } catch (error) {
      console.error("Critical error in loadInitialData:", error);
      console.error("Error stack:", error.stack);
      performanceMonitor.trackError(error, { context: 'XPContext.loadInitialData' });
      
      // Don't set hasError to true - allow app to function without loyalty data
      setUser(null);
      setLoyaltyData(null);
      setEntitiesReady(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshXPData = useCallback(async () => {
    console.log('Refreshing XP data...');
    await loadInitialData(true);
  }, [loadInitialData]);

  const awardPoints = useCallback(async (points, source, description, referenceId = null) => {
    if (!user || !loyaltyData) {
      console.warn('Cannot award points: user or loyalty data not available');
      return false;
    }

    // Don't allow awarding to temporary/fallback records
    if (loyaltyData.id?.startsWith('temp-') || loyaltyData.id?.startsWith('fallback-')) {
      console.warn('Cannot award points to temporary loyalty record');
      return false;
    }

    try {
      const result = await BusinessLogicLayer.awardXP(
        user.id,
        source,
        description,
        {
          referenceId,
          fan_pass_active: loyaltyData.fan_pass_status !== 'none'
        }
      );

      if (result.success) {
        showXPAnimation(result.xp);
        setTimeout(() => refreshXPData(), 2000);
      }

      return result.success;
    } catch (error) {
      console.error('Error awarding points:', error);
      performanceMonitor.trackError(error, { context: 'awardPoints', userId: user.id });
      return false;
    }
  }, [user, loyaltyData, showXPAnimation, refreshXPData]);

  const awardBadge = useCallback(async (badgeId, badgeName, description) => {
    if (!user || !loyaltyData) {
      console.warn('Cannot award badge: user or loyalty data not available');
      return false;
    }

    // Don't allow awarding to temporary/fallback records
    if (loyaltyData.id?.startsWith('temp-') || loyaltyData.id?.startsWith('fallback-')) {
      console.warn('Cannot award badge to temporary loyalty record');
      return false;
    }

    // ✅ INPUT VALIDATION
    if (!badgeId || typeof badgeId !== 'string' || badgeId.length === 0 || badgeId.length > 100) {
      console.error('Invalid badge ID provided.');
      return false;
    }
    if (!badgeName || typeof badgeName !== 'string' || badgeName.length === 0 || badgeName.length > 200) {
      console.error('Invalid badge name provided.');
      return false;
    }
    if (description && typeof description !== 'string') {
      console.error('Invalid badge description type.');
      return false;
    }

    try {
      const allowed = await rateLimiter.checkMutationLimit(user.id);
      if (!allowed) {
        console.warn('Rate limit exceeded for awardBadge');
        performanceMonitor.trackEvent('RateLimitExceeded', { 
          feature: 'awardBadge', 
          userId: user.id 
        });
        return false;
      }
    } catch (error) {
      console.warn('Rate limit check failed:', error.message);
    }

    try {
      const existingBadge = (loyaltyData.badges || []).find(b => b.badge_id === badgeId);
      if (existingBadge) {
        console.log('Badge already awarded:', badgeId);
        return false;
      }

      const newBadge = {
        badge_id: securityService.sanitizeInput(badgeId, { maxLength: 100 }),
        badge_name: securityService.sanitizeInput(badgeName, { maxLength: 200 }),
        earned_date: new Date().toISOString().split('T')[0],
        description: securityService.sanitizeInput(description || '', { maxLength: 500 })
      };

      const updatedBadges = [...(loyaltyData.badges || []), newBadge];

      await LoyaltyProgram.update(
        loyaltyData.id,
        { badges: updatedBadges }
      );

      setLoyaltyData(prev => ({
        ...prev,
        badges: updatedBadges
      }));

      return true;
    } catch (error) {
      console.error('Error awarding badge:', error);
      performanceMonitor.trackError(error, { context: 'awardBadge', userId: user?.id });
      return false;
    }
  }, [user, loyaltyData]);

  useEffect(() => {
    loadInitialData(false);
    performanceMonitor.trackWebVitals();
  }, [loadInitialData]);

  const value = useMemo(() => ({
    user,
    loyaltyData,
    isLoading,
    hasError,
    entitiesReady,
    systemHealth,
    awardPoints,
    awardBadge,
    tierConfig: tierConfig || {},
    refreshXPData,
    showXPAnimation
  }), [
    user,
    loyaltyData,
    isLoading,
    hasError,
    entitiesReady,
    systemHealth,
    awardPoints,
    awardBadge,
    refreshXPData,
    showXPAnimation
  ]);

  return (
    <XPContext.Provider value={value}>
      {children}
    </XPContext.Provider>
  );
};