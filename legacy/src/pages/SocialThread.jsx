
import React, { useState, useEffect } from 'react';
import { User, SocialThread as SocialThreadEntity, PointTransaction, LoyaltyProgram } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  Trophy, 
  Camera,
  Zap,
  Star,
  Send
} from 'lucide-react';
import { format } from 'date-fns';

export default function SocialThread() {
  const [user, setUser] = useState(null);
  const [todaysThread, setTodaysThread] = useState(null);
  const [responses, setResponses] = useState([]);
  const [newResponse, setNewResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
        
        // Load today's thread
        const today = new Date().toISOString().split('T')[0];
        const threads = await SocialThreadEntity.filter({ date: today });
        
        let thread;
        if (threads.length === 0) {
          // Create today's thread
          const prompts = [
            { prompt: "Show us your club pride! What makes your home ice special?", category: "club_pride" },
            { prompt: "Who got you into curling? Share your curling origin story!", category: "curling_story" },
            { prompt: "What's your favorite curling memory from this season?", category: "curling_story" },
            { prompt: "Predict: Which team will win the next major championship?", category: "prediction" },
            { prompt: "Share a photo of your favorite curling equipment!", category: "photo_contest" }
          ];
          
          const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
          thread = await SocialThreadEntity.create({
            prompt: randomPrompt.prompt,
            date: today,
            category: randomPrompt.category,
            responses: [],
            points_reward: 10,
            bonus_points_for_likes: 2
          });
        } else {
          thread = threads[0];
        }
        
        setTodaysThread(thread);
        setResponses(thread.responses || []);
        
      } catch (error) {
        console.error('Error loading social thread:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleSubmitResponse = async () => {
    if (!newResponse.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = {
        user_id: user.id,
        user_name: user.full_name,
        response_text: newResponse,
        likes: 0,
        created_date: new Date().toISOString(),
        is_featured: false
      };
      
      const updatedResponses = [...responses, response];
      
      // Update thread with new response
      await SocialThreadEntity.update(todaysThread.id, {
        responses: updatedResponses
      });
      
      // Award points for participating
      await PointTransaction.create({
        user_id: user.id,
        points_amount: todaysThread.points_reward,
        transaction_type: 'bonus',
        description: `Participated in Social Thread: "${todaysThread.prompt.substring(0, 50)}..."`,
        source: 'social_thread'
      });
      
      // Update user's loyalty points
      const loyaltyProfiles = await LoyaltyProgram.filter({ user_id: user.id });
      if (loyaltyProfiles.length > 0) {
        const profile = loyaltyProfiles[0];
        await LoyaltyProgram.update(profile.id, {
          curl_points: profile.curl_points + todaysThread.points_reward,
          total_earned_points: profile.total_earned_points + todaysThread.points_reward
        });
      }
      
      setResponses(updatedResponses);
      setNewResponse('');
      
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (responseIndex) => {
    try {
      const updatedResponses = [...responses];
      updatedResponses[responseIndex].likes += 1;
      
      await SocialThreadEntity.update(todaysThread.id, {
        responses: updatedResponses
      });
      
      setResponses(updatedResponses);
    } catch (error) {
      console.error('Error liking response:', error);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'club_pride': return Trophy;
      case 'curling_story': return MessageCircle;
      case 'photo_contest': return Camera;
      case 'prediction': return Star;
      default: return MessageCircle;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'club_pride': return 'bg-amber-100 text-amber-800';
      case 'curling_story': return 'bg-blue-100 text-blue-800';
      case 'photo_contest': return 'bg-purple-100 text-purple-800';
      case 'prediction': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading today's conversation...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <MessageCircle className="w-12 h-12 text-brand-red mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brand-charcoal mb-2">Join the Conversation</h2>
            <p className="text-gray-600 mb-6">Sign in to participate in our daily community discussions!</p>
            <Button onClick={() => User.login()} className="bg-brand-red hover:bg-red-700">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(todaysThread?.category);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-charcoal uppercase">Daily Thread</h1>
          <p className="text-gray-600 mt-1">Join today's community conversation</p>
        </div>

        {/* Today's Prompt */}
        <Card className="mb-8 bg-gradient-to-r from-brand-red to-red-700 text-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <CategoryIcon className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl">{todaysThread?.prompt}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${getCategoryColor(todaysThread?.category)} text-xs`}>
                    {todaysThread?.category?.replace('_', ' ')}
                  </Badge>
                  <Badge className="bg-amber-100 text-amber-800 text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    {todaysThread?.points_reward} points
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Response Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback className="bg-brand-red text-white">
                  {user.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  className="min-h-[100px] mb-4"
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Earn {todaysThread?.points_reward} CurlPoints for participating
                  </p>
                  <Button
                    onClick={handleSubmitResponse}
                    disabled={!newResponse.trim() || isSubmitting}
                    className="bg-brand-red hover:bg-red-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Posting...' : 'Share'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responses */}
        <div className="space-y-4">
          {responses.length > 0 ? (
            responses.map((response, index) => (
              <Card key={index} className={response.is_featured ? 'border-amber-400 bg-amber-50' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-gray-500 text-white">
                        {response.user_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-brand-charcoal">{response.user_name}</span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(response.created_date), 'h:mm a')}
                        </span>
                        {response.is_featured && (
                          <Badge className="bg-amber-100 text-amber-800 text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{response.response_text}</p>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(index)}
                          className="text-gray-500 hover:text-brand-red"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          {response.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-brand-red"
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-brand-charcoal mb-2">Be the First to Share!</h3>
                <p className="text-gray-500">Start today's conversation and earn CurlPoints.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
