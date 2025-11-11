import React from 'react';
import { ErrorDisplay } from './ui/ImprovedErrorStates';
import { productionMonitoring } from './services/ProductionMonitoring';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    productionMonitoring.logError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    });

    this.setState(prev => ({
      errorInfo,
      errorCount: prev.errorCount + 1
    }));

    // Log to console in development (check for localhost)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.error('Error Boundary caught error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    // Attempt to recover by reloading if errors persist
    if (this.state.errorCount > 2) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          error={this.state.error}
          title="Application Error"
          description="Something went wrong. We've logged the error and will look into it."
          onRetry={this.handleReset}
          showHomeButton={true}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;