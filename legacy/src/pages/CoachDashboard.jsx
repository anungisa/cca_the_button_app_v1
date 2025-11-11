
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { User, Users, ClipboardList, Target, MessageSquare } from 'lucide-react';
import { useXP } from '@/components/XPContext';
import LogDrillForm from '@/components/hp/LogDrillForm';
import { Team, DrillLibrary } from '@/api/entities'; // Assuming Team and DrillLibrary entities exist
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // New import for Tabs
import AthleteInsightFeed from '../components/hp/AthleteInsightFeed'; // New import for AthleteInsightFeed

const mockTeams = [
    { id: 'team_1', name: 'Team Gushue', athletes: [{id: 'athlete_1', full_name: 'Brad Gushue'}, {id: 'athlete_2', full_name: 'Mark Nichols'}] },
    { id: 'team_2', name: 'Team Homan', athletes: [{id: 'athlete_3', full_name: 'Rachel Homan'}, {id: 'athlete_4', full_name: 'Emma Miskew'}] }
];

const mockDrills = [
    { id: 'drill_1', title: 'Draw to the Button' },
    { id: 'drill_2', title: 'Lite-Weight Hits' }
];

// Helper function to create page URLs. In a real app, this might come from a router utility.
const createPageUrl = (pathWithParams) => {
  // Assuming a simple routing structure where pathWithParams is like "PageName?param=value"
  // If using Next.js, this might be `/coach/athlete/[id]` and you'd use `router.push`.
  // For this context, we'll simulate a direct path for `window.location.href`.
  return `/${pathWithParams}`;
};

export default function CoachDashboard() {
  const { user } = useXP();
  const [teams, setTeams] = useState(mockTeams);
  const [drills, setDrills] = useState(mockDrills);
  const [selectedTeam, setSelectedTeam] = useState(mockTeams[0]);
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, you would fetch this data
  // useEffect(() => {
  //   const loadData = async () => {
  //     setIsLoading(true);
  //     const coachTeams = await Team.filter({ coach_ids: { $in: [user.id] } });
  //     const libraryDrills = await DrillLibrary.list();
  //     setTeams(coachTeams);
  //     setDrills(libraryDrills);
  //     if(coachTeams.length > 0) setSelectedTeam(coachTeams[0]);
  //     setIsLoading(false);
  //   }
  //   if(user) loadData();
  // }, [user]);
  
  const handleDrillLogged = () => {
      // Potentially refresh data or show a success message
      console.log("Drill successfully logged!");
  }

  const handleViewAthleteDashboard = (athlete) => {
    window.location.href = createPageUrl(`CoachAthleteView?athleteId=${athlete.id}`);
  };

  return (
    <div className="min-h-screen bg-brand-charcoal text-brand-text-primary p-4 md:p-8">
       <div className="space-y-6"> {/* This div was the original top-level div's class, now applied internally */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h1 className="text-3xl font-bold text-brand-text-primary">Coach Dashboard</h1>
              <p className="text-brand-text-secondary">Manage your teams, log drills, and provide feedback.</p>
           </div>
           {teams.length > 1 && (
              <Select onValueChange={(teamId) => setSelectedTeam(teams.find(t => t.id === teamId))} defaultValue={selectedTeam.id}>
                <SelectTrigger className="w-full md:w-64 bg-brand-card-bg border-brand-border">
                  <SelectValue placeholder="Select a team..." />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>)}
                </SelectContent>
              </Select>
           )}
        </div>

        <Tabs defaultValue="my_athletes" className="w-full space-y-6">
          <TabsList className="bg-brand-card-bg border-brand-border p-1 rounded-md">
            <TabsTrigger value="my_athletes" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=active]:shadow-sm">My Athletes</TabsTrigger>
            <TabsTrigger value="performance_trends" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=active]:shadow-sm">Performance Trends</TabsTrigger>
            <TabsTrigger value="drill_library" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=active]:shadow-sm">Drill Library</TabsTrigger>
          </TabsList>

          <TabsContent value="my_athletes">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Add AI Insight Feed here */}
                <AthleteInsightFeed coachId={user?.id} />

                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Users /> {selectedTeam.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <h3 className="font-semibold text-brand-text-primary mb-3">Athletes</h3>
                      <div className="space-y-2">
                          {selectedTeam.athletes.map(athlete => (
                              <div key={athlete.id} className="flex items-center justify-between p-2 bg-brand-charcoal rounded-md">
                                  <span className="text-brand-text-primary">{athlete.full_name}</span>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => handleViewAthleteDashboard(athlete)}
                                  >
                                    View Dashboard
                                  </Button>
                              </div>
                          ))}
                      </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Quick Actions Card */}
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Target /> Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                        <Button className="w-full justify-start gap-2" variant="outline"><ClipboardList /> Log Game Stats</Button>
                        <Button className="w-full justify-start gap-2" variant="outline"><Target /> Log Team Practice</Button>
                        <Button className="w-full justify-start gap-2" variant="outline"><MessageSquare /> Send Team Message</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Log Drill Form Card */}
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ClipboardList /> Log New Drill</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LogDrillForm team={selectedTeam} drills={drills} onDrillLogged={handleDrillLogged} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Placeholder for other TabsContent */}
          <TabsContent value="performance_trends">
            <div className="p-4 text-brand-text-secondary">Performance trends coming soon!</div>
          </TabsContent>
          <TabsContent value="drill_library">
            <div className="p-4 text-brand-text-secondary">Drill library coming soon!</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
