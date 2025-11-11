import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';  
import { Progress } from '@/components/ui/progress';
import { ShotTrackerLog } from '@/api/entities';
import { DrillLog } from '@/api/entities';
import { CoachFeedback } from '@/api/entities';
import { AIInsight } from '@/api/entities';
import { Target, TrendingUp, Brain, Calendar, Award, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays } from 'date-fns';

const PerformanceMetricsPanel = ({ athleteId }) => {
  const [shotLogs, setShotLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPerformanceData();
  }, [athleteId]);

  const loadPerformanceData = async () => {
    try {
      const logs = await ShotTrackerLog.filter(
        { athlete_id: athleteId }, 
        '-created_date', 
        50
      );
      setShotLogs(logs);
    } catch (error) {
      console.error('Failed to load performance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAccuracy = (execution) => {
    const accuracyMap = { 'Make': 100, 'Partial': 75, 'Limited': 50, 'Xmiss': 0 };
    return accuracyMap[execution] || 0;
  };

  const performanceData = shotLogs.slice(0, 10).reverse().map((log, index) => ({
    game: `Game ${index + 1}`,
    accuracy: calculateAccuracy(log.execution),
    date: format(new Date(log.created_date), 'MMM d')
  }));

  const executionBreakdown = shotLogs.reduce((acc, log) => {
    acc[log.execution] = (acc[log.execution] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(executionBreakdown).map(([execution, count]) => ({
    name: execution,
    count
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Overall Accuracy</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {shotLogs.length > 0 ? 
                    Math.round(shotLogs.reduce((sum, log) => sum + calculateAccuracy(log.execution), 0) / shotLogs.length) 
                    : 0}%
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Shots Logged</p>
                <p className="text-2xl font-bold text-brand-text-primary">{shotLogs.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Make Rate</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {shotLogs.length > 0 ? 
                    Math.round((shotLogs.filter(log => log.execution === 'Make').length / shotLogs.length) * 100)
                    : 0}%
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="game" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    color: '#f9fafb'
                  }} 
                />
                <Line type="monotone" dataKey="accuracy" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Shot Execution Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    color: '#f9fafb'
                  }} 
                />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DrillProgressPanel = ({ athleteId }) => {
  const [drillLogs, setDrillLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDrillData();
  }, [athleteId]);

  const loadDrillData = async () => {
    try {
      const logs = await DrillLog.filter(
        { athlete_id: athleteId }, 
        '-date', 
        20
      );
      setDrillLogs(logs);
    } catch (error) {
      console.error('Failed to load drill data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const averageScore = drillLogs.length > 0 ? 
    drillLogs.reduce((sum, log) => sum + log.score, 0) / drillLogs.length : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Average Drill Score</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {averageScore.toFixed(1)}/5.0
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Drills Completed</p>
                <p className="text-2xl font-bold text-brand-text-primary">{drillLogs.length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Recent Drill Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? <p>Loading drill history...</p> : (
            <div className="space-y-4">
              {drillLogs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-brand-charcoal rounded-lg">
                  <div>
                    <p className="font-medium text-brand-text-primary">
                      Drill ID: {log.drill_id}
                    </p>
                    <p className="text-sm text-brand-text-secondary">
                      {format(new Date(log.date), 'MMMM d, yyyy')}
                    </p>
                    {log.notes && (
                      <p className="text-sm text-brand-text-secondary italic mt-1">
                        "{log.notes}"
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      log.score >= 4 ? 'bg-green-600' :
                      log.score >= 3 ? 'bg-yellow-600' :
                      'bg-red-600'
                    }>
                      {log.score}/5
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const AIInsightsPanel = ({ athleteId }) => {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAIInsights();
  }, [athleteId]);

  const loadAIInsights = async () => {
    try {
      const data = await AIInsight.filter(
        { athlete_id: athleteId }, 
        '-created_date', 
        10
      );
      setInsights(data);
    } catch (error) {
      console.error('Failed to load AI insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          AI Performance Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? <p>Loading insights...</p> : (
          <div className="space-y-4">
            {insights.length > 0 ? insights.map(insight => (
              <div key={insight.id} className="p-4 bg-brand-charcoal rounded-lg border-l-4 border-purple-500">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={
                    insight.severity === 'high' ? 'bg-red-600' :
                    insight.severity === 'medium' ? 'bg-yellow-600' :
                    'bg-blue-600'
                  }>
                    {insight.insight_type.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-brand-text-primary font-semibold mb-2">
                  {insight.observation}
                </p>
                <p className="text-brand-text-secondary">
                  💡 {insight.suggestion}
                </p>
                {insight.coach_notes && (
                  <div className="mt-3 p-2 bg-brand-card-bg rounded border-l-2 border-blue-400">
                    <p className="text-sm text-brand-text-secondary">
                      <strong>Coach Notes:</strong> {insight.coach_notes}
                    </p>
                  </div>
                )}
              </div>
            )) : (
              <div className="text-center py-8 text-brand-text-secondary">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No AI insights available yet.</p>
                <p className="text-sm">Complete more training sessions to generate insights.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function AthletePerformanceDashboard({ athleteId }) {
  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg flex items-center justify-center">
          <Target className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Performance Dashboard</h1>
          <p className="text-brand-text-secondary">Track your development and performance metrics</p>
        </div>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-brand-card-bg border-brand-border">
          <TabsTrigger value="performance">Shot Performance</TabsTrigger>
          <TabsTrigger value="drills">Drill Progress</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="performance" className="mt-6">
          <PerformanceMetricsPanel athleteId={athleteId} />
        </TabsContent>
        <TabsContent value="drills" className="mt-6">  
          <DrillProgressPanel athleteId={athleteId} />
        </TabsContent>
        <TabsContent value="insights" className="mt-6">
          <AIInsightsPanel athleteId={athleteId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}