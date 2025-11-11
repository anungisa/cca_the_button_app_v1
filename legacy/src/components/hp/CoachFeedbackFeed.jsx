import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function CoachFeedbackFeed({ feedback }) {
  if (!feedback || feedback.length === 0) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare /> Coach Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-brand-text-secondary">No feedback from your coach yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare /> Coach Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedback.map((item, index) => (
          <div key={index} className="p-3 bg-brand-charcoal/50 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold text-brand-text-primary text-sm">{item.coach_name}</p>
              <p className="text-xs text-brand-text-secondary">{new Date(item.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm text-brand-text-primary">{item.feedback_text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}