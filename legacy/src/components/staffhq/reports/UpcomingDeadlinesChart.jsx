import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ComplianceItem } from '@/api/entities';
import { EventPlan } from '@/api/entities';
import { format, differenceInDays, addDays } from 'date-fns';

export default function UpcomingDeadlinesChart() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [complianceData, eventPlanData] = await Promise.all([
          ComplianceItem.filter({ status: ['not_started', 'in_progress'] }),
          EventPlan.filter({ status: ['planning', 'in_progress'] }),
        ]);

        const complianceItems = complianceData || [];
        const eventPlans = eventPlanData || [];

        const complianceDeadlines = complianceItems
          .filter(item => item.due_date)
          .map(item => ({
            name: item.title,
            dueDate: new Date(item.due_date),
            type: 'Compliance',
          }));
        
        const eventDeadlines = eventPlans.flatMap(plan =>
          (plan.departments || []).flatMap(dept =>
            (dept.tasks || []).filter(t => t.status !== 'completed' && t.due_date).map(task => ({
              name: `${plan.event_name}: ${task.task_name}`,
              dueDate: new Date(task.due_date),
              type: 'Event Task',
            }))
          )
        );
        
        const allDeadlines = [...complianceDeadlines, ...eventDeadlines];
        const upcoming = allDeadlines
          .filter(d => differenceInDays(d.dueDate, new Date()) >= 0 && differenceInDays(d.dueDate, new Date()) <= 30)
          .sort((a, b) => a.dueDate - b.dueDate);
        
        setData(upcoming);
      } catch (error) {
        console.error("Failed to load deadline data:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
  
  const deadlineCategories = useMemo(() => {
    const categories = {
      'Overdue': data.filter(d => differenceInDays(d.dueDate, new Date()) < 0).length,
      'Today': data.filter(d => differenceInDays(d.dueDate, new Date()) === 0).length,
      'Next 7 Days': data.filter(d => differenceInDays(d.dueDate, new Date()) > 0 && differenceInDays(d.dueDate, new Date()) <= 7).length,
      'Next 30 Days': data.filter(d => differenceInDays(d.dueDate, new Date()) > 7 && differenceInDays(d.dueDate, new Date()) <= 30).length,
    };
    return Object.entries(categories).map(([name, count]) => ({ name, count }));
  }, [data]);

  if (isLoading) {
    return <div className="h-64 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
        <CardDescription>A summary of approaching compliance and event deadlines.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-center text-brand-text-secondary py-8">No upcoming deadlines in the next 30 days.</p>
        ) : (
          <ul className="space-y-3 max-h-80 overflow-y-auto">
            {data.slice(0, 10).map((item, index) => (
              <li key={index} className="flex justify-between items-center p-2 bg-brand-charcoal rounded-md">
                <div>
                  <p className="text-sm font-medium text-brand-text-primary truncate" title={item.name}>{item.name}</p>
                  <p className={`text-xs ${item.type === 'Compliance' ? 'text-red-400' : 'text-blue-400'}`}>{item.type}</p>
                </div>
                <p className="text-sm text-brand-text-secondary whitespace-nowrap">{format(item.dueDate, 'MMM d')}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}