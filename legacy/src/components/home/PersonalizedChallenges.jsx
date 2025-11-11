import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, Square, Target } from 'lucide-react';

// Mock data for challenges
const challenges = [
  { id: 1, title: 'Watch a Live Game', description: 'Tune into any live game on Curling+ for at least 10 minutes.', progress: 1, target: 1, xp: 50 },
  { id: 2, title: 'Join a Community Discussion', description: 'Post a reply in any thread in the Community Hub.', progress: 0, target: 1, xp: 25 },
  { id: 3, title: 'Update Your Profile', description: 'Add your skill level and preferred position to your profile.', progress: 1, target: 1, xp: 100 },
];

export default function PersonalizedChallenges() {
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Your Daily Challenges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {challenges.map(challenge => {
            const isCompleted = challenge.progress >= challenge.target;
            return (
              <li key={challenge.id} className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-md">
                <div className="flex items-start gap-3">
                    {isCompleted ? <CheckSquare className="w-5 h-5 text-green-500 mt-1" /> : <Square className="w-5 h-5 text-brand-text-secondary mt-1" />}
                    <div>
                        <h4 className={`font-medium text-brand-text-primary ${isCompleted ? 'line-through' : ''}`}>{challenge.title}</h4>
                        <p className="text-sm text-brand-text-secondary">{challenge.description}</p>
                    </div>
                </div>
                <div className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm font-bold">
                  +{challenge.xp} XP
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}