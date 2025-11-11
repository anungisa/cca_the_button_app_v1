
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, Mail, Phone, 
  BarChart3, Target, TrendingUp, Key, Building2 // Added Building2 icon
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function HubSpotIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const [hubspotConfig, setHubspotConfig] = useState({
    apiKey: '',
    portalId: ''
  });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `HubSpot ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    if (!hubspotConfig.apiKey) {
      toast({
        variant: "destructive",
        title: "Missing Credentials",
        description: "Please enter HubSpot API Key.",
      });
      return;
    }

    setConnectionStatus({ connected: false, loading: true });
    
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "HubSpot Connection",
        description: "Connection test coming soon. HubSpot API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-orange-950/20 to-red-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-orange-400" />
            HubSpot CRM Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-orange-500/20 text-orange-400">Primary CRM</Badge>
            <Badge className="bg-green-500/20 text-green-400">Strategic Platform</Badge>
          </div>
          
          <Alert className="border-purple-500/50 bg-purple-500/10">
            <Target className="h-4 w-4 text-purple-400" />
            <AlertDescription className="text-brand-text-secondary">
              <strong>Strategic Decision:</strong> HubSpot has been selected as Curling Canada's unified CRM platform, 
              replacing consideration of Dynamics 365. This decision aligns with BDO's recommendation to consolidate 
              KIT, event data, and donor management into a single CRM system.
            </AlertDescription>
          </Alert>

          <p className="text-brand-text-secondary">
            HubSpot serves as the customer relationship management (CRM) platform for Curling Canada, 
            managing contacts, sponsors, clubs, and marketing campaigns. This integration syncs 
            contact data, tracks engagement, and automates marketing workflows.
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

            <div className="space-y-3">
              <div>
                <Label htmlFor="apiKey" className="text-sm text-brand-text-secondary">
                  HubSpot API Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={hubspotConfig.apiKey}
                  onChange={(e) => setHubspotConfig({...hubspotConfig, apiKey: e.target.value})}
                  placeholder="API Key"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Found in HubSpot → Settings → Integrations → API Key
                </p>
              </div>
              
              <div>
                <Label htmlFor="portalId" className="text-sm text-brand-text-secondary">
                  Portal ID (Hub ID)
                </Label>
                <Input
                  id="portalId"
                  value={hubspotConfig.portalId}
                  onChange={(e) => setHubspotConfig({...hubspotConfig, portalId: e.target.value})}
                  placeholder="12345678"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Found in your HubSpot account settings
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
              <strong>Integration In Development:</strong> HubSpot CRM sync, contact management, 
              and marketing automation coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>HubSpot Features</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="contacts" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="contacts">
                <Users className="w-4 h-4 mr-2" />
                Contacts
              </TabsTrigger>
              <TabsTrigger value="companies">
                <Target className="w-4 h-4 mr-2" />
                Companies
              </TabsTrigger>
              <TabsTrigger value="deals">
                <TrendingUp className="w-4 h-4 mr-2" />
                Deals
              </TabsTrigger>
              <TabsTrigger value="campaigns">
                <Mail className="w-4 h-4 mr-2" />
                Campaigns
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contacts" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Contact Management</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Sync contacts between HubSpot and The Button for unified member management.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Total Contacts</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">New This Month</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('contacts')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Contacts
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="companies" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Company Profiles</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Manage sponsor companies, clubs, and partner organizations in HubSpot.
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Total Companies</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Active Sponsors</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Club Partners</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('companies')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Companies
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="deals" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Deal Pipeline</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Track sponsorship deals, partnership agreements, and revenue opportunities.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Open Deals</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Total Value</p>
                    <p className="text-2xl font-bold text-brand-text-primary">$-</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('deals')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Deals
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Email Campaigns</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Monitor email campaign performance and subscriber engagement.
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Active Campaigns</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Open Rate</span>
                    <span className="text-sm font-medium text-brand-text-primary">-%</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Click Rate</span>
                    <span className="text-sm font-medium text-brand-text-primary">-%</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('campaigns')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Campaigns
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
              <Users className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Unified Contact Data</h5>
                <p className="text-xs text-brand-text-secondary">
                  Sync contacts between HubSpot and The Button for complete member profiles
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Mail className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Marketing Automation</h5>
                <p className="text-xs text-brand-text-secondary">
                  Trigger HubSpot workflows based on user activity in The Button
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Target className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Sponsor Management</h5>
                <p className="text-xs text-brand-text-secondary">
                  Track sponsorship deals and partnership agreements
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Analytics Dashboards</h5>
                <p className="text-xs text-brand-text-secondary">
                  View HubSpot analytics and reports within The Button
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
              <h5 className="font-medium text-brand-text-primary mb-1">API Key</h5>
              <p className="text-sm text-brand-text-secondary mb-2">
                To generate a HubSpot API key:
              </p>
              <ol className="text-sm text-brand-text-secondary space-y-1 ml-4 list-decimal">
                <li>Log in to your HubSpot account</li>
                <li>Navigate to Settings → Integrations → API Key</li>
                <li>Click "Show" or "Generate new key"</li>
                <li>Copy the API key and paste it above</li>
              </ol>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-brand-text-secondary mt-0.5" />
            <div>
              <h5 className="font-medium text-brand-text-primary mb-1">Documentation</h5>
              <a 
                href="https://developers.hubspot.com/docs/api/overview" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:underline flex items-center gap-1"
              >
                HubSpot API Documentation
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
