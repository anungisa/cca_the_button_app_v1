import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle2, AlertTriangle, Clock, TrendingUp, Users, FileText } from 'lucide-react';
import { Task, ComplianceItem, Incident } from '@/api/entities';
import { User } from '@/api/entities';

export default function StaffHQDashboard() {
  const [stats, setStats] = useState({
    myTasks: 0,
    pendingApprovals: 0,
    openIncidents: 0,
    upcomingDeadlines: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      
      // Load my tasks
      const tasks = await Task.filter({ assigned_to: user.id, status: ['todo', 'in_progress'] });
      
      // Load pending approvals (simplified - would need proper approval entity)
      const incidents = await Incident.filter({ assigned_to_id: user.id, status: ['new', 'open'] });
      
      // Load compliance items due soon
      const compliance = await ComplianceItem.filter({ 
        assigned_to: user.id, 
        status: ['not_started', 'in_progress'] 
      });

      setStats({
        myTasks: tasks?.length || 0,
        pendingApprovals: 0, // Placeholder
        openIncidents: incidents?.length || 0,
        upcomingDeadlines: compliance?.length || 0
      });

      setRecentActivity([
        { type: 'task', message: 'Task assigned to you', time: '2 hours ago' },
        { type: 'approval', message: 'Approval request received', time: '4 hours ago' },
        { type: 'incident', message: 'New incident reported', time: '1 day ago' }
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto"></div>
        <p className="text-brand-text-secondary mt-2">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-brand-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myTasks}</div>
            <p className="text-xs text-brand-text-secondary">Active assignments</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-brand-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-brand-text-secondary">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-brand-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openIncidents}</div>
            <p className="text-xs text-brand-text-secondary">Require attention</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingDeadlines}</div>
            <p className="text-xs text-brand-text-secondary">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-brand-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'task' ? 'bg-blue-500' :
                    activity.type === 'approval' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <span className="text-sm text-brand-text-primary">{activity.message}</span>
                </div>
                <span className="text-xs text-brand-text-secondary">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}