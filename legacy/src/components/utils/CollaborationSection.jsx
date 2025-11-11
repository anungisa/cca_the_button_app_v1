import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send } from 'lucide-react';
import { User } from '@/api/entities';
import { formatDistanceToNow } from 'date-fns';

export default function CollaborationSection({ entityId, entityType, commentEntity, activityEntity }) {
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        const filter = { event_plan_id: entityId }; // This is specific, should be generalized
        const [commentData, activityData] = await Promise.all([
          commentEntity.filter(filter, '-timestamp'),
          activityEntity.filter(filter, '-timestamp')
        ]);
        
        // Assuming comment and activity are the same for EventPlan for now
        // This can be improved to handle different entity comment/activity types
        const combined = [...(commentData || []), ...(activityData || [])]
          .filter(item => item.activity_type !== 'plan_created') // Filter out simple creation
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          
        setActivities(combined);

      } catch (err) {
        console.error("Failed to load collaboration data", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (entityId) {
      loadData();
    }
  }, [entityId, entityType, commentEntity, activityEntity]);

  const handlePostComment = async () => {
    if (!newComment.trim() || !user) return;
    
    const commentPayload = {
      event_plan_id: entityId, // Again, specific
      activity_type: 'note_added',
      user_id: user.id,
      user_name: user.full_name,
      details: { note: newComment },
      timestamp: new Date().toISOString(),
    };

    try {
      const savedComment = await commentEntity.create(commentPayload);
      setActivities(prev => [savedComment, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  const renderActivity = (activity) => {
    switch(activity.activity_type) {
      case 'status_changed':
        return `changed task "${activity.details.task_name}" from ${activity.details.previous_value} to ${activity.details.new_value}`;
      case 'note_added':
        return `added a note: "${activity.details.note}"`;
      default:
        return `performed an action: ${activity.activity_type}`;
    }
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Activity & Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a note or comment..."
              className="mb-2"
            />
            <Button onClick={handlePostComment} size="sm" disabled={!newComment.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Post
            </Button>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {isLoading ? (
              <div className="text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
            ) : (
              activities.map((item, index) => (
                <div key={item.id || index} className="text-sm">
                  <p className="text-brand-text-primary">
                    <span className="font-semibold">{item.user_name}</span> {renderActivity(item)}
                  </p>
                  <p className="text-xs text-brand-text-secondary">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </p>
                </div>
              ))
            )}
            {!isLoading && activities.length === 0 && <p className="text-brand-text-secondary text-center py-4">No activity yet.</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}