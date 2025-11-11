import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Wifi, WifiOff, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = ({ onInstall, onDismiss }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:w-80"
  >
    <Card className="bg-brand-card-bg border-brand-border shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-brand-text-primary">Install The Button</h4>
            <p className="text-sm text-brand-text-secondary">
              Add to your home screen for a better experience
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={onInstall} size="sm" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Install
          </Button>
          <Button onClick={onDismiss} variant="outline" size="sm">
            Later
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const OfflineIndicator = ({ isOnline }) => (
  <AnimatePresence>
    {!isOnline && (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-2 text-center text-sm"
      >
        <div className="flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          You're offline. Some features may not work.
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function PWAWrapper({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show install prompt after a delay, but only on mobile
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 10000); // Show after 10 seconds
      }
    };

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker for offline functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  // Don't show install prompt if dismissed in this session
  const shouldShowInstallPrompt = showInstallPrompt && 
    !isInstalled && 
    !sessionStorage.getItem('installPromptDismissed');

  return (
    <>
      {children}
      <OfflineIndicator isOnline={isOnline} />
      {shouldShowInstallPrompt && (
        <InstallPrompt 
          onInstall={handleInstall}
          onDismiss={handleDismissInstall}
        />
      )}
    </>
  );
}