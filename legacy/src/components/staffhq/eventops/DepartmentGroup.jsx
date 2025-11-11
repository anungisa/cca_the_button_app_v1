import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import EventTaskItem from './EventTaskItem';

export default function DepartmentGroup({ department }) {
  const [isOpen, setIsOpen] = useState(true);
  
  const completedTasks = department.tasks?.filter(t => t.status === 'completed').length || 0;
  const totalTasks = department.tasks?.length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
            <div className="flex items-center gap-4">
              <CardTitle>{department.name}</CardTitle>
              <div className="w-40">
                  <div className="h-2 bg-brand-border rounded-full">
                      <div className="h-2 bg-brand-red rounded-full" style={{ width: `${progress}%`}}></div>
                  </div>
              </div>
              <span className="text-sm text-brand-text-secondary">{completedTasks} / {totalTasks}</span>
            </div>
            <button>
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-2">
              {department.tasks.map(task => (
                <EventTaskItem key={task.task_id} task={task} />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}