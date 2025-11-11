import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Home, Calendar, Building, Users, User as UserIcon,
  Trophy, Settings, Briefcase, BarChart3, Handshake, Target
} from 'lucide-react';
import { useXP } from './XPContext';
import { usePermissions } from './hooks/usePermissions';
import { Badge } from '@/components/ui/badge';

const MobileTabBar = ({ user }) => {
  const location = useLocation();
  const { loyaltyData } = useXP();
  const { permissions } = usePermissions();
  
  // Build dynamic mobile navigation based on user role
  const getMobileNavItems = () => {
    const baseItems = [
      { name: 'Home', href: 'Home', icon: Home },
      { name: 'Events', href: 'Events', icon: Calendar },
      { name: 'Clubs', href: 'Clubs', icon: Building },
    ];

    // Add role-specific items
    if (user) {
      // CLIENT PORTAL ACCESS
      if (user.external_access_role === 'club_president' || permissions.canManageClub) {
        baseItems.push({ name: 'Club', href: 'BusinessHub', icon: Building });
      } else if (user.user_type === 'ma_admin' || permissions.canAccessMADashboard) {
        baseItems.push({ name: 'MA', href: 'MADashboard', icon: BarChart3 });
      } else if (user.external_access_role === 'sponsor_contact' || permissions.canManageSponsorship) {
        baseItems.push({ name: 'Sponsor', href: 'SponsorDashboard', icon: Handshake });
      }
      // STAFF ACCESS
      else if (permissions.canAccessStaffHQ) {
        baseItems.push({ name: 'Staff', href: 'StaffHQ', icon: Briefcase });
      }
      // ✅ UPDATED: Show Performance for athletes/coaches OR anyone (for testing)
      else if (user.user_type === 'athlete' || user.user_type === 'coach') {
        baseItems.push({ name: 'Performance', href: 'PerformanceCenter', icon: Trophy });
      }
      // ✅ NEW: Add Training tab for all authenticated users who don't have other roles
      else {
        baseItems.push({ name: 'Training', href: 'PerformanceCenter', icon: Target });
      }
    } else {
      // Non-authenticated users
      baseItems.push({ name: 'Community', href: 'CommunityHub', icon: Users });
    }

    // Profile is always last
    baseItems.push({ name: 'Profile', href: 'Profile', icon: UserIcon });

    return baseItems.slice(0, 5); // Max 5 items for mobile UX
  };

  const navItems = getMobileNavItems();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-card-bg border-t border-brand-border z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === createPageUrl(item.href);
          const linkClasses = [
            "flex flex-col items-center justify-center px-2 py-1 min-w-0 flex-1 text-xs relative",
            isActive ? "text-brand-red" : "text-brand-text-secondary"
          ].join(' ');

          const iconClasses = [
            "h-5 w-5 mb-1",
            isActive ? "text-brand-red" : "text-brand-text-secondary"
          ].join(' ');

          return (
            <Link
              key={item.name}
              to={createPageUrl(item.href)}
              className={linkClasses}
            >
              <item.icon className={iconClasses} />
              <span className="truncate">{item.name}</span>
              {item.name === 'Profile' && loyaltyData?.curl_points && loyaltyData.curl_points > 0 && (
                <div className="absolute -top-1 -right-1 bg-brand-red text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  {loyaltyData.curl_points > 999 ? '999+' : loyaltyData.curl_points}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileTabBar;