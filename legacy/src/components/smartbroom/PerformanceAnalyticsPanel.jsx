import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Zap,
  Clock,
  Award,
  LineChart
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PerformanceAnalyticsPanel({ sessions, user, accessLevel }) {
  const [timeframe, setTimeframe] = useState('last_30_days');
  const [metric, setMetric] = useState('pressure');

  const safeSessions = sessions || [];

  // Calculate analytics from sessions
  const analytics = safeSessions.reduce((acc, session) => {
    if (session.performance_metrics) {
      acc.avgPressure += session.performance_metrics.avg_pressure || 0;
      acc.maxPressure = Math.max(acc.maxPressure, session.performance_metrics.max_pressure || 0);
      acc.totalSweeps += session.total_sweeps || 0;
      acc.totalTime += session.session_duration_minutes || 0;
      acc.consistencySum += session.performance_metrics.rhythm_score || 0;
      acc.sessionCount++;
    }
    return acc;
  }, {
    avgPressure: 0,
    maxPressure: 0,
    totalSweeps: 0,
    totalTime: 0,
    consistencySum: 0,
    sessionCount: 0
  });

  const avgPressure = analytics.sessionCount > 0 ? analytics.avgPressure / analytics.sessionCount : 0;
  const avgConsistency = analytics.sessionCount > 0 ? analytics.consistencySum / analytics.sessionCount : 0;
  const sweepsPerMinute = analytics.totalTime > 0 ? analytics.totalSweeps / analytics.totalTime : 0;

  // Mock trend data for visualization
  const trendData = [
    { date: '2024-01-01', value: 85 },
    { date: '2024-01-08', value: 87 },
    { date: '2024-01-15', value: 89 },
    { date: '2024-01-22', value: 92 },
    { date: '2024-01-29', value: 91 },
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Time Period
              </label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="bg-brand-charcoal border-brand-border text-brand-text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                  <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                  <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                  <SelectItem value="all_time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Primary Metric
              </label>
              <Select value={metric} onValueChange={setMetric}>
                <SelectTrigger className="bg-brand-charcoal border-brand-border text-brand-text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pressure">Pressure</SelectItem>
                  <SelectItem value="consistency">Consistency</SelectItem>
                  <SelectItem value="speed">Sweep Speed</SelectItem>
                  <SelectItem value="overall">Overall Score</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-text-secondary text-sm">Avg Pressure</p>
                  <p className="text-2xl font-bold text-brand-text-primary">
                    {avgPressure.toFixed(1)}N
                  </p>
                  <p className="text-green-400 text-sm">+2.3% vs last period</p>
                </div>
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-text-secondary text-sm">Consistency</p>
                  <p className="text-2xl font-bold text-brand-text-primary">
                    {avgConsistency.toFixed(1)}%
                  </p>
                  <p className="text-green-400 text-sm">+5.1% vs last period</p>
                </div>
                <Target className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-text-secondary text-sm">Max Pressure</p>
                  <p className="text-2xl font-bold text-brand-text-primary">
                    {analytics.maxPressure.toFixed(1)}N
                  </p>
                  <p className="text-blue-400 text-sm">Personal best</p>
                </div>
                <Award className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-text-secondary text-sm">Sweep Rate</p>
                  <p className="text-2xl font-bold text-brand-text-primary">
                    {sweepsPerMinute.toFixed(1)}/min
                  </p>
                  <p className="text-purple-400 text-sm">Optimal range</p>
                </div>
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Performance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-brand-charcoal rounded-lg flex items-center justify-center">
              <div className="text-center">
                <LineChart className="w-12 h-12 text-brand-text-secondary mx-auto mb-2" />
                <p className="text-brand-text-secondary">Performance chart visualization</p>
                <p className="text-sm text-brand-text-secondary">
                  Trend: {metric} over {timeframe}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Session Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-brand-charcoal rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-brand-text-secondary mx-auto mb-2" />
                <p className="text-brand-text-secondary">Session type distribution</p>
                <div className="text-sm text-brand-text-secondary mt-4">
                  <div className="flex justify-between items-center">
                    <span>Training:</span>
                    <span>{safeSessions.filter(s => s.session_type === 'training').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Competition:</span>
                    <span>{safeSessions.filter(s => s.session_type === 'competition').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Test:</span>
                    <span>{safeSessions.filter(s => s.session_type === 'test').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights & Recommendations */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <h4 className="font-semibold text-green-300 mb-2">Strength</h4>
              <p className="text-sm text-green-400">
                Your consistency has improved by 15% over the last month. Keep up the steady practice!
              </p>
            </div>
            <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
              <h4 className="font-semibold text-amber-300 mb-2">Opportunity</h4>
              <p className="text-sm text-amber-400">
                Focus on maintaining higher average pressure. Try shorter, more intense sweep bursts.
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <h4 className="font-semibold text-blue-300 mb-2">Recommendation</h4>
            <p className="text-sm text-blue-400">
              Based on your progress, consider increasing training frequency to 4-5 sessions per week 
              to maintain your improvement trajectory.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}