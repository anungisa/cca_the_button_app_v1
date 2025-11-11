import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Bot, 
  Send, 
  Minimize2, 
  Maximize2, 
  MessageCircle, 
  Sparkles, 
  Brain,
  ChevronDown,
  X,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIService, AI_ERROR_MESSAGES } from '../utils/AIService';
import { ConsentRegistry } from '../utils/ConsentRegistry';
import { useXP } from '../XPContext';

const QuickActions = ({ onAction, userContext }) => {
  const actions = [
    { 
      id: 'event_help', 
      label: 'Help with my next event', 
      icon: '📅',
      disabled: !userContext.canAccessStaffHQ 
    },
    { 
      id: 'campaign_ideas', 
      label: 'Marketing campaign ideas', 
      icon: '📢',
      disabled: !userContext.canManageSponsors 
    },
    { 
      id: 'rules_question', 
      label: 'Ask about curling rules', 
      icon: '🥌' 
    },
    { 
      id: 'app_help', 
      label: 'How to use The Button', 
      icon: '❓' 
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {actions.filter(a => !a.disabled).map(action => (
        <Button
          key={action.id}
          variant="outline"
          size="sm"
          onClick={() => onAction(action.id)}
          className="border-brand-border text-brand-text-secondary hover:text-brand-text-primary text-xs h-auto p-2"
        >
          <span className="mr-1">{action.icon}</span>
          {action.label}
        </Button>
      ))}
    </div>
  );
};

const ChatMessage = ({ message, isUser, isTyping = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
  >
    <div className={`max-w-[80%] p-3 rounded-lg ${
      isUser 
        ? 'bg-brand-red text-white' 
        : 'bg-brand-card-bg border border-brand-border text-brand-text-primary'
    }`}>
      {!isUser && (
        <div className="flex items-center gap-2 mb-1">
          <Bot className="w-4 h-4 text-brand-red" />
          <span className="text-xs text-brand-text-secondary">AI Assistant</span>
        </div>
      )}
      
      {isTyping ? (
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-brand-text-secondary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-brand-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-brand-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      ) : (
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      )}
      
      {message.suggestions && (
        <div className="mt-2 space-y-1">
          {message.suggestions.map((suggestion, index) => (
            <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
              {suggestion}
            </Badge>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

export default function CoachingCompanion() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAIConsent, setHasAIConsent] = useState(false);
  const [sessionId] = useState(`ai_session_${Date.now()}`);
  
  const { user, loyaltyData } = useXP();

  useEffect(() => {
    checkAIConsent();
    initializeWelcome();
  }, [user]);

  const checkAIConsent = async () => {
    try {
      const consent = await ConsentRegistry.hasConsent('ai_coaching_companion');
      setHasAIConsent(consent);
    } catch (error) {
      console.error('Error checking AI consent:', error);
    }
  };

  const initializeWelcome = () => {
    if (user && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        content: `Hi ${user.full_name?.split(' ')[0] || 'there'}! 👋\n\nI'm your AI companion for The Button. I can help with:\n• Curling rules and strategy\n• App features and navigation\n• Event planning (for staff)\n• Performance insights\n\nWhat would you like to know?`,
        isUser: false,
        timestamp: new Date(),
        suggestions: ['How do I track my progress?', 'What curling events are coming up?', 'Tell me about Fan Pass benefits']
      };
      setMessages([welcomeMessage]);
    }
  };

  const getUserContext = () => ({
    user_type: user?.user_type,
    skill_level: user?.skill_level,
    home_club_name: user?.home_club_name,
    tier: loyaltyData?.tier,
    canAccessStaffHQ: ['admin', 'staff'].includes(user?.user_type),
    canManageSponsors: ['admin', 'staff'].includes(user?.user_type)
  });

  const handleQuickAction = async (actionId) => {
    const quickPrompts = {
      event_help: "I need help planning my next curling event. What are the key things I should focus on?",
      campaign_ideas: "Can you suggest some marketing campaign ideas for our upcoming curling championship?",
      rules_question: "I have a question about curling rules and strategy. Can you help?",
      app_help: "How do I make the most of The Button app features?"
    };

    if (quickPrompts[actionId]) {
      await handleSendMessage(quickPrompts[actionId]);
    }
  };

  const handleSendMessage = async (messageText = currentInput) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      content: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage = {
      id: Date.now() + 1,
      isUser: false,
      isTyping: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await AIService.askCurlingQuestion(messageText, getUserContext());
      
      // Remove typing indicator and add real response
      setMessages(prev => prev.filter(m => !m.isTyping));
      
      const aiMessage = {
        id: Date.now() + 2,
        content: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => prev.filter(m => !m.isTyping));
      
      const errorMessage = {
        id: Date.now() + 2,
        content: AI_ERROR_MESSAGES[error.message] || 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-12 h-12 rounded-full bg-brand-red hover:bg-red-700 shadow-lg"
              aria-label="Open AI Assistant"
            >
              <Bot className="w-6 h-6 text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`fixed bottom-4 right-4 z-50 bg-brand-charcoal rounded-lg shadow-2xl border border-brand-border ${
              isMinimized ? 'w-80 h-16' : 'w-80 h-96'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-brand-text-primary">AI Assistant</h4>
                  <p className="text-xs text-brand-text-secondary">
                    {hasAIConsent ? 'Ready to help' : 'Limited mode'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-6 h-6"
                >
                  {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Chat Content */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="flex flex-col"
                >
                  {/* Messages */}
                  <div className="flex-1 p-3 h-64 overflow-y-auto">
                    {messages.map(message => (
                      <ChatMessage key={message.id} message={message} isUser={message.isUser} isTyping={message.isTyping} />
                    ))}
                  </div>

                  {/* Quick Actions */}
                  {messages.length <= 1 && (
                    <div className="px-3">
                      <QuickActions onAction={handleQuickAction} userContext={getUserContext()} />
                    </div>
                  )}

                  {/* Input */}
                  <div className="p-3 border-t border-brand-border">
                    <div className="flex gap-2">
                      <Textarea
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about curling..."
                        className="flex-1 resize-none h-8 bg-brand-card-bg border-brand-border text-sm"
                        rows={1}
                      />
                      <Button
                        onClick={() => handleSendMessage()}
                        disabled={!currentInput.trim() || isLoading}
                        size="icon"
                        className="bg-brand-red hover:bg-red-700 w-8 h-8"
                      >
                        <Send className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    {!hasAIConsent && (
                      <p className="text-xs text-brand-text-secondary mt-1">
                        Enable AI features in Settings for enhanced assistance
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}