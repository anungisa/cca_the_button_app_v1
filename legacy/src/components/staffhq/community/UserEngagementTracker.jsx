import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityFeed } from '@/api/entities';
import { KudosTransaction } from '@/api/entities';
import { Users, TrendingUp, Award, MessageCircle } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function UserEngagementTracker() {
  const [engagementStats, setEngagementStats] = useState({
    activeUsers: 0,
    totalActivities: 0,
    kudosGiven: 0,
    weeklyGrowth: 0
  });

  useEffect(() => {
    const loadEngagementData = async () => {
      try {
        const [activities, kudos] = await Promise.all([
          ActivityFeed.list('-created_date', 100),
          KudosTransaction.list('-created_date', 100)
        ]);
        
        setEngagementStats({
          activeUsers: new Set(activities.map(a => a.user_id)).size,
          totalActivities: activities.length,
          kudosGiven: kudos.length,
          weeklyGrowth: 15 // Mock percentage
        });
      } catch (error) {
        console.error('Error loading engagement data:', error);
      }
    };
    loadEngagementData();
  }, []);

  const weeklyEngagementData = [
    { name: 'Mon', activities: 45 },
    { name: 'Tue', activities: 52 },
    { name: 'Wed', activities: 38 },
    { name: 'Thu', activities: 67 },
    { name: 'Fri', activities: 71 },
    { name: 'Sat', activities: 34 },
    { name: 'Sun', activities: 28 }
  ];

  const StatCard = ({ title, value, icon: Icon, change }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-brand-text-primary">{value.toLocaleString()}</p>
            {change && <p className="text-xs text-green-400">+{change}% from last week</p>}
          </div>
          <Icon className="w-8 h-8 text-brand-red" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Users" value={engagementStats.activeUsers} icon={Users} change={engagementStats.weeklyGrowth} />
        <StatCard title="Total Activities" value={engagementStats.totalActivities} icon={TrendingUp} />
        <StatCard title="Kudos Given" value={engagementStats.kudosGiven} icon={Award} />
        <StatCard title="Community Posts" value={42} icon={MessageCircle} />
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Weekly Activity Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyEngagementData}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              <Bar dataKey="activities" fill="#e11d48" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}