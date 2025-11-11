import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User } from '@/api/entities';
import { Search, Eye, UserPlus, Filter } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function AthleteManagementPanel() {
  const [athletes, setAthletes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAthletes();
  }, []);

  const loadAthletes = async () => {
    setIsLoading(true);
    try {
      // Load all users with athlete or curler user_type
      const allUsers = await User.list('full_name');
      const athleteUsers = allUsers.filter(u => 
        u.user_type === 'athlete' || 
        u.user_type === 'curler' ||
        u.hp_pathway_stage !== 'none'
      );
      setAthletes(athleteUsers);
    } catch (error) {
      console.error('Failed to load athletes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAthletes = athletes.filter(athlete =>
    athlete.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-brand-text-secondary">Loading athletes...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Athlete Roster</CardTitle>
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Athlete
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
            <Input
              placeholder="Search athletes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-brand-charcoal border-brand-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredAthletes.map((athlete) => (
            <div
              key={athlete.id}
              className="flex items-center justify-between p-4 bg-brand-charcoal rounded-lg hover:bg-brand-charcoal/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-red/20 flex items-center justify-center">
                  <span className="text-brand-red font-semibold">
                    {athlete.full_name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-brand-text-primary">{athlete.full_name || 'Unknown'}</p>
                  <p className="text-sm text-brand-text-secondary">{athlete.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {athlete.hp_pathway_stage && athlete.hp_pathway_stage !== 'none' && (
                  <Badge variant="outline">
                    {athlete.hp_pathway_stage.replace('_', ' ')}
                  </Badge>
                )}
                <Link to={`${createPageUrl('CoachAthleteView')}?athleteId=${athlete.id}`}>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))}

          {filteredAthletes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-brand-text-secondary">
                {searchTerm ? 'No athletes found matching your search' : 'No athletes in your roster yet'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}