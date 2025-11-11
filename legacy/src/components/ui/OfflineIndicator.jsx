import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi, CloudOff, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { offlineSyncService } from '../services/OfflineSyncService';
import { Badge } from '@/components/ui/badge';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueSize, setQueueSize] = useState(0);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setJustReconnected(true);
      setTimeout(() => setJustReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setJustReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update queue size periodically
    const interval = setInterval(() => {
      setQueueSize(offlineSyncService.getQueueSize());
    }, 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (isOnline && !justReconnected && queueSize === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-20 right-4 z-50"
      >
        {!isOnline && (
          <Alert className="bg-orange-500/10 border-orange-500 max-w-sm">
            <WifiOff className="h-4 w-4 text-orange-500" />
            <AlertDescription className="flex items-center justify-between gap-2">
              <span className="text-orange-700 dark:text-orange-300">
                You're offline. Changes will sync when reconnected.
              </span>
              {queueSize > 0 && (
                <Badge variant="outline" className="border-orange-500 text-orange-700">
                  {queueSize} pending
                </Badge>
              )}
            </AlertDescription>
          </Alert>
        )}

        {isOnline && justReconnected && (
          <Alert className="bg-green-500/10 border-green-500 max-w-sm">
            <Wifi className="h-4 w-4 text-green-500" />
            <AlertDescription className="flex items-center gap-2">
              <span className="text-green-700 dark:text-green-300">
                Back online!
              </span>
              {queueSize > 0 && (
                <span className="text-green-600 flex items-center gap-1 text-xs">
                  <Upload className="w-3 h-3" />
                  Syncing {queueSize} changes...
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}
      </motion.div>
    </AnimatePresence>
  );
}