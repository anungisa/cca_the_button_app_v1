import React, { useState, useEffect } from 'react';
import { MarketingCampaign } from '@/api/entities';
import { PressRelease } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Loader2, Megaphone, Newspaper } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function AnnouncementCalendar() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchMarketingEvents = async () => {
      setIsLoading(true);
      try {
        const campaigns = await MarketingCampaign.list();
        const releases = await PressRelease.list();

        const campaignEvents = (campaigns || []).map(c => ({
          id: `camp-${c.id}`,
          title: c.campaign_name,
          date: new Date(c.target_date),
          type: 'campaign'
        }));

        const releaseEvents = (releases || []).map(r => ({
          id: `rel-${r.id}`,
          title: r.title,
          date: new Date(r.publish_date),
          type: 'release'
        }));
        
        setEvents([...campaignEvents, ...releaseEvents]);
      } catch (error) {
        console.error("Failed to load marketing events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketingEvents();
  }, []);

  const renderDayContent = (day) => {
    const dayEvents = events.filter(e => format(e.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
    if (dayEvents.length === 0) return null;

    return (
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
        {dayEvents.map(e => (
          <div key={e.id} className={`w-1.5 h-1.5 rounded-full ${e.type === 'campaign' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
        ))}
      </div>
    );
  };
  
  const selectedDayEvents = events.filter(e => format(e.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Marketing Announcement Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border border-brand-border"
                components={{
                  DayContent: ({ date }) => renderDayContent(date)
                }}
              />
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-brand-text-primary">
                Events for {format(date, 'PPP')}
              </h4>
              {selectedDayEvents.length > 0 ? (
                <ul className="space-y-3">
                  {selectedDayEvents.map(event => (
                    <li key={event.id} className="bg-brand-charcoal p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        {event.type === 'campaign' ? 
                          <Megaphone className="w-5 h-5 text-blue-400 flex-shrink-0" /> : 
                          <Newspaper className="w-5 h-5 text-green-400 flex-shrink-0" />
                        }
                        <p className="text-sm text-brand-text-primary truncate">{event.title}</p>
                        <Badge variant="outline" className={`ml-auto capitalize ${event.type === 'campaign' ? 'border-blue-400/50 text-blue-400' : 'border-green-400/50 text-green-400'}`}>
                          {event.type}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-brand-text-secondary">No events scheduled for this day.</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}