import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SuggestedNextSteps({ completedMilestones, allMilestones, onStartMilestone }) {
  const navigate = useNavigate();

  const findNextMilestone = (category) => {
    return allMilestones[category]?.find(m => !completedMilestones.includes(m.id));
  };

  const suggestions = Object.keys(allMilestones)
    .map(findNextMilestone)
    .filter(Boolean);

  if (suggestions.length === 0) {
    return (
        <Card className="bg-gradient-to-r from-amber-600 to-amber-700 text-white border-0">
            <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold">Passport Complete!</h3>
                <p className="opacity-90 mt-2">You've completed all available milestones. Amazing work!</p>
            </CardContent>
        </Card>
    );
  }

  const handleStart = (milestone) => {
    if (onStartMilestone) {
        onStartMilestone(milestone);
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          What's Next on Your Journey?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.slice(0, 3).map(milestone => {
          const Icon = milestone.icon;
          return (
            <div key={milestone.id} className="flex items-center gap-4 p-3 bg-brand-charcoal/50 rounded-lg">
              <div className="w-8 h-8 bg-brand-red/20 text-brand-red rounded-full flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <h4 className="font-semibold text-brand-text-primary">{milestone.title}</h4>
                <p className="text-sm text-brand-text-secondary">{milestone.description}</p>
              </div>
              <Button size="sm" variant="ghost" className="text-brand-red hover:text-red-400" onClick={() => handleStart(milestone)}>
                Go <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}