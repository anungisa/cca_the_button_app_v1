import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, TrendingUp, Zap } from 'lucide-react';

const COLORS = ['#3b82f6', '#ec4899', '#a855f7']; // Blue, Pink, Purple

const mockGenderData = [
  { name: 'Boys', value: 10500 },
  { name: 'Girls', value: 8250 },
];

const mockInitiatives = [
  { id: 1, name: 'Girls Rock Curling Camp', region: 'ON', participants: 150 },
  { id: 2, name: 'Fast Track to Coaching (Women)', region: 'National', participants: 45 },
  { id: 3, name: 'Mixed Doubles Youth League', region: 'AB', participants: 80 },
];

export default function GenderEquityDashboard() {
  const total = mockGenderData.reduce((sum, entry) => sum + entry.value, 0);
  const girlsPercentage = ((mockGenderData.find(d => d.name === 'Girls').value / total) * 100).toFixed(1);

  return (
    <div className="space-y-6">
       <Card className="bg-brand-charcoal border-brand-border text-center p-6">
        <p className="text-4xl font-bold text-pink-400">{girlsPercentage}%</p>
        <p className="text-brand-text-secondary mt-1">Youth Participation Rate (Girls)</p>
        <p className="text-sm text-green-400 mt-2 flex items-center justify-center gap-1">
          <TrendingUp className="w-4 h-4" /> Up 3% from last season
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader><CardTitle>Participation by Gender</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={mockGenderData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} label>
                  {mockGenderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Key Initiatives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockInitiatives.map(initiative => (
              <div key={initiative.id} className="p-3 bg-brand-charcoal rounded-md">
                <p className="font-semibold text-brand-text-primary">{initiative.name}</p>
                <div className="flex justify-between text-sm text-brand-text-secondary mt-1">
                  <span>{initiative.region}</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {initiative.participants} Participants
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}