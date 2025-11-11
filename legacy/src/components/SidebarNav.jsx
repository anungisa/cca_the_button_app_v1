
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home, Calendar, Building, Users, Trophy,
  Settings, LogOut, X, ChevronRight, ChevronDown,
  Shield, Briefcase, BarChart3, MessageCircle, Star,
  Award, Zap, Handshake, DollarSign, TrendingUp,
  Video, MapPin, List, Sparkles, Gift, Heart,
  GraduationCap, Target, ShoppingBag, HelpCircle,
  FileText, // NEW ICON: Used in Client Portal
  Activity, // NEW ICON: Used in Admin
  Globe,    // NEW ICON: Used in Admin
  User as UserIcon, // Aliased to avoid conflict with '@/api/entities'
  Database // NEW ICON: Used for Data Navigation Hub
} from 'lucide-react';
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { usePermissions } from './hooks/usePermissions';
import { useXP } from './XPContext';
import { cn } from '@/components/utils/cn';
import { prefetchStrategy } from './utils/prefetchStrategy';

const SidebarSkeleton = () => (
  <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 w-64 bg-brand-charcoal border-r border-brand-border p-4 space-y-4">
    <div className="h-8 bg-brand-border rounded w-3/4 animate-pulse"></div>
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-brand-border rounded animate-pulse"></div>)}
    </div>
  </div>
);

// ✅ COLLAPSIBLE SECTION with persistent state
const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = true, storageKey }) => {
  const [isOpen, setIsOpen] = useState(() => {
    if (!storageKey) return defaultOpen;
    const stored = localStorage.getItem(storageKey);
    return stored !== null ? stored === 'true' : defaultOpen;
  });

  const toggleSection = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (storageKey) {
      localStorage.setItem(storageKey, String(newState));
    }
  };

  return (
    <div className="space-y-1">
      <button
        onClick={toggleSection}
        className="flex items-center justify-between w-full px-3 py-2 text-brand-text-secondary hover:text-brand-text-primary transition-colors rounded-lg hover:bg-brand-border"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
          <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {isOpen && <div className="space-y-1 pl-2">{children}</div>}
    </div>
  );
};

export default function SidebarNav({ sidebarOpen, setSidebarOpen }) {
  const { user, isLoading: userLoading } = useXP();
  const { permissions, isLoading: permissionsLoading } = usePermissions();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await User.logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Safe prefetch handler
  const handlePrefetch = useCallback((href) => {
    try {
      prefetchStrategy.prefetchRoute(href);
    } catch (error) {
      // Silently fail - prefetching is optional
      console.debug('Prefetch failed for', href, error);
    }
  }, []);

  if (userLoading || permissionsLoading || !permissions) {
    return <SidebarSkeleton />;
  }

  const isAdmin = user?.role === 'admin';

  const isActive = (href) => location.pathname === createPageUrl(href);

  const renderNavLink = (item) => {
    const active = isActive(item.href);
    return (
      <Link
        key={item.name}
        to={createPageUrl(item.href)}
        className={cn(
          "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm",
          active
            ? 'bg-brand-red text-white'
            : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-border'
        )}
        onClick={() => setSidebarOpen(false)}
        onMouseEnter={() => handlePrefetch(item.href)}
        onFocus={() => handlePrefetch(item.href)}
      >
        <item.icon className="w-4 h-4" />
        <span>{item.name}</span>
        {active && <ChevronRight className="w-3 h-3 ml-auto" />}
      </Link>
    );
  };

  // ✅ COMPLETE NAVIGATION STRUCTURE

  // PUBLIC (Always visible)
  const corePublic = [
    { name: 'Home', href: 'Home', icon: Home },
  ];

  const discoveryPages = [
    { name: 'Events', href: 'Events', icon: Calendar },
    { name: 'Event Details', href: 'EventDetails', icon: Calendar },
    { name: 'Clubs', href: 'Clubs', icon: Building },
    { name: 'Live Streaming', href: 'Streaming', icon: Video },
    { name: 'Team Canada', href: 'NationalTeams', icon: Trophy },
    { name: 'HP Centers', href: 'HPCenters', icon: MapPin },
    { name: 'CTRS Rankings', href: 'CTRSRankings', icon: List },
  ];

  const engagementPages = [
    { name: 'Loyalty Program', href: 'LoyaltyProgram', icon: Award },
    { name: 'How It Works', href: 'GraniteCircleExplainer', icon: HelpCircle },
    { name: 'Reward Store', href: 'RewardStore', icon: Gift },
    { name: 'Trivia Hub', href: 'TriviaHub', icon: Sparkles },
    { name: 'Leaderboards', href: 'Leaderboards', icon: TrendingUp },
    { name: 'Patch Scanner', href: 'PatchScanner', icon: Star },
    { name: 'Geo Challenges', href: 'GeoChallenge', icon: MapPin },
    { name: 'Mystery Box', href: 'MysteryBox', icon: Gift },
    { name: 'Social Thread', href: 'SocialThread', icon: MessageCircle },
  ];

  const communityPages = [
    { name: 'Social Hub', href: 'SocialHub', icon: MessageCircle },
    { name: 'Get Involved', href: 'GetInvolvedHub', icon: Target },
    { name: 'About Curling', href: 'AboutCurling', icon: HelpCircle },
  ];

  const youthPages = [
    // { name: 'Youth Community', href: 'YouthCommunityHub', icon: GraduationCap }, // MOVED TO STAFF HQ
    { name: 'Youth Passport', href: 'YouthPassport', icon: Award },
    { name: 'Hit Draw Tap', href: 'HitDrawTap', icon: Target },
  ];

  const supportPages = [
    { name: 'FTLOC', href: 'FTLOCHub', icon: Heart },
    { name: 'Donations', href: 'Donations', icon: DollarSign },
    { name: 'Pledge Board', href: 'PledgeBoard', icon: Users },
    { name: 'Safe Sport', href: 'SafeSportPublic', icon: Shield },
    { name: 'Help Center', href: 'HelpCenter', icon: HelpCircle },
  ];

  const shopPages = [
    { name: 'Shop', href: 'ShopHub', icon: ShoppingBag },
    { name: 'My Purchases', href: 'PurchaseHistory', icon: List },
    { name: 'Subscriptions', href: 'SubscriptionManagement', icon: Award },
    { name: 'Fan Pass', href: 'FanPass', icon: Star },
  ];

  // USER (Authenticated) - Show for admin OR authenticated users
  const userPages = (user || isAdmin) ? [
    { name: 'My Profile', href: 'Profile', icon: Users },
    { name: 'Calendar', href: 'PersonalCalendar', icon: Calendar },
    { name: 'Connections', href: 'SocialConnections', icon: Users },
  ] : [];

  // Performance & Training Tools - Show for admin OR authenticated users
  const performanceTools = (user || isAdmin) ? [
    { name: 'Performance Center', href: 'PerformanceCenter', icon: BarChart3 },
    { name: 'Shot Tracker', href: 'ShotTracker', icon: Target },
    { name: 'Smart Broom', href: 'SmartBroomHub', icon: Zap },
  ] : [];

  // Athlete Pages - Show for admin OR athlete/coach users
  const athletePages = (isAdmin || user?.user_type === 'athlete' || user?.user_type === 'coach') ? [
    { name: 'Athlete Dashboard', href: 'AthleteDashboard', icon: Trophy },
  ] : [];

  // Coach Pages - Show for admin OR coaches
  const coachPages = (isAdmin || user?.user_type === 'coach') ? [
    { name: 'Coach Dashboard', href: 'CoachDashboard', icon: Users },
    { name: 'Athlete View', href: 'CoachAthleteView', icon: Users },
  ] : [];

  // CLIENT PORTAL - Show for admin OR users with portal access
  const clientPortalPages = (isAdmin ||
    user?.external_access_role === 'club_president' ||
    user?.external_access_role === 'sponsor_contact' ||
    user?.user_type === 'ma_admin' ||
    permissions.canManageClub ||
    permissions.canManageSponsorship ||
    permissions.canAccessMADashboard) ? [
    ...(isAdmin || user?.external_access_role === 'club_president' || permissions.canManageClub ? [
      { name: 'Business Hub', href: 'BusinessHub', icon: Briefcase },
      { name: 'Club Survey', href: 'ClubSurvey', icon: FileText }
    ] : []),
    ...(isAdmin || user?.user_type === 'ma_admin' || permissions.canAccessMADashboard ? [
      { name: 'MA Dashboard', href: 'MADashboard', icon: BarChart3 },
      { name: 'MA Insights', href: 'MAInsights', icon: TrendingUp }
    ] : []),
    ...(isAdmin || user?.external_access_role === 'sponsor_contact' || permissions.canManageSponsorship ? [
      { name: 'Sponsor Dashboard', href: 'SponsorDashboard', icon: Handshake }
    ] : [])
  ] : [];

  // STAFF HQ - Show for admin OR staff
  const staffHQPages = (isAdmin || permissions.canAccessStaffHQ) ? [
    { name: 'Staff HQ', href: 'StaffHQ', icon: Briefcase },
    { name: 'My Workspace', href: 'MyWorkspace', icon: UserIcon },
    { name: 'Community Hub', href: 'CommunityHub', icon: Users },
    { name: 'Youth & Community', href: 'YouthCommunityHub', icon: Heart },
    { name: 'Forms Hub', href: 'FormsHub', icon: FileText },
    { name: 'Incidents', href: 'IncidentManagementHub', icon: Shield },
    { name: 'Reports', href: 'ReportsHub', icon: BarChart3 },
  ] : [];

  // ========================================
  // ADMIN ROUTES
  // ========================================
  const adminPages = isAdmin ? [
    { name: 'Monetization Hub', href: 'MonetizationHub', icon: DollarSign },
    { name: 'Platform Settings', href: 'PlatformSettings', icon: Settings },
    { name: 'System Health', href: 'SystemHealth', icon: Activity },
    { name: 'API Manager', href: 'APIManager', icon: Globe },
    { name: 'Data Navigation', href: 'DataNavigationHub', icon: Database },
  ] : [];

  const userEmail = user?.email || '';
  const userName = user?.full_name || 'User';
  const userInitial = userName.charAt(0) || userEmail.charAt(0) || 'U';

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-brand-charcoal border-r border-brand-border transform transition-transform duration-300 ease-in-out md:translate-x-0 overflow-y-auto",
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-brand-border sticky top-0 bg-brand-charcoal z-10">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7eb979759_Curling-Canada_CMYK.png"
              alt="Curling Canada"
              className="h-8"
            />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-4" role="navigation" aria-label="Main navigation">

            {/* Admin Badge */}
            {isAdmin && (
              <div className="bg-brand-red/20 border border-brand-red/30 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-red" />
                  <span className="text-sm font-medium text-brand-red">Admin Mode</span>
                </div>
                <p className="text-xs text-brand-text-secondary mt-1">All sections visible</p>
              </div>
            )}

            {/* Core */}
            <div className="space-y-1">
              {corePublic.map(renderNavLink)}
            </div>

            {/* PUBLIC SECTIONS */}
            <CollapsibleSection title="Discover" icon={MapPin} storageKey="nav-discover" defaultOpen={true}>
              {discoveryPages.map(renderNavLink)}
            </CollapsibleSection>

            <CollapsibleSection title="Engage & Earn" icon={Sparkles} storageKey="nav-engage" defaultOpen={false}>
              {engagementPages.map(renderNavLink)}
            </CollapsibleSection>

            <CollapsibleSection title="Community" icon={Users} storageKey="nav-community" defaultOpen={false}>
              {communityPages.map(renderNavLink)}
            </CollapsibleSection>

            {youthPages.length > 0 && (
              <CollapsibleSection title="Youth Programs" icon={GraduationCap} storageKey="nav-youth" defaultOpen={false}>
                {youthPages.map(renderNavLink)}
              </CollapsibleSection>
            )}

            <CollapsibleSection title="Support & Give" icon={Heart} storageKey="nav-support" defaultOpen={false}>
              {supportPages.map(renderNavLink)}
            </CollapsibleSection>

            <CollapsibleSection title="Shop" icon={ShoppingBag} storageKey="nav-shop" defaultOpen={false}>
              {shopPages.map(renderNavLink)}
            </CollapsibleSection>

            {/* USER SECTIONS */}
            {userPages.length > 0 && (
              <CollapsibleSection title="My Account" icon={Users} storageKey="nav-account" defaultOpen={true}>
                {userPages.map(renderNavLink)}
              </CollapsibleSection>
            )}

            {/* Performance & Training Tools */}
            {performanceTools.length > 0 && (
              <CollapsibleSection title="Training" icon={Trophy} storageKey="nav-performance" defaultOpen={isAdmin}>
                {performanceTools.map(renderNavLink)}
              </CollapsibleSection>
            )}

            {athletePages.length > 0 && (
              <CollapsibleSection title="Athlete Tools" icon={Trophy} storageKey="nav-athlete" defaultOpen={isAdmin}>
                {athletePages.map(renderNavLink)}
              </CollapsibleSection>
            )}

            {coachPages.length > 0 && (
              <CollapsibleSection title="Coach Tools" icon={Users} storageKey="nav-coach" defaultOpen={isAdmin}>
                {coachPages.map(renderNavLink)}
              </CollapsibleSection>
            )}

            {/* CLIENT PORTAL */}
            {clientPortalPages.length > 0 && (
              <CollapsibleSection title="Client Portal" icon={Briefcase} storageKey="nav-portal" defaultOpen={isAdmin}>
                {clientPortalPages.map(renderNavLink)}
              </CollapsibleSection>
            )}

            {/* STAFF HQ */}
            {staffHQPages.length > 0 && (
              <CollapsibleSection title="Staff HQ" icon={Briefcase} storageKey="nav-staffhq" defaultOpen={isAdmin}>
                {staffHQPages.map(renderNavLink)}
              </CollapsibleSection>
            )}

            {/* ADMIN */}
            {adminPages.length > 0 && (
              <CollapsibleSection title="Administration" icon={Settings} storageKey="nav-admin" defaultOpen={true}>
                {adminPages.map(renderNavLink)}
              </CollapsibleSection>
            )}

          </nav>

          {/* User Footer */}
          {user && (
            <div className="border-t border-brand-border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-bold">
                  {userInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-text-primary truncate">{userName}</p>
                  <p className="text-xs text-brand-text-secondary truncate">{userEmail}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start border-brand-border text-brand-text-secondary"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}

          {!user && (
            <div className="border-t border-brand-border p-4">
              <p className="text-xs text-brand-text-secondary mb-3 text-center">
                Sign in to access your personalized experience
              </p>
              <Button
                className="w-full bg-brand-red hover:bg-red-700"
                onClick={() => {
                  // ✅ FIX: Use base44's built-in login redirect
                  window.location.href = 'https://base44.app/login?redirect=' + encodeURIComponent(window.location.href);
                }}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
