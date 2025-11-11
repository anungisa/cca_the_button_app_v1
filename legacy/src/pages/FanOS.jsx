import React, { सuspense, lazy } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Puzzle, Brain, Trophy, Gift, ArrowRight } from 'lucide-react';
import { useXP } from '../components/XPContext';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import LazyPageWrapper from '../components/LazyPageWrapper';
import SkeletonPage from '../components/ui/SkeletonPage';

const FanOSOverview = lazy(() => import('../components/fanos/FanOSOverview'));
const ActiveChallenges = lazy(() => import('../components/fanos/ActiveChallenges'));
const StreaksTracker = lazy(() => import('../components/fanos/StreaksTracker'));
const PatchHighlights = lazy(() => import('../components/fanos/PatchHighlights'));

/**
 * @file FanOS.js
 * @description The main user-facing dashboard for the Fan Operating System (FanOS).
 * It serves as a central hub for fans to engage with trivia, challenges, patch scanning,
 * and other loyalty features.
 */
export default function FanOS() {
  const { user, loyaltyData, isLoading } = useXP();

  if (isLoading) {
    return <SkeletonPage variant="dashboard" />;
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-2">Welcome to FanOS!</h2>
        <p className="text-brand-text-secondary mb-4">Log in to join the fun, earn points, and get exclusive rewards.</p>
        <Button onClick={() => User.login()}>Log In</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="p-8 bg-brand-red text-white rounded-lg text-center">
        <Zap className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">FanOS Dashboard</h1>
        <p className="text-xl mt-2 max-w-2xl mx-auto">
          Your home for challenges, trivia, and exclusive rewards.
        </p>
      </div>

      <LazyPageWrapper>
        <FanOSOverview loyaltyData={loyaltyData} />
      </LazyPageWrapper>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trophy /> Active Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <LazyPageWrapper>
              <ActiveChallenges />
            </LazyPageWrapper>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Brain /> Daily Trivia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brand-text-secondary mb-4">Test your curling knowledge and earn XP!</p>
              <Button asChild className="w-full">
                <Link to={createPageUrl('TriviaHub')}>Play Now <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Puzzle /> Patch Scanner</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brand-text-secondary mb-4">Scan QR codes at events to claim patches.</p>
              <Button asChild className="w-full">
                <Link to={createPageUrl('PatchScanner')}>Scan Patch <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LazyPageWrapper>
              <StreaksTracker />
          </LazyPageWrapper>
          <LazyPageWrapper>
              <PatchHighlights />
          </LazyPageWrapper>
       </div>

    </div>
  );
}