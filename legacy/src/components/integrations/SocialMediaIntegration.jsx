import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Share2, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, TrendingUp, MessageSquare, 
  Heart, Eye, BarChart3, Key
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function SocialMediaIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    facebook: false,
    instagram: false,
    twitter: false,
    linkedin: false,
    loading: false
  });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Social Media ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const connectPlatform = async (platform) => {
    toast({
      title: "Coming Soon",
      description: `${platform} OAuth connection coming soon.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-pink-950/20 to-purple-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-6 h-6 text-pink-400" />
            Social Media APIs Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Connect directly to Facebook, Instagram, Twitter/X, and LinkedIn to post content, 
            track engagement, monitor brand mentions, and analyze social media performance across platforms.
          </p>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <h4 className="font-medium text-brand-text-primary mb-3">Platform Connections</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-brand-card-bg rounded border border-brand-border text-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">f</span>
                </div>
                <p className="text-xs font-medium text-brand-text-primary mb-1">Facebook</p>
                {connectionStatus.facebook ? (
                  <Badge className="bg-green-500/20 text-green-400 text-xs">Connected</Badge>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => connectPlatform('Facebook')}
                    className="w-full mt-1 text-xs h-7"
                  >
                    Connect
                  </Button>
                )}
              </div>

              <div className="p-3 bg-brand-card-bg rounded border border-brand-border text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IG</span>
                </div>
                <p className="text-xs font-medium text-brand-text-primary mb-1">Instagram</p>
                {connectionStatus.instagram ? (
                  <Badge className="bg-green-500/20 text-green-400 text-xs">Connected</Badge>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => connectPlatform('Instagram')}
                    className="w-full mt-1 text-xs h-7"
                  >
                    Connect
                  </Button>
                )}
              </div>

              <div className="p-3 bg-brand-card-bg rounded border border-brand-border text-center">
                <div className="w-8 h-8 bg-black rounded-full mx-auto mb-2 flex items-center justify-center border border-gray-700">
                  <span className="text-white font-bold text-sm">𝕏</span>
                </div>
                <p className="text-xs font-medium text-brand-text-primary mb-1">Twitter/X</p>
                {connectionStatus.twitter ? (
                  <Badge className="bg-green-500/20 text-green-400 text-xs">Connected</Badge>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => connectPlatform('Twitter/X')}
                    className="w-full mt-1 text-xs h-7"
                  >
                    Connect
                  </Button>
                )}
              </div>

              <div className="p-3 bg-brand-card-bg rounded border border-brand-border text-center">
                <div className="w-8 h-8 bg-blue-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">in</span>
                </div>
                <p className="text-xs font-medium text-brand-text-primary mb-1">LinkedIn</p>
                {connectionStatus.linkedin ? (
                  <Badge className="bg-green-500/20 text-green-400 text-xs">Connected</Badge>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => connectPlatform('LinkedIn')}
                    className="w-full mt-1 text-xs h-7"
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              <strong>Integration In Development:</strong> Social media OAuth, direct posting, 
              and analytics features coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Social Media Features</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="posting" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="posting">
                <Share2 className="w-4 h-4 mr-2" />
                Posting
              </TabsTrigger>
              <TabsTrigger value="engagement">
                <Heart className="w-4 h-4 mr-2" />
                Engagement
              </TabsTrigger>
              <TabsTrigger value="monitoring">
                <Eye className="w-4 h-4 mr-2" />
                Monitoring
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posting" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Cross-Platform Posting</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Create and schedule posts to publish simultaneously across all connected social platforms.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Scheduled Posts</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Published This Month</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('posts')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Posts
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Engagement Metrics</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Track likes, comments, shares, and overall engagement across all platforms.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Total Engagement</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Avg Engagement Rate</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-%</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('engagement')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Engagement
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Brand Monitoring</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Monitor mentions, hashtags, and conversations about Curling Canada across social platforms.
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Brand Mentions</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Hashtag Reach</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Sentiment Score</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('mentions')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Mentions
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Platform Analytics</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Comprehensive social media analytics including reach, impressions, and follower growth.
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Total Followers</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Monthly Reach</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Best Posting Time</span>
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
              <Share2 className="w-5 h-5 text-pink-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Unified Publishing</h5>
                <p className="text-xs text-brand-text-secondary">
                  Post to all platforms at once from The Button's Marketing Center
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Social Inbox</h5>
                <p className="text-xs text-brand-text-secondary">
                  Manage comments and messages from all platforms in one place
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Performance Tracking</h5>
                <p className="text-xs text-brand-text-secondary">
                  Compare post performance across platforms to optimize strategy
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Eye className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Brand Monitoring</h5>
                <p className="text-xs text-brand-text-secondary">
                  Track mentions, hashtags, and sentiment across all platforms
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
              <h5 className="font-medium text-brand-text-primary mb-1">OAuth Connections Required</h5>
              <p className="text-sm text-brand-text-secondary mb-2">
                Each platform requires OAuth authorization to post and access data:
              </p>
              <ul className="text-xs text-brand-text-secondary space-y-1 pl-4">
                <li>• <strong>Facebook:</strong> Create App at developers.facebook.com</li>
                <li>• <strong>Instagram:</strong> Requires Facebook Business account</li>
                <li>• <strong>Twitter/X:</strong> Create App at developer.twitter.com</li>
                <li>• <strong>LinkedIn:</strong> Create App at developer.linkedin.com</li>
              </ul>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-brand-text-secondary mt-0.5" />
            <div>
              <h5 className="font-medium text-brand-text-primary mb-1">Permissions Required</h5>
              <p className="text-sm text-brand-text-secondary">
                Apps will request permissions for posting content, reading analytics, and accessing page insights.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}