
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  Trophy, 
  Gem,
  Crown,
  Zap
} from 'lucide-react';

const tierConfig = {
  granite_rookie: {
    name: "Granite Rookie",
    icon: Gem,
    color: "bg-gray-100 text-gray-800",
    gradient: "from-gray-400 to-gray-600"
  },
  sheet_champion: {
    name: "Sheet Champion", 
    icon: Trophy,
    color: "bg-blue-100 text-blue-800",
    gradient: "from-blue-400 to-blue-600"
  },
  house_hero: {
    name: "House Hero",
    icon: Crown,
    color: "bg-amber-100 text-amber-800",
    gradient: "from-amber-400 to-amber-600"
  }
};

export default function XPBar({ loyaltyData, compact = false, showBadges = true }) {
  if (!loyaltyData) return null;

  const tier = tierConfig[loyaltyData.tier] || tierConfig.granite_rookie;
  const TierIcon = tier.icon;
  
  const progressPercent = loyaltyData.tier_progress ? 
    (loyaltyData.tier_progress.current_xp / loyaltyData.tier_progress.next_tier_xp) * 100 : 0;

  if (compact) {
    return (
      <Card className={`bg-gradient-to-r ${tier.gradient} text-white`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TierIcon className="w-6 h-6" />
              <div>
                <p className="font-bold">{tier.name}</p>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span className="font-semibold">{loyaltyData.curl_points}</span>
                </div>
              </div>
            </div>
            
            {loyaltyData.tier_progress && (
              <div className="text-right">
                <p className="text-xs opacity-90">
                  {loyaltyData.tier_progress.current_xp} / {loyaltyData.tier_progress.next_tier_xp} XP
                </p>
                <Progress 
                  value={progressPercent} 
                  className="w-20 h-2 bg-white/20"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-r ${tier.gradient} text-white`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TierIcon className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <p className="opacity-90 text-sm">The Granite Circle</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-amber-300" />
              <span className="text-2xl font-bold">{loyaltyData.curl_points}</span>
            </div>
            <p className="text-sm opacity-90">CurlPoints</p>
          </div>
        </div>

        {loyaltyData.tier_progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm opacity-90">
              <span>Progress to next tier</span>
              <span>{loyaltyData.tier_progress.current_xp} / {loyaltyData.tier_progress.next_tier_xp} XP</span>
            </div>
            <Progress 
              value={progressPercent} 
              className="bg-white/20"
            />
          </div>
        )}

        {showBadges && loyaltyData.badges && loyaltyData.badges.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Recent Badges</span>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {loyaltyData.badges.slice(-3).map((badge, index) => (
                <div key={index} className="flex-shrink-0 bg-white/20 rounded-lg p-2 min-w-0">
                  <p className="text-xs font-medium truncate">{badge.badge_name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
