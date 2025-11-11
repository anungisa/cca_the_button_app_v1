/**
 * Enhanced Entity Hook
 * React hook wrapper for EnhancedEntityService with optimistic updates
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { enhancedEntityService } from '../services/EnhancedEntityService';
import { performanceMonitor } from '../services/PerformanceMonitoringService';

export function useEnhancedEntity(Entity, options = {}) {
  const {
    autoLoad = true,
    filters = null,
    sortBy = '-created_date',
    limit = 100,
    cacheTTL = 5,
    pollInterval = null
  } = options;

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(autoLoad);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const pollIntervalRef = useRef(null);

  const load = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      const result = filters
        ? await enhancedEntityService.filter(Entity, filters, sortBy, limit, { 
            useCache: !forceRefresh, 
            cacheTTL 
          })
        : await enhancedEntityService.list(Entity, sortBy, limit, { 
            useCache: !forceRefresh, 
            cacheTTL 
          });

      setData(result || []);
      setLastFetch(new Date());
      
      performanceMonitor.trackPageLoad(
        `useEnhancedEntity.${Entity.name}`,
        Date.now() - startTime
      );
      
      return result;
    } catch (err) {
      setError(err);
      performanceMonitor.trackError(err, { 
        hook: 'useEnhancedEntity', 
        entity: Entity.name 
      });
      console.error(`Error loading ${Entity.name}:`, err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [Entity, filters, sortBy, limit, cacheTTL]);

  const create = useCallback(async (newData, idempotencyKey = null) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticData = { ...newData, id: tempId };

    // Optimistic update
    setData(prev => [optimisticData, ...prev]);

    try {
      const result = await enhancedEntityService.create(Entity, newData, { idempotencyKey });
      
      // Replace optimistic with real data
      setData(prev => [result, ...prev.filter(item => item.id !== tempId)]);
      
      return result;
    } catch (err) {
      // Rollback on error
      setData(prev => prev.filter(item => item.id !== tempId));
      setError(err);
      throw err;
    }
  }, [Entity]);

  const update = useCallback(async (id, updates, idempotencyKey = null) => {
    const originalData = [...data];
    
    // Optimistic update
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));

    try {
      const result = await enhancedEntityService.update(Entity, id, updates, { idempotencyKey });
      
      // Confirm with real data
      setData(prev => prev.map(item => 
        item.id === id ? result : item
      ));
      
      return result;
    } catch (err) {
      // Rollback on error
      setData(originalData);
      setError(err);
      throw err;
    }
  }, [Entity, data]);

  const remove = useCallback(async (id) => {
    const originalData = [...data];
    
    // Optimistic delete
    setData(prev => prev.filter(item => item.id !== id));

    try {
      await enhancedEntityService.delete(Entity, id);
    } catch (err) {
      // Rollback on error
      setData(originalData);
      setError(err);
      throw err;
    }
  }, [Entity, data]);

  const refresh = useCallback(() => {
    return load(true);
  }, [load]);

  useEffect(() => {
    if (autoLoad) {
      load();
    }
  }, [autoLoad, load]);

  // Polling
  useEffect(() => {
    if (pollInterval && pollInterval > 0) {
      pollIntervalRef.current = setInterval(() => {
        load(false); // Use cache but check for updates
      }, pollInterval);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [pollInterval, load]);

  return {
    data,
    isLoading,
    error,
    lastFetch,
    create,
    update,
    remove,
    refresh,
    load
  };
}

export default useEnhancedEntity;