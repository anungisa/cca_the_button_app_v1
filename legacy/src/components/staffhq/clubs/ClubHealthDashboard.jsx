import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Club } from '@/api/entities';
import { SurveySubmission } from '@/api/entities';
import { Building, CheckCircle, AlertTriangle, Users, BarChart3, TrendingUp, Loader2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function ClubHealthDashboard() {
  const [stats, setStats] = useState({
    totalClubs: 0,
    activeClubs: 0,
    atRiskClubs: 0,
    totalMembers: 0,
    surveyCompletionRate: 0,
    membershipGrowth: [],
    engagementDistribution: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [clubs, surveys] = await Promise.all([Club.list(), SurveySubmission.list()]);
        
        const activeClubs = clubs.filter(c => c.status === 'active' || c.status === 'featured').length;
        const atRiskClubs = clubs.filter(c => c.status === 'at_risk').length;
        const totalMembers = clubs.reduce((sum, c) => sum + (c.membership_count || 0), 0);
        const surveyCompletionRate = clubs.length > 0 ? (surveys.filter(s => s.is_complete).length / clubs.length) * 100 : 0;
        
        // Mock data for charts
        const membershipGrowth = [
            { year: 2020, members: 110000 },
            { year: 2021, members: 115000 },
            { year: 2022, members: 121000 },
            { year: 2023, members: 128000 },
            { year: 2024, members: 135000 }
        ];

        const engagementDistribution = [
          { name: 'Low', count: 15 },
          { name: 'Medium', count: 45 },
          { name: 'High', count: 30 },
          { name: 'Top Tier', count: 10 }
        ];
        
        setStats({
          totalClubs: clubs.length,
          activeClubs,
          atRiskClubs,
          totalMembers,
          surveyCompletionRate: Math.round(surveyCompletionRate),
          membershipGrowth,
          engagementDistribution
        });
      } catch (error) {
        console.error("Failed to load club health data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, suffix = '' }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-brand-text-secondary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}{suffix}</div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Clubs" value={stats.totalClubs} icon={Building} />
        <StatCard title="Active Clubs" value={stats.activeClubs} icon={CheckCircle} />
        <StatCard title="At-Risk Clubs" value={stats.atRiskClubs} icon={AlertTriangle} />
        <StatCard title="Total Members" value={stats.totalMembers} icon={Users} />
        <StatCard title="Survey Completion" value={stats.surveyCompletionRate} icon={BarChart3} suffix="%" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Membership Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.membershipGrowth}>
                <XAxis dataKey="year" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/>
                <Line type="monotone" dataKey="members" stroke="#e11d48" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Club Engagement Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.engagementDistribution}>
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/>
                <Bar dataKey="count" fill="#e11d48" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}