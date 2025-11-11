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
  ExternalLink, Database, Calendar, Users, 
  Clock, BarChart3, Key, Webhook
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function ZoomIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const [zoomConfig, setZoomConfig] = useState({
    accountId: '',
    clientId: '',
    clientSecret: ''
  });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Zoom ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    if (!zoomConfig.accountId || !zoomConfig.clientId || !zoomConfig.clientSecret) {
      toast({
        variant: "destructive",
        title: "Missing Credentials",
        description: "Please enter all Zoom credentials.",
      });
      return;
    }

    setConnectionStatus({ connected: false, loading: true });
    
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Zoom Connection",
        description: "Connection test coming soon. Zoom API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-6 h-6 text-blue-400" />
            Zoom Video Communications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Zoom powers virtual meetings, webinars, coaching sessions, and online events for Curling Canada. 
            This integration schedules meetings, tracks attendance, and manages webinar registrations.
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
                <Label htmlFor="accountId" className="text-sm text-brand-text-secondary">
                  Zoom Account ID
                </Label>
                <Input
                  id="accountId"
                  value={zoomConfig.accountId}
                  onChange={(e) => setZoomConfig({...zoomConfig, accountId: e.target.value})}
                  placeholder="Account ID"
                  className="mt-1 font-mono text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="clientId" className="text-sm text-brand-text-secondary">
                  Client ID
                </Label>
                <Input
                  id="clientId"
                  value={zoomConfig.clientId}
                  onChange={(e) => setZoomConfig({...zoomConfig, clientId: e.target.value})}
                  placeholder="Client ID"
                  className="mt-1 font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="clientSecret" className="text-sm text-brand-text-secondary">
                  Client Secret
                </Label>
                <Input
                  id="clientSecret"
                  type="password"
                  value={zoomConfig.clientSecret}
                  onChange={(e) => setZoomConfig({...zoomConfig, clientSecret: e.target.value})}
                  placeholder="Client Secret"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Found in Zoom App Marketplace → Build App → Server-to-Server OAuth
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
              <strong>Integration In Development:</strong> Zoom meeting scheduling, webinar management, 
              and attendance tracking features coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Zoom Features</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="meetings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="meetings">
                <Video className="w-4 h-4 mr-2" />
                Meetings
              </TabsTrigger>
              <TabsTrigger value="webinars">
                <Users className="w-4 h-4 mr-2" />
                Webinars
              </TabsTrigger>
              <TabsTrigger value="recordings">
                <Clock className="w-4 h-4 mr-2" />
                Recordings
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="meetings" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Scheduled Meetings</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Create and manage Zoom meetings for board sessions, staff meetings, and coach consultations.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Upcoming Meetings</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Meetings This Month</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('meetings')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Meetings
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="webinars" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Webinars & Events</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Manage webinars for coaching education, club training, and public events.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Active Webinars</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Total Registrations</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('webinars')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Webinars
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="recordings" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Cloud Recordings</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Access and share meeting recordings for training, compliance, and knowledge sharing.
                </p>
                <Button 
                  onClick={() => handleSync('recordings')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Recordings
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Usage Analytics</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Meeting attendance, participant engagement, and usage statistics.
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Avg Attendance Rate</span>
                    <span className="text-sm font-medium text-brand-text-primary">-%</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Total Meeting Minutes</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Unique Participants</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('analytics')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Generate Report
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
              <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Calendar Integration</h5>
                <p className="text-xs text-brand-text-secondary">
                  Sync Zoom meetings with staff calendars and event schedules
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Users className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Attendance Tracking</h5>
                <p className="text-xs text-brand-text-secondary">
                  Automatically log attendance and participation for compliance
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Clock className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Recording Management</h5>
                <p className="text-xs text-brand-text-secondary">
                  Store and share recordings in the Knowledge Centre
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Webhook className="w-5 h-5 text-indigo-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Event Notifications</h5>
                <p className="text-xs text-brand-text-secondary">
                  Real-time notifications for meeting starts, registrations, and completions
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
              <h5 className="font-medium text-brand-text-primary mb-1">Create Server-to-Server OAuth App</h5>
              <p className="text-sm text-brand-text-secondary">
                Go to Zoom App Marketplace → Build App → Server-to-Server OAuth
              </p>
              <a 
                href="https://marketplace.zoom.us/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:underline flex items-center gap-1 mt-1"
              >
                Open Zoom Marketplace
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-brand-text-secondary mt-0.5" />
            <div>
              <h5 className="font-medium text-brand-text-primary mb-1">Required Scopes</h5>
              <p className="text-sm text-brand-text-secondary mb-2">
                Enable these OAuth scopes for full functionality:
              </p>
              <div className="text-xs text-brand-text-secondary space-y-1 font-mono bg-brand-charcoal/50 p-3 rounded">
                <p>• meeting:read:admin (View meetings)</p>
                <p>• meeting:write:admin (Create/update meetings)</p>
                <p>• webinar:read:admin (View webinars)</p>
                <p>• webinar:write:admin (Create/update webinars)</p>
                <p>• recording:read:admin (Access recordings)</p>
                <p>• report:read:admin (View analytics)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}