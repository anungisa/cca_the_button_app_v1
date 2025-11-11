import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ExecutiveDashboard({ incidents }) {
  const criticalCount = incidents.filter(i => i.priority === 'critical').length;
  const resolutionRate = (incidents.filter(i => ['resolved', 'closed'].includes(i.status)).length / incidents.length * 100).toFixed(0);

  const stats = [
    { title: 'Open Critical Incidents', value: criticalCount, icon: AlertTriangle, color: 'text-red-500' },
    { title: 'Overall Resolution Rate', value: `${resolutionRate}%`, icon: CheckCircle, color: 'text-green-500' },
    { title: 'Average Resolution Time', value: '2.3 days', icon: TrendingUp, color: 'text-yellow-500' },
    { title: 'Safe Sport Cases', value: incidents.filter(i => i.category === 'safe_sport').length, icon: Shield, color: 'text-blue-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map(stat => (
        <Card key={stat.title} className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-text-secondary">{stat.title}</CardTitle>
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-text-primary">{stat.value}</div>
            <p className="text-xs text-brand-text-secondary">vs. last period</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}