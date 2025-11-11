import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Filter, AlertTriangle } from 'lucide-react';
import { Incident } from '@/api/entities';
import { Event } from '@/api/entities';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LegalCaseManagement({ selectedRegion }) {
  const [incidents, setIncidents] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [incidentsData, eventsData] = await Promise.all([
          Incident.filter({ category: 'safe_sport' }), // Assuming legal cases are a subset of incidents
          Event.list(),
        ]);
        setIncidents(incidentsData || []);
        setEvents(eventsData || []);
      } catch (error) {
        console.error("Error loading legal case data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let tempIncidents = [...incidents];
    if (selectedRegion !== 'all') {
      tempIncidents = tempIncidents.filter(i => i.ma_region === selectedRegion);
    }
    if (statusFilter !== 'all') {
      tempIncidents = tempIncidents.filter(i => i.status === statusFilter);
    }
    if (priorityFilter !== 'all') {
      tempIncidents = tempIncidents.filter(i => i.priority === priorityFilter);
    }
    setFilteredIncidents(tempIncidents);
  }, [selectedRegion, statusFilter, priorityFilter, incidents]);
  
  const getEventName = (eventId) => {
    if (!eventId) return 'N/A';
    const event = events.find(e => e.id === eventId);
    return event ? event.name : 'Unknown Event';
  };
  
  const statusColors = {
    new: 'bg-blue-500',
    open: 'bg-yellow-500',
    in_progress: 'bg-blue-500',
    resolved: 'bg-green-500',
    closed: 'bg-gray-500',
    escalated: 'bg-orange-500'
  };

  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500'
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Legal Cases</CardTitle>
        <Button><Plus className="w-4 h-4 mr-2" />New Case</Button>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
            <Filter className="w-5 h-5 text-brand-text-secondary mt-2" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {['new', 'open', 'in_progress', 'resolved', 'closed', 'escalated'].map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace('_',' ')}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    {['low', 'medium', 'high', 'critical'].map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>

        <div className="space-y-4">
          {filteredIncidents.length > 0 ? filteredIncidents.map(incident => (
            <div key={incident.id} className="p-4 bg-brand-charcoal rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-brand-text-primary">{incident.title}</h4>
                <p className="text-sm text-brand-text-secondary">
                  Related Event: {getEventName(incident.related_event_id)} | Assigned: {incident.assigned_to_name || 'Unassigned'}
                </p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Badge className={`${statusColors[incident.status] || 'bg-gray-500'} text-white capitalize`}>
                  {incident.status.replace('_', ' ')}
                </Badge>
                <Badge className={`${priorityColors[incident.priority] || 'bg-gray-500'} text-white capitalize`}>
                  {incident.priority}
                </Badge>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-brand-text-secondary">
              <AlertTriangle className="w-10 h-10 mx-auto mb-2" />
              <p>No legal cases found for the selected filters.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}