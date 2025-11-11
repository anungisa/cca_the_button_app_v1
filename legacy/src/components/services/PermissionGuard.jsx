/**
 * Permission Guard Component
 * Verifies user has required permissions before rendering content
 */

import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert, Loader2 } from 'lucide-react';

export function PermissionGuard({ 
  requiredPermission,
  children,
  fallback = null,
  showError = true
}) {
  const { permissions, hasPermission, isLoading } = usePermissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  if (!hasPermission(requiredPermission)) {
    if (fallback) return fallback;
    
    if (!showError) return null;

    return (
      <div className="flex items-center justify-center p-8">
        <Card className="max-w-md bg-brand-card-bg border-brand-border">
          <CardContent className="p-6 text-center">
            <ShieldAlert className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-brand-text-primary mb-2">Access Restricted</h3>
            <p className="text-brand-text-secondary text-sm">
              You don't have permission to access this content.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

export default PermissionGuard;