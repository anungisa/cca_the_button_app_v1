
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, Users, Activity, PlusCircle } from 'lucide-react';
import { Team } from '@/api/entities';

const CoachDashboard = ({ user, isAdminView = false }) => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        let teamData;
        if (isAdminView) {
          // Fetch all teams for administrator view, ordered by creation date descending
          teamData = await Team.list('-created_date');
        } else {
          // Fetch teams associated with the current user (coach)
          teamData = await Team.filter({ coach_ids: { $in: [user.id] } });
        }
        setTeams(teamData);
      } catch (error) {
        console.error("Failed to load teams:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user, isAdminView]); // Re-run effect if user or isAdminView changes

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
          <UserCheck className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">
            {isAdminView ? 'All Teams Overview' : 'Coach Dashboard'}
          </h1>
          <p className="text-brand-text-secondary">
            {isAdminView ? `Viewing all teams as Administrator.` : `Manage your athletes and teams, ${user.full_name}.`}
          </p>
        </div>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Teams</CardTitle>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Team
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? <p>Loading teams...</p> : (
            <div className="space-y-4">
              {teams.map(team => (
                <div key={team.id} className="p-4 bg-brand-charcoal rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold text-brand-text-primary">{team.name}</p>
                    <p className="text-sm text-brand-text-secondary">{team.athlete_ids?.length || 0} athletes</p>
                  </div>
                  <Button variant="outline">Manage Team</Button>
                </div>
              ))}
              {teams.length === 0 && !isLoading && (
                <p className="text-brand-text-secondary">No teams found.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Recent Athlete Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-brand-text-secondary">A feed of recent logs and achievements from your athletes will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachDashboard;
