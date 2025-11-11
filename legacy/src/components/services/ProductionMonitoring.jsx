import { performanceMonitor } from './PerformanceMonitoringService';
import { auditLogger } from './AuditLogger';

/**
 * Production monitoring and alerting service
 */
class ProductionMonitoring {
  constructor() {
    this.errorThreshold = 10; // errors per minute
    this.errorCount = 0;
    this.lastErrorReset = Date.now();
    this.criticalErrors = [];
  }

  /**
   * Log production error with context
   */
  logError(error, context = {}) {
    this.errorCount++;
    
    // Reset counter every minute
    const now = Date.now();
    if (now - this.lastErrorReset > 60000) {
      this.errorCount = 1;
      this.lastErrorReset = now;
    }

    // Check if we're above threshold
    if (this.errorCount > this.errorThreshold) {
      this.alertHighErrorRate();
    }

    // Track in performance monitor
    performanceMonitor.trackError(error, context);

    // Audit log for security-related errors
    if (context.security) {
      auditLogger.log('SECURITY_ERROR', {
        error: error.message,
        context
      });
    }

    // Log to console in development (check for localhost)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.error('[Production Monitor]', error, context);
    }
  }

  /**
   * Alert on high error rate
   */
  alertHighErrorRate() {
    console.warn('[ALERT] High error rate detected:', this.errorCount, 'errors in last minute');
    
    // In production, this would send to monitoring service
    // (Sentry, DataDog, etc.)
  }

  /**
   * Track user action for analytics
   */
  trackAction(action, data = {}) {
    performanceMonitor.trackEvent(action, data);
    
    // Log important actions
    if (data.important) {
      auditLogger.log(action, data);
    }
  }

  /**
   * Track page view with timing
   */
  trackPageView(pageName, loadTime) {
    performanceMonitor.trackPageLoad(pageName, loadTime);
    
    // Alert on slow page loads
    if (loadTime > 3000) {
      console.warn(`[PERFORMANCE] Slow page load: ${pageName} took ${loadTime}ms`);
    }
  }

  /**
   * Track API call performance
   */
  trackAPICall(endpoint, duration, success) {
    const context = {
      endpoint,
      duration,
      success,
      timestamp: new Date().toISOString()
    };

    if (!success) {
      this.logError(new Error(`API call failed: ${endpoint}`), context);
    }

    performanceMonitor.trackEvent('api_call', context);
  }

  /**
   * Get monitoring summary
   */
  getSummary() {
    return {
      errorCount: this.errorCount,
      criticalErrors: this.criticalErrors,
      performance: performanceMonitor.getReport()
    };
  }
}

export const productionMonitoring = new ProductionMonitoring();