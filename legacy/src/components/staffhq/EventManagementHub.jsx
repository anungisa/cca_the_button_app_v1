
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Event } from '@/api/entities';
import { PlusCircle, Edit, Calendar, MapPin, Users, TrendingUp, Download, Link as LinkIcon, MoreHorizontal, Wrench, ClipboardCheck } from 'lucide-react';
import { InvokeLLM } from '@/api/integrations';
import { format } from 'date-fns';

const CreateEventModal = ({ onEventCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    website: '',
    venue: { name: '', city: '' },
    registration_fee: '',
    is_patch_party: false,
    venue_theme: 'general'
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const eventData = {
        ...formData,
        registration_fee: formData.registration_fee ? parseFloat(formData.registration_fee) : 0
      };
      await Event.create(eventData);
      onEventCreated();
      setIsOpen(false);
      setFormData({
        name: '', start_date: '', end_date: '', website: '',
        venue: { name: '', city: '' }, registration_fee: '', is_patch_party: false, venue_theme: 'general'
      });
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="w-4 h-4 mr-2" />Create Event</Button>
      </DialogTrigger>
      <DialogContent className="bg-brand-card-bg border-brand-border max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Event Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Venue Name"
              value={formData.venue.name}
              onChange={(e) => setFormData({...formData, venue: {...formData.venue, name: e.target.value}})}
            />
            <Input
              placeholder="City"
              value={formData.venue.city}
              onChange={(e) => setFormData({...formData, venue: {...formData.venue, city: e.target.value}})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Registration Fee ($)"
              type="number"
              step="0.01"
              value={formData.registration_fee}
              onChange={(e) => setFormData({...formData, registration_fee: e.target.value})}
            />
            <Select value={formData.venue_theme} onValueChange={(val) => setFormData({...formData, venue_theme: val})}>
              <SelectTrigger>
                <SelectValue placeholder="Event Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="brier">Brier</SelectItem>
                <SelectItem value="scotties">Scotties</SelectItem>
                <SelectItem value="worlds">Worlds</SelectItem>
                <SelectItem value="local">Local</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Input
            placeholder="Website URL"
            value={formData.website}
            onChange={(e) => setFormData({...formData, website: e.target.value})}
          />
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="patch-party"
              checked={formData.is_patch_party}
              onChange={(e) => setFormData({...formData, is_patch_party: e.target.checked})}
            />
            <label htmlFor="patch-party" className="text-sm">This is a patch party event (bonus XP for scanning)</label>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Event'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ImportEventModal = ({ onEventCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState('curling_io');
  const [eventId, setEventId] = useState('');
  const [error, setError] = useState('');

  const handleImport = async () => {
    if (!eventId) {
      setError('Please enter an Event ID.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const prompt = `Based on the provided event details, generate a JSON object representing a curling event. The source is ${source} and the ID is ${eventId}. The JSON object should conform to this schema:
      {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "start_date": { "type": "string", "format": "date" },
          "end_date": { "type": "string", "format": "date" },
          "venue": { "type": "object", "properties": { "name": { "type": "string" }, "city": { "type": "string" } } }
        }
      }`;
      
      const eventData = await InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            start_date: { type: "string", format: "date" },
            end_date: { type: "string", format: "date" },
            venue: {
              type: "object",
              properties: { name: { type: "string" }, city: { type: "string" } }
            }
          }
        }
      });
      
      const newEvent = {
        ...eventData,
        [`${source}_id`]: eventId,
        sync_status: {
          source: source,
          last_synced: new Date().toISOString()
        }
      };

      await Event.create(newEvent);
      onEventCreated();
      setIsOpen(false);
      setEventId('');
    } catch (err) {
      console.error("Failed to import event:", err);
      setError("Could not import event. Please check the ID and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><LinkIcon className="w-4 h-4 mr-2" />Import Event</Button>
      </DialogTrigger>
      <DialogContent className="bg-brand-card-bg border-brand-border">
        <DialogHeader>
          <DialogTitle>Import Event from External Source</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger>
              <SelectValue placeholder="Select Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="curling_io">Curling I/O</SelectItem>
              <SelectItem value="curling_reg">CurlingReg</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Enter Event ID from source"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button onClick={handleImport} className="w-full" disabled={isLoading}>
            {isLoading ? 'Importing...' : 'Import Event'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EventActionsDropdown = ({ event }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm">
        <MoreHorizontal className="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem asChild>
        <Link to={createPageUrl(`EventPlanDetail?eventId=${event.id}`)}>
          <Wrench className="w-4 h-4 mr-2" />
          Event Planning
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to={createPageUrl(`EventOpsToolkit?eventId=${event.id}`)}>
          <Users className="w-4 h-4 mr-2" />
          Volunteer Coordination
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to={createPageUrl(`EventOpsToolkit?tab=compliance&eventId=${event.id}`)}>
          <ClipboardCheck className="w-4 h-4 mr-2" />
          Compliance Tracking
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Edit className="w-4 h-4 mr-2" />
        Edit Event
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const EventsTable = ({ events, onRefresh }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Event Name</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Venue</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Operations</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {events.map(event => (
        <TableRow key={event.id}>
          <TableCell className="font-medium">
            <div className="flex items-center gap-2">
              {event.sync_status?.source === 'curling_io' && (
                <div title="Synced from Curling I/O">
                  <LinkIcon className="w-4 h-4 text-blue-400" />
                </div>
              )}
              {event.sync_status?.source === 'curling_reg' && (
                <div title="Synced from CurlingReg">
                  <LinkIcon className="w-4 h-4 text-green-400" />
                </div>
              )}
              <span>{event.name}</span>
              {event.is_patch_party && <Badge className="ml-2 bg-purple-600">Patch Party</Badge>}
            </div>
          </TableCell>
          <TableCell>
            {format(new Date(event.start_date), 'MMM d, yyyy')}
          </TableCell>
          <TableCell>
            <div>
              <p className="font-medium">{event.venue?.name || 'TBD'}</p>
              <p className="text-sm text-brand-text-secondary">{event.venue?.city || ''}</p>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant={event.completed ? "secondary" : "default"}>
              {event.completed ? 'Completed' : 'Upcoming'}
            </Badge>
          </TableCell>
          <TableCell>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={createPageUrl(`EventPlanDetail?eventId=${event.id}`)}>
                  <Wrench className="w-4 h-4 mr-1" />
                  Plan
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to={createPageUrl(`EventOpsToolkit?eventId=${event.id}`)}>
                  <Users className="w-4 h-4 mr-1" />
                  Ops
                </Link>
              </Button>
            </div>
          </TableCell>
          <TableCell className="text-right">
            <EventActionsDropdown event={event} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default function EventManagementHub() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, activeEvents: 0, upcomingEvents: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const eventsData = await Event.list('-start_date');
      setEvents(eventsData || []);
      
      const now = new Date();
      const activeEvents = eventsData?.filter(e => !e.completed) || [];
      const upcomingEvents = eventsData?.filter(e => new Date(e.start_date) > now) || [];
      
      setStats({
        totalEvents: eventsData?.length || 0,
        activeEvents: activeEvents.length,
        upcomingEvents: upcomingEvents.length
      });
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Event Management</h1>
          <p className="text-brand-text-secondary">Create and manage curling events</p>
        </div>
        <div className="flex gap-2">
          <ImportEventModal onEventCreated={fetchEvents} />
          <CreateEventModal onEventCreated={fetchEvents} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Total Events</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.totalEvents}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Active Events</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.activeEvents}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Upcoming Events</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.upcomingEvents}</p>
              </div>
              <Users className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent>
          <EventsTable events={events} onRefresh={fetchEvents} />
        </CardContent>
      </Card>
    </div>
  );
}
