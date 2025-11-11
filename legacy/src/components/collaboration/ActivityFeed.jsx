import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, User, Edit, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock activity data - in real app this would come from an audit log
const generateMockActivities = (entityType, entityId) => [
    {
        id: '1',
        type: 'status_change',
        description: 'Status changed from "In Progress" to "Review"',
        user_name: 'Sarah Johnson',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        icon: Edit
    },
    {
        id: '2',
        type: 'comment_added',
        description: 'Added a comment with 2 mentions',
        user_name: 'Mike Chen',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        icon: MessageSquare
    },
    {
        id: '3',
        type: 'assignment',
        description: 'Assigned to Development Team',
        user_name: 'Lisa Wang',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        icon: User
    },
    {
        id: '4',
        type: 'created',
        description: `${entityType} created`,
        user_name: 'David Park',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        icon: Activity
    }
];

function ActivityItem({ activity }) {
    const Icon = activity.icon;
    
    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-3">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                        <Icon className="w-4 h-4 text-brand-text-secondary" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-brand-text-primary">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-brand-text-secondary">
                                by {activity.user_name}
                            </span>
                            <span className="text-xs text-brand-text-secondary">•</span>
                            <span className="text-xs text-brand-text-secondary">
                                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ActivityFeed({ entityType, entityId }) {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading activities
        setTimeout(() => {
            setActivities(generateMockActivities(entityType, entityId));
            setIsLoading(false);
        }, 500);
    }, [entityType, entityId]);

    if (isLoading) {
        return <div className="text-center py-4">Loading activity...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-text-secondary" />
                <h3 className="font-semibold text-brand-text-primary">
                    Recent Activity
                </h3>
            </div>

            <div className="space-y-3">
                {activities.length === 0 ? (
                    <div className="text-center py-8 text-brand-text-secondary">
                        <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No recent activity</p>
                    </div>
                ) : (
                    activities.map(activity => (
                        <ActivityItem key={activity.id} activity={activity} />
                    ))
                )}
            </div>
        </div>
    );
}