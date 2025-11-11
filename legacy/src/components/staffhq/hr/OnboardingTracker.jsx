import React, { useState, useEffect } from 'react';
import { OnboardingChecklist } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function OnboardingTracker() {
  const [checklists, setChecklists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChecklists = async () => {
      try {
        const data = await OnboardingChecklist.filter({ overall_status: 'in_progress' });
        // In a real app, we'd enrich this with user data
        setChecklists(data);
      } catch (e) {
        console.error("Failed to load onboarding checklists", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadChecklists();
  }, []);

  const OnboardingCard = ({ checklist }) => {
    const totalTasks = checklist.tasks.length;
    const completedTasks = checklist.tasks.filter(t => t.status === 'completed').length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const overdueTasks = checklist.tasks.filter(t => new Date(t.due_date) < new Date() && t.status !== 'completed').length;

    return (
      <Card className="bg-brand-charcoal border-brand-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{checklist.user_id.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-brand-text-primary">New Hire: {checklist.user_id}</p>
              <p className="text-sm text-brand-text-secondary">Start Date: {new Date(checklist.start_date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
            <div className="flex justify-between text-xs text-brand-text-secondary">
              <span>{completedTasks}/{totalTasks} tasks complete</span>
              {overdueTasks > 0 && <Badge variant="destructive">{overdueTasks} Overdue</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      {checklists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {checklists.map(checklist => (
            <OnboardingCard key={checklist.id} checklist={checklist} />
          ))}
        </div>
      ) : (
        <Card className="bg-brand-card-bg border-brand-border text-center p-8">
          <ClipboardList className="w-12 h-12 mx-auto text-brand-text-secondary mb-4" />
          <p className="font-bold text-brand-text-primary">No Active Onboarding Plans</p>
          <p className="text-sm text-brand-text-secondary">All new hires are fully onboarded!</p>
        </Card>
      )}
    </div>
  );
}