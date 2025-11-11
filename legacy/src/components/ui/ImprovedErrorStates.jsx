
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertCircle, 
  WifiOff, 
  ServerCrash, 
  ShieldAlert,
  RefreshCw,
  Home,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export const ErrorDisplay = ({ 
  error, 
  title = 'Something went wrong',
  description = null,
  onRetry = null,
  showHomeButton = true
}) => {
  // Determine error type
  const getErrorType = () => {
    if (!navigator.onLine) return 'offline';
    // Check if error is an object and has a message property before calling includes
    if (error?.message?.includes('403') || error?.message?.includes('401')) return 'auth';
    if (error?.message?.includes('500')) return 'server';
    return 'general';
  };

  const errorType = getErrorType();

  const errorConfig = {
    offline: {
      icon: WifiOff,
      title: 'No Internet Connection',
      description: 'Please check your connection and try again.',
      color: 'text-orange-500'
    },
    auth: {
      icon: ShieldAlert,
      title: 'Authentication Required',
      description: 'Please sign in to access this content.',
      color: 'text-red-500'
    },
    server: {
      icon: ServerCrash,
      title: 'Server Error',
      description: 'Our servers are experiencing issues. Please try again later.',
      color: 'text-red-500'
    },
    general: {
      icon: AlertCircle,
      title: title,
      description: description || error?.message || 'An unexpected error occurred.',
      color: 'text-yellow-500'
    }
  };

  const config = errorConfig[errorType];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <div className="max-w-md w-full">
        <Alert className="bg-brand-card-bg border-brand-border">
          <Icon className={`h-5 w-5 ${config.color}`} />
          <AlertTitle className="text-brand-text-primary">{config.title}</AlertTitle>
          <AlertDescription className="text-brand-text-secondary mt-2">
            {config.description}
          </AlertDescription>
          
          <div className="flex gap-2 mt-4">
            {onRetry && (
              <Button onClick={onRetry} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            {showHomeButton && (
              <Button asChild variant="outline" size="sm">
                <Link to={createPageUrl('Home')}>
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            )}
          </div>
        </Alert>

        {/* Debug info (only in development) */}
        {typeof window !== 'undefined' && window.location.hostname === 'localhost' && error && (
          <details className="mt-4 text-xs text-brand-text-secondary">
            <summary className="cursor-pointer hover:text-brand-text-primary">
              Debug Info
            </summary>
            <pre className="mt-2 p-2 bg-brand-charcoal rounded overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export const InlineError = ({ message, onRetry }) => (
  <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-red-300">{message}</p>
        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="ghost" 
            size="sm" 
            className="mt-2 text-red-300 hover:text-red-200"
          >
            <RefreshCw className="w-3 h-3 mr-2" />
            Retry
          </Button>
        )}
      </div>
    </div>
  </div>
);

export const FormFieldError = ({ message }) => {
  if (!message) return null;
  
  return (
    <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
      <AlertCircle className="w-3 h-3" />
      {message}
    </p>
  );
};
