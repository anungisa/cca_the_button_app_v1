import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Event } from '@/api/entities';
import { Game } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, MapPin, Globe, Ticket, Users, Play, 
  ArrowLeft, ExternalLink, Trophy, BarChart3, Heart,
  Share2, Loader2
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { LoadingSpinner } from '../components/ui/ImprovedLoadingStates';
import { ErrorDisplay } from '../components/ui/ImprovedErrorStates';

export default function EventDetails() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('id');
  
  const [event, setEvent] = useState(null);
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEventDetails = async () => {
      if (!eventId) {
        setError(new Error('No event ID provided'));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Load event details
        const events = await Event.filter({ id: eventId });
        if (events.length === 0) {
          setError(new Error('Event not found'));
          setIsLoading(false);
          return;
        }
        
        setEvent(events[0]);

        // Load games for this event
        try {
          const eventGames = await Game.filter({ event_id: eventId }, '-created_date', 50);
          setGames(eventGames);
        } catch (gamesError) {
          console.warn('Failed to load games:', gamesError);
          setGames([]);
        }

      } catch (err) {
        console.error('Error loading event details:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEventDetails();
  }, [eventId]);

  if (isLoading) {
    return <LoadingSpinner size="lg" message="Loading event details..." />;
  }

  if (error) {
    return (
      <ErrorDisplay 
        error={error}
        title="Failed to load event"
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-text-secondary mb-4">Event not found</p>
        <Button asChild>
          <Link to={createPageUrl('Events')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </Button>
      </div>
    );
  }

  const isLive = event.status === 'live';
  const isUpcoming = new Date(event.start_date) > new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" asChild>
          <Link to={createPageUrl('Events')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      {event.promo_image && (
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
          <img 
            src={event.promo_image} 
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal to-transparent" />
          <div className="absolute bottom-6 left-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.name}</h1>
            {isLive && (
              <Badge className="bg-red-600 text-white">
                <Play className="w-3 h-3 mr-1" />
                LIVE NOW
              </Badge>
            )}
          </div>
        </div>
      )}

      {!event.promo_image && (
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-2">{event.name}</h1>
          {isLive && (
            <Badge className="bg-red-600 text-white">
              <Play className="w-3 h-3 mr-1" />
              LIVE NOW
            </Badge>
          )}
        </div>
      )}

      {/* Event Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-brand-red mt-0.5" />
                <div>
                  <p className="font-medium text-brand-text-primary">Date</p>
                  <p className="text-brand-text-secondary">
                    {new Date(event.start_date).toLocaleDateString('en-CA', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    {event.end_date && event.start_date !== event.end_date && (
                      <span> - {new Date(event.end_date).toLocaleDateString('en-CA', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    )}
                  </p>
                </div>
              </div>

              {event.venue && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-red mt-0.5" />
                  <div>
                    <p className="font-medium text-brand-text-primary">Location</p>
                    <p className="text-brand-text-secondary">
                      {event.venue.name}
                      <br />
                      {event.venue.city}
                    </p>
                  </div>
                </div>
              )}

              {event.website && (
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-brand-red mt-0.5" />
                  <div>
                    <p className="font-medium text-brand-text-primary">Website</p>
                    <a 
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-red hover:underline flex items-center gap-1"
                    >
                      Event Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {event.description && (
                <div>
                  <p className="font-medium text-brand-text-primary mb-2">About</p>
                  <p className="text-brand-text-secondary">{event.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Games/Scores Tab */}
          {games.length > 0 && (
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Scores & Standings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {games.map(game => (
                    <div 
                      key={game.id}
                      className="flex items-center justify-between p-4 bg-brand-charcoal/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-brand-text-primary">
                          {game.team1?.name || 'Team 1'} vs {game.team2?.name || 'Team 2'}
                        </p>
                        <p className="text-sm text-brand-text-secondary">
                          {game.draw?.name || 'Draw'} - Sheet {game.sheet}
                        </p>
                      </div>
                      <div className="text-right">
                        {game.status === 'final' ? (
                          <div className="font-bold text-brand-text-primary">
                            {game.team1?.total_score || 0} - {game.team2?.total_score || 0}
                          </div>
                        ) : (
                          <Badge>{game.status}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions Card */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="pt-6 space-y-3">
              {isLive && event.livestream_url && (
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => window.open(event.livestream_url, '_blank')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Live
                </Button>
              )}

              {isUpcoming && event.registration_url && (
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.open(event.registration_url, '_blank')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Register Now
                </Button>
              )}

              {isUpcoming && event.ticket_url && (
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => window.open(event.ticket_url, '_blank')}
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  Get Tickets
                </Button>
              )}

              {event.volunteer_url && (
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(event.volunteer_url, '_blank')}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Volunteer
                </Button>
              )}

              <Button variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share Event
              </Button>
            </CardContent>
          </Card>

          {/* Sponsors */}
          {event.sponsors && event.sponsors.length > 0 && (
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Presented by</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {event.sponsors.map((sponsor, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-brand-charcoal/50 rounded text-center text-brand-text-primary"
                    >
                      {sponsor}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}