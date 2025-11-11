import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle,
  Maximize2,
  Minimize2
} from 'lucide-react';

export default function DomoDashboardView({ 
  title, 
  description, 
  embedUrl, 
  icon: Icon,
  height = "600px",
  allowFullscreen = true,
  onError = null 
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError();
  };

  const refreshDashboard = () => {
    setIsLoading(true);
    setHasError(false);
    // Force iframe reload by updating src
    const iframe = document.querySelector(`iframe[title="${title}"]`);
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!embedUrl) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Dashboard Coming Soon</h3>
          <p className="text-brand-text-secondary">
            This analytics dashboard is being configured and will be available shortly.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-brand-charcoal p-4' : ''}`}>
      <Card className="bg-brand-card-bg border-brand-border h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="w-6 h-6 text-brand-red" />}
            <div>
              <CardTitle className="text-xl text-brand-text-primary">{title}</CardTitle>
              {description && (
                <p className="text-sm text-brand-text-secondary mt-1">{description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshDashboard}
              disabled={isLoading}
              className="border-brand-border text-brand-text-secondary hover:text-brand-text-primary"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            {allowFullscreen && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="border-brand-border text-brand-text-secondary hover:text-brand-text-primary"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-brand-border text-brand-text-secondary hover:text-brand-text-primary"
            >
              <a href={embedUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {hasError ? (
            <Alert className="m-6 border-amber-500 bg-amber-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Unable to load dashboard. Please check your connection and try again.
                <Button
                  variant="link"
                  size="sm"
                  onClick={refreshDashboard}
                  className="ml-2 h-auto p-0 text-amber-700"
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-brand-card-bg/80">
                  <div className="flex items-center gap-2 text-brand-text-secondary">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Loading dashboard...
                  </div>
                </div>
              )}
              <iframe
                src={embedUrl}
                title={title}
                width="100%"
                height={isFullscreen ? 'calc(100vh - 200px)' : height}
                style={{ 
                  border: 'none', 
                  borderRadius: isFullscreen ? '0' : '0 0 8px 8px',
                  backgroundColor: '#ffffff'
                }}
                loading="lazy"
                allowFullScreen={allowFullscreen}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}