import React, { useState, useEffect } from 'react';
import { Club } from '@/api/entities';
import { Event } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Calendar, 
  Users, 
  TrendingUp,
  MapPin,
  BarChart3,
  FileText,
  Award
} from 'lucide-react';
import { usePermissions } from '../components/hooks/usePermissions';

const StatsCard = ({ title, value, subtitle, icon: Icon, color = "text-brand-text-primary" }) => (
  <Card className="bg-brand-card-bg border-brand-border">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-brand-text-secondary">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-brand-text-secondary">{subtitle}</p>}
        </div>
        <div className="p-2 rounded-lg bg-brand-charcoal">
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function MADashboard() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { hasPermission } = usePermissions();

  useEffect(() => {
    const loadMAData = async () => {
      try {
        const clubsData = await Club.list('name', 100);
        const eventsData = await Event.list('-start_date', 20);
        
        setClubs(clubsData || []);
        setEvents(eventsData || []);
      } catch (error) {
        console.error('Error loading MA data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMAData();
  }, []);

  if (!hasPermission('canViewMADashboard')) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-brand-text-secondary">You do not have permission to access the MA Dashboard.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading MA dashboard...</div>;
  }

  const regions = [...new Set(clubs.map(c => c.ma_region))].filter(Boolean);
  const filteredClubs = selectedRegion === 'all' ? clubs : clubs.filter(c => c.ma_region === selectedRegion);
  const totalMembers = filteredClubs.reduce((sum, club) => sum + (club.membership_count || 0), 0);
  const upcomingEvents = events.filter(e => new Date(e.start_date) > new Date()).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">MA Dashboard</h2>
          <p className="text-brand-text-secondary">Member Association overview and analytics</p>
        </div>
        
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {regions.map(region => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Clubs"
          value={filteredClubs.length}
          subtitle={selectedRegion === 'all' ? 'All regions' : selectedRegion}
          icon={Building2}
          color="text-blue-400"
        />
        <StatsCard
          title="Total Members"
          value={totalMembers.toLocaleString()}
          subtitle="Active members"
          icon={Users}
          color="text-green-400"
        />
        <StatsCard
          title="Upcoming Events"
          value={upcomingEvents}
          subtitle="Next 30 days"
          icon={Calendar}
          color="text-purple-400"
        />
        <StatsCard
          title="Avg Members/Club"
          value={Math.round(totalMembers / (filteredClubs.length || 1))}
          subtitle="Regional average"
          icon={TrendingUp}
          color="text-amber-400"
        />
      </div>

      {/* Regional Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Club Distribution by Region</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {regions.map(region => {
              const regionClubs = clubs.filter(c => c.ma_region === region);
              const regionMembers = regionClubs.reduce((sum, club) => sum + (club.membership_count || 0), 0);
              
              return (
                <div key={region} className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded">
                  <div>
                    <p className="font-medium text-brand-text-primary">{region}</p>
                    <p className="text-sm text-brand-text-secondary">
                      {regionClubs.length} clubs • {regionMembers.toLocaleString()} members
                    </p>
                  </div>
                  <Badge variant="outline">{Math.round(regionMembers / (regionClubs.length || 1))} avg</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {events.slice(0, 5).map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded">
                <div>
                  <p className="font-medium text-brand-text-primary">{event.name}</p>
                  <p className="text-sm text-brand-text-secondary">
                    {new Date(event.start_date).toLocaleDateString()} • {event.venue?.city}
                  </p>
                </div>
                <Badge variant={event.completed ? 'default' : 'secondary'}>
                  {event.completed ? 'Complete' : 'Upcoming'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}