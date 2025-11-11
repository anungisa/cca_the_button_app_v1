import { useState, useEffect } from 'react';
import { predictiveService } from '../services/PredictiveInteroperabilityService';
import { eventBus } from '../services/EventBus';
import { User } from '@/api/entities';

/**
 * Hook for predictive data loading
 */
export const usePredictiveData = (entityType) => {
  const [predictedData, setPredictedData] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isPreloading, setIsPreloading] = useState(false);

  useEffect(() => {
    const loadPredictedData = async () => {
      try {
        const user = await User.me();
        
        // Check if data is already preloaded
        const preloaded = predictiveService.getPreloadedData(entityType);
        if (preloaded) {
          setPredictedData(preloaded);
        }

        // Get current predictions
        const userPredictions = predictiveService.getPredictions(user.id);
        setPredictions(userPredictions);

      } catch (error) {
        console.error('Error loading predictive data:', error);
      }
    };

    loadPredictedData();

    // Listen for prediction updates
    const unsubscribe = eventBus.subscribe('prediction.updated', (data) => {
      if (data.entityType === entityType) {
        setPredictedData(data.data);
      }
    });

    return unsubscribe;
  }, [entityType]);

  return {
    predictedData,
    predictions,
    isPreloading,
    hasPredictedData: !!predictedData
  };
};

/**
 * Hook for offline-aware data operations
 */
export const useOfflineAwareData = (entityType, entityId = null) => {
  const [data, setData] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [queuedActions, setQueuedActions] = useState([]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const executeAction = async (actionType, actionData) => {
    // Use dynamic import instead of require
    const { offlineService } = await import('../services/OfflineInteroperabilityService');
    
    try {
      const result = await offlineService.executeAction(actionType, actionData, {
        allowOfflineFallback: true
      });

      if (result.queued) {
        setQueuedActions(prev => [...prev, { actionType, actionData, timestamp: Date.now() }]);
      }

      return result;
    } catch (error) {
      console.error('Action execution failed:', error);
      throw error;
    }
  };

  const getOfflineData = async () => {
    // Use dynamic import instead of require
    const { offlineService } = await import('../services/OfflineInteroperabilityService');
    return offlineService.getOfflineData(entityType, entityId);
  };

  return {
    data,
    isOffline,
    queuedActions,
    executeAction,
    getOfflineData
  };
};

/**
 * Hook for real-time analytics
 */
export const useRealTimeAnalytics = (metricName) => {
  const [metrics, setMetrics] = useState(null);
  const [insights, setInsights] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      const { advancedAnalytics } = await import('../services/AdvancedAnalyticsService');
      
      // Get current metrics
      const dashboard = advancedAnalytics.getRealTimeDashboard();
      setMetrics(dashboard[metricName]);

      // Generate insights
      const aiInsights = await advancedAnalytics.generateInsights(metricName);
      setInsights(aiInsights);
    };

    loadAnalytics();

    // Listen for real-time updates
    const unsubscribe = eventBus.subscribe('analytics.real_time_update', (data) => {
      if (data.metric === metricName) {
        setMetrics(prev => ({
          ...prev,
          current: data.values,
          lastUpdated: data.timestamp
        }));
      }
    });

    // Listen for alerts
    const alertUnsub = eventBus.subscribe('analytics.alert', (data) => {
      if (data.metric === metricName) {
        setAlerts(prev => [...prev, data]);
      }
    });

    return () => {
      unsubscribe();
      alertUnsub();
    };
  }, [metricName]);

  return {
    metrics,
    insights,
    alerts,
    isLoading: !metrics
  };
};