import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, Calendar, Clipboard, 
  TrendingUp, BarChart3, MessageSquare, FileText
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function TeamworksIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Teamworks ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    setConnectionStatus({ connected: false, loading: true });
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Teamworks Integration",
        description: "Connection setup coming soon. Teamworks API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Teamworks Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Teamworks is the athlete management platform used by Curling Canada's high performance programs. 
            This integration syncs athlete data, training schedules, performance metrics, and team communications.
          </p>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                <span className="font-medium text-brand-text-primary">Connection Status</span>
              </div>
              {connectionStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              ) : connectionStatus.connected ? (
                <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
              ) : (
                <Badge className="bg-gray-500/20 text-gray-400">Not Connected</Badge>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={testConnection}
              disabled={connectionStatus.loading}
              className="w-full"
            >
              {connectionStatus.loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Testing Connection...</>
              ) : (
                <><RefreshCw className="w-4 h-4 mr-2" /> Test Connection</>
              )}
            </Button>
          </div>

          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              <strong>Integration In Development:</strong> Teamworks API integration is currently being built. 
              Athlete data sync, calendar integration, and performance tracking coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>High Performance Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="athletes" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="athletes">
                <Users className="w-4 h-4 mr-2" />
                Athletes
              </TabsTrigger>
              <TabsTrigger value="schedule">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="performance">
                <TrendingUp className="w-4 h-4 mr-2" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="communications">
                <MessageSquare className="w-4 h-4 mr-2" />
                Communications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="athletes" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Athlete Profiles
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">National Team Rosters</div>
                      <div>Sync athlete profiles for all national teams</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">NextGen Athletes</div>
                      <div>Track development pathway athletes</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Medical & Wellness</div>
                      <div>Injury reports, wellness scores, and recovery status</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Athlete')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Athletes</>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  Training & Events Calendar
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Training Sessions</div>
                      <div>On-ice and off-ice training schedules</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Competition Schedule</div>
                      <div>Upcoming tournaments and qualification events</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Team Meetings</div>
                      <div>Sync team meetings and video analysis sessions</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Schedule')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Schedule</>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  Performance Metrics
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Training Logs</div>
                      <div>Daily training load and volume tracking</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Physical Testing</div>
                      <div>Fitness assessments and benchmark results</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Wellness Scores</div>
                      <div>Daily readiness, sleep, and recovery data</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Performance')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Performance Data</>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="communications" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  Team Communications
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Team Messages</div>
                      <div>Sync announcements and team communications</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Coach Feedback</div>
                      <div>Performance feedback and coaching notes</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Document Sharing</div>
                      <div>Training plans, playbooks, and resources</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Communication')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Communications</>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Integration Benefits */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Integration Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-500/10 rounded-lg">
              <Users className="w-5 h-5 text-indigo-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Unified Athlete Profiles</h4>
              <p className="text-sm text-brand-text-secondary">
                Combine Teamworks data with Button performance tracking for complete athlete view
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Centralized Calendar</h4>
              <p className="text-sm text-brand-text-secondary">
                Display Teamworks schedule alongside Button events in one calendar
              </p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Performance Analytics</h4>
              <p className="text-sm text-brand-text-secondary">
                Combine Smart Broom and Shot Tracker data with Teamworks metrics
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">HP Dashboards</h4>
              <p className="text-sm text-brand-text-secondary">
                Executive dashboards with Teamworks data synced to DOMO
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Link */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => window.open('https://www.teamworks.com', '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Teamworks
        </Button>
      </div>
    </div>
  );
}