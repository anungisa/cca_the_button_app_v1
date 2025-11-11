import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, ExternalLink, Loader2 } from 'lucide-react';
import { giveCloudSync } from '@/api/functions';

export default function GiveCloudWidget({ campaignId, showDonateButton = true }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (campaignId) {
      loadStats();
    }
  }, [campaignId]);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const response = await giveCloudSync({ 
        action: 'get_campaign_stats',
        campaign_id: campaignId
      });
      
      if (response.data?.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Failed to load campaign stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDonate = async () => {
    try {
      const response = await giveCloudSync({
        action: 'create_donation_link',
        campaign_id: campaignId
      });
      
      if (response.data?.link) {
        window.open(response.data.link, '_blank');
      }
    } catch (error) {
      console.error('Failed to create donation link:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" />
          {stats.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-brand-text-secondary">{stats.description}</p>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold">${stats.raised?.toLocaleString() || 0}</span>
            <span className="text-brand-text-secondary">of ${stats.goal?.toLocaleString() || 0}</span>
          </div>
          <Progress value={stats.percentage || 0} className="h-3" />
          <p className="text-xs text-brand-text-secondary mt-1">
            {stats.donor_count || 0} supporters
          </p>
        </div>

        {showDonateButton && (
          <Button 
            onClick={handleDonate}
            className="w-full bg-pink-500 hover:bg-pink-600"
          >
            <Heart className="w-4 h-4 mr-2" />
            Donate Now
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}