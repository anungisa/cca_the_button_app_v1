import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radio, BarChart, Tv, Newspaper } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Broadcast', value: 400 },
  { name: 'Online News', value: 300 },
  { name: 'Social Media', value: 300 },
  { name: 'Print', value: 200 },
];
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export default function MediaReachDashboard() {
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="text-brand-text-primary flex items-center gap-2">
          <Radio className="w-5 h-5 text-blue-500" />
          Media Reach by Channel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-around text-xs text-brand-text-secondary">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
              {entry.name}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}