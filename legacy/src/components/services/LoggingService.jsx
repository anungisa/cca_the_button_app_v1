
/**
 * Centralized Logging Service
 * Provides structured logging across all backend functions and critical frontend operations.
 * In a production system, this would integrate with services like Datadog, New Relic, or CloudWatch.
 */

const LogLevel = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  FATAL: 'FATAL',
};

// Fix 3: Define an explicit order for log levels to enable filtering
const LogLevelOrder = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4,
};

class LoggingService {
  constructor() {
    this.appName = 'The Button';
    // Determine environment based on Deno presence (for server) or absence (client)
    this.environment = typeof Deno !== 'undefined' ? 'server' : 'client';

    // Fix 3: Initialize minimum log level based on environment variable or default
    const defaultMinLogLevel = LogLevel.INFO;
    let configuredLogLevel = defaultMinLogLevel;

    if (typeof Deno !== 'undefined') {
      const envLogLevel = Deno.env.get('LOG_LEVEL');
      if (envLogLevel && LogLevel[envLogLevel.toUpperCase()]) {
        configuredLogLevel = LogLevel[envLogLevel.toUpperCase()];
      }
    } else if (typeof window !== 'undefined') {
      // For client-side, we can default to INFO or check for a global configuration
      // For this implementation, we'll keep INFO as default for client.
      // A more complex setup might check window.location.search for a debug param, etc.
    }
    this.minLogLevel = configuredLogLevel;
  }

  /**
   * Internal method to format and output log entries
   */
  _log(level, message, context = {}) {
    // Fix 3: Filter logs based on the configured minimum log level
    if (LogLevelOrder[level] < LogLevelOrder[this.minLogLevel]) {
      return; // Do not log if the level is below the minimum threshold
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      app: this.appName,
      environment: this.environment,
      message,
      ...context,
    };

    // In production, this would send to an external logging service
    // For now, we use console with structured data
    const logMethod = level === LogLevel.ERROR || level === LogLevel.FATAL ? console.error :
                      level === LogLevel.WARN ? console.warn :
                      console.log;

    // Fix 2: Pass the logEntry object directly to console functions
    // This allows browser/Deno dev tools to display the object interactively,
    // which is better for debugging than a stringified JSON.
    logMethod(logEntry);

    // If it's an error, also store in a hypothetical error tracking system
    if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
      this._trackError(logEntry);
    }
  }

  /**
   * Log debug information (only in development)
   */
  debug(message, context = {}) {
    // Fix 1: Refined check for development environment.
    // 'development' is now explicitly checked for Deno env,
    // rather than just "not production", which could include staging/testing.
    const isDevelopment = (typeof Deno !== 'undefined' && Deno.env.get('ENVIRONMENT') === 'development') ||
                          (typeof window !== 'undefined' && window.location.hostname === 'localhost');
    if (isDevelopment) {
      this._log(LogLevel.DEBUG, message, context);
    }
  }

  /**
   * Log general information
   */
  info(message, context = {}) {
    this._log(LogLevel.INFO, message, context);
  }

  /**
   * Log warnings
   */
  warn(message, context = {}) {
    this._log(LogLevel.WARN, message, context);
  }

  /**
   * Log errors
   */
  error(message, error, context = {}) {
    const errorContext = error instanceof Error ? {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
    } : { errorData: error };

    this._log(LogLevel.ERROR, message, { ...context, ...errorContext });
  }

  /**
   * Log fatal errors that require immediate attention
   */
  fatal(message, error, context = {}) {
    const errorContext = error instanceof Error ? {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
    } : { errorData: error };

    this._log(LogLevel.FATAL, message, { ...context, ...errorContext });
  }

  /**
   * Log performance metrics
   */
  performance(operation, durationMs, context = {}) {
    this._log(LogLevel.INFO, `Performance: ${operation}`, {
      operation,
      durationMs,
      performanceMetric: true,
      ...context,
    });
  }

  /**
   * Log user actions for audit trail
   */
  audit(userId, action, resourceType, resourceId, context = {}) {
    this._log(LogLevel.INFO, `Audit: ${action}`, {
      userId,
      action,
      resourceType,
      resourceId,
      audit: true,
      ...context,
    });
  }

  /**
   * Internal error tracking (would integrate with Sentry, Rollbar, etc.)
   */
  _trackError(logEntry) {
    // In production, send to error tracking service
    // For now, just ensure it's persisted in localStorage if available
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const errors = JSON.parse(localStorage.getItem('recentErrors') || '[]');
        errors.unshift(logEntry);
        localStorage.setItem('recentErrors', JSON.stringify(errors.slice(0, 50))); // Keep last 50 errors
      } catch (e) {
        console.error('Failed to store error in localStorage:', e);
      }
    }
  }
}

// Export singleton instance
export const logger = new LoggingService();
export default logger;
