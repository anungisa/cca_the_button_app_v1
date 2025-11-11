import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, ClipboardList, Send, 
  BarChart3, Users, Key
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function FormstackIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const [formstackConfig, setFormstackConfig] = useState({
    accessToken: ''
  });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Formstack ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    if (!formstackConfig.accessToken) {
      toast({
        variant: "destructive",
        title: "Missing Credentials",
        description: "Please enter Formstack Access Token.",
      });
      return;
    }

    setConnectionStatus({ connected: false, loading: true });
    
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Formstack Connection",
        description: "Connection test coming soon. Formstack API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-green-950/20 to-teal-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-green-400" />
            Formstack Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Formstack powers online forms and surveys for Curling Canada including registrations, 
            feedback collection, and data gathering. This integration syncs form submissions and analytics.
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
                <Label htmlFor="accessToken" className="text-sm text-brand-text-secondary">
                  Formstack Access Token
                </Label>
                <Input
                  id="accessToken"
                  type="password"
                  value={formstackConfig.accessToken}
                  onChange={(e) => setFormstackConfig({...formstackConfig, accessToken: e.target.value})}
                  placeholder="Access Token"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Found in Formstack → Account → API → Access Tokens
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
              <strong>Integration In Development:</strong> Formstack form sync, submission tracking, 
              and analytics features coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Formstack Features</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="forms" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="forms">
                <ClipboardList className="w-4 h-4 mr-2" />
                Forms
              </TabsTrigger>
              <TabsTrigger value="submissions">
                <Send className="w-4 h-4 mr-2" />
                Submissions
              </TabsTrigger>
              <TabsTrigger value="responses">
                <Users className="w-4 h-4 mr-2" />
                Responses
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="forms" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Active Forms</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Sync forms from Formstack including registration, feedback, and survey forms.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Active Forms</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Total Views</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('forms')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Forms
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="submissions" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Form Submissions</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Track all form submissions and import them into The Button's data system.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Total Submissions</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">This Month</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('submissions')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Submissions
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="responses" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Response Data</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Access detailed response data from surveys and feedback forms.
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Completion Rate</span>
                    <span className="text-sm font-medium text-brand-text-primary">-%</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Avg Response Time</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('responses')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Responses
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Form Analytics</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Analyze form performance, conversion rates, and user engagement.
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Conversion Rate</span>
                    <span className="text-sm font-medium text-brand-text-primary">-%</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Drop-off Rate</span>
                    <span className="text-sm font-medium text-brand-text-primary">-%</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Most Popular Form</span>
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
              <Send className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Auto-Sync Submissions</h5>
                <p className="text-xs text-brand-text-secondary">
                  Automatically import form submissions into The Button entities
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <ClipboardList className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Form Templates</h5>
                <p className="text-xs text-brand-text-secondary">
                  Use Formstack forms as templates in The Button's Forms Hub
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Advanced Analytics</h5>
                <p className="text-xs text-brand-text-secondary">
                  Combine Formstack and Button data for comprehensive reporting
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Users className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">User Matching</h5>
                <p className="text-xs text-brand-text-secondary">
                  Automatically match form submissions to Button users
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
              <h5 className="font-medium text-brand-text-primary mb-1">Generate Access Token</h5>
              <p className="text-sm text-brand-text-secondary">
                Create an access token in Formstack → Account → API → Access Tokens
              </p>
              <a 
                href="https://www.formstack.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:underline flex items-center gap-1 mt-1"
              >
                Open Formstack
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-brand-text-secondary mt-0.5" />
            <div>
              <h5 className="font-medium text-brand-text-primary mb-1">API Permissions</h5>
              <p className="text-sm text-brand-text-secondary">
                Ensure your access token has permissions to read forms and submissions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}