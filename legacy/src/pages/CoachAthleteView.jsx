
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, TrendingUp, TrendingDown, Activity, Target, 
  MessageSquare, Calendar, Award, Brain, BarChart3, AlertTriangle,
  CheckCircle, Clock, Zap, Video, FileText, ChevronRight
} from 'lucide-react';
import { User } from '@/api/entities';
import { DrillLog, ShotTrackerLog, SmartBroomSession, AIInsight, CoachFeedback } from '@/api/entities';
import { Line, Bar, Radar } from 'recharts';
import { ResponsiveContainer, LineChart, BarChart, RadarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { useXP } from '../components/XPContext';
import { createPageUrl } from '@/utils';
import CoachFeedbackPanel from '../components/hp/CoachFeedbackPanel';
import LogDrillForm from '../components/hp/LogDrillForm';
import SkeletonPage from '../components/ui/SkeletonPage';

const PerformanceMetricCard = ({ icon: Icon, title, value, change, trend, subtitle, color = "brand-red" }) => {
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;

  // Dynamically generated Tailwind classes need to be constructed carefully
  // For `bg-${color}/10` and `text-${color}`, Tailwind needs the full class name to be present in the source code.
  // We can achieve this by mapping known colors or by using inline styles for dynamic parts.
  // Given the limited set of colors (brand-red, green-500, purple-500, blue-500),
  // we can ensure they are included in the global CSS or use a utility function if it's more complex.
  // For this context, assuming `brand-red`, `green-500`, `purple-500`, `blue-500` are already known to Tailwind.
  const bgColorClass = `bg-${color}/10`;
  const textColorClass = `text-${color}`;


  return (
    <Card className="bg-brand-card-bg border-brand-border hover:border-brand-red transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${bgColorClass}`}>
            <Icon className={`w-6 h-6 ${textColorClass}`} />
          </div>
          {change && (
            <div className={`flex items-center gap-1 ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        <h3 className="text-3xl font-bold text-brand-text-primary mb-1">{value}</h3>
        <p className="text-sm font-medium text-brand-text-secondary">{title}</p>
        {subtitle && <p className="text-xs text-brand-text-muted mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
};

const PerformanceTrendChart = ({ data, title, dataKey, color = "#ef4444" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-brand-text-secondary">
        No data available
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-brand-text-primary mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
            labelStyle={{ color: '#f3f4f6' }}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const SkillRadarChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="#374151" />
        <PolarAngleAxis dataKey="skill" stroke="#9ca3af" />
        <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
        <Radar 
          name="Current" 
          dataKey="current" 
          stroke="#ef4444" 
          fill="#ef4444" 
          fillOpacity={0.3} 
        />
        <Radar 
          name="Target" 
          dataKey="target" 
          stroke="#10b981" 
          fill="#10b981" 
          fillOpacity={0.2} 
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
};

const RecentActivityItem = ({ icon: Icon, title, description, time, color = "brand-red" }) => (
  <div className="flex items-start gap-3 p-3 bg-brand-charcoal rounded-lg hover:bg-brand-charcoal/70 transition-colors">
    <div className={`p-2 rounded-lg bg-${color}/10 flex-shrink-0`}>
      <Icon className={`w-4 h-4 text-${color}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-brand-text-primary text-sm">{title}</p>
      <p className="text-xs text-brand-text-secondary mt-1">{description}</p>
      <p className="text-xs text-brand-text-muted mt-1">{time}</p>
    </div>
  </div>
);

// calculateMetrics is a pure function, move it outside the component
const calculateMetrics = (drills, shots, sessions) => {
  // Calculate drill performance
  const avgDrillScore = drills.length > 0
    ? (drills.reduce((sum, d) => sum + d.score, 0) / drills.length).toFixed(1)
    : 'N/A';

  // Calculate shot accuracy
  const successfulShots = shots.filter(s => s.execution === 'Make').length;
  const shotAccuracy = shots.length > 0
    ? ((successfulShots / shots.length) * 100).toFixed(0)
    : 0;

  // Calculate Smart Broom metrics
  const avgPressure = sessions.length > 0
    ? (sessions.reduce((sum, s) => sum + (s.performance_metrics?.avg_pressure || 0), 0) / sessions.length).toFixed(0)
    : 'N/A';

  // Calculate trends
  const recentDrills = drills.slice(0, 5);
  const olderDrills = drills.slice(5, 10);
  const recentAvg = recentDrills.length > 0
    ? recentDrills.reduce((sum, d) => sum + d.score, 0) / recentDrills.length
    : 0;
  const olderAvg = olderDrills.length > 0
    ? olderDrills.reduce((sum, d) => sum + d.score, 0) / olderDrills.length
    : recentAvg;
  
  const drillTrend = recentAvg > olderAvg ? 'up' : recentAvg < olderAvg ? 'down' : 'stable';
  const drillChange = olderAvg > 0 ? `${((Math.abs(recentAvg - olderAvg) / olderAvg) * 100).toFixed(0)}%` : null;

  // Performance trend data for charts
  const drillTrendData = drills.slice(0, 10).reverse().map((drill, idx) => ({
    name: `Session ${idx + 1}`,
    score: drill.score,
    date: drill.date
  }));

  // Shot accuracy by type
  const drawShots = shots.filter(s => s.draw_type === 'Draws');
  const hitShots = shots.filter(s => s.hit_type);
  const drawAccuracy = drawShots.length > 0
    ? ((drawShots.filter(s => s.execution === 'Make').length / drawShots.length) * 100).toFixed(0)
    : 0;
  const hitAccuracy = hitShots.length > 0
    ? ((hitShots.filter(s => s.execution === 'Make').length / hitShots.length) * 100).toFixed(0)
    : 0;

  // Skill radar data
  const skillData = [
    { skill: 'Draw Weight', current: parseInt(drawAccuracy) || 50, target: 85 },
    { skill: 'Hit Accuracy', current: parseInt(hitAccuracy) || 50, target: 85 },
    { skill: 'Sweeping', current: parseInt(avgPressure) || 50, target: 85 },
    { skill: 'Strategy', current: parseFloat(avgDrillScore) * 20 || 50, target: 85 },
    { skill: 'Consistency', current: 70, target: 85 }
  ];

  return {
    avgDrillScore,
    shotAccuracy,
    avgPressure,
    drillTrend,
    drillChange,
    drawAccuracy,
    hitAccuracy,
    totalSessions: drills.length + shots.length + sessions.length,
    drillTrendData,
    skillData
  };
};

export default function CoachAthleteView() {
  const location = useLocation();
  const { user } = useXP();
  const [athlete, setAthlete] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

  // Get athlete ID from URL
  const urlParams = new URLSearchParams(location.search);
  const athleteId = urlParams.get('athleteId');

  // Memoize loadPerformanceMetrics to stabilize it for useCallback dependencies
  const loadPerformanceMetrics = useCallback(async () => {
    try {
      // Load drill logs
      const drillLogs = await DrillLog.filter({ athlete_id: athleteId }, '-date', 10);
      
      // Load shot tracker logs
      const shotLogs = await ShotTrackerLog.filter({ athlete_id: athleteId }, '-created_date', 50);
      
      // Load Smart Broom sessions
      const broomSessions = await SmartBroomSession.filter({ user_id: athleteId }, '-session_date', 10);
      
      // Load AI insights
      const insights = await AIInsight.filter({ athlete_id: athleteId, status: 'new' }, '-created_date', 5);
      
      // Load coach feedback
      const feedbacks = await CoachFeedback.filter({ athlete_id: athleteId }, '-created_date', 10);

      // Calculate metrics using the external function
      const metrics = calculateMetrics(drillLogs, shotLogs, broomSessions);

      setPerformanceData({
        drillLogs,
        shotLogs,
        broomSessions,
        insights,
        feedbacks,
        metrics
      });
    } catch (error) {
      console.error('Error loading performance metrics:', error);
      setPerformanceData({
        drillLogs: [],
        shotLogs: [],
        broomSessions: [],
        insights: [],
        feedbacks: [],
        metrics: {}
      });
      // Do not set global error here, as this is for sub-data, not athlete loading failure
    }
  }, [athleteId]); // setPerformanceData is a stable setter, no need to list as dependency

  // Memoize loadAthleteData to stabilize it for useEffect dependencies
  const loadAthleteData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate athlete ID
      if (!athleteId) {
        throw new Error('No athlete ID provided. Please select an athlete from your roster.');
      }

      // Check if this is a demo/sample ID
      if (athleteId.startsWith('athlete_') || athleteId.startsWith('demo_')) {
        throw new Error('Demo athlete IDs are not supported in this view. Please select a real athlete from your roster.');
      }

      // Load athlete user data
      const athleteData = await User.filter({ id: athleteId });
      
      if (!athleteData || athleteData.length === 0) {
        throw new Error('Athlete not found. They may not exist or you may not have permission to view their data.');
      }
      
      setAthlete(athleteData[0]);

      // Load performance data
      await loadPerformanceMetrics();
    } catch (error) {
      console.error('Error loading athlete data:', error);
      setError(error.message || 'Failed to load athlete data. Please try again.');
      setAthlete(null);
      setPerformanceData(null);
    } finally {
      setIsLoading(false);
    }
  }, [athleteId, loadPerformanceMetrics]); // athleteId and memoized loadPerformanceMetrics are dependencies

  useEffect(() => {
    if (athleteId && user) {
      loadAthleteData();
    } else if (!athleteId) {
      setIsLoading(false);
      setError('No athlete ID provided in URL. Please go back and select an athlete.');
    }
  }, [athleteId, user, loadAthleteData]); // loadAthleteData is now a stable dependency

  if (isLoading) {
    return <SkeletonPage variant="dashboard" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-brand-card-bg border-brand-border">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-brand-text-primary mb-2">Unable to Load Athlete</h2>
            <p className="text-brand-text-secondary mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.history.back()} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={loadAthleteData}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If no error, but athlete is still null, it implies a logic error or unexpected state.
  // This case should ideally be covered by the `if (error)` block.
  // Keeping it for extreme fallback, but it should technically be unreachable if error handling is robust.
  if (!athlete) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-brand-card-bg border-brand-border">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-brand-red mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-brand-text-primary mb-2">Athlete Data Unavailable</h2>
            <p className="text-brand-text-secondary mb-4">An unexpected issue occurred. The athlete's data could not be displayed.</p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-charcoal p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-brand-text-primary">{athlete.full_name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline">{athlete.preferred_position || 'Lead'}</Badge>
                <Badge variant="outline">{athlete.skill_level || 'Intermediate'}</Badge>
                {athlete.performance_tier && athlete.performance_tier !== 'none' && (
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {athlete.performance_tier.replace('_', ' ')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
            <Button>
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PerformanceMetricCard
            icon={Target}
            title="Drill Performance"
            value={performanceData?.metrics.avgDrillScore || 'N/A'}
            change={performanceData?.metrics.drillChange}
            trend={performanceData?.metrics.drillTrend}
            subtitle="Out of 5.0"
            color="brand-red"
          />
          <PerformanceMetricCard
            icon={CheckCircle}
            title="Shot Accuracy"
            value={`${performanceData?.metrics.shotAccuracy || 0}%`}
            subtitle="Make rate in games"
            color="green-500"
          />
          <PerformanceMetricCard
            icon={Zap}
            title="Sweep Pressure"
            value={`${performanceData?.metrics.avgPressure || 'N/A'} N`}
            subtitle="SmartBroom average"
            color="purple-500"
          />
          <PerformanceMetricCard
            icon={Activity}
            title="Training Sessions"
            value={performanceData?.metrics.totalSessions || 0}
            subtitle="Last 30 days"
            color="blue-500"
          />
        </div>

        {/* AI Insights Alert */}
        {performanceData?.insights && performanceData.insights.length > 0 && (
          <Alert className="bg-purple-500/10 border-purple-500/30">
            <Brain className="h-5 w-5 text-purple-400" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-purple-300">New AI Insights Available</strong>
                  <p className="text-sm text-brand-text-secondary mt-1">
                    {performanceData.insights.length} performance insights detected
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setActiveTab('insights')}
                >
                  View Insights
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-brand-card-bg border-brand-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="drills">Drills & Training</TabsTrigger>
            <TabsTrigger value="shots">Shot Analysis</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Trends */}
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand-red" />
                    Drill Performance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PerformanceTrendChart
                    data={performanceData?.metrics.drillTrendData}
                    title="Last 10 Sessions"
                    dataKey="score"
                  />
                </CardContent>
              </Card>

              {/* Skill Radar */}
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-brand-red" />
                    Skill Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SkillRadarChart data={performanceData?.metrics.skillData} />
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-red" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {performanceData?.drillLogs.slice(0, 5).map((drill, idx) => (
                    <RecentActivityItem
                      key={`drill-${idx}`}
                      icon={Target}
                      title="Drill Completed"
                      description={`Score: ${drill.score}/5 - ${drill.notes || 'No notes'}`}
                      time={new Date(drill.date).toLocaleDateString()}
                      color="brand-red"
                    />
                  ))}
                  {performanceData?.broomSessions.slice(0, 2).map((session, idx) => (
                    <RecentActivityItem
                      key={`session-${idx}`}
                      icon={Activity}
                      title="Smart Broom Session"
                      description={`Avg Pressure: ${session.performance_metrics?.avg_pressure || 'N/A'} N, ${session.total_sweeps || 0} sweeps`}
                      time={new Date(session.session_date).toLocaleDateString()}
                      color="purple-500"
                    />
                  ))}
                  {performanceData?.feedbacks.slice(0, 2).map((feedback, idx) => (
                    <RecentActivityItem
                      key={`feedback-${idx}`}
                      icon={MessageSquare}
                      title="Coach Feedback"
                      description={feedback.feedback_text.substring(0, 100)}
                      time={new Date(feedback.created_date).toLocaleDateString()}
                      color="blue-500"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drills Tab */}
          <TabsContent value="drills" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <CardTitle>Drill History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {performanceData?.drillLogs.map((drill) => (
                        <div key={drill.id} className="p-4 bg-brand-charcoal rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-brand-text-primary">Drill Session</h4>
                              <p className="text-sm text-brand-text-secondary">
                                {new Date(drill.date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={drill.score >= 4 ? 'bg-green-500/20 text-green-300' : drill.score >= 3 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}>
                              {drill.score}/5
                            </Badge>
                          </div>
                          {drill.notes && (
                            <p className="text-sm text-brand-text-secondary mt-2">
                              {drill.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <LogDrillForm 
                  athleteId={athleteId}
                  onDrillLogged={loadPerformanceMetrics}
                />
              </div>
            </div>
          </TabsContent>

          {/* Shot Analysis Tab */}
          <TabsContent value="shots" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-brand-text-primary">Draw Accuracy</h3>
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-4xl font-bold text-brand-text-primary mb-2">
                    {performanceData?.metrics.drawAccuracy || 0}%
                  </div>
                  <p className="text-sm text-brand-text-secondary">
                    {performanceData?.shotLogs.filter(s => s.draw_type === 'Draws').length || 0} draw shots tracked
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-brand-text-primary">Hit Accuracy</h3>
                    <Zap className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="text-4xl font-bold text-brand-text-primary mb-2">
                    {performanceData?.metrics.hitAccuracy || 0}%
                  </div>
                  <p className="text-sm text-brand-text-secondary">
                    {performanceData?.shotLogs.filter(s => s.hit_type).length || 0} hit shots tracked
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Recent Shots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {performanceData?.shotLogs.slice(0, 10).map((shot, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-20">
                          {shot.position}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium text-brand-text-primary">
                            {shot.draw_type || shot.hit_type}
                          </p>
                          <p className="text-xs text-brand-text-secondary">
                            {shot.turn_target}
                          </p>
                        </div>
                      </div>
                      <Badge className={shot.execution === 'Make' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}>
                        {shot.execution}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {performanceData?.insights && performanceData.insights.length > 0 ? (
              <div className="space-y-4">
                {performanceData.insights.map((insight) => (
                  <Card key={insight.id} className="bg-brand-card-bg border-brand-border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Brain className="w-5 h-5 text-purple-400" />
                          <CardTitle className="text-lg">{insight.insight_type.replace('_', ' ')}</CardTitle>
                        </div>
                        <Badge 
                          className={
                            insight.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                            insight.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-blue-500/20 text-blue-300'
                          }
                        >
                          {insight.severity}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-brand-text-primary mb-1">Observation</h4>
                          <p className="text-brand-text-secondary">{insight.observation}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-brand-text-primary mb-1">Recommendation</h4>
                          <p className="text-brand-text-secondary">{insight.suggestion}</p>
                        </div>
                        {insight.supporting_metrics && Object.keys(insight.supporting_metrics).length > 0 && (
                          <div>
                            <h4 className="font-semibold text-brand-text-primary mb-2">Supporting Data</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(insight.supporting_metrics).map(([key, value]) => (
                                <div key={key} className="bg-brand-charcoal p-2 rounded">
                                  <p className="text-xs text-brand-text-secondary">{key.replace('_', ' ')}</p>
                                  <p className="text-sm font-medium text-brand-text-primary">{value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-12 text-center">
                  <Brain className="w-16 h-16 text-brand-text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
                    No Insights Available
                  </h3>
                  <p className="text-brand-text-secondary">
                    AI insights will appear here as more performance data is collected
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <CoachFeedbackPanel 
              athleteId={athleteId}
              onFeedbackAdded={loadPerformanceMetrics}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
