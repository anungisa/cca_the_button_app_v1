import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smile, Frown, Meh, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', positive: 40, negative: 24, neutral: 20 },
  { name: 'Feb', positive: 30, negative: 13, neutral: 22 },
  { name: 'Mar', positive: 50, negative: 38, neutral: 29 },
  { name: 'Apr', positive: 27, negative: 18, neutral: 30 },
  { name: 'May', positive: 48, negative: 20, neutral: 25 },
  { name: 'Jun', positive: 60, negative: 15, neutral: 25 },
];

export default function SentimentAnalysisDashboard() {
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="text-brand-text-primary flex items-center gap-2">
          <Smile className="w-5 h-5 text-green-500" />
          Sentiment Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div><p className="text-2xl font-bold text-green-500">72%</p><p className="text-xs text-brand-text-secondary">Positive</p></div>
          <div><p className="text-2xl font-bold text-amber-500">18%</p><p className="text-xs text-brand-text-secondary">Neutral</p></div>
          <div><p className="text-2xl font-bold text-red-500">10%</p><p className="text-xs text-brand-text-secondary">Negative</p></div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/>
            <Bar dataKey="positive" stackId="a" fill="#22c55e" name="Positive" />
            <Bar dataKey="neutral" stackId="a" fill="#f59e0b" name="Neutral" />
            <Bar dataKey="negative" stackId="a" fill="#ef4444" name="Negative" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}