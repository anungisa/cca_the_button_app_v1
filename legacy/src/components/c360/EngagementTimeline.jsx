import React, { useState, useEffect } from 'react';
import { ActivityFeed } from '@/api/entities';
import { Clock, Award, Handshake, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const EngagementTimeline = ({ userId }) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await ActivityFeed.filter({ user_id: userId }, '-created_date', 10);
        setActivities(data);
      } catch (error) {
        console.error('Failed to load activity feed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) {
      loadActivities();
    }
  }, [userId]);

  const iconMap = {
    badge_earned: <Award className="w-4 h-4 text-amber-400" />,
    tier_advanced: <Award className="w-4 h-4 text-purple-400" />,
    session_logged: <Clock className="w-4 h-4 text-blue-400" />,
    kudos_received: <Handshake className="w-4 h-4 text-pink-400" />,
    default: <Clock className="w-4 h-4 text-gray-400" />
  };

  if (isLoading) {
    return <p>Loading timeline...</p>;
  }

  if (activities.length === 0) {
    return <p className="text-brand-text-secondary">No recent activity found.</p>;
  }

  return (
    <div className="space-y-6">
      {activities.map(activity => (
        <div key={activity.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-brand-charcoal flex items-center justify-center">
              {iconMap[activity.activity_type] || iconMap.default}
            </div>
            <div className="w-px flex-grow bg-brand-border"></div>
          </div>
          <div>
            <p className="font-medium text-brand-text-primary">{activity.title}</p>
            <p className="text-sm text-brand-text-secondary">{activity.description}</p>
            <p className="text-xs text-brand-text-secondary mt-1">
              {formatDistanceToNow(new Date(activity.created_date), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EngagementTimeline;