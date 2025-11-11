import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, TrendingUp, Users, 
  BarChart3, Shield, Eye, Key
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function PointsBetIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const [pointsbetConfig, setPointsbetConfig] = useState({
    apiKey: '',
    partnerId: ''
  });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `PointsBet ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    if (!pointsbetConfig.apiKey) {
      toast({
        variant: "destructive",
        title: "Missing Credentials",
        description: "Please enter PointsBet API Key.",
      });
      return;
    }

    setConnectionStatus({ connected: false, loading: true });
    
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "PointsBet Connection",
        description: "Connection test coming soon. PointsBet API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-purple-950/20 to-indigo-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-400" />
            PointsBet Sponsorship Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            PointsBet sponsors The Button's prediction games and live odds features. This integration 
            provides live game probabilities, tracks user predictions, and measures sponsorship ROI 
            through engagement metrics.
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
                <Label htmlFor="apiKey" className="text-sm text-brand-text-secondary">
                  PointsBet API Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={pointsbetConfig.apiKey}
                  onChange={(e) => setPointsbetConfig({...pointsbetConfig, apiKey: e.target.value})}
                  placeholder="API Key"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Provided by PointsBet Partnership Team
                </p>
              </div>
              
              <div>
                <Label htmlFor="partnerId" className="text-sm text-brand-text-secondary">
                  Partner ID
                </Label>
                <Input
                  id="partnerId"
                  value={pointsbetConfig.partnerId}
                  onChange={(e) => setPointsbetConfig({...pointsbetConfig, partnerId: e.target.value})}
                  placeholder="Partner ID"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Your unique PointsBet partner identifier
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
              <strong>Integration In Development:</strong> PointsBet live odds API, prediction tracking, 
              and sponsorship ROI analytics coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>PointsBet Features</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="odds" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="odds">
                <Target className="w-4 h-4 mr-2" />
                Live Odds
              </TabsTrigger>
              <TabsTrigger value="predictions">
                <TrendingUp className="w-4 h-4 mr-2" />
                Predictions
              </TabsTrigger>
              <TabsTrigger value="engagement">
                <Users className="w-4 h-4 mr-2" />
                Engagement
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                ROI Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="odds" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Live Game Odds</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Display real-time win probabilities and betting odds during live streams for educational purposes.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Live Games w/ Odds</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Odds Updates/Day</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('odds')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Odds Data
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="predictions" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Prediction Tracking</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Track user predictions, accuracy rates, and XP rewards for gamified engagement.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Total Predictions</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <p className="text-xs text-brand-text-secondary">Avg Accuracy</p>
                    <p className="text-2xl font-bold text-brand-text-primary">-%</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('predictions')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Sync Predictions
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">User Engagement</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Monitor how fans interact with PointsBet-sponsored prediction features and quests.
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Active Predictors</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Avg Predictions/User</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">XP Awarded (Total)</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
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

            <TabsContent value="analytics" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Sponsorship ROI</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Measure PointsBet's sponsorship ROI through brand impressions, engagement, and conversion metrics.
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Brand Impressions</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Click-Through Rate</span>
                    <span className="text-sm font-medium text-brand-text-primary">-%</span>
                  </div>
                  <div className="flex justify-between p-2 bg-brand-card-bg rounded">
                    <span className="text-sm text-brand-text-secondary">Quest Completions</span>
                    <span className="text-sm font-medium text-brand-text-primary">-</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('analytics')} 
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Generate ROI Report
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
              <Target className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Live Win Probability</h5>
                <p className="text-xs text-brand-text-secondary">
                  Display real-time win probabilities during live streams for fan engagement
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Prediction Games</h5>
                <p className="text-xs text-brand-text-secondary">
                  Gamified prediction system that awards XP for correct predictions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Shield className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Age Verification</h5>
                <p className="text-xs text-brand-text-secondary">
                  18+ age gating and consent management for responsible gaming
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Eye className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Sponsorship Tracking</h5>
                <p className="text-xs text-brand-text-secondary">
                  Track brand impressions, engagement, and ROI for sponsorship reporting
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance & Responsible Gaming */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            Compliance & Responsible Gaming
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert className="border-amber-500/50 bg-amber-500/10">
            <Shield className="h-4 w-4 text-amber-400" />
            <AlertDescription className="text-amber-200">
              <strong>Age Verification Required:</strong> All prediction games and odds displays 
              require users to be 18+ and provide gambling consent. The Button enforces this through 
              age gating and consent management.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 text-sm text-brand-text-secondary">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              <div>
                <div className="font-medium text-brand-text-primary">No Real Money Wagering</div>
                <div className="text-xs">Predictions are for entertainment and XP rewards only</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              <div>
                <div className="font-medium text-brand-text-primary">Educational Content</div>
                <div className="text-xs">Odds displayed for educational purposes to enhance fan understanding</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              <div>
                <div className="font-medium text-brand-text-primary">Consent Management</div>
                <div className="text-xs">Users must explicitly opt-in to see odds and participate in predictions</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              <div>
                <div className="font-medium text-brand-text-primary">Audit Trail</div>
                <div className="text-xs">All predictions and engagements are logged for compliance reporting</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sponsorship ROI Dashboard */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Sponsorship Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/50">
              <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Current Campaign Performance
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-brand-card-bg rounded">
                  <p className="text-xs text-brand-text-secondary mb-1">Total Impressions</p>
                  <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  <p className="text-xs text-green-400 mt-1">+0% vs last month</p>
                </div>
                <div className="text-center p-3 bg-brand-card-bg rounded">
                  <p className="text-xs text-brand-text-secondary mb-1">User Engagement</p>
                  <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  <p className="text-xs text-green-400 mt-1">+0% vs last month</p>
                </div>
                <div className="text-center p-3 bg-brand-card-bg rounded">
                  <p className="text-xs text-brand-text-secondary mb-1">Predictions Made</p>
                  <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  <p className="text-xs text-green-400 mt-1">+0% vs last month</p>
                </div>
                <div className="text-center p-3 bg-brand-card-bg rounded">
                  <p className="text-xs text-brand-text-secondary mb-1">Quest Completions</p>
                  <p className="text-2xl font-bold text-brand-text-primary">-</p>
                  <p className="text-xs text-green-400 mt-1">+0% vs last month</p>
                </div>
              </div>
            </div>

            <div className="bg-brand-charcoal/30 rounded-lg p-4">
              <h4 className="font-medium text-brand-text-primary mb-2">Active Sponsor Quests</h4>
              <p className="text-sm text-brand-text-secondary mb-3">
                PointsBet-sponsored quests and challenges currently running:
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-brand-text-primary">Prediction Streak Challenge</span>
                    <Badge className="bg-purple-600 text-white text-xs">Active</Badge>
                  </div>
                  <p className="text-xs text-brand-text-secondary mt-1">Make 5 correct predictions in a row</p>
                </div>
                <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-brand-text-primary">Daily Prediction</span>
                    <Badge className="bg-purple-600 text-white text-xs">Active</Badge>
                  </div>
                  <p className="text-xs text-brand-text-secondary mt-1">Make at least one prediction per day</p>
                </div>
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
              <h5 className="font-medium text-brand-text-primary mb-1">Partnership Credentials</h5>
              <p className="text-sm text-brand-text-secondary">
                API credentials are provided by PointsBet's Partnership Team. Contact your 
                PointsBet account manager to obtain your API key and partner ID.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-brand-text-secondary mt-0.5" />
            <div>
              <h5 className="font-medium text-brand-text-primary mb-1">Responsible Gaming</h5>
              <p className="text-sm text-brand-text-secondary">
                This integration is designed for educational and entertainment purposes only. 
                No real money wagering occurs through The Button. All features comply with 
                Canadian gaming regulations.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-brand-text-secondary mt-0.5" />
            <div>
              <h5 className="font-medium text-brand-text-primary mb-1">PointsBet Partnership</h5>
              <p className="text-sm text-brand-text-secondary mb-2">
                This integration is part of Curling Canada's official sponsorship with PointsBet.
              </p>
              <a 
                href="https://pointsbet.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:underline flex items-center gap-1"
              >
                Visit PointsBet
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}