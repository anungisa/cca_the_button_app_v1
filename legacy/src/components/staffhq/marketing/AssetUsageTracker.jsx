import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Share2, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Logos', downloads: 4000, views: 2400 },
  { name: 'Photos', downloads: 3000, views: 1398 },
  { name: 'Videos', downloads: 2000, views: 9800 },
  { name: 'Templates', downloads: 2780, views: 3908 },
  { name: 'Guides', downloads: 1890, views: 4800 },
];

export default function AssetUsageTracker() {
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="text-brand-text-primary flex items-center gap-2">
          <Download className="w-5 h-5 text-purple-500" />
          Brand Asset Usage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/>
            <Legend />
            <Bar dataKey="downloads" fill="#8884d8" name="Downloads" />
            <Bar dataKey="views" fill="#82ca9d" name="Views" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}