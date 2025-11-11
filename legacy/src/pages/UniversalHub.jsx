/**
 * Universal Hub Page
 * Replaces 30+ individual hub pages with dynamic routing
 * Usage: /Hub?type=sponsorship or /Hub?type=events
 */

import React, { useMemo } from 'react';
import HubEngine from '../components/hub/HubEngine';
import { usePermissions } from '../components/hooks/usePermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function UniversalHub() {
  const { permissions, isLoading } = usePermissions();
  
  // Get hub type from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const hubType = urlParams.get('type');

  const hasAccess = useMemo(() => {
    if (!hubType) return false;

    // Define permission requirements for each hub type
    const hubPermissions = {
      sponsorship: permissions.canAccessStaffHQ || permissions.canManageSponsorship,
      events: permissions.canAccessStaffHQ,
      safesport: permissions.canAccessStaffHQ,
      governance: permissions.canAccessStaffHQ,
      marketing: permissions.canAccessStaffHQ,
      finance: permissions.canAccessStaffHQ,
      highperformance: permissions.canAccessStaffHQ,
      clubs: permissions.canAccessStaffHQ,
      youth: permissions.canAccessStaffHQ,
      community: true, // Public hub
      forms: permissions.canAccessStaffHQ
    };

    return hubPermissions[hubType] || false;
  }, [hubType, permissions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  if (!hubType) {
    return (
      <div className="text-center py-12">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please specify a hub type in the URL (e.g., ?type=sponsorship)
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="text-center py-12">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this hub.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <HubEngine hubType={hubType} />;
}