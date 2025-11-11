
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, Users, Trophy, Target, AlertTriangle, 
  Star, Activity, BarChart3, Calendar, Award, Zap,
  Globe, ArrowRight, CheckCircle, Brain
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, RadarChart, Radar, 
  ScatterChart, Scatter, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { User, NextGenAthlete, Achievement, DrillLog, ShotTrackerLog, SmartBroomSession } from '@/api/entities';
import { usePermissions } from '../components/hooks/usePermissions';

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

const PathwayProgressionChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      <XAxis dataKey="stage" stroke="#9ca3af" />
      <YAxis stroke="#9ca3af" />
      <Tooltip 
        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
        labelStyle={{ color: '#f3f4f6' }}
      />
      <Legend />
      <Bar dataKey="current" fill="#ef4444" name="Current Athletes" />
      <Bar dataKey="projected" fill="#f59e0b" name="Projected Next Year" />
    </BarChart>
  </ResponsiveContainer>
);

const TalentIdentificationScatter = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <ScatterChart>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      <XAxis 
        dataKey="technical_score" 
        name="Technical Score" 
        stroke="#9ca3af"
        label={{ value: 'Technical Performance', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
      />
      <YAxis 
        dataKey="potential_score" 
        name="Potential" 
        stroke="#9ca3af"
        label={{ value: 'Growth Potential', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
      />
      <Tooltip 
        cursor={{ strokeDasharray: '3 3' }}
        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
        labelStyle={{ color: '#f3f4f6' }}
        content={({ payload }) => {
          if (payload && payload.length > 0) {
            const data = payload[0].payload;
            return (
              <div className="bg-brand-card-bg border border-brand-border p-3 rounded-lg">
                <p className="font-bold text-brand-text-primary">{data.name}</p>
                <p className="text-sm text-brand-text-secondary">Technical: {data.technical_score}</p>
                <p className="text-sm text-brand-text-secondary">Potential: {data.potential_score}</p>
                <p className="text-sm text-brand-text-secondary">Age: {data.age}</p>
              </div>
            );
          }
          return null;
        }}
      />
      <Scatter name="Athletes" data={data} fill="#ef4444">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.potential_score > 75 ? '#10b981' : entry.potential_score > 50 ? '#f59e0b' : '#ef4444'} />
        ))}
      </Scatter>
    </ScatterChart>
  </ResponsiveContainer>
);

const InternationalPerformanceChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      <XAxis dataKey="year" stroke="#9ca3af" />
      <YAxis stroke="#9ca3af" />
      <Tooltip 
        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
        labelStyle={{ color: '#f3f4f6' }}
      />
      <Legend />
      <Line type="monotone" dataKey="gold" stroke="#fbbf24" strokeWidth={2} name="Gold Medals" />
      <Line type="monotone" dataKey="silver" stroke="#9ca3af" strokeWidth={2} name="Silver Medals" />
      <Line type="monotone" dataKey="bronze" stroke="#cd7f32" strokeWidth={2} name="Bronze Medals" />
      <Line type="monotone" dataKey="worldRanking" stroke="#3b82f6" strokeWidth={2} name="World Ranking" />
    </LineChart>
  </ResponsiveContainer>
);

const AthleteComparisonRadar = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <RadarChart data={data}>
      <PolarGrid stroke="#374151" />
      <PolarAngleAxis dataKey="skill" stroke="#9ca3af" />
      <PolarRadiusAxis stroke="#9ca3af" />
      <Radar name="Team Average" dataKey="teamAvg" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
      <Radar name="Top Performer" dataKey="topPerformer" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
      <Radar name="Elite Benchmark" dataKey="benchmark" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.3} />
      <Legend />
      <Tooltip 
        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
        labelStyle={{ color: '#f3f4f6' }}
      />
    </RadarChart>
  </ResponsiveContainer>
);

const TalentPipelineCard = ({ athlete, rank }) => {
  const getRankColor = (rank) => {
    if (rank <= 3) return 'text-yellow-400';
    if (rank <= 10) return 'text-green-400';
    return 'text-blue-400';
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-brand-charcoal rounded-lg hover:bg-brand-charcoal/70 transition-all">
      <div className="flex items-center gap-4">
        <div className={`text-2xl font-bold ${getRankColor(rank)}`}>
          {getRankBadge(rank)}
        </div>
        <div>
          <h4 className="font-bold text-brand-text-primary">{athlete.name}</h4>
          <p className="text-sm text-brand-text-secondary">{athlete.age} years • {athlete.position}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm text-brand-text-secondary">Composite Score</p>
          <p className="text-xl font-bold text-brand-red">{athlete.compositeScore}</p>
        </div>
        <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
          {athlete.pathway}
        </Badge>
      </div>
    </div>
  );
};

const PredictiveInsightCard = ({ insight }) => {
  const getInsightIcon = (type) => {
    switch (type) {
      case 'high_potential': return <Star className="w-5 h-5 text-yellow-400" />;
      case 'at_risk': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'ready_advancement': return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'needs_support': return <Target className="w-5 h-5 text-blue-400" />;
      default: return <Brain className="w-5 h-5 text-purple-400" />;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'high_potential': return 'border-yellow-500/20 bg-yellow-500/5';
      case 'at_risk': return 'border-orange-500/20 bg-orange-500/5';
      case 'ready_advancement': return 'border-green-500/20 bg-green-500/5';
      case 'needs_support': return 'border-blue-500/20 bg-blue-500/5';
      default: return 'border-purple-500/20 bg-purple-500/5';
    }
  };

  return (
    <Card className={`border ${getInsightColor(insight.type)}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-brand-charcoal rounded-lg">
            {getInsightIcon(insight.type)}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-brand-text-primary mb-1">{insight.title}</h4>
            <p className="text-sm text-brand-text-secondary mb-2">{insight.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {insight.athletes.length} athletes
              </Badge>
              <Badge variant="outline" className="text-xs">
                Confidence: {insight.confidence}%
              </Badge>
            </div>
          </div>
          <Button size="sm" variant="ghost">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function HPAnalyticsDashboard() {
  const { permissions } = usePermissions();
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('current_season');
  const [selectedTeam, setSelectedTeam] = useState('all');

  // Mock data - in production, this would come from actual analytics
  const pathwayData = [
    { stage: 'Club Level', current: 1200, projected: 1350 },
    { stage: 'Provincial', current: 450, projected: 480 },
    { stage: 'NextGen', current: 85, projected: 95 },
    { stage: 'National Pool', current: 24, projected: 28 },
    { stage: 'National Team', current: 16, projected: 16 }
  ];

  const talentScatterData = [
    { name: 'Sarah M.', technical_score: 92, potential_score: 88, age: 19, pathway: 'NextGen' },
    { name: 'Alex K.', technical_score: 85, potential_score: 92, age: 17, pathway: 'Provincial' },
    { name: 'Jordan L.', technical_score: 78, potential_score: 85, age: 18, pathway: 'Provincial' },
    { name: 'Taylor P.', technical_score: 88, potential_score: 75, age: 22, pathway: 'NextGen' },
    { name: 'Morgan R.', technical_score: 82, potential_score: 90, age: 16, pathway: 'Provincial' },
    { name: 'Jamie D.', technical_score: 95, potential_score: 70, age: 24, pathway: 'National Pool' },
    { name: 'Casey W.', technical_score: 91, potential_score: 82, age: 20, pathway: 'NextGen' },
    { name: 'Riley H.', technical_score: 76, potential_score: 88, age: 15, pathway: 'Club' }
  ];

  const internationalPerformance = [
    { year: '2020', gold: 2, silver: 3, bronze: 1, worldRanking: 3 },
    { year: '2021', gold: 3, silver: 2, bronze: 2, worldRanking: 2 },
    { year: '2022', gold: 4, silver: 1, bronze: 3, worldRanking: 1 },
    { year: '2023', gold: 3, silver: 4, bronze: 2, worldRanking: 2 },
    { year: '2024', gold: 5, silver: 2, bronze: 1, worldRanking: 1 }
  ];

  const skillComparison = [
    { skill: 'Draw Weight', teamAvg: 75, topPerformer: 92, benchmark: 90 },
    { skill: 'Hit Accuracy', teamAvg: 82, topPerformer: 95, benchmark: 88 },
    { skill: 'Sweeping', teamAvg: 78, topPerformer: 88, benchmark: 85 },
    { skill: 'Strategy', teamAvg: 80, topPerformer: 90, benchmark: 87 },
    { skill: 'Mental Game', teamAvg: 72, topPerformer: 85, benchmark: 82 },
    { skill: 'Physical Fitness', teamAvg: 85, topPerformer: 92, benchmark: 88 }
  ];

  const talentPipeline = [
    { name: 'Sarah Mitchell', age: 19, position: 'Skip', pathway: 'NextGen', compositeScore: 94 },
    { name: 'Alex Kim', age: 17, position: 'Third', pathway: 'Provincial', compositeScore: 91 },
    { name: 'Jordan Lee', age: 18, position: 'Second', pathway: 'Provincial', compositeScore: 89 },
    { name: 'Taylor Park', age: 22, position: 'Skip', pathway: 'NextGen', compositeScore: 88 },
    { name: 'Morgan Rivera', age: 16, position: 'Lead', pathway: 'Provincial', compositeScore: 87 },
    { name: 'Jamie Davis', age: 24, position: 'Third', pathway: 'National Pool', compositeScore: 86 },
    { name: 'Casey Wright', age: 20, position: 'Second', pathway: 'NextGen', compositeScore: 85 },
    { name: 'Riley Harris', age: 15, position: 'Lead', pathway: 'Club', compositeScore: 84 }
  ];

  const predictiveInsights = [
    {
      type: 'high_potential',
      title: 'High Potential Emerging Talent',
      description: '3 athletes showing exceptional growth trajectory and likely to advance to National Pool within 18 months',
      athletes: ['Sarah M.', 'Alex K.', 'Morgan R.'],
      confidence: 87
    },
    {
      type: 'ready_advancement',
      title: 'Ready for NextGen Promotion',
      description: '5 provincial athletes meeting all criteria for NextGen program advancement',
      athletes: ['Jordan L.', 'Casey W.', 'Riley H.', 'Taylor P.', 'Jamie D.'],
      confidence: 92
    },
    {
      type: 'at_risk',
      title: 'Retention Risk Alert',
      description: '2 NextGen athletes showing declining engagement metrics and require intervention',
      athletes: ['Athlete A', 'Athlete B'],
      confidence: 78
    },
    {
      type: 'needs_support',
      title: 'Technical Development Needed',
      description: '4 athletes require focused coaching on draw weight accuracy to meet benchmark standards',
      athletes: ['Group A', 'Group B', 'Group C', 'Group D'],
      confidence: 85
    }
  ];

  const [stats, setStats] = useState({
    totalAthletes: 1775,
    activeNextGen: 85,
    nationalPoolSize: 24,
    projectedGraduation: 12,
    averageProgression: 18,
    retentionRate: 89,
    internationalMedals: 8,
    worldRanking: 1
  });

  useEffect(() => {
    // Load analytics data
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        // In production, this would fetch real analytics
        // const data = await HPAnalytics.getPathwayProgression();
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (permissions.canAccessHP) {
      loadAnalytics();
    }
  }, [permissions, timeframe, selectedTeam]);

  if (!permissions.canAccessHP) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-brand-text-primary mb-2">Access Restricted</h3>
            <p className="text-brand-text-secondary">This dashboard is only available to HP staff and administrators.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-brand-text-secondary">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-charcoal p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-text-primary flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-brand-red" />
              HP Analytics Dashboard
            </h1>
            <p className="text-brand-text-secondary mt-2">
              Advanced insights into athlete development and performance trends
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current_season">Current Season</SelectItem>
                <SelectItem value="last_year">Last Year</SelectItem>
                <SelectItem value="all_time">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="mens">Men's Team</SelectItem>
                <SelectItem value="womens">Women's Team</SelectItem>
                <SelectItem value="mixed">Mixed Doubles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-secondary">Total Athletes</p>
                  <p className="text-3xl font-bold text-brand-text-primary mt-1">{stats.totalAthletes}</p>
                  <p className="text-xs text-green-400 mt-1">↑ 12% from last year</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-secondary">NextGen Active</p>
                  <p className="text-3xl font-bold text-brand-text-primary mt-1">{stats.activeNextGen}</p>
                  <p className="text-xs text-green-400 mt-1">↑ 8% from last year</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-secondary">Retention Rate</p>
                  <p className="text-3xl font-bold text-brand-text-primary mt-1">{stats.retentionRate}%</p>
                  <p className="text-xs text-green-400 mt-1">↑ 3% from last year</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-secondary">World Ranking</p>
                  <p className="text-3xl font-bold text-brand-text-primary mt-1">#{stats.worldRanking}</p>
                  <p className="text-xs text-green-400 mt-1">Maintained #1</p>
                </div>
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="pathway" className="space-y-6">
          <TabsList className="bg-brand-card-bg border-brand-border">
            <TabsTrigger value="pathway">Pathway Progression</TabsTrigger>
            <TabsTrigger value="talent">Talent Identification</TabsTrigger>
            <TabsTrigger value="international">International Performance</TabsTrigger>
            <TabsTrigger value="insights">Predictive Insights</TabsTrigger>
          </TabsList>

          {/* Pathway Progression Tab */}
          <TabsContent value="pathway" className="space-y-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>HP Pathway Distribution</CardTitle>
                <CardDescription>
                  Current athlete distribution across pathway stages with year-over-year projections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PathwayProgressionChart data={pathwayData} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Skill Comparison Analysis</CardTitle>
                  <CardDescription>
                    Performance benchmarking across key skill areas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AthleteComparisonRadar data={skillComparison} />
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Progression Metrics</CardTitle>
                  <CardDescription>
                    Key indicators of pathway effectiveness
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-brand-charcoal rounded-lg">
                    <div>
                      <p className="text-sm text-brand-text-secondary">Avg. Time to NextGen</p>
                      <p className="text-2xl font-bold text-brand-text-primary">{stats.averageProgression} months</p>
                    </div>
                    <Activity className="w-8 h-8 text-blue-500" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-brand-charcoal rounded-lg">
                    <div>
                      <p className="text-sm text-brand-text-secondary">Projected Graduations</p>
                      <p className="text-2xl font-bold text-brand-text-primary">{stats.projectedGraduation} athletes</p>
                    </div>
                    <Award className="w-8 h-8 text-purple-500" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-brand-charcoal rounded-lg">
                    <div>
                      <p className="text-sm text-brand-text-secondary">National Pool Size</p>
                      <p className="text-2xl font-bold text-brand-text-primary">{stats.nationalPoolSize} athletes</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-brand-charcoal rounded-lg">
                    <div>
                      <p className="text-sm text-brand-text-secondary">International Medals (2024)</p>
                      <p className="text-2xl font-bold text-brand-text-primary">{stats.internationalMedals} medals</p>
                    </div>
                    <Trophy className="w-8 h-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Talent Identification Tab */}
          <TabsContent value="talent" className="space-y-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Talent Identification Matrix</CardTitle>
                <CardDescription>
                  AI-powered analysis of technical performance vs. growth potential
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TalentIdentificationScatter data={talentScatterData} />
                <div className="mt-4 flex gap-4 justify-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-brand-text-secondary">High Potential</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-brand-text-secondary">Moderate Potential</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-brand-text-secondary">Watch List</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Top Talent Pipeline</CardTitle>
                <CardDescription>
                  Ranked list of high-potential athletes by composite performance score
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {talentPipeline.map((athlete, index) => (
                  <TalentPipelineCard key={index} athlete={athlete} rank={index + 1} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* International Performance Tab */}
          <TabsContent value="international" className="space-y-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>International Competition Performance</CardTitle>
                <CardDescription>
                  Medal count and world ranking trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InternationalPerformanceChart data={internationalPerformance} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>2024 Medal Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <span className="text-brand-text-secondary">Gold</span>
                      </div>
                      <span className="text-2xl font-bold text-brand-text-primary">5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-brand-text-secondary">Silver</span>
                      </div>
                      <span className="text-2xl font-bold text-brand-text-primary">2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-700 rounded-full"></div>
                        <span className="text-brand-text-secondary">Bronze</span>
                      </div>
                      <span className="text-2xl font-bold text-brand-text-primary">1</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Key Competitions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-brand-charcoal rounded-lg">
                      <p className="font-bold text-brand-text-primary">World Championships</p>
                      <p className="text-sm text-brand-text-secondary">2 Gold, 1 Silver</p>
                    </div>
                    <div className="p-3 bg-brand-charcoal rounded-lg">
                      <p className="font-bold text-brand-text-primary">Grand Slam Events</p>
                      <p className="text-sm text-brand-text-secondary">3 Titles</p>
                    </div>
                    <div className="p-3 bg-brand-charcoal rounded-lg">
                      <p className="font-bold text-brand-text-primary">Continental Cup</p>
                      <p className="text-sm text-brand-text-secondary">Team Victory</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Global Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
                      <span className="text-brand-text-secondary">Men's Team</span>
                      <Badge className="bg-yellow-500/10 text-yellow-400">#1</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
                      <span className="text-brand-text-secondary">Women's Team</span>
                      <Badge className="bg-yellow-500/10 text-yellow-400">#2</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
                      <span className="text-brand-text-secondary">Mixed Doubles</span>
                      <Badge className="bg-yellow-500/10 text-yellow-400">#1</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Predictive Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  AI-Powered Predictive Insights
                </CardTitle>
                <CardDescription>
                  Machine learning analysis of athlete development patterns and risk factors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {predictiveInsights.map((insight, index) => (
                    <PredictiveInsightCard key={index} insight={insight} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Recommended Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                        <div>
                          <p className="font-bold text-brand-text-primary">Schedule NextGen Evaluations</p>
                          <p className="text-sm text-brand-text-secondary">5 athletes ready for advancement assessment</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                        <div>
                          <p className="font-bold text-brand-text-primary">Intervention Required</p>
                          <p className="text-sm text-brand-text-secondary">2 NextGen athletes showing declining engagement</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <p className="font-bold text-brand-text-primary">Focus Technical Development</p>
                          <p className="text-sm text-brand-text-secondary">4 athletes need draw weight coaching</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-purple-400 mt-0.5" />
                        <div>
                          <p className="font-bold text-brand-text-primary">Scout High-Potential Athletes</p>
                          <p className="text-sm text-brand-text-secondary">3 emerging talents identified for closer monitoring</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Model Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-brand-text-secondary">Prediction Accuracy</span>
                        <span className="text-sm font-bold text-brand-text-primary">87%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-brand-text-secondary">Data Completeness</span>
                        <span className="text-sm font-bold text-brand-text-primary">92%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-brand-text-secondary">Model Confidence</span>
                        <span className="text-sm font-bold text-brand-text-primary">84%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-brand-border">
                      <p className="text-sm text-brand-text-secondary mb-2">Last Model Update</p>
                      <p className="text-brand-text-primary font-medium">January 15, 2025</p>
                    </div>

                    <div className="pt-2">
                      <p className="text-sm text-brand-text-secondary mb-2">Training Data Sources</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Shot Tracker</Badge>
                        <Badge variant="outline">Smart Broom</Badge>
                        <Badge variant="outline">Competition Results</Badge>
                        <Badge variant="outline">Coach Feedback</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
