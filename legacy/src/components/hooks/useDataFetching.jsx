import { useState, useEffect, useCallback } from 'react';
import { performanceMonitor } from '../services/PerformanceMonitoringService';

/**
 * Enhanced data fetching hook with loading, error, and retry logic
 */
export const useDataFetching = (fetchFunction, dependencies = [], options = {}) => {
  const {
    enabled = true,
    retry = true,
    maxRetries = 3,
    retryDelay = 1000,
    onSuccess = null,
    onError = null,
    cacheTime = 0
  } = options;

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async (isRetry = false) => {
    if (!enabled) return;

    const startTime = Date.now();
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();
      setData(result);
      setRetryCount(0);
      
      if (onSuccess) onSuccess(result);
      
      // Track performance
      performanceMonitor.trackPageLoad(
        'data-fetch',
        Date.now() - startTime
      );

    } catch (err) {
      console.error('Data fetching error:', err);
      setError(err);

      // Retry logic
      if (retry && retryCount < maxRetries && !isRetry) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          fetchData(true);
        }, retryDelay * (retryCount + 1)); // Exponential backoff
      } else {
        if (onError) onError(err);
        performanceMonitor.trackError(err, { context: 'data-fetch' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, enabled, retry, retryCount, maxRetries, retryDelay, onSuccess, onError]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  const refetch = useCallback(() => {
    setRetryCount(0);
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
    isRetrying: retryCount > 0
  };
};

/**
 * Paginated data fetching hook
 */
export const usePaginatedData = (fetchFunction, pageSize = 20, options = {}) => {
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(async () => {
    const data = await fetchFunction(page, pageSize);
    
    if (page === 1) {
      setAllData(data);
    } else {
      setAllData(prev => [...prev, ...data]);
    }
    
    setHasMore(data.length === pageSize);
    return data;
  }, [fetchFunction, page, pageSize]);

  const { data, isLoading, error, refetch } = useDataFetching(fetchPage, [page], options);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, hasMore]);

  const reset = useCallback(() => {
    setPage(1);
    setAllData([]);
    setHasMore(true);
  }, []);

  return {
    data: allData,
    isLoading,
    error,
    hasMore,
    loadMore,
    reset,
    refetch
  };
};