import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { User } from '@/api/entities';
import { Shield } from 'lucide-react';

export const SuperAdminWrapper = ({ children, fallback = null }) => {
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-brand-card-bg rounded"></div>;
  }

  // Super Admin Override: Always allow access if user role is 'admin'
  if (user && user.role === 'admin') {
    return children;
  }

  // Show fallback or access denied
  return fallback || (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Shield className="w-12 h-12 text-red-400 mb-4" />
      <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Access Denied</h3>
      <p className="text-brand-text-secondary">You do not have permission to view this content.</p>
    </div>
  );
};

export default SuperAdminWrapper;