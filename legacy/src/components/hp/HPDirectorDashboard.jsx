import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TalentTrendsChart from './TalentTrendsChart';
import EmergingAthletesList from './EmergingAthletesList';
import RecentGamesSummary from './RecentGamesSummary';
import { Award, Users, TrendingUp, ClipboardCheck } from 'lucide-react';

const HPDirectorDashboard = () => {
  // Mock data for KPIs
  const kpiData = {
    nationalTeam: 24,
    nationalPool: 60,
    provincialTeam: 150,
    overallAccuracy: 82.5,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">National Team</CardTitle>
            <Award className="w-4 h-4 text-brand-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.nationalTeam}</div>
            <p className="text-xs text-brand-text-secondary">Athletes</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">National Pool</CardTitle>
            <Users className="w-4 h-4 text-brand-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.nationalPool}</div>
            <p className="text-xs text-brand-text-secondary">Athletes</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Provincial Teams</CardTitle>
            <TrendingUp className="w-4 h-4 text-brand-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.provincialTeam}</div>
            <p className="text-xs text-brand-text-secondary">Tracked Athletes</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overall Accuracy</CardTitle>
            <ClipboardCheck className="w-4 h-4 text-brand-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.overallAccuracy}%</div>
            <p className="text-xs text-brand-text-secondary">Last 30 days</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TalentTrendsChart />
        </div>
        <div className="space-y-6">
          <EmergingAthletesList />
          <RecentGamesSummary />
        </div>
      </div>
    </div>
  );
};

export default HPDirectorDashboard;