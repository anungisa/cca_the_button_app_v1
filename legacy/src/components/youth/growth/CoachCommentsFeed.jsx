import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function CoachCommentsFeed({ sessions }) {
  const sessionsWithFeedback = sessions
    .filter(s => s.coach_feedback && s.coach_feedback.feedback_text)
    .sort((a,b) => new Date(b.coach_feedback.reviewed_date) - new Date(a.coach_feedback.reviewed_date));

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="text-blue-400" /> Coach Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessionsWithFeedback.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {sessionsWithFeedback.map(session => (
              <div key={session.id} className="p-4 bg-brand-charcoal rounded-lg">
                <p className="text-brand-text-primary italic">"{session.coach_feedback.feedback_text}"</p>
                <div className="text-right text-xs text-brand-text-secondary mt-2">
                  - Coach (on {new Date(session.coach_feedback.reviewed_date).toLocaleDateString()})
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-brand-text-secondary py-4">No coach feedback yet. Share your sessions!</p>
        )}
      </CardContent>
    </Card>
  );
}