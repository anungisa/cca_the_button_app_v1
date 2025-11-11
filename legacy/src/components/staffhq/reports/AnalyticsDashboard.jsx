import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/api/entities';
import { Incident } from '@/api/entities';
import { MarketingCampaign } from '@/api/entities';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, ShieldAlert, Megaphone } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [dashboardData, setDashboardData] = useState({
    taskMetrics: [],
    incidentTrends: [],
    campaignPerformance: [],
    departmentActivity: []
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [tasks, incidents, campaigns] = await Promise.all([
          Task.list('-created_date', 50),
          Incident.list('-created_date', 50),
          MarketingCampaign.list('-target_date', 20)
        ]);

        // Process task metrics by status
        const tasksByStatus = tasks.reduce((acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        }, {});

        const taskMetrics = Object.entries(tasksByStatus).map(([status, count]) => ({
          name: status.replace('_', ' ').toUpperCase(),
          value: count
        }));

        // Mock incident trends
        const incidentTrends = [
          { month: 'Jan', incidents: 15, resolved: 12 },
          { month: 'Feb', incidents: 22, resolved: 20 },
          { month: 'Mar', incidents: 18, resolved: 16 },
          { month: 'Apr', incidents: 25, resolved: 23 },
          { month: 'May', incidents: 19, resolved: 18 },
          { month: 'Jun', incidents: 23, resolved: 21 }
        ];

        // Process campaign performance
        const campaignsByStatus = campaigns.reduce((acc, campaign) => {
          acc[campaign.status] = (acc[campaign.status] || 0) + 1;
          return acc;
        }, {});

        const campaignPerformance = Object.entries(campaignsByStatus).map(([status, count]) => ({
          status,
          count
        }));

        // Mock department activity
        const departmentActivity = [
          { name: 'Events', tasks: 25, incidents: 8 },
          { name: 'Marketing', tasks: 18, incidents: 3 },
          { name: 'HR', tasks: 12, incidents: 5 },
          { name: 'Safe Sport', tasks: 15, incidents: 12 },
          { name: 'Finance', tasks: 8, incidents: 2 }
        ];

        setDashboardData({
          taskMetrics,
          incidentTrends,
          campaignPerformance,
          departmentActivity
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, []);

  const COLORS = ['#e11d48', '#db2777', '#c026d3', '#9333ea', '#7c3aed'];

  const MetricCard = ({ title, value, icon: Icon, change }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-brand-text-primary">{value}</p>
            {change && <p className="text-xs text-green-400">{change}</p>}
          </div>
          <Icon className="w-8 h-8 text-brand-red" />
        </div>
      </CardContent>
    </Card>
  );

  const totalTasks = dashboardData.taskMetrics.reduce((sum, item) => sum + item.value, 0);
  const totalIncidents = dashboardData.incidentTrends.reduce((sum, item) => sum + item.incidents, 0);
  const activeCampaigns = dashboardData.campaignPerformance.filter(c => c.status === 'active').reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Tasks" value={totalTasks} icon={TrendingUp} change="+12% this month" />
        <MetricCard title="Active Incidents" value={totalIncidents} icon={ShieldAlert} change="-5% this week" />
        <MetricCard title="Active Campaigns" value={activeCampaigns} icon={Megaphone} change="+3 this month" />
        <MetricCard title="Team Members" value="24" icon={Users} change="+2 this quarter" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.taskMetrics}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dashboardData.taskMetrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Incident Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.incidentTrends}>
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Line type="monotone" dataKey="incidents" stroke="#e11d48" strokeWidth={2} name="Incidents" />
                <Line type="monotone" dataKey="resolved" stroke="#3b82f6" strokeWidth={2} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Department Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.departmentActivity}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              <Bar dataKey="tasks" fill="#e11d48" name="Tasks" />
              <Bar dataKey="incidents" fill="#3b82f6" name="Incidents" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}