import { useState, useEffect, useRef } from 'react';
import { eventBus } from '../services/EventBus';
import { webSocketService } from '../services/WebSocketService';

/**
 * Hook for real-time data synchronization
 */
export function useRealTimeData(entityName, initialData = null, options = {}) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const subscriptionsRef = useRef([]);

  const {
    autoRefresh = true,
    refreshEvents = [],
    onUpdate = null
  } = options;

  useEffect(() => {
    if (autoRefresh) {
      // Subscribe to relevant server events
      const relevantEvents = [
        `${entityName}.created`,
        `${entityName}.updated`,
        `${entityName}.deleted`,
        ...refreshEvents
      ];

      relevantEvents.forEach(eventName => {
        const unsubscribe = eventBus.subscribe(eventName, handleRealTimeUpdate, {
          context: entityName
        });
        subscriptionsRef.current.push(unsubscribe);
        
        // Also subscribe to server events via WebSocket
        webSocketService.subscribe(eventName);
      });
    }

    return () => {
      // Cleanup subscriptions
      subscriptionsRef.current.forEach(unsubscribe => unsubscribe());
      subscriptionsRef.current = [];
    };
  }, [entityName, autoRefresh, refreshEvents]);

  const handleRealTimeUpdate = async (eventData, metadata) => {
    try {
      setLastUpdated(new Date());
      
      if (onUpdate) {
        const newData = await onUpdate(eventData, metadata, data);
        if (newData !== undefined) {
          setData(newData);
        }
      } else {
        // Default behavior: refresh data
        await refreshData();
      }
    } catch (err) {
      setError(err);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // This would call the appropriate entity method
      // Implementation depends on the specific entity
      const newData = await fetchEntityData(entityName);
      setData(newData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = (updater) => {
    if (typeof updater === 'function') {
      setData(prevData => updater(prevData));
    } else {
      setData(updater);
    }
    setLastUpdated(new Date());
  };

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refreshData,
    updateData,
    isConnected: webSocketService.getStatus().connected
  };
}

/**
 * Hook for real-time incident management
 */
export function useRealTimeIncidents(filters = {}) {
  return useRealTimeData('Incident', [], {
    refreshEvents: [
      'incident.created',
      'incident.updated',
      'incident.escalated',
      'incident.resolved'
    ],
    onUpdate: async (eventData, metadata, currentData) => {
      const { incidentId } = eventData;
      
      switch (metadata.eventName) {
        case 'incident.created':
          // Add new incident to list
          return [...currentData, eventData.incident];
        
        case 'incident.updated':
          // Update existing incident
          return currentData.map(incident => 
            incident.id === incidentId 
              ? { ...incident, ...eventData.updates }
              : incident
          );
        
        case 'incident.resolved':
          // Update status
          return currentData.map(incident => 
            incident.id === incidentId 
              ? { ...incident, status: 'resolved' }
              : incident
          );
        
        default:
          return undefined; // Trigger default refresh
      }
    }
  });
}

/**
 * Hook for real-time sponsorship pipeline
 */
export function useRealTimeSponsorshipPipeline() {
  return useRealTimeData('SponsorDeal', [], {
    refreshEvents: [
      'sponsorship.deal.created',
      'sponsorship.deal.won',
      'sponsorship.deal.lost',
      'sponsorship.contract.signed'
    ],
    onUpdate: async (eventData, metadata, currentData) => {
      const { dealId } = eventData;
      
      switch (metadata.eventName) {
        case 'sponsorship.deal.won':
          return currentData.map(deal => 
            deal.id === dealId 
              ? { ...deal, stage: 'contracted', probability_percent: 100 }
              : deal
          );
        
        case 'sponsorship.deal.lost':
          return currentData.filter(deal => deal.id !== dealId);
        
        default:
          return undefined;
      }
    }
  });
}

/**
 * Hook for real-time event planning
 */
export function useRealTimeEventPlan(planId) {
  return useRealTimeData('EventPlan', null, {
    refreshEvents: [
      'eventops.task.completed',
      'eventops.milestone.reached',
      'eventops.plan.updated'
    ],
    onUpdate: async (eventData, metadata, currentData) => {
      if (eventData.planId !== planId) return currentData;
      
      switch (metadata.eventName) {
        case 'eventops.task.completed':
          // Update task status and completion stats
          return {
            ...currentData,
            departments: currentData.departments.map(dept => ({
              ...dept,
              tasks: dept.tasks.map(task => 
                task.task_id === eventData.taskId 
                  ? { ...task, status: 'completed', completed_date: new Date().toISOString() }
                  : task
              )
            }))
          };
        
        default:
          return undefined;
      }
    }
  });
}

// Helper function to fetch entity data
async function fetchEntityData(entityName) {
  // This would be implemented based on the specific entity
  // For now, return empty array
  return [];
}