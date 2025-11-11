
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Tv, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, BarChart3, Eye, 
  TrendingUp, Radio, Clock, Users, DollarSign
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function TSNIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `TSN ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    setConnectionStatus({ connected: false, loading: true });
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "TSN Integration",
        description: "Connection setup coming soon. TSN broadcast data integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-red-950/20 to-orange-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tv className="w-6 h-6 text-red-400" />
            TSN Broadcast Data Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            TSN is Curling Canada's primary broadcast partner. This integration pulls viewership data, 
            broadcast schedules, and performance metrics to report sponsor value and plan future broadcasts.
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
              <strong>Manual Data Entry:</strong> TSN may provide viewership data via reports rather than API. 
              The Button can store and visualize TSN metrics for sponsor reporting.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Broadcast Data */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Broadcast Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ratings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="ratings">
                <Eye className="w-4 h-4 mr-2" />
                Ratings
              </TabsTrigger>
              <TabsTrigger value="schedule">
                <Clock className="w-4 h-4 mr-2" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="reach">
                <Radio className="w-4 h-4 mr-2" />
                Reach
              </TabsTrigger>
              <TabsTrigger value="reports">
                <BarChart3 className="w-4 h-4 mr-2" />
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ratings" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3">Viewership Ratings</h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Average Minute Audience (AMA)</span>
                      <Badge className="bg-gray-500/20 text-gray-400">No Data</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Average number of viewers per broadcast minute
                    </p>
                    <div className="text-xs bg-brand-charcoal/50 p-2 rounded mb-2">
                      <div className="flex justify-between text-brand-text-secondary">
                        <span>Brier 2024:</span>
                        <span className="font-mono">-- viewers</span>
                      </div>
                      <div className="flex justify-between text-brand-text-secondary mt-1">
                        <span>Scotties 2024:</span>
                        <span className="font-mono">-- viewers</span>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleSync('ama')} disabled={isSyncing} className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Load AMA Data
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Peak Viewership</span>
                      <Badge className="bg-gray-500/20 text-gray-400">No Data</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Highest viewership moments (typically finals)
                    </p>
                    <div className="text-xs bg-brand-charcoal/50 p-2 rounded mb-2">
                      <div className="text-brand-text-secondary">
                        Peak data helps sponsors understand maximum exposure opportunities
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleSync('peak')} disabled={isSyncing} className="w-full">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Peak Data
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3">Broadcast Schedule</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Upcoming TSN broadcasts with sponsor visibility windows
                </p>

                <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-brand-text-primary">Scheduled Broadcasts</span>
                    <Badge className="bg-gray-500/20 text-gray-400">No Data</Badge>
                  </div>
                  <p className="text-xs text-brand-text-secondary mb-3">
                    Sync TSN broadcast schedule for sponsor activation planning
                  </p>
                  <Button size="sm" onClick={() => handleSync('schedule')} disabled={isSyncing} className="w-full">
                    <Clock className="w-4 h-4 mr-2" />
                    Load Broadcast Schedule
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reach" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3">Reach & Audience Demographics</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Understand your broadcast's audience reach and demographic breakdown.
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Total Audience Reach</span>
                      <Badge className="bg-gray-500/20 text-gray-400">No Data</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Cumulative number of unique individuals who viewed a broadcast.
                    </p>
                    <div className="text-xs bg-brand-charcoal/50 p-2 rounded mb-2">
                      <div className="flex justify-between text-brand-text-secondary">
                        <span>Total unique viewers:</span>
                        <span className="font-mono">-- individuals</span>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleSync('reach-audience')} disabled={isSyncing} className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      Load Reach Data
                    </Button>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Demographic Breakdown</span>
                      <Badge className="bg-gray-500/20 text-gray-400">No Data</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Age, gender, and geographic distribution of the viewership.
                    </p>
                    <div className="text-xs bg-brand-charcoal/50 p-2 rounded mb-2">
                      <div className="text-brand-text-secondary">
                        Valuable for targeting sponsors interested in specific audience segments.
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleSync('demographics')} disabled={isSyncing} className="w-full">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analyze Demographics
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3">Sponsor Value Reports</h4>
                
                <div className="p-3 bg-brand-card-bg rounded border border-brand-border mb-3">
                  <h5 className="text-sm font-medium text-brand-text-primary mb-2">Broadcast ROI Calculator</h5>
                  <p className="text-xs text-brand-text-secondary mb-2">
                    Calculate sponsor value based on:
                  </p>
                  <ul className="text-xs text-brand-text-secondary space-y-1 mb-3">
                    <li>• Total viewership hours</li>
                    <li>• Logo visibility time (in-arena + broadcast)</li>
                    <li>• Demographic alignment with sponsor target</li>
                    <li>• Industry CPM benchmarks</li>
                  </ul>
                  <Button size="sm" onClick={() => handleSync('roi-calc')} disabled={isSyncing} className="w-full">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Generate ROI Report
                  </Button>
                </div>

                <Alert className="border-blue-500/50 bg-blue-500/10">
                  <CheckCircle className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-200">
                    <strong>Sponsor Dashboards:</strong> TSN data automatically flows into sponsor-specific analytics dashboards, 
                    showing their broadcast exposure and audience reach.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Data Use Cases */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>How We Use TSN Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-brand-charcoal/30 rounded-lg">
              <h5 className="text-sm font-semibold text-brand-text-primary mb-2">Sponsor Proposals</h5>
              <p className="text-xs text-brand-text-secondary">
                Include viewership data in sponsorship decks to demonstrate audience reach and ROI potential
              </p>
            </div>
            <div className="p-4 bg-brand-charcoal/30 rounded-lg">
              <h5 className="text-sm font-semibold text-brand-text-primary mb-2">Performance Reports</h5>
              <p className="text-xs text-brand-text-secondary">
                Quarterly sponsor reports showing their broadcast exposure and viewership impact
              </p>
            </div>
            <div className="p-4 bg-brand-charcoal/30 rounded-lg">
              <h5 className="text-sm font-semibold text-brand-text-primary mb-2">Event Planning</h5>
              <p className="text-xs text-brand-text-secondary">
                Use historical ratings to optimize broadcast schedules and maximize sponsor visibility
              </p>
            </div>
            <div className="p-4 bg-brand-charcoal/30 rounded-lg">
              <h5 className="text-sm font-semibold text-brand-text-primary mb-2">Board Reporting</h5>
              <p className="text-xs text-brand-text-secondary">
                Executive dashboards showing broadcast performance and partnership value delivered
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
