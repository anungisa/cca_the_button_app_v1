import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, FileText, Key, 
  Code, Layers, Lock, Webhook
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function WordPressIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const [wpConfig, setWpConfig] = useState({
    siteUrl: 'https://businessofcurling.ca',
    username: '',
    appPassword: ''
  });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `WordPress ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    if (!wpConfig.username || !wpConfig.appPassword) {
      toast({
        variant: "destructive",
        title: "Missing Credentials",
        description: "Please enter WordPress username and application password.",
      });
      return;
    }

    setConnectionStatus({ connected: false, loading: true });
    
    // Simulate API test
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "WordPress Connection",
        description: "Connection test coming soon. WordPress REST API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-purple-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-400" />
            Business of Curling Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Connect The Button with businessofcurling.ca (WordPress) to sync business resources, 
            educational content, club tools, and enable seamless content sharing between platforms.
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
                <Label htmlFor="wpUrl" className="text-sm text-brand-text-secondary">WordPress Site URL</Label>
                <Input
                  id="wpUrl"
                  value={wpConfig.siteUrl}
                  onChange={(e) => setWpConfig({...wpConfig, siteUrl: e.target.value})}
                  placeholder="https://businessofcurling.ca"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="wpUsername" className="text-sm text-brand-text-secondary">WordPress Username</Label>
                <Input
                  id="wpUsername"
                  value={wpConfig.username}
                  onChange={(e) => setWpConfig({...wpConfig, username: e.target.value})}
                  placeholder="admin"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="wpAppPassword" className="text-sm text-brand-text-secondary">
                  Application Password
                  <span className="ml-2 text-xs text-yellow-400">(Not your regular password)</span>
                </Label>
                <Input
                  id="wpAppPassword"
                  type="password"
                  value={wpConfig.appPassword}
                  onChange={(e) => setWpConfig({...wpConfig, appPassword: e.target.value})}
                  placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                  className="mt-1"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Generate in WordPress: Users → Profile → Application Passwords
                </p>
              </div>

              <Button 
                onClick={testConnection}
                disabled={connectionStatus.loading}
                className="w-full"
              >
                {connectionStatus.loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Testing Connection...</>
                ) : (
                  <><CheckCircle className="w-4 h-4 mr-2" /> Test Connection</>
                )}
              </Button>
            </div>
          </div>

          <Alert className="border-blue-500/50 bg-blue-500/10">
            <Key className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-200">
              <strong>Setup Required:</strong> Generate an Application Password in WordPress (Users → Profile → Application Passwords). 
              This is more secure than using your admin password directly.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Integration Options */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Integration Options</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="content">
                <FileText className="w-4 h-4 mr-2" />
                Content Sync
              </TabsTrigger>
              <TabsTrigger value="embed">
                <Code className="w-4 h-4 mr-2" />
                Embedding
              </TabsTrigger>
              <TabsTrigger value="sso">
                <Lock className="w-4 h-4 mr-2" />
                Single Sign-On
              </TabsTrigger>
              <TabsTrigger value="webhooks">
                <Webhook className="w-4 h-4 mr-2" />
                Webhooks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Content Synchronization</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Pull business resources, educational articles, and club tools from businessofcurling.ca into The Button's Knowledge Base.
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Posts & Articles</span>
                      <Badge className="bg-gray-500/20 text-gray-400">Not Configured</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Sync blog posts and business articles to Knowledge Base
                    </p>
                    <Button size="sm" onClick={() => handleSync('posts')} disabled={isSyncing} className="w-full">
                      {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                      Sync Posts
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Resources & Downloads</span>
                      <Badge className="bg-gray-500/20 text-gray-400">Not Configured</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Sync downloadable templates, toolkits, and guides
                    </p>
                    <Button size="sm" onClick={() => handleSync('resources')} disabled={isSyncing} className="w-full">
                      {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                      Sync Resources
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Media Library</span>
                      <Badge className="bg-gray-500/20 text-gray-400">Not Configured</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Sync images, videos, and documents
                    </p>
                    <Button size="sm" onClick={() => handleSync('media')} disabled={isSyncing} className="w-full">
                      {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                      Sync Media
                    </Button>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Content sync will create KnowledgeArticle records in The Button, maintaining a reference to the original WordPress post.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="embed" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Embed The Button in WordPress</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Add Button features directly to businessofcurling.ca pages using iframes or WordPress blocks.
                </p>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-brand-text-primary mb-2 block">Option 1: WordPress Shortcode</Label>
                    <div className="p-3 bg-brand-card-bg rounded border border-brand-border font-mono text-sm">
                      [thebutton type="knowledge" category="club-tools"]
                    </div>
                    <p className="text-xs text-brand-text-secondary mt-1">
                      Requires custom WordPress plugin (in development)
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-brand-text-primary mb-2 block">Option 2: Direct iFrame Embed</Label>
                    <div className="p-3 bg-brand-card-bg rounded border border-brand-border font-mono text-xs break-all">
                      {`<iframe src="https://thebutton.ca/embed/knowledge?category=club-tools" width="100%" height="600px"></iframe>`}
                    </div>
                    <p className="text-xs text-brand-text-secondary mt-1">
                      Paste in WordPress HTML block
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-brand-text-primary mb-2 block">Option 3: Gutenberg Block</Label>
                    <p className="text-sm text-brand-text-secondary">
                      Custom Gutenberg block for The Button integration (coming soon)
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
                  <h5 className="text-sm font-medium text-brand-text-primary mb-1">Embeddable Features</h5>
                  <ul className="text-xs text-brand-text-secondary space-y-1">
                    <li>• Knowledge Base articles</li>
                    <li>• Business tools & calculators</li>
                    <li>• Event calendars</li>
                    <li>• Club directory</li>
                  </ul>
                </div>

                <div className="p-3 bg-purple-500/10 rounded border border-purple-500/30">
                  <h5 className="text-sm font-medium text-brand-text-primary mb-1">Benefits</h5>
                  <ul className="text-xs text-brand-text-secondary space-y-1">
                    <li>• Single source of truth</li>
                    <li>• Real-time updates</li>
                    <li>• Consistent UX</li>
                    <li>• Reduced maintenance</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sso" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Single Sign-On (SSO)</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Enable users to log in once and access both businessofcurling.ca and The Button seamlessly.
                </p>

                <Alert className="border-yellow-500/50 bg-yellow-500/10 mb-4">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-200">
                    <strong>Recommended Approach:</strong> Use The Button as primary identity provider (IdP) since it has more robust user management.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Implementation Options</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-brand-text-primary">OAuth 2.0 (Recommended)</strong>
                          <p className="text-xs text-brand-text-secondary">Industry standard, most secure</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-brand-text-primary">JWT Tokens</strong>
                          <p className="text-xs text-brand-text-secondary">Stateless authentication, good for APIs</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-brand-text-primary">WordPress Plugin</strong>
                          <p className="text-xs text-brand-text-secondary">Requires miniOrange or similar SSO plugin</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Setup Steps</h5>
                    <ol className="text-xs text-brand-text-secondary space-y-1 list-decimal list-inside">
                      <li>Install SSO plugin in WordPress (miniOrange OAuth Server/Client)</li>
                      <li>Configure The Button as OAuth provider</li>
                      <li>Set redirect URIs and callback URLs</li>
                      <li>Map user attributes (email, name, roles)</li>
                      <li>Test login flow</li>
                    </ol>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View SSO Documentation
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">WordPress Webhooks</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Get real-time notifications when content is published, updated, or deleted on businessofcurling.ca.
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Webhook Endpoint</h5>
                    <div className="p-2 bg-brand-charcoal/50 rounded font-mono text-xs break-all">
                      https://thebutton.ca/api/webhooks/wordpress
                    </div>
                    <p className="text-xs text-brand-text-secondary mt-2">
                      Configure this URL in WordPress webhook plugin (e.g., WP Webhooks)
                    </p>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Supported Events</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-brand-text-secondary">Post Published</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-brand-text-secondary">Post Updated</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-brand-text-secondary">Post Deleted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-brand-text-secondary">Media Uploaded</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-1">Recommended Plugin</h5>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      <strong>WP Webhooks</strong> - Free plugin for WordPress webhook integration
                    </p>
                    <Button size="sm" variant="outline" onClick={() => window.open('https://wordpress.org/plugins/wp-webhooks/', '_blank')}>
                      <ExternalLink className="w-3 h-3 mr-2" />
                      Get Plugin
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Start Guide */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400">
                1
              </div>
              <div>
                <h5 className="font-medium text-brand-text-primary text-sm">Generate Application Password</h5>
                <p className="text-xs text-brand-text-secondary">
                  In WordPress admin, go to Users → Your Profile → Application Passwords and generate a new password for "The Button Integration"
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400">
                2
              </div>
              <div>
                <h5 className="font-medium text-brand-text-primary text-sm">Test REST API Connection</h5>
                <p className="text-xs text-brand-text-secondary">
                  Enter your credentials above and click "Test Connection" to verify API access
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400">
                3
              </div>
              <div>
                <h5 className="font-medium text-brand-text-primary text-sm">Choose Integration Type</h5>
                <p className="text-xs text-brand-text-secondary">
                  Decide if you want content sync, embedding, SSO, or webhooks (or all of them!)
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400">
                4
              </div>
              <div>
                <h5 className="font-medium text-brand-text-primary text-sm">Configure & Test</h5>
                <p className="text-xs text-brand-text-secondary">
                  Set up your chosen integration method and test thoroughly before going live
                </p>
              </div>
            </div>
          </div>

          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-200">
              <strong>Need Help?</strong> Contact the IT team for assistance with WordPress integration setup.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}