import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Calendar, Radio, BarChart2, Loader2, RefreshCw } from 'lucide-react';
import { Event } from '@/api/entities';
import { Game } from '@/api/entities';
import { EventStandings } from '@/api/entities';
import { getSeasonInfo } from '../utils/season';

const LiveGameCard = ({ game }) => (
  <Card className="bg-brand-charcoal border-brand-border">
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-medium flex justify-between items-center">
        <span>Sheet {game.sheet}</span>
        <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
      </CardTitle>
      <p className="text-xs text-brand-text-secondary">End {game.current_end}</p>
    </CardHeader>
    <CardContent>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span>{game.team1.name}</span>
          <span className="font-bold">{game.team1.total_score}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>{game.team2.name}</span>
          <span className="font-bold">{game.team2.total_score}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function CompetitionManagementHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [events, setEvents] = useState([]);
  const [liveGames, setLiveGames] = useState([]);
  const [standings, setStandings] = useState([]);
  const [selectedEventForStandings, setSelectedEventForStandings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [eventsData, gamesData, standingsData] = await Promise.all([
        Event.list("-start_date", 50),
        Game.filter({ status: 'live' }),
        EventStandings.list()
      ]);
      setEvents(eventsData);
      setLiveGames(gamesData);
      setStandings(standingsData);
      if (eventsData.length > 0) {
        // Find an event that has standings data to pre-select
        const eventWithStandings = eventsData.find(e => standingsData.some(s => s.event_id === e.id));
        setSelectedEventForStandings(eventWithStandings?.id || eventsData[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch competition data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const overviewStats = useMemo(() => ({
    totalEvents: events.length,
    liveEvents: events.filter(e => e.status === 'in_progress').length,
    upcomingEvents: events.filter(e => new Date(e.start_date) > new Date()).length,
    liveGamesCount: liveGames.length
  }), [events, liveGames]);

  const filteredStandings = useMemo(() => {
    return standings.filter(s => s.event_id === selectedEventForStandings).sort((a,b) => a.rank - b.rank);
  }, [standings, selectedEventForStandings]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
        <p className="ml-4 text-brand-text-secondary">Loading Competition Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-brand-red" />
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">Competition Management</h2>
            <p className="text-brand-text-secondary">Oversee all competitive events, from local to national.</p>
          </div>
        </div>
        <Button onClick={fetchData} variant="outline" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Event Management</TabsTrigger>
          <TabsTrigger value="live">Live Monitoring</TabsTrigger>
          <TabsTrigger value="standings">Standings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-brand-card-bg border-brand-border"><CardHeader><CardTitle>Total Events</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{overviewStats.totalEvents}</p></CardContent></Card>
            <Card className="bg-brand-card-bg border-brand-border"><CardHeader><CardTitle>Live Events</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{overviewStats.liveEvents}</p></CardContent></Card>
            <Card className="bg-brand-card-bg border-brand-border"><CardHeader><CardTitle>Upcoming Events</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{overviewStats.upcomingEvents}</p></CardContent></Card>
            <Card className="bg-brand-card-bg border-brand-border"><CardHeader><CardTitle>Games In Progress</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{overviewStats.liveGamesCount}</p></CardContent></Card>
          </div>
        </TabsContent>
        
        <TabsContent value="events" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader><CardTitle>All Competitions ({getSeasonInfo().currentSeason})</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Event Name</TableHead><TableHead>Dates</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {events.map(event => (
                    <TableRow key={event.id}>
                      <TableCell>{event.name}</TableCell>
                      <TableCell>{new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</TableCell>
                      <TableCell>{event.venue.city}</TableCell>
                      <TableCell><Badge variant={event.status === 'completed' ? 'secondary' : 'default'}>{event.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="live" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader><CardTitle>Live Game Monitoring</CardTitle></CardHeader>
            <CardContent>
              {liveGames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveGames.map(game => <LiveGameCard key={game.id} game={game} />)}
                </div>
              ) : (
                <p className="text-brand-text-secondary">No games currently in progress.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standings" className="mt-6">
           <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Event Standings</CardTitle>
                <Select value={selectedEventForStandings} onValueChange={setSelectedEventForStandings}>
                  <SelectTrigger className="w-[300px]"><SelectValue placeholder="Select an event" /></SelectTrigger>
                  <SelectContent>
                    {events.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
               {filteredStandings.length > 0 ? (
                  <Table>
                    <TableHeader><TableRow><TableHead>Rank</TableHead><TableHead>Team</TableHead><TableHead>Wins</TableHead><TableHead>Losses</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {filteredStandings.map(s => (
                        <TableRow key={s.id}>
                          <TableCell>{s.rank}</TableCell>
                          <TableCell>{s.team_name}</TableCell>
                          <TableCell>{s.wins}</TableCell>
                          <TableCell>{s.losses}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
               ) : (
                  <p className="text-brand-text-secondary text-center py-8">No standings available for this event.</p>
               )}
            </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}