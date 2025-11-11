import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Users, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const getActivityIcon = (activityType) => {
  switch (activityType) {
    case 'badge_earned': return Trophy;
    case 'club_joined': return Users;
    case 'tier_advanced': return Award;
    default: return Clock;
  }
};

const getActivityColor = (activityType) => {
  switch (activityType) {
    case 'badge_earned': return 'text-amber-400';
    case 'club_joined': return 'text-blue-400';
    case 'tier_advanced': return 'text-purple-400';
    default: return 'text-brand-text-secondary';
  }
};

export default function ActivityFeedCard({ activities = [] }) {
  if (!activities || activities.length === 0) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-red" />
            Community Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-brand-text-secondary py-8">
          No recent activity to display.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-red" />
          Community Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const IconComponent = getActivityIcon(activity.activity_type);
            const iconColor = getActivityColor(activity.activity_type);
            
            return (
              <motion.div
                key={activity.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-brand-charcoal rounded-lg"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-brand-card-bg border border-brand-border`}>
                  <IconComponent className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-brand-text-primary">{activity.title}</p>
                    <span className="text-xs text-brand-text-secondary">
                      {formatDistanceToNow(new Date(activity.created_date || new Date()), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-brand-text-secondary">{activity.description}</p>
                  {activity.metadata?.xp_amount && (
                    <Badge className="mt-1 bg-amber-500/20 text-amber-300 text-xs">
                      +{activity.metadata.xp_amount} XP
                    </Badge>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}