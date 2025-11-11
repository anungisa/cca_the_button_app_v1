import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingBag, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, TrendingUp, Package, 
  Users, BarChart3, DollarSign, Key, Webhook, 
  ShoppingCart, Shirt, CreditCard, Award
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function ShopifyIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const [shopifyConfig, setShopifyConfig] = useState({
    storeName: 'curling',
    accessToken: '',
    webhookSecret: ''
  });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Shop.Curling.ca ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    if (!shopifyConfig.accessToken) {
      toast({
        variant: "destructive",
        title: "Missing Credentials",
        description: "Please enter Shopify Admin API Access Token.",
      });
      return;
    }

    setConnectionStatus({ connected: false, loading: true });
    
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Shop.Curling.ca Connection",
        description: "Connection test coming soon. Shopify API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-green-950/20 to-teal-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-green-400" />
            Shop.Curling.ca Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-green-500/20 text-green-400">E-Commerce</Badge>
            <Badge variant="outline">Shopify Platform</Badge>
          </div>
          
          <p className="text-brand-text-secondary">
            Shop.Curling.ca is Curling Canada's official e-commerce store powered by Shopify. This integration 
            syncs product catalog, inventory levels, order history, and customer data into The Button for 
            unified commerce tracking, personalized recommendations, and loyalty rewards.
          </p>

          <Alert className="border-blue-500/50 bg-blue-500/10">
            <ExternalLink className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-brand-text-secondary">
              <strong>Live Store:</strong>{' '}
              <a 
                href="https://shop.curling.ca" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                shop.curling.ca
              </a>
            </AlertDescription>
          </Alert>

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
                <Label htmlFor="storeName" className="text-sm text-brand-text-secondary">
                  Shopify Store Name
                </Label>
                <Input
                  id="storeName"
                  value={shopifyConfig.storeName}
                  onChange={(e) => setShopifyConfig({...shopifyConfig, storeName: e.target.value})}
                  placeholder="curling"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Store name from your-store.myshopify.com
                </p>
              </div>
              
              <div>
                <Label htmlFor="accessToken" className="text-sm text-brand-text-secondary">
                  Admin API Access Token
                </Label>
                <Input
                  id="accessToken"
                  type="password"
                  value={shopifyConfig.accessToken}
                  onChange={(e) => setShopifyConfig({...shopifyConfig, accessToken: e.target.value})}
                  placeholder="shpat_..."
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Found in Shopify Admin → Settings → Apps & Sales Channels → Develop Apps
                </p>
              </div>

              <div>
                <Label htmlFor="webhookSecret" className="text-sm text-brand-text-secondary">
                  Webhook Secret
                </Label>
                <Input
                  id="webhookSecret"
                  type="password"
                  value={shopifyConfig.webhookSecret}
                  onChange={(e) => setShopifyConfig({...shopifyConfig, webhookSecret: e.target.value})}
                  placeholder="Webhook Secret"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  For verifying webhook authenticity
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
            <ShoppingBag className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sync">
            <Database className="w-4 h-4 mr-2" />
            Data Sync
          </TabsTrigger>
          <TabsTrigger value="webhooks">
            <Webhook className="w-4 h-4 mr-2" />
            Webhooks
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
              <CardTitle className="text-lg">What Data Flows from Shop.Curling.ca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-brand-text-primary mb-1">Product Catalog</p>
                      <ul className="text-sm text-brand-text-secondary space-y-1">
                        <li>• Product names, descriptions, prices</li>
                        <li>• Product images and variants</li>
                        <li>• Inventory levels per SKU</li>
                        <li>• Categories and collections</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShoppingCart className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-brand-text-primary mb-1">Order Data</p>
                      <ul className="text-sm text-brand-text-secondary space-y-1">
                        <li>• Order history and status</li>
                        <li>• Customer purchase behavior</li>
                        <li>• Revenue by product line</li>
                        <li>• Shipping and fulfillment data</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-brand-text-primary mb-1">Customer Data</p>
                      <ul className="text-sm text-brand-text-secondary space-y-1">
                        <li>• Customer profiles and preferences</li>
                        <li>• Purchase frequency and LTV</li>
                        <li>• Geographic distribution</li>
                        <li>• Email subscription status</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-brand-text-primary mb-1">Marketing Analytics</p>
                      <ul className="text-sm text-brand-text-secondary space-y-1">
                        <li>• Conversion rates by source</li>
                        <li>• Cart abandonment data</li>
                        <li>• Discount code usage</li>
                        <li>• Product view analytics</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Integration Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <DollarSign className="w-8 h-8 text-green-400 mb-3" />
                  <h5 className="font-bold text-brand-text-primary mb-2">Unified Commerce</h5>
                  <p className="text-sm text-brand-text-secondary">
                    Track shop purchases alongside Button XP, events, and donations for complete customer view
                  </p>
                </div>

                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <TrendingUp className="w-8 h-8 text-blue-400 mb-3" />
                  <h5 className="font-bold text-brand-text-primary mb-2">Smart Recommendations</h5>
                  <p className="text-sm text-brand-text-secondary">
                    Show personalized product recommendations based on user profile, club, and interests
                  </p>
                </div>

                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <Award className="w-8 h-8 text-purple-400 mb-3" />
                  <h5 className="font-bold text-brand-text-primary mb-2">Loyalty Integration</h5>
                  <p className="text-sm text-brand-text-secondary">
                    Award CurlPoints for shop purchases and enable points redemption for discounts
                  </p>
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
                  onClick={() => handleSync('products')}
                  disabled={isSyncing}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-start gap-3 w-full">
                    <Package className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div className="text-left flex-1">
                      <p className="font-medium text-brand-text-primary">Sync Product Catalog</p>
                      <p className="text-xs text-brand-text-secondary mt-1">
                        Import all products, variants, and pricing
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
                  onClick={() => handleSync('orders')}
                  disabled={isSyncing}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-start gap-3 w-full">
                    <ShoppingCart className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div className="text-left flex-1">
                      <p className="font-medium text-brand-text-primary">Sync Order History</p>
                      <p className="text-xs text-brand-text-secondary mt-1">
                        Import past 90 days of orders
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
                  onClick={() => handleSync('customers')}
                  disabled={isSyncing}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-start gap-3 w-full">
                    <Users className="w-5 h-5 text-green-400 mt-0.5" />
                    <div className="text-left flex-1">
                      <p className="font-medium text-brand-text-primary">Sync Customer Data</p>
                      <p className="text-xs text-brand-text-secondary mt-1">
                        Match shop customers to Button users
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
                  onClick={() => handleSync('inventory')}
                  disabled={isSyncing}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-start gap-3 w-full">
                    <BarChart3 className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div className="text-left flex-1">
                      <p className="font-medium text-brand-text-primary">Sync Inventory Levels</p>
                      <p className="text-xs text-brand-text-secondary mt-1">
                        Real-time stock availability
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
                  <Badge variant="outline">Every 6 hours</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sync Statistics */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Sync Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-brand-text-primary">0</p>
                  <p className="text-sm text-brand-text-secondary">Products Synced</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-brand-text-primary">0</p>
                  <p className="text-sm text-brand-text-secondary">Orders Synced</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-brand-text-primary">0</p>
                  <p className="text-sm text-brand-text-secondary">Customers Matched</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-brand-text-primary">0</p>
                  <p className="text-sm text-brand-text-secondary">Sync Errors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Webhook Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-blue-500/50 bg-blue-500/10">
                <Webhook className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-brand-text-secondary">
                  Configure these webhooks in Shopify Admin → Settings → Notifications → Webhooks 
                  to receive real-time updates
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {[
                  { event: 'orders/create', description: 'Triggered when a new order is created' },
                  { event: 'orders/updated', description: 'Triggered when order status changes' },
                  { event: 'orders/fulfilled', description: 'Triggered when order is shipped' },
                  { event: 'orders/cancelled', description: 'Triggered when order is cancelled' },
                  { event: 'products/create', description: 'Triggered when a new product is added' },
                  { event: 'products/update', description: 'Triggered when product details change' },
                  { event: 'inventory_levels/update', description: 'Triggered when inventory changes' },
                  { event: 'customers/create', description: 'Triggered when a new customer registers' }
                ].map((webhook) => (
                  <div 
                    key={webhook.event}
                    className="p-3 bg-brand-charcoal/30 rounded-lg border border-brand-border"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-mono text-sm text-brand-text-primary mb-1">{webhook.event}</p>
                        <p className="text-xs text-brand-text-secondary">{webhook.description}</p>
                      </div>
                      <Badge className="bg-gray-500/20 text-gray-400">Pending</Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
                <p className="text-sm font-medium text-brand-text-primary mb-2">Webhook Endpoint:</p>
                <div className="flex gap-2">
                  <code className="flex-1 px-3 py-2 bg-brand-charcoal rounded text-xs font-mono text-brand-text-secondary">
                    https://your-app.base44.app/functions/shopifyWebhook
                  </code>
                  <Button size="sm" variant="outline">
                    <Key className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Shop Analytics & Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-950/30 to-purple-950/30 rounded-lg border border-blue-500/30">
                  <h5 className="font-bold text-brand-text-primary mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Revenue Intelligence
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Monthly Revenue:</span>
                      <span className="font-bold text-brand-text-primary">$0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">YoY Growth:</span>
                      <span className="font-bold text-green-400">--</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Avg Order Value:</span>
                      <span className="font-bold text-brand-text-primary">$0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Top Category:</span>
                      <span className="font-bold text-brand-text-primary">--</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-950/30 to-teal-950/30 rounded-lg border border-green-500/30">
                  <h5 className="font-bold text-brand-text-primary mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-400" />
                    Customer Insights
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Total Customers:</span>
                      <span className="font-bold text-brand-text-primary">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Repeat Rate:</span>
                      <span className="font-bold text-brand-text-primary">--</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Avg Lifetime Value:</span>
                      <span className="font-bold text-brand-text-primary">$0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Top Region:</span>
                      <span className="font-bold text-brand-text-primary">--</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-950/30 to-pink-950/30 rounded-lg border border-purple-500/30">
                  <h5 className="font-bold text-brand-text-primary mb-3 flex items-center gap-2">
                    <Shirt className="w-5 h-5 text-purple-400" />
                    Product Performance
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Top Product:</span>
                      <span className="font-bold text-brand-text-primary">--</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Conversion Rate:</span>
                      <span className="font-bold text-brand-text-primary">--</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Out of Stock Items:</span>
                      <span className="font-bold text-amber-400">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Low Stock Alerts:</span>
                      <span className="font-bold text-brand-text-primary">0</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-amber-950/30 to-orange-950/30 rounded-lg border border-amber-500/30">
                  <h5 className="font-bold text-brand-text-primary mb-3 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-amber-400" />
                    Cart Analytics
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Abandonment Rate:</span>
                      <span className="font-bold text-brand-text-primary">--</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Avg Cart Value:</span>
                      <span className="font-bold text-brand-text-primary">$0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Recovery Rate:</span>
                      <span className="font-bold text-brand-text-primary">--</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Discount Usage:</span>
                      <span className="font-bold text-brand-text-primary">--</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Use Cases */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Button + Shop Integration Use Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-brand-text-primary mb-1">Earn CurlPoints on Purchases</h5>
                      <p className="text-sm text-brand-text-secondary">
                        Award 10 CurlPoints per $1 spent on shop.curling.ca, automatically tracked via webhooks
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-brand-text-primary mb-1">Personalized Product Recommendations</h5>
                      <p className="text-sm text-brand-text-secondary">
                        Show relevant products in The Button based on user's club, interests, and past purchases
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-brand-text-primary mb-1">Points-for-Discounts</h5>
                      <p className="text-sm text-brand-text-secondary">
                        Redeem CurlPoints for discount codes on shop.curling.ca (e.g., 500 points = $5 off)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-brand-text-primary mb-1">Club Merchandise Programs</h5>
                      <p className="text-sm text-brand-text-secondary">
                        Clubs can create custom product collections with club branding and track sales
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-4 h-4 text-pink-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-brand-text-primary mb-1">Unified Customer View</h5>
                      <p className="text-sm text-brand-text-secondary">
                        See complete customer journey: events attended, XP earned, donations made, and shop purchases
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-brand-text-primary mb-1">Event Merchandise Tracking</h5>
                      <p className="text-sm text-brand-text-secondary">
                        Track event-specific merch sales (e.g., 2025 Brier apparel) for ROI analysis
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Technical Documentation */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Required Shopify API Scopes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-brand-text-secondary mb-4">
            When creating your Shopify App, ensure these API access scopes are enabled:
          </p>
          <div className="grid md:grid-cols-2 gap-2">
            {[
              'read_products',
              'read_orders',
              'read_customers',
              'read_inventory',
              'read_analytics',
              'read_marketing_events',
              'read_discounts',
              'read_checkouts'
            ].map((scope) => (
              <div key={scope} className="flex items-center gap-2 p-2 bg-brand-charcoal/30 rounded">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <code className="text-xs font-mono text-brand-text-primary">{scope}</code>
              </div>
            ))}
          </div>

          <Alert className="mt-4 border-amber-500/50 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <AlertDescription className="text-brand-text-secondary">
              <strong>Note:</strong> This integration requires read-only access. We never write data back to Shopify 
              to prevent conflicts with your store operations.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}