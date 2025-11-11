import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pledge } from '@/api/entities';
import { Check, X, Clock } from 'lucide-react';
import { format } from 'date-fns';
import WorkflowEngine from '../../utils/WorkflowEngine';

export default function PledgeManagementDashboard() {
  const [pledges, setPledges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPledges();
  }, []);

  const loadPledges = async () => {
    setIsLoading(true);
    try {
      const data = await Pledge.filter({ status: 'pending_review' }, '-created_date');
      setPledges(data);
    } catch (error) {
      console.error("Failed to load pledges:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecision = async (pledge, newStatus) => {
    try {
      await Pledge.update(pledge.id, { status: newStatus });
      
      if (newStatus === 'approved') {
        await WorkflowEngine.triggerWorkflow('pledge_approved', {
          pledge_id: pledge.id,
          user_id: pledge.user_id,
          pledge_type: pledge.pledge_type
        });
      }
      
      loadPledges(); // Refresh the list
    } catch (error) {
      console.error(`Failed to ${newStatus} pledge:`, error);
      alert(`Could not ${newStatus} pledge. Please try again.`);
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Pledge Moderation Queue</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? <p>Loading moderation queue...</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pledger</TableHead>
                <TableHead>Pledge Type</TableHead>
                <TableHead>Statement</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pledges.length > 0 ? pledges.map(pledge => (
                <TableRow key={pledge.id}>
                  <TableCell>
                    <div className="font-medium text-brand-text-primary">{pledge.name}</div>
                    <div className="text-sm text-brand-text-secondary">{pledge.province}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{pledge.pledge_type.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell className="max-w-sm">
                    <p className="truncate text-brand-text-secondary">{pledge.pledge_statement}</p>
                  </TableCell>
                  <TableCell>{format(new Date(pledge.created_date), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleDecision(pledge, 'approved')}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDecision(pledge, 'rejected')}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan="5" className="text-center h-24">
                    <div className="flex items-center justify-center gap-2 text-brand-text-secondary">
                      <Clock className="w-5 h-5" />
                      <span>Moderation queue is empty.</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}