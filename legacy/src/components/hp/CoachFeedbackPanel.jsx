import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, ThumbsUp, AlertCircle, Star } from 'lucide-react';
import { CoachFeedback } from '@/api/entities';
import { useXP } from '../XPContext';
import { useToast } from '../hooks/use-toast';

const FeedbackRatingStars = ({ rating, onChange }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <Star 
            className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
          />
        </button>
      ))}
    </div>
  );
};

export default function CoachFeedbackPanel({ athleteId, onFeedbackAdded }) {
  const { user } = useXP();
  const { toast } = useToast();
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

  const loadFeedbacks = async () => {
    try {
      const data = await CoachFeedback.filter({ athlete_id: athleteId }, '-created_date', 20);
      setFeedbacks(data);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    }
  };

  useEffect(() => {
    if (athleteId) {
      loadFeedbacks();
    }
  }, [athleteId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Feedback',
        description: 'Please write some feedback before submitting'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await CoachFeedback.create({
        coach_id: user.id,
        athlete_id: athleteId,
        feedback_text: feedbackText,
        rating: rating
      });

      setFeedbackText('');
      setRating(3);
      await loadFeedbacks();
      
      if (onFeedbackAdded) {
        onFeedbackAdded();
      }

      toast({
        title: 'Feedback Sent',
        description: 'Your feedback has been shared with the athlete'
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Send',
        description: 'Could not submit feedback. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* New Feedback Form */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-red" />
            Provide Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Performance Rating
              </label>
              <FeedbackRatingStars rating={rating} onChange={setRating} />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Feedback Message
              </label>
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your observations, encouragement, or areas for improvement..."
                rows={4}
                className="bg-brand-charcoal border-brand-border"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Sending...' : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Feedback
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Feedback History */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Feedback History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <div 
                  key={feedback.id} 
                  className="p-4 bg-brand-charcoal rounded-lg border border-brand-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`w-4 h-4 ${star <= feedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
                          />
                        ))}
                      </div>
                      {!feedback.is_read_by_athlete && (
                        <Badge variant="outline" className="text-xs">
                          Unread
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-brand-text-secondary">
                      {new Date(feedback.created_date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-brand-text-primary">
                    {feedback.feedback_text}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-brand-text-secondary">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-brand-text-muted" />
                <p>No feedback history yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}