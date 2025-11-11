import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CoachPerformanceLog } from '@/api/entities';
import { User } from '@/api/entities';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

const CoachPerformanceDashboard = () => {
  const [coachStats, setCoachStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCoachData();
  }, []);

  const fetchCoachData = async () => {
    setIsLoading(true);
    try {
      // In a real app, you'd aggregate this data in the backend. Here we simulate it.
      const coaches = await User.filter({ user_type: 'coach' });
      const performanceLogs = await CoachPerformanceLog.list();

      const stats = coaches.map(coach => {
        const logs = (performanceLogs || []).filter(log => log.coach_id === coach.id);
        const totalGames = logs.reduce((sum, log) => sum + log.games_logged, 0);
        const totalShots = logs.reduce((sum, log) => sum + log.shots_logged, 0);
        const avgMatchRate = logs.length > 0 ? logs.reduce((sum, log) => sum + log.average_match_rate, 0) / logs.length : 0;
        
        return {
          ...coach,
          totalGames,
          totalShots,
          avgMatchRate,
        };
      });
      setCoachStats(stats);
    } catch (error) {
      console.error("Error fetching coach performance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Coach Performance</CardTitle>
        <p className="text-brand-text-secondary">Tracking coaching activity and data logging performance.</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Coach</TableHead>
              <TableHead>Games Logged</TableHead>
              <TableHead>Shots Logged</TableHead>
              <TableHead>Avg. Match Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coachStats.map(coach => (
              <TableRow key={coach.id}>
                <TableCell className="font-medium">
                   <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={coach.profile_image_url} />
                      <AvatarFallback>{coach.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{coach.full_name}</span>
                  </div>
                </TableCell>
                <TableCell>{coach.totalGames}</TableCell>
                <TableCell>{coach.totalShots.toLocaleString()}</TableCell>
                <TableCell>{coach.avgMatchRate.toFixed(2)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CoachPerformanceDashboard;