
/**
 * Centralized Route Configuration
 * Defines all routes and their lazy-loaded components
 */

import { lazy } from 'react';

// Core public pages
const Home = lazy(() => import('../../pages/Home'));
const Events = lazy(() => import('../../pages/Events'));
const Clubs = lazy(() => import('../../pages/Clubs'));
const Profile = lazy(() => import('../../pages/Profile'));

// Engagement pages
const LoyaltyProgram = lazy(() => import('../../pages/LoyaltyProgram'));
const RewardStore = lazy(() => import('../../pages/RewardStore'));
const TriviaHub = lazy(() => import('../../pages/TriviaHub'));
const Streaming = lazy(() => import('../../pages/Streaming'));

// Community
const CommunityHub = lazy(() => import('../../pages/CommunityHub'));
const SocialHub = lazy(() => import('../../pages/SocialHub'));

// Universal dashboards and hubs (replaces 30+ pages)
const UniversalDashboard = lazy(() => import('../../pages/UniversalDashboard'));
const UniversalHub = lazy(() => import('../../pages/UniversalHub'));

// Staff HQ
const StaffHQ = lazy(() => import('../../pages/StaffHQ'));
const MyWorkspace = lazy(() => import('../../pages/MyWorkspace'));

// Admin
const PlatformSettings = lazy(() => import('../../pages/PlatformSettings'));
const SystemHealth = lazy(() => import('../../pages/SystemHealth'));
const DataNavigationHub = lazy(() => import('../../pages/DataNavigationHub'));
const SystemArchitecture = lazy(() => import('../../pages/SystemArchitecture'));
const DOMOCapabilities = lazy(() => import('../../pages/DOMOCapabilities'));
const BDOStrategyComparison = lazy(() => import('../../pages/BDOStrategyComparison'));
const DataStrategyAssessment = lazy(() => import('../../pages/DataStrategyAssessment'));
const DataQualityDashboard = lazy(() => import('../../pages/DataQualityDashboard'));
const BusinessGlossary = lazy(() => import('../../pages/BusinessGlossary'));


// Forms
const FormsHub = lazy(() => import('../../pages/FormsHub'));
const Form = lazy(() => import('../../pages/Form'));

/**
 * Route Registry
 * Maps URL paths to components and metadata
 */
export const ROUTE_REGISTRY = {
  // ========================================
  // PUBLIC ROUTES (No auth required)
  // ========================================
  '/Home': {
    component: Home,
    public: true,
    preload: true,
    metadata: { title: 'Home', description: 'Curling Canada - The Button' }
  },
  '/Events': {
    component: Events,
    public: true,
    preload: true,
    metadata: { title: 'Events', description: 'Curling events across Canada' }
  },
  '/Clubs': {
    component: Clubs,
    public: true,
    preload: true,
    metadata: { title: 'Clubs', description: 'Find a curling club near you' }
  },
  '/Streaming': {
    component: Streaming,
    public: true,
    metadata: { title: 'Live Streaming', description: 'Watch curling live' }
  },
  '/CommunityHub': {
    component: CommunityHub,
    public: true,
    metadata: { title: 'Community', description: 'Connect with curlers' }
  },
  '/AboutCurling': {
    component: lazy(() => import('../../pages/AboutCurling')),
    public: true,
    metadata: { title: 'About Curling', description: 'Learn about curling' }
  },

  // ========================================
  // AUTHENTICATED ROUTES
  // ========================================
  '/Profile': {
    component: Profile,
    requireAuth: true,
    preload: true,
    metadata: { title: 'My Profile', description: 'Your profile and settings' }
  },
  '/LoyaltyProgram': {
    component: LoyaltyProgram,
    requireAuth: true,
    metadata: { title: 'Loyalty Program', description: 'Granite Circle rewards' }
  },
  '/RewardStore': {
    component: RewardStore,
    requireAuth: true,
    metadata: { title: 'Reward Store', description: 'Redeem your points' }
  },
  '/TriviaHub': {
    component: TriviaHub,
    public: true,
    metadata: { title: 'Trivia', description: 'Test your curling knowledge' }
  },

  // ========================================
  // UNIVERSAL DASHBOARDS (Replaces 6 pages)
  // ========================================
  '/Dashboard': {
    component: UniversalDashboard,
    requireAuth: true,
    metadata: { title: 'Dashboard', description: 'Your personalized dashboard' }
  },

  // ========================================
  // UNIVERSAL HUBS (Replaces 30+ pages)
  // ========================================
  '/Hub': {
    component: UniversalHub,
    requireAuth: true,
    metadata: { title: 'Hub', description: 'Operational hub' }
  },

  // ========================================
  // STAFF HQ
  // ========================================
  '/StaffHQ': {
    component: StaffHQ,
    requireAuth: true,
    requirePermission: 'canAccessStaffHQ',
    preload: false,
    metadata: { title: 'Staff HQ', description: 'Staff operations center' }
  },
  '/MyWorkspace': {
    component: MyWorkspace,
    requireAuth: true,
    requirePermission: 'canAccessStaffHQ',
    metadata: { title: 'My Workspace', description: 'Personal workspace' }
  },
  '/FormsHub': {
    component: FormsHub,
    requireAuth: true,
    requirePermission: 'canAccessStaffHQ',
    metadata: { title: 'Forms Hub', description: 'Form management' }
  },
  '/Form': {
    component: Form,
    public: true,
    metadata: { title: 'Form', description: 'Submit a form' }
  },

  // ========================================
  // ADMIN ROUTES
  // ========================================
  '/PlatformSettings': {
    component: PlatformSettings,
    requireAuth: true,
    requirePermission: 'canAccessPlatformSettings',
    metadata: { title: 'Platform Settings', description: 'System configuration' }
  },
  '/SystemHealth': {
    component: SystemHealth,
    requireAuth: true,
    requirePermission: 'canAccessStaffHQ',
    metadata: { title: 'System Health', description: 'System monitoring' }
  },
  '/DataNavigationHub': {
    component: DataNavigationHub,
    requireAuth: true,
    requirePermission: 'canAccessStaffHQ',
    metadata: { title: 'Data Navigation', description: 'Data infrastructure navigation' }
  },
  '/SystemArchitecture': {
    component: SystemArchitecture,
    requireAuth: true,
    requirePermission: 'canAccessPlatformSettings',
    metadata: { title: 'System Architecture', description: 'Integration architecture' }
  },
  '/DOMOCapabilities': {
    component: DOMOCapabilities,
    requireAuth: true,
    requirePermission: 'canAccessStaffHQ',
    metadata: { title: 'DOMO Capabilities', description: 'Analytics capabilities' }
  },
  '/BDOStrategyComparison': {
    component: BDOStrategyComparison,
    requireAuth: true,
    requirePermission: 'canAccessStaffHQ',
    metadata: { title: 'BDO Strategy', description: 'Strategic comparison' }
  },
  '/DataStrategyAssessment': {
    component: DataStrategyAssessment,
    requireAuth: true,
    requirePermission: 'canAccessStaffHQ',
    metadata: { title: 'Data Strategy', description: 'Strategy assessment' }
  },
  '/DataQualityDashboard': {
    component: DataQualityDashboard,
    requireAuth: true,
    requirePermission: 'canAccessPlatformSettings',
    metadata: { title: 'Data Quality', description: 'Quality monitoring' }
  },
  '/BusinessGlossary': {
    component: BusinessGlossary,
    requireAuth: true,
    requirePermission: 'canAccessStaffHQ',
    metadata: { title: 'Business Glossary', description: 'Data dictionary' }
  }
};

/**
 * Get route configuration
 */
export function getRouteConfig(path) {
  return ROUTE_REGISTRY[path] || null;
}

/**
 * Check if route exists
 */
export function routeExists(path) {
  return path in ROUTE_REGISTRY;
}

/**
 * Get all public routes
 */
export function getPublicRoutes() {
  return Object.entries(ROUTE_REGISTRY)
    .filter(([_, config]) => config.public)
    .map(([path]) => path);
}

/**
 * Get routes that should be preloaded
 */
export function getPreloadRoutes() {
  return Object.entries(ROUTE_REGISTRY)
    .filter(([_, config]) => config.preload)
    .map(([path, config]) => ({ path, component: config.component }));
}

/**
 * Preload critical routes
 */
export function preloadCriticalRoutes() {
  const criticalRoutes = getPreloadRoutes();

  criticalRoutes.forEach(({ component }) => {
    // Trigger lazy load
    component.preload?.();
  });

  console.log(`Preloaded ${criticalRoutes.length} critical routes`);
}

export default ROUTE_REGISTRY;
