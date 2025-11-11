import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target } from 'lucide-react';

export default function NextGoalBanner() {
  // This would be driven by logic from useStreakEngine or similar in a real app
  const nextChallenge = {
    title: 'Log 3 Sessions This Week',
    xp: 75
  };

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Target className="w-8 h-8" />
          <div>
            <h4 className="font-bold">Next Goal</h4>
            <p className="text-sm text-white/80">{nextChallenge.title} for +{nextChallenge.xp} XP</p>
          </div>
        </div>
        <Button variant="ghost" className="text-white hover:bg-white/20">
          View Challenges <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}