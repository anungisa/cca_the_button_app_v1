/**
 * Athlete Dashboard Overview Tab
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingUp, Target, Activity } from 'lucide-react';
import { useXP } from '../../XPContext';

export default function AthleteOverview({ data, onRefresh }) {
  const { loyaltyData } = useXP();
  const logs = data?.logs || [];
  const benchmarks = data?.benchmarks || [];
  const achievements = data?.achievements || [];

  const stats = [
    {
      title: 'Training Sessions',
      value: logs.length,
      icon: Activity,
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Personal Bests',
      value: benchmarks.filter(b => b.is_personal_best).length,
      icon: Trophy,
      change: '+2',
      trend: 'up'
    },
    {
      title: 'Career XP',
      value: loyaltyData?.total_earned_points || 0,
      icon: TrendingUp,
      change: '+150',
      trend: 'up'
    },
    {
      title: 'Active Goals',
      value: 3,
      icon: Target,
      change: '1 completed',
      trend: 'neutral'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-text-secondary">{stat.title}</p>
                  <p className="text-2xl font-bold text-brand-text-primary mt-1">
                    {stat.value}
                  </p>
                  <p className={`text-xs mt-1 ${
                    stat.trend === 'up' ? 'text-green-500' :
                    stat.trend === 'down' ? 'text-red-500' :
                    'text-brand-text-secondary'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <stat.icon className="w-8 h-8 text-brand-red" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-brand-text-primary">Recent Training</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <div className="space-y-3">
              {logs.slice(0, 5).map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded border border-brand-border">
                  <div>
                    <p className="font-medium text-brand-text-primary">
                      {log.activity_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-sm text-brand-text-secondary">
                      {new Date(log.date).toLocaleDateString()} • {log.duration_hours}h
                    </p>
                  </div>
                  {log.coach_verified && (
                    <span className="text-xs text-green-500">✓ Verified</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-brand-text-secondary">
              No recent training sessions. Start logging your practice!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="text-brand-text-primary">Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.slice(0, 4).map((achievement, idx) => (
                <div key={idx} className="p-3 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-lg border border-yellow-500/20">
                  <p className="font-medium text-brand-text-primary">{achievement.event_name}</p>
                  <p className="text-sm text-brand-text-secondary">
                    {achievement.medal?.toUpperCase()} • {achievement.year}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}