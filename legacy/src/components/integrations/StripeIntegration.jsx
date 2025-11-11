import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, DollarSign, TrendingUp, 
  Users, ShoppingCart, BarChart3, Key, Webhook
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function StripeIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const [stripeConfig, setStripeConfig] = useState({
    publishableKey: '',
    secretKey: '',
    webhookSecret: ''
  });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Stripe ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    if (!stripeConfig.secretKey) {
      toast({
        variant: "destructive",
        title: "Missing Credentials",
        description: "Please enter Stripe Secret Key.",
      });
      return;
    }

    setConnectionStatus({ connected: false, loading: true });
    
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Stripe Connection",
        description: "Connection test coming soon. Stripe API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-400" />
            Stripe Payment Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Stripe powers online payments for Curling+, Fan Pass subscriptions, merchandise, 
            event registrations, and donations. This integration tracks transactions, manages subscriptions, 
            and provides financial reporting.
          </p>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-brand-text-primary">Connection Status</span>
              </div>
              {connectionStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              ) : connectionStatus.connected ? (
                <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
              ) : (
                <Badge className="bg-gray-500/20 text-gray-400">Not Connected</Badge>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="publishableKey" className="text-sm text-brand-text-secondary">
                  Publishable Key (Frontend)
                </Label>
                <Input
                  id="publishableKey"
                  value={stripeConfig.publishableKey}
                  onChange={(e) => setStripeConfig({...stripeConfig, publishableKey: e.target.value})}
                  placeholder="pk_live_..."
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Safe to use in frontend code
                </p>
              </div>
              
              <div>
                <Label htmlFor="secretKey" className="text-sm text-brand-text-secondary">
                  Secret Key (Backend)
                </Label>
                <Input
                  id="secretKey"
                  type="password"
                  value={stripeConfig.secretKey}
                  onChange={(e) => setStripeConfig({...stripeConfig, secretKey: e.target.value})}
                  placeholder="sk_live_..."
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Found in Stripe Dashboard → Developers → API keys
                </p>
              </div>

              <div>
                <Label htmlFor="webhookSecret" className="text-sm text-brand-text-secondary">
                  Webhook Signing Secret
                </Label>
                <Input
                  id="webhookSecret"
                  type="password"
                  value={stripeConfig.webhookSecret}
                  onChange={(e) => setStripeConfig({...stripeConfig, webhookSecret: e.target.value})}
                  placeholder="whsec_..."
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  For webhook security - found in Stripe Dashboard → Webhooks
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
              <strong>Integration In Development:</strong> Stripe payment processing, subscription management, 
              and financial reporting features coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Stripe Payment Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="transactions">
                <DollarSign className="w-4 h-4 mr-2" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="subscriptions">
                <Users className="w-4 h-4 mr-2" />
                Subscriptions
              </TabsTrigger>
              <TabsTrigger value="products">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Payment Transactions</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Sync all payment transactions including one-time purchases, donations, and event registrations.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Total Transactions</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Total Revenue (YTD)</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('transactions')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Transactions
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="subscriptions" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Active Subscriptions</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Manage Curling+ subscriptions, Fan Pass memberships, and recurring donations.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Active Subscriptions</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Monthly Recurring Revenue</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('subscriptions')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Subscriptions
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Products & Prices</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Sync Stripe products including merchandise, event tickets, and digital content.
                </p>
                <Button 
                  onClick={() => handleSync('products')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Products
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Revenue Analytics</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Financial reporting, revenue trends, and payment success rates.
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Payment Success Rate</span>
                    <span className="text-sm font-medium text-brand-text-primary">-%</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Avg Transaction Value</span>
                    <span className="text-sm font-medium text-brand-text-primary">$-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Failed Payments</span>
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
              <Webhook className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Webhook Events</h5>
                <p className="text-xs text-brand-text-secondary">
                  Real-time payment notifications, subscription updates, and failed payment alerts
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Revenue Tracking</h5>
                <p className="text-xs text-brand-text-secondary">
                  Track revenue by source: subscriptions, events, merchandise, and donations
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Users className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Customer Profiles</h5>
                <p className="text-xs text-brand-text-secondary">
                  Link Stripe customers to Button users for complete purchase history
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <BarChart3 className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Financial Reporting</h5>
                <p className="text-xs text-brand-text-secondary">
                  Export payment data to QuickBooks and generate financial reports
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
              <h5 className="font-medium text-brand-text-primary mb-1">API Keys</h5>
              <p className="text-sm text-brand-text-secondary">
                Get your API keys from Stripe Dashboard → Developers → API keys
              </p>
              <a 
                href="https://dashboard.stripe.com/apikeys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:underline flex items-center gap-1 mt-1"
              >
                Open Stripe Dashboard
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Webhook className="w-5 h-5 text-brand-text-secondary mt-0.5" />
            <div>
              <h5 className="font-medium text-brand-text-primary mb-1">Webhook Configuration</h5>
              <p className="text-sm text-brand-text-secondary">
                Set up webhooks in Stripe Dashboard → Developers → Webhooks to receive real-time events
              </p>
              <p className="text-xs text-brand-text-secondary mt-1 font-mono bg-brand-charcoal/50 p-2 rounded">
                Endpoint URL: https://your-app.base44.app/webhooks/stripe
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}