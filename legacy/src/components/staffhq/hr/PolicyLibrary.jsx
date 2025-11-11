import React, { useState, useEffect } from 'react';
import { HRPolicy, PolicyAcknowledgment } from '@/api/entities'; // Assume combined entity access
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PolicyLibrary() {
  const [policies, setPolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const data = await HRPolicy.list();
        setPolicies(data);
      } catch (e) {
        console.error("Failed to load policies", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadPolicies();
  }, []);

  const getStatusBadge = (isActive) => (
    <Badge variant={isActive ? 'default' : 'destructive'} className={isActive ? 'bg-green-600' : 'bg-red-600'}>
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>HR Policy Library</CardTitle>
          <Button><Plus className="w-4 h-4 mr-2" />Add Policy</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Policy Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map(policy => (
              <TableRow key={policy.id}>
                <TableCell>{policy.title}</TableCell>
                <TableCell>{policy.policy_type}</TableCell>
                <TableCell>{policy.version}</TableCell>
                <TableCell>{new Date(policy.effective_date).toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(policy.is_active)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={policy.document_url} target="_blank" rel="noopener noreferrer"><Download className="w-4 h-4"/></a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}