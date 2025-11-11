import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FlaskConical, Database, Lightbulb, UserCheck, Microscope } from 'lucide-react';

const StrategicDataOverview = () => {
  const kpiData = [
    { name: 'AI Models Active', value: 4, icon: FlaskConical, color: 'text-purple-400' },
    { name: 'Data Sets Monitored', value: 18, icon: Database, color: 'text-blue-400' },
    { name: 'Innovation Ideas', value: 23, icon: Lightbulb, color: 'text-yellow-400' },
    { name: 'Research Partners', value: 6, icon: Microscope, color: 'text-green-400' },
  ];

  const modelPerformanceData = [
    { name: 'Win Prob', accuracy: 0.88 },
    { name: 'Fan Churn', accuracy: 0.92 },
    { name: 'Retention Score', accuracy: 0.85 },
    { name: 'Patch Forecast', accuracy: 0.78 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-brand-text-primary">Strategic Data Overview</h3>
        <p className="text-brand-text-secondary">High-level view of the research, data, and AI landscape</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4 text-center">
              <kpi.icon className={`w-8 h-8 ${kpi.color} mx-auto mb-2`} />
              <p className="text-3xl font-bold text-brand-text-primary">{kpi.value}</p>
              <p className="text-sm text-brand-text-secondary">{kpi.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>AI Model Accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={modelPerformanceData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 1]} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              <Bar dataKey="accuracy" fill="#8884d8" name="Accuracy" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategicDataOverview;