import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Calendar } from 'lucide-react';

export default function StreaksTracker() {
  // This would come from the UserStreak entity
  const streakData = {
    daily_login: 5,
    trivia_correct: 3,
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Flame /> Your Streaks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2"><Calendar className="w-4 h-4"/> Daily Login</p>
          <p className="font-bold text-lg">{streakData.daily_login} days</p>
        </div>
        <div className="flex items-center justify-between">
          <p>Trivia Correct Answers</p>
          <p className="font-bold text-lg">{streakData.trivia_correct} in a row</p>
        </div>
      </CardContent>
    </Card>
  );
}