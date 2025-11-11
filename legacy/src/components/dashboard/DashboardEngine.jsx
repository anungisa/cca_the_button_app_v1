
/**
 * Universal Dashboard Engine
 * Replaces 20+ individual dashboard pages with one configurable component
 */

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useXP } from '../XPContext';
import { usePermissions } from '../hooks/usePermissions';
import { enhancedEntityService } from '../services/EnhancedEntityService';
import SkeletonLoader from '../ui/SkeletonLoader';

/**
 * Dashboard configurations define the structure and behavior of each dashboard type
 */
const DASHBOARD_CONFIGS = {
  athlete: {
    title: 'Athlete Dashboard',
    icon: 'Trophy',
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        component: 'AthleteOverview'
      },
      {
        id: 'performance',
        label: 'Performance',
        component: 'PerformanceMetrics'
      },
      {
        id: 'training',
        label: 'Training',
        component: 'TrainingLog'
      },
      {
        id: 'goals',
        label: 'Goals',
        component: 'GoalTracker'
      }
    ],
    dataLoaders: {
      performance: async (userId) => {
        const { HighPerformanceLog, PerformanceBenchmark } = await import('@/api/entities');
        const [logs, benchmarks] = await Promise.all([
          enhancedEntityService.filter(HighPerformanceLog, { user_id: userId }, '-date', 30),
          enhancedEntityService.filter(PerformanceBenchmark, { user_id: userId }, '-test_date', 10)
        ]);
        return { logs, benchmarks };
      },
      achievements: async (userId) => {
        const { Achievement } = await import('@/api/entities');
        return await enhancedEntityService.filter(Achievement, { athlete_id: userId }, '-year', 20);
      }
    }
  },

  coach: {
    title: 'Coach Dashboard',
    icon: 'Users',
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        component: 'CoachOverview'
      },
      {
        id: 'athletes',
        label: 'My Athletes',
        component: 'AthleteRoster'
      },
      {
        id: 'sessions',
        label: 'Sessions',
        component: 'SessionHistory'
      },
      {
        id: 'performance',
        label: 'Performance',
        component: 'CoachPerformanceMetrics'
      }
    ],
    dataLoaders: {
      athletes: async (coachId) => {
        const { User, Team } = await import('@/api/entities');
        const teams = await enhancedEntityService.filter(Team, { coach_ids: coachId });
        return { teams };
      },
      performance: async (coachId) => {
        const { CoachPerformance } = await import('@/api/entities');
        return await enhancedEntityService.filter(CoachPerformance, { coach_id: coachId }, '-reporting_period', 6);
      }
    }
  },

  ma: {
    title: 'Member Association Dashboard',
    icon: 'Building',
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        component: 'MAOverview'
      },
      {
        id: 'clubs',
        label: 'Clubs',
        component: 'MAClubsPanel'
      },
      {
        id: 'compliance',
        label: 'Compliance',
        component: 'MACompliancePanel'
      },
      {
        id: 'insights',
        label: 'Insights',
        component: 'MAInsightsPanel'
      }
    ],
    dataLoaders: {
      clubs: async (maRegion) => {
        const { Club } = await import('@/api/entities');
        return await enhancedEntityService.filter(Club, { ma_region: maRegion }, '-membership_count', 100);
      },
      compliance: async (maRegion) => {
        const { MACompliance } = await import('@/api/entities');
        return await enhancedEntityService.filter(MACompliance, { ma_region: maRegion }, '-compliance_year', 1);
      },
      events: async (maRegion) => {
        const { Event } = await import('@/api/entities');
        return await enhancedEntityService.filter(Event, { ma_region: maRegion }, '-start_date', 50);
      }
    }
  },

  club: {
    title: 'Club Dashboard',
    icon: 'Building',
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        component: 'ClubOverview'
      },
      {
        id: 'members',
        label: 'Members',
        component: 'MembershipPanel'
      },
      {
        id: 'programs',
        label: 'Programs',
        component: 'ProgramsPanel'
      },
      {
        id: 'analytics',
        label: 'Analytics',
        component: 'ClubAnalyticsPanel'
      }
    ],
    dataLoaders: {
      club: async (clubId) => {
        const { Club } = await import('@/api/entities');
        return await enhancedEntityService.filter(Club, { id: clubId }, '-created_date', 1).then(clubs => clubs[0]);
      },
      metrics: async (clubId) => {
        const { ClubMetrics } = await import('@/api/entities');
        return await enhancedEntityService.filter(ClubMetrics, { club_id: clubId }, '-reporting_period', 12);
      }
    }
  },

  sponsor: {
    title: 'Sponsor Dashboard',
    icon: 'Handshake',
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        component: 'SponsorOverview'
      },
      {
        id: 'campaigns',
        label: 'Campaigns',
        component: 'SponsorCampaigns'
      },
      {
        id: 'roi',
        label: 'ROI Analytics',
        component: 'SponsorROI'
      }
    ],
    dataLoaders: {
      campaigns: async (sponsorId) => {
        const { SponsorCampaign } = await import('@/api/entities');
        return await enhancedEntityService.filter(SponsorCampaign, { sponsor_id: sponsorId }, '-created_date', 50);
      },
      contracts: async (sponsorId) => {
        const { SponsorContract } = await import('@/api/entities');
        return await enhancedEntityService.filter(SponsorContract, { sponsor_id: sponsorId }, '-start_date', 10);
      }
    }
  },

  executive: {
    title: 'Executive Dashboard',
    icon: 'TrendingUp',
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        component: 'ExecutiveOverview'
      },
      {
        id: 'kpis',
        label: 'Strategic KPIs',
        component: 'KPIDashboard'
      },
      {
        id: 'adoption',
        label: 'Platform Adoption',
        component: 'AdoptionMetrics'
      },
      {
        id: 'stakeholders',
        label: 'Stakeholders',
        component: 'StakeholderRelations'
      }
    ],
    dataLoaders: {
      kpis: async () => {
        const { StrategicKPI } = await import('@/api/entities');
        return await enhancedEntityService.filter(StrategicKPI, { is_active: true }, '-created_date', 50);
      },
      goals: async () => {
        const { StrategicGoal } = await import('@/api/entities');
        return await enhancedEntityService.filter(StrategicGoal, {}, '-created_date', 20);
      }
    }
  }
};

export default function DashboardEngine({ dashboardType, config = null }) {
  const [dashboardConfig, setDashboardConfig] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [dashboardData, setDashboardData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useXP();
  const { permissions } = usePermissions();

  useEffect(() => {
    // Load configuration
    const cfg = config || DASHBOARD_CONFIGS[dashboardType];
    if (!cfg) {
      console.error(`Unknown dashboard type: ${dashboardType}`);
      return;
    }

    setDashboardConfig(cfg);
    setActiveTab(cfg.tabs[0]?.id || null);
  }, [dashboardType, config]);

  const getUserContextId = useCallback(() => {
    if (dashboardType === 'athlete' || dashboardType === 'coach') {
      return user?.id;
    }
    if (dashboardType === 'ma') {
      return user?.ma_region;
    }
    if (dashboardType === 'club') {
      return user?.home_club_id;
    }
    if (dashboardType === 'sponsor') {
      return user?.sponsor_id;
    }
    return user?.id;
  }, [dashboardType, user]);

  const loadDashboardData = useCallback(async () => {
    if (!dashboardConfig || !user) {
      // If dashboardConfig or user are not yet available, don't attempt to load data
      return;
    }

    setIsLoading(true);
    
    try {
      const loaders = dashboardConfig.dataLoaders || {};
      const dataPromises = Object.entries(loaders).map(async ([key, loaderFn]) => {
        try {
          const contextId = getUserContextId();
          const data = await loaderFn(contextId);
          return [key, data];
        } catch (error) {
          console.error(`Failed to load ${key}:`, error);
          return [key, null]; // Return null for failed loaders
        }
      });

      const results = await Promise.all(dataPromises);
      const data = Object.fromEntries(results);
      
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dashboardConfig, user, getUserContextId]); // Dependencies for loadDashboardData

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]); // useEffect now depends on the memoized loadDashboardData

  if (!dashboardConfig) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-text-secondary">Invalid dashboard configuration</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-brand-border rounded animate-pulse w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonLoader key={i} className="h-32" />
          ))}
        </div>
        <SkeletonLoader className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-text-primary">
          {dashboardConfig.title}
        </h1>
        <p className="text-brand-text-secondary mt-1">
          Welcome back, {user?.full_name || 'User'}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          {dashboardConfig.tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {dashboardConfig.tabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            <Suspense fallback={<SkeletonLoader className="h-96" />}>
              <DynamicTabContent
                componentName={tab.component}
                data={dashboardData}
                dashboardType={dashboardType}
                onRefresh={loadDashboardData}
              />
            </Suspense>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

/**
 * Dynamic Tab Content Loader
 * Lazy loads tab components based on configuration
 */
function DynamicTabContent({ componentName, data, dashboardType, onRefresh }) {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        const module = await import(`../dashboard/tabs/${componentName}`);
        setComponent(() => module.default);
      } catch (err) {
        console.error(`Failed to load component: ${componentName}`, err);
        setError(err);
      }
    };

    loadComponent();
  }, [componentName]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-text-secondary">
          Failed to load dashboard component: {componentName}
        </p>
        <Button onClick={onRefresh} variant="outline" className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  return <Component data={data} dashboardType={dashboardType} onRefresh={onRefresh} />;
}
