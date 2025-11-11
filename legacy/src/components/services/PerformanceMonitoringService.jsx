/**
 * Performance Monitoring Service
 * Tracks application performance metrics and provides insights
 */

class PerformanceMonitoringService {
  constructor() {
    this.metrics = {
      apiCalls: [],
      pageLoads: [],
      errors: [],
      cacheHits: 0,
      cacheMisses: 0
    };
    this.maxMetricsStored = 1000;
  }

  trackAPICall(apiName, duration, status) {
    const metric = {
      api: apiName,
      duration,
      status,
      timestamp: Date.now()
    };

    this.metrics.apiCalls.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.apiCalls.length > this.maxMetricsStored) {
      this.metrics.apiCalls = this.metrics.apiCalls.slice(-this.maxMetricsStored);
    }

    // Warn on slow calls
    if (duration > 3000) {
      console.warn(`Slow API call detected: ${apiName} took ${duration}ms`);
    }
  }

  trackPageLoad(pageName, duration) {
    const metric = {
      page: pageName,
      duration,
      timestamp: Date.now()
    };

    this.metrics.pageLoads.push(metric);
    
    if (this.metrics.pageLoads.length > this.maxMetricsStored) {
      this.metrics.pageLoads = this.metrics.pageLoads.slice(-this.maxMetricsStored);
    }

    // Track Core Web Vitals equivalent
    if (duration > 2500) {
      console.warn(`Slow page load: ${pageName} took ${duration}ms (target: <2500ms)`);
    }
  }

  trackError(error, context = {}) {
    const errorMetric = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      context,
      timestamp: Date.now()
    };

    this.metrics.errors.push(errorMetric);
    
    if (this.metrics.errors.length > this.maxMetricsStored) {
      this.metrics.errors = this.metrics.errors.slice(-this.maxMetricsStored);
    }

    console.error('Error tracked:', errorMetric);
  }

  trackCacheHit(key) {
    this.metrics.cacheHits++;
  }

  trackCacheMiss(key) {
    this.metrics.cacheMisses++;
  }

  getMetrics(timeWindow = 3600000) { // Default: last hour
    const now = Date.now();
    const cutoff = now - timeWindow;

    const recentAPICalls = this.metrics.apiCalls.filter(m => m.timestamp > cutoff);
    const recentPageLoads = this.metrics.pageLoads.filter(m => m.timestamp > cutoff);
    const recentErrors = this.metrics.errors.filter(m => m.timestamp > cutoff);

    // Calculate statistics
    const calculateStats = (values) => {
      if (values.length === 0) return { p50: 0, p95: 0, p99: 0, avg: 0 };
      
      const sorted = [...values].sort((a, b) => a - b);
      const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
      
      return {
        p50: sorted[Math.floor(sorted.length * 0.5)] || 0,
        p95: sorted[Math.floor(sorted.length * 0.95)] || 0,
        p99: sorted[Math.floor(sorted.length * 0.99)] || 0,
        avg: Math.round(avg)
      };
    };

    const apiDurations = recentAPICalls.map(m => m.duration);
    const pageDurations = recentPageLoads.map(m => m.duration);

    return {
      timeWindow,
      apiCalls: {
        total: recentAPICalls.length,
        success: recentAPICalls.filter(m => m.status === 'success').length,
        errors: recentAPICalls.filter(m => m.status === 'error').length,
        latency: calculateStats(apiDurations),
        errorRate: recentAPICalls.length > 0 
          ? (recentAPICalls.filter(m => m.status === 'error').length / recentAPICalls.length) * 100 
          : 0
      },
      pageLoads: {
        total: recentPageLoads.length,
        latency: calculateStats(pageDurations),
        slowestPages: recentPageLoads
          .sort((a, b) => b.duration - a.duration)
          .slice(0, 10)
          .map(p => ({ page: p.page, loadTime: p.duration }))
      },
      errors: {
        total: recentErrors.length,
        byType: this.groupErrorsByType(recentErrors),
        recent: recentErrors.slice(-10)
      },
      cache: {
        hitRate: this.metrics.cacheHits + this.metrics.cacheMisses > 0
          ? (this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses)) * 100
          : 0,
        hits: this.metrics.cacheHits,
        misses: this.metrics.cacheMisses
      }
    };
  }

  groupErrorsByType(errors) {
    const grouped = {};
    errors.forEach(err => {
      const type = err.context?.entity || err.context?.component || 'unknown';
      grouped[type] = (grouped[type] || 0) + 1;
    });
    return grouped;
  }

  resetMetrics() {
    this.metrics = {
      apiCalls: [],
      pageLoads: [],
      errors: [],
      cacheHits: 0,
      cacheMisses: 0
    };
  }

  // Real User Monitoring (RUM) - track actual user experience
  trackWebVitals() {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.renderTime || entry.loadTime);
        }
      }
    });
    
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Not supported in all browsers
    }
  }
}

export const performanceMonitor = new PerformanceMonitoringService();
export default performanceMonitor;