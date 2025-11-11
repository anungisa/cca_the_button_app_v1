import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, BarChart3, Users, 
  TrendingUp, Eye, DollarSign, Radio
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function VividataIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Vividata ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    setConnectionStatus({ connected: false, loading: true });
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Vividata Integration",
        description: "Connection setup coming soon. Vividata audience data integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-400" />
            Vividata Audience Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Vividata provides Canadian audience measurement and consumer insights for curling viewership. 
            This data helps sponsors understand reach, demographics, and ROI for their curling partnerships.
          </p>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-brand-text-primary">Connection Status</span>
              </div>
              {connectionStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
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

          <Alert className="border-blue-500/50 bg-blue-500/10">
            <Eye className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-200">
              <strong>Subscription Required:</strong> Vividata access requires an active subscription. 
              Contact Vividata for API credentials and data licensing.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Audience Data */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Audience Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="demographics" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="demographics">
                <Users className="w-4 h-4 mr-2" />
                Demographics
              </TabsTrigger>
              <TabsTrigger value="viewership">
                <Eye className="w-4 h-4 mr-2" />
                Viewership
              </TabsTrigger>
              <TabsTrigger value="reach">
                <Radio className="w-4 h-4 mr-2" />
                Reach
              </TabsTrigger>
              <TabsTrigger value="roi">
                <DollarSign className="w-4 h-4 mr-2" />
                ROI Metrics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="demographics" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3">Curling Audience Demographics</h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Age Distribution</h5>
                    <div className="text-xs text-brand-text-secondary space-y-1">
                      <div className="flex justify-between">
                        <span>18-34:</span>
                        <span className="font-mono">--% </span>
                      </div>
                      <div className="flex justify-between">
                        <span>35-54:</span>
                        <span className="font-mono">--% </span>
                      </div>
                      <div className="flex justify-between">
                        <span>55+:</span>
                        <span className="font-mono">--% </span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3" onClick={() => handleSync('age-data')} disabled={isSyncing}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Load Latest Data
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Household Income</h5>
                    <div className="text-xs text-brand-text-secondary space-y-1">
                      <div className="flex justify-between">
                        <span>&lt;$50K:</span>
                        <span className="font-mono">--% </span>
                      </div>
                      <div className="flex justify-between">
                        <span>$50K-$100K:</span>
                        <span className="font-mono">--% </span>
                      </div>
                      <div className="flex justify-between">
                        <span>$100K+:</span>
                        <span className="font-mono">--% </span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3" onClick={() => handleSync('income-data')} disabled={isSyncing}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Load Latest Data
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Gender Split</h5>
                    <div className="text-xs text-brand-text-secondary space-y-1">
                      <div className="flex justify-between">
                        <span>Male:</span>
                        <span className="font-mono">--% </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Female:</span>
                        <span className="font-mono">--% </span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3" onClick={() => handleSync('gender-data')} disabled={isSyncing}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Load Latest Data
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Geographic Distribution</h5>
                    <div className="text-xs text-brand-text-secondary space-y-1">
                      <div className="flex justify-between">
                        <span>Atlantic:</span>
                        <span className="font-mono">--% </span>
                      </div>
                      <div className="flex justify-between">
                        <span>ON/QC:</span>
                        <span className="font-mono">--% </span>
                      </div>
                      <div className="flex justify-between">
                        <span>West:</span>
                        <span className="font-mono">--% </span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3" onClick={() => handleSync('geo-data')} disabled={isSyncing}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Load Latest Data
                    </Button>
                  </div>
                </div>
              </div>

              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  Demographic data refreshes quarterly. Use this data in sponsor proposals to demonstrate audience alignment.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="viewership" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3">Viewership Metrics</h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">TV Ratings</h5>
                    <div className="text-xs text-brand-text-secondary space-y-1 mb-3">
                      <div className="flex justify-between">
                        <span>Average Viewers (Brier):</span>
                        <span className="font-mono">-- million</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Viewers (Scotties):</span>
                        <span className="font-mono">-- million</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Peak Viewership:</span>
                        <span className="font-mono">-- million</span>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleSync('tv-ratings')} disabled={isSyncing} className="w-full">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Load TV Data
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Digital Engagement</h5>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Cross-platform measurement including streaming, social media, and digital properties
                    </p>
                    <Button size="sm" variant="outline" onClick={() => handleSync('digital')} disabled={isSyncing} className="w-full">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Digital Metrics
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="roi" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3">Sponsorship ROI Metrics</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Use Vividata audience data to calculate and report sponsor ROI
                </p>

                <div className="p-3 bg-brand-card-bg rounded border border-brand-border mb-3">
                  <h5 className="text-sm font-medium text-brand-text-primary mb-2">Calculated Metrics</h5>
                  <ul className="text-xs text-brand-text-secondary space-y-1">
                    <li>• Cost per thousand impressions (CPM)</li>
                    <li>• Reach vs. investment ratio</li>
                    <li>• Demographic alignment score</li>
                    <li>• Brand exposure value</li>
                    <li>• Comparative industry benchmarks</li>
                  </ul>
                </div>

                <div className="p-3 bg-green-500/10 rounded border border-green-500/30">
                  <h5 className="text-sm font-medium text-brand-text-primary mb-1">Sponsor Reporting</h5>
                  <p className="text-xs text-brand-text-secondary">
                    Automatically generate sponsor performance reports with Vividata audience insights, 
                    showing reach, engagement, and demographic targeting effectiveness.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Alert className="border-yellow-500/50 bg-yellow-500/10">
        <AlertTriangle className="h-4 w-4 text-yellow-400" />
        <AlertDescription className="text-yellow-200">
          <strong>Integration In Development:</strong> Vividata API integration is currently being built. 
          Audience measurement and sponsor ROI reporting coming soon.
        </AlertDescription>
      </Alert>
    </div>
  );
}