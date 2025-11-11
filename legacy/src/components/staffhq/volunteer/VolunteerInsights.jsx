import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Volunteer, VolunteerCampaign } from '@/api/entities';
import { Users, TrendingUp, AlertTriangle, Award, Calendar, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const VolunteerInsights = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [timeframe, setTimeframe] = useState('6months');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [volunteersData, campaignsData] = await Promise.all([
        Volunteer.list('-last_active_date', 500),
        VolunteerCampaign.list('-created_date', 100)
      ]);
      setVolunteers(volunteersData || []);
      setCampaigns(campaignsData || []);
    } catch (error) {
      console.error('Error loading volunteer insights data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRegionBreakdown = () => {
    const regionCounts = {};
    volunteers.forEach(volunteer => {
      const region = volunteer.ma_region || 'Unknown';
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });

    return Object.entries(regionCounts).map(([region, count]) => ({
      region,
      count,
      percentage: ((count / volunteers.length) * 100).toFixed(1)
    })).sort((a, b) => b.count - a.count);
  };

  const getComplianceBreakdown = () => {
    let compliant = 0;
    let pending = 0;
    let expired = 0;
    let unknown = 0;

    volunteers.forEach(volunteer => {
      const compliance = volunteer.compliance || {};
      const statuses = [
        compliance.respect_in_sport,
        compliance.policy_signed,
        compliance.background_check
      ];

      if (statuses.every(status => status === 'compliant')) {
        compliant++;
      } else if (statuses.some(status => status === 'expired')) {
        expired++;
      } else if (statuses.some(status => status === 'pending')) {
        pending++;
      } else {
        unknown++;
      }
    });

    return [
      { name: 'Compliant', value: compliant, color: '#10b981' },
      { name: 'Pending', value: pending, color: '#f59e0b' },
      { name: 'Expired', value: expired, color: '#ef4444' },
      { name: 'Unknown', value: unknown, color: '#6b7280' }
    ];
  };

  const getActivityTrends = () => {
    // Simulate activity data over the last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      activeVolunteers: Math.floor(Math.random() * 200) + 100,
      newSignups: Math.floor(Math.random() * 50) + 10,
      events: Math.floor(Math.random() * 15) + 5
    }));
  };

  const regionData = getRegionBreakdown();
  const complianceData = getComplianceBreakdown();
  const activityData = getActivityTrends();

  const totalVolunteers = volunteers.length;
  const activeVolunteers = volunteers.filter(v => 
    v.last_active_date && 
    new Date(v.last_active_date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  ).length;
  const avgXP = totalVolunteers > 0 ? 
    Math.round(volunteers.reduce((sum, v) => sum + (v.xp_stats?.total_xp || 0), 0) / totalVolunteers) : 0;

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <p className="text-brand-text-secondary">Loading volunteer insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-brand-text-primary">Volunteer Insights</h3>
          <p className="text-brand-text-secondary">Analytics and trends for volunteer engagement</p>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-48 bg-brand-charcoal border-brand-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Total Volunteers</p>
                <p className="text-2xl font-bold text-brand-text-primary">{totalVolunteers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Active (90 days)</p>
                <p className="text-2xl font-bold text-brand-text-primary">{activeVolunteers}</p>
                <p className="text-xs text-brand-text-secondary">
                  {totalVolunteers > 0 ? Math.round((activeVolunteers / totalVolunteers) * 100) : 0}% of total
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Average XP</p>
                <p className="text-2xl font-bold text-brand-text-primary">{avgXP}</p>
              </div>
              <Award className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Active Campaigns</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {campaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Trends */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Activity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="activeVolunteers" fill="#3b82f6" name="Active Volunteers" />
                <Bar dataKey="newSignups" fill="#10b981" name="New Signups" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Compliance Status */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={complianceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value, percentage }) => `${name}: ${value}`}
                >
                  {complianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Regional Breakdown */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            Regional Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regionData.map((region) => (
              <div key={region.region} className="flex justify-between items-center p-3 bg-brand-charcoal rounded-lg">
                <span className="text-brand-text-primary font-medium">{region.region}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-brand-border">
                    {region.count}
                  </Badge>
                  <span className="text-sm text-brand-text-secondary">{region.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteerInsights;