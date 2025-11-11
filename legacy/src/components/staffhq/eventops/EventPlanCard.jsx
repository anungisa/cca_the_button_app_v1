import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle } from 'lucide-react';

export default function EventPlanCard({ plan }) {
  const completionPercentage = plan.completion_stats?.total_tasks > 0
    ? (plan.completion_stats.completed_tasks / plan.completion_stats.total_tasks) * 100
    : 0;

  const statusColors = {
    planning: 'bg-blue-500',
    in_progress: 'bg-yellow-500',
    completed: 'bg-green-500',
    cancelled: 'bg-gray-500',
  };

  return (
    <Link to={createPageUrl(`EventPlanDetail?id=${plan.id}`)}>
      <Card className="bg-brand-card-bg border-brand-border hover:border-brand-red transition-all h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold text-brand-text-primary">{plan.event_name}</CardTitle>
            <Badge className={`${statusColors[plan.status]} text-white`}>{plan.status}</Badge>
          </div>
          <p className="text-sm text-brand-text-secondary flex items-center gap-2 pt-1">
            <Calendar className="w-4 h-4" />
            {new Date(plan.event_date).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-brand-text-secondary mb-2">{plan.event_type.replace('_', ' ')} at {plan.venue}</p>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-brand-text-secondary">
              <span>Task Progress</span>
              <span>{plan.completion_stats?.completed_tasks || 0} / {plan.completion_stats?.total_tasks || 0}</span>
            </div>
            <Progress value={completionPercentage} />
          </div>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-brand-text-secondary">Created by: {plan.created_by}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}