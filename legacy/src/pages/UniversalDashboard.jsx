/**
 * Universal Dashboard Page
 * Replaces: AthleteDashboard, CoachDashboard, MADashboard, ExecutiveDashboard, SponsorDashboard
 */

import React, { useMemo } from 'react';
import { useXP } from '../components/XPContext';
import { usePermissions } from '../components/hooks/usePermissions';
import DashboardEngine from '../components/dashboard/DashboardEngine';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function UniversalDashboard() {
  const { user, isLoading } = useXP();
  const { permissions } = usePermissions();

  const dashboardType = useMemo(() => {
    if (!user) return null;

    // Determine dashboard type based on user role and permissions
    if (user.user_type === 'athlete') return 'athlete';
    if (user.user_type === 'coach') return 'coach';
    if (user.external_access_role === 'sponsor_contact' || permissions.canManageSponsorship) return 'sponsor';
    if (user.user_type === 'ma_admin' || permissions.canAccessMADashboard) return 'ma';
    if (user.external_access_role === 'club_president' || permissions.canManageClub) return 'club';
    if (permissions.canAccessStaffHQ && user.user_type === 'executive') return 'executive';

    // Default to user dashboard
    return null;
  }, [user, permissions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please log in to view your dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!dashboardType) {
    // Redirect to home for regular users
    window.location.href = '/Home';
    return null;
  }

  return <DashboardEngine dashboardType={dashboardType} />;
}