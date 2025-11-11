
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Heart, Activity, TrendingUp, Moon, Zap, CheckCircle,
  AlertTriangle, RefreshCw, BarChart3, Clock, Target,
  Battery, Thermometer, Wind, User, Users // Added Users icon
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function PolarGarminIntegration() {
  const { toast } = useToast();
  const [polarConnected] = useState(true);
  const [garminConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    toast({
      title: "Syncing Wearable Data",
      description: "Fetching heart rate, recovery, and training data..."
    });

    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Sync Complete",
        description: "All athlete biometric data updated successfully."
      });
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-red-950/20 to-orange-950/20 border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-400" />
            Polar & Garmin Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-red-500/30 bg-red-500/10">
            <Heart className="w-4 h-4 text-red-400" />
            <AlertDescription className="text-brand-text-primary">
              Polar and Garmin wearables provide continuous heart rate, recovery, sleep, and training load monitoring for NextGen and National Team athletes.
              Critical for optimizing training intensity and preventing overtraining.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {/* Connection Status */}
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-red-400" />
                  </div>
                  <span className="text-brand-text-primary font-medium">Polar Flow API</span>
                </div>
                <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-brand-text-primary font-medium">Garmin Connect</span>
                </div>
                <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
              </div>
            </div>

            <Button 
              onClick={handleSync} 
              disabled={isSyncing}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Syncing Biometric Data...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync All Wearable Data
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-brand-card-bg">
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="data">Data Flow</TabsTrigger>
          <TabsTrigger value="insights">Recovery Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-brand-text-secondary">Resting HR</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">54 bpm</p>
                <p className="text-xs text-green-400 mt-1">-2 from baseline</p>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-brand-text-secondary">Sleep Quality</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">87%</p>
                <p className="text-xs text-brand-text-secondary mt-1">7h 34m avg</p>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-brand-text-secondary">HRV Status</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">Good</p>
                <p className="text-xs text-green-400 mt-1">Balanced</p>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Battery className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-brand-text-secondary">Recovery Score</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">82</p>
                <p className="text-xs text-brand-text-secondary mt-1">Ready to train</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Monitored Biometrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  {
                    category: 'Heart Rate Metrics',
                    metrics: [
                      'Resting Heart Rate (RHR)',
                      'Max Heart Rate',
                      'Heart Rate Variability (HRV)',
                      'Training Heart Rate Zones',
                      'Recovery Heart Rate'
                    ],
                    icon: Heart,
                    color: 'red'
                  },
                  {
                    category: 'Sleep & Recovery',
                    metrics: [
                      'Sleep Duration',
                      'Sleep Stages (REM, Deep, Light)',
                      'Sleep Score',
                      'Restlessness',
                      'Nightly Recharge (Polar)'
                    ],
                    icon: Moon,
                    color: 'purple'
                  },
                  {
                    category: 'Training Load',
                    metrics: [
                      'Training Load Balance',
                      'Cardio Load',
                      'Muscle Load (Polar)',
                      'Training Stress Score (TSS)',
                      'Acute vs Chronic Load Ratio'
                    ],
                    icon: Activity,
                    color: 'blue'
                  },
                  {
                    category: 'Readiness Indicators',
                    metrics: [
                      'Body Battery (Garmin)',
                      'Recovery Time',
                      'VO2 Max Estimate',
                      'Stress Level',
                      'Performance Condition'
                    ],
                    icon: Battery,
                    color: 'green'
                  }
                ].map((group, idx) => (
                  <div key={idx} className="p-4 bg-brand-charcoal/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-2 rounded-lg bg-${group.color}-500/10`}>
                        <group.icon className={`w-4 h-4 text-${group.color}-400`} />
                      </div>
                      <h4 className="font-semibold text-brand-text-primary">{group.category}</h4>
                    </div>
                    <ul className="space-y-1">
                      {group.metrics.map((metric, midx) => (
                        <li key={midx} className="text-sm text-brand-text-secondary flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Wearable Data Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Data Flow Diagram */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium text-brand-text-primary">Polar Devices</span>
                    </div>
                    <span className="text-brand-text-secondary">→</span>
                    <div className="flex items-center gap-2 flex-1 p-3 bg-brand-charcoal/50 border border-brand-border rounded-lg">
                      <span className="text-sm font-medium text-brand-text-primary">Polar Flow Cloud</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <Activity className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-brand-text-primary">Garmin Devices</span>
                    </div>
                    <span className="text-brand-text-secondary">→</span>
                    <div className="flex items-center gap-2 flex-1 p-3 bg-brand-charcoal/50 border border-brand-border rounded-lg">
                      <span className="text-sm font-medium text-brand-text-primary">Garmin Connect</span>
                    </div>
                  </div>

                  <div className="text-center py-2">
                    <span className="text-brand-text-secondary text-sm">↓ API Integration (Real-time webhooks)</span>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-medium text-brand-text-primary">Teamworks AMS</span>
                    <Badge variant="outline" className="ml-auto">Primary Hub</Badge>
                  </div>

                  <div className="text-center py-2">
                    <span className="text-brand-text-secondary text-sm">↓ Bi-directional sync</span>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-brand-text-primary">The Button (Supabase)</span>
                    <Badge className="bg-green-500/20 text-green-400 ml-auto">Live</Badge>
                  </div>
                </div>

                <Alert className="border-blue-500/30 bg-blue-500/10">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <AlertDescription className="text-brand-text-primary">
                    <strong>Integration Flow:</strong> Athletes wear Polar/Garmin devices 24/7. Data syncs to their respective clouds, 
                    flows into Teamworks for coach review, then syncs to The Button where it's combined with curling-specific performance data.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Entity Mappings */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Data Storage in The Button</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { 
                    wearable: 'Daily Heart Rate Summary', 
                    entity: 'HighPerformanceLog', 
                    fields: 'RHR, Max HR, HRV, Training Zones'
                  },
                  { 
                    wearable: 'Sleep Analysis', 
                    entity: 'HighPerformanceLog', 
                    fields: 'Sleep duration, sleep score, REM/deep sleep'
                  },
                  { 
                    wearable: 'Training Session Data', 
                    entity: 'DrillLog / HighPerformanceLog', 
                    fields: 'Duration, avg HR, calories, intensity'
                  },
                  { 
                    wearable: 'Recovery Metrics', 
                    entity: 'PerformanceBenchmark', 
                    fields: 'Recovery status, training readiness, body battery'
                  },
                  { 
                    wearable: 'Stress & HRV Trends', 
                    entity: 'PerformanceBenchmark', 
                    fields: 'Stress level, HRV trends, ANS balance'
                  },
                  { 
                    wearable: 'Activity Tracking', 
                    entity: 'HighPerformanceLog', 
                    fields: 'Steps, active time, calorie burn'
                  }
                ].map((mapping, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-brand-charcoal/20 rounded text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-brand-text-primary mb-1">{mapping.wearable}</p>
                      <p className="text-xs text-brand-text-secondary">{mapping.fields}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-purple-500/20 text-purple-300">{mapping.entity}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Recovery & Readiness Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sample Recovery Data */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <h4 className="font-semibold text-brand-text-primary">Optimal Training Day</h4>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">Ready</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-text-secondary">Recovery Score</span>
                      <span className="text-brand-text-primary font-medium">88/100</span>
                    </div>
                    <Progress value={88} className="h-2" />
                    <p className="text-xs text-brand-text-secondary mt-2">
                      HRV is above baseline. Sleep quality was excellent (8h 15m). 
                      Ready for high-intensity training.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <h4 className="font-semibold text-brand-text-primary">Moderate Fatigue</h4>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400">Caution</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-text-secondary">Recovery Score</span>
                      <span className="text-brand-text-primary font-medium">62/100</span>
                    </div>
                    <Progress value={62} className="h-2" />
                    <p className="text-xs text-brand-text-secondary mt-2">
                      HRV below baseline (-12ms). Recommend light training or active recovery.
                      Monitor for 24-48 hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* AI-Powered Correlations */}
              <Card className="bg-brand-charcoal/30 border-brand-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    Performance Correlations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <h5 className="font-semibold text-brand-text-primary mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      Sleep Quality vs Draw Accuracy
                    </h5>
                    <p className="text-sm text-brand-text-secondary mb-2">
                      AI detected a strong correlation (r=0.78) between sleep quality and draw shot accuracy.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-cyan-400">
                      <CheckCircle className="w-3 h-3" />
                      Athletes with 7.5+ hours sleep show 12% better draw weight control
                    </div>
                  </div>

                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <h5 className="font-semibold text-brand-text-primary mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-purple-400" />
                      HRV vs Game Day Performance
                    </h5>
                    <p className="text-sm text-brand-text-secondary mb-2">
                      Athletes with HRV above their baseline show significantly better execution rates.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-purple-400">
                      <CheckCircle className="w-3 h-3" />
                      HRV +10ms from baseline = 8% accuracy improvement
                    </div>
                  </div>

                  <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <h5 className="font-semibold text-brand-text-primary mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-400" />
                      Training Load vs Injury Risk
                    </h5>
                    <p className="text-sm text-brand-text-secondary mb-2">
                      Rapid spikes in training load correlate with increased injury/illness risk.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-orange-400">
                      <AlertTriangle className="w-3 h-3" />
                      Acute:Chronic ratio &gt;1.5 triggers coach alerts
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Use Cases */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-lg">HP Integration Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'Pre-Training Readiness Check',
                description: 'Coaches review recovery scores before ice sessions. If HRV is low or sleep was poor, adjust training intensity or switch to skill work.',
                icon: Target,
                color: 'green'
              },
              {
                title: 'Competition Peaking',
                description: 'Monitor training load 2-3 weeks before major events. Ensure athletes taper properly using HRV and sleep trends.',
                icon: TrendingUp,
                color: 'blue'
              },
              {
                title: 'Injury Prevention',
                description: 'Track acute:chronic load ratios. Alert coaches when athletes exceed safe training load thresholds.',
                icon: AlertTriangle,
                color: 'orange'
              },
              {
                title: 'Personalized Programming',
                description: 'Use individual HRV baselines and recovery patterns to customize training schedules per athlete.',
                icon: User,
                color: 'purple'
              }
            ].map((useCase, idx) => (
              <div key={idx} className={`p-4 bg-${useCase.color}-500/10 border border-${useCase.color}-500/30 rounded-lg`}>
                <div className="flex items-center gap-2 mb-2">
                  <useCase.icon className={`w-5 h-5 text-${useCase.color}-400`} />
                  <h4 className="font-semibold text-brand-text-primary">{useCase.title}</h4>
                </div>
                <p className="text-sm text-brand-text-secondary">{useCase.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technical Specs */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-lg">Technical Integration Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-brand-text-primary mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                Polar Flow API
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-text-secondary">Authentication</span>
                  <span className="text-brand-text-primary">OAuth 2.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-secondary">API Version</span>
                  <span className="text-brand-text-primary">v3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-secondary">Sync Method</span>
                  <span className="text-brand-text-primary">Webhooks + 30-min polling</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-secondary">Data Retention</span>
                  <span className="text-brand-text-primary">90 days rolling</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-secondary">Rate Limits</span>
                  <span className="text-brand-text-primary">10,000/day</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-brand-text-primary mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Garmin Connect API
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-text-secondary">Authentication</span>
                  <span className="text-brand-text-primary">OAuth 1.0a</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-secondary">API Version</span>
                  <span className="text-brand-text-primary">v2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-secondary">Sync Method</span>
                  <span className="text-brand-text-primary">Push Notifications + Hourly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-secondary">Data Retention</span>
                  <span className="text-brand-text-primary">Unlimited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-secondary">Rate Limits</span>
                  <span className="text-brand-text-primary">15,000/day</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
