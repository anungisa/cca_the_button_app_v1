
import React, { useState } from 'react';
import { useTrackerData } from '../hooks/useTrackerData';
import { useStreakEngine } from '../hooks/useStreakEngine';
import ProgressGraphSet from '../youth/growth/ProgressGraphSet';
import BadgeShelf from '../youth/growth/BadgeShelf';
import GrowthMilestones from '../youth/growth/GrowthMilestones';
import CoachCommentsFeed from '../youth/growth/CoachCommentsFeed';
import NextGoalBanner from '../youth/growth/NextGoalBanner';
import WeeklyHeatmap from '../youth/streaks/WeeklyHeatmap';
import { useXP } from '../XPContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Target } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AthleteShotPerformance from '../hp/AthleteShotPerformance';

export default function MyGrowthTab({ user }) {
  const { 
    isLoading: isTrackerLoading, 
    benchmarks, 
    broomSessions 
  } = useTrackerData(user?.id);

  const { 
    streakData, 
    sessionLogs, 
    isLoading: isStreakLoading 
  } = useStreakEngine(user?.id);

  const { loyaltyData, isLoading: isXPLoading } = useXP();
  const [activeView, setActiveView] = useState('overview');

  const isLoading = isTrackerLoading || isStreakLoading || isXPLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Growth Overview</TabsTrigger>
          <TabsTrigger value="shot_analysis">Shot Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="text-orange-500" /> Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-6xl font-bold text-center text-orange-400">{streakData.currentStreak} <span className="text-2xl">days</span></div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2 bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target /> Session Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WeeklyHeatmap sessionLogs={sessionLogs} />
              </CardContent>
            </Card>
          </div>

          <ProgressGraphSet benchmarks={benchmarks} broomSessions={broomSessions} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GrowthMilestones benchmarks={benchmarks} />
            <NextGoalBanner />
          </div>

          <BadgeShelf badges={loyaltyData?.badges || []} />
          <CoachCommentsFeed sessions={broomSessions} />
        </TabsContent>

        <TabsContent value="shot_analysis" className="mt-6">
          <AthleteShotPerformance athleteId={user?.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
