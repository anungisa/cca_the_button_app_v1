
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { tierConfig } from '../utils/brandEthos';

export default function FanOSOverview({ loyaltyData }) {
  if (!loyaltyData) return null;

  // Add a safety check for tierConfig to prevent crashes
  if (!tierConfig) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-6 flex items-center justify-center h-24">
          <Loader2 className="w-6 h-6 animate-spin text-brand-text-secondary" />
        </CardContent>
      </Card>
    );
  }

  const currentTier = tierConfig[loyaltyData.tier] || tierConfig.granite_rookie;
  const nextTierKey = currentTier.nextTier;
  const nextTier = tierConfig[nextTierKey];
  
  const progressPercent = nextTier ? 
    (loyaltyData.tier_progress.current_xp / nextTier.xpRequired) * 100 : 100;

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="flex items-center gap-4">
          <Zap className="w-10 h-10 text-yellow-400" />
          <div>
            <p className="text-brand-text-secondary">Your Points</p>
            <p className="text-3xl font-bold">{loyaltyData.curl_points?.toLocaleString() || 0}</p>
          </div>
        </div>
        
        <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-2">
                <p className="text-brand-text-secondary">Loyalty Tier: <span className="font-semibold text-brand-text-primary">{currentTier.name}</span></p>
                {nextTier && <p className="text-sm text-brand-text-secondary">Next: {nextTier.name}</p>}
            </div>
            <Progress value={progressPercent} className="h-3" />
             <div className="flex justify-between items-center mt-1 text-xs text-brand-text-secondary">
                <span>{loyaltyData.tier_progress.current_xp} XP</span>
                {nextTier && <span>{nextTier.xpRequired} XP</span>}
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
