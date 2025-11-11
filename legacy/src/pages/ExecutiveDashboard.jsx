import React, { useState, useEffect } from 'react';
import { usePermissions } from '../components/hooks/usePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  BarChart3,
  Calendar,
  Globe,
  Zap,
  Shield,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import modular components
import PlatformAdoptionCenter from '../components/executive/PlatformAdoptionCenter';
import StrategicKPIDashboard from '../components/executive/StrategicKPIDashboard';
import BrandProductToolkit from '../components/executive/BrandProductToolkit';
import StakeholderRelationshipLog from '../components/executive/StakeholderRelationshipLog';
import DeliveryPulseBoard from '../components/executive/DeliveryPulseBoard';
import CommunicationLibrary from '../components/executive/CommunicationLibrary';

export default function ExecutiveDashboard() {
  const { permissions, isLoading } = usePermissions();
  const [activeTab, setActiveTab] = useState('overview');
  const [kpiData, setKpiData] = useState({
    totalUsers: 125000,
    monthlyActiveUsers: 45000,
    clubEngagement: 78,
    revenueGrowth: 12.5,
    platformAdoption: 68,
    sponsorSatisfaction: 92
  });

  useEffect(() => {
    loadExecutiveData();
  }, []);

  const loadExecutiveData = async () => {
    try {
      // Simulate loading executive KPIs
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setKpiData({
        totalUsers: 125000,
        monthlyActiveUsers: 45000,
        clubEngagement: 78,
        revenueGrowth: 12.5,
        platformAdoption: 68,
        sponsorSatisfaction: 92
      });
    } catch (error) {
      console.error('Error loading executive data:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-brand-text-secondary">Loading Executive Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!permissions?.canAccessExecutiveHub) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-4">
        <Card className="max-w-md bg-brand-card-bg border-brand-border">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-brand-red mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brand-text-primary mb-2">Access Restricted</h2>
            <p className="text-brand-text-secondary">
              You need executive access to view this dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const MetricCard = ({ title, value, change, icon: Icon, color = "blue" }) => {
    const getChangeIcon = () => {
      if (change > 0) return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      if (change < 0) return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      return <Minus className="w-4 h-4 text-gray-500" />;
    };

    const getChangeColor = () => {
      if (change > 0) return "text-green-500";
      if (change < 0) return "text-red-500";
      return "text-gray-500";
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">{title}</p>
                <p className="text-2xl font-bold text-brand-text-primary">{value}</p>
                {change !== undefined && (
                  <div className="flex items-center gap-1 mt-1">
                    {getChangeIcon()}
                    <span className={`text-sm ${getChangeColor()}`}>
                      {Math.abs(change)}%
                    </span>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-lg bg-${color}-500/10`}>
                <Icon className={`w-6 h-6 text-${color}-500`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-charcoal pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-brand-text-primary">Executive Dashboard</h1>
              <p className="text-brand-text-secondary">
                Strategic overview and key performance indicators
              </p>
            </div>
          </div>

          {/* Executive KPI Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Total Platform Users"
              value={kpiData.totalUsers.toLocaleString()}
              change={8.2}
              icon={Users}
              color="blue"
            />
            <MetricCard
              title="Monthly Active Users"
              value={kpiData.monthlyActiveUsers.toLocaleString()}
              change={15.3}
              icon={Zap}
              color="green"
            />
            <MetricCard
              title="Club Engagement Score"
              value={`${kpiData.clubEngagement}%`}
              change={3.1}
              icon={Target}
              color="purple"
            />
            <MetricCard
              title="Revenue Growth"
              value={`${kpiData.revenueGrowth}%`}
              change={2.4}
              icon={DollarSign}
              color="emerald"
            />
            <MetricCard
              title="Platform Adoption"
              value={`${kpiData.platformAdoption}%`}
              change={12.8}
              icon={Globe}
              color="indigo"
            />
            <MetricCard
              title="Sponsor Satisfaction"
              value={`${kpiData.sponsorSatisfaction}%`}
              change={5.7}
              icon={TrendingUp}
              color="orange"
            />
          </div>
        </div>

        {/* Executive Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-brand-card-bg border-brand-border">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="adoption" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Adoption</span>
            </TabsTrigger>
            <TabsTrigger value="kpis" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">KPIs</span>
            </TabsTrigger>
            <TabsTrigger value="brand" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Brand</span>
            </TabsTrigger>
            <TabsTrigger value="stakeholders" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Stakeholders</span>
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Delivery</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Alert className="mb-6">
              <TrendingUp className="h-4 w-4" />
              <AlertTitle>Executive Summary</AlertTitle>
              <AlertDescription>
                Platform performance is strong with 15.3% MAU growth and 92% sponsor satisfaction. 
                Focus areas: Club engagement acceleration and platform adoption completion.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-brand-text-primary">Platform Migration Complete</p>
                      <p className="text-xs text-brand-text-secondary">Successfully migrated 68% of clubs to new platform</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-brand-text-primary">Sponsor Revenue Growth</p>
                      <p className="text-xs text-brand-text-secondary">12.5% increase in sponsorship revenue this quarter</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-brand-text-primary">User Engagement Peak</p>
                      <p className="text-xs text-brand-text-secondary">45,000 monthly active users - highest on record</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Strategic Priorities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-brand-text-primary">Complete Platform Adoption</p>
                      <p className="text-xs text-brand-text-secondary">Target: 85% club adoption by Q2</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-brand-text-primary">Youth Engagement Initiative</p>
                      <p className="text-xs text-brand-text-secondary">Expand youth programs to increase participation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-brand-text-primary">Sponsor Experience Enhancement</p>
                      <p className="text-xs text-brand-text-secondary">Launch new ROI dashboard and analytics tools</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="adoption" className="mt-6">
            <PlatformAdoptionCenter />
          </TabsContent>

          <TabsContent value="kpis" className="mt-6">
            <StrategicKPIDashboard />
          </TabsContent>

          <TabsContent value="brand" className="mt-6">
            <BrandProductToolkit />
          </TabsContent>

          <TabsContent value="stakeholders" className="mt-6">
            <StakeholderRelationshipLog />
          </TabsContent>

          <TabsContent value="delivery" className="mt-6">
            <DeliveryPulseBoard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}