import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Users,
  Building2,
  Calendar,
  Target,
  Download,
  RefreshCw
} from 'lucide-react';
import { Bar, Line, Pie, ResponsiveContainer, BarChart, LineChart, PieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Incident } from '@/api/entities';
import { format, subDays, startOfDay } from 'date-fns';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function IncidentStats() {
  const [stats, setStats] = useState({
    overview: {},
    trends: [],
    categoryBreakdown: [],
    departmentWorkload: [],
    slaPerformance: {},
    riskAnalysis: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);

  useEffect(() => {
    loadStatistics();
  }, [dateRange]);

  const loadStatistics = async () => {
    setIsLoading(true);
    try {
      const endDate = new Date();
      const startDate = subDays(endDate, dateRange);
      
      // Load all incidents in range
      const incidents = await Incident.filter({
        created_date: { $gte: startDate.toISOString() }
      }, '-created_date', 1000);

      // Calculate overview stats
      const overview = calculateOverviewStats(incidents);
      
      // Calculate trends
      const trends = calculateTrendData(incidents, dateRange);
      
      // Category breakdown
      const categoryBreakdown = calculateCategoryBreakdown(incidents);
      
      // Department workload
      const departmentWorkload = calculateDepartmentWorkload(incidents);
      
      // SLA performance
      const slaPerformance = calculateSLAPerformance(incidents);
      
      // Risk analysis
      const riskAnalysis = calculateRiskAnalysis(incidents);

      setStats({
        overview,
        trends,
        categoryBreakdown,
        departmentWorkload,
        slaPerformance,
        riskAnalysis
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateOverviewStats = (incidents) => {
    const total = incidents.length;
    const open = incidents.filter(i => ['new', 'open', 'in_progress'].includes(i.status)).length;
    const escalated = incidents.filter(i => i.escalation_level > 0).length;
    const critical = incidents.filter(i => i.priority === 'critical').length;
    const resolved = incidents.filter(i => ['resolved', 'closed'].includes(i.status)).length;
    const confidential = incidents.filter(i => i.is_confidential).length;

    return {
      total,
      open,
      escalated,
      critical,
      resolved,
      confidential,
      resolutionRate: total > 0 ? ((resolved / total) * 100).toFixed(1) : 0
    };
  };

  const calculateTrendData = (incidents, days) => {
    const trendData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = startOfDay(date);
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const dayIncidents = incidents.filter(incident => {
        const createdDate = new Date(incident.created_date);
        return createdDate >= dayStart && createdDate < dayEnd;
      });

      const resolvedIncidents = incidents.filter(incident => {
        const updatedDate = new Date(incident.updated_date);
        return ['resolved', 'closed'].includes(incident.status) && 
               updatedDate >= dayStart && updatedDate < dayEnd;
      });

      trendData.push({
        date: format(date, 'MMM dd'),
        created: dayIncidents.length,
        resolved: resolvedIncidents.length,
        critical: dayIncidents.filter(i => i.priority === 'critical').length,
        escalated: dayIncidents.filter(i => i.escalation_level > 0).length
      });
    }
    return trendData;
  };

  const calculateCategoryBreakdown = (incidents) => {
    const categories = {};
    incidents.forEach(incident => {
      const category = incident.category || 'uncategorized';
      if (!categories[category]) {
        categories[category] = { name: category.replace('_', ' '), count: 0, critical: 0 };
      }
      categories[category].count++;
      if (incident.priority === 'critical') {
        categories[category].critical++;
      }
    });

    return Object.values(categories).sort((a, b) => b.count - a.count);
  };

  const calculateDepartmentWorkload = (incidents) => {
    const departments = {};
    incidents.forEach(incident => {
      const dept = incident.assigned_department || 'unassigned';
      if (!departments[dept]) {
        departments[dept] = { 
          name: dept.replace('_', ' '), 
          total: 0, 
          open: 0, 
          overdue: 0,
          avgResolutionHours: 0 
        };
      }
      departments[dept].total++;
      if (['new', 'open', 'in_progress'].includes(incident.status)) {
        departments[dept].open++;
      }
      
      // Calculate if overdue (simplified logic)
      const hoursSinceCreated = (new Date() - new Date(incident.created_date)) / (1000 * 60 * 60);
      const slaHours = incident.priority === 'critical' ? 24 : 
                      incident.priority === 'high' ? 72 : 168;
      if (hoursSinceCreated > slaHours && !['resolved', 'closed'].includes(incident.status)) {
        departments[dept].overdue++;
      }
    });

    return Object.values(departments).sort((a, b) => b.total - a.total);
  };

  const calculateSLAPerformance = (incidents) => {
    let totalSLAChecks = 0;
    let slaBreaches = 0;
    let totalResolutionTime = 0;
    let resolvedCount = 0;

    incidents.forEach(incident => {
      const hoursSinceCreated = (new Date() - new Date(incident.created_date)) / (1000 * 60 * 60);
      const slaHours = incident.priority === 'critical' ? 24 : 
                      incident.priority === 'high' ? 72 : 
                      incident.priority === 'medium' ? 168 : 336;
      
      totalSLAChecks++;
      if (hoursSinceCreated > slaHours && !['resolved', 'closed'].includes(incident.status)) {
        slaBreaches++;
      }

      if (['resolved', 'closed'].includes(incident.status)) {
        totalResolutionTime += hoursSinceCreated;
        resolvedCount++;
      }
    });

    return {
      complianceRate: totalSLAChecks > 0 ? (((totalSLAChecks - slaBreaches) / totalSLAChecks) * 100).toFixed(1) : 100,
      totalBreaches: slaBreaches,
      avgResolutionHours: resolvedCount > 0 ? (totalResolutionTime / resolvedCount).toFixed(1) : 0
    };
  };

  const calculateRiskAnalysis = (incidents) => {
    const highRiskIncidents = incidents.filter(i => 
      i.priority === 'critical' || 
      i.category === 'safe_sport' || 
      i.escalation_level >= 2
    );

    const recurringIssues = {};
    incidents.forEach(incident => {
      if (incident.club_id) {
        const key = `${incident.club_id}-${incident.category}`;
        if (!recurringIssues[key]) {
          recurringIssues[key] = { 
            club_id: incident.club_id, 
            club_name: incident.club_name, 
            category: incident.category, 
            count: 0 
          };
        }
        recurringIssues[key].count++;
      }
    });

    const topRecurringIssues = Object.values(recurringIssues)
      .filter(issue => issue.count > 1)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      highRiskCount: highRiskIncidents.length,
      riskPercentage: incidents.length > 0 ? ((highRiskIncidents.length / incidents.length) * 100).toFixed(1) : 0,
      recurringIssues: topRecurringIssues
    };
  };

  const exportReport = () => {
    const reportData = {
      generated_at: new Date().toISOString(),
      date_range: `${dateRange} days`,
      statistics: stats,
      incidents_analyzed: stats.overview.total
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-text-primary">Incident Analytics</h2>
        <div className="flex items-center gap-2">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(parseInt(e.target.value))}
            className="bg-brand-charcoal border-brand-border rounded px-3 py-2 text-brand-text-primary"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
          <Button variant="outline" onClick={loadStatistics}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Total</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.overview.total}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Open</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.overview.open}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Critical</p>
                <p className="text-2xl font-bold text-red-400">{stats.overview.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Escalated</p>
                <p className="text-2xl font-bold text-orange-400">{stats.overview.escalated}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Resolved</p>
                <p className="text-2xl font-bold text-green-400">{stats.overview.resolved}</p>
              </div>
              <Target className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Resolution Rate</p>
                <p className="text-2xl font-bold text-purple-400">{stats.overview.resolutionRate}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Incident Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      color: '#F9FAFB' 
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="created" stroke="#3B82F6" name="Created" />
                  <Line type="monotone" dataKey="resolved" stroke="#10B981" name="Resolved" />
                  <Line type="monotone" dataKey="critical" stroke="#EF4444" name="Critical" />
                  <Line type="monotone" dataKey="escalated" stroke="#F59E0B" name="Escalated" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>By Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ name, count }) => `${name}: ${count}`}
                    >
                      {stats.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        color: '#F9FAFB' 
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Department Workload</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.departmentWorkload}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        color: '#F9FAFB' 
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="total" fill="#3B82F6" name="Total" />
                    <Bar dataKey="open" fill="#F59E0B" name="Open" />
                    <Bar dataKey="overdue" fill="#EF4444" name="Overdue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>SLA Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    {stats.slaPerformance.complianceRate}%
                  </div>
                  <p className="text-brand-text-secondary">
                    {stats.slaPerformance.totalBreaches} breaches
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Avg Resolution Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {stats.slaPerformance.avgResolutionHours}h
                  </div>
                  <p className="text-brand-text-secondary">Average hours to resolve</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Resolution Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">
                    {stats.overview.resolutionRate}%
                  </div>
                  <p className="text-brand-text-secondary">Successfully resolved</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Risk Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>High Risk Incidents</span>
                  <Badge className="bg-red-500/20 text-red-300">
                    {stats.riskAnalysis.highRiskCount}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Risk Percentage</span>
                  <Badge className="bg-orange-500/20 text-orange-300">
                    {stats.riskAnalysis.riskPercentage}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Recurring Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.riskAnalysis.recurringIssues.map((issue, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-brand-charcoal/30 rounded">
                      <div>
                        <p className="font-medium text-brand-text-primary">{issue.club_name}</p>
                        <p className="text-sm text-brand-text-secondary capitalize">
                          {issue.category?.replace('_', ' ')}
                        </p>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-300">
                        {issue.count} incidents
                      </Badge>
                    </div>
                  ))}
                  {stats.riskAnalysis.recurringIssues.length === 0 && (
                    <p className="text-brand-text-secondary text-center py-4">
                      No recurring issues detected
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}