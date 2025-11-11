
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, ArrowRight, Lightbulb } from 'lucide-react';
import { useLocation } from 'react-router-dom';

/**
 * Contextual Help System - Shows relevant tips based on current page
 */

const PAGE_HELP_CONTENT = {
  '/Home': {
    title: 'Welcome to your dashboard',
    tips: [
      'Your XP and tier progress are shown in the top right',
      'Quick actions help you jump to popular features',
      'Check the activity feed for community updates'
    ],
    nextSteps: [
      { text: 'Find a local club', action: 'navigate', target: '/Clubs' },
      { text: 'Explore upcoming events', action: 'navigate', target: '/Events' }
    ]
  },
  '/Clubs': {
    title: 'Finding your curling community',
    tips: [
      'Use filters to find clubs near you',
      'Click on any club to see detailed information',
      'Setting a home club personalizes your experience'
    ],
    nextSteps: [
      { text: 'Set your home club', action: 'highlight', target: '.club-affiliation-button' },
      { text: 'View club events', action: 'navigate', target: '/Events' }
    ]
  },
  '/Events': {
    title: 'Stay connected to curling events',
    tips: [
      'Filter by your region to see local events',
      'Watch live streams when available',
      'Earn XP by engaging with event content'
    ],
    nextSteps: [
      { text: 'Join the community discussion', action: 'navigate', target: '/CommunityHub' },
      { text: 'Check out live streaming', action: 'navigate', target: '/Streaming' }
    ]
  },
  '/Profile': {
    title: 'Your curling journey',
    tips: [
      'Complete your profile to unlock personalized features',
      'Track your progress and achievements',
      'Manage your privacy and notification settings'
    ],
    nextSteps: [
      { text: 'Complete profile setup', action: 'highlight', target: '.profile-edit-button' },
      { text: 'View your rewards', action: 'navigate', target: '/RewardStore' }
    ]
  },
  '/PerformanceCenter': {
    title: 'Track your improvement',
    tips: [
      'Log your practice sessions and games',
      'Use AI insights to identify areas for improvement',
      'Set goals and monitor your progress over time'
    ],
    nextSteps: [
      { text: 'Log your first session', action: 'highlight', target: '.log-session-button' },
      { text: 'Connect with a coach', action: 'navigate', target: '/GetInvolvedHub' }
    ]
  }
};

export default function ContextualHelp() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenHelp, setHasSeenHelp] = useState(false);
  const [currentHelp, setCurrentHelp] = useState(null);

  useEffect(() => {
    const helpContent = PAGE_HELP_CONTENT[location.pathname];
    if (helpContent && !hasSeenHelp) {
      setCurrentHelp(helpContent);
      // Show help after a short delay to let page load
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, [location.pathname, hasSeenHelp]);

  const handleDismiss = () => {
    setIsVisible(false);
    setHasSeenHelp(true);
    // Store in localStorage to persist across sessions for this page
    localStorage.setItem(`help_seen_${location.pathname}`, 'true');
  };

  const handleAction = (action) => {
    if (action.action === 'navigate') {
      window.location.href = action.target;
    } else if (action.action === 'highlight') {
      const element = document.querySelector(action.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlight-element');
        setTimeout(() => {
          element.classList.remove('highlight-element');
        }, 3000);
      }
    }
    handleDismiss();
  };

  // Check if help was already seen for this page
  useEffect(() => {
    const seen = localStorage.getItem(`help_seen_${location.pathname}`);
    setHasSeenHelp(!!seen);
  }, [location.pathname]);

  if (!currentHelp || !isVisible) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-brand-card-bg border-brand-border hover:bg-brand-card-bg/80"
        title="Show help"
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-20 md:bottom-6 right-6 z-50 w-80 max-w-[calc(100vw-2rem)]"
      >
        <Card className="bg-blue-950 border-blue-800 text-slate-100 border-2 shadow-2xl backdrop-blur-none">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h3 className="font-semibold text-slate-50">
                  {currentHelp.title}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="text-slate-300 hover:text-white hover:bg-blue-900 -mt-2 -mr-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <ul className="space-y-2">
                {currentHelp.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-brand-red mt-1 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>

              {currentHelp.nextSteps && (
                <div className="space-y-2 pt-3 border-t border-blue-800">
                  <p className="text-xs font-medium text-slate-200">Try this next:</p>
                  {currentHelp.nextSteps.map((step, index) => (
                    <button
                      key={index}
                      onClick={() => handleAction(step)}
                      className="flex items-center gap-2 text-sm text-brand-red hover:text-red-400 transition-colors w-full text-left p-2 rounded hover:bg-blue-900"
                    >
                      <ArrowRight className="w-3 h-3" />
                      <span>{step.text}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
