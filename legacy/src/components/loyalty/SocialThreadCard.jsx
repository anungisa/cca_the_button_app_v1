import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Heart, 
  Share2,
  Camera,
  Star,
  Send
} from 'lucide-react';

export default function SocialThreadCard({ thread, onSubmitResponse, userHasResponded }) {
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!response.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmitResponse(thread.id, response);
      setResponse('');
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = (responseId) => {
    // Handle like functionality
    console.log('Liked response:', responseId);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'club_pride': return '🏒';
      case 'curling_story': return '📖';
      case 'trivia': return '🧠';
      case 'photo_contest': return '📸';
      case 'prediction': return '🔮';
      default: return '💬';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'club_pride': return 'bg-red-100 text-red-800';
      case 'curling_story': return 'bg-blue-100 text-blue-800';
      case 'trivia': return 'bg-purple-100 text-purple-800';
      case 'photo_contest': return 'bg-green-100 text-green-800';
      case 'prediction': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getCategoryIcon(thread.category)}</div>
            <div>
              <CardTitle className="text-lg">Thread of the Day</CardTitle>
              <Badge className={getCategoryColor(thread.category)}>
                {thread.category.replace(/_/g, ' ')}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MessageCircle className="w-4 h-4" />
            {thread.responses?.length || 0} responses
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Thread Prompt */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-lg font-medium text-brand-charcoal">{thread.prompt}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-amber-100 text-amber-800">
              +{thread.points_reward} points for responding
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              +{thread.bonus_points_for_likes} points per like
            </Badge>
          </div>
        </div>

        {/* Response Input */}
        {!userHasResponded && (
          <div className="space-y-3">
            <Textarea
              placeholder="Share your thoughts..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={3}
            />
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!response.trim() || isSubmitting}
                className="bg-brand-red hover:bg-red-700"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Posting...' : 'Post Response'}
              </Button>
            </div>
          </div>
        )}

        {/* Recent Responses */}
        {thread.responses && thread.responses.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-brand-charcoal">Recent Responses</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {thread.responses.slice(0, 5).map((response, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-brand-red rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {response.user_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="font-medium text-sm">{response.user_name}</span>
                      {response.is_featured && (
                        <Star className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(response.created_date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{response.response_text}</p>
                  {response.image_url && (
                    <img 
                      src={response.image_url} 
                      alt="Response" 
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleLike(response.id)}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600"
                    >
                      <Heart className="w-4 h-4" />
                      {response.likes || 0}
                    </button>
                    <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}