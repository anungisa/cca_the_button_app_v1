import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckSquare, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, FileText, Clock, 
  UserCheck, DollarSign, Bell, BarChart3
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function ApprovalMaxIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `ApprovalMax ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    setConnectionStatus({ connected: false, loading: true });
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "ApprovalMax Integration",
        description: "Connection setup coming soon. ApprovalMax API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-cyan-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-400" />
            ApprovalMax Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            ApprovalMax manages approval workflows for QuickBooks financial transactions. 
            This integration syncs approval requests, workflow status, and provides visibility into pending approvals for the finance team.
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
              <strong>Integration In Development:</strong> ApprovalMax API integration is currently being built. 
              Workflow sync and approval notifications coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Approval Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="pending">
                <Clock className="w-4 h-4 mr-2" />
                Pending
              </TabsTrigger>
              <TabsTrigger value="bills">
                <FileText className="w-4 h-4 mr-2" />
                Bills
              </TabsTrigger>
              <TabsTrigger value="purchases">
                <DollarSign className="w-4 h-4 mr-2" />
                Purchase Orders
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Pending Approvals</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Track bills, purchase orders, and expenses awaiting approval in real-time.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-brand-card-bg rounded border border-brand-border">
                    <span className="text-sm text-brand-text-secondary">Sync Status</span>
                    <Badge className="bg-gray-500/20 text-gray-400">Not Configured</Badge>
                  </div>
                  <Button onClick={() => handleSync('pending approvals')} disabled={isSyncing} className="w-full">
                    {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                    Sync Pending Approvals
                  </Button>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="p-3 bg-yellow-500/10 rounded border border-yellow-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-brand-text-primary">Awaiting Your Approval</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Items requiring your immediate attention</p>
                </div>

                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-brand-text-primary">Delegated Approvals</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Approvals assigned to your team members</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bills" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Bill Approvals</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Manage approval workflows for vendor bills from QuickBooks.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-brand-card-bg rounded border border-brand-border">
                    <span className="text-sm text-brand-text-secondary">Last Sync</span>
                    <span className="text-sm text-brand-text-primary">Never</span>
                  </div>
                  <Button onClick={() => handleSync('bills')} disabled={isSyncing} className="w-full">
                    {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                    Sync Bill Approvals
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium text-brand-text-primary">Bill Workflow Features</h5>
                <ul className="space-y-2 text-sm text-brand-text-secondary">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Multi-level approval hierarchies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Automated routing based on amount thresholds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Email and in-app notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Mobile approval capabilities</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="purchases" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Purchase Order Approvals</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Track and approve purchase orders before they're committed.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-brand-card-bg rounded border border-brand-border">
                    <span className="text-sm text-brand-text-secondary">Active POs</span>
                    <span className="text-sm text-brand-text-primary">-</span>
                  </div>
                  <Button onClick={() => handleSync('purchase orders')} disabled={isSyncing} className="w-full">
                    {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                    Sync Purchase Orders
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <h5 className="text-sm font-medium text-brand-text-primary mb-2">Budget Control</h5>
                <p className="text-xs text-brand-text-secondary">
                  ApprovalMax integrates with budget tracking to flag POs that exceed allocated budgets.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Approval Analytics</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Insights into approval cycle times, bottlenecks, and workflow efficiency.
                </p>
                <div className="space-y-2">
                  <Button onClick={() => handleSync('analytics')} disabled={isSyncing} className="w-full">
                    {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BarChart3 className="w-4 h-4 mr-2" />}
                    Load Analytics
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                  <div className="text-2xl font-bold text-brand-text-primary mb-1">-</div>
                  <div className="text-xs text-brand-text-secondary">Avg. Approval Time</div>
                </div>
                <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                  <div className="text-2xl font-bold text-brand-text-primary mb-1">-</div>
                  <div className="text-xs text-brand-text-secondary">Pending Items</div>
                </div>
                <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                  <div className="text-2xl font-bold text-brand-text-primary mb-1">-</div>
                  <div className="text-xs text-brand-text-secondary">Approved This Month</div>
                </div>
                <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                  <div className="text-2xl font-bold text-brand-text-primary mb-1">-</div>
                  <div className="text-xs text-brand-text-secondary">Rejected This Month</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Workflow Configuration */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Workflow Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-brand-text-secondary">
            ApprovalMax workflows are configured in the ApprovalMax dashboard and synced to The Button for visibility.
          </p>
          
          <div className="grid gap-3">
            <div className="p-3 bg-brand-charcoal/30 rounded border border-brand-border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-brand-text-primary text-sm">Approval Thresholds</div>
                  <div className="text-xs text-brand-text-secondary">Automatic routing based on transaction amount</div>
                </div>
                <Bell className="w-5 h-5 text-blue-400" />
              </div>
            </div>

            <div className="p-3 bg-brand-charcoal/30 rounded border border-brand-border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-brand-text-primary text-sm">Notification Settings</div>
                  <div className="text-xs text-brand-text-secondary">Email and in-app approval reminders</div>
                </div>
                <Bell className="w-5 h-5 text-purple-400" />
              </div>
            </div>

            <div className="p-3 bg-brand-charcoal/30 rounded border border-brand-border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-brand-text-primary text-sm">Delegation Rules</div>
                  <div className="text-xs text-brand-text-secondary">Temporary approval delegation for absences</div>
                </div>
                <UserCheck className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={() => window.open('https://approvalmax.com', '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Open ApprovalMax Dashboard
          </Button>
        </CardContent>
      </Card>

      {/* Integration Benefits */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Integration Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-brand-text-primary">For Finance Team</h5>
              <ul className="space-y-1 text-sm text-brand-text-secondary">
                <li>• Real-time approval status visibility</li>
                <li>• Automated workflow routing</li>
                <li>• Budget compliance checks</li>
                <li>• Audit trail for all approvals</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-brand-text-primary">For Approvers</h5>
              <ul className="space-y-1 text-sm text-brand-text-secondary">
                <li>• Centralized approval queue</li>
                <li>• Mobile-friendly approvals</li>
                <li>• Delegation capabilities</li>
                <li>• Performance analytics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}