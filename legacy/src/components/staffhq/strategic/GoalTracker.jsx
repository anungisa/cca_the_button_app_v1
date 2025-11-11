import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StrategicGoal } from '@/api/entities';
import { Loader2, Plus, Target } from 'lucide-react';

export default function GoalTracker() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const data = await StrategicGoal.list();
        setGoals(data);
      } catch (error) {
        console.error("Failed to load strategic goals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadGoals();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'on_track': return 'bg-green-600';
      case 'at_risk': return 'bg-yellow-500';
      case 'off_track': return 'bg-red-600';
      case 'achieved': return 'bg-blue-600';
      default: return 'bg-gray-500';
    }
  };

  const GoalCard = ({ goal }) => (
    <Card className="bg-brand-charcoal border-brand-border flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="secondary">{goal.category}</Badge>
          <Badge className={getStatusColor(goal.status)}>{goal.status.replace('_', ' ')}</Badge>
        </div>
        <CardTitle className="text-lg mt-2">{goal.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-brand-text-secondary mb-4">{goal.description}</p>
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{goal.progress_percentage}%</span>
            </div>
            <Progress value={goal.progress_percentage} />
            <p className="text-xs text-brand-text-secondary">Owner: {goal.owner_name}</p>
            <p className="text-xs text-brand-text-secondary">Target: {new Date(goal.target_date).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Strategic Goals</h3>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Goal</Button>
        </div>
        {goals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
            </div>
        ) : (
             <Card className="bg-brand-card-bg border-brand-border text-center p-8">
              <Target className="w-12 h-12 mx-auto text-brand-text-secondary mb-4" />
              <p className="font-bold text-brand-text-primary">No Strategic Goals Defined</p>
              <p className="text-sm text-brand-text-secondary">Click 'Add Goal' to start planning.</p>
            </Card>
        )}
    </div>
  );
}