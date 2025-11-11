import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Calendar, Building, Users, Trophy, 
  Star, Target, Zap 
} from 'lucide-react';

export default function QuickActionTiles({ user }) {
  // Guard against null user
  if (!user) {
    return null;
  }

  const actions = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Find Events',
      description: 'Discover upcoming curling events',
      href: 'Events',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: 'Explore Clubs',
      description: 'Find your local curling club',
      href: 'Clubs',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community',
      description: 'Connect with fellow curlers',
      href: 'CommunityHub',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: 'My Performance',
      description: 'Track your progress',
      href: 'PerformanceCenter',
      color: 'from-amber-500 to-amber-600',
      show: user.user_type === 'athlete' || user.user_type === 'coach',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions
        .filter(action => action.show === undefined || action.show === true)
        .map((action, index) => (
          <Link key={index} to={createPageUrl(action.href)}>
            <Card className="bg-brand-card-bg border-brand-border hover:border-brand-red transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-4`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold text-brand-text-primary mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-brand-text-secondary">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
    </div>
  );
}