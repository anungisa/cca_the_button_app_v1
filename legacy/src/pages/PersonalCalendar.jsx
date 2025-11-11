import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns';

const mockEvents = [
  { id: 1, title: 'Club Championship - Round 1', date: '2024-07-15T19:00:00', type: 'competition', location: 'Calgary Curling Club' },
  { id: 2, title: 'Volunteer Shift: Scorekeeping', date: '2024-07-18T18:00:00', type: 'volunteer', location: 'Event Centre' },
  { id: 3, title: 'Learn to Curl Clinic', date: '2024-07-20T10:00:00', type: 'clinic', location: 'Calgary Curling Club' },
  { id: 4, title: 'Team Practice', date: '2024-07-22T20:00:00', type: 'practice', location: 'The Glencoe Club' },
  { id: 5, title: 'Club Championship - Finals', date: '2024-07-29T19:00:00', type: 'competition', location: 'Calgary Curling Club' },
];

const CalendarHeader = ({ currentMonth, onPreviousMonth, onNextMonth }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-bold text-brand-text-primary">{format(currentMonth, 'MMMM yyyy')}</h2>
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={onPreviousMonth}>
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onNextMonth}>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

const CalendarGrid = ({ currentMonth, events }) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const eventsByDate = events.reduce((acc, event) => {
    const date = format(parseISO(event.date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-7 gap-px border border-brand-border bg-brand-border rounded-lg overflow-hidden">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="text-center font-medium text-brand-text-secondary text-sm py-2 bg-brand-card-bg">{day}</div>
      ))}
      {days.map(day => {
        const dayKey = format(day, 'yyyy-MM-dd');
        const dayEvents = eventsByDate[dayKey] || [];
        return (
          <div 
            key={day.toString()}
            className={`p-2 min-h-[120px] bg-brand-card-bg ${!isSameMonth(day, monthStart) ? 'opacity-50' : ''}`}
          >
            <time dateTime={format(day, 'yyyy-MM-dd')} className={`font-semibold ${isToday(day) ? 'bg-brand-red text-white rounded-full w-6 h-6 flex items-center justify-center' : 'text-brand-text-primary'}`}>
              {format(day, 'd')}
            </time>
            <div className="mt-1 space-y-1">
              {dayEvents.map(event => (
                <div key={event.id} className="text-xs p-1 bg-brand-charcoal rounded-md truncate">
                  <Badge variant={event.type === 'competition' ? 'destructive' : 'secondary'} className="mr-1 capitalize text-xs">{event.type}</Badge>
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};


export default function PersonalCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    // In a real app, you would fetch events for the current user
    setEvents(mockEvents);
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <CalendarIcon className="w-8 h-8 text-brand-red" />
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Personal Calendar</h1>
          <p className="text-brand-text-secondary">Your upcoming events, practices, and volunteer shifts.</p>
        </div>
      </div>
      
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4 md:p-6">
          <CalendarHeader 
            currentMonth={currentMonth}
            onPreviousMonth={previousMonth}
            onNextMonth={nextMonth}
          />
          <CalendarGrid currentMonth={currentMonth} events={events} />
        </CardContent>
      </Card>
    </div>
  );
}