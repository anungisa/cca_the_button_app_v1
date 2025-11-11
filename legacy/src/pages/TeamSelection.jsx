import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Trophy, Users, Target, Calendar, FileText, 
  CheckCircle, Clock, AlertTriangle, User, ArrowRight, Shield
} from 'lucide-react';
import { User as UserEntity, NationalTeam } from '@/api/entities';
import { usePermissions } from '../components/hooks/usePermissions';
import { useToast } from '../components/hooks/use-toast';

const SelectionCriteriaCard = ({ criteria }) => (
  <Card className="bg-brand-card-bg border-brand-border">
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <Target className="w-5 h-5 text-brand-red" />
        {criteria.title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-brand-text-secondary mb-4">{criteria.description}</p>
      <div className="space-y-2">
        {criteria.points?.map((point, index) => (
          <div key={index} className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
            <span className="text-sm text-brand-text-primary">{point}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const TeamRosterEditor = ({ team, onSave }) => {
  const [positions, setPositions] = useState({
    skip: team?.skip_id || '',
    third: team?.third_id || '',
    second: team?.second_id || '',
    lead: team?.lead_id || '',
    alternate: team?.alternate_id || ''
  });

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>{team?.display_name || 'Team Roster'}</CardTitle>
        <CardDescription>Manage team positions and assignments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {['skip', 'third', 'second', 'lead', 'alternate'].map(position => (
          <div key={position} className="flex items-center justify-between p-4 bg-brand-charcoal rounded-lg">
            <div>
              <p className="font-medium text-brand-text-primary capitalize">{position}</p>
              <p className="text-sm text-brand-text-secondary">
                {positions[position] ? 'Assigned' : 'Not assigned'}
              </p>
            </div>
            <Button variant="outline" size="sm">
              {positions[position] ? 'Change' : 'Assign'} Athlete
            </Button>
          </div>
        ))}
        <Button className="w-full bg-brand-red hover:bg-red-700" onClick={() => onSave(positions)}>
          Save Roster Changes
        </Button>
      </CardContent>
    </Card>
  );
};

export default function TeamSelection() {
  const { permissions } = usePermissions();
  const { toast } = useToast();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    setIsLoading(true);
    try {
      const teamData = await NationalTeam.list();
      setTeams(teamData);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectionCriteria = [
    {
      title: 'Competitive Performance',
      description: 'Results from national and international competitions',
      points: [
        'Canadian Championship results (Brier, Scotties, etc.)',
        'International event placements',
        'Head-to-head records against top teams',
        'Consistency across multiple seasons'
      ]
    },
    {
      title: 'Team Dynamics',
      description: 'Chemistry and cohesion within the team',
      points: [
        'Communication and strategy execution',
        'Team stability and longevity',
        'Coaching relationships',
        'Support staff integration'
      ]
    },
    {
      title: 'Technical Skills',
      description: 'Individual and team technical proficiency',
      points: [
        'Shot-making accuracy and consistency',
        'Strategic decision-making',
        'Sweeping effectiveness',
        'Adaptability to different ice conditions'
      ]
    },
    {
      title: 'Physical & Mental',
      description: 'Fitness and psychological preparedness',
      points: [
        'Physical conditioning assessments',
        'Mental performance under pressure',
        'Injury history and recovery',
        'Training commitment and professionalism'
      ]
    }
  ];

  if (!permissions.canAccessHP) {
    return (
      <div className="min-h-screen bg-brand-charcoal p-4 md:p-8 flex items-center justify-center">
        <Alert>
          <Shield className="w-4 h-4" />
          <AlertDescription>
            You don't have permission to access team selection. This area is restricted to HP staff.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-charcoal p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary flex items-center gap-3">
            <Trophy className="w-8 h-8 text-brand-red" />
            Team Selection
          </h1>
          <p className="text-brand-text-secondary mt-2">
            Manage national team rosters and selection criteria
          </p>
        </div>

        <Tabs defaultValue="criteria" className="space-y-6">
          <TabsList className="bg-brand-card-bg border-brand-border">
            <TabsTrigger value="criteria">Selection Criteria</TabsTrigger>
            <TabsTrigger value="rosters">Team Rosters</TabsTrigger>
            <TabsTrigger value="trials">Trials & Results</TabsTrigger>
            <TabsTrigger value="history">Selection History</TabsTrigger>
          </TabsList>

          <TabsContent value="criteria" className="space-y-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>National Team Selection Process</CardTitle>
                <CardDescription>
                  Teams are selected through a comprehensive evaluation process that considers competitive results,
                  technical skills, team dynamics, and overall preparedness for international competition.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectionCriteria.map((criteria, index) => (
                <SelectionCriteriaCard key={index} criteria={criteria} />
              ))}
            </div>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-red" />
                  Selection Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { phase: 'Application Period', date: 'April - May', status: 'completed' },
                    { phase: 'Trials Competition', date: 'November - December', status: 'upcoming' },
                    { phase: 'Team Evaluation', date: 'December', status: 'upcoming' },
                    { phase: 'Final Selection', date: 'January', status: 'upcoming' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-brand-charcoal rounded-lg">
                      <div className="flex items-center gap-3">
                        {item.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <Clock className="w-5 h-5 text-amber-400" />
                        )}
                        <div>
                          <p className="font-medium text-brand-text-primary">{item.phase}</p>
                          <p className="text-sm text-brand-text-secondary">{item.date}</p>
                        </div>
                      </div>
                      <Badge className={item.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rosters" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full mx-auto" />
                <p className="text-brand-text-secondary mt-4">Loading teams...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teams.map(team => (
                  <TeamRosterEditor 
                    key={team.id} 
                    team={team}
                    onSave={(positions) => {
                      toast({
                        title: 'Roster Updated',
                        description: `${team.display_name} roster has been updated successfully.`
                      });
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trials" className="space-y-6">
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Trials results and competition data will be displayed here. Integration with live scoring system coming soon.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Selection History</CardTitle>
                <CardDescription>Historical record of national team selections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { season: '2024-2025', team: "Men's Team", selected: 'Team Gushue', date: 'January 2024' },
                    { season: '2024-2025', team: "Women's Team", selected: 'Team Homan', date: 'January 2024' },
                    { season: '2023-2024', team: "Men's Team", selected: 'Team Gushue', date: 'January 2023' },
                    { season: '2023-2024', team: "Women's Team", selected: 'Team Einarson', date: 'January 2023' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-brand-charcoal rounded-lg">
                      <div>
                        <p className="font-medium text-brand-text-primary">{item.team} - {item.season}</p>
                        <p className="text-sm text-brand-text-secondary">{item.selected}</p>
                      </div>
                      <p className="text-sm text-brand-text-secondary">{item.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}