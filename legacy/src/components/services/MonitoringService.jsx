/**
 * Centralized Monitoring Service
 * Aggregates all monitoring data for observability
 */

import { performanceMonitor } from './PerformanceMonitoringService';
import { healthCheckService } from './HealthCheckService';
import { enhancedCache } from './EnhancedCacheService';
import { rateLimiter } from './RateLimiter';
import { enhancedEntityService } from './EnhancedEntityService';
import { offlineSyncService } from './OfflineSyncService';

class MonitoringService {
  constructor() {
    this.startTime = Date.now();
  }

  getSystemOverview() {
    const health = healthCheckService.getStatus();
    const performance = performanceMonitor.getMetrics(300000); // Last 5 minutes
    const cache = enhancedCache.getStats();
    const entityStats = enhancedEntityService.getStats();

    return {
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      
      health: {
        overall: health.overall,
        degradationMode: health.degradationMode,
        lastCheck: health.lastCheck
      },
      
      performance: {
        apiLatencyP50: performance.apiCalls?.latency?.p50 || 0,
        apiLatencyP95: performance.apiCalls?.latency?.p95 || 0,
        errorRate: performance.apiCalls?.errorRate || 0,
        totalAPICalls: performance.apiCalls?.total || 0,
        totalErrors: performance.errors?.total || 0
      },
      
      cache: {
        hitRate: cache.hitRate || 0,
        entries: cache.entries || 0,
        sizeKB: Math.round((cache.totalSizeBytes || 0) / 1024)
      },
      
      circuitBreakers: {
        total: entityStats.circuitBreakers?.length || 0,
        open: entityStats.circuitBreakers?.filter(cb => cb.state === 'OPEN').length || 0,
        halfOpen: entityStats.circuitBreakers?.filter(cb => cb.state === 'HALF_OPEN').length || 0
      },
      
      offline: {
        isOnline: offlineSyncService.getOnlineStatus(),
        queueSize: offlineSyncService.getQueueSize()
      },
      
      reliability: {
        totalOperations: entityStats.totalOperations || 0,
        cacheHitRate: cache.hitRate || 0
      }
    };
  }

  getHealthReport() {
    return healthCheckService.getStatus();
  }

  getPerformanceReport() {
    return performanceMonitor.getMetrics(3600000); // Last hour
  }

  getUserRateLimitStatus(userId) {
    if (!userId) return null;
    return rateLimiter.getStats(userId);
  }

  logMetric(metricName, value, tags = {}) {
    console.log(`[METRIC] ${metricName}:`, value, tags);
    // In production, send to monitoring service (Datadog, New Relic, etc.)
  }

  logEvent(eventName, properties = {}) {
    console.log(`[EVENT] ${eventName}:`, properties);
    performanceMonitor.trackEvent(eventName, properties);
  }

  async runHealthCheck(detailed = false) {
    return await healthCheckService.checkHealth(detailed);
  }

  getCircuitBreakerStatus() {
    const stats = enhancedEntityService.getStats();
    return stats.circuitBreakers || [];
  }

  resetAllCircuitBreakers() {
    enhancedEntityService.resetAllCircuitBreakers();
    console.log('✅ All circuit breakers reset');
  }

  exportDiagnostics() {
    const diagnostics = {
      overview: this.getSystemOverview(),
      health: this.getHealthReport(),
      performance: this.getPerformanceReport(),
      circuitBreakers: this.getCircuitBreakerStatus(),
      exportedAt: new Date().toISOString()
    };

    // Download as JSON
    const blob = new Blob([JSON.stringify(diagnostics, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    return diagnostics;
  }
}

export const monitoringService = new MonitoringService();
export default monitoringService;