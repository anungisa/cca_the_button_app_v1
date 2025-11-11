import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function CommunityAnalytics() {
  const monthlyGrowthData = [
    { month: 'Jan', users: 120, posts: 45, engagement: 78 },
    { month: 'Feb', users: 135, posts: 52, engagement: 82 },
    { month: 'Mar', users: 148, posts: 61, engagement: 85 },
    { month: 'Apr', users: 162, posts: 58, engagement: 79 },
    { month: 'May', users: 175, posts: 67, engagement: 88 },
    { month: 'Jun', users: 189, posts: 74, engagement: 92 }
  ];

  const postTypeData = [
    { name: 'Achievement', value: 35 },
    { name: 'Question', value: 28 },
    { name: 'Tip', value: 20 },
    { name: 'General', value: 17 }
  ];

  const COLORS = ['#e11d48', '#db2777', '#c026d3', '#9333ea'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Community Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyGrowthData}>
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Line type="monotone" dataKey="users" stroke="#e11d48" strokeWidth={2} name="Active Users" />
                <Line type="monotone" dataKey="engagement" stroke="#3b82f6" strokeWidth={2} name="Engagement Score" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Post Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={postTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {postTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Monthly Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyGrowthData}>
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              <Bar dataKey="posts" fill="#e11d48" name="Community Posts" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}