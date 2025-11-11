/**
 * Health Check Service
 * Monitors system health and provides degradation strategies
 */

import { enhancedEntityService } from './EnhancedEntityService';
import { performanceMonitor } from './PerformanceMonitoringService';
import { enhancedCache } from './EnhancedCacheService';
import { Club } from '@/api/entities';
import { Event } from '@/api/entities';
import { User } from '@/api/entities';

class HealthCheckService {
  constructor() {
    this.healthStatus = {
      overall: 'healthy',
      services: {},
      lastCheck: null,
      degradationMode: false
    };
    this.checkInterval = null;
  }

  async checkHealth(detailed = false) {
    const startTime = Date.now();
    const checks = {
      database: this.checkDatabase(),
      cache: this.checkCache(),
      performance: this.checkPerformance()
    };

    if (detailed) {
      checks.entities = this.checkEntities();
      checks.circuitBreakers = this.checkCircuitBreakers();
    }

    const results = await Promise.allSettled(Object.values(checks));
    const services = {};
    
    Object.keys(checks).forEach((key, index) => {
      if (results[index].status === 'fulfilled') {
        services[key] = results[index].value;
      } else {
        services[key] = {
          status: 'unhealthy',
          error: results[index].reason?.message || 'Unknown error'
        };
      }
    });

    // Determine overall health
    const unhealthyCount = Object.values(services).filter(s => s.status === 'unhealthy').length;
    const degradedCount = Object.values(services).filter(s => s.status === 'degraded').length;

    let overall = 'healthy';
    if (unhealthyCount > 0) {
      overall = 'unhealthy';
      this.enableDegradationMode();
    } else if (degradedCount > 0) {
      overall = 'degraded';
    } else {
      this.disableDegradationMode();
    }

    this.healthStatus = {
      overall,
      services,
      lastCheck: new Date().toISOString(),
      checkDuration: Date.now() - startTime,
      degradationMode: this.healthStatus.degradationMode,
      performance: performanceMonitor.getMetrics(60000), // Last minute
      cache: enhancedCache.getStats()
    };

    return this.healthStatus;
  }

  async checkDatabase() {
    const startTime = Date.now();
    try {
      // Try a simple query
      await enhancedEntityService.list(User, '-created_date', 1, { 
        useCache: false,
        skipCircuitBreaker: true 
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        responseTime,
        message: responseTime < 1000 ? 'Database responding normally' : 'Database slow'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        responseTime: Date.now() - startTime
      };
    }
  }

  checkCache() {
    try {
      const stats = enhancedCache.getStats();
      const utilizationPercent = (stats.entries / stats.maxSize) * 100;
      
      let status = 'healthy';
      if (utilizationPercent > 90) {
        status = 'degraded';
      }
      if (stats.entries === 0 && stats.totalSizeBytes === 0) {
        status = 'degraded'; // Cache not being used
      }

      return {
        status,
        ...stats,
        utilizationPercent: Math.round(utilizationPercent)
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  checkPerformance() {
    const metrics = performanceMonitor.getMetrics(300000); // Last 5 minutes
    
    let status = 'healthy';
    
    // Check API latency
    if (metrics.apiCalls.latency.p95 > 3000) {
      status = 'degraded';
    }
    
    // Check error rate
    if (metrics.apiCalls.errorRate > 10) {
      status = 'degraded';
    }
    if (metrics.apiCalls.errorRate > 25) {
      status = 'unhealthy';
    }

    return {
      status,
      apiLatencyP95: metrics.apiCalls.latency.p95,
      errorRate: Math.round(metrics.apiCalls.errorRate * 10) / 10,
      totalAPICalls: metrics.apiCalls.total
    };
  }

  async checkEntities() {
    const criticalEntities = [
      { Entity: Club, name: 'Club' },
      { Entity: Event, name: 'Event' },
      { Entity: User, name: 'User' }
    ];

    const results = {};
    
    for (const { Entity, name } of criticalEntities) {
      const startTime = Date.now();
      try {
        await enhancedEntityService.list(Entity, '-created_date', 1, { 
          useCache: false,
          skipCircuitBreaker: true 
        });
        
        const responseTime = Date.now() - startTime;
        results[name] = {
          status: responseTime < 500 ? 'healthy' : 'degraded',
          responseTime
        };
      } catch (error) {
        results[name] = {
          status: 'unhealthy',
          error: error.message
        };
      }
    }

    return results;
  }

  checkCircuitBreakers() {
    const stats = enhancedEntityService.getStats();
    const breakersOpen = stats.circuitBreakers?.filter(cb => cb.state === 'OPEN').length || 0;
    
    return {
      status: breakersOpen > 0 ? 'degraded' : 'healthy',
      openBreakers: breakersOpen,
      totalBreakers: stats.circuitBreakers?.length || 0,
      breakers: stats.circuitBreakers || []
    };
  }

  enableDegradationMode() {
    if (!this.healthStatus.degradationMode) {
      console.warn('🔴 DEGRADATION MODE ENABLED - Using fallbacks and stale data');
      this.healthStatus.degradationMode = true;
      
      // Notify user
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('system-degraded', {
          detail: { message: 'System experiencing issues. Some features may be limited.' }
        });
        window.dispatchEvent(event);
      }
    }
  }

  disableDegradationMode() {
    if (this.healthStatus.degradationMode) {
      console.log('✅ DEGRADATION MODE DISABLED - System recovered');
      this.healthStatus.degradationMode = false;
      
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('system-recovered', {
          detail: { message: 'System has recovered. All features restored.' }
        });
        window.dispatchEvent(event);
      }
    }
  }

  isDegraded() {
    return this.healthStatus.degradationMode;
  }

  getStatus() {
    return this.healthStatus;
  }

  startPeriodicChecks(intervalMs = 60000) {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      this.checkHealth(false).catch(error => {
        console.error('Health check failed:', error);
      });
    }, intervalMs);

    // Initial check
    this.checkHealth(false);
  }

  stopPeriodicChecks() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

export const healthCheckService = new HealthCheckService();
export default healthCheckService;