import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Users, MapPin, Award, Search, Filter, ExternalLink, Medal } from 'lucide-react';
import { NationalTeam } from '@/api/entities';
import { User } from '@/api/entities';
import { HPCenter } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

const MedalIcon = ({ medal }) => {
  const colors = {
    gold: 'text-yellow-500',
    silver: 'text-gray-400',
    bronze: 'text-orange-600'
  };
  return <Medal className={`w-4 h-4 ${colors[medal] || 'text-gray-500'}`} />;
};

const AthleteRow = ({ athlete, position, team, hpCenter, onViewProfile }) => {
  const achievements = athlete.achievements || [];
  const majorAchievements = achievements.filter(a => 
    ['olympic', 'world'].includes(a.event_type)
  ).slice(0, 3);

  return (
    <TableRow className="hover:bg-brand-charcoal/50">
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-red/20 flex items-center justify-center overflow-hidden">
            {athlete.athlete_photo_url ? (
              <img src={athlete.athlete_photo_url} alt={athlete.full_name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold">{athlete.full_name?.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="font-medium text-brand-text-primary">{athlete.full_name}</div>
            {athlete.ma_region && (
              <div className="text-xs text-brand-text-secondary">{athlete.ma_region}</div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {position}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="text-sm text-brand-text-primary">{team}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm text-brand-text-secondary">
          <MapPin className="w-3 h-3" />
          {hpCenter || 'N/A'}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          {majorAchievements.map((achievement, idx) => (
            <div key={idx} className="flex items-center gap-1" title={`${achievement.title} (${achievement.year})`}>
              <MedalIcon medal={achievement.medal} />
            </div>
          ))}
          {achievements.length > 3 && (
            <span className="text-xs text-brand-text-secondary">+{achievements.length - 3}</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={() => onViewProfile(athlete)}
        >
          View Profile
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default function NationalTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [hpCenters, setHPCenters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');
  const [selectedPositionFilter, setSelectedPositionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all_athletes');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [teamsData, athletesData, centersData] = await Promise.all([
        NationalTeam.filter({ is_active: true }),
        User.filter({ hp_pathway_stage: 'national_team' }),
        HPCenter.filter({ is_active: true })
      ]);

      setTeams(teamsData);
      setAthletes(athletesData);
      setHPCenters(centersData);
    } catch (error) {
      console.error('Error loading national teams data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAthletesByTeam = (teamId) => {
    return athletes.filter(athlete => athlete.national_team_id === teamId);
  };

  const getTeamRoster = (team) => {
    const roster = [];
    if (team.skip_id) {
      const skip = athletes.find(a => a.id === team.skip_id);
      if (skip) roster.push({ athlete: skip, position: 'skip' });
    }
    if (team.third_id) {
      const third = athletes.find(a => a.id === team.third_id);
      if (third) roster.push({ athlete: third, position: 'third' });
    }
    if (team.second_id) {
      const second = athletes.find(a => a.id === team.second_id);
      if (second) roster.push({ athlete: second, position: 'second' });
    }
    if (team.lead_id) {
      const lead = athletes.find(a => a.id === team.lead_id);
      if (lead) roster.push({ athlete: lead, position: 'lead' });
    }
    if (team.alternate_id) {
      const alternate = athletes.find(a => a.id === team.alternate_id);
      if (alternate) roster.push({ athlete: alternate, position: 'alternate' });
    }
    return roster;
  };

  const getHPCenterName = (centerId) => {
    const center = hpCenters.find(c => c.id === centerId);
    return center ? `${center.name}, ${center.location.city}` : '';
  };

  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = !searchQuery || 
      athlete.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = selectedTeamFilter === 'all' || 
      athlete.national_team_id === selectedTeamFilter;
    const matchesPosition = selectedPositionFilter === 'all' || 
      athlete.preferred_position === selectedPositionFilter;
    
    return matchesSearch && matchesTeam && matchesPosition;
  });

  const handleViewProfile = (athlete) => {
    window.location.href = createPageUrl(`Profile?userId=${athlete.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-charcoal p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-text-primary flex items-center gap-3">
              <Trophy className="w-8 h-8 text-brand-red" />
              National Teams
            </h1>
            <p className="text-brand-text-secondary mt-2">
              Canada's elite athletes representing the nation on the world stage
            </p>
          </div>
          <Link to="https://www.curling.ca/high-performance/national-teams/" target="_blank">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Official Site
            </Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-brand-card-bg border-brand-border">
            <TabsTrigger value="all_athletes">All Athletes</TabsTrigger>
            <TabsTrigger value="by_team">By Team</TabsTrigger>
            <TabsTrigger value="hp_centers">HP Centers</TabsTrigger>
          </TabsList>

          {/* All Athletes Tab */}
          <TabsContent value="all_athletes" className="space-y-6">
            {/* Filters */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                      <Input
                        placeholder="Search athletes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-brand-charcoal"
                      />
                    </div>
                  </div>
                  <Select value={selectedTeamFilter} onValueChange={setSelectedTeamFilter}>
                    <SelectTrigger className="bg-brand-charcoal">
                      <SelectValue placeholder="All Teams" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Teams</SelectItem>
                      {teams.map(team => (
                        <SelectItem key={team.id} value={team.id}>{team.display_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedPositionFilter} onValueChange={setSelectedPositionFilter}>
                    <SelectTrigger className="bg-brand-charcoal">
                      <SelectValue placeholder="All Positions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Positions</SelectItem>
                      <SelectItem value="skip">Skip</SelectItem>
                      <SelectItem value="third">Third</SelectItem>
                      <SelectItem value="second">Second</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="alternate">Alternate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Athletes Table */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  National Team Athletes ({filteredAthletes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Athlete</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>HP Center</TableHead>
                      <TableHead>Achievements</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAthletes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-brand-text-secondary py-8">
                          No athletes found. Adjust your filters or search query.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAthletes.map(athlete => {
                        const team = teams.find(t => t.id === athlete.national_team_id);
                        return (
                          <AthleteRow
                            key={athlete.id}
                            athlete={athlete}
                            position={athlete.preferred_position || 'N/A'}
                            team={team?.display_name || 'N/A'}
                            hpCenter={getHPCenterName(athlete.hp_center_id)}
                            onViewProfile={handleViewProfile}
                          />
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* By Team Tab */}
          <TabsContent value="by_team" className="space-y-6">
            {teams.map(team => {
              const roster = getTeamRoster(team);
              const centerName = getHPCenterName(team.hp_center_id);
              
              return (
                <Card key={team.id} className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{team.display_name}</CardTitle>
                        <p className="text-brand-text-secondary mt-1">{team.season} Season</p>
                        {centerName && (
                          <div className="flex items-center gap-1 text-sm text-brand-text-secondary mt-2">
                            <MapPin className="w-4 h-4" />
                            Training at {centerName}
                          </div>
                        )}
                      </div>
                      {team.world_ranking && (
                        <Badge className="bg-brand-red text-white">
                          World Rank: #{team.world_ranking}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {roster.length === 0 ? (
                      <p className="text-brand-text-secondary py-4">Roster to be announced</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Athlete</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>HP Center</TableHead>
                            <TableHead>Achievements</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {roster.map(({ athlete, position }) => (
                            <AthleteRow
                              key={athlete.id}
                              athlete={athlete}
                              position={position}
                              team={team.display_name}
                              hpCenter={getHPCenterName(athlete.hp_center_id)}
                              onViewProfile={handleViewProfile}
                            />
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* HP Centers Tab */}
          <TabsContent value="hp_centers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hpCenters.map(center => {
                const centerAthletes = athletes.filter(a => a.hp_center_id === center.id);
                
                return (
                  <Card key={center.id} className="bg-brand-card-bg border-brand-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-brand-red" />
                        {center.name}
                      </CardTitle>
                      <p className="text-brand-text-secondary">
                        {center.location.city}, {center.location.province}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-brand-text-primary mb-2">Athletes Training Here</h4>
                        <Badge variant="outline">{centerAthletes.length} National Team Athletes</Badge>
                      </div>
                      
                      {center.facilities && (
                        <div>
                          <h4 className="font-semibold text-brand-text-primary mb-2">Facilities</h4>
                          <div className="flex flex-wrap gap-2">
                            {center.facilities.num_sheets && (
                              <Badge variant="outline">{center.facilities.num_sheets} Sheets</Badge>
                            )}
                            {center.facilities.gym && <Badge variant="outline">Gym</Badge>}
                            {center.facilities.video_analysis && <Badge variant="outline">Video Analysis</Badge>}
                            {center.facilities.smart_broom_available && <Badge variant="outline">Smart Broom</Badge>}
                          </div>
                        </div>
                      )}

                      {center.description && (
                        <p className="text-sm text-brand-text-secondary">{center.description}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}