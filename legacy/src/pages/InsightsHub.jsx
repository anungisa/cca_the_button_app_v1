import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  Trophy, 
  Heart, 
  ShieldCheck, 
  Building,
  Target,
  TrendingUp
} from 'lucide-react';
import { useEmbedPermissions } from '../components/hooks/useEmbedPermissions';
import DomoDashboardView from '../components/insights/DomoDashboardView';
import DashboardTile from '../components/insights/DashboardTile';

// DOMO Dashboard URLs - In production, these would come from a config API or be built into the app
const DASHBOARD_URLS = {
  general_insights: 'https://public.domo.com/cards/dJbRP',
  youth_data: 'https://public.domo.com/cards/aVqjO', 
  ma_engagement: 'https://public.domo.com/cards/bWxkP',
  coach_insights: 'https://public.domo.com/cards/cXylQ',
  safe_sport: 'https://public.domo.com/cards/dYzmR',
  ftloc_impact: 'https://public.domo.com/cards/eZanS',
  club_performance: 'https://public.domo.com/cards/fAbpT',
  hp_metrics: 'https://public.domo.com/cards/gBcqU'
};

const dashboardConfigs = [
  {
    id: 'general_insights',
    title: 'National Overview',
    description: 'High-level engagement metrics, user growth, and platform adoption across Canada.',
    icon: BarChart3,
    requiredRole: 'Admin/SMT',
    dashboardKey: 'general_insights',
    category: 'overview'
  },
  {
    id: 'youth_data',
    title: 'Youth Development',
    description: 'Youth participation trends, FTLOC impact, and development pipeline insights.',
    icon: Target,
    requiredRole: 'DEI Lead/MA Admin',
    dashboardKey: 'youth_data',
    category: 'youth'
  },
  {
    id: 'ma_engagement',
    title: 'MA Regional Activity',
    description: 'Club-level activity, membership trends, and regional performance by province.',
    icon: Building,
    requiredRole: 'MA Admin',
    dashboardKey: 'ma_engagement',
    category: 'regional'
  },
  {
    id: 'coach_insights',
    title: 'Coaching Analytics',
    description: 'Athlete development stats, Smart Broom usage trends, and coaching effectiveness.',
    icon: Trophy,
    requiredRole: 'Coach',
    dashboardKey: 'coach_insights',
    category: 'performance'
  },
  {
    id: 'safe_sport',
    title: 'Safe Sport Compliance',
    description: 'Certification status, training completion rates, and compliance tracking.',
    icon: ShieldCheck,
    requiredRole: 'Admin/MA Admin',
    dashboardKey: 'safe_sport',
    category: 'compliance'
  },
  {
    id: 'ftloc_impact',
    title: 'FTLOC Impact Tracker',
    description: 'Donation trends, scholar progress, and community investment outcomes.',
    icon: Heart,
    requiredRole: 'All Users',
    dashboardKey: 'ftloc_impact',
    category: 'impact'
  },
  {
    id: 'club_performance',
    title: 'Club Performance',
    description: 'Individual club metrics, membership health, and operational insights.',
    icon: Users,
    requiredRole: 'Club Admin',
    dashboardKey: 'club_performance',
    category: 'clubs'
  },
  {
    id: 'hp_metrics',
    title: 'High Performance',
    description: 'Elite athlete tracking, performance benchmarks, and pathway progression.',
    icon: TrendingUp,
    requiredRole: 'Athlete/Coach',
    dashboardKey: 'hp_metrics',
    category: 'performance'
  }
];

export default function InsightsHub() {
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const { user, hasAccess, getUserRole, isLoading } = useEmbedPermissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-brand-text-secondary">Loading insights...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-brand-text-secondary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-brand-text-primary mb-2">Sign In Required</h2>
        <p className="text-brand-text-secondary">Please sign in to access analytics dashboards.</p>
      </div>
    );
  }

  const accessibleDashboards = dashboardConfigs.filter(config => 
    hasAccess(config.dashboardKey)
  );

  if (accessibleDashboards.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-brand-text-secondary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-brand-text-primary mb-2">No Dashboards Available</h2>
        <p className="text-brand-text-secondary">
          Your current role ({getUserRole()}) doesn't have access to any analytics dashboards.
        </p>
      </div>
    );
  }

  const categories = [
    { id: 'all', label: 'All Dashboards' },
    { id: 'overview', label: 'Overview' },
    { id: 'performance', label: 'Performance' },
    { id: 'regional', label: 'Regional' },
    { id: 'youth', label: 'Youth & DEI' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'impact', label: 'Impact' },
    { id: 'clubs', label: 'Clubs' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Analytics Hub</h1>
          <p className="text-brand-text-secondary mt-1">
            Data-driven insights powered by DOMO • Role: {getUserRole()}
          </p>
        </div>
        <Badge className="bg-brand-red text-white">
          {accessibleDashboards.length} Dashboard{accessibleDashboards.length !== 1 ? 's' : ''} Available
        </Badge>
      </div>

      {selectedDashboard ? (
        /* Full Dashboard View */
        <div className="space-y-4">
          <button
            onClick={() => setSelectedDashboard(null)}
            className="text-brand-red hover:text-red-700 font-medium"
          >
            ← Back to Dashboard Grid
          </button>
          <DomoDashboardView
            title={selectedDashboard.title}
            description={selectedDashboard.description}
            embedUrl={DASHBOARD_URLS[selectedDashboard.id]}
            icon={selectedDashboard.icon}
            height="700px"
            allowFullscreen={true}
          />
        </div>
      ) : (
        /* Dashboard Grid View */
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 mb-8">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accessibleDashboards
                  .filter(dashboard => category.id === 'all' || dashboard.category === category.id)
                  .map(dashboard => (
                    <DashboardTile
                      key={dashboard.id}
                      title={dashboard.title}
                      description={dashboard.description}
                      icon={dashboard.icon}
                      requiredRole={dashboard.requiredRole}
                      dashboardKey={dashboard.dashboardKey}
                      onClick={() => setSelectedDashboard(dashboard)}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}