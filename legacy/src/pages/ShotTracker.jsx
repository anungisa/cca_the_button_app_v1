
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ShotTrackerLog } from '@/api/entities';
import { Event } from '@/api/entities';
import { User } from '@/api/entities';
import { ProgressiveXPEngine } from '@/components/xp/ProgressiveXPEngine';
import { usePermissions } from '@/components/hooks/usePermissions';
import { Target, Save, Shield, ChevronRight, ChevronLeft, Plus, Minus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const GameSetupScreen = ({ onStartGame }) => {
  const [setup, setSetup] = useState({
    eventId: '',
    teamId: '',
    opponent: '',
    round: '',
    sheet: '',
    hammerAtStart: false,
    date: new Date().toISOString().split('T')[0]
  });
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Demo events for testing
    const demoEvents = [
      { id: 'event_001', name: 'Provincial Championships 2024', start_date: '2024-03-15', venue: { city: 'Calgary' } },
      { id: 'event_002', name: 'Regional Qualifier', start_date: '2024-02-20', venue: { city: 'Edmonton' } },
      { id: 'event_003', name: 'Junior Nationals', start_date: '2024-04-10', venue: { city: 'Vancouver' } },
      { id: 'event_004', name: 'Club Championship', start_date: '2024-01-25', venue: { city: 'Toronto' } },
      { id: 'event_005', name: 'High Performance Camp', start_date: '2024-05-05', venue: { city: 'Winnipeg' } }
    ];
    setEvents(demoEvents);
    
    // Demo teams for testing
    const demoTeams = [
      { id: 'team1', name: 'Team Alpha', club: 'Granite CC', skip: 'Emma Thompson' },
      { id: 'team2', name: 'Team Beta', club: 'Ice House CC', skip: 'Taylor Brown' },
      { id: 'team3', name: 'Team Gamma', club: 'Training Centre', skip: 'Morgan Lee' },
      { id: 'team4', name: 'Team Delta', club: 'Royal City CC', skip: 'Jordan Davis' },
      { id: 'team5', name: 'Team Epsilon', club: 'Mayflower CC', skip: 'Casey Martinez' }
    ];
    setTeams(demoTeams);
  }, []);

  const handleStart = () => {
    if (!setup.eventId || !setup.teamId) {
      alert('Please select event and team');
      return;
    }
    
    const selectedEvent = events.find(e => e.id === setup.eventId);
    const selectedTeam = teams.find(t => t.id === setup.teamId);
    
    onStartGame({
      ...setup,
      eventName: selectedEvent?.name || 'Event',
      teamName: selectedTeam?.name || 'Team',
      gameId: `game_${Date.now()}`
    });
  };

  return (
    <div className="min-h-screen bg-brand-charcoal p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Shot Data Tracking</CardTitle>
          <p className="text-center text-brand-text-secondary">Set up your game details</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Match Details matching Excel structure */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-4 text-gray-800">Match Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
                <Input 
                  type="date" 
                  value={setup.date} 
                  onChange={(e) => setSetup({...setup, date: e.target.value})}
                  className="bg-white border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hammer at start:</label>
                <Select value={setup.hammerAtStart ? 'yes' : 'no'} onValueChange={(v) => setSetup({...setup, hammerAtStart: v === 'yes'})}>
                  <SelectTrigger className="bg-white border border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Round:</label>
                <Select value={setup.round} onValueChange={(v) => setSetup({...setup, round: v})}>
                  <SelectTrigger className="bg-white border border-gray-300">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pool">Pool Play</SelectItem>
                    <SelectItem value="playoff">Playoff</SelectItem>
                    <SelectItem value="semi">Semi-Final</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rock Notes:</label>
                <Input 
                  placeholder="Notes..." 
                  className="bg-white border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opponent - last name:</label>
                <Input 
                  value={setup.opponent} 
                  onChange={(e) => setSetup({...setup, opponent: e.target.value})}
                  placeholder="Enter opponent"
                  className="bg-white border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sheet:</label>
                <Input 
                  value={setup.sheet} 
                  onChange={(e) => setSetup({...setup, sheet: e.target.value})}
                  placeholder="A, B, C, etc."
                  className="bg-white border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Result:</label>
                <Select>
                  <SelectTrigger className="bg-white border border-gray-300">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="win">Win</SelectItem>
                    <SelectItem value="loss">Loss</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Team Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Event *</label>
              <Select value={setup.eventId} onValueChange={(v) => setSetup({...setup, eventId: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map(e => (
                    <SelectItem key={e.id} value={e.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{e.name}</span>
                        <span className="text-xs text-brand-text-secondary">
                          {new Date(e.start_date).toLocaleDateString()} • {e.venue?.city}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Team *</label>
              <Select value={setup.teamId} onValueChange={(v) => setSetup({...setup, teamId: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{t.name}</span>
                        <span className="text-xs text-brand-text-secondary">
                          {t.club} • Skip: {t.skip}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleStart} className="w-full bg-brand-red hover:bg-red-700 h-12 text-lg">
            Start Shot Tracking
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const ShotTrackingInterface = ({ gameContext, onEndGame }) => {
  const [currentEnd, setCurrentEnd] = useState(1);
  const [selectedAthlete, setSelectedAthlete] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('lead');
  const [shots, setShots] = useState([]);
  const [athletes, setAthletes] = useState([]);

  useEffect(() => {
    // Demo athletes for testing - in production this would be User.filter({ user_type: 'athlete' })
    const demoAthletes = [
      { id: 'athlete_001', full_name: 'Emma Thompson', position: 'skip', club: 'Granite Curling Club' },
      { id: 'athlete_002', full_name: 'Sarah Mitchell', position: 'third', club: 'Ice House CC' },
      { id: 'athlete_003', full_name: 'Jessica Chen', position: 'second', club: 'Royal City CC' },
      { id: 'athlete_004', full_name: 'Alex Johnson', position: 'lead', club: 'Mayflower CC' },
      { id: 'athlete_005', full_name: 'Taylor Brown', position: 'skip', club: 'Training Centre' },
      { id: 'athlete_006', full_name: 'Jordan Davis', position: 'third', club: 'Granite Curling Club' },
      { id: 'athlete_007', full_name: 'Riley Wilson', position: 'second', club: 'Ice House CC' },
      { id: 'athlete_008', full_name: 'Casey Martinez', position: 'lead', club: 'Royal City CC' },
      { id: 'athlete_009', full_name: 'Morgan Lee', position: 'skip', club: 'Mayflower CC' },
      { id: 'athlete_010', full_name: 'Avery Taylor', position: 'third', club: 'Training Centre' }
    ];
    setAthletes(demoAthletes);
  }, []);

  // Initialize shots for current end and position
  useEffect(() => {
    const shotsPerPosition = { lead: 2, second: 2, third: 2, skip: 2 };
    const numShots = shotsPerPosition[selectedPosition] || 2;
    
    setShots(Array(numShots).fill(null).map((_, i) => ({
      id: `${currentEnd}-${selectedPosition}-${i}`,
      shot_number: `${i + 1}${i === 0 ? 'A' : 'B'}`,
      turn_target: '',
      draw_type: '',
      hit_type: '',
      execution: '',
      deficiency: '',
      notes: ''
    })));
  }, [currentEnd, selectedPosition]);

  const updateShot = (shotId, field, value) => {
    setShots(prev => prev.map(shot => 
      shot.id === shotId ? { ...shot, [field]: value } : shot
    ));
  };

  const ShotRow = ({ shot, index }) => {
    const turnTargets = ['CW C', 'CW S', 'CCW C', 'CCW S'];
    const drawTypes = ['Draws', 'Tick'];
    const hitTypes = ['Finesse', 'Power'];
    const executions = ['Make', 'Partial', 'Limited', 'Xmiss'];
    const deficiencies = ['None', 'Light', 'Heavy', 'Undercurl', 'Overcurl', 'Management'];

    return (
      <tr className="border-b border-gray-200">
        <td className="p-2 text-center font-medium">{shot.shot_number}</td>
        <td className="p-2">
          <Select value={shot.turn_target} onValueChange={(v) => updateShot(shot.id, 'turn_target', v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {turnTargets.map(tt => <SelectItem key={tt} value={tt}>{tt}</SelectItem>)}
            </SelectContent>
          </Select>
        </td>
        <td className="p-2">
          <Select value={shot.draw_type} onValueChange={(v) => updateShot(shot.id, 'draw_type', v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {drawTypes.map(dt => <SelectItem key={dt} value={dt}>{dt}</SelectItem>)}
            </SelectContent>
          </Select>
        </td>
        <td className="p-2">
          <Select value={shot.hit_type} onValueChange={(v) => updateShot(shot.id, 'hit_type', v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {hitTypes.map(ht => <SelectItem key={ht} value={ht}>{ht}</SelectItem>)}
            </SelectContent>
          </Select>
        </td>
        <td className="p-2">
          <Select value={shot.execution} onValueChange={(v) => updateShot(shot.id, 'execution', v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {executions.map(ex => <SelectItem key={ex} value={ex}>{ex}</SelectItem>)}
            </SelectContent>
          </Select>
        </td>
        <td className="p-2">
          <Select value={shot.deficiency} onValueChange={(v) => updateShot(shot.id, 'deficiency', v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {deficiencies.map(def => <SelectItem key={def} value={def}>{def}</SelectItem>)}
            </SelectContent>
          </Select>
        </td>
        <td className="p-2">
          <Input 
            value={shot.notes} 
            onChange={(e) => updateShot(shot.id, 'notes', e.target.value)}
            placeholder="Notes..."
            className="h-8 text-xs"
          />
        </td>
      </tr>
    );
  };

  const handleSaveEnd = async () => {
    // Save all shots for this end
    for (const shot of shots) {
      if (shot.execution && selectedAthlete) {
        const xpMap = { Make: 2, Partial: 1, Limited: 0.5, Xmiss: 0 };
        const xpAwarded = xpMap[shot.execution] || 0;

        const shotData = {
          athlete_id: selectedAthlete,
          event_id: gameContext.eventId,
          game_id: gameContext.gameId,
          end_number: currentEnd,
          shot_number: shot.shot_number,
          position: selectedPosition,
          turn_target: shot.turn_target,
          draw_type: shot.draw_type,
          hit_type: shot.hit_type,
          execution: shot.execution,
          deficiency: shot.deficiency,
          notes: shot.notes,
          xp_awarded: xpAwarded,
          coach_id: 'current_coach_id' // Would be from auth
        };

        try {
          await ShotTrackerLog.create(shotData);
          if (xpAwarded > 0) {
            await ProgressiveXPEngine.awardShotXP(selectedAthlete, shot.execution, false, {
              end_number: currentEnd,
              event_id: gameContext.eventId
            });
          }
        } catch (error) {
          console.error('Failed to save shot:', error);
        }
      }
    }
    
    alert('End saved successfully!');
  };

  return (
    <div className="min-h-screen bg-brand-charcoal p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-brand-text-primary">Shot Data Tracking</h1>
            <p className="text-brand-text-secondary">
              {gameContext.eventName} • vs {gameContext.opponent || 'Opponent'}
            </p>
          </div>
          <Button variant="outline" onClick={onEndGame}>End Session</Button>
        </div>

        {/* Game Context Display */}
        <Card className="mb-6 bg-gray-50">
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><strong>Date:</strong> {gameContext.date}</div>
              <div><strong>Sheet:</strong> {gameContext.sheet || 'TBD'}</div>
              <div><strong>Round:</strong> {gameContext.round || 'TBD'}</div>
              <div><strong>Hammer:</strong> {gameContext.hammerAtStart ? 'Yes' : 'No'}</div>
            </div>
          </CardContent>
        </Card>

        {/* Athlete and Position Selection */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Athlete *</label>
                <Select value={selectedAthlete} onValueChange={setSelectedAthlete}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select athlete to track..." />
                  </SelectTrigger>
                  <SelectContent>
                    {athletes.map(a => (
                      <SelectItem key={a.id} value={a.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{a.full_name}</span>
                          <span className="text-xs text-brand-text-secondary">
                            {a.club} • Preferred: {a.position}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Position</label>
                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="second">Second</SelectItem>
                    <SelectItem value="third">Third</SelectItem>
                    <SelectItem value="skip">Skip</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End</label>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentEnd(Math.max(1, currentEnd - 1))}
                    disabled={currentEnd === 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-bold px-4">End {currentEnd}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentEnd(currentEnd + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            {!selectedAthlete && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800">
                  Please select an athlete before logging shots
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shot Tracking Table */}
        {selectedAthlete && (
          <Card>
            <CardHeader>
              <CardTitle>End {currentEnd} - {selectedPosition.charAt(0).toUpperCase() + selectedPosition.slice(1)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">Shot</th>
                      <th className="border border-gray-300 p-2 text-left">Turn/Target</th>
                      <th className="border border-gray-300 p-2 text-left">Draw Type</th>
                      <th className="border border-gray-300 p-2 text-left">Hit Type</th>
                      <th className="border border-gray-300 p-2 text-left">Execution</th>
                      <th className="border border-gray-300 p-2 text-left">Deficiency</th>
                      <th className="border border-gray-300 p-2 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shots.map((shot, index) => (
                      <ShotRow key={shot.id} shot={shot} index={index} />
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setCurrentEnd(Math.max(1, currentEnd - 1))}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous End
                </Button>
                <Button onClick={handleSaveEnd} className="bg-brand-red hover:bg-red-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save End
                </Button>
                <Button variant="outline" onClick={() => setCurrentEnd(currentEnd + 1)}>
                  Next End
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default function ShotTracker() {
  const [gameContext, setGameContext] = useState(null);
  const { permissions, isLoading, roles } = usePermissions();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  // Check multiple permission paths for access
  const hasAccess = permissions.canAccessHP || 
                   permissions.canLogDrills || 
                   permissions.canViewHP ||
                   roles.includes('admin') || 
                   roles.includes('staff') ||
                   roles.includes('coach') ||
                   roles.includes('devops') ||
                   roles.includes('executive');

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <Card className="bg-brand-card-bg border-brand-border text-center p-8">
          <Shield className="w-12 h-12 mx-auto text-brand-red mb-4" />
          <h2 className="text-xl font-bold text-brand-text-primary mb-2">Access Restricted</h2>
          <p className="text-brand-text-secondary">Shot Data Tracking is available to certified coaches and HP staff only.</p>
          <div className="mt-4 text-xs text-brand-text-secondary">
            Debug: Roles: {roles.join(', ')} | Permissions: {Object.keys(permissions).filter(k => permissions[k]).join(', ')}
          </div>
        </Card>
      </div>
    );
  }

  if (!gameContext) {
    return <GameSetupScreen onStartGame={setGameContext} />;
  }

  return <ShotTrackingInterface gameContext={gameContext} onEndGame={() => setGameContext(null)} />;
}
