import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, Plus, Edit2, Trash2, Clock, Users, MapPin, 
  ChevronLeft, ChevronRight, Video, Phone
} from 'lucide-react';
import { useXP } from '../XPContext';
import { Task } from '@/api/entities';

const CreateEventModal = ({ isOpen, onClose, onSave, selectedDate }) => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    type: 'meeting'
  });

  useEffect(() => {
    if (selectedDate && isOpen) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      setEventData(prev => ({
        ...prev,
        start_time: `${dateStr}T09:00`,
        end_time: `${dateStr}T10:00`
      }));
    }
  }, [selectedDate, isOpen]);

  const handleSave = () => {
    if (!eventData.title || !eventData.start_time) return;
    onSave(eventData);
    onClose();
    setEventData({ title: '', description: '', start_time: '', end_time: '', type: 'meeting' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>New Calendar Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Event Title"
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
          />
          <Textarea
            placeholder="Description (optional)"
            value={eventData.description}
            onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-brand-text-secondary mb-1 block">Start Time</label>
              <Input
                type="datetime-local"
                value={eventData.start_time}
                onChange={(e) => setEventData({ ...eventData, start_time: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-brand-text-secondary mb-1 block">End Time</label>
              <Input
                type="datetime-local"
                value={eventData.end_time}
                onChange={(e) => setEventData({ ...eventData, end_time: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save Event</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CalendarDay = ({ date, isCurrentMonth, isToday, events, onDayClick }) => {
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.due_date || event.start_time);
    return eventDate.toDateString() === date.toDateString();
  });

  return (
    <div
      className={`min-h-24 p-2 border border-brand-border cursor-pointer hover:bg-brand-charcoal/30 ${
        !isCurrentMonth ? 'text-brand-text-secondary bg-brand-charcoal/20' : ''
      } ${isToday ? 'bg-brand-red/10 border-brand-red' : ''}`}
      onClick={() => onDayClick(date)}
    >
      <div className="font-medium text-sm mb-1">{date.getDate()}</div>
      <div className="space-y-1">
        {dayEvents.slice(0, 3).map((event, idx) => (
          <div
            key={idx}
            className={`text-xs p-1 rounded truncate ${
              event.type === 'task' ? 'bg-blue-600/20 text-blue-300' : 'bg-green-600/20 text-green-300'
            }`}
          >
            {event.title}
          </div>
        ))}
        {dayEvents.length > 3 && (
          <div className="text-xs text-brand-text-secondary">+{dayEvents.length - 3} more</div>
        )}
      </div>
    </div>
  );
};

export default function PersonalCalendar() {
  const { user } = useXP();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('month');

  useEffect(() => {
    if (user) {
      loadCalendarData();
    }
  }, [user, currentDate]);

  const loadCalendarData = async () => {
    try {
      // Load tasks as calendar events
      const tasks = await Task.filter({ assigned_to: user.id });
      const taskEvents = tasks
        .filter(task => task.due_date)
        .map(task => ({
          id: task.id,
          title: task.title,
          start_time: task.due_date,
          type: 'task',
          priority: task.priority,
          status: task.status
        }));

      setEvents(taskEvents);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    }
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setIsCreateModalOpen(true);
  };

  const handleCreateEvent = async (eventData) => {
    // In a real implementation, you'd save this to a calendar entity
    console.log('Creating event:', eventData);
    // For now, we'll just add it to local state as a demo
    const newEvent = {
      id: Date.now().toString(),
      ...eventData,
      type: 'meeting'
    };
    setEvents([...events, newEvent]);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false
      });
    }
    
    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true
      });
    }
    
    // Add days from next month to fill the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const days = getDaysInMonth();
  const today = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (!user) {
    return <div className="text-center p-8">Please log in to view your calendar.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-2xl font-bold text-brand-text-primary">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setCurrentDate(new Date())} variant="outline" size="sm">
                Today
              </Button>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b border-brand-border">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center font-medium text-brand-text-secondary border-r border-brand-border last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => (
              <CalendarDay
                key={index}
                date={day.date}
                isCurrentMonth={day.isCurrentMonth}
                isToday={day.date.toDateString() === today.toDateString()}
                events={events}
                onDayClick={handleDayClick}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events & Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events
              .filter(event => new Date(event.start_time || event.due_date) >= today)
              .sort((a, b) => new Date(a.start_time || a.due_date) - new Date(b.start_time || b.due_date))
              .slice(0, 5)
              .map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-brand-charcoal/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      event.type === 'task' 
                        ? event.priority === 'high' ? 'bg-red-500' : event.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        : 'bg-green-500'
                    }`} />
                    <div>
                      <p className="font-medium text-brand-text-primary">{event.title}</p>
                      <p className="text-sm text-brand-text-secondary">
                        {new Date(event.start_time || event.due_date).toLocaleDateString()} 
                        {event.start_time && ` at ${new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant={event.type === 'task' ? 'secondary' : 'default'}>
                    {event.type === 'task' ? 'Task' : 'Event'}
                  </Badge>
                </div>
              ))}
            {events.filter(event => new Date(event.start_time || event.due_date) >= today).length === 0 && (
              <p className="text-brand-text-secondary text-center py-4">No upcoming events or tasks</p>
            )}
          </div>
        </CardContent>
      </Card>

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
}