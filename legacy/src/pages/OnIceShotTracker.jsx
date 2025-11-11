
import React, { useState, useEffect, useCallback } from 'react';
import { Event } from '@/api/entities';
import { Game } from '@/api/entities';
import { Team } from '@/api/entities';
import { User } from '@/api/entities';
import { ShotTrackerLog } from '@/api/entities';
import { usePermissions } from '../components/hooks/usePermissions';
import { useXP } from '../components/XPContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Loader2, PlayCircle } from 'lucide-react';
import ShotEntryForm from '../components/hp/ShotEntryForm';
import ShotLogDisplay from '../components/hp/ShotLogDisplay';
import SkeletonPage from '../components/ui/SkeletonPage';

// NEW IMPORTS
import { useToast } from '@/components/hooks/use-toast';
import { analyzePerformanceData } from '@/api/functions';

export default function OnIceShotTracker() {
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  const { awardPoints } = useXP();
  // NEW: Initialize useToast
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [athletes, setAthletes] = useState([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentSessionShots, setCurrentSessionShots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: State for game/session configuration to pass to AI analysis
  const [gameConfig, setGameConfig] = useState({
    eventId: '',
    gameId: '',
    teamId: '',
    coachId: 'placeholder_coach_id_from_context', // This should dynamically come from an auth context
    athleteIdForAnalysis: null, // Used for AI analysis, if targeted to a specific athlete (e.g., first athlete of the team)
  });

  const loadEvents = useCallback(async () => {
    try {
      const eventData = await Event.list('-start_date', 50);
      setEvents(eventData);
    } catch (error) {
      console.error('Failed to load events', error);
      toast({ title: 'Error', description: 'Failed to load events.', variant: 'destructive' });
    }
  }, [toast]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    const loadGames = async () => {
      if (!selectedEvent) {
        setGames([]); // Clear games if no event is selected
        setSelectedGame(''); // Also clear selected game
        return;
      }
      try {
        const gameData = await Game.filter({ event_id: selectedEvent });
        setGames(gameData);
      } catch (error) {
        console.error('Failed to load games', error);
        toast({ title: 'Error', description: 'Failed to load games for the selected event.', variant: 'destructive' });
      }
    };
    loadGames();
  }, [selectedEvent, toast]);
  
  useEffect(() => {
    const loadTeams = async () => {
        if (!selectedGame) {
            setTeams([]);
            return;
        }
        try {
            const gameData = await Game.get(selectedGame);
            if (gameData && gameData.team1_id && gameData.team2_id) {
              const team1 = await Team.get(gameData.team1_id);
              const team2 = await Team.get(gameData.team2_id);
              setTeams([team1, team2].filter(Boolean));
            } else {
              // Fallback to all teams if game data is incomplete or for demo
              const allTeams = await Team.list();
              setTeams(allTeams);
            }
        } catch (error) {
            console.error('Failed to load teams', error);
            toast({ title: 'Error', description: 'Failed to load game-specific teams, attempting to load all teams.', variant: 'warning' });
            // Fallback to loading all teams if there's an error getting game specific teams
            try {
              const allTeams = await Team.list();
              setTeams(allTeams);
            } catch (err) {
              console.error('Failed to load all teams as fallback', err);
              toast({ title: 'Error', description: 'Failed to load any teams.', variant: 'destructive' });
            }
        }
    }
    loadTeams();
  }, [selectedGame, toast]);

  useEffect(() => {
    const loadAthletes = async () => {
      if (!selectedTeam) {
        setAthletes([]); // Clear athletes if no team is selected
        return;
      }
      try {
        const teamData = await Team.get(selectedTeam);
        if (teamData?.athlete_ids && teamData.athlete_ids.length > 0) {
          const athletePromises = teamData.athlete_ids.map(async (id) => {
            try {
              return await User.get(id);
            } catch (error) {
              console.warn(`Failed to load athlete ${id}:`, error);
              return null;
            }
          });
          const athleteData = await Promise.all(athletePromises);
          setAthletes(athleteData.filter(Boolean));
        } else {
          // If no athletes assigned to team or athlete_ids is empty, create placeholder athletes for demo
          setAthletes([
            { id: 'demo_athlete_1', full_name: 'Lead Player', preferred_position: 'lead' },
            { id: 'demo_athlete_2', full_name: 'Second Player', preferred_position: 'second' },
            { id: 'demo_athlete_3', full_name: 'Third Player', preferred_position: 'third' },
            { id: 'demo_athlete_4', full_name: 'Skip Player', preferred_position: 'skip' }
          ]);
        }
      } catch (error) {
        console.error('Failed to load athletes', error);
        toast({ title: 'Error', description: 'Failed to load athletes for the selected team.', variant: 'destructive' });
        // Fallback to demo athletes in case of an error during team data retrieval
        setAthletes([
          { id: 'demo_athlete_1', full_name: 'Lead Player', preferred_position: 'lead' },
          { id: 'demo_athlete_2', full_name: 'Second Player', preferred_position: 'second' },
          { id: 'demo_athlete_3', full_name: 'Third Player', preferred_position: 'third' },
          { id: 'demo_athlete_4', full_name: 'Skip Player', preferred_position: 'skip' }
        ]);
      }
    };
    loadAthletes();
  }, [selectedTeam, toast]);

  useEffect(() => {
    if(!permissionsLoading) {
        setIsLoading(false);
    }
  }, [permissionsLoading]);

  // MODIFIED: handleStartSession to set gameConfig and use toast
  const handleStartSession = () => {
    if (selectedEvent && selectedGame && selectedTeam && athletes.length > 0) {
      setIsSessionActive(true);
      // Initialize gameConfig for the session
      setGameConfig({
        eventId: selectedEvent,
        gameId: selectedGame,
        teamId: selectedTeam,
        coachId: gameConfig.coachId, // Keep existing coachId placeholder or fetch from context
        athleteIdForAnalysis: athletes[0].id, // For analysis, assume the first athlete for now
      });
      setCurrentSessionShots([]); // Clear any previous session shots
      toast({
        title: 'Session Started',
        description: 'You can now log shots for the selected game and team.',
      });
    } else {
      toast({
        title: 'Cannot start tracking',
        description: 'Please select an event, game, and team, and ensure athletes are loaded to start tracking.',
        variant: 'destructive',
      });
    }
  };

  // MODIFIED: handleSaveShot to use gameConfig for event/game/team/coach IDs and use toast
  const handleSaveShot = async (shotData) => {
    setIsSubmitting(true);
    try {
      const newShot = {
        ...shotData,
        athlete_id: shotData.athlete_id,
        event_id: gameConfig.eventId, // Use from gameConfig
        game_id: gameConfig.gameId,   // Use from gameConfig
        team_id: gameConfig.teamId,   // Use from gameConfig
        coach_id: gameConfig.coachId, // Use from gameConfig
        validation_status: 'pending',
        xp_awarded: 5,
      };
      
      const savedShot = await ShotTrackerLog.create(newShot);
      setCurrentSessionShots(prev => [...prev, savedShot]);
      await awardPoints(5, 'shot_logged', 'Logged a shot');
      toast({
        title: 'Shot Logged',
        description: `Shot for ${shotData.athlete_name || 'an athlete'} successfully recorded.`,
      });
    } catch (error) {
      console.error('Failed to save shot:', error);
      toast({ title: 'Error Logging Shot', description: 'Could not save shot. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // NEW: handleSaveGame function from outline, adapted for currentSessionShots
  const handleSaveGame = async () => {
    if (currentSessionShots.length === 0) {
      toast({ title: 'No shots logged', description: 'Please log at least one shot before saving the session.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true); // Using isSubmitting for the whole save process
    try {
      const savedLogs = await ShotTrackerLog.bulkCreate(currentSessionShots);
      
      toast({
        title: 'Session Saved',
        description: `${savedLogs.length} shots have been successfully logged.`,
      });

      // Trigger AI analysis after saving the game
      if (gameConfig.athleteIdForAnalysis && gameConfig.coachId && gameConfig.gameId) {
        toast({ title: 'AI Analysis Started', description: 'Your performance data is being analyzed for insights.'});
        await analyzePerformanceData({
          gameId: gameConfig.gameId,
          athleteId: gameConfig.athleteIdForAnalysis,
          coachId: gameConfig.coachId,
        });
        toast({ title: 'AI Analysis Complete', description: 'Performance insights will be available shortly.'});
      } else {
          console.warn('Skipping AI analysis: Missing gameId, athleteIdForAnalysis, or coachId in gameConfig.');
          toast({ title: 'AI Analysis Skipped', description: 'Could not trigger AI analysis due to missing configuration.', variant: 'warning' });
      }
      
      // Reset for next session
      setCurrentSessionShots([]);
      setIsSessionActive(false); // End the session
      setSelectedEvent('');
      setSelectedGame('');
      setSelectedTeam('');
      setAthletes([]); // Clear athletes list as well
      setGameConfig({
        eventId: '', gameId: '', teamId: '', coachId: 'placeholder_coach_id_from_context', athleteIdForAnalysis: null
      });

    } catch (error) {
      console.error("Failed to save session log:", error);
      toast({ title: 'Error Saving Session', description: 'Could not save shot log. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // NEW: handleCancelSession
  const handleCancelSession = () => {
    if (window.confirm('Are you sure you want to cancel the current session? All unsaved shots will be lost.')) {
      setIsSessionActive(false);
      setCurrentSessionShots([]);
      setSelectedEvent('');
      setSelectedGame('');
      setSelectedTeam('');
      setAthletes([]);
      setGameConfig({
        eventId: '', gameId: '', teamId: '', coachId: 'placeholder_coach_id_from_context', athleteIdForAnalysis: null
      });
      toast({
        title: 'Session Cancelled',
        description: 'The tracking session has been cancelled and shots were not saved.',
      });
    }
  };
  
  if (isLoading) {
    return <SkeletonPage variant="form" />;
  }

  if (!hasPermission('canLogDrills')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-brand-text-secondary">You do not have permission to access the On-Ice Shot Tracker.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-text-primary flex items-center gap-3">
          <Target className="w-8 h-8 text-brand-red" />
          On-Ice Shot Tracker
        </h1>
        {isSessionActive && (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancelSession} disabled={isSubmitting}>Cancel Session</Button>
            <Button onClick={handleSaveGame} disabled={isSubmitting || currentSessionShots.length === 0}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Session & Analyze
            </Button>
          </div>
        )}
      </div>
      
      {!isSessionActive ? (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Start a New Tracking Session</CardTitle>
            <p className="text-brand-text-secondary">Select the event, game, and team you are tracking.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event</label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger><SelectValue placeholder="Select an event" /></SelectTrigger>
                <SelectContent>{events.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Game</label>
              <Select value={selectedGame} onValueChange={setSelectedGame} disabled={!selectedEvent}>
                <SelectTrigger><SelectValue placeholder="Select a game" /></SelectTrigger>
                <SelectContent>
                  {games.length > 0 ? (
                    games.map(g => <SelectItem key={g.id} value={g.id}>{g.name || `${g.team1?.name || 'Team 1'} vs ${g.team2?.name || 'Team 2'}`}</SelectItem>)
                  ) : (
                    <SelectItem value="no-games" disabled>No games available for this event</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Team to Track</label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam} disabled={!selectedGame}>
                <SelectTrigger><SelectValue placeholder="Select a team" /></SelectTrigger>
                <SelectContent>
                  {teams.length > 0 ? (
                    teams.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)
                  ) : (
                    <SelectItem value="no-teams" disabled>No teams available for this game</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            {selectedTeam && athletes.length > 0 && (
              <div className="p-3 bg-brand-charcoal rounded-lg">
                <p className="text-sm font-medium text-brand-text-primary mb-2">Athletes on this team:</p>
                <div className="flex flex-wrap gap-2">
                  {athletes.map(athlete => (
                    <span key={athlete.id} className="text-xs bg-brand-red text-white px-2 py-1 rounded">
                      {athlete.full_name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <Button onClick={handleStartSession} disabled={!selectedEvent || !selectedGame || !selectedTeam || athletes.length === 0} className="w-full">
              <PlayCircle className="w-4 h-4 mr-2" /> Start Tracking
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                    <CardTitle>Current Session</CardTitle>
                    <p className="text-sm text-brand-text-secondary">
                        Tracking: <span className="font-semibold">{events.find(e => e.id === gameConfig.eventId)?.name}</span> &gt;
                        <span className="font-semibold"> {games.find(g => g.id === gameConfig.gameId)?.name || 'Game'}</span> &gt;
                        <span className="font-semibold"> {teams.find(t => t.id === gameConfig.teamId)?.name}</span>
                    </p>
                </CardHeader>
                <CardContent>
                    <ShotEntryForm athletes={athletes} onSaveShot={handleSaveShot} disabled={isSubmitting}/>
                </CardContent>
            </Card>
            <ShotLogDisplay shots={currentSessionShots} athletes={athletes}/>
        </div>
      )}
    </div>
  );
}
