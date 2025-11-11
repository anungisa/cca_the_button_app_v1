/**
 * Failover Service
 * Implements automatic failover strategies for critical services
 */

import { fallbackService } from './FallbackService';
import { enhancedCache } from './EnhancedCacheService';
import { performanceMonitor } from './PerformanceMonitoringService';

class FailoverService {
  constructor() {
    this.failoverStrategies = new Map();
    this.activeFailovers = new Set();
    this.registerDefaultStrategies();
  }

  registerDefaultStrategies() {
    // Database failover - use cache then static data
    this.register('database', async (operation, params) => {
      // Try cache first
      const cacheKey = `failover-${operation}-${JSON.stringify(params)}`;
      const cached = enhancedCache.get(cacheKey);
      
      if (cached) {
        console.log('✅ Database failover: Using cached data');
        return { data: cached, source: 'cache', failover: true };
      }

      // Fall back to static data
      console.warn('⚠️ Database failover: Using static fallback');
      const fallbackData = await fallbackService.execute(`entity.${operation}`, params);
      
      return { data: fallbackData, source: 'fallback', failover: true };
    });

    // API failover - use cached responses
    this.register('api', async (endpoint, params) => {
      const cacheKey = `api-failover-${endpoint}`;
      const cached = enhancedCache.get(cacheKey);
      
      if (cached) {
        console.log(`✅ API failover for ${endpoint}: Using cached response`);
        return { ...cached, failover: true };
      }

      console.error(`❌ No failover data available for API: ${endpoint}`);
      throw new Error('Service unavailable and no cached data');
    });

    // Integration failover
    this.register('integration', async (integrationName, params) => {
      console.warn(`⚠️ Integration failover for: ${integrationName}`);
      return { 
        success: false, 
        error: 'Service temporarily unavailable',
        failover: true 
      };
    });
  }

  register(serviceName, strategyFn) {
    this.failoverStrategies.set(serviceName, strategyFn);
  }

  async executeFailover(serviceName, operation, params) {
    const strategy = this.failoverStrategies.get(serviceName);
    
    if (!strategy) {
      console.error(`No failover strategy for service: ${serviceName}`);
      throw new Error(`Failover unavailable for ${serviceName}`);
    }

    // Mark failover as active
    this.activeFailovers.add(serviceName);
    
    try {
      const result = await strategy(operation, params);
      
      // Track failover event
      performanceMonitor.trackEvent('Failover', {
        service: serviceName,
        operation,
        success: true
      });
      
      return result;
    } catch (error) {
      performanceMonitor.trackEvent('Failover', {
        service: serviceName,
        operation,
        success: false,
        error: error.message
      });
      
      throw error;
    } finally {
      // Check if we can restore service
      setTimeout(() => {
        this.tryRestore(serviceName);
      }, 30000); // Try restore after 30 seconds
    }
  }

  async tryRestore(serviceName) {
    // Test if service is back online
    console.log(`Attempting to restore service: ${serviceName}`);
    
    // For now, just remove from active failovers
    // In production, this would ping the service
    this.activeFailovers.delete(serviceName);
    
    performanceMonitor.trackEvent('ServiceRestored', {
      service: serviceName
    });
  }

  isInFailover(serviceName) {
    return this.activeFailovers.has(serviceName);
  }

  getActiveFailovers() {
    return Array.from(this.activeFailovers);
  }

  clearFailover(serviceName) {
    this.activeFailovers.delete(serviceName);
  }

  clearAllFailovers() {
    this.activeFailovers.clear();
  }
}

export const failoverService = new FailoverService();
export default failoverService;