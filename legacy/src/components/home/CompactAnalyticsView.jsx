import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';
import { useXP } from '../XPContext';

export default function CompactAnalyticsView() {
  const { user } = useXP();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeClubs: 0,
    upcomingEvents: 0,
    growthRate: 0
  });

  useEffect(() => {
    // Only load stats if user is admin
    if (!user || !user.id || user.role !== 'admin') {
      return;
    }

    // Mock data - replace with actual API calls
    setStats({
      totalUsers: 1250,
      activeClubs: 78,
      upcomingEvents: 15,
      growthRate: 12.5
    });
  }, [user]);

  // Only show for admin users
  if (!user || !user.id || user.role !== 'admin') {
    return null;
  }

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
    { title: 'Active Clubs', value: stats.activeClubs, icon: BarChart3, color: 'text-green-500' },
    { title: 'Upcoming Events', value: stats.upcomingEvents, icon: Calendar, color: 'text-purple-500' },
    { title: 'Growth Rate', value: `${stats.growthRate}%`, icon: TrendingUp, color: 'text-amber-500' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand-text-primary">Platform Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-brand-text-secondary">{stat.title}</p>
                    <p className="text-2xl font-bold text-brand-text-primary mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}