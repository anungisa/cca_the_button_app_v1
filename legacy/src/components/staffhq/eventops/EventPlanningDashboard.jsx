import React, { useState, useEffect } from 'react';
import { EventPlan } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import EventPlanCard from './EventPlanCard';
import CreateEventPlanModal from './CreateEventPlanModal';

export default function EventPlanningDashboard() {
  const [eventPlans, setEventPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const loadEventPlans = async () => {
    setIsLoading(true);
    try {
      const plans = await EventPlan.list('-event_date');
      setEventPlans(plans);
    } catch (error) {
      console.error("Failed to load event plans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEventPlans();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Event Plan
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventPlans.map(plan => (
          <EventPlanCard key={plan.id} plan={plan} />
        ))}
      </div>
      {isCreateModalOpen && (
        <CreateEventPlanModal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onPlanCreated={loadEventPlans}
        />
      )}
    </div>
  );
}