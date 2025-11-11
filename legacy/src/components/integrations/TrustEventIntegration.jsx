import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, Calendar, ClipboardList, 
  UserCheck, MapPin, Clock, Bell
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function TrustEventIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `TrustEvent ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    setConnectionStatus({ connected: false, loading: true });
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "TrustEvent Integration",
        description: "Connection setup coming soon. TrustEvent API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-orange-950/20 to-red-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-400" />
            TrustEvent Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            TrustEvent is Curling Canada's volunteer management system for major events. 
            This integration syncs volunteer data, shift assignments, and event participation records.
          </p>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-400" />
                <span className="font-medium text-brand-text-primary">Connection Status</span>
              </div>
              {connectionStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
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
              <strong>Integration In Development:</strong> TrustEvent API integration is currently being built. 
              Webhook support and real-time volunteer sync coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Data Sync Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="volunteers" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="volunteers">
                <Users className="w-4 h-4 mr-2" />
                Volunteers
              </TabsTrigger>
              <TabsTrigger value="events">
                <Calendar className="w-4 h-4 mr-2" />
                Events
              </TabsTrigger>
              <TabsTrigger value="shifts">
                <Clock className="w-4 h-4 mr-2" />
                Shifts
              </TabsTrigger>
              <TabsTrigger value="compliance">
                <ClipboardList className="w-4 h-4 mr-2" />
                Compliance
              </TabsTrigger>
            </TabsList>

            {/* Volunteers Tab */}
            <TabsContent value="volunteers" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-orange-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Volunteer Roster</div>
                    <div className="text-sm text-brand-text-secondary">
                      Sync volunteer profiles to Volunteer entity - names, emails, contact info
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Application Status</div>
                    <div className="text-sm text-brand-text-secondary">
                      Track volunteer applications and approval status
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Regional Assignments</div>
                    <div className="text-sm text-brand-text-secondary">
                      Link volunteers to their MA regions and events
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Volunteer')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Volunteer Data</>
                )}
              </Button>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Event Profiles</div>
                    <div className="text-sm text-brand-text-secondary">
                      Sync event details, dates, and volunteer requirements
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ClipboardList className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Role Definitions</div>
                    <div className="text-sm text-brand-text-secondary">
                      Import volunteer roles and responsibilities for each event
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Volunteer Assignments</div>
                    <div className="text-sm text-brand-text-secondary">
                      Track which volunteers are assigned to which events
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Event')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Event Data</>
                )}
              </Button>
            </TabsContent>

            {/* Shifts Tab */}
            <TabsContent value="shifts" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Shift Schedules</div>
                    <div className="text-sm text-brand-text-secondary">
                      Import volunteer shift times and durations
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Check-in/Check-out</div>
                    <div className="text-sm text-brand-text-secondary">
                      Track volunteer attendance and actual hours worked
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">No-Show Tracking</div>
                    <div className="text-sm text-brand-text-secondary">
                      Monitor no-shows and automatically create incidents
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Shift')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Shift Data</>
                )}
              </Button>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <ClipboardList className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Training Records</div>
                    <div className="text-sm text-brand-text-secondary">
                      Import volunteer training and certification status
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Background Checks</div>
                    <div className="text-sm text-brand-text-secondary">
                      Track background check status and expiry dates
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Policy Signatures</div>
                    <div className="text-sm text-brand-text-secondary">
                      Verify volunteers have signed required policies
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Compliance')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Compliance Data</>
                )}
              </Button>
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
            <div className="p-4 bg-green-500/10 rounded-lg">
              <h5 className="text-xs font-semibold text-green-400 mb-1 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Unified Volunteer Data
              </h5>
              <p className="text-xs text-brand-text-secondary">
                Centralize volunteer records from TrustEvent into The Button for easy access across all staff
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg">
              <h5 className="text-xs font-semibold text-blue-400 mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Event Coordination
              </h5>
              <p className="text-xs text-brand-text-secondary">
                Link volunteer shifts to events in The Button for complete event planning visibility
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg">
              <h5 className="text-xs font-semibold text-purple-400 mb-1 flex items-center gap-2">
                <Database className="w-4 h-4" />
                XP & Recognition
              </h5>
              <p className="text-xs text-brand-text-secondary">
                Automatically award XP to volunteers based on their hours worked and shift completion
              </p>
            </div>
            <div className="p-4 bg-amber-500/10 rounded-lg">
              <h5 className="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Automated Workflows
              </h5>
              <p className="text-xs text-brand-text-secondary">
                Trigger notifications and incident creation for no-shows and compliance issues
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Technical Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Integration Method:</span>
              <span className="text-brand-text-primary font-medium">REST API + Webhooks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Authentication:</span>
              <span className="text-brand-text-primary font-medium">API Key</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Sync Frequency:</span>
              <span className="text-brand-text-primary font-medium">Real-time (webhooks) + Hourly batch</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Target Entity:</span>
              <span className="text-brand-text-primary font-medium">Volunteer</span>
            </div>
          </div>

          <Button variant="outline" onClick={() => window.open('https://trustevent.com', '_blank')} className="w-full mt-4">
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit TrustEvent
          </Button>
        </CardContent>
      </Card>

      {/* Webhook Configuration */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Webhook Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="p-3 bg-brand-charcoal/50 rounded border border-brand-border">
              <div className="font-medium text-brand-text-primary mb-1">volunteer.registered</div>
              <div className="text-xs text-brand-text-secondary">Triggered when a new volunteer signs up</div>
            </div>
            <div className="p-3 bg-brand-charcoal/50 rounded border border-brand-border">
              <div className="font-medium text-brand-text-primary mb-1">shift.assigned</div>
              <div className="text-xs text-brand-text-secondary">Triggered when a volunteer is assigned to a shift</div>
            </div>
            <div className="p-3 bg-brand-charcoal/50 rounded border border-brand-border">
              <div className="font-medium text-brand-text-primary mb-1">shift.completed</div>
              <div className="text-xs text-brand-text-secondary">Triggered when a shift is marked as completed</div>
            </div>
            <div className="p-3 bg-brand-charcoal/50 rounded border border-brand-border">
              <div className="font-medium text-brand-text-primary mb-1">volunteer.no_show</div>
              <div className="text-xs text-brand-text-secondary">Triggered when a volunteer doesn't show up for a shift</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}