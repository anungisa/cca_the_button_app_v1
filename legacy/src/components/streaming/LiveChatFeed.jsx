import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Heart, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommunityPost } from '@/api/entities';
import { useXP } from '../XPContext';

export default function LiveChatFeed({ gameId, onInteraction }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useXP();

  useEffect(() => {
    loadRecentMessages();
    // In a real implementation, you'd set up real-time updates here
    const interval = setInterval(loadRecentMessages, 5000);
    return () => clearInterval(interval);
  }, [gameId]);

  const loadRecentMessages = async () => {
    try {
      // Load recent community posts tagged with this game
      const posts = await CommunityPost.filter({
        post_type: 'general',
        // In real implementation, filter by game_id or event tags
      });
      
      // Sort by creation date and take most recent
      const recentPosts = posts
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
        .slice(0, 20);
        
      setMessages(recentPosts);
    } catch (error) {
      console.error('Error loading chat messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const post = await CommunityPost.create({
        author_id: user.id,
        content: newMessage.trim(),
        post_type: 'general',
        tags: [`game_${gameId}`, 'live_chat'],
        visibility: 'public'
      });

      // Add to local state immediately
      setMessages([post, ...messages]);
      setNewMessage('');

      // Award XP for participation
      await onInteraction('chat_message', {
        message: newMessage.trim(),
        xpAwarded: 2 // Small XP for chat participation
      });

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLikeMessage = async (messageId) => {
    try {
      // In a real implementation, you'd update the likes array
      console.log('Like message:', messageId);
      
      await onInteraction('chat_message', {
        action: 'like',
        message_id: messageId,
        xpAwarded: 1 // Micro XP for engagement
      });
    } catch (error) {
      console.error('Error liking message:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="bg-brand-charcoal border-brand-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-green-400" />
            Live Chat
            <Badge className="ml-auto bg-green-600 text-white text-xs">
              {messages.length} messages
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Message Input */}
          {user ? (
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Join the conversation..."
                className="flex-1 bg-brand-card-bg border-brand-border text-brand-text-primary"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                maxLength={200}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="icon"
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center p-3 bg-brand-card-bg/50 rounded-lg">
              <p className="text-brand-text-secondary text-sm">
                Sign in to join the live chat!
              </p>
            </div>
          )}

          {/* Messages Feed */}
          <div className="space-y-3 max-h-80 overflow-y-auto">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-brand-card-bg/30 p-3 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {message.author_name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-sm font-medium text-brand-text-primary">
                        {message.author_name || 'Anonymous Fan'}
                      </span>
                      <span className="text-xs text-brand-text-secondary">
                        {new Date(message.created_date).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-brand-text-primary mb-2">
                    {message.content}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLikeMessage(message.id)}
                      className="flex items-center gap-1 text-xs text-brand-text-secondary hover:text-red-400 transition-colors"
                    >
                      <Heart className="w-3 h-3" />
                      {message.likes?.length || 0}
                    </button>
                    
                    <button className="flex items-center gap-1 text-xs text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                      <Flag className="w-3 h-3" />
                      Report
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {messages.length === 0 && (
              <div className="text-center p-6 text-brand-text-secondary">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No messages yet. Be the first to chat!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}