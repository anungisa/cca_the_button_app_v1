import React, { useState, useEffect, useCallback } from 'react';
import { useXP } from '../components/XPContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Award, Zap, Star, Trophy, Users, Shield, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { XPRecommendationEngine } from '../components/utils/XPRecommendationEngine';
import { User } from '@/api/entities';

import LoyaltyCard from '../components/loyalty/LoyaltyCard';
import BadgeShowcase from '../components/loyalty/BadgeShowcase';
import ClubHeroCard from '../components/loyalty/ClubHeroCard';
import { ConsentRegistry } from '../components/utils/ConsentRegistry';
import LeaderboardPanel from '../components/loyalty/LeaderboardPanel';

const MissionCard = ({ mission }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ y: -2, scale: 1.02 }}
    className="bg-brand-card-bg border border-brand-border rounded-lg p-4 flex items-center gap-4 hover:shadow-lg transition-all"
  >
    <div className="w-10 h-10 bg-brand-red/10 rounded-full flex items-center justify-center">
      <Star className="w-5 h-5 text-brand-red" />
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-brand-text-primary">{mission.title}</h4>
        <Badge className="bg-amber-400/10 text-amber-400 border-amber-400/20">
          <Zap className="w-3 h-3 mr-1" />
          {mission.xp} XP
        </Badge>
      </div>
      <p className="text-sm text-brand-text-secondary">{mission.description}</p>
    </div>
    <Button asChild size="sm" variant="ghost" className="text-brand-red">
      <Link to={createPageUrl(mission.actionUrl)}>
        Go <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    </Button>
  </motion.div>
);

const AIPredictionCard = ({ prediction }) => {
  if (!prediction) return null;
  return (
    <Card className="bg-gradient-to-br from-brand-red/10 via-brand-charcoal to-brand-charcoal border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-400">
          <Trophy className="w-5 h-5" />
          Your Path to Glory
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-brand-text-secondary">Next Tier Estimate</p>
          <p className="text-lg font-bold text-brand-text-primary">{prediction.timeframe}</p>
        </div>
        <div>
          <p className="text-sm text-brand-text-secondary mb-2">Pro Tips to Get There Faster:</p>
          <ul className="space-y-1">
            {prediction.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-brand-text-primary">
                <span className="mt-1">⚡</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm font-medium text-amber-400/80 italic">"{prediction.message}"</p>
      </CardContent>
    </Card>
  );
};

const ResponsiveTabs = ({ tabs, defaultValue }) => {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-brand-card-bg border-brand-border">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.icon && React.createElement(tab.icon, { className: "w-4 h-4 mr-2" })}
            <span className="hidden sm:block">{tab.label}</span>
            <span className="block sm:hidden">{tab.shortLabel || tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default function LoyaltyProgramPage() {
  const { user, loyaltyData, isLoading, tierConfig } = useXP();
  const [recommendations, setRecommendations] = useState({ missions: [], prediction: null });
  const [isRecsLoading, setIsRecsLoading] = useState(true);
  const [hasConsent, setHasConsent] = useState(false);
  const [clubLoyalty, setClubLoyalty] = useState(null);

  const loadClubLoyalty = useCallback(() => {
    // Create default club loyalty data if none exists
    const defaultClubLoyalty = {
      recognition_level: 'bronze',
      hero_program_settings: {
        club_name: user?.home_club_name || 'Your Club'
      },
      monthly_stats: {
        active_members: 0,
        points_distributed: 0,
        rank_in_region: null
      },
      grant_bonus_earned: 0
    };
    
    setClubLoyalty(defaultClubLoyalty);
  }, [user]);

  useEffect(() => {
    const checkConsent = async () => {
      try {
        const consentStatus = await ConsentRegistry.hasConsent('ai_personalization');
        setHasConsent(consentStatus);
      } catch (error) {
        console.warn('Failed to check consent:', error);
        setHasConsent(false);
      }
    };

    if (user && user.id) {
      checkConsent();
      loadClubLoyalty();
    }
  }, [user, loadClubLoyalty]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      // ✅ SAFE: Only fetch if user has valid ID
      if (!user || !user.id || typeof user.id !== 'string' || user.id.includes('sample')) {
        console.warn('Invalid or sample user detected, using fallback recommendations');
        setRecommendations({
          missions: XPRecommendationEngine.getFallbackMissions(),
          prediction: XPRecommendationEngine.getFallbackPrediction()
        });
        setIsRecsLoading(false);
        return;
      }

      if (loyaltyData) {
        setIsRecsLoading(true);
        try {
          const recs = await XPRecommendationEngine.getRecommendations(user, loyaltyData);
          setRecommendations(recs);
        } catch (error) {
          console.error('Failed to fetch recommendations:', error);
          setRecommendations({
            missions: XPRecommendationEngine.getFallbackMissions(),
            prediction: XPRecommendationEngine.getFallbackPrediction()
          });
        } finally {
          setIsRecsLoading(false);
        }
      }
    };
    fetchRecommendations();
  }, [user, loyaltyData]);

  const handleGrantConsent = async () => {
    try {
      await ConsentRegistry.grantConsent('ai_personalization');
      setHasConsent(true);
      // Re-fetch recommendations with AI features enabled
      setIsRecsLoading(true);
      const recs = await XPRecommendationEngine.getRecommendations(user, loyaltyData);
      setRecommendations(recs);
      setIsRecsLoading(false);
    } catch (error) {
      console.error('Failed to grant consent:', error);
    }
  };

  const loyaltyTabs = [
    {
      value: 'club_hero',
      label: 'Club Hero Program',
      shortLabel: 'Club Hero',
      icon: Users,
      content: <ClubHeroCard clubLoyalty={clubLoyalty} />
    },
    {
      value: 'rewards_store',
      label: 'Rewards Store',
      shortLabel: 'Rewards',
      icon: Trophy,
      content: (
        <Card className="bg-brand-card-bg border-brand-border text-center p-8">
          <p className="text-brand-text-primary mb-4">The Rewards Store is coming soon!</p>
          <Button asChild>
            <Link to={createPageUrl('RewardStore')}>
              Preview Rewards <ArrowRight className="w-4 h-4 ml-2"/>
            </Link>
          </Button>
        </Card>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  // ✅ SAFE: Handle no user case
  if (!user || !user.id) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-brand-text-primary mb-4">Welcome to Granite Circle</h2>
        <p className="text-brand-text-secondary mb-6">
          Please log in to view your loyalty program status and rewards.
        </p>
        <Button onClick={() => User.login()} className="bg-brand-red hover:bg-red-700">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center">
            <Award className="w-7 h-7 text-white" />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">Granite Circle</h1>
            <p className="text-brand-text-secondary">Your journey, your rewards. Track your progress here.</p>
        </div>
      </div>
      
      {!hasConsent && (
        <Alert className="bg-blue-900/20 border-blue-500/30 text-brand-text-primary">
            <Shield className="h-4 w-4" />
            <AlertTitle>Enhance Your Experience!</AlertTitle>
            <AlertDescription>
                Enable personalized AI features to get smart mission recommendations and progress predictions.
                <Button onClick={handleGrantConsent} size="sm" className="ml-4 bg-blue-600 hover:bg-blue-700">Enable AI</Button>
            </AlertDescription>
        </Alert>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <LoyaltyCard loyaltyData={loyaltyData} tierConfig={tierConfig} />
          
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-brand-red" />
                    Recommended Missions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {isRecsLoading ? (
                    <div className="flex justify-center items-center h-24">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                ) : (
                  recommendations.missions.length > 0 ? (
                    recommendations.missions.map(mission => <MissionCard key={mission.id} mission={mission} />)
                  ) : (
                    <p className="text-brand-text-secondary text-center py-4">No new missions right now. Check back soon!</p>
                  )
                )}
            </CardContent>
          </Card>
          <LeaderboardPanel />
        </div>

        {/* Right Column - Badges & Prediction */}
        <div className="space-y-8">
            {hasConsent && <AIPredictionCard prediction={recommendations.prediction} />}
            <BadgeShowcase badges={loyaltyData?.badges || []} />
        </div>
      </div>

      {/* Additional Sections */}
      <ResponsiveTabs
        tabs={loyaltyTabs}
        defaultValue="club_hero"
      />
    </div>
  );
}