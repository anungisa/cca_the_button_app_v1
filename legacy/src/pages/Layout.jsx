
import React, { useState, Suspense, useEffect } from "react";
import { XPProvider, useXP } from "./components/XPContext";
import { LanguageProvider } from "./components/i18n/LanguageContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import Header from "./components/Header";
import SidebarNav from "./components/SidebarNav";
import MobileTabBar from "./components/MobileTabBar";
import AdminPageNavigator from "./components/admin/AdminPageNavigator";
import AppFooter from "./components/layout/AppFooter";
import { useLocation } from "react-router-dom";
import { SkipLink } from './components/ui/ScreenReaderOnly';
import { preloadCriticalRoutes } from './components/utils/routeConfig';
import { prefetchStrategy } from './components/utils/prefetchStrategy';
import { performanceMonitor } from './components/services/PerformanceMonitoringService';
import { securityService } from './components/services/SecurityService';
import { auditLogger } from './components/services/AuditLogger';
import OfflineIndicator from './components/ui/OfflineIndicator';
import SystemHealthBanner from './components/ui/SystemHealthBanner';

const LoadingFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-charcoal" role="status" aria-label="Loading">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4" aria-hidden="true"></div>
        <p className="text-brand-text-secondary">Loading...</p>
      </div>
    </div>
  );
};

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loyaltyData, isLoading, hasError } = useXP();
  const location = useLocation();

  // ✅ SECURITY: Prevent clickjacking (only in production)
  useEffect(() => {
    const isProduction = !window.location.hostname.includes('base44.app') && 
                        !window.location.hostname.includes('localhost');
    
    if (isProduction) {
      securityService.preventClickjacking();
    }
  }, []);

  // ✅ SECURITY: Log page views for audit
  useEffect(() => {
    if (user && user.id) {
      auditLogger.log('PAGE_VIEW', {
        user_email: user.email,
        user_id: user.id,
        feature: 'NAVIGATION',
        context: {
          page: location.pathname,
          referrer: document.referrer
        }
      });
    }
  }, [location.pathname, user]);

  // ✅ PERFORMANCE: Preload critical routes on mount
  useEffect(() => {
    preloadCriticalRoutes();
  }, []);

  // ✅ PERFORMANCE: Prefetch user-specific data after login
  useEffect(() => {
    if (user && user.id) {
      prefetchStrategy.prefetchCommonData(user);
    }
  }, [user]);

  // ✅ PERFORMANCE: Track page loads
  useEffect(() => {
    const pageLoadTime = performance.now();
    performanceMonitor.trackPageLoad(location.pathname, pageLoadTime);
  }, [location.pathname]);

  const safeUser = user && user.id ? user : null;
  const userForNav = safeUser ? { 
    ...safeUser, 
    loyaltyData: loyaltyData || null,
    email: safeUser.email || '',
    full_name: safeUser.full_name || 'User'
  } : null;

  const pathnames = location.pathname ? location.pathname.split('/').filter(x => x) : [];
  const breadcrumbItems = Array.isArray(pathnames) 
    ? pathnames.map(value => ({
        label: value.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim(),
        href: value
      }))
    : [];

  const noSponsorPages = ['/Login', '/Signup', '/PlatformSettings', '/StaffHQ'];
  const shouldShowSponsors = !noSponsorPages.includes(location.pathname);

  // ✅ Show loading state
  if (isLoading) {
    return <LoadingFallback />;
  }

  // ✅ Show error state if critical error
  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-charcoal">
        <div className="text-center text-brand-text-primary">
          <h2 className="text-2xl font-bold mb-4">Unable to Load App</h2>
          <p className="text-brand-text-secondary mb-6">Please refresh the page or try again later.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-charcoal text-brand-text-primary font-montserrat">
      <SkipLink />
      <SystemHealthBanner />
      <OfflineIndicator />
      <div className="flex flex-col min-h-screen">
        <SidebarNav user={safeUser} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="md:pl-64 flex flex-col flex-1">
          <Header user={userForNav} setSidebarOpen={setSidebarOpen} breadcrumbItems={breadcrumbItems} />

          <main id="main-content" className="flex-1 pb-16 md:pb-0" role="main">
            <div className="py-4 md:py-6">
              <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                <ErrorBoundary>
                  <Suspense fallback={<LoadingFallback />}>
                    {children}
                  </Suspense>
                </ErrorBoundary>
              </div>
            </div>
            
            <AppFooter showSponsors={shouldShowSponsors} />
          </main>
        </div>
        
        <MobileTabBar user={safeUser} />
      </div>
      <Toaster />
      <AdminPageNavigator />
    </div>
  );
};

export default function Layout({ children }) {
  return (
    <ErrorBoundary>
      <XPProvider>
        <LanguageProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </LanguageProvider>
      </XPProvider>
    </ErrorBoundary>
  );
}
