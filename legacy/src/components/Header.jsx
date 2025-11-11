
import React, { useState } from 'react';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User as UserIcon, Menu, ArrowLeft, Bell, ChevronDown, Award } from 'lucide-react';
import Breadcrumbs from './ui/Breadcrumbs';
import { createPageUrl } from '@/utils';
import { Link, useLocation } from 'react-router-dom';

const staffHQHubPages = new Set([
  'MyWorkspace', 'ExecutiveHub', 'ClubServicesHub', 'LiveScoring',
  'EventOpsToolkit', 'HighPerformanceHub', 'PlatformSettings',
  'MarketingCenter', 'GovernanceComplianceHub', 'FederationContext',
  'LegalComplianceHub', 'PeopleCultureHub', 'SafeSportHub', 'CommunityHub',
  'FanOS', 'FormsHub', 'IncidentManagementHub', 'KnowledgeBase', 'ReportsHub',
  'FinanceHub', 'ResearchHub', 'SponsorshipHQ', 'StrategicPlanningHub'
]);

export default function Header({ user, setSidebarOpen, breadcrumbItems }) {
  const location = useLocation();
  const currentPage = location.pathname.split('/').filter(x => x)[0];
  const isStaffHQHubPage = staffHQHubPages.has(currentPage);

  // State for notification, as the NotificationBell component is removed
  const [notificationOpen, setNotificationOpen] = useState(false); // This state isn't currently used to open a panel, but can be for future expansion
  const [notificationCount, setNotificationCount] = useState(3); // Placeholder, typically comes from props or global state

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-brand-charcoal/80 backdrop-blur-md border-b border-brand-border">
      <div className="flex flex-1 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="flex items-center gap-2">
          {isStaffHQHubPage && (
            <Button asChild variant="outline" size="sm">
              <Link to={createPageUrl('StaffHQ')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Staff HQ
              </Link>
            </Button>
          )}

          {/* User Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-brand-text-secondary hover:text-brand-text-primary"
                  onClick={() => setNotificationOpen(!notificationOpen)}
                >
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center text-white font-bold">
                        {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </div>
                      <span className="hidden md:block text-brand-text-primary">
                        {user.full_name || user.email || 'User'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-brand-text-secondary" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('Profile')} className="cursor-pointer">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('LoyaltyProgram')} className="cursor-pointer">
                        <Award className="w-4 h-4 mr-2" />
                        Granite Circle
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        try {
                          await User.logout();
                          window.location.href = '/';
                        } catch (error) {
                          console.error('Logout failed:', error);
                        }
                      }}
                      className="cursor-pointer text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                className="bg-brand-red hover:bg-red-700"
                onClick={() => {
                  // ✅ FIX: Use base44's built-in login redirect
                  window.location.href = 'https://base44.app/login?redirect=' + encodeURIComponent(window.location.href);
                }}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
