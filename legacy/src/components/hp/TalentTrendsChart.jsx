import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function TalentTrendsChart({ logs }) {
  const chartData = useMemo(() => {
    // Safety check: if logs are not an array, return empty array to prevent crash
    if (!Array.isArray(logs)) {
      return [];
    }

    const data = logs.reduce((acc, log) => {
      const date = new Date(log.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!acc[date]) {
        acc[date] = { date, on_ice_training: 0, off_ice_training: 0, competition: 0, mental_training: 0, recovery: 0 };
      }
      if (log.activity_type && acc[date][log.activity_type] !== undefined) {
        acc[date][log.activity_type] += log.duration_hours;
      }
      return acc;
    }, {});

    return Object.values(data).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [logs]);
  
  if (!logs || logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] bg-brand-charcoal/50 rounded-lg">
        <p className="text-brand-text-secondary">Not enough data to display training trends.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} />
        <YAxis stroke="#888888" fontSize={12} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
          labelStyle={{ color: '#f9fafb' }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar dataKey="on_ice_training" stackId="a" fill="#e11d48" name="On-Ice" />
        <Bar dataKey="off_ice_training" stackId="a" fill="#3b82f6" name="Off-Ice" />
        <Bar dataKey="competition" stackId="a" fill="#fbbf24" name="Competition" />
        <Bar dataKey="mental_training" stackId="a" fill="#8b5cf6" name="Mental" />
        <Bar dataKey="recovery" stackId="a" fill="#10b981" name="Recovery" />
      </BarChart>
    </ResponsiveContainer>
  );
}