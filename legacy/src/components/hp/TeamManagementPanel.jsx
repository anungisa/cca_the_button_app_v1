import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Team } from '@/api/entities';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Users, Shield } from 'lucide-react';

export default function TeamManagementPanel() {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTeams = async () => {
      setIsLoading(true);
      try {
        const data = await Team.list();
        setTeams(data);
      } catch (error) {
        console.error("Failed to load teams:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTeams();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }
  
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Active High Performance Teams</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>MA Region</TableHead>
              <TableHead>Season</TableHead>
              <TableHead>Athletes</TableHead>
              <TableHead>Coaches</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map(team => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell>{team.ma_region}</TableCell>
                <TableCell>{team.season}</TableCell>
                <TableCell>{team.athlete_ids?.length || 0}</TableCell>
                <TableCell>{team.coach_ids?.length || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}