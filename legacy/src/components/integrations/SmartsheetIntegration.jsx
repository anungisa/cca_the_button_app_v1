import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Grid3x3, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, FileText, Users, 
  Calendar, BarChart3, Workflow, Key
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function SmartsheetIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const [smartsheetConfig, setSmartsheetConfig] = useState({
    accessToken: ''
  });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Smartsheet ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    if (!smartsheetConfig.accessToken) {
      toast({
        variant: "destructive",
        title: "Missing Credentials",
        description: "Please enter Smartsheet Access Token.",
      });
      return;
    }

    setConnectionStatus({ connected: false, loading: true });
    
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Smartsheet Connection",
        description: "Connection test coming soon. Smartsheet API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-teal-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3x3 className="w-6 h-6 text-blue-400" />
            Smartsheet Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Smartsheet provides collaborative project management and tracking for Curling Canada teams. 
            This integration syncs project plans, task assignments, timelines, and reports from 
            Smartsheet into The Button for unified visibility.
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
                <Label htmlFor="accessToken" className="text-sm text-brand-text-secondary">
                  Smartsheet Access Token
                </Label>
                <Input
                  id="accessToken"
                  type="password"
                  value={smartsheetConfig.accessToken}
                  onChange={(e) => setSmartsheetConfig({...smartsheetConfig, accessToken: e.target.value})}
                  placeholder="Enter Access Token"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Generate in Smartsheet → Account → Apps & Integrations → API Access
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
              <strong>Integration In Development:</strong> Smartsheet sheet sync, task tracking, 
              and report automation coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Smartsheet Features</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sheets" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="sheets">
                <Grid3x3 className="w-4 h-4 mr-2" />
                Sheets
              </TabsTrigger>
              <TabsTrigger value="tasks">
                <CheckCircle className="w-4 h-4 mr-2" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="reports">
                <BarChart3 className="w-4 h-4 mr-2" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="automation">
                <Workflow className="w-4 h-4 mr-2" />
                Automation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sheets" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Sheet Synchronization</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Sync Smartsheet data into The Button for unified project visibility across teams.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Active Sheets</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Last Synced</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('sheets')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Sheets
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Task Management</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Pull task lists, assignments, and deadlines from Smartsheet into staff workspaces.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Total Tasks</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Overdue Tasks</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('tasks')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Tasks
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Report Generation</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Auto-generate reports from Smartsheet data for executive dashboards and stakeholder updates.
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Available Reports</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Scheduled Reports</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('reports')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Generate Reports
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="automation" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Workflow Automation</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Sync Smartsheet automation workflows with The Button's notification and task systems.
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Active Workflows</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Triggered This Week</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('automation')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Automations
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Use Cases */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Common Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Event Planning</h5>
                <p className="text-xs text-brand-text-secondary">
                  Track event timelines, budgets, and task assignments across departments
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Users className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Team Collaboration</h5>
                <p className="text-xs text-brand-text-secondary">
                  Share project status, documents, and updates across staff teams
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Resource Tracking</h5>
                <p className="text-xs text-brand-text-secondary">
                  Monitor budget spend, staff allocation, and project resource utilization
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Workflow className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Process Automation</h5>
                <p className="text-xs text-brand-text-secondary">
                  Automate approval workflows, status updates, and stakeholder notifications
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sync Mapping */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Data Mapping</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-brand-charcoal/30 rounded-lg">
            <h5 className="font-medium text-brand-text-primary mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Smartsheet → The Button
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                <span className="text-brand-text-secondary">Project Plans</span>
                <span className="text-brand-text-primary">→ EventPlan entity</span>
              </div>
              <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                <span className="text-brand-text-secondary">Tasks</span>
                <span className="text-brand-text-primary">→ Task entity</span>
              </div>
              <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                <span className="text-brand-text-secondary">Budget Trackers</span>
                <span className="text-brand-text-primary">→ Budget entity</span>
              </div>
              <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                <span className="text-brand-text-secondary">Resource Allocation</span>
                <span className="text-brand-text-primary">→ Project entity</span>
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
              <h5 className="font-medium text-brand-text-primary mb-1">API Access Token</h5>
              <p className="text-sm text-brand-text-secondary mb-2">
                Generate an API access token from your Smartsheet account:
              </p>
              <ol className="text-sm text-brand-text-secondary space-y-1 ml-4 list-decimal">
                <li>Log in to Smartsheet</li>
                <li>Click Account → Apps & Integrations</li>
                <li>Click "API Access"</li>
                <li>Generate new access token</li>
                <li>Copy and paste the token above</li>
              </ol>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-brand-text-secondary mt-0.5" />
            <div>
              <h5 className="font-medium text-brand-text-primary mb-1">Data Sync</h5>
              <p className="text-sm text-brand-text-secondary">
                Once connected, The Button will automatically sync your Smartsheet workspaces, 
                sheets, and data on a scheduled basis (hourly or daily depending on configuration). 
                You can also manually trigger syncs.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Workflow className="w-5 h-5 text-brand-text-secondary mt-0.5" />
            <div>
              <h5 className="font-medium text-brand-text-primary mb-1">Workflow Integration</h5>
              <p className="text-sm text-brand-text-secondary mb-2">
                Smartsheet automation rules can trigger actions in The Button (notifications, 
                task creation, etc.) and vice versa.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-brand-text-secondary mt-0.5" />
            <div>
              <h5 className="font-medium text-brand-text-primary mb-1">Documentation</h5>
              <a 
                href="https://smartsheet.redoc.ly/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:underline flex items-center gap-1"
              >
                Smartsheet API Documentation
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}