
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { HitDrawTap } from '@/api/entities';
import { AthleteJourney } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Trophy, 
  Star, 
  Target, 
  Users,
  Award,
  Calendar,
  TrendingUp,
  Zap,
  Gift,
  BookOpen,
  Loader2,
  Shield,
  Sparkles,
  CheckCircle2,
  Flame,
  ChevronDown,
  ChevronUp,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useXP } from '../components/XPContext';
import PlayerCard from '../components/youth/PlayerCard';
import MilestoneCard from '../components/youth/MilestoneCard';
import SuggestedNextSteps from '../components/youth/SuggestedNextSteps';
import CompletionModal from '../components/youth/CompletionModal';
import YouthHeroTile from '../components/youth/YouthHeroTile';
import AvatarCard from '../components/youth/AvatarCard';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SponsorShowcase from '../components/home/SponsorShowcase';

const MILESTONE_CATEGORIES = {
  core_skills: {
    title: "🎯 Foundation Skills",
    color: "from-blue-500 to-cyan-500",
    description: "Build your curling fundamentals"
  },
  engagement: {
    title: "🤝 Community Connection", 
    color: "from-green-500 to-emerald-500",
    description: "Connect with the curling family"
  },
  competition_ready: {
    title: "🏆 Game Ready",
    color: "from-amber-500 to-orange-500", 
    description: "Step up your competitive game"
  }
};

const MILESTONE_DATA = {
  core_skills: [
    {
      id: 'first_clinic',
      title: 'First Clinic',
      description: 'Attend your first Learn to Curl session',
      xp_reward: 100,
      icon: Target,
      requirement: 'Attend 1 clinic session',
      difficulty: 'easy',
      actionUrl: 'Events'
    },
    {
      id: 'basic_delivery',
      title: 'Basic Delivery',
      description: 'Master the fundamental delivery technique',
      xp_reward: 150,
      icon: Target,
      requirement: 'Complete delivery assessment',
      difficulty: 'medium',
      actionUrl: 'KnowledgeCentreHub'
    },
    {
      id: 'first_game',
      title: 'First Game',
      description: 'Play your first complete game of curling',
      xp_reward: 200,
      icon: Trophy,
      requirement: 'Complete 1 full game',
      difficulty: 'medium',
      actionUrl: 'LiveScoring'
    },
    {
      id: 'sweeping_basics',
      title: 'Sweeping Master',
      description: 'Learn proper sweeping technique and timing',
      xp_reward: 125,
      icon: Sparkles,
      requirement: 'Complete sweeping drill',
      difficulty: 'easy',
      actionUrl: 'KnowledgeCentreHub'
    }
  ],
  engagement: [
    {
      id: 'team_player',
      title: 'Team Player',
      description: 'Play 5 games as part of a consistent team',
      xp_reward: 250,
      icon: Users,
      requirement: 'Play 5 team games',
      difficulty: 'medium',
      actionUrl: 'Profile'
    },
    {
      id: 'safe_sport_aware',
      title: 'Safe Sport Aware',
      description: 'Complete Safe Sport training module',
      xp_reward: 100,
      icon: Shield,
      requirement: 'Complete training',
      difficulty: 'easy',
      actionUrl: 'SafeSportHub'
    },
    {
      id: 'junior_league',
      title: 'Junior League',
      description: 'Join and participate in junior league play',
      xp_reward: 300,
      icon: Star,
      requirement: 'Join league program',
      difficulty: 'hard',
      actionUrl: 'Clubs'
    },
    {
      id: 'club_volunteer',
      title: 'Club Helper',
      description: 'Volunteer at a club event or competition',
      xp_reward: 200,
      icon: Calendar,
      requirement: 'Volunteer 4+ hours',
      difficulty: 'medium',
      actionUrl: 'GetInvolvedHub'
    }
  ],
  competition_ready: [
    {
      id: 'bonspiel_entry',
      title: 'Bonspiel Debut',
      description: 'Enter your first bonspiel competition',
      xp_reward: 400,
      icon: Trophy,
      requirement: 'Enter 1 bonspiel',
      difficulty: 'hard',
      actionUrl: 'Events'
    },
    {
      id: 'event_participation',
      title: 'Event Participant',
      description: 'Compete in 3 different events or competitions',
      xp_reward: 500,
      icon: Award,
      requirement: 'Complete 3 events',
      difficulty: 'hard',
      actionUrl: 'Events'
    },
    {
      id: 'skills_assessment',
      title: 'Skills Certified',
      description: 'Pass official curling skills assessment',
      xp_reward: 350,
      icon: CheckCircle2,
      requirement: 'Pass assessment',
      difficulty: 'hard',
      actionUrl: 'PerformanceCenter'
    }
  ]
};

export default function YouthPassport() {
  const [milestones, setMilestones] = useState({});
  const [collapsedSections, setCollapsedSections] = useState({});
  const [completedMilestone, setCompletedMilestone] = useState(null);
  const [isPassportDataLoading, setIsPassportDataLoading] = useState(true);
  const navigate = useNavigate();
  
  const { user, loyaltyData, awardPoints, awardBadge, tierConfig, isLoading: isXPLoading } = useXP();

  useEffect(() => {
    const loadPassportData = async () => {
      if (user) {
        // In a real app, you would fetch the user's completed milestones here.
        // For now, we'll just simulate the loading process.
        setMilestones({}); // Initialize with empty milestones for simulation
        setIsPassportDataLoading(false);
      } else if (!isXPLoading) {
        // If the context is done loading and there's still no user, we are done loading.
        setIsPassportDataLoading(false);
      }
    };

    loadPassportData();
  }, [user, isXPLoading]);

  const allMilestonesArray = Object.values(MILESTONE_DATA).flat();

  const handleCompleteMilestone = async (milestone) => {
    if (!milestones[milestone.id]) {
      setMilestones(prev => ({ ...prev, [milestone.id]: true }));
      await awardPoints(milestone.xp_reward, 'milestone_complete', `Completed: ${milestone.title}`);
      
      const categoryKey = Object.keys(MILESTONE_DATA).find(cat => 
        MILESTONE_DATA[cat].some(m => m.id === milestone.id)
      );
      const categoryMilestones = MILESTONE_DATA[categoryKey] || [];
      const completedInCategory = categoryMilestones.filter(m => milestones[m.id] || m.id === milestone.id).length;

      if (completedInCategory === categoryMilestones.length) {
        await awardBadge(
          `${categoryKey}_master`,
          `${MILESTONE_CATEGORIES[categoryKey].title} Master`,
          `Completed all milestones in ${MILESTONE_CATEGORIES[categoryKey].title}`
        );
      } else {
        await awardBadge(`milestone_${milestone.id}`, milestone.title, `Completed the ${milestone.title} milestone.`);
      }

      setCompletedMilestone(milestone);
    }
  };
  
  const handleStartMilestone = (milestone) => {
    if (milestone.actionUrl) {
      navigate(createPageUrl(milestone.actionUrl));
    } else {
      // Fallback for simulation or milestones without a page
      console.log(`Starting milestone: ${milestone.title}`);
      alert(`Let's start "${milestone.title}"! This would navigate to the right place in the app.`);
      // For demo, let's allow completing it right away
      handleCompleteMilestone(milestone);
    }
  };

  const handleShare = (milestone) => {
    // In a real app, this would open a social sharing dialog.
    // For now, let's navigate to the community hub.
    console.log('Sharing milestone:', milestone.title);
    navigate(createPageUrl('CommunityHub'));
    setCompletedMilestone(null);
  };
  
  const toggleSection = (categoryId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Check for loading states from both XP context and local passport data
  if (isXPLoading || isPassportDataLoading) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  // If loading is complete but user/loyalty data is still missing, show an error/fallback
  if (!user || !loyaltyData || !tierConfig) {
      return (
        <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-4">
            <Card className="bg-brand-card-bg border-brand-border text-center p-8 max-w-md">
                <CardHeader>
                    <UserIcon className="w-12 h-12 text-brand-red mx-auto mb-4" />
                    <CardTitle className="text-xl font-bold text-brand-text-primary">Passport Unavailable</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-brand-text-secondary mb-6">
                        We couldn't load your Youth Development Passport. Please ensure you are logged in and have completed the initial setup.
                    </p>
                    <Button asChild>
                        <Link to={createPageUrl('Home')}>Go to Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      );
  }

  const completedCount = Object.keys(milestones).length;
  const totalMilestoneCount = allMilestonesArray.length;

  const currentTierInfo = tierConfig[loyaltyData.tier] || {};
  const nextTierInfo = tierConfig[currentTierInfo.nextTier] || {};
  const nextTierName = nextTierInfo.name || "Max Level";
  const xpToGo = (loyaltyData.tier_progress?.next_tier_xp || 0) - (loyaltyData.tier_progress?.current_xp || 0);
  const progressPercent = loyaltyData.tier_progress?.next_tier_xp > 0 
    ? ((loyaltyData.tier_progress.current_xp || 0) / loyaltyData.tier_progress.next_tier_xp) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-brand-charcoal pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-full mb-3">
             <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-brand-text-primary">Youth Development Passport</h1>
          <p className="text-lg text-brand-text-secondary mt-1">Your journey to becoming a complete curler</p>
        </div>

        {/* Progress Bar */}
        <Card className="bg-brand-card-bg/80 backdrop-blur-sm border-brand-border">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-brand-text-secondary">
                Next Level: <span className="font-bold text-white">{nextTierName}</span> - <span className="text-amber-400">{xpToGo > 0 ? `${xpToGo} XP to go` : 'Level Up!'}</span>
              </p>
              <p className="text-sm font-bold text-white">{completedCount} / {totalMilestoneCount} milestones</p>
            </div>
            <Progress value={progressPercent} className="w-full h-2 [&>div]:bg-brand-red" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Player Info */}
          <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-8">
            <PlayerCard 
              user={user} 
              loyaltyData={loyaltyData} 
              totalMilestones={totalMilestoneCount}
              completedCount={completedCount}
            />
            <SuggestedNextSteps 
               completedMilestones={Object.keys(milestones)} 
               allMilestones={MILESTONE_DATA} 
               onStartMilestone={handleStartMilestone}
            />
          </div>

          {/* Right Column: Milestones */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(MILESTONE_DATA).map(([categoryId, categoryMilestones]) => {
              const categoryInfo = MILESTONE_CATEGORIES[categoryId];
              const isCollapsed = collapsedSections[categoryId];
              const completedInCategory = categoryMilestones.filter(m => milestones[m.id]).length;
              
              return (
                <Card key={categoryId} className="bg-brand-card-bg/50 border-brand-border">
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => toggleSection(categoryId)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${categoryInfo.color} flex items-center justify-center`}>
                           <Trophy className="w-5 h-5 text-white" />
                         </div>
                         <div>
                            <CardTitle className="text-xl">{categoryInfo.title}</CardTitle>
                            <p className="text-sm text-brand-text-secondary">{categoryInfo.description}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-brand-border">{completedInCategory} / {categoryMilestones.length}</Badge>
                        {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                      </div>
                    </div>
                  </CardHeader>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categoryMilestones.map(milestone => (
                              <MilestoneCard 
                                key={milestone.id}
                                milestone={milestone}
                                isCompleted={!!milestones[milestone.id]}
                                isLocked={false} // Add locking logic later if needed
                                onStart={handleStartMilestone}
                              />
                            ))}
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Proud Partners Section */}
      <div className="mt-16 border-t border-brand-border/20 pt-12">
        <SponsorShowcase />
      </div>

      <CompletionModal 
        isOpen={!!completedMilestone}
        milestone={completedMilestone}
        onClose={() => setCompletedMilestone(null)}
        onShare={handleShare}
      />
    </div>
  );
}
