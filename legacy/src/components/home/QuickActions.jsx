import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  Video, 
  ShoppingCart, 
  Users,
  Trophy,
  Shield,
  Zap,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';

const actions = [
  { title: 'Events', icon: Calendar, href: 'Events', description: 'Find tournaments' },
  { title: 'Watch Live', icon: Video, href: 'Streaming', description: 'Curling+ streams' },
  { title: 'Reward Store', icon: ShoppingCart, href: 'RewardStore', description: 'Redeem points' },
  { title: 'Community', icon: Users, href: 'CommunityHub', description: 'Join discussion' },
];

const athleteActions = [
    { title: 'Performance Center', icon: Trophy, href: 'PerformanceCenter', description: 'Track your progress' },
    { title: 'SmartBroom', icon: Zap, href: 'SmartBroomHub', description: 'Sync your data' },
]

const adminActions = [
    { title: 'Staff HQ', icon: Shield, href: 'StaffHQ', description: 'Admin tools' },
    { title: 'Find a Club', icon: Building, href: 'Clubs', description: 'Manage clubs' },
];

const ActionTile = ({ title, icon: Icon, href, description }) => (
    <Link to={createPageUrl(href)}>
        <motion.div whileHover={{ y: -5, scale: 1.05 }} className="h-full">
            <Card className="bg-brand-card-bg border-brand-border hover:border-brand-red transition-colors h-full">
                <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                    <Icon className="w-8 h-8 text-brand-red mb-3" />
                    <h3 className="font-semibold text-brand-text-primary">{title}</h3>
                    <p className="text-xs text-brand-text-secondary">{description}</p>
                </CardContent>
            </Card>
        </motion.div>
    </Link>
);


export default function QuickActions({ user }) {
  let displayedActions = [...actions];
  if (user?.user_type === 'athlete' || user?.user_type === 'coach') {
      displayedActions = [...displayedActions, ...athleteActions];
  }
  if (user?.role === 'admin') {
      displayedActions = [...displayedActions, ...adminActions];
  }
  // Remove duplicates and limit to 4 for a clean look on the dashboard
  const finalActions = [...new Map(displayedActions.map(item => [item.title, item])).values()].slice(0, 4);

  return (
    <div>
      <h2 className="text-xl font-semibold text-brand-text-primary mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {finalActions.map((action) => (
          <ActionTile key={action.title} {...action} />
        ))}
      </div>
    </div>
  );
}