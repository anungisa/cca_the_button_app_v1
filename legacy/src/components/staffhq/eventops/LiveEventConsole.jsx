
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Game } from '@/api/entities';
import { Event } from '@/api/entities';
import {
  Radio,
  Play,
  Pause,
  Clock,
  Users,
  Video,
  AlertTriangle,
  MessageSquare,
  BarChart3,
  RefreshCw,
  Trophy
} from 'lucide-react';

export default function LiveEventConsole() {
  const [liveEvents, setLiveEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [activeGames, setActiveGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const liveEventData = [
    { id: 'evt_002', name: '2024 Scotties Tournament of Hearts' },
    { id: 'evt_004', name: '2024 U-21 National Championship' }
  ];

  const gamesData = {
    'evt_002': [
      { id: 'g_01', sheet: 'A', team1: { name: 'Einarson', score: 5 }, team2: { name: 'Homan', score: 3 }, end: 7, status: 'active' },
      { id: 'g_02', sheet: 'B', team1: { name: 'Jones', score: 2 }, team2: { name: 'Lawes', score: 6 }, end: 8, status: 'active' },
      { id: 'g_03', sheet: 'C', team1: { name: 'Galusha', score: 4 }, team2: { name: 'Scheidegger', score: 4 }, end: 6, status: 'paused' },
    ],
    'evt_004': [
      { id: 'g_04', sheet: 'A', team1: { name: 'Team AB', score: 1 }, team2: { name: 'Team ON', score: 3 }, end: 4, status: 'active' },
      { id: 'g_05', sheet: 'B', team1: { name: 'Team SK', score: 5 }, team2: { name: 'Team MB', score: 2 }, end: 5, status: 'active' },
    ]
  };

  useEffect(() => {
    // Simulating API calls
    setLiveEvents(liveEventData);
    if (liveEventData.length > 0) {
      const initialEventId = liveEventData[0].id;
      setSelectedEventId(initialEventId);
      setActiveGames(gamesData[initialEventId] || []);
    }
    setIsLoading(false);

    const interval = setInterval(() => {
        setLastUpdated(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEventChange = (eventId) => {
    setSelectedEventId(eventId);
    setActiveGames(gamesData[eventId] || []);
  };
  
  const StatusBadge = ({ status }) => {
    const config = {
      active: { color: 'bg-green-600', icon: <Play className="w-3 h-3" /> },
      paused: { color: 'bg-yellow-600', icon: <Pause className="w-3 h-3" /> },
      completed: { color: 'bg-gray-600', icon: <Trophy className="w-3 h-3" /> }
    };
    const { color, icon } = config[status] || { color: 'bg-gray-500' };
    return <Badge className={`${color} text-white flex items-center gap-1`}>{icon}{status}</Badge>;
  }

  if (isLoading) return <div>Loading live events...</div>;

  return (
    <div className="space-y-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <Radio className="w-6 h-6 text-red-500 animate-pulse" />
                    Live Event Console
                </CardTitle>
                <p className="text-brand-text-secondary text-sm mt-1">Last updated: {lastUpdated.toLocaleTimeString()}</p>
            </div>
            <div className="flex items-center gap-4">
                <Select value={selectedEventId} onValueChange={handleEventChange}>
                    <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select a live event..." />
                    </SelectTrigger>
                    <SelectContent>
                    {liveEvents.map(event => (
                        <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" />Refresh Data</Button>
            </div>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                  <p className="text-sm text-brand-text-secondary">Active Games</p>
                  <p className="text-3xl font-bold text-green-400">{activeGames.length}</p>
              </CardContent>
          </Card>
          <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                  <p className="text-sm text-brand-text-secondary">Volunteers On-Site</p>
                  <p className="text-3xl font-bold text-blue-400">142</p>
              </CardContent>
          </Card>
           <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                  <p className="text-sm text-brand-text-secondary">System Alerts</p>
                  <p className="text-3xl font-bold text-orange-400">1</p>
              </CardContent>
          </Card>
           <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                  <p className="text-sm text-brand-text-secondary">Broadcast Status</p>
                  <p className="text-3xl font-bold text-red-500">ON AIR</p>
              </CardContent>
          </Card>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
            <CardTitle>Live Game Status</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Sheet</TableHead>
                    <TableHead>Matchup</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Current End</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {activeGames.map(game => (
                    <TableRow key={game.id}>
                        <TableCell className="font-bold text-lg">{game.sheet}</TableCell>
                        <TableCell>
                            <div className="font-medium text-brand-text-primary">{game.team1.name} vs {game.team2.name}</div>
                        </TableCell>
                        <TableCell>{game.team1.score} - {game.team2.score}</TableCell>
                        <TableCell>{game.end}</TableCell>
                        <TableCell><StatusBadge status={game.status} /></TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline">Score Input</Button>
                                <Button size="sm" variant="outline">Game Log</Button>
                                <Button size="sm" variant="destructive">Alert</Button>
                            </div>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
      
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <Card className="bg-brand-card-bg border-brand-border">
               <CardHeader><CardTitle>Key Operations</CardTitle></CardHeader>
               <CardContent className="grid grid-cols-2 gap-4">
                   <Button variant="outline" className="h-16"><Users className="w-5 h-5 mr-2" />Volunteer Check-in</Button>
                   <Button variant="outline" className="h-16"><Video className="w-5 h-5 mr-2" />Broadcast Control</Button>
                   <Button variant="outline" className="h-16"><MessageSquare className="w-5 h-5 mr-2" />Media Comms</Button>
                   <Button variant="outline" className="h-16"><AlertTriangle className="w-5 h-5 mr-2" />Incident Report</Button>
               </CardContent>
           </Card>
            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader><CardTitle>Live Communications</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="p-3 bg-brand-charcoal rounded-lg">
                            <p className="text-sm font-medium text-blue-400">[Broadcast] Cue talent for end-of-game interviews on Sheet B.</p>
                            <p className="text-xs text-brand-text-secondary">From: Production Director - 2 mins ago</p>
                        </div>
                        <div className="p-3 bg-brand-charcoal rounded-lg">
                            <p className="text-sm font-medium text-orange-400">[Venue] Medical attention required at Section 104.</p>
                             <p className="text-xs text-brand-text-secondary">From: Security Lead - 5 mins ago</p>
                        </div>
                    </div>
                </CardContent>
           </Card>
       </div>

    </div>
  );
}
