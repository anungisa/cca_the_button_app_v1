import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EventPlan } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, MapPin, Users, DollarSign, ListChecks, MessageSquare, Paperclip, Edit } from 'lucide-react';
import DepartmentGroup from '../components/staffhq/eventops/DepartmentGroup';

export default function EventPlanDetailPage() {
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchPlan = async () => {
      const params = new URLSearchParams(location.search);
      const planId = params.get('id');
      if (planId) {
        try {
          const fetchedPlan = await EventPlan.get(planId);
          setPlan(fetchedPlan);
        } catch (error) {
          console.error("Failed to fetch event plan:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchPlan();
  }, [location.search]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-brand-red" /></div>;
  }

  if (!plan) {
    return <div className="text-center py-10">Event Plan not found.</div>;
  }
  
  const completionPercentage = plan.completion_stats?.total_tasks > 0
    ? Math.round((plan.completion_stats.completed_tasks / plan.completion_stats.total_tasks) * 100)
    : 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">{plan.event_name}</h1>
          <p className="text-brand-text-secondary mt-1">Event Operations Plan</p>
        </div>
        <Button variant="outline"><Edit className="w-4 h-4 mr-2" /> Edit Plan</Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle className="text-sm font-medium">Event Date</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{new Date(plan.event_date).toLocaleDateString()}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium">Venue</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{plan.venue}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium">Budget</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">${plan.budget_info?.total_budget?.toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium">Overall Progress</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{completionPercentage}%</p></CardContent></Card>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks"><ListChecks className="w-4 h-4 mr-2"/>Tasks</TabsTrigger>
          <TabsTrigger value="budget"><DollarSign className="w-4 h-4 mr-2"/>Budget</TabsTrigger>
          <TabsTrigger value="comments"><MessageSquare className="w-4 h-4 mr-2"/>Comments</TabsTrigger>
          <TabsTrigger value="files"><Paperclip className="w-4 h-4 mr-2"/>Files</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="mt-6">
            <div className="space-y-4">
              {plan.departments?.map((dept, index) => (
                <DepartmentGroup key={index} department={dept} />
              ))}
            </div>
        </TabsContent>
        <TabsContent value="budget" className="mt-6">
            <Card><CardContent className="p-6">Budget details coming soon.</CardContent></Card>
        </TabsContent>
        <TabsContent value="comments" className="mt-6">
            <Card><CardContent className="p-6">Comments coming soon.</CardContent></Card>
        </TabsContent>
        <TabsContent value="files" className="mt-6">
            <Card><CardContent className="p-6">File attachments coming soon.</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}