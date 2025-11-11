import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, TrendingUp, Heart, 
  AlertCircle, Users, BarChart3, Target
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function BrandwatchIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Brandwatch ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    setConnectionStatus({ connected: false, loading: true });
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Brandwatch Integration",
        description: "Connection setup coming soon. Brandwatch API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            Brandwatch Social Listening Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Brandwatch monitors social media conversations about curling, tracks brand sentiment, 
            identifies influencers, and provides crisis detection for Curling Canada's communications team.
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
              <strong>Integration In Development:</strong> Brandwatch API integration is currently being built. 
              Social listening, sentiment analysis, and influencer tracking coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Monitoring & Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="conversations" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="conversations">
                <MessageSquare className="w-4 h-4 mr-2" />
                Conversations
              </TabsTrigger>
              <TabsTrigger value="sentiment">
                <Heart className="w-4 h-4 mr-2" />
                Sentiment
              </TabsTrigger>
              <TabsTrigger value="influencers">
                <Users className="w-4 h-4 mr-2" />
                Influencers
              </TabsTrigger>
              <TabsTrigger value="crisis">
                <AlertCircle className="w-4 h-4 mr-2" />
                Crisis Detection
              </TabsTrigger>
            </TabsList>

            {/* Conversations Tab */}
            <TabsContent value="conversations" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Social Mentions</div>
                    <div className="text-sm text-brand-text-secondary">
                      Track mentions of Curling Canada, events, athletes, and sponsors across social platforms
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Trending Topics</div>
                    <div className="text-sm text-brand-text-secondary">
                      Identify trending curling topics and hashtags in real-time
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Volume Analysis</div>
                    <div className="text-sm text-brand-text-secondary">
                      Monitor conversation volume during events and campaigns
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Keyword Tracking</div>
                    <div className="text-sm text-brand-text-secondary">
                      Custom queries for events (Brier, Scotties), teams, and initiatives
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Conversation')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Conversation Data</>
                )}
              </Button>
            </TabsContent>

            {/* Sentiment Tab */}
            <TabsContent value="sentiment" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-pink-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Brand Sentiment</div>
                    <div className="text-sm text-brand-text-secondary">
                      Track overall sentiment (positive, neutral, negative) about Curling Canada
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Event Sentiment</div>
                    <div className="text-sm text-brand-text-secondary">
                      Monitor sentiment during live events to gauge fan experience
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Athlete Perception</div>
                    <div className="text-sm text-brand-text-secondary">
                      Track sentiment around national teams and individual athletes
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Initiative Performance</div>
                    <div className="text-sm text-brand-text-secondary">
                      Measure public reception of new programs and initiatives
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Sentiment')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Sentiment Data</>
                )}
              </Button>
            </TabsContent>

            {/* Influencers Tab */}
            <TabsContent value="influencers" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-indigo-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Influencer Identification</div>
                    <div className="text-sm text-brand-text-secondary">
                      Identify key voices in the curling community with significant reach
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Reach Analysis</div>
                    <div className="text-sm text-brand-text-secondary">
                      Measure follower counts, engagement rates, and amplification potential
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Brand Ambassadors</div>
                    <div className="text-sm text-brand-text-secondary">
                      Track athletes, coaches, and fans who actively promote curling
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Engagement Metrics</div>
                    <div className="text-sm text-brand-text-secondary">
                      Analyze likes, shares, comments, and overall engagement levels
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Influencer')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Influencer Data</>
                )}
              </Button>
            </TabsContent>

            {/* Crisis Detection Tab */}
            <TabsContent value="crisis" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Real-Time Alerts</div>
                    <div className="text-sm text-brand-text-secondary">
                      Immediate notifications when negative sentiment spikes or crises emerge
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-orange-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Volume Spike Detection</div>
                    <div className="text-sm text-brand-text-secondary">
                      Detect unusual spikes in conversation volume that may indicate issues
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-pink-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Sentiment Monitoring</div>
                    <div className="text-sm text-brand-text-secondary">
                      Track rapid sentiment shifts that could signal brand issues
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Incident Logging</div>
                    <div className="text-sm text-brand-text-secondary">
                      Auto-create incidents in The Button when crisis thresholds are met
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Crisis')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Crisis Alerts</>
                )}
              </Button>
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
              <h5 className="text-xs font-semibold text-green-400 mb-1 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Real-Time Social Intelligence
              </h5>
              <p className="text-xs text-brand-text-secondary">
                Monitor what fans, athletes, and media are saying about curling in real-time across all social platforms
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg">
              <h5 className="text-xs font-semibold text-blue-400 mb-1 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Campaign Performance
              </h5>
              <p className="text-xs text-brand-text-secondary">
                Measure the impact of marketing campaigns and track hashtag performance
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg">
              <h5 className="text-xs font-semibold text-purple-400 mb-1 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Influencer Partnerships
              </h5>
              <p className="text-xs text-brand-text-secondary">
                Identify and engage with key influencers who can amplify curling content
              </p>
            </div>
            <div className="p-4 bg-red-500/10 rounded-lg">
              <h5 className="text-xs font-semibold text-red-400 mb-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Crisis Management
              </h5>
              <p className="text-xs text-brand-text-secondary">
                Detect and respond to negative sentiment or PR issues before they escalate
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Use Cases */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Key Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-purple-500/30">
              <h4 className="font-medium text-purple-400 mb-2">Event Buzz Tracking</h4>
              <p className="text-sm text-brand-text-secondary">
                Monitor social conversations during Brier, Scotties, and other championships to measure fan engagement
              </p>
            </div>
            <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-blue-500/30">
              <h4 className="font-medium text-blue-400 mb-2">Sponsor ROI Measurement</h4>
              <p className="text-sm text-brand-text-secondary">
                Track sponsor mentions and sentiment to demonstrate partnership value
              </p>
            </div>
            <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-green-500/30">
              <h4 className="font-medium text-green-400 mb-2">Competitive Intelligence</h4>
              <p className="text-sm text-brand-text-secondary">
                Monitor conversations about other curling organizations and international federations
              </p>
            </div>
            <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-red-500/30">
              <h4 className="font-medium text-red-400 mb-2">Crisis Room Integration</h4>
              <p className="text-sm text-brand-text-secondary">
                Auto-populate Crisis Room dashboard with real-time social intelligence during issues
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Technical Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Integration Method:</span>
              <span className="text-brand-text-primary font-medium">REST API + Streaming API</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Authentication:</span>
              <span className="text-brand-text-primary font-medium">OAuth 2.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Sync Frequency:</span>
              <span className="text-brand-text-primary font-medium">Real-time streaming + Hourly snapshots</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Data Storage:</span>
              <span className="text-brand-text-primary font-medium">Supabase + DOMO Analytics</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Platforms Monitored:</span>
              <span className="text-brand-text-primary font-medium">Twitter, Facebook, Instagram, Reddit, News</span>
            </div>
          </div>

          <Button variant="outline" onClick={() => window.open('https://brandwatch.com', '_blank')} className="w-full mt-4">
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit Brandwatch
          </Button>
        </CardContent>
      </Card>

      {/* Monitoring Queries */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Active Monitoring Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="p-3 bg-brand-charcoal/50 rounded border border-brand-border">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-brand-text-primary">"Curling Canada" OR "Team Canada Curling"</span>
                <Badge className="bg-purple-500/20 text-purple-400">Core Brand</Badge>
              </div>
              <div className="text-xs text-brand-text-secondary">Primary brand monitoring query</div>
            </div>
            <div className="p-3 bg-brand-charcoal/50 rounded border border-brand-border">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-brand-text-primary">#Brier OR #Scotties OR #CurlingWorlds</span>
                <Badge className="bg-blue-500/20 text-blue-400">Championships</Badge>
              </div>
              <div className="text-xs text-brand-text-secondary">Major championship tracking</div>
            </div>
            <div className="p-3 bg-brand-charcoal/50 rounded border border-brand-border">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-brand-text-primary">@CurlingCanada mentions</span>
                <Badge className="bg-green-500/20 text-green-400">Direct Mentions</Badge>
              </div>
              <div className="text-xs text-brand-text-secondary">Official account mentions across platforms</div>
            </div>
            <div className="p-3 bg-brand-charcoal/50 rounded border border-brand-border">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-brand-text-primary">"Team Gushue" OR "Team Jones" OR "Team Einarson"</span>
                <Badge className="bg-amber-500/20 text-amber-400">National Teams</Badge>
              </div>
              <div className="text-xs text-brand-text-secondary">Track conversations about top Canadian teams</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automation Workflows */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Automated Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="font-medium text-red-400">Crisis Alert</span>
              </div>
              <p className="text-xs text-brand-text-secondary">
                When: Negative sentiment &gt; 60% AND volume spike &gt; 300%
                <br />
                Action: Create Incident + Notify Crisis Room team + Alert Executive
              </p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="font-medium text-green-400">Viral Content</span>
              </div>
              <p className="text-xs text-brand-text-secondary">
                When: Positive post reaches &gt; 10k engagements
                <br />
                Action: Notify Marketing team + Add to content library + Award XP to user (if Button member)
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="font-medium text-blue-400">Influencer Outreach</span>
              </div>
              <p className="text-xs text-brand-text-secondary">
                When: New influencer detected with &gt; 5k followers + curling content
                <br />
                Action: Add to influencer database + Create outreach task for Marketing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}