import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, Play, Users, 
  Award, TrendingUp, BarChart3, Key, Film
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function DartfishIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const [dartfishConfig, setDartfishConfig] = useState({
    teamId: '',
    apiToken: ''
  });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Dartfish ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    if (!dartfishConfig.apiToken) {
      toast({
        variant: "destructive",
        title: "Missing Credentials",
        description: "Please enter Dartfish API Token.",
      });
      return;
    }

    setConnectionStatus({ connected: false, loading: true });
    
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Dartfish Connection",
        description: "Connection test coming soon. Dartfish API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-red-950/20 to-orange-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-6 h-6 text-red-400" />
            Dartfish Video Analysis Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-red-500/20 text-red-400">High Performance</Badge>
            <Badge variant="outline">Video Analytics</Badge>
          </div>
          
          <p className="text-brand-text-secondary">
            Dartfish is the industry-leading video analysis platform used by Curling Canada's High Performance 
            program. This integration syncs video sessions, coach feedback, and performance metrics from Dartfish 
            into The Button for unified athlete development tracking.
          </p>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-red-400" />
                <span className="font-medium text-brand-text-primary">Connection Status</span>
              </div>
              {connectionStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-red-400" />
              ) : connectionStatus.connected ? (
                <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
              ) : (
                <Badge className="bg-gray-500/20 text-gray-400">Not Connected</Badge>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="teamId" className="text-sm text-brand-text-secondary">
                  Dartfish Team ID
                </Label>
                <Input
                  id="teamId"
                  value={dartfishConfig.teamId}
                  onChange={(e) => setDartfishConfig({...dartfishConfig, teamId: e.target.value})}
                  placeholder="Team ID"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Found in Dartfish Team Settings
                </p>
              </div>
              
              <div>
                <Label htmlFor="apiToken" className="text-sm text-brand-text-secondary">
                  API Token
                </Label>
                <Input
                  id="apiToken"
                  type="password"
                  value={dartfishConfig.apiToken}
                  onChange={(e) => setDartfishConfig({...dartfishConfig, apiToken: e.target.value})}
                  placeholder="API Token"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Generated in Dartfish → Account → API Access
                </p>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={testConnection}
              disabled={connectionStatus.loading}
              className="w-full mt-3"
            >
              {connectionStatus.loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Testing Connection...</>
              ) : (
                <><RefreshCw className="w-4 h-4 mr-2" /> Test Connection</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Integration Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <Video className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sync">
            <Database className="w-4 h-4 mr-2" />
            Data Sync
          </TabsTrigger>
          <TabsTrigger value="athletes">
            <Users className="w-4 h-4 mr-2" />
            Athletes
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">What Data Flows from Dartfish</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Film className="w-5 h-5 text-red-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-brand-text-primary mb-1">Video Sessions</p>
                      <ul className="text-sm text-brand-text-secondary space-y-1">
                        <li>• Recorded practice and game footage</li>
                        <li>• Annotated video clips</li>
                        <li>• Slow-motion analysis</li>
                        <li>• Multi-angle comparisons</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-brand-text-primary mb-1">Performance Metrics</p>
                      <ul className="text-sm text-brand-text-secondary space-y-1">
                        <li>• Delivery mechanics analysis</li>
                        <li>• Shot accuracy measurements</li>
                        <li>• Sweeping technique scoring</li>
                        <li>• Consistency metrics</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-brand-text-primary mb-1">Coach Feedback</p>
                      <ul className="text-sm text-brand-text-secondary space-y-1">
                        <li>• Video annotations and comments</li>
                        <li>• Drill recommendations</li>
                        <li>• Improvement tracking over time</li>
                        <li>• Peer comparisons</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-brand-text-primary mb-1">Progress Reports</p>
                      <ul className="text-sm text-brand-text-secondary space-y-1">
                        <li>• Session summaries</li>
                        <li>• Skill development timelines</li>
                        <li>• Benchmark achievement tracking</li>
                        <li>• Pre/post training comparisons</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Integration Benefits for HP Program</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                  <Video className="w-8 h-8 text-red-400 mb-3" />
                  <h5 className="font-bold text-brand-text-primary mb-2">Centralized Video Library</h5>
                  <p className="text-sm text-brand-text-secondary">
                    Access all Dartfish videos directly in The Button alongside shot tracker and drill logs
                  </p>
                </div>

                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <BarChart3 className="w-8 h-8 text-blue-400 mb-3" />
                  <h5 className="font-bold text-brand-text-primary mb-2">Unified Performance View</h5>
                  <p className="text-sm text-brand-text-secondary">
                    Combine video analysis with Smart Broom data and shot logs for complete athlete picture
                  </p>
                </div>

                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <Users className="w-8 h-8 text-purple-400 mb-3" />
                  <h5 className="font-bold text-brand-text-primary mb-2">Coach Collaboration</h5>
                  <p className="text-sm text-brand-text-secondary">
                    Share video feedback between coaches and link to specific training recommendations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Sync Tab */}
        <TabsContent value="sync" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Sync Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <Button
                  onClick={() => handleSync('videos')}
                  disabled={isSyncing}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-start gap-3 w-full">
                    <Video className="w-5 h-5 text-red-400 mt-0.5" />
                    <div className="text-left flex-1">
                      <p className="font-medium text-brand-text-primary">Sync Video Library</p>
                      <p className="text-xs text-brand-text-secondary mt-1">
                        Import all athlete video sessions
                      </p>
                    </div>
                    {isSyncing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </div>
                </Button>

                <Button
                  onClick={() => handleSync('feedback')}
                  disabled={isSyncing}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-start gap-3 w-full">
                    <Users className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div className="text-left flex-1">
                      <p className="font-medium text-brand-text-primary">Sync Coach Feedback</p>
                      <p className="text-xs text-brand-text-secondary mt-1">
                        Import annotations and comments
                      </p>
                    </div>
                    {isSyncing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </div>
                </Button>

                <Button
                  onClick={() => handleSync('metrics')}
                  disabled={isSyncing}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-start gap-3 w-full">
                    <BarChart3 className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div className="text-left flex-1">
                      <p className="font-medium text-brand-text-primary">Sync Performance Metrics</p>
                      <p className="text-xs text-brand-text-secondary mt-1">
                        Import analyzed technique scores
                      </p>
                    </div>
                    {isSyncing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </div>
                </Button>

                <Button
                  onClick={() => handleSync('athletes')}
                  disabled={isSyncing}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-start gap-3 w-full">
                    <Award className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div className="text-left flex-1">
                      <p className="font-medium text-brand-text-primary">Sync Athlete Profiles</p>
                      <p className="text-xs text-brand-text-secondary mt-1">
                        Match Dartfish users to Button profiles
                      </p>
                    </div>
                    {isSyncing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </div>
                </Button>
              </div>

              <div className="p-3 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-text-secondary">Last Sync:</span>
                  <span className="text-brand-text-primary">Never</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-brand-text-secondary">Sync Frequency:</span>
                  <Badge variant="outline">Every 12 hours</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sync Statistics */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Sync Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-brand-text-primary">0</p>
                  <p className="text-sm text-brand-text-secondary">Videos Synced</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-brand-text-primary">0</p>
                  <p className="text-sm text-brand-text-secondary">Athletes Tracked</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-brand-text-primary">0</p>
                  <p className="text-sm text-brand-text-secondary">Coach Comments</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-brand-text-primary">0</p>
                  <p className="text-sm text-brand-text-secondary">Sync Errors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Athletes Tab */}
        <TabsContent value="athletes" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Athlete Video Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-br from-red-950/30 to-orange-950/30 rounded-lg border border-red-500/30">
                  <h5 className="font-bold text-brand-text-primary mb-3">National Team Athletes</h5>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-brand-text-primary">0</p>
                      <p className="text-xs text-brand-text-secondary">Athletes</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-brand-text-primary">0</p>
                      <p className="text-xs text-brand-text-secondary">Sessions</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-brand-text-primary">0</p>
                      <p className="text-xs text-brand-text-secondary">Hours</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                    <p className="text-sm font-medium text-brand-text-primary mb-2">NextGen Program</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-brand-text-primary">0</p>
                      <p className="text-sm text-brand-text-secondary">athletes</p>
                    </div>
                  </div>

                  <div className="p-3 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                    <p className="text-sm font-medium text-brand-text-primary mb-2">Provincial Teams</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-brand-text-primary">0</p>
                      <p className="text-sm text-brand-text-secondary">athletes</p>
                    </div>
                  </div>
                </div>

                <Alert className="border-blue-500/50 bg-blue-500/10">
                  <Play className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-brand-text-secondary">
                    <strong>Button Integration:</strong> Dartfish videos linked directly to athlete profiles, 
                    shot tracker logs, and drill completions for comprehensive performance review.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Use Cases */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">HP Use Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Video className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-brand-text-primary mb-1">Post-Game Video Review</h5>
                      <p className="text-sm text-brand-text-secondary">
                        Coaches upload game footage to Dartfish, analyze key shots, and share annotated clips 
                        with athletes in The Button
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-brand-text-primary mb-1">Technique Improvement Tracking</h5>
                      <p className="text-sm text-brand-text-secondary">
                        Compare delivery mechanics over multiple sessions to track technique refinement and consistency
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-brand-text-primary mb-1">Peer Learning</h5>
                      <p className="text-sm text-brand-text-secondary">
                        Share anonymized technique examples across the program for peer learning and benchmarking
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-brand-text-primary mb-1">Drill Validation</h5>
                      <p className="text-sm text-brand-text-secondary">
                        Athletes record drill execution in Dartfish; coaches verify and award XP based on video review
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Video Analytics & Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-red-950/30 to-orange-950/30 rounded-lg border border-red-500/30">
                  <Film className="w-8 h-8 text-red-400 mb-3" />
                  <p className="text-sm text-brand-text-secondary mb-1">Total Videos</p>
                  <p className="text-3xl font-bold text-brand-text-primary">0</p>
                  <p className="text-xs text-brand-text-secondary mt-1">across all athletes</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-blue-950/30 to-indigo-950/30 rounded-lg border border-blue-500/30">
                  <Play className="w-8 h-8 text-blue-400 mb-3" />
                  <p className="text-sm text-brand-text-secondary mb-1">Analysis Hours</p>
                  <p className="text-3xl font-bold text-brand-text-primary">0</p>
                  <p className="text-xs text-brand-text-secondary mt-1">coach review time</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-950/30 to-pink-950/30 rounded-lg border border-purple-500/30">
                  <TrendingUp className="w-8 h-8 text-purple-400 mb-3" />
                  <p className="text-sm text-brand-text-secondary mb-1">Avg Improvement</p>
                  <p className="text-3xl font-bold text-brand-text-primary">--</p>
                  <p className="text-xs text-brand-text-secondary mt-1">technique score gain</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
                <h5 className="font-medium text-brand-text-primary mb-3">Most Analyzed Skills</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-brand-charcoal/30 rounded">
                    <span className="text-sm text-brand-text-secondary">Delivery Mechanics</span>
                    <span className="font-bold text-brand-text-primary">0 sessions</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-brand-charcoal/30 rounded">
                    <span className="text-sm text-brand-text-secondary">Sweeping Technique</span>
                    <span className="font-bold text-brand-text-primary">0 sessions</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-brand-charcoal/30 rounded">
                    <span className="text-sm text-brand-text-secondary">Skip Strategy</span>
                    <span className="font-bold text-brand-text-primary">0 sessions</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Technical Details */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Integration Architecture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
              <h5 className="font-medium text-brand-text-primary mb-3">Cross-Platform Performance View</h5>
              <div className="flex items-center gap-3 text-sm flex-wrap">
                <Badge className="bg-red-500/20 text-red-400">Dartfish Video</Badge>
                <span className="text-brand-text-secondary">+</span>
                <Badge className="bg-green-500/20 text-green-400">Smart Broom Data</Badge>
                <span className="text-brand-text-secondary">+</span>
                <Badge className="bg-blue-500/20 text-blue-400">Shot Tracker Logs</Badge>
                <span className="text-brand-text-secondary">=</span>
                <Badge className="bg-purple-500/20 text-purple-400">Complete Athlete Profile</Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                <h5 className="text-sm font-medium text-brand-text-primary mb-2">Data Mapping</h5>
                <ul className="space-y-1 text-xs">
                  <li className="flex justify-between">
                    <span className="text-brand-text-secondary">Dartfish Session ID</span>
                    <span className="text-brand-text-primary">→ VideoRef.id</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-brand-text-secondary">Athlete Email</span>
                    <span className="text-brand-text-primary">→ User.email</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-brand-text-secondary">Coach Feedback</span>
                    <span className="text-brand-text-primary">→ CoachFeedback</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-brand-text-secondary">Performance Score</span>
                    <span className="text-brand-text-primary">→ Benchmark.result</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                <h5 className="text-sm font-medium text-brand-text-primary mb-2">API Capabilities</h5>
                <ul className="space-y-1 text-xs text-brand-text-secondary">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-400 mt-0.5" />
                    <span>Video library access and metadata</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-400 mt-0.5" />
                    <span>Coach annotations export</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-400 mt-0.5" />
                    <span>Performance metrics extraction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-400 mt-0.5" />
                    <span>Athlete progress reports</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentation Links */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" asChild>
          <a href="https://www.dartfish.com" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Dartfish Website
          </a>
        </Button>
        <Button variant="outline" className="flex-1" asChild>
          <a href="https://www.dartfish.com/products/dartfish-team-pro" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Team Pro Features
          </a>
        </Button>
      </div>
    </div>
  );
}