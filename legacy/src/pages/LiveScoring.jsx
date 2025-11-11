
import React, { useState, useEffect, useCallback } from 'react';
import { Game } from '@/api/entities';
import { Event } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Radio, Calendar, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GameScoreCard = ({ game }) => {
  const isLive = game.draw?.active || game.status === 'live';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="bg-brand-card-bg border-brand-border hover:border-brand-red/50 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-brand-text-secondary">
                {game.draw?.name || 'Draw'} - Sheet {game.sheet}
              </span>
              {isLive && (
                <Badge className="bg-red-500 text-white animate-pulse">
                  <Radio className="w-3 h-3 mr-1" />
                  LIVE
                </Badge>
              )}
            </div>
            <span className="text-xs text-brand-text-secondary">
              End {game.current_end || 0}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Team 1 */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {game.team1?.has_hammer && (
                  <span className="text-yellow-400" title="Has hammer">🥌</span>
                )}
                <div>
                  <p className="font-semibold text-brand-text-primary">
                    {game.team1?.name || 'Team 1'}
                  </p>
                  {game.team1?.club && (
                    <p className="text-xs text-brand-text-secondary">{game.team1.club}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-brand-text-primary">
                {game.team1?.total_score || 0}
              </p>
              {game.team1?.score && game.team1.score.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {game.team1.score.map((score, i) => (
                    <span key={i} className="text-xs text-brand-text-secondary">
                      {score}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-brand-border" />

          {/* Team 2 */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {game.team2?.has_hammer && (
                  <span className="text-yellow-400" title="Has hammer">🥌</span>
                )}
                <div>
                  <p className="font-semibold text-brand-text-primary">
                    {game.team2?.name || 'Team 2'}
                  </p>
                  {game.team2?.club && (
                    <p className="text-xs text-brand-text-secondary">{game.team2.club}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-brand-text-primary">
                {game.team2?.total_score || 0}
              </p>
              {game.team2?.score && game.team2.score.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {game.team2.score.map((score, i) => (
                    <span key={i} className="text-xs text-brand-text-secondary">
                      {score}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function LiveScoring() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadGames = useCallback(async (eventId, silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    
    try {
      const gameData = await Game.filter({ event_id: eventId });
      setGames(gameData);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []); // Dependencies: empty array as state setters are stable.

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const eventData = await Event.list('-start_date', 50);
      setEvents(eventData);
      // Set selectedEvent only if it's currently null
      if (eventData.length > 0) {
        setSelectedEvent(prevSelectedEvent => {
          if (prevSelectedEvent === null) {
            return eventData[0].id;
          }
          return prevSelectedEvent;
        });
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  }, []); // Dependencies: empty array as state setters are stable.

  useEffect(() => {
    loadEvents();
  }, [loadEvents]); // Dependency: loadEvents (stable due to useCallback with [] deps)

  useEffect(() => {
    if (selectedEvent) {
      loadGames(selectedEvent);
    }
  }, [selectedEvent, loadGames]); // Dependencies: selectedEvent, loadGames

  // Auto-refresh live games every 30 seconds
  useEffect(() => {
    if (selectedEvent) {
      const interval = setInterval(() => {
        loadGames(selectedEvent, true);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [selectedEvent, loadGames]); // Dependencies: selectedEvent, loadGames

  const handleRefresh = () => {
    if (selectedEvent) {
      loadGames(selectedEvent);
    }
  };

  const selectedEventData = events.find(e => e.id === selectedEvent);
  const liveGames = games.filter(g => g.draw?.active || g.status === 'live');
  const upcomingGames = games.filter(g => g.status === 'scheduled');
  const completedGames = games.filter(g => g.status === 'final' || g.status === 'completed');

  if (isLoading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-charcoal">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-brand-text-secondary">Loading scores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center">
              <Radio className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-brand-text-primary">Live Scoring</h1>
              <p className="text-brand-text-secondary">Real-time scores from Curling.io</p>
            </div>
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Event Selector */}
        {events.length > 0 && (
          <Card className="mb-6 bg-brand-card-bg border-brand-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-brand-text-secondary" />
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map(event => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedEventData && (
                <div className="flex items-center gap-2 mt-3 text-sm text-brand-text-secondary">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedEventData.venue?.city || 'Location TBD'}</span>
                  <span className="mx-2">•</span>
                  <span>
                    {new Date(selectedEventData.start_date).toLocaleDateString()} - 
                    {new Date(selectedEventData.end_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Live Games */}
        {liveGames.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-brand-text-primary mb-4 flex items-center gap-2">
              <Radio className="w-6 h-6 text-red-500 animate-pulse" />
              Live Now
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {liveGames.map(game => (
                  <GameScoreCard key={game.id} game={game} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Upcoming Games */}
        {upcomingGames.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-brand-text-primary mb-4">
              Upcoming
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {upcomingGames.map(game => (
                  <GameScoreCard key={game.id} game={game} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Completed Games */}
        {completedGames.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary mb-4">
              Completed
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {completedGames.map(game => (
                  <GameScoreCard key={game.id} game={game} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Empty State */}
        {games.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Radio className="w-16 h-16 text-brand-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-brand-text-primary mb-2">
              No games available
            </h3>
            <p className="text-brand-text-secondary mb-4">
              {selectedEvent 
                ? 'No games scheduled for this event yet.' 
                : 'Select an event to view live scores.'
              }
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
