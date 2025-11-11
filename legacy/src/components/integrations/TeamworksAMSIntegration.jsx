import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users, Calendar, FileText, Activity, CheckCircle,
  AlertTriangle, RefreshCw, Download, MessageSquare,
  BarChart3, TrendingUp, Shield, Clock, Target,
  Dumbbell, Heart, Brain, Utensils
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function TeamworksAMSIntegration() {
  const { toast } = useToast();
  const [isConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync] = useState('2024-01-15T14:30:00Z');

  const handleSync = async () => {
    setIsSyncing(true);
    toast({
      title: "Syncing Teamworks AMS",
      description: "Fetching athlete data, schedules, and performance metrics..."
    });

    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Sync Complete",
        description: "All athlete management data updated successfully."
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-950/20 to-blue-950/20 border-indigo-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Teamworks AMS Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-indigo-500/30 bg-indigo-500/10">
            <Users className="w-4 h-4 text-indigo-400" />
            <AlertDescription className="text-brand-text-primary">
              Teamworks Athlete Management System (AMS) is the central hub for managing NextGen and National Team athletes.
              Provides comprehensive athlete profiles, training schedules, wellness monitoring, nutrition tracking, and team communications.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-brand-text-primary font-medium">Connection Status</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-brand-text-primary">Last Sync</span>
              </div>
              <span className="text-brand-text-secondary text-sm">
                {new Date(lastSync).toLocaleString()}
              </span>
            </div>

            <Button 
              onClick={handleSync} 
              disabled={isSyncing}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Now
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-brand-card-bg">
          <TabsTrigger value="modules">AMS Modules</TabsTrigger>
          <TabsTrigger value="data">Data Flow</TabsTrigger>
          <TabsTrigger value="usage">Usage Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Integrated Teamworks Modules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  icon: Users,
                  name: 'Athlete Profiles',
                  description: 'Comprehensive athlete information, emergency contacts, medical history',
                  status: 'active',
                  color: 'indigo'
                },
                {
                  icon: Calendar,
                  name: 'Team Calendar',
                  description: 'Training schedules, competitions, travel itineraries',
                  status: 'active',
                  color: 'blue'
                },
                {
                  icon: Dumbbell,
                  name: 'Strength & Conditioning',
                  description: 'Workout programs, exercise libraries, load monitoring',
                  status: 'active',
                  color: 'purple'
                },
                {
                  icon: Heart,
                  name: 'Wellness & Recovery',
                  description: 'Daily wellness questionnaires, sleep tracking, injury reports',
                  status: 'active',
                  color: 'pink'
                },
                {
                  icon: Utensils,
                  name: 'Nutrition Tracking',
                  description: 'Meal plans, hydration logs, supplement tracking',
                  status: 'active',
                  color: 'green'
                },
                {
                  icon: Brain,
                  name: 'Mental Performance',
                  description: 'Mental skills training, goal setting, mindfulness exercises',
                  status: 'active',
                  color: 'cyan'
                },
                {
                  icon: MessageSquare,
                  name: 'Team Communications',
                  description: 'Messaging, announcements, document sharing',
                  status: 'active',
                  color: 'orange'
                },
                {
                  icon: FileText,
                  name: 'Forms & Surveys',
                  description: 'Custom forms, medical questionnaires, feedback collection',
                  status: 'active',
                  color: 'yellow'
                },
                {
                  icon: BarChart3,
                  name: 'Performance Analytics',
                  description: 'Training load analytics, progress tracking, trend analysis',
                  status: 'active',
                  color: 'red'
                }
              ].map((module, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
                  <div className={`p-2 rounded-lg bg-${module.color}-500/10 flex-shrink-0`}>
                    <module.icon className={`w-5 h-5 text-${module.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-brand-text-primary">{module.name}</h4>
                      <Badge className="bg-green-500/20 text-green-400 text-xs">
                        {module.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-brand-text-secondary">{module.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Data Synchronization Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="border-blue-500/30 bg-blue-500/10">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <AlertDescription className="text-brand-text-primary">
                    <strong>Bi-directional Sync:</strong> Data flows both ways between Teamworks and The Button to ensure HP athletes have a unified experience.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-brand-text-primary mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-400" />
                      Teamworks → The Button
                    </h4>
                    <div className="grid md:grid-cols-2 gap-2 ml-6">
                      {[
                        'Athlete profiles & rosters',
                        'Training schedules & events',
                        'Wellness check-in data',
                        'Workout completion status',
                        'Nutrition logs',
                        'Mental performance scores',
                        'Team messages & announcements',
                        'Performance test results'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-brand-text-secondary">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-brand-border">
                    <h4 className="font-semibold text-brand-text-primary mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-400" />
                      The Button → Teamworks
                    </h4>
                    <div className="grid md:grid-cols-2 gap-2 ml-6">
                      {[
                        'On-ice shot tracking data (ShotTrackerLog)',
                        'Smart Broom session metrics',
                        'Dartfish video analysis sessions',
                        'Competition results & statistics',
                        'Coach feedback & evaluations',
                        'Achievement milestones',
                        'Curling-specific drill scores',
                        'Ice-specific performance data'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-brand-text-secondary">
                          <CheckCircle className="w-3 h-3 text-blue-400" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Alert className="border-purple-500/30 bg-purple-500/10 mt-4">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <AlertDescription className="text-brand-text-primary">
                    <strong>Unified Athlete Record:</strong> Combining Teamworks' multi-sport capabilities with curling-specific performance data creates a complete athlete development picture.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-brand-text-secondary mb-1">Active Athletes</p>
                    <p className="text-3xl font-bold text-brand-text-primary">47</p>
                  </div>
                  <Users className="w-8 h-8 text-indigo-400" />
                </div>
                <p className="text-xs text-brand-text-secondary mt-2">
                  National Team + NextGen program
                </p>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-brand-text-secondary mb-1">Wellness Logs (7d)</p>
                    <p className="text-3xl font-bold text-brand-text-primary">329</p>
                  </div>
                  <Activity className="w-8 h-8 text-pink-400" />
                </div>
                <p className="text-xs text-green-400 mt-2">
                  98% completion rate
                </p>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-brand-text-secondary mb-1">Workouts Logged</p>
                    <p className="text-3xl font-bold text-brand-text-primary">1,247</p>
                  </div>
                  <Dumbbell className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-xs text-brand-text-secondary mt-2">
                  Last 30 days
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Sync History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { time: '2 minutes ago', type: 'Wellness Check-ins', count: '47 records', status: 'success' },
                  { time: '1 hour ago', type: 'Training Sessions', count: '12 workouts', status: 'success' },
                  { time: '3 hours ago', type: 'Team Calendar', count: '8 events', status: 'success' },
                  { time: '6 hours ago', type: 'Athlete Messages', count: '23 messages', status: 'success' },
                  { time: 'Yesterday', type: 'Performance Tests', count: '5 assessments', status: 'success' }
                ].map((sync, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-brand-charcoal/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-brand-text-primary">{sync.type}</p>
                        <p className="text-xs text-brand-text-secondary">{sync.count}</p>
                      </div>
                    </div>
                    <span className="text-xs text-brand-text-secondary">{sync.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Integration Details */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-lg">Technical Integration Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-brand-text-primary mb-2">Authentication</h4>
              <p className="text-sm text-brand-text-secondary">OAuth 2.0 with API tokens</p>
            </div>
            <div>
              <h4 className="font-semibold text-brand-text-primary mb-2">Sync Frequency</h4>
              <p className="text-sm text-brand-text-secondary">Real-time webhooks + 15-min polling</p>
            </div>
            <div>
              <h4 className="font-semibold text-brand-text-primary mb-2">API Endpoint</h4>
              <p className="text-sm text-brand-text-secondary font-mono">api.teamworks.com/v1</p>
            </div>
            <div>
              <h4 className="font-semibold text-brand-text-primary mb-2">Rate Limits</h4>
              <p className="text-sm text-brand-text-secondary">5,000 requests/hour</p>
            </div>
          </div>

          <Alert className="border-yellow-500/30 bg-yellow-500/10">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <AlertDescription className="text-brand-text-primary">
              <strong>Data Privacy:</strong> All athlete health and wellness data synced from Teamworks is encrypted and access-controlled per Safe Sport policies.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Entity Mappings */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-lg">Entity Mappings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-brand-text-secondary mb-3">How Teamworks data maps to The Button entities:</p>
            {[
              { teamworks: 'Athletes', button: 'User (athlete)', description: 'Core athlete profiles' },
              { teamworks: 'Teams', button: 'Team / NationalTeam', description: 'Team rosters and compositions' },
              { teamworks: 'Calendar Events', button: 'Event', description: 'Training sessions and competitions' },
              { teamworks: 'Wellness Logs', button: 'HighPerformanceLog', description: 'Daily wellness check-ins' },
              { teamworks: 'Workouts', button: 'DrillLog', description: 'Strength & conditioning sessions' },
              { teamworks: 'Performance Tests', button: 'PerformanceBenchmark', description: 'Physical testing results' },
              { teamworks: 'Messages', button: 'UserMessage', description: 'Team communications' },
              { teamworks: 'Documents', button: 'HRDocument', description: 'Training plans and resources' }
            ].map((mapping, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 bg-brand-charcoal/20 rounded text-sm">
                <Badge variant="outline" className="min-w-[140px]">{mapping.teamworks}</Badge>
                <span className="text-brand-text-secondary">→</span>
                <Badge className="bg-indigo-500/20 text-indigo-300 min-w-[160px]">{mapping.button}</Badge>
                <span className="text-brand-text-secondary flex-1">{mapping.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Use Cases */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-lg">Key Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'Unified Athlete View',
                description: 'Coaches see both Teamworks wellness data and curling-specific performance (shot tracking, Smart Broom) in one dashboard.',
                icon: Target
              },
              {
                title: 'Load Management',
                description: 'Combine off-ice training load from Teamworks with on-ice session intensity for holistic workload monitoring.',
                icon: Activity
              },
              {
                title: 'Recovery Insights',
                description: 'Correlate wellness scores with on-ice performance to identify fatigue patterns and optimize training.',
                icon: Heart
              },
              {
                title: 'Team Communication',
                description: 'Centralized messaging for NextGen and National Teams integrates with The Button notifications.',
                icon: MessageSquare
              }
            ].map((useCase, idx) => (
              <div key={idx} className="p-4 bg-brand-charcoal/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <useCase.icon className="w-5 h-5 text-indigo-400" />
                  <h4 className="font-semibold text-brand-text-primary">{useCase.title}</h4>
                </div>
                <p className="text-sm text-brand-text-secondary">{useCase.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}