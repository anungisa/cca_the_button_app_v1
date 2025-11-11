import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, Zap, CheckCircle2 } from 'lucide-react';

const MicroChallengeBoard = ({ challenges }) => {
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-red" />
            Mini-Challenges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.length > 0 ? challenges.map(challenge => (
          <div key={challenge.id} className={`p-3 rounded-lg ${challenge.isComplete ? 'bg-green-500/20' : 'bg-brand-card-bg/50'}`}>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-brand-text-primary">{challenge.description}</p>
              {challenge.isComplete && <CheckCircle2 className="w-5 h-5 text-green-400" />}
            </div>
            {!challenge.isComplete && (
                <>
                    <Progress value={(challenge.progress / challenge.goal) * 100} className="h-2 [&>*]:bg-brand-red" />
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-brand-text-secondary">{challenge.progress} / {challenge.goal}</span>
                        <div className="flex items-center gap-1 text-xs text-amber-400">
                            <Zap className="w-3 h-3" />
                            <span>+{challenge.xp} XP</span>
                        </div>
                    </div>
                </>
            )}
          </div>
        )) : <p className="text-brand-text-secondary text-sm text-center">No challenges available right now.</p>}
      </CardContent>
    </Card>
  );
};

export default MicroChallengeBoard;