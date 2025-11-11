import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Star, Award, TrendingUp } from 'lucide-react';

export default function ProfileStats({ loyaltyData }) {
  // Guard against null loyaltyData
  if (!loyaltyData) {
    return null;
  }

  const stats = [
    {
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
      label: 'Total XP',
      value: loyaltyData.curl_points || 0,
    },
    {
      icon: <Star className="w-5 h-5 text-blue-500" />,
      label: 'Current Tier',
      value: loyaltyData.tier ? loyaltyData.tier.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Granite Rookie',
    },
    {
      icon: <Award className="w-5 h-5 text-green-500" />,
      label: 'Badges Earned',
      value: loyaltyData.badges ? loyaltyData.badges.length : 0,
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-purple-500" />,
      label: 'Progress to Next',
      value: loyaltyData.tier_progress 
        ? `${Math.round((loyaltyData.tier_progress.current_xp / loyaltyData.tier_progress.next_tier_xp) * 100)}%`
        : '0%',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-text-primary">{stat.value}</p>
                <p className="text-sm text-brand-text-secondary">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}