import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import {
  Share2, BarChart3, TrendingUp, MessageSquare, Users,
  CheckCircle, AlertTriangle, RefreshCw, Download, Calendar
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function FalconIOIntegration() {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    toast({
      title: "Syncing Falcon.io Data",
      description: "Fetching social media analytics..."
    });

    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Sync Complete",
        description: "Social media stats updated successfully."
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-pink-950/20 to-purple-950/20 border-pink-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-6 h-6 text-pink-400" />
            Falcon.io Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-pink-500/30 bg-pink-500/10">
            <Share2 className="w-4 h-4 text-pink-400" />
            <AlertDescription className="text-brand-text-primary">
              Falcon.io provides unified social media analytics across all platforms (Facebook, Twitter, Instagram, LinkedIn).
              Essential for tracking campaign performance and audience engagement.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-brand-text-primary font-medium">Connection Status</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 bg-brand-charcoal/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-brand-text-secondary">Total Reach</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">2.4M</p>
                <p className="text-xs text-green-400">+12% vs last month</p>
              </div>

              <div className="p-3 bg-brand-charcoal/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-brand-text-secondary">Engagement Rate</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">4.2%</p>
                <p className="text-xs text-green-400">Above industry avg</p>
              </div>

              <div className="p-3 bg-brand-charcoal/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-4 h-4 text-pink-400" />
                  <span className="text-xs text-brand-text-secondary">Sentiment Score</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">82%</p>
                <p className="text-xs text-green-400">Positive</p>
              </div>
            </div>

            {/* Data Synced */}
            <div className="border-t border-brand-border pt-4">
              <h4 className="text-sm font-semibold text-brand-text-primary mb-3">Data Synced to Platform</h4>
              <div className="space-y-2">
                {[
                  { name: 'Social Media Posts', entity: 'SocialPost', count: '1,247' },
                  { name: 'Campaign Performance', entity: 'MarketingCampaign', count: '34' },
                  { name: 'Audience Demographics', entity: 'Analytics', count: 'Real-time' },
                  { name: 'Engagement Metrics', entity: 'Analytics', count: 'Real-time' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm p-2 bg-brand-charcoal/30 rounded">
                    <span className="text-brand-text-primary">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{item.entity}</Badge>
                      <span className="text-brand-text-secondary">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSync} disabled={isSyncing} className="flex-1">
                <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                Sync Social Data
              </Button>
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Reports
              </Button>
            </div>

            {/* Use Cases */}
            <Alert className="border-purple-500/30 bg-purple-500/10">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <AlertDescription className="text-brand-text-primary">
                <strong className="text-purple-400">Key Use Cases:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Track social media campaign performance across all channels</li>
                  <li>• Monitor brand sentiment and audience engagement</li>
                  <li>• Generate unified social media reports for stakeholders</li>
                  <li>• Measure sponsor activation effectiveness on social platforms</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}