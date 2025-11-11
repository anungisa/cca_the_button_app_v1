import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ShotTrackerLog, UnifiedGameLog, Event, User } from '@/api/entities';
import { Download, Filter, Target, Trophy, AlertTriangle, CheckCircle, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const EXECUTION_COLORS = {
  'Make': '#22c55e',
  'Partial': '#f59e0b', 
  'Limited': '#ef4444',
  'Xmiss': '#6b7280'
};

const ShotTrackerOverview = ({ coachId }) => {
  const [games, setGames] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    eventId: '',
    athleteId: '',
    dateFrom: '',
    dateTo: '',
    executionType: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    loadData();
  }, [coachId, filters]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load games with shot data
      const gameData = await UnifiedGameLog.filter({ 
        participating_coach_ids: [coachId],
        ...filters 
      }, '-created_date', 50);
      
      // Load athletes assigned to this coach
      const athleteData = await User.filter({ 
        user_type: 'athlete',
        // In real app: assigned_coach_id: coachId 
      });
      
      // Load events
      const eventData = await Event.list('-start_date', 20);
      
      setGames(gameData);
      setAthletes(athleteData.slice(0, 10)); // Demo limit
      setEvents(eventData);
    } catch (error) {
      console.error('Error loading shot tracker data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateExecutionSummary = (gameId) => {
    // Mock calculation - in real app would aggregate from ShotTrackerLog
    const mockData = [
      { execution: 'Make', count: Math.floor(Math.random() * 10) + 5 },
      { execution: 'Partial', count: Math.floor(Math.random() * 8) + 2 },
      { execution: 'Limited', count: Math.floor(Math.random() * 5) + 1 },
      { execution: 'Xmiss', count: Math.floor(Math.random() * 3) }
    ];
    
    const total = mockData.reduce((sum, item) => sum + item.count, 0);
    return mockData.map(item => ({
      ...item,
      percentage: total > 0 ? (item.count / total * 100).toFixed(1) : 0
    }));
  };

  const exportGameData = async (gameId, format = 'pdf') => {
    // Export functionality - would integrate with backend export service
    console.log(`Exporting game ${gameId} as ${format}`);
    // In real app: call backend export API
  };

  const GameDetailModal = ({ game, onClose }) => {
    if (!game) return null;

    const executionData = calculateExecutionSummary(game.id);
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-brand-card-bg rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-brand-text-primary">Game Details</h2>
              <Button variant="ghost" onClick={onClose}>×</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Match Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Opponent:</span>
                    <span className="font-medium">Team Beta</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Sheet:</span>
                    <span>Sheet A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Hammer at Start:</span>
                    <Badge variant="outline">Yes</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Status:</span>
                    <Badge className={game.status === 'validated' ? 'bg-green-600' : 'bg-yellow-600'}>
                      {game.status === 'validated' ? (
                        <><CheckCircle className="w-3 h-3 mr-1" /> Validated</>
                      ) : (
                        <><AlertTriangle className="w-3 h-3 mr-1" /> {game.status}</>
                      )}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Execution Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={executionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="execution" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => exportGameData(game.id, 'pdf')} className="bg-brand-red hover:bg-red-700">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => exportGameData(game.id, 'csv')}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-text-primary">Shot Tracker Overview</h2>
        <Button onClick={() => loadData()} variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={filters.eventId} onValueChange={(v) => setFilters({...filters, eventId: v})}>
              <SelectTrigger>
                <SelectValue placeholder="All Events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Events</SelectItem>
                {events.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filters.athleteId} onValueChange={(v) => setFilters({...filters, athleteId: v})}>
              <SelectTrigger>
                <SelectValue placeholder="All Athletes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Athletes</SelectItem>
                {athletes.map(a => <SelectItem key={a.id} value={a.id}>{a.full_name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Input 
              type="date" 
              placeholder="From Date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
            />

            <Input 
              type="date" 
              placeholder="To Date"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
            />

            <Select value={filters.executionType} onValueChange={(v) => setFilters({...filters, executionType: v})}>
              <SelectTrigger>
                <SelectValue placeholder="All Executions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Executions</SelectItem>
                <SelectItem value="Make">Make</SelectItem>
                <SelectItem value="Partial">Partial</SelectItem>
                <SelectItem value="Limited">Limited</SelectItem>
                <SelectItem value="Xmiss">Miss</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Games Summary */}
      <div className="grid grid-cols-1 gap-4">
        {games.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Target className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
              <p className="text-brand-text-secondary">No shot tracking data found for the selected filters.</p>
              <Button className="mt-4" onClick={() => setFilters({})}>Clear Filters</Button>
            </CardContent>
          </Card>
        ) : (
          games.map((game, index) => {
            const executionData = calculateExecutionSummary(game.id);
            const totalShots = executionData.reduce((sum, item) => sum + item.count, 0);
            const makePercentage = executionData.find(item => item.execution === 'Make')?.percentage || 0;
            
            return (
              <motion.div key={game.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedGame(game)}>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center">
                            <Target className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-brand-text-primary">vs Team Beta</p>
                            <p className="text-sm text-brand-text-secondary">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-brand-text-secondary">Sheet</p>
                        <Badge variant="outline">A</Badge>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-brand-text-secondary">Result</p>
                        <Badge className="bg-green-600">Win</Badge>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-brand-text-secondary">Make %</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Progress value={makePercentage} className="h-2" />
                          </div>
                          <span className="text-sm font-semibold">{makePercentage}%</span>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-brand-text-secondary">XP Earned</p>
                        <div className="flex items-center justify-center gap-1">
                          <Trophy className="w-4 h-4 text-amber-500" />
                          <span className="font-semibold text-amber-500">{Math.floor(Math.random() * 50) + 20}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={game.status === 'validated' ? 'bg-green-600' : 'bg-yellow-600'}>
                          {game.status === 'validated' ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Validated</>
                          ) : (
                            <><AlertTriangle className="w-3 h-3 mr-1" /> {game.status}</>
                          )}
                        </Badge>
                        {game.match_statistics?.overall_match_rate > 80 && (
                          <Badge className="bg-blue-600">
                            Coach Bonus
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-brand-text-secondary">
                        {totalShots} shots logged
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      <GameDetailModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
};

export default ShotTrackerOverview;