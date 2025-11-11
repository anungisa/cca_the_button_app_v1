import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Incident } from '@/api/entities';
import { TrendingUp, AlertTriangle, Clock, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function PredictiveAnalytics() {
  const [insights, setInsights] = useState({
    volumeTrend: [],
    categoryDistribution: [],
    resolutionTimes: [],
    predictions: {}
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const incidents = await Incident.list('-created_date', 100);
        
        // Mock predictive analytics data
        const volumeTrend = [
          { month: 'Jan', incidents: 15, predicted: 18 },
          { month: 'Feb', incidents: 22, predicted: 25 },
          { month: 'Mar', incidents: 18, predicted: 20 },
          { month: 'Apr', incidents: 25, predicted: 28 },
          { month: 'May', incidents: 19, predicted: 22 },
          { month: 'Jun', incidents: 23, predicted: 26 }
        ];

        const categoryDistribution = [
          { name: 'Technical Issues', value: 35, color: '#e11d48' },
          { name: 'Club Support', value: 28, color: '#db2777' },
          { name: 'Safe Sport', value: 20, color: '#c026d3' },
          { name: 'General Inquiry', value: 17, color: '#9333ea' }
        ];

        const resolutionTimes = [
          { category: 'Technical', avgHours: 4.2, target: 6 },
          { category: 'Club Support', avgHours: 8.5, target: 12 },
          { category: 'Safe Sport', avgHours: 24.3, target: 24 },
          { category: 'General', avgHours: 2.1, target: 4 }
        ];

        setInsights({
          volumeTrend,
          categoryDistribution,
          resolutionTimes,
          predictions: {
            nextMonthVolume: 28,
            highRiskCategories: ['Safe Sport', 'Technical Issues'],
            recommendedActions: [
              'Increase Safe Sport staffing by 20%',
              'Implement automated technical issue triage',
              'Schedule additional training for club support team'
            ]
          }
        });
      } catch (error) {
        console.error('Error loading analytics:', error);
      }
    };

    loadAnalytics();
  }, []);

  const PredictionCard = ({ title, value, change, icon: Icon, color = "text-brand-text-primary" }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-text-secondary">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {change && <p className="text-xs text-brand-text-muted">{change}</p>}
          </div>
          <Icon className="w-8 h-8 text-brand-red" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PredictionCard
          title="Predicted Next Month"
          value={insights.predictions.nextMonthVolume}
          change="+12% from current"
          icon={TrendingUp}
        />
        <PredictionCard
          title="High Risk Categories"
          value={insights.predictions.highRiskCategories?.length || 0}
          change="Require attention"
          icon={AlertTriangle}
          color="text-yellow-400"
        />
        <PredictionCard
          title="Avg Resolution Time"
          value="8.2h"
          change="↓ 15% from last month"
          icon={Clock}
          color="text-green-400"
        />
        <PredictionCard
          title="SLA Compliance"
          value="87%"
          change="↑ 5% improvement"
          icon={Target}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Volume Trend & Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={insights.volumeTrend}>
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Line type="monotone" dataKey="incidents" stroke="#e11d48" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={insights.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {insights.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
          <CardTitle>Resolution Time Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.resolutionTimes}>
              <XAxis dataKey="category" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              <Bar dataKey="avgHours" fill="#e11d48" name="Average Resolution Time" />
              <Bar dataKey="target" fill="#3b82f6" name="Target Time" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.predictions.recommendedActions?.map((action, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-brand-charcoal rounded-lg">
                <div className="w-2 h-2 bg-brand-red rounded-full mt-2"></div>
                <p className="text-sm text-brand-text-primary">{action}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}