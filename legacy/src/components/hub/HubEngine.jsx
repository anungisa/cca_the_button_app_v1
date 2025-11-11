/**
 * Universal Hub Engine
 * Replaces 30+ individual hub pages with one configurable component
 */

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import SkeletonLoader from '../ui/SkeletonLoader';

/**
 * Hub configurations define the structure of each hub
 */
const HUB_CONFIGS = {
  community: {
    title: 'Community Hub',
    description: 'Connect with the curling community',
    icon: 'Users',
    tabs: [
      { id: 'feed', label: 'Activity Feed', component: 'CommunityFeed' },
      { id: 'posts', label: 'Posts', component: 'CommunityPosts' },
      { id: 'kudos', label: 'Kudos', component: 'KudosPanel' },
      { id: 'connections', label: 'Connections', component: 'ConnectionsList' }
    ],
    permissions: []
  },

  events: {
    title: 'Event Operations Hub',
    description: 'Manage all event operations',
    icon: 'Calendar',
    tabs: [
      { id: 'planning', label: 'Event Plans', component: 'EventPlanningPanel' },
      { id: 'live', label: 'Live Events', component: 'LiveEventConsole' },
      { id: 'volunteers', label: 'Volunteers', component: 'VolunteerCoordination' },
      { id: 'analytics', label: 'Analytics', component: 'EventAnalytics' }
    ],
    permissions: ['canAccessStaffHQ']
  },

  sponsorship: {
    title: 'Sponsorship HQ',
    description: 'Manage sponsorship pipeline and activations',
    icon: 'Handshake',
    tabs: [
      { id: 'pipeline', label: 'Pipeline', component: 'SponsorshipPipeline' },
      { id: 'contracts', label: 'Contracts', component: 'ContractManagement' },
      { id: 'activations', label: 'Activations', component: 'ActivationCalendar' },
      { id: 'analytics', label: 'Analytics', component: 'SponsorshipAnalytics' }
    ],
    permissions: ['canAccessStaffHQ', 'canManageSponsorship']
  },

  safesport: {
    title: 'Safe Sport Hub',
    description: 'Manage Safe Sport compliance and training',
    icon: 'Shield',
    tabs: [
      { id: 'compliance', label: 'Compliance', component: 'ComplianceOverview' },
      { id: 'training', label: 'Training', component: 'TrainingManagement' },
      { id: 'policies', label: 'Policies', component: 'PolicyLibrary' },
      { id: 'incidents', label: 'Incidents', component: 'IncidentOversight' }
    ],
    permissions: ['canAccessStaffHQ']
  },

  governance: {
    title: 'Governance Hub',
    description: 'Board, compliance, and governance management',
    icon: 'Scale',
    tabs: [
      { id: 'board', label: 'Board', component: 'BoardWorkspace' },
      { id: 'meetings', label: 'Meetings', component: 'MeetingManagement' },
      { id: 'compliance', label: 'Compliance', component: 'ComplianceDashboard' },
      { id: 'documents', label: 'Documents', component: 'DocumentApprovals' }
    ],
    permissions: ['canAccessStaffHQ']
  },

  marketing: {
    title: 'Marketing Center',
    description: 'Communications, campaigns, and media',
    icon: 'Megaphone',
    tabs: [
      { id: 'campaigns', label: 'Campaigns', component: 'CampaignManager' },
      { id: 'press', label: 'Press Releases', component: 'PressReleaseHub' },
      { id: 'social', label: 'Social Media', component: 'SocialScheduling' },
      { id: 'analytics', label: 'Analytics', component: 'MediaAnalytics' }
    ],
    permissions: ['canAccessStaffHQ']
  },

  finance: {
    title: 'Finance Hub',
    description: 'Financial operations and reporting',
    icon: 'DollarSign',
    tabs: [
      { id: 'overview', label: 'Overview', component: 'FinanceOverview' },
      { id: 'budgets', label: 'Budgets', component: 'BudgetManagement' },
      { id: 'transactions', label: 'Transactions', component: 'TransactionHistory' },
      { id: 'reports', label: 'Reports', component: 'FinancialReports' }
    ],
    permissions: ['canAccessStaffHQ']
  },

  highperformance: {
    title: 'High Performance Hub',
    description: 'National team and athlete development',
    icon: 'Trophy',
    tabs: [
      { id: 'overview', label: 'Overview', component: 'HPOverview' },
      { id: 'athletes', label: 'Athletes', component: 'AthleteManagement' },
      { id: 'teams', label: 'Teams', component: 'TeamManagement' },
      { id: 'analytics', label: 'Analytics', component: 'HPAnalytics' }
    ],
    permissions: ['canAccessStaffHQ']
  },

  clubs: {
    title: 'Club Services Hub',
    description: 'Support and resources for clubs',
    icon: 'Building',
    tabs: [
      { id: 'overview', label: 'Overview', component: 'ClubServicesOverview' },
      { id: 'health', label: 'Club Health', component: 'ClubHealthDashboard' },
      { id: 'resources', label: 'Resources', component: 'ClubResourceLibrary' },
      { id: 'support', label: 'Support Cases', component: 'ClubSupportPanel' }
    ],
    permissions: ['canAccessStaffHQ']
  },

  youth: {
    title: 'Youth Programs Hub',
    description: 'Youth development and engagement',
    icon: 'GraduationCap',
    tabs: [
      { id: 'programs', label: 'Programs', component: 'YouthProgramManager' },
      { id: 'hdt', label: 'Hit Draw Tap', component: 'HDTManagement' },
      { id: 'passport', label: 'Youth Passport', component: 'PassportManager' },
      { id: 'analytics', label: 'Analytics', component: 'YouthAnalytics' }
    ],
    permissions: ['canAccessStaffHQ']
  }
};

export default function HubEngine({ hubType, config = null }) {
  const [hubConfig, setHubConfig] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { permissions } = usePermissions();

  useEffect(() => {
    const cfg = config || HUB_CONFIGS[hubType];
    
    if (!cfg) {
      console.error(`Unknown hub type: ${hubType}`);
      return;
    }

    // Check permissions
    if (cfg.permissions && cfg.permissions.length > 0) {
      const hasPermission = cfg.permissions.some(perm => permissions[perm]);
      if (!hasPermission) {
        console.warn(`User lacks permission for hub: ${hubType}`);
        return;
      }
    }

    setHubConfig(cfg);
    setActiveTab(cfg.tabs[0]?.id || null);
    setIsLoading(false);
  }, [hubType, config, permissions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  if (!hubConfig) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-text-secondary">Hub not found or access denied.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-text-primary">
          {hubConfig.title}
        </h1>
        <p className="text-brand-text-secondary mt-1">
          {hubConfig.description}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${hubConfig.tabs.length}, 1fr)` }}>
          {hubConfig.tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {hubConfig.tabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            <DynamicHubContent
              componentName={tab.component}
              hubType={hubType}
              tabId={tab.id}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function DynamicHubContent({ componentName, hubType, tabId }) {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        // Try to load from hub-specific folder
        const module = await import(`../hub/tabs/${hubType}/${componentName}`).catch(() => {
          // Fallback to generic components
          return import(`../hub/tabs/generic/${componentName}`);
        });
        
        setComponent(() => module.default);
      } catch (err) {
        console.error(`Failed to load hub component: ${componentName}`, err);
        setError(err);
      }
    };

    loadComponent();
  }, [componentName, hubType]);

  if (error) {
    return (
      <div className="text-center py-12 text-brand-text-secondary">
        <p>Component not yet implemented: {componentName}</p>
        <p className="text-xs mt-2">Hub: {hubType} / Tab: {tabId}</p>
      </div>
    );
  }

  if (!Component) {
    return <SkeletonLoader className="h-96" />;
  }

  return <Component />;
}