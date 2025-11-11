import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  MessageCircle, 
  Star, 
  CheckCircle,
  Clock,
  Target,
  Award,
  User as UserIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CoachReviewPanel({ sessions, user, accessLevel }) {
  const [newFeedback, setNewFeedback] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const safeSessions = sessions || [];

  // Mock coach feedback data
  const mockCoachFeedback = [
    {
      id: '1',
      session_id: safeSessions[0]?.id || 'mock_session_1',
      coach_name: 'Sarah Thompson',
      coach_certification: 'Competition Development Coach',
      feedback_text: 'Excellent consistency in your pressure application. Work on maintaining rhythm during longer sweeps.',
      performance_tags: ['consistent', 'good'],
      suggested_drills: ['Long sweep endurance', 'Rhythm maintenance'],
      reviewed_date: '2024-01-15',
      rating: 4
    },
    {
      id: '2',
      session_id: safeSessions[1]?.id || 'mock_session_2',
      coach_name: 'Mike Rodriguez',
      coach_certification: 'Competition Coach',
      feedback_text: 'Great improvement in maximum pressure output. Focus on sweep timing coordination.',
      performance_tags: ['strong', 'improving'],
      suggested_drills: ['Pressure burst training', 'Team coordination'],
      reviewed_date: '2024-01-10',
      rating: 5
    }
  ];

  const getTagColor = (tag) => {
    switch(tag) {
      case 'excellent': return 'bg-green-900/50 text-green-300';
      case 'good': return 'bg-blue-900/50 text-blue-300';
      case 'consistent': return 'bg-purple-900/50 text-purple-300';
      case 'strong': return 'bg-amber-900/50 text-amber-300';
      case 'improving': return 'bg-cyan-900/50 text-cyan-300';
      case 'needs_work': return 'bg-red-900/50 text-red-300';
      default: return 'bg-gray-900/50 text-gray-300';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-amber-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  if (accessLevel !== 'pro') {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-brand-text-primary mb-2">
            Coach Reviews
          </h3>
          <p className="text-brand-text-secondary mb-6">
            Get personalized feedback from certified coaches with Smart Broom Pro
          </p>
          <div className="space-y-4">
            <div className="text-left bg-brand-charcoal p-4 rounded-lg">
              <h4 className="font-semibold text-brand-text-primary mb-2">What you get:</h4>
              <ul className="text-sm text-brand-text-secondary space-y-2">
                <li>• Detailed session reviews from certified coaches</li>
                <li>• Personalized training recommendations</li>
                <li>• Performance rating and progress tracking</li>
                <li>• Suggested drills and exercises</li>
                <li>• Direct coach messaging</li>
              </ul>
            </div>
            <Button className="bg-brand-red hover:bg-red-700">
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Coach Review Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-brand-text-primary mb-1">
              {mockCoachFeedback.length}
            </div>
            <div className="text-sm text-brand-text-secondary">Reviews Received</div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-brand-text-primary mb-1">
              {(mockCoachFeedback.reduce((sum, f) => sum + f.rating, 0) / mockCoachFeedback.length).toFixed(1)}
            </div>
            <div className="text-sm text-brand-text-secondary">Average Rating</div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-brand-text-primary mb-1">
              {mockCoachFeedback.reduce((sum, f) => sum + f.suggested_drills.length, 0)}
            </div>
            <div className="text-sm text-brand-text-secondary">Drill Suggestions</div>
          </CardContent>
        </Card>
      </div>

      {/* Coach Feedback List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-brand-text-primary">Recent Coach Feedback</h3>
          <Button variant="outline" size="sm" className="border-brand-border text-brand-text-secondary">
            Request Review
          </Button>
        </div>

        {mockCoachFeedback.map((feedback, index) => (
          <motion.div
            key={feedback.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-brand-text-primary">
                          {feedback.coach_name}
                        </h4>
                        <p className="text-sm text-brand-text-secondary">
                          {feedback.coach_certification}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {renderStars(feedback.rating)}
                        </div>
                        <span className="text-sm text-brand-text-secondary">
                          {new Date(feedback.reviewed_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-brand-text-primary mb-4">
                      {feedback.feedback_text}
                    </p>

                    {/* Performance Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {feedback.performance_tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} className={getTagColor(tag)}>
                          {tag.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>

                    {/* Suggested Drills */}
                    {feedback.suggested_drills.length > 0 && (
                      <div className="bg-brand-charcoal/50 rounded-lg p-4">
                        <h5 className="font-semibold text-brand-text-primary mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Suggested Drills
                        </h5>
                        <ul className="text-sm text-brand-text-secondary space-y-1">
                          {feedback.suggested_drills.map((drill, drillIndex) => (
                            <li key={drillIndex}>• {drill}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Request New Review */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Request Session Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Select Session
            </label>
            <select
              value={selectedSession || ''}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full p-2 bg-brand-charcoal border border-brand-border rounded text-brand-text-primary"
            >
              <option value="">Choose a session...</option>
              {safeSessions.slice(0, 5).map(session => (
                <option key={session.id} value={session.id}>
                  {new Date(session.session_date).toLocaleDateString()} - {session.session_type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Specific Questions or Focus Areas
            </label>
            <Textarea
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              placeholder="What specific aspects would you like the coach to focus on? (e.g., pressure consistency, sweep timing, technique)"
              className="bg-brand-charcoal border-brand-border text-brand-text-primary"
              rows={3}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-brand-text-secondary">
              <Clock className="w-4 h-4 inline mr-1" />
              Reviews typically completed within 24-48 hours
            </div>
            <Button 
              className="bg-brand-red hover:bg-red-700"
              disabled={!selectedSession}
            >
              Request Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}