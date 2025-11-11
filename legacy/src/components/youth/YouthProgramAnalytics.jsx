import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Users, TrendingUp, UserPlus, Activity } from 'lucide-react';

const COLORS = ['#ED1C24', '#ffc72c', '#3b82f6', '#8b5cf6'];

const mockStats = {
  totalYouth: 18750,
  retentionRate: 68,
  newThisSeason: 4320,
  programsActive: 215,
};

const mockAgeData = [
  { name: '6-8', value: 4500 },
  { name: '9-11', value: 7200 },
  { name: '12-14', value: 5100 },
  { name: '15-18', value: 1950 },
];

const mockGrowthData = [
  { year: '2021', participants: 15200 },
  { year: '2022', participants: 16800 },
  { year: '2023', participants: 17900 },
  { year: '2024', participants: 18750 },
];

const StatsCard = ({ title, value, icon: Icon, color }) => (
  <Card className="bg-brand-charcoal border-brand-border">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-brand-text-secondary">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </CardContent>
  </Card>
);

export default function YouthProgramAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatsCard title="Total Youth Participants" value={mockStats.totalYouth.toLocaleString()} icon={Users} color="text-blue-400" />
        <StatsCard title="Retention Rate" value={`${mockStats.retentionRate}%`} icon={TrendingUp} color="text-green-400" />
        <StatsCard title="New This Season" value={mockStats.newThisSeason.toLocaleString()} icon={UserPlus} color="text-purple-400" />
        <StatsCard title="Active Programs" value={mockStats.programsActive} icon={Activity} color="text-amber-400" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader><CardTitle>Participants by Age Group</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={mockAgeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {mockAgeData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader><CardTitle>Participation Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockGrowthData}>
                <XAxis dataKey="year" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip cursor={{fill: 'rgba(237, 28, 36, 0.1)'}} contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Bar dataKey="participants" fill="#ED1C24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}