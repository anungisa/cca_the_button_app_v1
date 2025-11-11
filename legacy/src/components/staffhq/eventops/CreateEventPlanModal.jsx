import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Event } from '@/api/entities';
import { EventPlanTemplate } from '@/api/entities';
import { EventPlan } from '@/api/entities';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/hooks/use-toast';

export default function CreateEventPlanModal({ isOpen, onClose, onPlanCreated }) {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [events, setEvents] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, templatesData] = await Promise.all([
          Event.list(),
          EventPlanTemplate.list()
        ]);
        setEvents(eventsData.filter(e => e.status !== 'completed')); // Only show upcoming/active events
        setTemplates(templatesData);
      } catch (error) {
        console.error("Failed to load data for modal:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreate = async () => {
    if (!selectedEvent || !selectedTemplate) {
        toast({ title: "Validation Error", description: "Please select an event and a template.", variant: "destructive" });
        return;
    }
    setIsCreating(true);
    try {
        const event = events.find(e => e.id === selectedEvent);
        const template = templates.find(t => t.id === selectedTemplate);

        // A real implementation would have a backend process to deep-copy and instantiate the plan
        // Here we simulate it
        const newPlan = {
            event_id: event.id,
            event_name: event.name,
            event_date: event.start_date,
            venue: event.venue.city,
            event_type: template.event_type,
            status: 'planning',
            template_id: template.id,
            created_by: 'Current User', // Replace with actual user
            departments: template.departments,
            completion_stats: { total_tasks: template.departments.reduce((acc, d) => acc + d.tasks.length, 0), completed_tasks: 0 },
            budget_info: { total_budget: 100000 } // Dummy data
        };

      await EventPlan.create(newPlan);
      toast({ title: "Success", description: `Plan for ${event.name} created.` });
      onPlanCreated();
      onClose();
    } catch (error) {
      toast({ title: "Error", description: "Failed to create event plan.", variant: "destructive" });
      console.error("Create plan error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-brand-card-bg border-brand-border">
        <DialogHeader>
          <DialogTitle>Create New Event Plan</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : (
          <div className="space-y-4 py-4">
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger><SelectValue placeholder="Select an Event" /></SelectTrigger>
              <SelectContent>{events.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger><SelectValue placeholder="Select a Template" /></SelectTrigger>
              <SelectContent>{templates.map(t => <SelectItem key={t.id} value={t.id}>{t.template_name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={isLoading || isCreating}>
            {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}