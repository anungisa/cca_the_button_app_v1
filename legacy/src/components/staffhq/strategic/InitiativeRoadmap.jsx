import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StrategicInitiative } from '@/api/entities';
import { StrategicGoal } from '@/api/entities';
import { Loader2, Plus } from 'lucide-react';

export default function InitiativeRoadmap() {
  const [initiatives, setInitiatives] = useState([]);
  const [goals, setGoals] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [initiativesData, goalsData] = await Promise.all([
          StrategicInitiative.list(),
          StrategicGoal.list()
        ]);
        setInitiatives(initiativesData);
        setGoals(goalsData.reduce((acc, goal) => {
          acc[goal.id] = goal;
          return acc;
        }, {}));
      } catch (error) {
        console.error("Failed to load strategic initiatives:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'completed': return 'bg-green-600';
      case 'on_hold': return 'bg-gray-500';
      default: return 'bg-red-600';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Strategic Initiatives</CardTitle>
          <Button><Plus className="w-4 h-4 mr-2" /> Add Initiative</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Initiative</TableHead>
              <TableHead>Strategic Goal</TableHead>
              <TableHead>Lead</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initiatives.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{goals[item.strategic_goal_id]?.title || 'N/A'}</TableCell>
                <TableCell>{item.lead_name}</TableCell>
                <TableCell>{new Date(item.start_date).toLocaleDateString()} - {new Date(item.end_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(item.status)}>{item.status.replace('_', ' ')}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}