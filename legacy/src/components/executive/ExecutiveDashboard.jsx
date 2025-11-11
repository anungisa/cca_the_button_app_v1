import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp, TrendingDown, DollarSign, Users, Target, 
  Calendar, AlertTriangle, CheckCircle2, BarChart3, 
  PieChart, LineChart, Activity, Globe
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar } from 'recharts';

const KPICard = ({ kpi, onClick }) => {
  const getIcon = (category) => {
    switch (category) {
      case 'fan_engagement': return Users;
      case 'club_adoption': return Target;
      case 'sponsor_performance': return DollarSign;
      case 'platform_usage': return Activity;
      default: return BarChart3;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getProgressPercentage = () => {
    if (!kpi.target_value || !kpi.baseline_value) return 0;
    return Math.min(100, ((kpi.current_value - kpi.baseline_value) / (kpi.target_value - kpi.baseline_value)) * 100);
  };

  const Icon = getIcon(kpi.category);
  const progress = getProgressPercentage();

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onClick(kpi)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-brand-text-secondary">
          {kpi.kpi_name}
        </CardTitle>
        <Icon className="h-4 w-4 text-brand-text-secondary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-brand-text-primary mb-2">
          {kpi.metric_type === 'currency' ? `$${kpi.current_value?.toLocaleString()}` : 
           kpi.metric_type === 'percentage' ? `${kpi.current_value}%` : 
           kpi.current_value?.toLocaleString()}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            {getTrendIcon(kpi.trend)}
            <span className="text-brand-text-secondary">vs target</span>
          </div>
          <Badge variant={progress >= 90 ? "default" : progress >= 75 ? "secondary" : "destructive"}>
            {Math.round(progress)}%
          </Badge>
        </div>
        {kpi.target_value && (
          <div className="mt-2">
            <div className="w-full bg-brand-border rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  progress >= 90 ? 'bg-green-500' : progress >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const FinancialSummary = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Financial Summary</CardTitle>
      <CardDescription>Year-to-date financial performance</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-brand-charcoal/50 rounded-lg">
          <div className="text-2xl font-bold text-green-400 mb-1">$2.4M</div>
          <div className="text-sm text-brand-text-secondary">Revenue YTD</div>
          <div className="text-xs text-green-400 mt-1">↗ 12% vs target</div>
        </div>
        <div className="text-center p-4 bg-brand-charcoal/50 rounded-lg">
          <div className="text-2xl font-bold text-blue-400 mb-1">$1.8M</div>
          <div className="text-sm text-brand-text-secondary">Expenses YTD</div>
          <div className="text-xs text-blue-400 mt-1">↘ 3% under budget</div>
        </div>
        <div className="text-center p-4 bg-brand-charcoal/50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-400 mb-1">$600K</div>
          <div className="text-sm text-brand-text-secondary">Net Surplus</div>
          <div className="text-xs text-yellow-400 mt-1">↗ 25% vs plan</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const StrategicInitiatives = ({ initiatives }) => (
  <Card>
    <CardHeader>
      <CardTitle>Strategic Initiatives</CardTitle>
      <CardDescription>Progress on key strategic priorities</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {initiatives.map((initiative, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-brand-charcoal/30 rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-brand-text-primary">{initiative.name}</h4>
              <p className="text-sm text-brand-text-secondary">{initiative.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm font-medium text-brand-text-primary">{initiative.progress}%</div>
                <div className="text-xs text-brand-text-secondary">Complete</div>
              </div>
              <div className="w-16">
                <div className="w-full bg-brand-border rounded-full h-2">
                  <div 
                    className="h-2 bg-brand-red rounded-full transition-all"
                    style={{ width: `${initiative.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default function ExecutiveDashboard() {
  const [kpis, setKpis] = useState([]);
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExecutiveData();
  }, []);

  const loadExecutiveData = async () => {
    setIsLoading(true);
    
    // Mock executive KPIs
    const mockKPIs = [
      {
        id: '1',
        kpi_name: 'Active Users',
        category: 'fan_engagement',
        metric_type: 'count',
        current_value: 45000,
        target_value: 50000,
        baseline_value: 35000,
        trend: 'increasing',
        period: 'monthly'
      },
      {
        id: '2',
        kpi_name: 'Club Adoption Rate',
        category: 'club_adoption',
        metric_type: 'percentage',
        current_value: 78,
        target_value: 85,
        baseline_value: 60,
        trend: 'increasing',
        period: 'quarterly'
      },
      {
        id: '3',
        kpi_name: 'Sponsor Revenue',
        category: 'sponsor_performance',
        metric_type: 'currency',
        current_value: 850000,
        target_value: 1000000,
        baseline_value: 700000,
        trend: 'increasing',
        period: 'annual'
      },
      {
        id: '4',
        kpi_name: 'Platform Uptime',
        category: 'platform_usage',
        metric_type: 'percentage',
        current_value: 99.7,
        target_value: 99.9,
        baseline_value: 99.0,
        trend: 'stable',
        period: 'monthly'
      },
      {
        id: '5',
        kpi_name: 'Volunteer Hours',
        category: 'volunteer_activity',
        metric_type: 'count',
        current_value: 12500,
        target_value: 15000,
        baseline_value: 10000,
        trend: 'increasing',
        period: 'quarterly'
      },
      {
        id: '6',
        kpi_name: 'Event Participation',
        category: 'fan_engagement',
        metric_type: 'count',
        current_value: 8750,
        target_value: 10000,
        baseline_value: 7500,
        trend: 'increasing',
        period: 'monthly'
      }
    ];

    setKpis(mockKPIs);
    setIsLoading(false);
  };

  const mockInitiatives = [
    {
      name: 'Digital Transformation',
      description: 'Modernizing all core systems and processes',
      progress: 85,
      dueDate: '2024-12-31'
    },
    {
      name: 'Club Engagement Strategy',
      description: 'Increase club participation and satisfaction',
      progress: 65,
      dueDate: '2024-10-15'
    },
    {
      name: 'Youth Development Program',
      description: 'Expand youth participation by 25%',
      progress: 45,
      dueDate: '2025-03-31'
    },
    {
      name: 'Sustainability Initiative',
      description: 'Reduce environmental impact by 30%',
      progress: 30,
      dueDate: '2025-06-30'
    }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 180000, expenses: 140000 },
    { month: 'Feb', revenue: 220000, expenses: 160000 },
    { month: 'Mar', revenue: 280000, expenses: 180000 },
    { month: 'Apr', revenue: 200000, expenses: 150000 },
    { month: 'May', revenue: 240000, expenses: 170000 },
    { month: 'Jun', revenue: 320000, expenses: 200000 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-brand-text-secondary">Loading executive dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-charcoal min-h-screen">
      <div className="max-w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">Executive Dashboard</h1>
            <p className="text-brand-text-secondary">Strategic overview and key performance indicators</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Q3 2024
            </Button>
            <Button>
              <Globe className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="operational">Operations</TabsTrigger>
            <TabsTrigger value="strategic">Strategic</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kpis.map((kpi) => (
                <KPICard key={kpi.id} kpi={kpi} onClick={setSelectedKPI} />
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FinancialSummary />
              <StrategicInitiatives initiatives={mockInitiatives} />
            </div>
          </TabsContent>

          <TabsContent value="financial" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue vs Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <FinancialSummary />
            </div>
          </TabsContent>

          <TabsContent value="operational" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.filter(kpi => ['platform_usage', 'volunteer_activity'].includes(kpi.category)).map((kpi) => (
                <KPICard key={kpi.id} kpi={kpi} onClick={setSelectedKPI} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="strategic" className="mt-6">
            <StrategicInitiatives initiatives={mockInitiatives} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}