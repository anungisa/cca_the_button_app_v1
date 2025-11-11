import React, { useState, useEffect } from 'react';
import { usePermissions } from '../components/hooks/usePermissions';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Loader2, Calendar, Users, ListChecks, FileText, Globe } from 'lucide-react';

import EventPlanningDashboard from '../components/staffhq/eventops/EventPlanningDashboard';
import VolunteerCommandCenter from '../components/staffhq/eventops/VolunteerCommandCenter';
import ComplianceTracker from '../components/staffhq/eventops/ComplianceTracker';
import IncidentManagement from '../components/staffhq/eventops/IncidentManagement';
import EventTemplateManager from '../components/staffhq/eventops/EventTemplateManager';
import { Event } from '@/api/entities';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export default function EventOpsToolkit() {
  const { permissions, isLoading: permissionsLoading } = usePermissions();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await Event.list('-start_date');
        setEvents(eventsData || []);
        if (eventsData && eventsData.length > 0) {
          setSelectedEvent(eventsData[0]);
        }
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);
  
  const handleSelectEvent = (eventId) => {
    const event = events.find(e => e.id === eventId);
    setSelectedEvent(event);
  };


  if (permissionsLoading || isLoading) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  if (!permissions.canAccessStaffHQ) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-4">
        <Card className="max-w-md bg-brand-card-bg border-brand-border text-center">
          <CardContent className="p-8">
            <Shield className="w-12 h-12 text-brand-red mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brand-text-primary mb-2">Access Restricted</h2>
            <p className="text-brand-text-secondary">You do not have permission to view the Event Operations Toolkit.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-brand-charcoal text-brand-text-primary p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">Event Operations Toolkit</h1>
            <p className="text-brand-text-secondary mt-1">Your central hub for planning and executing world-class curling events.</p>
          </div>
           {events.length > 0 && selectedEvent && (
              <Select value={selectedEvent.id} onValueChange={handleSelectEvent}>
                <SelectTrigger className="w-full sm:w-[300px]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <SelectValue placeholder="Select Event" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
           )}
        </header>

        {!selectedEvent ? (
          <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto text-brand-text-secondary mb-4" />
                  <h3 className="text-xl font-semibold">No Events Found</h3>
                  <p className="text-brand-text-secondary mt-2">There are no events to manage. Create an event plan to get started.</p>
              </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="planning" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-brand-card-bg border-brand-border mb-6">
              <TabsTrigger value="planning"><FileText className="w-4 h-4 mr-2" />Event Planning</TabsTrigger>
              <TabsTrigger value="volunteers"><Users className="w-4 h-4 mr-2" />Volunteers</TabsTrigger>
              <TabsTrigger value="compliance"><ListChecks className="w-4 h-4 mr-2" />Compliance</TabsTrigger>
              <TabsTrigger value="incidents"><Shield className="w-4 h-4 mr-2" />Incidents</TabsTrigger>
              <TabsTrigger value="templates"><FileText className="w-4 h-4 mr-2" />Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="planning">
              <EventPlanningDashboard />
            </TabsContent>
            <TabsContent value="templates">
              <EventTemplateManager />
            </TabsContent>
            <TabsContent value="volunteers">
              <VolunteerCommandCenter event={selectedEvent} />
            </TabsContent>
            <TabsContent value="compliance">
              <ComplianceTracker event={selectedEvent} />
            </TabsContent>
            <TabsContent value="incidents">
               <IncidentManagement />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}