
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, PlusCircle, AlertTriangle } from 'lucide-react';
import { Event } from '@/api/entities/event'; // Corrected import path for entity file casing
import { Incident } from '@/api/entities/incident'; // Corrected import path for entity file casing
import CreateIncidentModal from '@/components/incident-management/CreateIncidentModal';

const statusColors = {
  new: 'bg-blue-600',
  open: 'bg-green-600',
  in_progress: 'bg-yellow-600 text-yellow-950',
  on_hold: 'bg-gray-500',
  escalated: 'bg-orange-600',
  resolved: 'bg-purple-600',
  closed: 'bg-gray-700',
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function IncidentManagement() {
  const [events, setEvents] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [eventsData, incidentsData] = await Promise.all([
        Event.list('-start_date'),
        Incident.list('-updated_date')
      ]);
      setEvents(eventsData || []);
      setIncidents(incidentsData || []);
    } catch (error) {
      console.error("Failed to load incident data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredIncidents = useMemo(() => {
    if (selectedEventId === 'all') return incidents;
    return incidents.filter(i => i.related_event_id === selectedEventId);
  }, [incidents, selectedEventId]);
  
  const handleCreateIncident = async (incidentData) => {
    try {
        await Incident.create(incidentData);
        setIsModalOpen(false);
        loadData(); // Refresh all data
    } catch(err) {
        console.error("Failed to create incident:", err);
        alert("Could not create incident. Please check the console for details.");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="w-8 h-8 animate-spin text-brand-red" /></div>;
  }

  return (
    <>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Event Incident Management</CardTitle>
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusCircle className="w-4 h-4 mr-2" /> Report Incident
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Filter by Event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {events.map(event => (
                    <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              {filteredIncidents.length > 0 ? filteredIncidents.map(incident => (
                <div key={incident.id} className="p-4 bg-brand-charcoal rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-brand-text-primary">{incident.title}</h4>
                    <p className="text-sm text-brand-text-secondary">
                      Category: {incident.category} | Priority: {incident.priority} | Updated: {formatDate(incident.updated_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <Badge className={`${statusColors[incident.status] || 'bg-gray-500'} text-white capitalize`}>
                      {incident.status.replace('_', ' ')}
                    </Badge>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-brand-text-secondary">
                  <AlertTriangle className="w-10 h-10 mx-auto mb-2" />
                  <p>No incidents found for the selected event.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <CreateIncidentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateIncident}
        />
    </>
  );
}
