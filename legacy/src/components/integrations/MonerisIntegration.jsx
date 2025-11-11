import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, Shield, DollarSign, 
  Receipt, Lock, BarChart3, AlertCircle
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function MonerisIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Moneris ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    setConnectionStatus({ connected: false, loading: true });
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Moneris Integration",
        description: "Connection setup coming soon. Moneris Gateway API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-red-950/20 to-orange-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-red-400" />
            Moneris Payment Gateway Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Moneris is Curling Canada's primary payment processing gateway. This integration handles credit card 
            transactions, subscription billing, refunds, and provides PCI-compliant payment processing.
          </p>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                <span className="font-medium text-brand-text-primary">Connection Status</span>
              </div>
              {connectionStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-red-400" />
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
              <strong>Integration In Development:</strong> Moneris Gateway API integration is currently being built. 
              Secure payment processing, recurring billing, and transaction reconciliation coming soon.
            </AlertDescription>
          </Alert>

          <Alert className="border-red-500/50 bg-red-500/10">
            <Lock className="h-4 h-4 text-red-400" />
            <AlertDescription className="text-red-200">
              <strong>Security Notice:</strong> All payment data is processed through Moneris's PCI-DSS Level 1 compliant 
              infrastructure. The Button never stores credit card information directly.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Payment Processing */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Payment Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="transactions">
                <Receipt className="w-4 h-4 mr-2" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="subscriptions">
                <CreditCard className="w-4 h-4 mr-2" />
                Subscriptions
              </TabsTrigger>
              <TabsTrigger value="refunds">
                <DollarSign className="w-4 h-4 mr-2" />
                Refunds
              </TabsTrigger>
              <TabsTrigger value="reports">
                <BarChart3 className="w-4 h-4 mr-2" />
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-red-400" />
                  Transaction Processing
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Membership Payments</div>
                      <div>Process annual membership renewals and new registrations</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Event Registration</div>
                      <div>Handle payments for tournaments, camps, and clinics</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Merchandise Sales</div>
                      <div>Process e-commerce transactions through The Button Shop</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Donations</div>
                      <div>Secure processing for FTLOC and general donations</div>
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

            <TabsContent value="subscriptions" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  Recurring Billing
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Curling+ Subscriptions</div>
                      <div>Monthly and annual streaming subscriptions with automatic renewal</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Fan Pass</div>
                      <div>Recurring loyalty program subscriptions</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Smart Broom Pro</div>
                      <div>Individual and team subscription billing</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Payment Retry Logic</div>
                      <div>Automatic retry for failed recurring payments with customer notifications</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Subscription')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Subscriptions</>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="refunds" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-orange-400" />
                  Refund Management
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Event Cancellations</div>
                      <div>Process refunds for cancelled events or registrations</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Partial Refunds</div>
                      <div>Support for partial refunds based on cancellation policies</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Automated Tracking</div>
                      <div>Sync refund status with QuickBooks for accounting reconciliation</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Refund')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Refunds</>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  Transaction Reports
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Settlement Reports</div>
                      <div>Daily batch settlement reports for reconciliation</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Chargeback Monitoring</div>
                      <div>Track and respond to payment disputes and chargebacks</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Payment Analytics</div>
                      <div>Transaction volume, success rates, and revenue dashboards</div>
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

      {/* Security & Compliance */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Security & Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-500/10 rounded-lg">
              <Shield className="w-5 h-5 text-red-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">PCI-DSS Level 1</h4>
              <p className="text-sm text-brand-text-secondary">
                Moneris is PCI-DSS Level 1 certified, the highest level of payment security
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg">
              <Lock className="w-5 h-5 text-blue-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Tokenization</h4>
              <p className="text-sm text-brand-text-secondary">
                Credit card data is tokenized and never stored on The Button servers
              </p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">3D Secure</h4>
              <p className="text-sm text-brand-text-secondary">
                Support for 3D Secure authentication to reduce fraud and chargebacks
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg">
              <Database className="w-5 h-5 text-purple-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Transaction Logs</h4>
              <p className="text-sm text-brand-text-secondary">
                Complete audit trail of all payment transactions for compliance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Link */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => window.open('https://www.moneris.com', '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Moneris Dashboard
        </Button>
      </div>
    </div>
  );
}