/**
 * Performance Metrics Tab - Universal for Athletes and Coaches
 */

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function PerformanceMetrics({ data }) {
  // Memoize the data extraction to prevent re-renders
  const { logs, benchmarks } = useMemo(() => ({
    logs: data?.logs || [],
    benchmarks: data?.benchmarks || []
  }), [data]);

  const performanceStats = useMemo(() => {
    if (logs.length === 0) return null;

    const last30Days = logs.slice(0, 30);
    const totalHours = last30Days.reduce((sum, log) => sum + (log.duration_hours || 0), 0);
    const avgHoursPerSession = totalHours / last30Days.length;

    return {
      totalSessions: last30Days.length,
      totalHours: totalHours.toFixed(1),
      avgHoursPerSession: avgHoursPerSession.toFixed(1),
      verifiedSessions: last30Days.filter(l => l.coach_verified).length
    };
  }, [logs]);

  const latestBenchmarks = useMemo(() => {
    if (benchmarks.length === 0) return [];

    const benchmarksByType = {};
    benchmarks.forEach(b => {
      if (!benchmarksByType[b.test_type]) {
        benchmarksByType[b.test_type] = [];
      }
      benchmarksByType[b.test_type].push(b);
    });

    return Object.entries(benchmarksByType).map(([type, tests]) => {
      const sorted = tests.sort((a, b) => 
        new Date(b.test_date) - new Date(a.test_date)
      );
      
      const latest = sorted[0];
      const previous = sorted[1];
      
      let trend = 'neutral';
      if (previous) {
        trend = latest.result_value > previous.result_value ? 'up' : 
                latest.result_value < previous.result_value ? 'down' : 'neutral';
      }

      return {
        type: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: latest.result_value,
        unit: getTestUnit(type),
        date: latest.test_date,
        isPB: latest.is_personal_best,
        trend
      };
    });
  }, [benchmarks]);

  const getTestUnit = (testType) => {
    if (testType.includes('time')) return 's';
    if (testType.includes('hr') || testType.includes('bpm')) return 'bpm';
    if (testType.includes('accuracy')) return '%';
    return '';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Training Summary */}
      {performanceStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4">
              <p className="text-sm text-brand-text-secondary">Sessions (30d)</p>
              <p className="text-3xl font-bold text-brand-text-primary">{performanceStats.totalSessions}</p>
            </CardContent>
          </Card>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4">
              <p className="text-sm text-brand-text-secondary">Total Hours</p>
              <p className="text-3xl font-bold text-brand-text-primary">{performanceStats.totalHours}h</p>
            </CardContent>
          </Card>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4">
              <p className="text-sm text-brand-text-secondary">Avg per Session</p>
              <p className="text-3xl font-bold text-brand-text-primary">{performanceStats.avgHoursPerSession}h</p>
            </CardContent>
          </Card>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4">
              <p className="text-sm text-brand-text-secondary">Verified</p>
              <p className="text-3xl font-bold text-brand-text-primary">{performanceStats.verifiedSessions}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Benchmarks */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-brand-text-primary">Performance Benchmarks</CardTitle>
        </CardHeader>
        <CardContent>
          {latestBenchmarks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestBenchmarks.map((benchmark, idx) => (
                <div key={idx} className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-brand-text-primary">{benchmark.type}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold text-brand-text-primary">
                          {benchmark.value}
                        </span>
                        <span className="text-sm text-brand-text-secondary">
                          {benchmark.unit}
                        </span>
                      </div>
                      <p className="text-xs text-brand-text-secondary mt-1">
                        {new Date(benchmark.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getTrendIcon(benchmark.trend)}
                      {benchmark.isPB && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                          PB
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-brand-text-secondary">
              No benchmark data yet. Complete performance tests to see your progress.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}