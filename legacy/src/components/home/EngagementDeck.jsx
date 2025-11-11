import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, Users, Star, ArrowRight } from 'lucide-react';
import { Event } from '@/api/entities';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function EngagementDeck({ user }) {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Guard against null user
      if (!user || !user.id) {
        setIsLoading(false);
        return;
      }

      try {
        const events = await Event.list('-start_date', 3);
        setUpcomingEvents(events || []);
      } catch (error) {
        console.error('Error loading engagement data:', error);
        setUpcomingEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Don't render if no user
  if (!user || !user.id) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="bg-brand-card-bg border-brand-border animate-pulse">
            <CardContent className="p-6">
              <div className="h-24 bg-brand-border rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand-text-primary">What's Happening</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-red" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.length > 0 ? (
              <>
                {upcomingEvents.slice(0, 3).map(event => (
                  <div key={event.id} className="p-3 bg-brand-charcoal rounded-lg">
                    <h4 className="font-semibold text-brand-text-primary text-sm">
                      {event.name}
                    </h4>
                    <p className="text-xs text-brand-text-secondary mt-1">
                      {new Date(event.start_date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                <Button asChild variant="ghost" className="w-full" size="sm">
                  <Link to={createPageUrl('Events')}>
                    View All Events <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </>
            ) : (
              <p className="text-sm text-brand-text-secondary">No upcoming events</p>
            )}
          </CardContent>
        </Card>

        {/* My Activity */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-brand-text-secondary">
              Your recent curling activities will appear here
            </p>
          </CardContent>
        </Card>

        {/* Community Highlights */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-brand-text-secondary">
              Connect with fellow curlers in your area
            </p>
            <Button asChild variant="outline" className="w-full mt-4" size="sm">
              <Link to={createPageUrl('CommunityHub')}>
                Join Community <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}