/**
 * Enhanced Entity Service
 * Wraps entity calls with circuit breaker, retry logic, caching, and deduplication
 * This is the ONLY way to interact with entities in production code.
 */

import CircuitBreaker from './CircuitBreaker';
import { RetryService } from './RetryService';
import { enhancedCache } from './EnhancedCacheService';
import { requestDeduplicator } from './RequestDeduplicator';
import { performanceMonitor } from './PerformanceMonitoringService';
import { idempotencyService } from './IdempotencyService';

class EnhancedEntityService {
  constructor() {
    this.circuitBreakers = new Map();
    this.operationCount = 0;
  }

  getCircuitBreaker(entityName) {
    if (!this.circuitBreakers.has(entityName)) {
      this.circuitBreakers.set(entityName, new CircuitBreaker(5, 60000));
    }
    return this.circuitBreakers.get(entityName);
  }

  async list(Entity, sortBy = '-created_date', limit = 100, options = {}) {
    const { useCache = true, cacheTTL = 5, skipCircuitBreaker = false } = options;
    const cacheKey = `${Entity.name}-list-${sortBy}-${limit}`;
    this.operationCount++;

    if (useCache) {
      const cached = enhancedCache.get(cacheKey);
      if (cached) {
        performanceMonitor.trackCacheHit(cacheKey);
        return cached;
      }
    }

    const startTime = Date.now();
    const circuitBreaker = this.getCircuitBreaker(Entity.name);

    try {
      const result = await requestDeduplicator.deduplicate(cacheKey, async () => {
        const executeFn = () => RetryService.withRetry(
          () => Entity.list(sortBy, limit),
          { 
            maxRetries: 3,
            shouldRetry: RetryService.shouldRetryError 
          }
        );

        return skipCircuitBreaker 
          ? await executeFn()
          : await circuitBreaker.call(executeFn, () => enhancedCache.get(cacheKey) || []);
      });

      if (useCache && result) {
        enhancedCache.set(cacheKey, result, cacheTTL);
      }

      performanceMonitor.trackAPICall(
        `${Entity.name}.list`,
        Date.now() - startTime,
        'success'
      );

      return result || [];
    } catch (error) {
      performanceMonitor.trackAPICall(
        `${Entity.name}.list`,
        Date.now() - startTime,
        'error'
      );
      performanceMonitor.trackError(error, { entity: Entity.name, operation: 'list' });
      
      // Return stale cache as ultimate fallback
      const staleCache = enhancedCache.get(cacheKey);
      if (staleCache) {
        console.warn(`Returning stale cache for ${cacheKey} due to error`);
        return staleCache;
      }
      
      throw error;
    }
  }

  async filter(Entity, filters, sortBy = '-created_date', limit = 100, options = {}) {
    const { useCache = true, cacheTTL = 3 } = options;
    const filterHash = JSON.stringify(filters);
    const cacheKey = `${Entity.name}-filter-${filterHash}-${sortBy}-${limit}`;
    this.operationCount++;

    if (useCache) {
      const cached = enhancedCache.get(cacheKey);
      if (cached) {
        performanceMonitor.trackCacheHit(cacheKey);
        return cached;
      }
    }

    const startTime = Date.now();
    const circuitBreaker = this.getCircuitBreaker(Entity.name);

    try {
      const result = await requestDeduplicator.deduplicate(cacheKey, async () => {
        return await circuitBreaker.call(
          () => RetryService.withRetry(
            () => Entity.filter(filters, sortBy, limit),
            { shouldRetry: RetryService.shouldRetryError }
          )
        );
      });

      if (useCache && result) {
        enhancedCache.set(cacheKey, result, cacheTTL);
      }

      performanceMonitor.trackAPICall(
        `${Entity.name}.filter`,
        Date.now() - startTime,
        'success'
      );

      return result || [];
    } catch (error) {
      performanceMonitor.trackAPICall(
        `${Entity.name}.filter`,
        Date.now() - startTime,
        'error'
      );
      
      const staleCache = enhancedCache.get(cacheKey);
      if (staleCache) {
        return staleCache;
      }
      
      throw error;
    }
  }

  async create(Entity, data, options = {}) {
    const { idempotencyKey = null, skipInvalidation = false } = options;
    const startTime = Date.now();
    this.operationCount++;

    try {
      const createFn = () => Entity.create(data);

      const result = idempotencyKey
        ? await idempotencyService.execute(idempotencyKey, createFn)
        : await createFn();

      if (!skipInvalidation) {
        enhancedCache.invalidatePattern(`${Entity.name}-list`);
        enhancedCache.invalidatePattern(`${Entity.name}-filter`);
      }

      performanceMonitor.trackAPICall(
        `${Entity.name}.create`,
        Date.now() - startTime,
        'success'
      );

      return result;
    } catch (error) {
      performanceMonitor.trackAPICall(
        `${Entity.name}.create`,
        Date.now() - startTime,
        'error'
      );
      throw error;
    }
  }

  async update(Entity, id, data, options = {}) {
    const { idempotencyKey = null, skipInvalidation = false } = options;
    const startTime = Date.now();
    this.operationCount++;

    try {
      const updateFn = () => Entity.update(id, data);

      const result = idempotencyKey
        ? await idempotencyService.execute(idempotencyKey, updateFn)
        : await updateFn();

      if (!skipInvalidation) {
        enhancedCache.remove(`${Entity.name}-${id}`);
        enhancedCache.invalidatePattern(`${Entity.name}-list`);
        enhancedCache.invalidatePattern(`${Entity.name}-filter`);
      }

      performanceMonitor.trackAPICall(
        `${Entity.name}.update`,
        Date.now() - startTime,
        'success'
      );

      return result;
    } catch (error) {
      performanceMonitor.trackAPICall(
        `${Entity.name}.update`,
        Date.now() - startTime,
        'error'
      );
      throw error;
    }
  }

  async delete(Entity, id, options = {}) {
    const { skipInvalidation = false } = options;
    const startTime = Date.now();
    this.operationCount++;

    try {
      await Entity.delete(id);

      if (!skipInvalidation) {
        enhancedCache.remove(`${Entity.name}-${id}`);
        enhancedCache.invalidatePattern(`${Entity.name}-list`);
        enhancedCache.invalidatePattern(`${Entity.name}-filter`);
      }

      performanceMonitor.trackAPICall(
        `${Entity.name}.delete`,
        Date.now() - startTime,
        'success'
      );
    } catch (error) {
      performanceMonitor.trackAPICall(
        `${Entity.name}.delete`,
        Date.now() - startTime,
        'error'
      );
      throw error;
    }
  }

  async bulkCreate(Entity, dataArray, options = {}) {
    const startTime = Date.now();
    this.operationCount++;

    try {
      const result = await Entity.bulkCreate(dataArray);

      enhancedCache.invalidatePattern(`${Entity.name}-list`);
      enhancedCache.invalidatePattern(`${Entity.name}-filter`);

      performanceMonitor.trackAPICall(
        `${Entity.name}.bulkCreate`,
        Date.now() - startTime,
        'success'
      );

      return result;
    } catch (error) {
      performanceMonitor.trackAPICall(
        `${Entity.name}.bulkCreate`,
        Date.now() - startTime,
        'error'
      );
      throw error;
    }
  }

  getStats() {
    return {
      totalOperations: this.operationCount,
      circuitBreakers: Array.from(this.circuitBreakers.entries()).map(([name, cb]) => ({
        entity: name,
        ...cb.getState()
      })),
      cacheStats: enhancedCache.getStats(),
      performanceStats: performanceMonitor.getMetrics()
    };
  }

  resetAllCircuitBreakers() {
    this.circuitBreakers.forEach(cb => cb.reset());
  }
}

export const enhancedEntityService = new EnhancedEntityService();
export default enhancedEntityService;