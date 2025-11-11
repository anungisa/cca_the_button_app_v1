import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KnowledgeArticle } from '@/api/entities';
import { KnowledgeProgress } from '@/api/entities';
import { Eye, BookOpen, Users, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function KnowledgeAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalArticles: 0,
    totalViews: 0,
    activeUsers: 0,
    completionRate: 0,
    topArticles: [],
    categoryUsage: [],
    monthlyUsage: []
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [articles, progress] = await Promise.all([
          KnowledgeArticle.list(),
          KnowledgeProgress.list()
        ]);

        const totalViews = articles.reduce((sum, article) => sum + (article.view_count || 0), 0);
        const activeUsers = new Set(progress.map(p => p.user_id)).size;
        const completedCount = progress.filter(p => p.status === 'completed').length;
        const completionRate = progress.length > 0 ? (completedCount / progress.length) * 100 : 0;

        // Mock data for charts
        const topArticles = articles
          .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
          .slice(0, 5)
          .map(article => ({ name: article.title.substring(0, 30) + '...', views: article.view_count || 0 }));

        const categoryUsage = [
          { name: 'Event Operations', value: 35, color: '#e11d48' },
          { name: 'HR Policies', value: 28, color: '#db2777' },
          { name: 'Safe Sport', value: 20, color: '#c026d3' },
          { name: 'Technical', value: 17, color: '#9333ea' }
        ];

        const monthlyUsage = [
          { month: 'Jan', views: 450, completions: 23 },
          { month: 'Feb', views: 520, completions: 28 },
          { month: 'Mar', views: 380, completions: 31 },
          { month: 'Apr', views: 670, completions: 25 },
          { month: 'May', views: 710, completions: 35 },
          { month: 'Jun', views: 540, completions: 29 }
        ];

        setAnalytics({
          totalArticles: articles.length,
          totalViews,
          activeUsers,
          completionRate: Math.round(completionRate),
          topArticles,
          categoryUsage,
          monthlyUsage
        });
      } catch (error) {
        console.error('Error loading analytics:', error);
      }
    };

    loadAnalytics();
  }, []);

  const StatCard = ({ title, value, icon: Icon, suffix = "" }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-brand-text-primary">{value}{suffix}</p>
          </div>
          <Icon className="w-8 h-8 text-brand-red" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Articles" value={analytics.totalArticles} icon={BookOpen} />
        <StatCard title="Total Views" value={analytics.totalViews.toLocaleString()} icon={Eye} />
        <StatCard title="Active Readers" value={analytics.activeUsers} icon={Users} />
        <StatCard title="Completion Rate" value={analytics.completionRate} icon={TrendingUp} suffix="%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Top Viewed Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topArticles} layout="horizontal">
                <XAxis type="number" stroke="#888" />
                <YAxis type="category" dataKey="name" stroke="#888" width={120} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Bar dataKey="views" fill="#e11d48" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Content by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.categoryUsage}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.categoryUsage.map((entry, index) => (
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
          <CardTitle>Monthly Usage Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.monthlyUsage}>
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              <Line type="monotone" dataKey="views" stroke="#e11d48" strokeWidth={2} name="Views" />
              <Line type="monotone" dataKey="completions" stroke="#3b82f6" strokeWidth={2} name="Completions" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}