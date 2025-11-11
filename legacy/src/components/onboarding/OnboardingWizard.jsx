
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, Home, Trophy, Users, Calendar, 
  Star, Sparkles, Target, CheckCircle, ArrowRight, X, PartyPopper
} from 'lucide-react';
import { useXP } from '../XPContext';
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

/**
 * @file OnboardingWizard.js
 * @description A progressive and adaptive onboarding wizard for new users.
 * It guides users through initial setup steps, personalizes their experience
 * by asking about their role (e.g., Fan, Athlete), and introduces them to key
 * platform features. It's designed to be the first major interaction for a user
 * after they sign up.
 */

/**
 * The main component for the Progressive Onboarding Wizard.
 * It adapts its steps and content based on the user's selected type.
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Controls the visibility of the wizard modal.
 * @param {function} props.onClose - Function to call when the wizard is closed.
 * @param {function} props.onComplete - Function to call when the user completes the final step.
 * @returns {JSX.Element | null} The wizard modal or null if not open.
 */
export default function OnboardingWizard({ isOpen, onClose, onComplete }) {
  const { user, awardPoints, awardBadge } = useXP();
  const [currentStep, setCurrentStep] = useState(0);
  const [userChoices, setUserChoices] = useState({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [onboardingSteps, setOnboardingSteps] = useState([]);

  useEffect(() => {
    // Adaptive onboarding steps based on user type
    const generateOnboardingSteps = () => {
      const baseSteps = [
        {
          id: 'welcome',
          title: 'Welcome to The Button!',
          subtitle: 'Your digital hub for all things curling',
          icon: Sparkles,
          content: {
            type: 'welcome',
            description: 'The Button connects you to clubs, events, performance tracking, and the curling community across Canada.',
            highlights: ['Find local clubs', 'Track your progress', 'Earn rewards', 'Stay connected']
          }
        },
        {
          id: 'user_type',
          title: 'Tell us about yourself',
          subtitle: 'Help us personalize your experience',
          icon: Users,
          content: {
            type: 'user_type_selection',
            options: [
              { 
                id: 'fan', 
                title: 'Curling Fan', 
                description: 'I love watching curling and want to stay connected to the sport',
                features: ['Live streaming', 'Event updates', 'Community discussions']
              },
              { 
                id: 'curler', 
                title: 'Recreational Curler', 
                description: 'I play curling for fun at my local club',
                features: ['Club connections', 'Social features', 'Local events']
              },
              { 
                id: 'athlete', 
                title: 'Competitive Athlete', 
                description: 'I compete in curling tournaments and want to improve my game',
                features: ['Performance tracking', 'Coach tools', 'Advanced analytics']
              },
              { 
                id: 'volunteer', 
                title: 'Volunteer', 
                description: 'I help organize events and support the curling community',
                features: ['Event management', 'Volunteer coordination', 'Recognition system']
              }
            ]
          }
        },
        {
          id: 'key_features',
          title: 'Your personalized dashboard',
          subtitle: 'Here are the features we think you\'ll love',
          icon: Target,
          content: {
            type: 'feature_overview',
            features: [] // Will be populated based on user type
          }
        },
        {
          id: 'first_action',
          title: 'Ready to get started?',
          subtitle: 'Choose your first action to begin your journey',
          icon: ArrowRight,
          content: {
            type: 'first_action',
            actions: [] // Will be populated based on user type
          }
        },
        // Add final step
        {
          id: 'complete',
          title: 'All Set!',
          subtitle: 'Enjoy your personalized experience.',
          icon: CheckCircle, // Using CheckCircle as icon for completion
          content: { type: 'complete' }
        }
      ];

      // Customize based on user type selection
      const selectedUserType = userChoices.userType || user?.user_type || 'fan';
      
      if (selectedUserType === 'athlete') {
        baseSteps[2].content.features = [
          { icon: Trophy, title: 'Performance Center', description: 'Track your progress and analyze your game' },
          { icon: Target, title: 'Goal Setting', description: 'Set and monitor your improvement goals' },
          { icon: Users, title: 'Coach Connection', description: 'Connect with certified coaches' }
        ];
        baseSteps[3].content.actions = [
          { id: 'setup_profile', title: 'Complete Your Athlete Profile', icon: Users, href: 'Profile' },
          { id: 'explore_performance', title: 'Explore Performance Tools', icon: Trophy, href: 'PerformanceCenter' },
          { id: 'find_club', title: 'Connect to Your Club', icon: Home, href: 'Clubs' }
        ];
      } else if (selectedUserType === 'volunteer') {
        baseSteps[2].content.features = [
          { icon: Calendar, title: 'Event Management', description: 'Help organize tournaments and events' },
          { icon: Star, title: 'Recognition System', description: 'Earn points and badges for your contributions' },
          { icon: Users, title: 'Volunteer Network', description: 'Connect with other volunteers' }
        ];
        baseSteps[3].content.actions = [
          { id: 'get_involved', title: 'Find Volunteer Opportunities', icon: Users, href: 'GetInvolvedHub' },
          { id: 'upcoming_events', title: 'See Upcoming Events', icon: Calendar, href: 'Events' },
          { id: 'complete_profile', title: 'Complete Your Profile', icon: Users, href: 'Profile' }
        ];
      } else {
        // Default for fans and recreational curlers
        baseSteps[2].content.features = [
          { icon: Calendar, title: 'Live Events', description: 'Watch live curling and follow your favorite teams' },
          { icon: Users, title: 'Community', description: 'Connect with curling fans across Canada' },
          { icon: Star, title: 'Granite Circle', description: 'Earn points for engagement and unlock rewards' }
        ];
        baseSteps[3].content.actions = [
          { id: 'find_club', title: 'Find a Local Club', icon: Home, href: 'Clubs' },
          { id: 'upcoming_events', title: 'Explore Events', icon: Calendar, href: 'Events' },
          { id: 'join_community', title: 'Join the Community', icon: Users, href: 'CommunityHub' }
        ];
      }

      return baseSteps;
    };
    setOnboardingSteps(generateOnboardingSteps());
  }, [user, userChoices.userType]); // Re-generate steps if user or userType changes

  const steps = onboardingSteps;
  // Don't render until steps are populated (e.g., after initial user data loads)
  if (steps.length === 0) return null;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUserTypeSelection = (userType) => {
    setUserChoices({ ...userChoices, userType });
    // Update user data in the backend
    if (user) {
      User.updateMyUserData({ user_type: userType });
    }
    handleNext();
  };

  const handleFirstAction = async (action) => {
    // Store the chosen action and move to the final 'complete' step
    setUserChoices({ ...userChoices, firstAction: action });
    setCurrentStep(currentStep + 1); 
  };

  const handleCompleteOnboarding = async (action) => {
    setIsCompleting(true);
    
    try {
      // Award onboarding completion rewards
      await awardPoints(100, 'onboarding_complete', 'Completed onboarding wizard');
      await awardBadge('onboarding_complete', 'Getting Started', 'Completed your first steps on The Button');
      
      // Mark onboarding as seen
      if (user) {
        await User.updateMyUserData({ has_seen_onboarding: true });
      }
      
      // Call the onComplete prop callback
      onComplete?.(action);
      
      // Navigate to chosen action if it has a link
      if (action?.href) {
        window.location.href = createPageUrl(action.href);
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 text-brand-text-secondary hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center">
                <currentStepData.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-brand-text-primary">
                  {currentStepData.title}
                </CardTitle>
                <p className="text-brand-text-secondary">{currentStepData.subtitle}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-brand-text-secondary">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStepData.content.type === 'welcome' && (
                  <WelcomeStep content={currentStepData.content} />
                )}
                
                {currentStepData.content.type === 'user_type_selection' && (
                  <UserTypeStep 
                    content={currentStepData.content} 
                    onSelect={handleUserTypeSelection}
                  />
                )}
                
                {currentStepData.content.type === 'feature_overview' && (
                  <FeatureOverviewStep content={currentStepData.content} />
                )}
                
                {currentStepData.content.type === 'first_action' && (
                  <FirstActionStep 
                    content={currentStepData.content} 
                    onSelect={handleFirstAction}
                    isLoading={isCompleting} // This prop is now effectively always false here
                  />
                )}

                {currentStepData.content.type === 'complete' && (
                  <FinalStep 
                    onComplete={handleCompleteOnboarding} 
                    action={userChoices.firstAction} 
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>

          {currentStepData.content.type !== 'complete' && (
            <CardFooter className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="border-brand-border text-brand-text-secondary"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStepData.content.type !== 'user_type_selection' && 
                 currentStepData.content.type !== 'first_action' && (
                  <Button
                    onClick={handleNext}
                    disabled={currentStep === steps.length - 1}
                    className="bg-brand-red hover:bg-red-700"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

// Step Components

const WelcomeStep = ({ content }) => (
  <div className="text-center space-y-6">
    <p className="text-lg text-brand-text-secondary leading-relaxed">
      {content.description}
    </p>
    <div className="grid grid-cols-2 gap-4">
      {content.highlights.map((highlight, index) => (
        <div key={index} className="flex items-center gap-2 text-brand-text-primary">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span>{highlight}</span>
        </div>
      ))}
    </div>
  </div>
);

const UserTypeStep = ({ content, onSelect }) => (
  <div className="space-y-4">
    <p className="text-brand-text-secondary mb-6">
      This helps us show you the most relevant features and content.
    </p>
    <div className="grid gap-4">
      {content.options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className="p-4 border border-brand-border rounded-lg hover:border-brand-red hover:bg-brand-red/10 transition-colors text-left"
        >
          <h3 className="font-semibold text-brand-text-primary mb-2">{option.title}</h3>
          <p className="text-sm text-brand-text-secondary mb-3">{option.description}</p>
          <div className="flex flex-wrap gap-2">
            {option.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </button>
      ))}
    </div>
  </div>
);

const FeatureOverviewStep = ({ content }) => (
  <div className="space-y-6">
    <p className="text-brand-text-secondary">
      Based on your interests, here are the key features you'll want to explore:
    </p>
    <div className="space-y-4">
      {content.features.map((feature, index) => (
        <div key={index} className="flex items-start gap-4 p-4 bg-brand-charcoal/50 rounded-lg">
          <div className="w-10 h-10 bg-brand-red/20 rounded-full flex items-center justify-center">
            <feature.icon className="w-5 h-5 text-brand-red" />
          </div>
          <div>
            <h3 className="font-semibold text-brand-text-primary">{feature.title}</h3>
            <p className="text-sm text-brand-text-secondary">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const FirstActionStep = ({ content, onSelect, isLoading }) => (
  <div className="space-y-6">
    <p className="text-brand-text-secondary">
      Choose what you'd like to do first. Don't worry - you can explore everything later!
    </p>
    <div className="space-y-3">
      {content.actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onSelect(action)}
          disabled={isLoading}
          className="w-full flex items-center gap-4 p-4 border border-brand-border rounded-lg hover:border-brand-red hover:bg-brand-red/10 transition-colors disabled:opacity-50"
        >
          <div className="w-10 h-10 bg-brand-red/20 rounded-full flex items-center justify-center">
            <action.icon className="w-5 h-5 text-brand-red" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-brand-text-primary">{action.title}</h3>
          </div>
          <ChevronRight className="w-5 h-5 text-brand-text-secondary ml-auto" />
        </button>
      ))}
    </div>
    {/* This loading state is now managed by FinalStep */}
    {isLoading && (
      <div className="text-center text-brand-text-secondary">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-red mx-auto mb-2"></div>
        Setting up your account...
      </div>
    )}
  </div>
);

const FinalStep = ({ onComplete, action }) => (
  <div className="text-center space-y-6">
    <PartyPopper className="w-16 h-16 text-brand-red mx-auto" />
    <h2 className="text-2xl font-bold text-brand-text-primary">Setup Complete!</h2>
    <p className="text-lg text-brand-text-secondary leading-relaxed">
      You're all set. You've earned <strong>100 XP</strong> for completing your onboarding.
    </p>
    <Button 
      onClick={() => onComplete(action)} 
      className="bg-brand-red hover:bg-red-700 w-full"
      size="lg"
    >
      {action ? `Continue to: ${action.title}` : 'Go to Dashboard'}
    </Button>
  </div>
);
