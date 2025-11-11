
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, Heart, Shield, Handshake, Target, Crown, Award, Star, Flame, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const badgeIcons = {
  // Add new youth-focused badges
  'hot_streak': Flame,
  'pb_destroyer': Target,
  'most_improved': TrendingUp,
  'grinder': Award,
  'supporter': Handshake,
  // Existing badges
  'curling_family': Users,
  'legacy_builder': Heart,
  'mentor_stone': Trophy,
  'safe_sport_champion': Shield,
  'volunteer_hero': Handshake,
  'precision_master': Target,
  'community_leader': Star,
  'granite_guardian': Crown
};

const badgeColors = {
    'hot_streak': 'bg-orange-900/50 text-orange-300',
    'pb_destroyer': 'bg-red-900/50 text-red-300',
    'most_improved': 'bg-green-900/50 text-green-300',
    'grinder': 'bg-purple-900/50 text-purple-300',
    'supporter': 'bg-blue-900/50 text-blue-300',
};

export default function BadgeShelf({ badges }) {
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="text-amber-400" />
          My Badge Collection
        </CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {badges.map((badge, index) => {
              const IconComponent = badgeIcons[badge.badge_id] || Award;
              const colorClass = badgeColors[badge.badge_id] || 'bg-gray-700 text-gray-300';
              return (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center space-y-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClass}`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <p className="text-xs font-medium text-brand-text-primary">{badge.badge_name}</p>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-brand-text-secondary">Your badge collection is empty. Complete challenges to earn them!</p>
        )}
      </CardContent>
    </Card>
  );
}
