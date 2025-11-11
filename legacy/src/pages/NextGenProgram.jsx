import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, Target, Award, Calendar, MapPin, User, 
  ArrowRight, CheckCircle, Clock, AlertCircle, Filter,
  Search, BarChart3, Star, Trophy, Users
} from 'lucide-react';
import { User as UserEntity, NextGenAthlete, Achievement } from '@/api/entities';
import { usePermissions } from '../components/hooks/usePermissions';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

const PathwayStageIndicator = ({ stage }) => {
  const stages = [
    { key: 'club_level', label: 'Club', color: 'bg-gray-500' },
    { key: 'provincial', label: 'Provincial', color: 'bg-blue-500' },
    { key: 'nextgen', label: 'NextGen', color: 'bg-purple-500' },
    { key: 'national_pool', label: 'National Pool', color: 'bg-amber-500' },
    { key: 'national_team', label: 'National Team', color: 'bg-brand-red' }
  ];

  const currentIndex = stages.findIndex(s => s.key === stage);

  return (
    <div className="flex items-center gap-2">
      {stages.map((s, index) => (
        <React.Fragment key={s.key}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index <= currentIndex ? s.color : 'bg-gray-700'
            } transition-all`}>
              {index < currentIndex ? (
                <CheckCircle className="w-5 h-5 text-white" />
              ) : index === currentIndex ? (
                <Clock className="w-5 h-5 text-white" />
              ) : (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <span className="text-xs text-brand-text-secondary mt-1">{s.label}</span>
          </div>
          {index < stages.length - 1 && (
            <div className={`h-1 w-8 ${index < currentIndex ? 'bg-green-500' : 'bg-gray-700'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const AthleteCard = ({ athlete, nextGenData, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'graduated': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'national_pool': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <Card 
      className="bg-brand-card-bg border-brand-border hover:border-brand-red transition-all cursor-pointer"
      onClick={() => onClick(athlete)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center">
              {athlete.athlete_photo_url ? (
                <img src={athlete.athlete_photo_url} alt={athlete.full_name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-brand-red" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-brand-text-primary">{athlete.full_name}</h3>
              <p className="text-sm text-brand-text-secondary">{athlete.preferred_position || 'Position TBD'}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(nextGenData?.current_status)} border`}>
            {nextGenData?.current_status || 'Active'}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
            <MapPin className="w-4 h-4" />
            <span>{athlete.hp_center_id || athlete.home_club_name || 'No Center Assigned'}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
            <Calendar className="w-4 h-4" />
            <span>Joined: {nextGenData?.program_year || 'N/A'}</span>
          </div>

          {nextGenData?.assessment_scores && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="text-center">
                <div className="text-lg font-bold text-brand-text-primary">
                  {nextGenData.assessment_scores.technical_skills || '--'}
                </div>
                <div className="text-xs text-brand-text-secondary">Technical</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-brand-text-primary">
                  {nextGenData.assessment_scores.physical_fitness || '--'}
                </div>
                <div className="text-xs text-brand-text-secondary">Physical</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-brand-text-primary">
                  {nextGenData.assessment_scores.mental_performance || '--'}
                </div>
                <div className="text-xs text-brand-text-secondary">Mental</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function NextGenProgram() {
  const { permissions } = usePermissions();
  const [athletes, setAthletes] = useState([]);
  const [nextGenData, setNextGenData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');

  useEffect(() => {
    loadNextGenAthletes();
  }, []);

  const loadNextGenAthletes = async () => {
    setIsLoading(true);
    try {
      // Load athletes in NextGen pathway
      const athleteData = await UserEntity.filter({ hp_pathway_stage: 'nextgen' });
      setAthletes(athleteData);

      // Load NextGen program data
      const nextGenRecords = await NextGenAthlete.list();
      setNextGenData(nextGenRecords);
    } catch (error) {
      console.error('Error loading NextGen athletes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = athlete.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const athleteNextGenData = nextGenData.find(ng => ng.athlete_id === athlete.id);
    const matchesStatus = statusFilter === 'all' || athleteNextGenData?.current_status === statusFilter;
    const matchesRegion = regionFilter === 'all' || athlete.ma_region === regionFilter;
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const programStats = {
    total: athletes.length,
    active: nextGenData.filter(ng => ng.current_status === 'active').length,
    graduated: nextGenData.filter(ng => ng.current_status === 'graduated').length,
    nationalPool: nextGenData.filter(ng => ng.current_status === 'national_pool').length
  };

  return (
    <div className="min-h-screen bg-brand-charcoal p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-text-primary flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-brand-red" />
              NextGen Program
            </h1>
            <p className="text-brand-text-secondary mt-2">
              Development pathway for Canada's emerging elite athletes
            </p>
          </div>
          {permissions.canAccessHP && (
            <Button className="bg-brand-red hover:bg-red-700">
              <Users className="w-4 h-4 mr-2" />
              Nominate Athlete
            </Button>
          )}
        </div>

        {/* Program Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-secondary">Total Athletes</p>
                  <p className="text-3xl font-bold text-brand-text-primary mt-1">{programStats.total}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-secondary">Active</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">{programStats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-secondary">National Pool</p>
                  <p className="text-3xl font-bold text-amber-400 mt-1">{programStats.nationalPool}</p>
                </div>
                <Star className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-secondary">Graduated</p>
                  <p className="text-3xl font-bold text-blue-400 mt-1">{programStats.graduated}</p>
                </div>
                <Trophy className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                <Input
                  placeholder="Search athletes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                  <SelectItem value="national_pool">National Pool</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="AB">Alberta</SelectItem>
                  <SelectItem value="BC">British Columbia</SelectItem>
                  <SelectItem value="MB">Manitoba</SelectItem>
                  <SelectItem value="NB">New Brunswick</SelectItem>
                  <SelectItem value="NL">Newfoundland</SelectItem>
                  <SelectItem value="NT">Northwest Territories</SelectItem>
                  <SelectItem value="NS">Nova Scotia</SelectItem>
                  <SelectItem value="NU">Nunavut</SelectItem>
                  <SelectItem value="ON">Ontario</SelectItem>
                  <SelectItem value="PE">Prince Edward Island</SelectItem>
                  <SelectItem value="QC">Quebec</SelectItem>
                  <SelectItem value="SK">Saskatchewan</SelectItem>
                  <SelectItem value="YT">Yukon</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={loadNextGenAthletes}>
                <Filter className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Athletes Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full mx-auto" />
            <p className="text-brand-text-secondary mt-4">Loading athletes...</p>
          </div>
        ) : filteredAthletes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAthletes.map(athlete => {
              const athleteNextGenData = nextGenData.find(ng => ng.athlete_id === athlete.id);
              return (
                <AthleteCard
                  key={athlete.id}
                  athlete={athlete}
                  nextGenData={athleteNextGenData}
                  onClick={(a) => window.location.href = createPageUrl(`CoachAthleteView?athleteId=${a.id}`)}
                />
              );
            })}
          </div>
        ) : (
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
              <p className="text-brand-text-secondary">No athletes found matching your filters</p>
            </CardContent>
          </Card>
        )}

        {/* Program Information */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-red" />
              About NextGen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-brand-text-secondary">
              The NextGen Program is designed to identify and develop Canada's future national team athletes. 
              Athletes progress through systematic training, competition, and evaluation phases.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-brand-charcoal rounded-lg">
                <h4 className="font-bold text-brand-text-primary mb-2">Selection Criteria</h4>
                <ul className="text-sm text-brand-text-secondary space-y-1">
                  <li>• Age-appropriate competitive results</li>
                  <li>• Technical skill assessments</li>
                  <li>• Physical fitness standards</li>
                  <li>• Coach recommendations</li>
                  <li>• Mental performance evaluation</li>
                </ul>
              </div>
              <div className="p-4 bg-brand-charcoal rounded-lg">
                <h4 className="font-bold text-brand-text-primary mb-2">Program Benefits</h4>
                <ul className="text-sm text-brand-text-secondary space-y-1">
                  <li>• Access to HP Centers and coaches</li>
                  <li>• National team training camps</li>
                  <li>• Performance tracking and analytics</li>
                  <li>• Sport science support</li>
                  <li>• Pathway to National Team</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}