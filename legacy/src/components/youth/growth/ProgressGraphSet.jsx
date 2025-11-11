import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight, Gauge, Zap } from 'lucide-react';

export default function ProgressGraphSet({ benchmarks, broomSessions }) {
  const formatBroomData = (sessions) => {
    return sessions
      .map(s => ({
        date: new Date(s.session_date).toLocaleDateString(),
        'Avg Pressure (N)': s.performance_metrics?.avg_pressure,
        'Overall Score': s.performance_metrics?.overall_score,
      }))
      .sort((a,b) => new Date(a.date) - new Date(b.date));
  };

  const formatBenchmarkData = (benchmarks) => {
    return benchmarks
      .filter(b => b.test_type === 'split_time_T_to_hog')
      .map(b => ({
        date: new Date(b.test_date).toLocaleDateString(),
        'Split Time (s)': b.result_value,
      }))
      .sort((a,b) => new Date(a.date) - new Date(b.date));
  };
  
  const broomData = formatBroomData(broomSessions);
  const splitTimeData = formatBenchmarkData(benchmarks);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge /> Smart Broom Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={broomData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis yAxisId="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                  borderColor: '#374151',
                  color: '#f9fafb'
                }} 
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="Avg Pressure (N)" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="Overall Score" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap /> Split Time (T to Hog)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={splitTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#ffc658" domain={['dataMin - 0.1', 'dataMax + 0.1']} />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                  borderColor: '#374151',
                  color: '#f9fafb'
                }} 
              />
              <Legend />
              <Line type="monotone" dataKey="Split Time (s)" stroke="#ffc658" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}