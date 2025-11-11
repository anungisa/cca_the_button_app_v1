/**
 * React hook for accessing interoperability services
 * Provides clean interface for components to use the new architecture
 */
import { useState, useEffect, useCallback } from 'react';
import { eventBus, EVENTS } from '../services/EventBus';
import { unifiedDataService } from '../services/UnifiedDataService';
import { masterDataManager } from '../services/MasterDataManager';
import { apiGateway } from '../services/APIGateway';

export function useEventBus() {
  const subscribe = useCallback((eventName, callback, options = {}) => {
    return eventBus.subscribe(eventName, callback, options);
  }, []);

  const publish = useCallback((eventName, data, metadata = {}) => {
    return eventBus.publish(eventName, data, metadata);
  }, []);

  const getHistory = useCallback((eventName, limit) => {
    return eventBus.getHistory(eventName, limit);
  }, []);

  return { subscribe, publish, getHistory };
}

export function useUnifiedData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getConstituent360 = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await unifiedDataService.getConstituent360View(userId);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEventOverview = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await unifiedDataService.getEventOverview(eventId);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCrossFunctionalMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await unifiedDataService.getCrossFunctionalMetrics();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getConstituent360,
    getEventOverview,
    getCrossFunctionalMetrics
  };
}

export function useMasterData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthoritativeData = useCallback(async (entityType, entityId, fields) => {
    setLoading(true);
    setError(null);
    try {
      const data = await masterDataManager.getAuthoritativeData(entityType, entityId, fields);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDataQuality = useCallback(async (entityType) => {
    try {
      return await masterDataManager.getDataQualityMetrics(entityType);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const getDataLineage = useCallback((entityType, entityId) => {
    return masterDataManager.getDataLineage(entityType, entityId);
  }, []);

  return {
    loading,
    error,
    getAuthoritativeData,
    getDataQuality,
    getDataLineage
  };
}

export function useAPIGateway() {
  const [metrics, setMetrics] = useState(null);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    // Subscribe to API events
    const unsubscribe = eventBus.subscribe('api.*', (data, metadata) => {
      // Update metrics when API events occur
      setMetrics(prev => apiGateway.getMetrics());
    });

    return unsubscribe;
  }, []);

  const request = useCallback(async (path, options) => {
    return apiGateway.request(path, options);
  }, []);

  const getMetrics = useCallback(() => {
    const currentMetrics = apiGateway.getMetrics();
    setMetrics(currentMetrics);
    return currentMetrics;
  }, []);

  const getHealth = useCallback(async () => {
    const healthStatus = await apiGateway.healthCheck();
    setHealth(healthStatus);
    return healthStatus;
  }, []);

  return {
    request,
    metrics,
    health,
    getMetrics,
    getHealth
  };
}

export function useWorkflowIntegration() {
  const { publish, subscribe } = useEventBus();
  const [workflows, setWorkflows] = useState([]);

  const triggerWorkflow = useCallback((workflowName, data) => {
    return publish(EVENTS.WORKFLOW_TRIGGERED, {
      workflow: workflowName,
      data,
      triggeredBy: 'user_action'
    });
  }, [publish]);

  const publishBusinessEvent = useCallback((eventType, data, source = 'manual') => {
    return publish(eventType, data, { source });
  }, [publish]);

  // Pre-defined business event publishers
  const sponsorship = {
    dealWon: (dealData) => publishBusinessEvent(EVENTS.DEAL_WON, dealData),
    contractSigned: (contractData) => publishBusinessEvent(EVENTS.CONTRACT_SIGNED, contractData),
    deliverableCompleted: (deliverableData) => publishBusinessEvent(EVENTS.DELIVERABLE_COMPLETED, deliverableData)
  };

  const events = {
    planCreated: (planData) => publishBusinessEvent(EVENTS.EVENT_PLAN_CREATED, planData),
    taskCompleted: (taskData) => publishBusinessEvent(EVENTS.EVENT_TASK_COMPLETED, taskData),
    milestoneReached: (milestoneData) => publishBusinessEvent(EVENTS.EVENT_MILESTONE_REACHED, milestoneData)
  };

  const volunteers = {
    registered: (volunteerData) => publishBusinessEvent(EVENTS.VOLUNTEER_REGISTERED, volunteerData),
    assigned: (assignmentData) => publishBusinessEvent(EVENTS.VOLUNTEER_ASSIGNED, assignmentData),
    complianceExpired: (complianceData) => publishBusinessEvent(EVENTS.COMPLIANCE_EXPIRED, complianceData)
  };

  const incidents = {
    created: (incidentData) => publishBusinessEvent(EVENTS.INCIDENT_CREATED, incidentData),
    escalated: (escalationData) => publishBusinessEvent(EVENTS.INCIDENT_ESCALATED, escalationData),
    resolved: (resolutionData) => publishBusinessEvent(EVENTS.INCIDENT_RESOLVED, resolutionData)
  };

  return {
    triggerWorkflow,
    publishBusinessEvent,
    sponsorship,
    events,
    volunteers,
    incidents
  };
}

// Combined hook for full interoperability features
export function useInteroperability() {
  const eventBus = useEventBus();
  const unifiedData = useUnifiedData();
  const masterData = useMasterData();
  const apiGateway = useAPIGateway();
  const workflow = useWorkflowIntegration();

  return {
    eventBus,
    unifiedData,
    masterData,
    apiGateway,
    workflow
  };
}