import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, TrendingUp, Users, 
  Eye, MousePointer, Globe, Key
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function GoogleAnalyticsIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const [gaConfig, setGaConfig] = useState({
    propertyId: '',
    measurementId: '',
    serviceAccountKey: ''
  });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Google Analytics ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    if (!gaConfig.propertyId) {
      toast({
        variant: "destructive",
        title: "Missing Credentials",
        description: "Please enter Google Analytics Property ID.",
      });
      return;
    }

    setConnectionStatus({ connected: false, loading: true });
    
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Google Analytics Connection",
        description: "Connection test coming soon. GA4 API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-green-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Google Analytics Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Google Analytics tracks website traffic, user behavior, and conversion metrics for The Button 
            and Curling Canada websites. This integration provides insights into user engagement, 
            page performance, and marketing campaign effectiveness.
          </p>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-brand-text-primary">Connection Status</span>
              </div>
              {connectionStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              ) : connectionStatus.connected ? (
                <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
              ) : (
                <Badge className="bg-gray-500/20 text-gray-400">Not Connected</Badge>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="propertyId" className="text-sm text-brand-text-secondary">
                  GA4 Property ID
                </Label>
                <Input
                  id="propertyId"
                  value={gaConfig.propertyId}
                  onChange={(e) => setGaConfig({...gaConfig, propertyId: e.target.value})}
                  placeholder="123456789"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Found in Google Analytics → Admin → Property Settings
                </p>
              </div>
              
              <div>
                <Label htmlFor="measurementId" className="text-sm text-brand-text-secondary">
                  Measurement ID
                </Label>
                <Input
                  id="measurementId"
                  value={gaConfig.measurementId}
                  onChange={(e) => setGaConfig({...gaConfig, measurementId: e.target.value})}
                  placeholder="G-XXXXXXXXXX"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  For frontend tracking
                </p>
              </div>

              <div>
                <Label htmlFor="serviceAccountKey" className="text-sm text-brand-text-secondary">
                  Service Account Key (JSON)
                </Label>
                <Input
                  id="serviceAccountKey"
                  type="password"
                  value={gaConfig.serviceAccountKey}
                  onChange={(e) => setGaConfig({...gaConfig, serviceAccountKey: e.target.value})}
                  placeholder="Paste service account JSON"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  From Google Cloud Console → Service Accounts
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

          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              <strong>Integration In Development:</strong> Google Analytics 4 API integration, 
              automated reporting, and dashboard embedding coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Analytics Features</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="traffic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="traffic">
                <Eye className="w-4 h-4 mr-2" />
                Traffic
              </TabsTrigger>
              <TabsTrigger value="behavior">
                <MousePointer className="w-4 h-4 mr-2" />
                Behavior
              </TabsTrigger>
              <TabsTrigger value="conversions">
                <TrendingUp className="w-4 h-4 mr-2" />
                Conversions
              </TabsTrigger>
              <TabsTrigger value="audiences">
                <Users className="w-4 h-4 mr-2" />
                Audiences
              </TabsTrigger>
            </TabsList>

            <TabsContent value="traffic" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Website Traffic Metrics</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Track visitors, page views, session duration, and traffic sources across all Curling Canada properties.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Total Users (30d)</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Avg. Session Duration</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('traffic')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Traffic Data
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">User Behavior Analysis</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Analyze how users navigate the site, which pages they visit, and where they drop off.
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Top Landing Pages</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Bounce Rate</span>
                    <span className="text-sm font-medium text-brand-text-primary">-%</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Exit Pages</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('behavior')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Behavior Data
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="conversions" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Conversion Tracking</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Monitor goal completions, e-commerce transactions, and campaign performance.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Goal Completions</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Conversion Rate</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-%</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('conversions')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Conversion Data
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="audiences" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Audience Insights</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Understand your audience demographics, interests, and device usage.
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Top Locations</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Device Breakdown</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">New vs. Returning</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('audiences')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Audience Data
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Integration Features */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Integration Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Globe className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Real-Time Tracking</h5>
                <p className="text-xs text-brand-text-secondary">
                  Monitor live website activity and user behavior in real-time
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Custom Reports</h5>
                <p className="text-xs text-brand-text-secondary">
                  Generate automated reports for stakeholders and executives
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Users className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Audience Segmentation</h5>
                <p className="text-xs text-brand-text-secondary">
                  Create and track custom audience segments for targeted campaigns
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <BarChart3 className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">DOMO Integration</h5>
                <p className="text-xs text-brand-text-secondary">
                  Export GA data to DOMO dashboards for unified analytics
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Integration Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Key className="w-5 h-5 text-brand-text-secondary mt-0.5" />
            <div>
              <h5 className="font-medium text-brand-text-primary mb-1">API Access</h5>
              <p className="text-sm text-brand-text-secondary mb-2">
                To access the Google Analytics API, you need:
              </p>
              <ol className="text-sm text-brand-text-secondary space-y-1 ml-4 list-decimal">
                <li>Enable Google Analytics API in Google Cloud Console</li>
                <li>Create a Service Account</li>
                <li>Download the Service Account JSON key</li>
                <li>Grant the service account access to your GA4 property</li>
              </ol>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-brand-text-secondary mt-0.5" />
            <div>
              <h5 className="font-medium text-brand-text-primary mb-1">Documentation</h5>
              <a 
                href="https://developers.google.com/analytics/devguides/reporting/data/v1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:underline flex items-center gap-1"
              >
                Google Analytics Data API Documentation
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}