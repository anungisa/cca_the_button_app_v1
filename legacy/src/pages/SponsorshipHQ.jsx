import React from 'react';
import SponsorshipHQ from '../components/staffhq/SponsorshipHQ';
import { usePermissions } from '../components/hooks/usePermissions';
import ExternalAccessGate from '../components/external/ExternalAccessGate'; // Using this as a permission gate
import { Loader2 } from 'lucide-react';

export default function SponsorshipHQPage() {
  const { hasPermission, isLoading } = usePermissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  // Use a simple permission check instead of the full gate for an internal page
  if (!hasPermission('canAccessStaffHQ')) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>You do not have permission to access this page.</p>
        </div>
    );
  }

  return <SponsorshipHQ />;
}