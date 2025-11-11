/**
 * Authentication Guard Component
 * Protects routes and components from unauthorized access
 */

import React, { useEffect, useState } from 'react';
import { useXP } from '../XPContext';
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AuthGuard({ 
  children, 
  requireAuth = true,
  redirectTo = 'Home',
  fallback = null,
  onUnauthorized = null
}) {
  const { user, isLoading } = useXP();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !user) {
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        // Redirect to login with callback
        User.loginWithRedirect(window.location.href);
      }
      setShouldRender(false);
    } else {
      setShouldRender(true);
    }
  }, [user, isLoading, requireAuth, onUnauthorized]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  if (!shouldRender) {
    if (fallback) return fallback;
    
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md bg-brand-card-bg border-brand-border">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-brand-red mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brand-text-primary mb-2">Authentication Required</h2>
            <p className="text-brand-text-secondary mb-4">
              Please log in to access this content.
            </p>
            <Button onClick={() => User.login()} className="bg-brand-red hover:bg-red-700">
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthGuard;