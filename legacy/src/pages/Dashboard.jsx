
import React, { useState, useEffect } from 'react';
import { useXP } from '../components/XPContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Gamepad2, 
  Users, 
  Calendar,
  Trophy,
  QrCode,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion'; // Import motion for animations

// Import FanOS components
import TriviaPanel from '../components/fanos/TriviaPanel';
import PatchScanPanel from '../components/fanos/PatchScanPanel';
import LiveOddsPanel from '../components/pointsbet/LiveOddsPanel';
import InsightFeed from '../components/ai/InsightFeed'; // New import for AI integration
import LandingPage from '../components/home/LandingPage'; // Corrected path from ../components/LandingPage

export default function Dashboard() {
  const { user, loyaltyData, isLoading: isUserLoading } = useXP();

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-brand-text-secondary">Loading your CurlingOS dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect or show a landing page if user data is not available
    // This could also be a check for user authentication status
    return <LandingPage />;
  }
  
  // Determine relevant context for AI insights based on user type
  const relevantContextId = user.user_type === 'ma_admin' ? user.ma_region : user.home_club_id;
  const relevantContextType = user.user_type === 'ma_admin' ? 'ma_region' : 'club';

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-brand-text-primary mb-2">
          Welcome to CurlingOS
        </h1>
        <p className="text-xl text-brand-text-secondary">
          Canada's unified digital platform for curling
        </p>
        {loyaltyData && (
          <div className="flex items-center justify-center gap-2 mt-4 text-2xl font-bold text-amber-400">
            <Zap className="w-6 h-6"/>
            <span>{loyaltyData.curl_points} XP</span>
            <span className="text-brand-text-secondary text-base">• {loyaltyData.tier.replace('_', ' ').toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Proactive Insights Feed - New section for AI integration */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <InsightFeed contextType={relevantContextType} contextId={relevantContextId} />
      </motion.div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button asChild className="h-20 flex-col bg-brand-card-bg hover:bg-brand-border border border-brand-border">
          <Link to={createPageUrl('FanOS')}>
            <Gamepad2 className="w-6 h-6 mb-2 text-brand-red" />
            <span className="text-brand-text-primary">FanOS</span>
          </Link>
        </Button>
        <Button asChild className="h-20 flex-col bg-brand-card-bg hover:bg-brand-border border border-brand-border">
          <Link to={createPageUrl('LoyaltyProgram')}>
            <Trophy className="w-6 h-6 mb-2 text-brand-red" />
            <span className="text-brand-text-primary">Granite Circle</span>
          </Link>
        </Button>
        <Button asChild className="h-20 flex-col bg-brand-card-bg hover:bg-brand-border border border-brand-border">
          <Link to={createPageUrl('Events')}>
            <Calendar className="w-6 h-6 mb-2 text-brand-red" />
            <span className="text-brand-text-primary">Events</span>
          </Link>
        </Button>
        <Button asChild className="h-20 flex-col bg-brand-card-bg hover:bg-brand-border border border-brand-border">
          <Link to={createPageUrl('Clubs')}>
            <Users className="w-6 h-6 mb-2 text-brand-red" />
            <span className="text-brand-text-primary">Find Clubs</span>
          </Link>
        </Button>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="fanos" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-brand-card-bg border-brand-border">
          <TabsTrigger value="fanos">
            <Gamepad2 className="w-4 h-4 mr-2" />
            FanOS
          </TabsTrigger>
          <TabsTrigger value="predictions">
            <TrendingUp className="w-4 h-4 mr-2" />
            Live Odds
          </TabsTrigger>
          <TabsTrigger value="community">
            <Users className="w-4 h-4 mr-2" />
            Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fanos" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-brand-red" />
                  Patch Scanner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PatchScanPanel />
              </CardContent>
            </Card>
            
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Daily Trivia</CardTitle>
              </CardHeader>
              <CardContent>
                <TriviaPanel />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="mt-6">
          <div className="max-w-4xl mx-auto">
            <LiveOddsPanel />
          </div>
        </TabsContent>

        <TabsContent value="community" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-brand-text-primary mb-2">Community Features Coming Soon</h3>
              <p className="text-brand-text-secondary mb-6">
                Connect with other curlers, share achievements, and participate in community challenges.
              </p>
              <Button asChild>
                <Link to={createPageUrl('CommunityHub')}>
                  Explore Community
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
