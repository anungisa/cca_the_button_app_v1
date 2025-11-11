
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3, TrendingUp, Target, Activity, Users,
  CheckCircle, RefreshCw, Download, Eye, Brain,
  Zap, Award, LineChart, PieChart, Heart, AlertTriangle, Clock
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function CanadianTireFinancialIntegration() {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    toast({
      title: "Syncing CTFS Analytics",
      description: "Fetching Tableau dashboards and performance insights..."
    });

    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Sync Complete",
        description: "HP analytics data synchronized successfully."
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-orange-950/20 to-red-950/20 border-orange-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-orange-400" />
            CTFS High Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-orange-500/30 bg-orange-500/10">
            <BarChart3 className="w-4 h-4 text-orange-400" />
            <AlertDescription className="text-brand-text-primary">
              Canadian Tire Financial Services provides advanced Tableau analytics dashboards exclusively for the High Performance program.
              Delivers insights on athlete performance trends, training effectiveness, and competitive benchmarking.
              <strong className="block mt-2 text-orange-400">Note: This is an analytics partnership, not a payment processing integration.</strong>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-brand-text-primary font-medium">Connection Status</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400">Active</Badge>
            </div>

            {/* Key Analytics Provided */}
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 bg-brand-charcoal/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-brand-text-secondary">Active Dashboards</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">12</p>
                <p className="text-xs text-brand-text-secondary">Tableau workbooks</p>
              </div>

              <div className="p-3 bg-brand-charcoal/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-brand-text-secondary">Athletes Tracked</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">47</p>
                <p className="text-xs text-brand-text-secondary">NextGen + National Team</p>
              </div>

              <div className="p-3 bg-brand-charcoal/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-brand-text-secondary">Data Refresh</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">Daily</p>
                <p className="text-xs text-green-400">Automated sync</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSync} disabled={isSyncing} className="flex-1">
                <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                Sync Analytics
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="dashboards" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-brand-card-bg">
          <TabsTrigger value="dashboards">Analytics Dashboards</TabsTrigger>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
          <TabsTrigger value="integration">Integration Details</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboards" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Available Tableau Dashboards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  name: 'Athlete Performance Overview',
                  description: 'Comprehensive view of all athlete metrics, shot accuracy, training load',
                  metrics: ['Shot accuracy trends', 'Training volume', 'Competition results'],
                  icon: Target,
                  color: 'blue'
                },
                {
                  name: 'Training Load Analysis',
                  description: 'Monitors training intensity, recovery, and load management',
                  metrics: ['Acute/chronic workload ratio', 'Fatigue indicators', 'Recovery scores'],
                  icon: Activity,
                  color: 'green'
                },
                {
                  name: 'Competition Performance',
                  description: 'Game-by-game performance tracking and trend analysis',
                  metrics: ['Win/loss records', 'Shot execution rates', 'End-by-end analysis'],
                  icon: Award,
                  color: 'amber'
                },
                {
                  name: 'Team Comparisons',
                  description: 'Benchmark athletes against peers and team averages',
                  metrics: ['Peer rankings', 'Team averages', 'Position-specific stats'],
                  icon: Users,
                  color: 'purple'
                },
                {
                  name: 'Predictive Performance',
                  description: 'AI-powered forecasting for competition outcomes',
                  metrics: ['Win probability', 'Performance forecasts', 'Risk indicators'],
                  icon: Brain,
                  color: 'cyan'
                },
                {
                  name: 'Physical Readiness',
                  description: 'Combines wearable data with training logs',
                  metrics: ['HRV trends', 'Sleep quality', 'Readiness scores'],
                  icon: Heart,
                  color: 'red'
                }
              ].map((dashboard, idx) => (
                <div key={idx} className={`p-4 bg-${dashboard.color}-500/10 border border-${dashboard.color}-500/30 rounded-lg`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${dashboard.color}-500/20`}>
                        <dashboard.icon className={`w-5 h-5 text-${dashboard.color}-400`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-brand-text-primary">{dashboard.name}</h4>
                        <p className="text-sm text-brand-text-secondary mt-1">{dashboard.description}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dashboard.metrics.map((metric, midx) => (
                      <Badge key={midx} variant="outline" className="text-xs">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Sample Analytics Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  insight: 'Draw Weight Consistency Improving',
                  detail: 'NextGen athletes show 15% improvement in draw weight control over past 6 months',
                  trend: 'positive',
                  icon: TrendingUp,
                  color: 'green'
                },
                {
                  insight: 'Recovery Time Correlates with Performance',
                  detail: 'Athletes with HRV >10ms above baseline have 23% higher shot execution rates',
                  trend: 'insight',
                  icon: Brain,
                  color: 'cyan'
                },
                {
                  insight: 'Training Load Optimization Needed',
                  detail: '3 athletes showing elevated fatigue markers. Recommend training adjustment.',
                  trend: 'warning',
                  icon: AlertTriangle,
                  color: 'yellow'
                },
                {
                  insight: 'Shot Execution Peak Times',
                  detail: 'Performance 12% higher in morning sessions vs evening for most athletes',
                  trend: 'insight',
                  icon: Clock,
                  color: 'blue'
                }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 bg-${item.color}-500/10 border border-${item.color}-500/30 rounded-lg`}>
                  <div className="flex items-start gap-3">
                    <item.icon className={`w-5 h-5 text-${item.color}-400 mt-0.5`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-brand-text-primary mb-1">{item.insight}</h4>
                      <p className="text-sm text-brand-text-secondary">{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Technical Integration Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-brand-text-primary mb-3">Data Flow Architecture</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                        <Users className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-medium">Teamworks AMS</span>
                      </div>
                      <span className="text-brand-text-secondary">→</span>
                      <div className="flex items-center gap-2 flex-1 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <BarChart3 className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium">CTFS Tableau Server</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <Heart className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium">Polar/Garmin APIs</span>
                      </div>
                      <span className="text-brand-text-secondary">→</span>
                      <div className="flex items-center gap-2 flex-1 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <BarChart3 className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium">CTFS Tableau Server</span>
                      </div>
                    </div>

                    <div className="text-center py-2">
                      <span className="text-brand-text-secondary text-sm">↓ Embedded dashboards & data extracts</span>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <Target className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium">The Button - Performance Center</span>
                      <Badge className="bg-green-500/20 text-green-400 ml-auto">Live</Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t border-brand-border pt-4">
                  <h4 className="font-semibold text-brand-text-primary mb-3">Integration Specifications</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-brand-charcoal/30 rounded">
                      <span className="text-brand-text-secondary">Platform</span>
                      <span className="text-brand-text-primary">Tableau Server (Cloud)</span>
                    </div>
                    <div className="flex justify-between p-2 bg-brand-charcoal/30 rounded">
                      <span className="text-brand-text-secondary">Authentication</span>
                      <span className="text-brand-text-primary">Trusted Tickets (SSO)</span>
                    </div>
                    <div className="flex justify-between p-2 bg-brand-charcoal/30 rounded">
                      <span className="text-brand-text-secondary">Data Refresh</span>
                      <span className="text-brand-text-primary">Daily (automated)</span>
                    </div>
                    <div className="flex justify-between p-2 bg-brand-charcoal/30 rounded">
                      <span className="text-brand-text-secondary">Access Control</span>
                      <span className="text-brand-text-primary">Role-based (HP staff & coaches only)</span>
                    </div>
                    <div className="flex justify-between p-2 bg-brand-charcoal/30 rounded">
                      <span className="text-brand-text-secondary">Data Sources</span>
                      <span className="text-brand-text-primary">Teamworks, Polar, Garmin, Shot Tracker</span>
                    </div>
                  </div>
                </div>

                <Alert className="border-orange-500/30 bg-orange-500/10">
                  <Award className="w-4 h-4 text-orange-400" />
                  <AlertDescription className="text-brand-text-primary">
                    <strong>Partnership Value:</strong> CTFS provides Tableau licensing and analytics expertise as an in-kind sponsorship benefit.
                    Enables world-class data visualization without additional software costs.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Use Cases for HP Team */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-lg">HP Team Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'Pre-Competition Analysis',
                description: 'Review athlete performance trends leading into major events. Identify who is peaking vs who needs load adjustment.',
                icon: Target,
                users: ['HP Director', 'National Coaches']
              },
              {
                title: 'Talent Identification',
                description: 'Compare NextGen athlete metrics against benchmarks. Identify emerging talent for National Pool consideration.',
                icon: TrendingUp,
                users: ['HP Director', 'Talent Scout']
              },
              {
                title: 'Training Program Effectiveness',
                description: 'Measure impact of training interventions. A/B test different coaching methodologies.',
                icon: LineChart,
                users: ['Coaches', 'Sport Scientists']
              },
              {
                title: 'Recovery & Readiness Monitoring',
                description: 'Track HRV, sleep, and training load to prevent overtraining and optimize performance windows.',
                icon: Heart,
                users: ['Coaches', 'Medical Staff']
              }
            ].map((useCase, idx) => (
              <div key={idx} className="p-4 bg-brand-charcoal/30 border border-brand-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <useCase.icon className="w-5 h-5 text-orange-400" />
                  <h4 className="font-semibold text-brand-text-primary">{useCase.title}</h4>
                </div>
                <p className="text-sm text-brand-text-secondary mb-3">{useCase.description}</p>
                <div className="flex flex-wrap gap-2">
                  {useCase.users.map((user, uidx) => (
                    <Badge key={uidx} variant="outline" className="text-xs">
                      {user}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Embedded Dashboard Examples */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-lg">Embedded Dashboard Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-blue-500/30 bg-blue-500/10">
            <Eye className="w-4 h-4 text-blue-400" />
            <AlertDescription className="text-brand-text-primary">
              <strong>Live Embedding:</strong> Tableau dashboards are embedded directly into The Button's Performance Center using Tableau's JavaScript API.
              Provides seamless, secure access without leaving the platform.
            </AlertDescription>
          </Alert>

          <div className="mt-4 p-4 bg-brand-charcoal/30 border border-brand-border rounded-lg text-center">
            <BarChart3 className="w-12 h-12 text-orange-400 mx-auto mb-3" />
            <p className="text-brand-text-secondary text-sm">
              Tableau dashboards load here with full interactivity
            </p>
            <p className="text-xs text-brand-text-secondary mt-2">
              (Demo: Connect to Tableau Server to view live data)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
