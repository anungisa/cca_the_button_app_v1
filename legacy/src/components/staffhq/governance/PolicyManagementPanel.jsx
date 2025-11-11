import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GovernancePolicy } from '@/api/entities';
import { Search, Plus, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

export default function PolicyManagementPanel() {
  const [policies, setPolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const samplePolicies = [
      { id: 'gp_001', title: 'Conflict of Interest Policy', policy_category: 'board', approval_status: 'approved', next_review_date: '2025-01-15', version: '2.1' },
      { id: 'gp_002', title: 'MA Compliance Standards', policy_category: 'ma_requirements', approval_status: 'approved', next_review_date: '2024-09-30', version: '1.5' },
      { id: 'gp_003', title: 'Safe Sport Reporting Procedures', policy_category: 'national_standards', approval_status: 'review', next_review_date: '2024-08-01', version: '3.0' },
  ];

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    setIsLoading(true);
    try {
      const data = await GovernancePolicy.list('-effective_date');
      setPolicies(data.length > 0 ? data : samplePolicies);
    } catch (error) {
      console.error('Failed to load policies:', error);
      setPolicies(samplePolicies);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPolicies = policies.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Policy Binder</CardTitle>
        <div className="flex items-center gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                <Input placeholder="Search policies..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Button><Plus className="w-4 h-4 mr-2" /> New Policy</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Policy Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Next Review</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? ([...Array(3)].map((_, i) => (
                <TableRow key={i}><TableCell colSpan="6" className="p-4"><div className="h-8 bg-brand-charcoal rounded animate-pulse" /></TableCell></TableRow>
            ))) : filteredPolicies.map(policy => (
              <TableRow key={policy.id}>
                <TableCell className="font-medium text-brand-text-primary">{policy.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">{(policy.policy_category || '').replace(/_/g, ' ')}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={policy.approval_status === 'approved' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}>
                    {(policy.approval_status || 'draft').replace('_',' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  {policy.next_review_date ? format(new Date(policy.next_review_date), 'MMM d, yyyy') : 'TBD'}
                </TableCell>
                <TableCell>{policy.version || '1.0'}</TableCell>
                <TableCell><Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-1" /> View</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}