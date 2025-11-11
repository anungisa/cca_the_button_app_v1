
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useXP } from '../components/XPContext';
import SkeletonPage from '../components/ui/SkeletonPage';
import OnboardingWizard from '../components/onboarding/OnboardingWizard';
import ContextualHelp from '../components/onboarding/ContextualHelp';
import LazyPageWrapper from '../components/LazyPageWrapper';
import { User } from '@/api/entities';
import {
  Loader2,
  Building,
  Calendar,
  Video,
  BarChart3,
  Target,
  Zap,
  Users,
  Briefcase
} from 'lucide-react';

// Utility function to create page URLs. This is a placeholder;
// in a real app, it would be imported from a utility file.
const createPageUrl = (path) => {
  // Example: transforms 'Clubs' to '/clubs'
  return `/${path.toLowerCase()}`;
};

// Placeholder for permissions object. In a real app, this would
// likely come from a user object or a permissions context/hook.
const permissions = {
  canAccessStaffHQ: false, // Set to true or false based on actual user permissions
};

const LandingPage = lazy(() => import('../components/home/LandingPage'));
const Dashboard = lazy(() => import('../components/home/Dashboard'));

export default function HomePage() {
  const { user, loyaltyData, isLoading } = useXP();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding if the user is authenticated and hasn't seen it yet
    if (user && user.id && !user.has_seen_onboarding) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleOnboardingComplete = async (action) => {
    setShowOnboarding(false);
    // If an action with an href is provided, navigate to that page
    if (action?.href) {
      window.location.href = createPageUrl(action.href);
    }
    // No explicit refreshXPData needed here based on the outline;
    // `useXP` should handle data updates reactive to user changes.
  };

  const getQuickActions = () => {
    const baseActions = [
      { name: 'Find a Club', href: 'Clubs', icon: Building, color: 'bg-blue-600' },
      { name: 'Upcoming Events', href: 'Events', icon: Calendar, color: 'bg-purple-600' },
      { name: 'Watch Live', href: 'Streaming', icon: Video, color: 'bg-red-600' },
    ];

    if (user) {
      // Add Performance Tools for all authenticated users
      baseActions.push(
        { name: 'Performance Center', href: 'PerformanceCenter', icon: BarChart3, color: 'bg-green-600' },
        { name: 'Shot Tracker', href: 'ShotTracker', icon: Target, color: 'bg-orange-600' }
      );

      // Add role-specific actions
      if (user.user_type === 'athlete' || user.user_type === 'coach') {
        baseActions.push(
          { name: 'Smart Broom', href: 'SmartBroomHub', icon: Zap, color: 'bg-indigo-600' }
        );
      }

      if (user.user_type === 'coach') {
        baseActions.push(
          { name: 'Coach Dashboard', href: 'CoachDashboard', icon: Users, color: 'bg-teal-600' }
        );
      }

      // Check for staff HQ access based on permissions
      if (permissions.canAccessStaffHQ) {
        baseActions.push(
          { name: 'Staff HQ', href: 'StaffHQ', icon: Briefcase, color: 'bg-amber-600' }
        );
      }
    }

    return baseActions.slice(0, 6); // Show max 6 actions on home
  };

  const quickActions = getQuickActions(); // Compute quick actions based on user

  // Show loading while fetching user and loyalty data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  // The `hasError` condition is removed as per the outline's changes to `useXP` destructuring.
  // Assuming `user` being null/undefined means not authenticated, showing LandingPage in that case.
  // If `user` is defined but has issues, `isLoading` might handle it or specific error states within XPContext.

  return (
    <>
      <LazyPageWrapper variant="dashboard">
        <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-brand-red mx-auto mt-8" />}>
          {user && user.id ? ( // Check if user is authenticated
            <div data-testid="home-page">
              <Dashboard />
              <ContextualHelp />
            </div>
          ) : (
            <LandingPage />
          )}
        </Suspense>
      </LazyPageWrapper>

      {/* Onboarding Wizard is shown only if `showOnboarding` is true and user is authenticated */}
      {showOnboarding && user && user.id && (
        <OnboardingWizard
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onComplete={handleOnboardingComplete}
        />
      )}
    </>
  );
}
