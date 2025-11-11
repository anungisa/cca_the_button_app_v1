import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp } from 'lucide-react';
import { getTierProgress, tierConfig } from '@/components/utils/brandEthos';

export default function XPStatsCard({ loyaltyData }) {
  if (!loyaltyData) return null;

  const currentXP = loyaltyData.curl_points || 0;
  const tierProgress = getTierProgress(currentXP);
  const currentTier = tierProgress.current;

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-text-primary">
          <Zap className="w-5 h-5 text-brand-red" />
          Your Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Tier Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl" role="img" aria-label={currentTier.name}>
              {currentTier.icon}
            </span>
            <div>
              <p className="font-semibold text-brand-text-primary">{currentTier.name}</p>
              <p className="text-sm text-brand-text-secondary">{currentXP} XP</p>
            </div>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {tierProgress.nextTier && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-text-secondary">Next: {tierProgress.nextTier.name}</span>
              <span className="text-brand-text-primary font-medium">{tierProgress.xpToNext} XP to go</span>
            </div>
            <Progress value={tierProgress.progress} className="h-2" />
          </div>
        )}

        {/* Current Tier Benefits */}
        {currentTier.benefits && currentTier.benefits.length > 0 && (
          <div className="pt-3 border-t border-white/10">
            <p className="text-xs font-semibold text-brand-text-secondary mb-2">Your Benefits:</p>
            <div className="space-y-1">
              {currentTier.benefits.slice(0, 3).map((benefit, index) => (
                <p key={index} className="text-xs text-brand-text-secondary flex items-start gap-2">
                  <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0 text-brand-red" />
                  <span>{benefit}</span>
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}