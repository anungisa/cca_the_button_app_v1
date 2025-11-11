import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, FileText, TrendingUp, 
  Receipt, CreditCard, Building, BarChart3
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function QuickBooksIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `QuickBooks ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    setConnectionStatus({ connected: false, loading: true });
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "QuickBooks Integration",
        description: "Connection setup coming soon. QuickBooks Online API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-green-950/20 to-emerald-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-400" />
            QuickBooks Online Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            QuickBooks Online is Curling Canada's accounting system. This integration syncs financial transactions, 
            invoices, expenses, and provides real-time financial reporting for the finance team.
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
              <strong>Integration In Development:</strong> QuickBooks Online OAuth integration is currently being built. 
              Real-time transaction sync and automated reconciliation coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Financial Data Sync</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="transactions">
                <Receipt className="w-4 h-4 mr-2" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="invoices">
                <FileText className="w-4 h-4 mr-2" />
                Invoices
              </TabsTrigger>
              <TabsTrigger value="expenses">
                <CreditCard className="w-4 h-4 mr-2" />
                Expenses
              </TabsTrigger>
              <TabsTrigger value="reports">
                <BarChart3 className="w-4 h-4 mr-2" />
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-green-400" />
                  Transaction Sync
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Revenue Tracking</div>
                      <div>Sync membership fees, event registrations, and donations</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Expense Management</div>
                      <div>Track operational costs, vendor payments, and reimbursements</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Automated Reconciliation</div>
                      <div>Match transactions between The Button and QuickBooks</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Transaction')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Transactions</>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="invoices" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Invoice Management
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Sponsorship Invoices</div>
                      <div>Auto-create and track sponsor payment invoices</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Event Invoicing</div>
                      <div>Generate invoices for event registrations and services</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Payment Status Tracking</div>
                      <div>Real-time sync of payment status and reminders</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Invoice')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Invoices</>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="expenses" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-orange-400" />
                  Expense Tracking
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Vendor Bills</div>
                      <div>Track bills from suppliers and service providers</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Staff Reimbursements</div>
                      <div>Process expense claims and reimbursements</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Budget Tracking</div>
                      <div>Monitor expenses against departmental budgets</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Expense')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Expenses</>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  Financial Reports
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Profit & Loss</div>
                      <div>Real-time P&L statements synced to DOMO dashboards</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Balance Sheet</div>
                      <div>Current assets, liabilities, and equity</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Cash Flow Analysis</div>
                      <div>Track cash flow trends and forecasts</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Report')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Reports</>
                  )}
                </Button>
              </div>
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
              <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Automated Accounting</h4>
              <p className="text-sm text-brand-text-secondary">
                Automatically sync all Button transactions to QuickBooks, eliminating manual data entry
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg">
              <Database className="w-5 h-5 text-blue-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Single Source of Truth</h4>
              <p className="text-sm text-brand-text-secondary">
                All financial data flows through QuickBooks for accurate reporting and compliance
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Real-Time Insights</h4>
              <p className="text-sm text-brand-text-secondary">
                Live financial dashboards in DOMO powered by QuickBooks data
              </p>
            </div>
            <div className="p-4 bg-orange-500/10 rounded-lg">
              <Building className="w-5 h-5 text-orange-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Multi-Entity Support</h4>
              <p className="text-sm text-brand-text-secondary">
                Track finances across Curling Canada, FTLOC, and other entities separately
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Link */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => window.open('https://quickbooks.intuit.com', '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open QuickBooks Online
        </Button>
      </div>
    </div>
  );
}