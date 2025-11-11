import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { healthCheckService } from '../services/HealthCheckService';

export default function SystemHealthBanner() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleDegraded = () => {
      setHealthStatus('degraded');
      setIsDismissed(false);
    };

    const handleRecovered = () => {
      setHealthStatus('healthy');
      setTimeout(() => setIsDismissed(true), 3000); // Auto-dismiss after 3s
    };

    window.addEventListener('system-degraded', handleDegraded);
    window.addEventListener('system-recovered', handleRecovered);

    return () => {
      window.removeEventListener('system-degraded', handleDegraded);
      window.removeEventListener('system-recovered', handleRecovered);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!healthStatus || healthStatus === 'healthy' || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-0 left-0 right-0 z-[100] p-4"
      >
        {healthStatus === 'degraded' && (
          <Alert className="bg-yellow-500/10 border-yellow-500">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-yellow-700 dark:text-yellow-300">
                Some features may be temporarily limited. We're working to restore full service.
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="border-yellow-500 text-yellow-700"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Refresh
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDismissed(true)}
                  className="text-yellow-700"
                >
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {healthStatus === 'unhealthy' && (
          <Alert className="bg-red-500/10 border-red-500">
            <XCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-red-700 dark:text-red-300">
                We're experiencing technical difficulties. Only core features are available.
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="border-red-500 text-red-700"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDismissed(true)}
                  className="text-red-700"
                >
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </motion.div>
    </AnimatePresence>
  );
}