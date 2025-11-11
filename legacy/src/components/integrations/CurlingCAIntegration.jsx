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
  Code, Lock, Webhook, Calendar, Users, Trophy
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function CurlingCAIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const [wpConfig, setWpConfig] = useState({
    siteUrl: 'https://curling.ca',
    username: '',
    appPassword: ''
  });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Curling.ca ${syncType} sync is being developed.`,
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
      <Card className="bg-gradient-to-br from-red-950/20 to-blue-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-brand-red" />
            Curling.ca Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Connect The Button with curling.ca (the main Curling Canada website) to sync news, events, 
            championships, team rosters, and enable seamless content sharing between platforms.
          </p>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-brand-red" />
                <span className="font-medium text-brand-text-primary">Connection Status</span>
              </div>
              {connectionStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-brand-red" />
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
                  placeholder="https://curling.ca"
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
              <TabsTrigger value="events">
                <Calendar className="w-4 h-4 mr-2" />
                Events
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
                  Pull news articles, championship updates, and official announcements from curling.ca into The Button.
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">News & Press Releases</span>
                      <Badge className="bg-gray-500/20 text-gray-400">Not Configured</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Sync latest news and official announcements to Knowledge Base
                    </p>
                    <Button size="sm" onClick={() => handleSync('news')} disabled={isSyncing} className="w-full">
                      {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                      Sync News
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Championship Info</span>
                      <Badge className="bg-gray-500/20 text-gray-400">Not Configured</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Sync championship details, schedules, and results
                    </p>
                    <Button size="sm" onClick={() => handleSync('championships')} disabled={isSyncing} className="w-full">
                      {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                      Sync Championships
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Team Rosters</span>
                      <Badge className="bg-gray-500/20 text-gray-400">Not Configured</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Sync national team rosters and athlete profiles
                    </p>
                    <Button size="sm" onClick={() => handleSync('teams')} disabled={isSyncing} className="w-full">
                      {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                      Sync Teams
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Media Library</span>
                      <Badge className="bg-gray-500/20 text-gray-400">Not Configured</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Sync official photos, videos, and brand assets
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
                  Content sync will create KnowledgeArticle and Event records in The Button, maintaining references to original curling.ca posts.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="events" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Event Calendar Sync</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Automatically sync championship schedules, national events, and official competitions from curling.ca.
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-brand-red" />
                      <h5 className="text-sm font-medium text-brand-text-primary">National Championships</h5>
                    </div>
                    <ul className="text-xs text-brand-text-secondary space-y-1 mb-2">
                      <li>• Tim Hortons Brier</li>
                      <li>• Scotties Tournament of Hearts</li>
                      <li>• Canadian Mixed Doubles Championship</li>
                      <li>• Canadian Wheelchair Championship</li>
                      <li>• Canadian Mixed Championship</li>
                      <li>• Canadian Juniors</li>
                      <li>• Canadian Seniors</li>
                    </ul>
                    <Button size="sm" onClick={() => handleSync('championships')} disabled={isSyncing} className="w-full">
                      {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                      Sync Championships
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <h5 className="text-sm font-medium text-brand-text-primary">Official Events Calendar</h5>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Sync all official Curling Canada events, clinics, and development camps
                    </p>
                    <Button size="sm" onClick={() => handleSync('events')} disabled={isSyncing} className="w-full">
                      {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                      Sync Events
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <h5 className="text-sm font-medium text-brand-text-primary">Team Canada Announcements</h5>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Sync national team selections, roster changes, and athlete announcements
                    </p>
                    <Button size="sm" onClick={() => handleSync('teams')} disabled={isSyncing} className="w-full">
                      {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                      Sync Teams
                    </Button>
                  </div>
                </div>
              </div>

              <Alert className="border-brand-red/50 bg-brand-red/10">
                <Trophy className="h-4 w-4 text-brand-red" />
                <AlertDescription className="text-brand-text-primary">
                  <strong>Strategic Integration:</strong> Curling.ca is the primary source of truth for official championships,
                  national team data, and competition schedules.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="sso" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Single Sign-On (SSO)</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Enable users to log in once and access both curling.ca and The Button seamlessly.
                </p>

                <Alert className="border-yellow-500/50 bg-yellow-500/10 mb-4">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-200">
                    <strong>Recommended Approach:</strong> Use The Button as primary identity provider (IdP) since it has 
                    comprehensive user management tied to CurlingReg.
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
                          <p className="text-xs text-brand-text-secondary">Industry standard, most secure, works with WordPress plugins</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-brand-text-primary">JWT Tokens</strong>
                          <p className="text-xs text-brand-text-secondary">Stateless authentication, good for headless WordPress</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-brand-text-primary">WordPress SSO Plugin</strong>
                          <p className="text-xs text-brand-text-secondary">Requires miniOrange OAuth Client or similar plugin</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Setup Steps</h5>
                    <ol className="text-xs text-brand-text-secondary space-y-1 list-decimal list-inside">
                      <li>Install SSO plugin in curling.ca WordPress (miniOrange OAuth Client)</li>
                      <li>Configure The Button as OAuth provider</li>
                      <li>Set authorized redirect URIs and callback URLs</li>
                      <li>Map user attributes (email, name, curling_id, roles)</li>
                      <li>Test login flow thoroughly</li>
                      <li>Enable SSO for staff first, then public rollout</li>
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
                  Get real-time notifications when content is published, updated, or deleted on curling.ca.
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Webhook Endpoint</h5>
                    <div className="p-2 bg-brand-charcoal/50 rounded font-mono text-xs break-all">
                      https://thebutton.ca/api/webhooks/curling-ca
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
                        <span className="text-brand-text-secondary">News Published</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-brand-text-secondary">Event Created</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-brand-text-secondary">Team Roster Updated</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-brand-text-secondary">Championship Schedule Changed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-brand-text-secondary">Media Uploaded</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-brand-text-secondary">Results Posted</span>
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

      {/* Content Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Curling.ca Content Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
              <h5 className="text-sm font-semibold text-brand-text-primary mb-2">News & Media</h5>
              <ul className="text-xs text-brand-text-secondary space-y-1">
                <li>• Press releases</li>
                <li>• Championship updates</li>
                <li>• Athlete features</li>
                <li>• Photo galleries</li>
                <li>• Video highlights</li>
              </ul>
            </div>

            <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
              <h5 className="text-sm font-semibold text-brand-text-primary mb-2">Championships</h5>
              <ul className="text-xs text-brand-text-secondary space-y-1">
                <li>• Event schedules</li>
                <li>• Venue information</li>
                <li>• Ticket information</li>
                <li>• Team profiles</li>
                <li>• Results & standings</li>
              </ul>
            </div>

            <div className="p-3 bg-purple-500/10 rounded border border-purple-500/30">
              <h5 className="text-sm font-semibold text-brand-text-primary mb-2">Team Canada</h5>
              <ul className="text-xs text-brand-text-secondary space-y-1">
                <li>• National team rosters</li>
                <li>• Selection criteria</li>
                <li>• Athlete bios</li>
                <li>• Competition schedules</li>
                <li>• Results & achievements</li>
              </ul>
            </div>

            <div className="p-3 bg-green-500/10 rounded border border-green-500/30">
              <h5 className="text-sm font-semibold text-brand-text-primary mb-2">Programs & Development</h5>
              <ul className="text-xs text-brand-text-secondary space-y-1">
                <li>• NextGen program info</li>
                <li>• Coaching resources</li>
                <li>• Official certifications</li>
                <li>• Development camps</li>
                <li>• High performance updates</li>
              </ul>
            </div>
          </div>
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
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-red/20 flex items-center justify-center text-sm font-bold text-brand-red">
                1
              </div>
              <div>
                <h5 className="font-medium text-brand-text-primary text-sm">Generate Application Password</h5>
                <p className="text-xs text-brand-text-secondary">
                  In curling.ca WordPress admin, go to Users → Your Profile → Application Passwords and generate a new password for "The Button Integration"
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-red/20 flex items-center justify-center text-sm font-bold text-brand-red">
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
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-red/20 flex items-center justify-center text-sm font-bold text-brand-red">
                3
              </div>
              <div>
                <h5 className="font-medium text-brand-text-primary text-sm">Configure Content Sync</h5>
                <p className="text-xs text-brand-text-secondary">
                  Choose which content categories to sync (news, events, teams, media)
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-red/20 flex items-center justify-center text-sm font-bold text-brand-red">
                4
              </div>
              <div>
                <h5 className="font-medium text-brand-text-primary text-sm">Set Up Webhooks</h5>
                <p className="text-xs text-brand-text-secondary">
                  Install WP Webhooks plugin and configure real-time sync for instant updates
                </p>
              </div>
            </div>
          </div>

          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-200">
              <strong>Need Help?</strong> Contact the IT team or Web Services for assistance with curling.ca integration setup.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}