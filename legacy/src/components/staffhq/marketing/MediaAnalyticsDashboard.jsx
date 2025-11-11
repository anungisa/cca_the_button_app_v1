import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Megaphone, Rss } from 'lucide-react';

const data = [
  { name: 'Jan', Reach: 4000, Engagement: 2400 },
  { name: 'Feb', Reach: 3000, Engagement: 1398 },
  { name: 'Mar', Reach: 2000, Engagement: 9800 },
  { name: 'Apr', Reach: 2780, Engagement: 3908 },
  { name: 'May', Reach: 1890, Engagement: 4800 },
  { name: 'Jun', Reach: 2390, Engagement: 3800 },
];

export default function MediaAnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-brand-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-xs text-brand-text-secondary">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Mentions</CardTitle>
            <Megaphone className="h-4 w-4 text-brand-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+235</div>
            <p className="text-xs text-brand-text-secondary">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
            <Rss className="h-4 w-4 text-brand-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-brand-text-secondary">+2% from last month</p>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Reach vs. Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888"/>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/>
              <Legend />
              <Bar dataKey="Engagement" fill="#e11d48" />
              <Bar dataKey="Reach" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}