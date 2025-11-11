import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Users, 
  Star,
  TrendingUp,
  Award
} from 'lucide-react';

export default function ClubHeroCard({ clubLoyalty }) {
  // Provide safe defaults for all properties
  const safeClubLoyalty = {
    recognition_level: 'bronze',
    hero_program_settings: {
      club_name: 'Your Club'
    },
    monthly_stats: {
      active_members: 0,
      points_distributed: 0,
      rank_in_region: null
    },
    grant_bonus_earned: 0,
    ...clubLoyalty
  };

  // Dark-theme friendly colors for badges
  const recognitionColors = {
    bronze: 'bg-orange-900/50 text-orange-300 border-orange-800/50',
    silver: 'bg-gray-700 text-gray-200 border-gray-600',
    gold: 'bg-amber-900/50 text-yellow-300 border-amber-700/50',
    platinum: 'bg-purple-900/50 text-purple-300 border-purple-700/50'
  };

  const getNextTier = (current) => {
    const tiers = ['bronze', 'silver', 'gold', 'platinum'];
    const currentIndex = tiers.indexOf(current);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  };

  const nextTier = getNextTier(safeClubLoyalty.recognition_level);
  const progress = Math.min((safeClubLoyalty.monthly_stats.points_distributed / 1000) * 100, 100);

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-brand-text-primary">Club Hero Program</CardTitle>
            <p className="text-brand-text-secondary text-sm mt-1">
              {safeClubLoyalty.hero_program_settings?.club_name || 'Your Club'}
            </p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className={`${recognitionColors[safeClubLoyalty.recognition_level]} text-xs`}>
              {safeClubLoyalty.recognition_level} tier
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-4 h-4 text-brand-text-secondary" />
                <span className="text-2xl font-bold text-brand-text-primary">
                  {safeClubLoyalty.monthly_stats?.active_members || 0}
                </span>
              </div>
              <p className="text-brand-text-secondary text-xs">Active Members</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 text-amber-300" />
                <span className="text-2xl font-bold text-brand-text-primary">
                  {safeClubLoyalty.monthly_stats?.points_distributed || 0}
                </span>
              </div>
              <p className="text-brand-text-secondary text-xs">Points Distributed</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span className="text-2xl font-bold text-brand-text-primary">
                  #{safeClubLoyalty.monthly_stats?.rank_in_region || 'N/A'}
                </span>
              </div>
              <p className="text-brand-text-secondary text-xs">Regional Rank</p>
            </div>
          </div>

          {/* Progress to next tier */}
          {nextTier && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-brand-text-secondary">
                <span>Progress to {nextTier}</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="bg-brand-border [&>div]:bg-brand-red" />
            </div>
          )}

          {/* Grant bonus */}
          {safeClubLoyalty.grant_bonus_earned > 0 && (
            <div className="bg-brand-charcoal rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-300" />
                <span className="font-semibold text-brand-text-primary">Grant Bonus Earned</span>
              </div>
              <div className="text-2xl font-bold text-amber-300">
                ${safeClubLoyalty.grant_bonus_earned.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}