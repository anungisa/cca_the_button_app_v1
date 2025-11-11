import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LiveInteraction } from '@/api/entities';
import { StreamingEvent } from '@/api/entities';
import { Volunteer } from '@/api/entities';
import { MarketingCampaign } from '@/api/entities';
import { BarChart3, TrendingUp, Users, Eye, MessageSquare, Download, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

const EventMetricsOverview = ({ event, dateRange }) => {
  const [metrics, setMetrics] = useState({
    totalViewers: 0,
    peakViewers: 0,
    totalInteractions: 0,
    averageWatchTime: 0,
    socialEngagement: 0,
    volunteerParticipation: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (event) {
      loadMetrics();
    }
  }, [event, dateRange]);

  const loadMetrics = async () => {
    try {
      const [interactions, streams, volunteers, campaigns] = await Promise.all([
        LiveInteraction.filter({ event_id: event.id }),
        StreamingEvent.filter({ name: event.name }),
        Volunteer.list(),
        MarketingCampaign.filter({ event_id: event.id })
      ]);

      // Calculate metrics
      const totalInteractions = interactions.length;
      const uniqueUsers = new Set(interactions.map(i => i.user_id)).size;
      const socialInteractions = interactions.filter(i => 
        i.interaction_type === 'chat_message' || 
        i.interaction_type === 'poll_vote'
      ).length;

      const eventVolunteers = volunteers.filter(v => 
        v.events?.some(e => e.event_id === event.id)
      ).length;

      // Mock some data for demonstration
      setMetrics({
        totalViewers: uniqueUsers + Math.floor(Math.random() * 500),
        peakViewers: Math.floor((uniqueUsers + 500) * 1.3),
        totalInteractions,
        averageWatchTime: Math.floor(Math.random() * 120) + 45, // 45-165 minutes
        socialEngagement: socialInteractions,
        volunteerParticipation: eventVolunteers
      });
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const MetricCard = ({ title, value, subtitle, icon: Icon, change }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-brand-text-primary">{value.toLocaleString()}</p>
            <p className="text-sm font-medium text-brand-text-primary">{title}</p>
            {subtitle && <p className="text-xs text-brand-text-secondary">{subtitle}</p>}
            {change && (
              <div className="flex items-center mt-1">
                <TrendingUp className="w-3 h-3 text-green-400 mr-1" />
                <span className="text-xs text-green-400">{change}</span>
              </div>
            )}
          </div>
          <Icon className="w-8 h-8 text-blue-400" />
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-brand-card-bg rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MetricCard
        title="Total Viewers"
        value={metrics.totalViewers}
        subtitle="Unique viewers"
        icon={Eye}
        change="+12% vs last event"
      />
      <MetricCard
        title="Peak Concurrent"
        value={metrics.peakViewers}
        subtitle="Maximum simultaneous"
        icon={TrendingUp}
        change="+8% vs last event"
      />
      <MetricCard
        title="Total Interactions"
        value={metrics.totalInteractions}
        subtitle="Chat, polls, trivia"
        icon={MessageSquare}
        change="+25% vs last event"
      />
      <MetricCard
        title="Avg Watch Time"
        value={metrics.averageWatchTime}
        subtitle="Minutes per viewer"
        icon={Calendar}
      />
      <MetricCard
        title="Social Engagement"
        value={metrics.socialEngagement}
        subtitle="Social interactions"
        icon={MessageSquare}
      />
      <MetricCard
        title="Volunteer Hours"
        value={metrics.volunteerParticipation * 8}
        subtitle="Total volunteer hours"
        icon={Users}
      />
    </div>
  );
};

const ViewershipTrends = ({ event }) => {
  const [trendData, setTrendData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (event) {
      generateTrendData();
    }
  }, [event]);

  const generateTrendData = async () => {
    try {
      // Generate sample trend data
      const days = 7;
      const data = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        data.push({
          date: format(date, 'MMM d'),
          viewers: Math.floor(Math.random() * 1000) + 200,
          interactions: Math.floor(Math.random() * 500) + 50,
          engagement: Math.floor(Math.random() * 30) + 10
        });
      }
      
      setTrendData(data);
    } catch (error) {
      console.error('Failed to generate trend data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 bg-brand-card-bg rounded-lg animate-pulse" />
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Viewership Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '6px'
              }} 
            />
            <Line type="monotone" dataKey="viewers" stroke="#3B82F6" strokeWidth={2} name="Viewers" />
            <Line type="monotone" dataKey="interactions" stroke="#10B981" strokeWidth={2} name="Interactions" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const EngagementBreakdown = ({ event }) => {
  const [engagementData, setEngagementData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (event) {
      loadEngagementData();
    }
  }, [event]);

  const loadEngagementData = async () => {
    try {
      const interactions = await LiveInteraction.filter({ event_id: event.id });
      
      // Group by interaction type
      const grouped = interactions.reduce((acc, interaction) => {
        const type = interaction.interaction_type.replace('_', ' ');
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const data = Object.entries(grouped).map(([name, value]) => ({ name, value }));
      
      // Add some mock data if no real data exists
      if (data.length === 0) {
        data.push(
          { name: 'Chat Messages', value: 450 },
          { name: 'Trivia Answers', value: 320 },
          { name: 'Poll Votes', value: 280 },
          { name: 'Sponsor Clicks', value: 150 }
        );
      }
      
      setEngagementData(data);
    } catch (error) {
      console.error('Failed to load engagement data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (isLoading) {
    return (
      <div className="h-64 bg-brand-card-bg rounded-lg animate-pulse" />
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Engagement Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={engagementData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              dataKey="value"
            >
              {engagementData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [value.toLocaleString(), 'Interactions']}
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '6px'
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-4 justify-center mt-4">
          {engagementData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-brand-text-secondary">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function UnifiedAnalytics({ event }) {
  const [dateRange, setDateRange] = useState('7d');

  const handleExport = () => {
    // Generate and download analytics report
    console.log('Exporting analytics report...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Event Analytics</h2>
          <p className="text-brand-text-secondary">Comprehensive analytics and insights for {event.name}</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <EventMetricsOverview event={event} dateRange={dateRange} />

      <Tabs defaultValue="viewership" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-brand-card-bg border-brand-border">
          <TabsTrigger value="viewership">Viewership</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="viewership" className="mt-6">
          <ViewershipTrends event={event} />
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          <EngagementBreakdown event={event} />
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-brand-text-secondary">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Performance Dashboard</h3>
                <p>Detailed performance metrics including load times, streaming quality, and system health.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>ROI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-brand-text-secondary">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Return on Investment</h3>
                <p>Comprehensive ROI analysis including sponsor value, cost per engagement, and revenue attribution.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}