import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function UpcomingMatches({ events = [], onSelect }) {
  if (!events || events.length === 0) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-red" />
            Upcoming Streams
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-brand-text-secondary py-8">
          No upcoming streams scheduled. Check back soon!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-red" />
          Upcoming Streams
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {events.map((event, index) => (
            <li key={event.id || index} className="flex items-center justify-between p-3 bg-brand-charcoal rounded-md">
              <div>
                <p className="font-semibold text-brand-text-primary">{event.name}</p>
                <p className="text-sm text-brand-text-secondary">
                  {format(parseISO(event.start_time), 'MMM d, h:mm a')}
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => onSelect(event)} className="text-brand-text-secondary hover:text-brand-red">
                Details <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}