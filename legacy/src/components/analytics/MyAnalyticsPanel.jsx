import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDomoEmbed } from './useDomoEmbed';
import { usePermissions } from '../hooks/usePermissions';
import { BarChart3, TrendingUp, TrendingDown, Users, DollarSign, Calendar, Target, Download, RefreshCw, Filter } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Custom Tooltip component for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-card-bg border border-brand-border p-3 rounded-lg shadow-lg">
        <p className="text-brand-text-primary font-medium">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-brand-text-secondary">
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MetricCard = ({ title, value, change, icon: Icon, color = "text-blue-400", trend }) => (
  <Card className="bg-brand-card-bg border-brand-border">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-brand-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-brand-text-primary">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-1 text-sm ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
      {trend && (
        <div className="mt-3">
          <Progress value={trend} className="h-2" />
        </div>
      )}
    </CardContent>
  </Card>
);

const ChartCard = ({ title, children, className = "" }) => (
  <Card className={`bg-brand-card-bg border-brand-border ${className}`}>
    <CardHeader>
      <CardTitle className="text-brand-text-primary">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

const MyAnalyticsPanel = ({ dashboardType = 'executive-overview' }) => {
  const [timeframe, setTimeframe] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { permissions } = usePermissions();

  const { embedUrl, loading: domoLoading } = useDomoEmbed(dashboardType);

  // Mock data for charts
  const mockData = {
    metrics: [
      { name: 'Total Users', value: '12,456', change: 12.5, icon: Users, color: 'text-blue-400' },
      { name: 'Revenue', value: '$45,230', change: 8.2, icon: DollarSign, color: 'text-green-400' },
      { name: 'Events', value: '342', change: -2.1, icon: Calendar, color: 'text-purple-400' },
      { name: 'Goals Met', value: '89%', change: 15.3, icon: Target, color: 'text-amber-400', trend: 89 },
    ],
    chartData: [
      { name: 'Jan', value: 400, users: 240 },
      { name: 'Feb', value: 300, users: 139 },
      { name: 'Mar', value: 200, users: 980 },
      { name: 'Apr', value: 278, users: 390 },
      { name: 'May', value: 189, users: 480 },
      { name: 'Jun', value: 239, users: 380 },
    ],
    pieData: [
      { name: 'Desktop', value: 400, color: '#ef4444' },
      { name: 'Mobile', value: 300, color: '#3b82f6' },
      { name: 'Tablet', value: 200, color: '#10b981' },
    ]
  };

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeframe]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleExport = () => {
    // Simulate export functionality
    console.log('Exporting analytics data...');
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-brand-card-bg rounded-lg animate-pulse border border-brand-border" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-8 text-center">
          <BarChart3 className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Analytics Unavailable</h3>
          <p className="text-brand-text-secondary mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockData.metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Trend Analysis">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <CustomTooltip />
              <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockData.pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {mockData.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <CustomTooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* DOMO Embed if available */}
      {embedUrl && (
        <ChartCard title="Advanced Analytics" className="col-span-full">
          <div className="h-96">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              title="Analytics Dashboard"
            />
          </div>
        </ChartCard>
      )}
    </div>
  );
};

export default MyAnalyticsPanel;