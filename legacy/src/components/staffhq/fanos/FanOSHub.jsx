import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Puzzle, Trophy, Gift, BarChart3, Brain } from 'lucide-react';
import TriviaManager from './TriviaManager';
import PatchManager from './PatchManager';
import ChallengeManager from './ChallengeManager';
import RewardsManager from './RewardsManager';
import FanOSAnalytics from './FanOSAnalytics';

/**
 * @file FanOSHub.js
 * @description Central management hub for all FanOS (Fan Operating System) features.
 * This component provides a tabbed interface for staff to manage trivia, patches,
 * challenges, rewards, and view analytics related to fan engagement.
 */
export default function FanOSHub() {
  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3, component: <FanOSAnalytics /> },
    { id: 'trivia', label: 'Trivia Manager', icon: Brain, component: <TriviaManager /> },
    { id: 'patches', label: 'Patch Manager', icon: Puzzle, component: <PatchManager /> },
    { id: 'challenges', label: 'Challenge Manager', icon: Trophy, component: <ChallengeManager /> },
    { id: 'rewards', label: 'Rewards Manager', icon: Gift, component: <RewardsManager /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Zap className="w-8 h-8 text-brand-red" />
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">FanOS Management</h2>
          <p className="text-brand-text-secondary">Configure and monitor all fan engagement features.</p>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}