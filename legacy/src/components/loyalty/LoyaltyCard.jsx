import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Award } from 'lucide-react';
import { getTierProgress } from '@/components/utils/brandEthos';

export default function LoyaltyCard({ loyaltyData }) {
  if (!loyaltyData) return null;

  const currentXP = loyaltyData.curl_points || 0;
  const tierProgress = getTierProgress(currentXP);
  const currentTier = tierProgress.current;

  return (
    <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          Granite Circle Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tier Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl" role="img" aria-label={currentTier.name}>
              {currentTier.icon}
            </span>
            <div>
              <Badge className={`${currentTier.bgColor} text-white mb-1`}>
                {currentTier.name}
              </Badge>
              <p className="text-sm text-brand-text-secondary">{currentXP} CurlPoints</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {tierProgress.nextTier && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-brand-text-secondary">
                Progress to {tierProgress.nextTier.name}
              </span>
              <span className="text-brand-text-primary font-semibold">
                {Math.round(tierProgress.progress)}%
              </span>
            </div>
            <Progress value={tierProgress.progress} className="h-2" />
            <p className="text-xs text-brand-text-secondary text-right">
              {tierProgress.xpToNext} points to next tier
            </p>
          </div>
        )}

        {/* Badges Count */}
        {loyaltyData.badges && loyaltyData.badges.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-brand-text-secondary">
              {loyaltyData.badges.length} Badge{loyaltyData.badges.length !== 1 ? 's' : ''} Earned
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}