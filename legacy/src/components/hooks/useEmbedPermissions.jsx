import { useState, useEffect } from 'react';
import { User } from '@/api/entities';

export const useEmbedPermissions = () => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserPermissions = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
        
        // Define dashboard permissions based on user roles
        const userPermissions = {
          // General insights - Admin and SMT only
          general_insights: userData.role === 'admin' || userData.user_type === 'smt',
          
          // Youth data - DEI leads, MA admins, and admins
          youth_data: userData.role === 'admin' || 
                     userData.user_type === 'ma_admin' || 
                     userData.user_type === 'dei_lead',
          
          // MA engagement - MA admins and platform admins
          ma_engagement: userData.role === 'admin' || 
                        userData.user_type === 'ma_admin',
          
          // Coach insights - Coaches and admins
          coach_insights: userData.role === 'admin' || 
                         userData.user_type === 'coach',
          
          // Safe Sport compliance - MA admins, club admins, and platform admins
          safe_sport: userData.role === 'admin' || 
                     userData.user_type === 'ma_admin' || 
                     userData.user_type === 'club_admin',
          
          // FTLOC impact - All authenticated users
          ftloc_impact: true,
          
          // Club performance - Club admins, MA admins, and platform admins
          club_performance: userData.role === 'admin' || 
                           userData.user_type === 'ma_admin' || 
                           userData.user_type === 'club_admin',
          
          // High performance metrics - Athletes, coaches, and admins
          hp_metrics: userData.role === 'admin' || 
                     userData.user_type === 'coach' || 
                     userData.user_type === 'athlete' ||
                     (userData.performance_tier && userData.performance_tier !== 'none')
        };
        
        setPermissions(userPermissions);
      } catch (error) {
        console.error('Error loading user permissions:', error);
        setUser(null);
        setPermissions({});
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserPermissions();
  }, []);

  const hasAccess = (dashboardKey) => {
    return permissions[dashboardKey] || false;
  };

  const getUserRole = () => {
    return user?.role || user?.user_type || 'public';
  };

  return {
    user,
    permissions,
    hasAccess,
    getUserRole,
    isLoading
  };
};