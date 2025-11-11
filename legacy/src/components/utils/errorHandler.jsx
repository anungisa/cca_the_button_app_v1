import { loggingService } from '../services/LoggingService';

export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', statusCode = 500, isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message, field = null, value = null) {
    super(message, 'VALIDATION_ERROR', 400);
    this.field = field;
    this.value = value;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404);
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network connection failed') {
    super(message, 'NETWORK_ERROR', 0);
  }
}

export class ErrorHandler {
  static handleError(error, context = {}) {
    // Log the error
    loggingService.error('Error occurred', {
      message: error.message,
      code: error.code || 'UNKNOWN',
      stack: error.stack,
      context
    }, error);

    // Determine user-friendly message
    const userMessage = this.getUserFriendlyMessage(error);

    // Report to error tracking service (in production)
    this.reportError(error, context);

    return {
      message: userMessage,
      code: error.code || 'UNKNOWN_ERROR',
      timestamp: new Date().toISOString()
    };
  }

  static getUserFriendlyMessage(error) {
    // Don't expose internal errors to users
    if (error instanceof ValidationError) {
      return error.message;
    }

    if (error instanceof AuthenticationError) {
      return 'Please sign in to continue';
    }

    if (error instanceof AuthorizationError) {
      return 'You don\'t have permission to perform this action';
    }

    if (error instanceof NotFoundError) {
      return error.message;
    }

    if (error instanceof NetworkError) {
      return 'Connection problem. Please check your internet and try again.';
    }

    // Generic message for unknown errors
    return 'Something went wrong. Please try again or contact support if the problem persists.';
  }

  static reportError(error, context) {
    // In production, send to error tracking service (Sentry, Bugsnag, etc.)
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      // Example integration:
      // Sentry.captureException(error, { extra: context });
      console.error('Error reported:', error, context);
    }
  }

  static wrapAsync(fn) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        throw this.normalizeError(error);
      }
    };
  }

  static normalizeError(error) {
    // Convert common error types to AppError instances
    if (error instanceof AppError) {
      return error;
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new NetworkError('Network request failed');
    }

    if (error.status === 401 || error.statusCode === 401) {
      return new AuthenticationError();
    }

    if (error.status === 403 || error.statusCode === 403) {
      return new AuthorizationError();
    }

    if (error.status === 404 || error.statusCode === 404) {
      return new NotFoundError();
    }

    // Default to generic app error
    return new AppError(error.message || 'An unexpected error occurred', 'UNKNOWN_ERROR');
  }
}

// React Hook for error handling - FIXED VERSION
import React from 'react';

export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const handleError = React.useCallback((error, context = {}) => {
    const handledError = ErrorHandler.handleError(error, context);
    setError(handledError);
    return handledError;
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError
  };
};

// Global error boundary helper
export const withErrorBoundary = (Component, fallback = null) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      ErrorHandler.handleError(error, {
        component: Component.displayName || Component.name,
        errorInfo
      });
    }

    render() {
      if (this.state.hasError) {
        if (fallback) {
          return fallback;
        }

        return (
          <div className="flex items-center justify-center min-h-64 p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-brand-text-primary mb-2">
                Something went wrong
              </h2>
              <p className="text-brand-text-secondary mb-4">
                We're sorry for the inconvenience. Please refresh the page or try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-brand-red text-white rounded hover:bg-red-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        );
      }

      return <Component {...this.props} />;
    }
  };
};