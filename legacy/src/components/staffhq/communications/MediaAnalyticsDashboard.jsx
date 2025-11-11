import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Newspaper, Share2, Smile, Frown } from 'lucide-react';

const sampleReachData = [
  { name: 'Jan', Pickups: 40, Shares: 240 },
  { name: 'Feb', Pickups: 30, Shares: 139 },
  { name: 'Mar', Pickups: 20, Shares: 980 },
  { name: 'Apr', Pickups: 27, Shares: 390 },
  { name: 'May', Pickups: 18, Shares: 480 },
  { name: 'Jun', Pickups: 23, Shares: 380 },
];

const sampleSentimentData = [
    { name: 'Positive', value: 75, fill: '#16a34a' },
    { name: 'Neutral', value: 15, fill: '#64748b' },
    { name: 'Negative', value: 10, fill: '#dc2626' },
];

export default function MediaAnalyticsDashboard() {
  const stats = [
    { title: 'Media Pickups', value: '132', change: '+12%', icon: Newspaper, color: 'text-blue-400' },
    { title: 'Social Shares', value: '1.2k', change: '+8%', icon: Share2, color: 'text-green-400' },
    { title: 'Positive Sentiment', value: '75%', change: '+3%', icon: Smile, color: 'text-green-400' },
    { title: 'Negative Sentiment', value: '10%', change: '-2%', icon: Frown, color: 'text-red-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-brand-card-bg border-brand-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brand-text-secondary">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-text-primary">{stat.value}</div>
              <p className="text-xs text-green-500">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Media Reach Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sampleReachData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Pickups" fill="#3b82f6" />
                <Bar dataKey="Shares" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sampleSentimentData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="value" name="Sentiment %" />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}