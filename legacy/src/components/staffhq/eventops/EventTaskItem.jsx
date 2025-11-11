import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function EventTaskItem({ task }) {
  const priorityColors = {
    low: 'bg-blue-200 text-blue-800',
    medium: 'bg-yellow-200 text-yellow-800',
    high: 'bg-red-200 text-red-800',
  };

  return (
    <div className={`p-3 rounded-md flex items-center justify-between border-l-4 ${task.status === 'completed' ? 'bg-brand-charcoal/50 border-green-500' : 'bg-brand-charcoal border-transparent'}`}>
      <div className="flex items-center gap-3">
        <Checkbox checked={task.status === 'completed'} />
        <div>
          <p className={`text-brand-text-primary ${task.status === 'completed' ? 'line-through text-brand-text-secondary' : ''}`}>{task.task_name}</p>
          <p className="text-xs text-brand-text-secondary">{task.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
        <span className="text-sm text-brand-text-secondary">{format(new Date(task.due_date), 'MMM dd')}</span>
        <Avatar className="h-8 w-8">
          <AvatarFallback>{task.assigned_name?.charAt(0) || '?'}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}