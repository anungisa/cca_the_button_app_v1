import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Club } from '@/api/entities';
import { PredictiveAnalyticsEngine } from '../utils/PredictiveAnalyticsEngine';
import { Loader2, ArrowUp, ArrowDown, Minus } from 'lucide-react';

const HealthIndicator = ({ score }) => {
  const getHealthStyle = (s) => {
    if (s > 75) return { color: 'text-green-400', icon: <ArrowUp className="w-4 h-4" />, label: 'Healthy' };
    if (s > 45) return { color: 'text-yellow-400', icon: <Minus className="w-4 h-4" />, label: 'Stable' };
    if (s > 20) return { color: 'text-orange-400', icon: <ArrowDown className="w-4 h-4" />, label: 'At Risk' };
    return { color: 'text-red-500', icon: <ArrowDown className="w-4 h-4" />, label: 'Critical' };
  };
  const style = getHealthStyle(score);
  return (
    <div className={`flex items-center gap-2 ${style.color}`}>
      {style.icon}
      <span className="font-medium">{style.label} ({score})</span>
    </div>
  );
};

export default function ClubIntelligenceDashboard() {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClubData();
  }, []);

  const loadClubData = async () => {
    setIsLoading(true);
    try {
      const clubData = await Club.list('-created_date', 20); // Get latest 20 clubs
      const clubsWithHealth = await Promise.all(
        clubData.map(async (club) => {
          const health = await PredictiveAnalyticsEngine.getClubHealthScore(club);
          return { ...club, health };
        })
      );
      // Sort by health score, lowest first
      clubsWithHealth.sort((a, b) => a.health.score - b.health.score);
      setClubs(clubsWithHealth);
    } catch (error) {
      console.error("Failed to load club intelligence data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Club Health Overview</CardTitle>
        <p className="text-brand-text-secondary text-sm">Predictive health scores for clubs based on recent activity and survey data.</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Club Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Health Score</TableHead>
              <TableHead>Key Factors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clubs.map(club => (
              <TableRow key={club.id}>
                <TableCell className="font-medium text-brand-text-primary">{club.name}</TableCell>
                <TableCell><Badge variant="outline">{club.ma_region}</Badge></TableCell>
                <TableCell>
                  <HealthIndicator score={club.health.score} />
                </TableCell>
                <TableCell className="text-brand-text-secondary text-xs">{club.health.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}