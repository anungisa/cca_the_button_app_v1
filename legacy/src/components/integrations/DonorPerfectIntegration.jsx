import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, TrendingUp, Users, 
  DollarSign, BarChart3, Mail, Key, Webhook
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function DonorPerfectIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const [donorPerfectConfig, setDonorPerfectConfig] = useState({
    apiKey: '',
    username: ''
  });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `DonorPerfect ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    if (!donorPerfectConfig.apiKey) {
      toast({
        variant: "destructive",
        title: "Missing Credentials",
        description: "Please enter DonorPerfect API Key.",
      });
      return;
    }

    setConnectionStatus({ connected: false, loading: true });
    
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "DonorPerfect Connection",
        description: "Connection test coming soon. DonorPerfect API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-pink-950/20 to-rose-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-400" />
            DonorPerfect Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-pink-500/20 text-pink-400">Fundraising</Badge>
            <Badge variant="outline">Donor Management</Badge>
          </div>
          
          <p className="text-brand-text-secondary">
            DonorPerfect serves as Curling Canada's comprehensive donor management system, working alongside 
            GiveCloud for online fundraising. This integration syncs donor records, gift history, campaigns, 
            and tax receipts to provide unified constituent intelligence.
          </p>

          <Alert className="border-blue-500/50 bg-blue-500/10">
            <ExternalLink className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-brand-text-secondary">
              <strong>Note:</strong> DonorPerfect integrates with GiveCloud forms. Data flows: GiveCloud → DonorPerfect → The Button
            </AlertDescription>
          </Alert>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-pink-400" />
                <span className="font-medium text-brand-text-primary">Connection Status</span>
              </div>
              {connectionStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-pink-400" />
              ) : connectionStatus.connected ? (
                <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
              ) : (
                <Badge className="bg-gray-500/20 text-gray-400">Not Connected</Badge>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="username" className="text-sm text-brand-text-secondary">
                  DonorPerfect Username
                </Label>
                <Input
                  id="username"
                  value={donorPerfectConfig.username}
                  onChange={(e) => setDonorPerfectConfig({...donorPerfectConfig, username: e.target.value})}
                  placeholder="Username"
                  className="mt-1 font-mono text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="apiKey" className="text-sm text-brand-text-secondary">
                  API Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={donorPerfectConfig.apiKey}
                  onChange={(e) => setDonorPerfectConfig({...donorPerfectConfig, apiKey: e.target.value})}
                  placeholder="API Key"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Found in DonorPerfect → System → API Settings
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
            <Heart className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sync">
            <Database className="w-4 h-4 mr-2" />
            Data Sync
          </TabsTrigger>
          <TabsTrigger value="donors">
            <Users className="w-4 h-4 mr-2" />
            Donors
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
              <CardTitle className="text-lg">What Data Flows from DonorPerfect</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-pink-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-brand-text-primary mb-1">Donor Records</p>
                      <ul className="text-sm text-brand-text-secondary space-y-1">
                        <li>• Donor profiles and contact info</li>
                        <li>• Lifetime giving totals</li>
                        <li>• Giving capacity ratings</li>
                        <li>• Communication preferences</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-brand-text-primary mb-1">Gift History</p>
                      <ul className="text-sm text-brand-text-secondary space-y-1">
                        <li>• Individual donation records</li>
                        <li>• Recurring giving schedules</li>
                        <li>• Memorial and tribute gifts</li>
                        <li>• In-kind donations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-brand-text-primary mb-1">Campaign Data</p>
                      <ul className="text-sm text-brand-text-secondary space-y-1">
                        <li>• Campaign performance metrics</li>
                        <li>• Appeal effectiveness</li>
                        <li>• Segmentation data</li>
                        <li>• Multi-year pledge tracking</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-brand-text-primary mb-1">Engagement History</p>
                      <ul className="text-sm text-brand-text-secondary space-y-1">
                        <li>• Communication history</li>
                        <li>• Event attendance records</li>
                        <li>• Volunteer involvement</li>
                        <li>• Solicitation results</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GiveCloud Connection */}
          <Card className="bg-gradient-to-br from-pink-950/20 to-purple-950/20 border-pink-500/30">
            <CardHeader>
              <CardTitle className="text-lg">DonorPerfect + GiveCloud Partnership</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-brand-text-secondary">
                DonorPerfect and GiveCloud work together to provide end-to-end fundraising capabilities:
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-brand-text-primary mb-1">GiveCloud Forms</p>
                    <p className="text-sm text-brand-text-secondary">
                      Online donation forms with payment processing
                    </p>
                  </div>
                  <span className="text-brand-text-secondary">→</span>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-brand-text-primary mb-1">DonorPerfect CRM</p>
                    <p className="text-sm text-brand-text-secondary">
                      Donor records, tax receipts, reporting
                    </p>
                  </div>
                  <span className="text-brand-text-secondary">→</span>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-brand-text-primary mb-1">The Button</p>
                    <p className="text-sm text-brand-text-secondary">
                      Unified donor intelligence & XP rewards
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                  <h5 className="font-medium text-brand-text-primary mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    GiveCloud Handles
                  </h5>
                  <ul className="text-sm text-brand-text-secondary space-y-1">
                    <li>• Online donation forms</li>
                    <li>• Payment processing</li>
                    <li>• Peer-to-peer campaigns</li>
                    <li>• Event registrations with fees</li>
                  </ul>
                </div>

                <div className="p-3 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                  <h5 className="font-medium text-brand-text-primary mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    DonorPerfect Handles
                  </h5>
                  <ul className="text-sm text-brand-text-secondary space-y-1">
                    <li>• CRA tax receipt generation</li>
                    <li>• Donor relationship management</li>
                    <li>• Multi-year pledge tracking</li>
                    <li>• Legacy giving programs</li>
                  </ul>
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
                  onClick={() => handleSync('donors')}
                  disabled={isSyncing}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-start gap-3 w-full">
                    <Users className="w-5 h-5 text-pink-400 mt-0.5" />
                    <div className="text-left flex-1">
                      <p className="font-medium text-brand-text-primary">Sync Donor Records</p>
                      <p className="text-xs text-brand-text-secondary mt-1">
                        Import all active donors with contact info
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
                  onClick={() => handleSync('gifts')}
                  disabled={isSyncing}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-start gap-3 w-full">
                    <DollarSign className="w-5 h-5 text-green-400 mt-0.5" />
                    <div className="text-left flex-1">
                      <p className="font-medium text-brand-text-primary">Sync Gift History</p>
                      <p className="text-xs text-brand-text-secondary mt-1">
                        Import donation transactions (last 12 months)
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
                  onClick={() => handleSync('campaigns')}
                  disabled={isSyncing}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-start gap-3 w-full">
                    <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div className="text-left flex-1">
                      <p className="font-medium text-brand-text-primary">Sync Campaigns</p>
                      <p className="text-xs text-brand-text-secondary mt-1">
                        Import campaign goals and performance
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
                  onClick={() => handleSync('pledges')}
                  disabled={isSyncing}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-start gap-3 w-full">
                    <BarChart3 className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div className="text-left flex-1">
                      <p className="font-medium text-brand-text-primary">Sync Pledge Schedules</p>
                      <p className="text-xs text-brand-text-secondary mt-1">
                        Import multi-year pledges and payment plans
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
                  <Badge variant="outline">Daily at 2 AM</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Donors Tab */}
        <TabsContent value="donors" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Donor Segmentation & Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-br from-green-950/30 to-emerald-950/30 rounded-lg border border-green-500/30">
                  <h5 className="font-bold text-brand-text-primary mb-3">Major Gift Prospects</h5>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-brand-text-primary">0</p>
                      <p className="text-xs text-brand-text-secondary">Capacity $10K+</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-brand-text-primary">0</p>
                      <p className="text-xs text-brand-text-secondary">LYBUNT</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-brand-text-primary">0</p>
                      <p className="text-xs text-brand-text-secondary">SYBUNT</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                    <p className="text-sm font-medium text-brand-text-primary mb-2">Recurring Donors</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-brand-text-primary">0</p>
                      <p className="text-sm text-brand-text-secondary">active</p>
                    </div>
                  </div>

                  <div className="p-3 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                    <p className="text-sm font-medium text-brand-text-primary mb-2">Lapsed Donors</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-amber-400">0</p>
                      <p className="text-sm text-brand-text-secondary">to re-engage</p>
                    </div>
                  </div>
                </div>

                <Alert className="border-purple-500/50 bg-purple-500/10">
                  <Users className="h-4 w-4 text-purple-400" />
                  <AlertDescription className="text-brand-text-secondary">
                    <strong>Button Integration:</strong> Donors automatically matched to Button users by email. 
                    Award bonus XP for donations to encourage engagement.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Fundraising Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-green-950/30 to-emerald-950/30 rounded-lg border border-green-500/30">
                  <DollarSign className="w-8 h-8 text-green-400 mb-3" />
                  <p className="text-sm text-brand-text-secondary mb-1">YTD Revenue</p>
                  <p className="text-3xl font-bold text-brand-text-primary">$0</p>
                  <p className="text-xs text-brand-text-secondary mt-1">vs. $0 last year</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-blue-950/30 to-indigo-950/30 rounded-lg border border-blue-500/30">
                  <Users className="w-8 h-8 text-blue-400 mb-3" />
                  <p className="text-sm text-brand-text-secondary mb-1">Active Donors</p>
                  <p className="text-3xl font-bold text-brand-text-primary">0</p>
                  <p className="text-xs text-brand-text-secondary mt-1">in last 12 months</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-950/30 to-pink-950/30 rounded-lg border border-purple-500/30">
                  <TrendingUp className="w-8 h-8 text-purple-400 mb-3" />
                  <p className="text-sm text-brand-text-secondary mb-1">Retention Rate</p>
                  <p className="text-3xl font-bold text-brand-text-primary">--</p>
                  <p className="text-xs text-brand-text-secondary mt-1">year-over-year</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
                <h5 className="font-medium text-brand-text-primary mb-3">Top Campaigns (Current Year)</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-brand-charcoal/30 rounded">
                    <span className="text-sm text-brand-text-secondary">Future of Curling</span>
                    <span className="font-bold text-brand-text-primary">$0</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-brand-charcoal/30 rounded">
                    <span className="text-sm text-brand-text-secondary">Brier 2025</span>
                    <span className="font-bold text-brand-text-primary">$0</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-brand-charcoal/30 rounded">
                    <span className="text-sm text-brand-text-secondary">General Fund</span>
                    <span className="font-bold text-brand-text-primary">$0</span>
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
              <h5 className="font-medium text-brand-text-primary mb-3">Data Flow</h5>
              <div className="flex items-center gap-3 text-sm flex-wrap">
                <Badge className="bg-pink-500/20 text-pink-400">Donor Makes Gift</Badge>
                <span className="text-brand-text-secondary">→</span>
                <Badge className="bg-blue-500/20 text-blue-400">GiveCloud Processes</Badge>
                <span className="text-brand-text-secondary">→</span>
                <Badge className="bg-purple-500/20 text-purple-400">DonorPerfect Receipts</Badge>
                <span className="text-brand-text-secondary">→</span>
                <Badge className="bg-green-500/20 text-green-400">Button Awards XP</Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                <h5 className="text-sm font-medium text-brand-text-primary mb-2">API Capabilities</h5>
                <ul className="space-y-1 text-xs text-brand-text-secondary">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-400 mt-0.5" />
                    <span>REST API for donor CRUD operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-400 mt-0.5" />
                    <span>Gift entry and modification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-400 mt-0.5" />
                    <span>Custom field queries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-400 mt-0.5" />
                    <span>Reporting and analytics exports</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                <h5 className="text-sm font-medium text-brand-text-primary mb-2">Data Mapping</h5>
                <ul className="space-y-1 text-xs">
                  <li className="flex justify-between">
                    <span className="text-brand-text-secondary">DonorPerfect Donor ID</span>
                    <span className="text-brand-text-primary">→ User.donor_id</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-brand-text-secondary">Gift Amount</span>
                    <span className="text-brand-text-primary">→ Donation.amount</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-brand-text-secondary">Campaign Code</span>
                    <span className="text-brand-text-primary">→ Donation.campaign</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-brand-text-secondary">Receipt Number</span>
                    <span className="text-brand-text-primary">→ Donation.receipt_id</span>
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
          <a href="https://www.donorperfect.com" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            DonorPerfect Website
          </a>
        </Button>
        <Button variant="outline" className="flex-1" asChild>
          <a href="https://community.donorperfect.com/docs/api" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            API Documentation
          </a>
        </Button>
      </div>
    </div>
  );
}