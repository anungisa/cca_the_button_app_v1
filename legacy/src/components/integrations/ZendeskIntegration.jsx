import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, Headphones, Mail, 
  Clock, Users, BarChart3, Key
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function ZendeskIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const [zendeskConfig, setZendeskConfig] = useState({
    subdomain: '',
    email: '',
    apiToken: ''
  });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Zendesk ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    if (!zendeskConfig.subdomain || !zendeskConfig.apiToken) {
      toast({
        variant: "destructive",
        title: "Missing Credentials",
        description: "Please enter Zendesk subdomain and API token.",
      });
      return;
    }

    setConnectionStatus({ connected: false, loading: true });
    
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Zendesk Connection",
        description: "Connection test coming soon. Zendesk API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-green-950/20 to-teal-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-green-400" />
            Zendesk Support Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Zendesk manages customer support tickets, help desk operations, and user inquiries for 
            Curling Canada. This integration syncs tickets, tracks response times, and provides 
            customer service analytics.
          </p>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-400" />
                <span className="font-medium text-brand-text-primary">Connection Status</span>
              </div>
              {connectionStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-green-400" />
              ) : connectionStatus.connected ? (
                <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
              ) : (
                <Badge className="bg-gray-500/20 text-gray-400">Not Connected</Badge>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="subdomain" className="text-sm text-brand-text-secondary">
                  Zendesk Subdomain
                </Label>
                <Input
                  id="subdomain"
                  value={zendeskConfig.subdomain}
                  onChange={(e) => setZendeskConfig({...zendeskConfig, subdomain: e.target.value})}
                  placeholder="curlingcanada"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  From your Zendesk URL: https://[subdomain].zendesk.com
                </p>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm text-brand-text-secondary">
                  Agent Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={zendeskConfig.email}
                  onChange={(e) => setZendeskConfig({...zendeskConfig, email: e.target.value})}
                  placeholder="admin@curling.ca"
                  className="mt-1 font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="apiToken" className="text-sm text-brand-text-secondary">
                  API Token
                </Label>
                <Input
                  id="apiToken"
                  type="password"
                  value={zendeskConfig.apiToken}
                  onChange={(e) => setZendeskConfig({...zendeskConfig, apiToken: e.target.value})}
                  placeholder="API Token"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Found in Zendesk Admin → Channels → API
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
              <strong>Integration In Development:</strong> Zendesk ticket sync, customer analytics, 
              and support automation coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Support Features</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tickets" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="tickets">
                <Headphones className="w-4 h-4 mr-2" />
                Tickets
              </TabsTrigger>
              <TabsTrigger value="agents">
                <Users className="w-4 h-4 mr-2" />
                Agents
              </TabsTrigger>
              <TabsTrigger value="satisfaction">
                <BarChart3 className="w-4 h-4 mr-2" />
                Satisfaction
              </TabsTrigger>
              <TabsTrigger value="automation">
                <Clock className="w-4 h-4 mr-2" />
                Automation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tickets" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Ticket Management</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Sync support tickets from Zendesk to The Button incident management system.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Open Tickets</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Avg Response Time</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('tickets')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Tickets
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="agents" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Agent Performance</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Monitor agent activity, resolution times, and workload distribution.
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Active Agents</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Avg Tickets/Agent</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Avg Resolution Time</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('agents')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Agent Data
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="satisfaction" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Customer Satisfaction</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Track customer satisfaction scores and feedback from Zendesk surveys.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Satisfaction Score</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-%</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Total Surveys</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('satisfaction')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Satisfaction Data
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="automation" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Support Automation</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Automate ticket routing, response templates, and escalation workflows.
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Active Automations</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Auto-Resolved Tickets</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('automation')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Automation Rules
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
              <Headphones className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Unified Support</h5>
                <p className="text-xs text-brand-text-secondary">
                  Integrate Zendesk tickets into The Button's incident management
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Mail className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Email Integration</h5>
                <p className="text-xs text-brand-text-secondary">
                  Sync support emails from Zendesk to The Button
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Analytics Dashboard</h5>
                <p className="text-xs text-brand-text-secondary">
                  View support metrics and customer satisfaction trends
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Clock className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">SLA Tracking</h5>
                <p className="text-xs text-brand-text-secondary">
                  Monitor service level agreements and response times
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
                To enable API access in Zendesk:
              </p>
              <ol className="text-sm text-brand-text-secondary space-y-1 ml-4 list-decimal">
                <li>Go to Zendesk Admin Center</li>
                <li>Navigate to Channels → API</li>
                <li>Enable Token Access</li>
                <li>Generate a new API token</li>
              </ol>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-brand-text-secondary mt-0.5" />
            <div>
              <h5 className="font-medium text-brand-text-primary mb-1">Documentation</h5>
              <a 
                href="https://developer.zendesk.com/api-reference/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:underline flex items-center gap-1"
              >
                Zendesk API Documentation
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}