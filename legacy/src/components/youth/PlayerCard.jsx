import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Trophy, Calendar, Users, Star, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PlayerCard({ user, loyaltyData, totalMilestones, completedCount }) {
  if (!user || !loyaltyData) return null;

  const developmentProgress = totalMilestones > 0 ? (completedCount / totalMilestones) * 100 : 0;

  return (
    <Link to={createPageUrl('Profile')} className="block hover:scale-[1.01] transition-transform duration-200">
      <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/30 h-full flex flex-col">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-brand-red">
              <AvatarImage src={user.profile_image_url} alt={user.full_name} />
              <AvatarFallback className="bg-brand-red text-white text-xl">
                {user.full_name?.charAt(0).toUpperCase() || 'Y'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">{user.full_name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-green-600 text-white text-xs">Learning</Badge>
                {user.home_club_name && (
                   <Badge variant="outline" className="text-xs text-brand-text-secondary border-brand-border">
                    {user.home_club_name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-baseline justify-between text-white">
             <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-lg">{loyaltyData.tier.replace('_', ' ')} Curler</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-lg">{loyaltyData.curl_points} XP</span>
              </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-brand-text-primary">Development Progress</span>
              <span className="text-sm font-bold text-white">{completedCount}/{totalMilestones}</span>
            </div>
            <Progress value={developmentProgress} className="w-full h-2 [&>div]:bg-green-400" />
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-brand-text-primary mb-2">Your Journey Stats</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-text-secondary" />
                <span className="text-brand-text-primary">Sessions: <span className="font-bold text-white">12</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-brand-text-secondary" />
                <span className="text-brand-text-primary">Games: <span className="font-bold text-white">8</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-text-secondary" />
                <span className="text-brand-text-primary">Events: <span className="font-bold text-white">2</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-brand-text-secondary" />
                <span className="text-brand-text-primary">Vol. Hours: <span className="font-bold text-white">6</span></span>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </Link>
  );
}