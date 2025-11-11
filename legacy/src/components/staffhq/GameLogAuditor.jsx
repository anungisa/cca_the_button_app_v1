import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Search,
  Filter,
  Download,
  Eye,
  Users,
  TrendingUp
} from 'lucide-react';
import { ShotTrackerLog, UnifiedGameLog, Event } from '@/api/entities';

export default function GameLogAuditor() {
  const [gameLogs, setGameLogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGames: 0,
    pendingReview: 0,
    conflicts: 0,
    validated: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load recent events
      const eventData = await Event.list('-start_date', 20);
      setEvents(eventData);

      // Load game logs with conflicts
      const gameLogData = await UnifiedGameLog.list('-created_date', 50);
      setGameLogs(gameLogData);

      // Calculate stats
      const stats = {
        totalGames: gameLogData.length,
        pendingReview: gameLogData.filter(g => g.status === 'pending_merge').length,
        conflicts: gameLogData.filter(g => g.status === 'flagged_for_review').length,
        validated: gameLogData.filter(g => g.status === 'validated').length
      };
      setStats(stats);

    } catch (error) {
      console.error('Error loading game log data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = gameLogs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.game_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.event_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesEvent = !selectedEvent || log.event_id === selectedEvent;
    
    return matchesSearch && matchesStatus && matchesEvent;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'validated': return 'bg-green-600 text-white';
      case 'flagged_for_review': return 'bg-red-600 text-white';
      case 'pending_merge': return 'bg-yellow-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'validated': return <CheckCircle className="w-4 h-4" />;
      case 'flagged_for_review': return <AlertTriangle className="w-4 h-4" />;
      case 'pending_merge': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-brand-card-bg rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 bg-brand-card-bg rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Game Log Auditor</h2>
          <p className="text-brand-text-secondary">Monitor and validate shot tracking data quality</p>
        </div>
        <Button className="bg-brand-red hover:bg-red-700">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Total Games</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.totalGames}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pendingReview}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Conflicts</p>
                <p className="text-2xl font-bold text-red-400">{stats.conflicts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Validated</p>
                <p className="text-2xl font-bold text-green-400">{stats.validated}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
                <Input
                  placeholder="Search games or events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-brand-charcoal border-brand-border text-brand-text-primary"
                />
              </div>
            </div>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-full md:w-48 bg-brand-charcoal border-brand-border text-brand-text-primary">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Events</SelectItem>
                {events.map(event => (
                  <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-brand-charcoal border-brand-border text-brand-text-primary">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending_merge">Pending Review</SelectItem>
                <SelectItem value="flagged_for_review">Flagged</SelectItem>
                <SelectItem value="validated">Validated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Game Logs Table */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Game Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.length > 0 ? (
              filteredLogs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-brand-charcoal/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <div>
                        <p className="font-medium text-brand-text-primary">Game {log.game_id}</p>
                        <p className="text-sm text-brand-text-secondary">
                          {log.match_statistics?.total_shots || 0} shots logged
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(log.status)}>
                      {log.status.replace('_', ' ')}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
                <p className="text-brand-text-secondary">No game logs found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}