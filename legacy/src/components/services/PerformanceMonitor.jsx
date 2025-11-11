import React from 'react';

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
    this.isEnabled = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
    this.initialize();
  }

  initialize() {
    if (!this.isEnabled || typeof window === 'undefined') return;

    // Core Web Vitals
    this.observeWebVitals();
    
    // API Performance
    this.interceptFetch();
    
    // React Component Performance
    this.observeReactPerformance();
    
    // Memory usage
    this.monitorMemory();
  }

  observeWebVitals() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.recordMetric('FID', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.recordMetric('CLS', clsValue);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }
  }

  interceptFetch() {
    if (typeof window === 'undefined') return;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0];
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        
        this.recordMetric('API_RESPONSE_TIME', endTime - startTime, {
          url: typeof url === 'string' ? url : url.url,
          status: response.status,
          success: response.ok
        });
        
        return response;
      } catch (error) {
        const endTime = performance.now();
        
        this.recordMetric('API_ERROR', endTime - startTime, {
          url: typeof url === 'string' ? url : url.url,
          error: error.message
        });
        
        throw error;
      }
    };
  }

  observeReactPerformance() {
    // Monitor React component render times
    if (typeof window !== 'undefined' && window.React && window.React.Profiler) {
      // This would be integrated with React.Profiler in actual components
      this.recordMetric('REACT_PROFILER_AVAILABLE', 1);
    }
  }

  monitorMemory() {
    if (typeof window === 'undefined' || !window.performance.memory) return;

    setInterval(() => {
      const memory = window.performance.memory;
      this.recordMetric('MEMORY_USED', memory.usedJSHeapSize, {
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      });
    }, 30000); // Every 30 seconds
  }

  recordMetric(name, value, metadata = {}) {
    const metric = {
      name,
      value,
      timestamp: Date.now(),
      metadata,
      sessionId: this.getSessionId()
    };

    // Store locally
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name).push(metric);

    // Limit stored metrics to prevent memory leaks
    if (this.metrics.get(name).length > 100) {
      this.metrics.get(name).shift();
    }

    // Send to analytics service (in production)
    this.sendToAnalytics(metric);

    // Check for performance alerts
    this.checkAlerts(name, value);
  }

  sendToAnalytics(metric) {
    if (!this.isEnabled) return;

    // Batch metrics to reduce network calls
    if (!this.metricsBatch) {
      this.metricsBatch = [];
    }
    
    this.metricsBatch.push(metric);
    
    // Send batch every 10 seconds or when it reaches 50 metrics
    if (this.metricsBatch.length >= 50 || !this.batchTimer) {
      this.batchTimer = setTimeout(() => {
        this.flushMetricsBatch();
      }, 10000);
    }
  }

  flushMetricsBatch() {
    if (!this.metricsBatch || this.metricsBatch.length === 0) return;

    // In production, send to your analytics service
    console.log('Sending performance metrics:', this.metricsBatch);
    
    // Example: Send to hypothetical analytics service
    // fetch('/api/analytics/performance', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ metrics: this.metricsBatch })
    // }).catch(console.error);

    this.metricsBatch = [];
    this.batchTimer = null;
  }

  checkAlerts(name, value) {
    const alerts = {
      'LCP': { threshold: 2500, message: 'Largest Contentful Paint is slow' },
      'FID': { threshold: 100, message: 'First Input Delay is high' },
      'CLS': { threshold: 0.1, message: 'Cumulative Layout Shift is high' },
      'API_RESPONSE_TIME': { threshold: 5000, message: 'API response time is slow' },
      'MEMORY_USED': { threshold: 50 * 1024 * 1024, message: 'Memory usage is high' } // 50MB
    };

    const alert = alerts[name];
    if (alert && value > alert.threshold) {
      console.warn(`Performance Alert: ${alert.message}`, { metric: name, value });
      
      // In production, send alert to monitoring service
      this.sendAlert(name, value, alert.message);
    }
  }

  sendAlert(metric, value, message) {
    // Send to monitoring service (PagerDuty, Slack, etc.)
    console.error('PERFORMANCE ALERT:', { metric, value, message });
  }

  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    return this.sessionId;
  }

  getMetrics(metricName) {
    return this.metrics.get(metricName) || [];
  }

  getAverageMetric(metricName, timeWindowMs = 300000) { // 5 minutes default
    const metrics = this.getMetrics(metricName);
    const cutoff = Date.now() - timeWindowMs;
    const recentMetrics = metrics.filter(m => m.timestamp > cutoff);
    
    if (recentMetrics.length === 0) return null;
    
    const sum = recentMetrics.reduce((acc, m) => acc + m.value, 0);
    return sum / recentMetrics.length;
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.flushMetricsBatch();
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceMetric = (metricName) => {
  const [value, setValue] = React.useState(null);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      const average = performanceMonitor.getAverageMetric(metricName);
      setValue(average);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [metricName]);
  
  return value;
};