import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, CalendarDays, Zap } from 'lucide-react';
import { format, subDays } from 'date-fns';

const PerformanceTrendGraphs = ({ benchmarks, broomSessions }) => {
  const [timeRange, setTimeRange] = useState(30);

  const filterDataByTimeRange = (data, dateKey) => {
    const endDate = new Date();
    const startDate = subDays(endDate, timeRange);
    return data
      .filter(item => new Date(item[dateKey]) >= startDate)
      .sort((a,b) => new Date(a[dateKey]) - new Date(b[dateKey]));
  };

  const splitTimeData = filterDataByTimeRange(benchmarks.filter(b => b.test_type === 'split_time_T_to_hog'), 'test_date')
    .map(d => ({ date: format(new Date(d.test_date), 'MMM d'), value: d.result_value }));

  const sweepData = filterDataByTimeRange(broomSessions, 'session_date')
    .map(s => ({ date: format(new Date(s.session_date), 'MMM d'), value: s.performance_metrics?.rhythm_score || 0 }));

  const ChartWrapper = ({ title, data, dataKey, unit, color }) => (
    <div className="mb-6">
        <h4 className="text-md font-semibold text-brand-text-secondary mb-2">{title}</h4>
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" />
                <XAxis dataKey="date" stroke="var(--brand-text-secondary)" fontSize={12} />
                <YAxis stroke="var(--brand-text-secondary)" fontSize={12} unit={unit} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--brand-charcoal)', border: '1px solid var(--brand-border)' }} />
                <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-red" />
            Performance Trends
          </CardTitle>
          <div className="flex gap-1 bg-brand-charcoal p-1 rounded-lg">
            {[7, 30, 90].map(days => (
              <Button 
                key={days}
                size="sm"
                onClick={() => setTimeRange(days)}
                className={`text-xs ${timeRange === days ? 'bg-brand-red text-white' : 'bg-transparent text-brand-text-secondary hover:bg-brand-border'}`}
              >
                {days}d
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {splitTimeData.length > 0 ? (
            <ChartWrapper title="Split Time (T-to-Hog)" data={splitTimeData} dataKey="value" unit="s" color="#3b82f6" />
        ) : <p className="text-center text-sm text-brand-text-secondary py-8">No split time data logged in this period.</p>}
        {sweepData.length > 0 ? (
            <ChartWrapper title="Sweep Rhythm Score" data={sweepData} dataKey="value" unit="" color="#10b981" />
        ) : <p className="text-center text-sm text-brand-text-secondary py-8">No Smart Broom data synced in this period.</p>}
      </CardContent>
    </Card>
  );
};

export default PerformanceTrendGraphs;