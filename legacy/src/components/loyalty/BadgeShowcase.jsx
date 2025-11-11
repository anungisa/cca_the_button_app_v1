import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Users, 
  Trophy, 
  Shield, 
  Star,
  Handshake,
  Target,
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';

const badgeIcons = {
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
  'curling_family': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'legacy_builder': 'bg-red-500/20 text-red-300 border-red-500/30',
  'mentor_stone': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'safe_sport_champion': 'bg-green-500/20 text-green-300 border-green-500/30',
  'volunteer_hero': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'precision_master': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'community_leader': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'granite_guardian': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
};

export default function BadgeShowcase({ badges = [], compact = false }) {
  const safeBadges = Array.isArray(badges) ? badges : [];
  
  if (safeBadges.length === 0) {
    return compact ? null : (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="text-center py-8">
          <Trophy className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
          <h3 className="font-semibold text-brand-text-primary mb-2">No Badges Yet</h3>
          <p className="text-brand-text-secondary text-sm">Earn badges by volunteering, donating, and participating in events!</p>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {safeBadges.slice(0, 3).map((badge, index) => {
          const IconComponent = badgeIcons[badge.badge_id] || Star;
          return (
            <div key={badge.badge_id || index} className="flex items-center gap-1 px-2 py-1 bg-white/10 border border-white/20 rounded-full">
              <IconComponent className="w-3 h-3 text-brand-red" />
              <span className="text-xs font-medium text-brand-text-primary">{badge.badge_name}</span>
            </div>
          );
        })}
        {safeBadges.length > 3 && (
          <Badge variant="outline" className="text-xs border-white/30 text-brand-text-secondary bg-white/10">
            +{safeBadges.length - 3} more
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-text-primary">
          <Trophy className="w-5 h-5 text-brand-red" />
          Achievement Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {safeBadges.map((badge, index) => {
            const IconComponent = badgeIcons[badge.badge_id] || Star;
            const colorClass = badgeColors[badge.badge_id] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
            
            return (
              <motion.div 
                key={badge.badge_id || index} 
                className="text-center p-4 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className={`w-12 h-12 ${colorClass} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-sm text-brand-text-primary mb-1">{badge.badge_name}</h4>
                <p className="text-xs text-brand-text-secondary">{badge.description}</p>
                <p className="text-xs text-brand-text-secondary mt-1">
                  Earned {badge.earned_date ? new Date(badge.earned_date).toLocaleDateString() : 'Recently'}
                </p>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}