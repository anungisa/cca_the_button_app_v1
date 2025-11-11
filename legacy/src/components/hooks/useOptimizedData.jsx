import { useState, useEffect, useCallback } from 'react';
import { OptimizedEntityService } from '../services/OptimizedEntityService';
import { eventBus } from '../services/EventBus';

/**
 * Hook for optimized data fetching with caching and real-time updates
 */
export function useOptimizedData(entityName, options = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({});

  const {
    id = null,
    filters = {},
    fields = null,
    include = null,
    sort = null,
    limit = 50,
    offset = 0,
    cache = true,
    realTime = true
  } = options;

  // Memoized fetch function
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let result;
      
      if (id) {
        result = await OptimizedEntityService.getById(entityName, id, fields);
      } else {
        result = await OptimizedEntityService.getFiltered(entityName, {
          filters,
          sort,
          limit,
          offset,
          fields,
          include
        });
      }

      setData(result.data || result);
      setMeta({
        total: result.total,
        page: result.page,
        hasMore: result.hasMore,
        lastFetched: new Date()
      });
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [entityName, id, JSON.stringify(filters), JSON.stringify(fields), include, sort, limit, offset]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time updates
  useEffect(() => {
    if (!realTime) return;

    const unsubscribes = [];
    
    // Subscribe to relevant events
    const events = [
      `${entityName}.created`,
      `${entityName}.updated`,
      `${entityName}.deleted`
    ];

    events.forEach(eventName => {
      const unsubscribe = eventBus.subscribe(eventName, (eventData) => {
        // Intelligently update data based on event
        if (id && eventData.id === id) {
          // Single entity update
          setData(prev => ({ ...prev, ...eventData }));
        } else if (!id) {
          // List update - might need refetch
          fetchData();
        }
      });
      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [entityName, id, realTime, fetchData]);

  // Optimistic updates
  const updateOptimistically = useCallback((updates) => {
    if (id && typeof updates === 'object') {
      setData(prev => ({ ...prev, ...updates }));
    } else if (Array.isArray(data) && typeof updates === 'function') {
      setData(prev => updates(prev));
    }
  }, [id, data]);

  // Pagination helpers
  const loadMore = useCallback(async () => {
    if (meta.hasMore && !isLoading) {
      const nextResult = await OptimizedEntityService.getFiltered(entityName, {
        filters,
        sort,
        limit,
        offset: offset + limit,
        fields,
        include
      });
      
      setData(prev => [...(prev || []), ...(nextResult.data || nextResult)]);
      setMeta(prev => ({
        ...prev,
        page: nextResult.page,
        hasMore: nextResult.hasMore
      }));
    }
  }, [entityName, filters, sort, limit, offset, fields, include, meta.hasMore, isLoading]);

  return {
    data,
    isLoading,
    error,
    meta,
    refetch: fetchData,
    updateOptimistically,
    loadMore
  };
}

/**
 * Hook for batch operations
 */
export function useBatchOperations() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState([]);

  const executeBatch = useCallback(async (operations) => {
    setIsProcessing(true);
    setResults([]);
    setErrors([]);

    try {
      const batchResult = await OptimizedEntityService.batchOperation(operations);
      setResults(batchResult.results || []);
      setErrors(batchResult.errors || []);
      return batchResult;
    } catch (error) {
      setErrors([error]);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    executeBatch,
    isProcessing,
    results,
    errors
  };
}

/**
 * Hook for aggregated data
 */
export function useAggregatedData(entityName, aggregations, filters = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAggregatedData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await OptimizedEntityService.getAggregated(entityName, {
        filters,
        aggregations
      });
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [entityName, JSON.stringify(aggregations), JSON.stringify(filters)]);

  useEffect(() => {
    fetchAggregatedData();
  }, [fetchAggregatedData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchAggregatedData
  };
}