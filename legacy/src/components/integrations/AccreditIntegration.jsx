import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, Shield, Camera, 
  Lock, UserCheck, Clock
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function AccreditIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Accredit ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    setConnectionStatus({ connected: false, loading: true });
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Accredit Integration",
        description: "Connection setup coming soon. Accredit API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-teal-950/20 to-cyan-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-teal-400" />
            Accredit Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Accredit manages digital credentials and access badges for volunteers, staff, and officials at Curling Canada events. 
            This integration syncs credential status and access control data.
          </p>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-400" />
                <span className="font-medium text-brand-text-primary">Connection Status</span>
              </div>
              {connectionStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
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
              <strong>Integration In Development:</strong> Accredit API integration is currently being built. 
              Credential verification and access control sync coming soon.
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
          <Tabs defaultValue="credentials" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
              <TabsTrigger value="credentials">
                <CreditCard className="w-4 h-4 mr-2" />
                Credentials
              </TabsTrigger>
              <TabsTrigger value="access">
                <Lock className="w-4 h-4 mr-2" />
                Access Control
              </TabsTrigger>
              <TabsTrigger value="photos">
                <Camera className="w-4 h-4 mr-2" />
                Photos
              </TabsTrigger>
            </TabsList>

            {/* Credentials Tab */}
            <TabsContent value="credentials" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-teal-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Badge Issuance</div>
                    <div className="text-sm text-brand-text-secondary">
                      Track which volunteers and staff have been issued credentials
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Credential Status</div>
                    <div className="text-sm text-brand-text-secondary">
                      Sync status: issued, active, revoked, or expired
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Expiry Tracking</div>
                    <div className="text-sm text-brand-text-secondary">
                      Monitor credential expiry dates and trigger renewal workflows
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Credential')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Credential Data</>
                )}
              </Button>
            </TabsContent>

            {/* Access Control Tab */}
            <TabsContent value="access" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Access Zones</div>
                    <div className="text-sm text-brand-text-secondary">
                      Define and sync access zones for different credential levels
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Security Levels</div>
                    <div className="text-sm text-brand-text-secondary">
                      Track security clearance levels (e.g., VIP, Media, Volunteer)
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Access Logs</div>
                    <div className="text-sm text-brand-text-secondary">
                      Import access logs for security auditing and attendance verification
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Access Control')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Access Data</>
                )}
              </Button>
            </TabsContent>

            {/* Photos Tab */}
            <TabsContent value="photos" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Camera className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Badge Photos</div>
                    <div className="text-sm text-brand-text-secondary">
                      Sync volunteer and staff badge photos for credentials
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Photo Verification</div>
                    <div className="text-sm text-brand-text-secondary">
                      Track photo approval status and compliance
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Profile Integration</div>
                    <div className="text-sm text-brand-text-secondary">
                      Display badge photos on volunteer profiles in The Button
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Photo')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Photo Data</>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Use Cases */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Key Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-green-500/30">
              <h4 className="font-medium text-green-400 mb-2">Event Credentialing</h4>
              <p className="text-sm text-brand-text-secondary">
                Automatically issue and track credentials for volunteers at major championships (Brier, Scotties, etc.)
              </p>
            </div>
            <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-blue-500/30">
              <h4 className="font-medium text-blue-400 mb-2">Compliance Verification</h4>
              <p className="text-sm text-brand-text-secondary">
                Verify volunteers have completed required training before granting event access
              </p>
            </div>
            <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-purple-500/30">
              <h4 className="font-medium text-purple-400 mb-2">Multi-Event Tracking</h4>
              <p className="text-sm text-brand-text-secondary">
                Track veteran volunteers across multiple events and award recognition badges
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}