
import React, { useState, useEffect, useCallback } from 'react';
import { EventPlan } from '@/api/entities';
import { EventPlanActivity } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Users, CheckSquare, Calendar, ChevronLeft } from 'lucide-react';
import DepartmentGroup from './DepartmentGroup';
import CollaborationSection from '../../utils/CollaborationSection';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';

export default function EventPlanDetailView({ planId }) {
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const loadPlan = useCallback(async () => {
    try {
      const planData = await EventPlan.get(planId);
      setPlan(planData);
    } catch (err) {
      setError('Failed to load event plan details.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [planId]);
  
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await User.me();
      setUser(currentUser);
    };
    fetchUser();
    loadPlan();
  }, [loadPlan]);

  const handleTaskUpdate = async (departmentName, taskId, newStatus) => {
    if (!plan) return;

    const updatedPlan = { ...plan };
    const deptIndex = updatedPlan.departments.findIndex(d => d.name === departmentName);
    if (deptIndex === -1) return;

    const taskIndex = updatedPlan.departments[deptIndex].tasks.findIndex(t => t.task_id === taskId);
    if (taskIndex === -1) return;
    
    const oldStatus = updatedPlan.departments[deptIndex].tasks[taskIndex].status;
    updatedPlan.departments[deptIndex].tasks[taskIndex].status = newStatus;

    if(newStatus === 'completed') {
        updatedPlan.departments[deptIndex].tasks[taskIndex].completed_date = new Date().toISOString();
        updatedPlan.departments[deptIndex].tasks[taskIndex].completed_by = user.id;
    }

    // Recalculate stats
    let completed = 0;
    let total = 0;
    updatedPlan.departments.forEach(dept => {
      dept.tasks.forEach(task => {
        total++;
        if(task.status === 'completed') completed++;
      });
    });
    updatedPlan.completion_stats = {
      ...updatedPlan.completion_stats,
      completed_tasks: completed,
      total_tasks: total,
    };
    
    setPlan(updatedPlan);

    try {
      await EventPlan.update(plan.id, { 
        departments: updatedPlan.departments,
        completion_stats: updatedPlan.completion_stats 
      });

      await EventPlanActivity.create({
        event_plan_id: plan.id,
        task_id: taskId,
        activity_type: 'status_changed',
        user_id: user.id,
        user_name: user.full_name,
        details: { 
          task_name: updatedPlan.departments[deptIndex].tasks[taskIndex].task_name,
          previous_value: oldStatus,
          new_value: newStatus
        },
        timestamp: new Date().toISOString()
      });
    } catch(err) {
        console.error("Failed to update task", err);
        setError("Failed to update task. Changes may not be saved.");
        // Optionally revert state here
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brand-red" /></div>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }
  
  if (!plan) {
    return <p className="text-center">Event plan not found.</p>;
  }

  const completionPercentage = plan.completion_stats?.total_tasks > 0 
    ? (plan.completion_stats.completed_tasks / plan.completion_stats.total_tasks) * 100 
    : 0;

  return (
    <div className="space-y-6">
       <Button asChild variant="outline" size="sm">
            <Link to={createPageUrl('EventOpsToolkit')}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Toolkit
            </Link>
        </Button>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-2xl text-brand-text-primary">{plan.event_name}</CardTitle>
          <p className="text-brand-text-secondary">
            {format(new Date(plan.event_date), 'MMMM d, yyyy')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-brand-charcoal rounded-lg">
                  <CheckSquare className="w-6 h-6 text-green-400" />
                  <div>
                      <p className="font-bold text-lg text-brand-text-primary">{plan.completion_stats?.completed_tasks || 0} / {plan.completion_stats?.total_tasks || 0}</p>
                      <p className="text-sm text-brand-text-secondary">Tasks Completed</p>
                  </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-brand-charcoal rounded-lg">
                  <Users className="w-6 h-6 text-blue-400" />
                  <div>
                      <p className="font-bold text-lg text-brand-text-primary">{[...new Set(plan.departments?.flatMap(d => d.tasks.map(t => t.assigned_name)))].filter(Boolean).length}</p>
                      <p className="text-sm text-brand-text-secondary">Team Members</p>
                  </div>
              </div>
          </div>
          <Progress value={completionPercentage} className="w-full h-3" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {plan.departments?.map((dept) => (
            <DepartmentGroup 
                key={dept.name} 
                department={dept} 
                onTaskUpdate={(taskId, status) => handleTaskUpdate(dept.name, taskId, status)}
            />
          ))}
        </div>
        <div className="lg:col-span-1">
          <CollaborationSection
            entityId={planId}
            entityType="EventPlan"
            commentEntity={EventPlanActivity}
            activityEntity={EventPlanActivity}
          />
        </div>
      </div>
    </div>
  );
}
