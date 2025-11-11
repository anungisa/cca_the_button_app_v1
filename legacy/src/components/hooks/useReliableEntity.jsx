/**
 * Reliable Entity Hook
 * Wraps useEnhancedEntity with additional reliability features
 */

import { useEnhancedEntity } from './useEnhancedEntity';
import { healthCheckService } from '../services/HealthCheckService';
import { failoverService } from '../services/FailoverService';
import { gracefulDegradationService } from '../services/GracefulDegradationService';
import { useState, useEffect } from 'react';

export function useReliableEntity(Entity, options = {}) {
  const [isFeatureAvailable, setIsFeatureAvailable] = useState(true);
  const [usingFailover, setUsingFailover] = useState(false);
  
  const entityHook = useEnhancedEntity(Entity, options);
  
  useEffect(() => {
    // Check if this feature should be degraded
    const featureName = options.featureName || Entity.name.toLowerCase();
    const available = gracefulDegradationService.isFeatureAvailable(featureName);
    setIsFeatureAvailable(available);
  }, [Entity.name, options.featureName]);

  useEffect(() => {
    // Check if we're in failover mode
    const inFailover = failoverService.isInFailover('database');
    setUsingFailover(inFailover);
  }, []);

  // Enhanced create with failover
  const reliableCreate = async (data, idempotencyKey = null) => {
    try {
      return await entityHook.create(data, idempotencyKey);
    } catch (error) {
      console.error('Create failed, attempting failover:', error);
      
      // For creates, we can't really failover - but we can queue for later
      if (typeof window !== 'undefined') {
        const queueKey = `pending-create-${Entity.name}-${Date.now()}`;
        localStorage.setItem(queueKey, JSON.stringify({ data, idempotencyKey, timestamp: Date.now() }));
        console.log('Queued creation for later sync');
      }
      
      throw error;
    }
  };

  // Enhanced update with retry
  const reliableUpdate = async (id, updates, idempotencyKey = null) => {
    try {
      return await entityHook.update(id, updates, idempotencyKey);
    } catch (error) {
      console.error('Update failed:', error);
      
      // Queue for later
      if (typeof window !== 'undefined') {
        const queueKey = `pending-update-${Entity.name}-${id}`;
        localStorage.setItem(queueKey, JSON.stringify({ id, updates, idempotencyKey, timestamp: Date.now() }));
      }
      
      throw error;
    }
  };

  return {
    ...entityHook,
    create: reliableCreate,
    update: reliableUpdate,
    isFeatureAvailable,
    usingFailover,
    systemHealth: healthCheckService.getStatus()
  };
}