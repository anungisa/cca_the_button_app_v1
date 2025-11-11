import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DocumentApproval } from '@/api/entities';
import { Search, Plus, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

export default function DocumentApprovalWorkflow() {
  const [approvals, setApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const sampleApprovals = [
    { id: 'da_001', document_title: 'FY2025 Annual Budget', document_type: 'report', workflow_stage: 'board_approval', submitted_by: 'Finance Dept', deadline: '2024-06-30' },
    { id: 'da_002', document_title: 'New Conflict of Interest Policy', document_type: 'policy', workflow_stage: 'completed', submitted_by: 'Legal Team', deadline: '2024-05-20' },
    { id: 'da_003', document_title: 'Q2 Board Meeting Minutes', document_type: 'minutes', workflow_stage: 'legal_review', submitted_by: 'Executive Assistant', deadline: '2024-07-10' },
    { id: 'da_004', document_title: 'Sponsorship Agreement - New Partner', document_type: 'contract', workflow_stage: 'draft', submitted_by: 'Sponsorship Team', deadline: '2024-07-15' },
  ];

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    setIsLoading(true);
    try {
      const data = await DocumentApproval.list('-submission_date');
      setApprovals(data.length > 0 ? data : sampleApprovals);
    } catch (e) {
      console.error("Failed to load document approvals:", e);
      setApprovals(sampleApprovals);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApprovals = approvals.filter(a => {
    const searchMatch = a.document_title.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'all' || a.workflow_stage === statusFilter;
    return searchMatch && statusMatch;
  });

  const getStatusBadge = (status) => {
    const config = {
      draft: { color: 'bg-gray-500' },
      legal_review: { color: 'bg-blue-500' },
      executive_review: { color: 'bg-purple-500' },
      board_approval: { color: 'bg-orange-500' },
      completed: { color: 'bg-green-600' },
    };
    const { color } = config[status] || { color: 'bg-gray-500' };
    return <Badge className={`${color} text-white capitalize`}>{(status || '').replace(/_/g, ' ')}</Badge>;
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Document Approval Workflow</CardTitle>
        <Button><Plus className="w-4 h-4 mr-2" /> New Request</Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4 p-4 bg-brand-charcoal/50 rounded-lg">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-56">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="legal_review">Legal Review</SelectItem>
              <SelectItem value="executive_review">Executive Review</SelectItem>
              <SelectItem value="board_approval">Board Approval</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Current Stage</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan="6" className="p-4"><div className="h-8 bg-brand-charcoal rounded animate-pulse" /></TableCell>
                </TableRow>
              ))
            ) : filteredApprovals.map(approval => (
              <TableRow key={approval.id}>
                <TableCell className="font-medium text-brand-text-primary">{approval.document_title}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{(approval.document_type || '').replace(/_/g, ' ')}</Badge></TableCell>
                <TableCell>{getStatusBadge(approval.workflow_stage)}</TableCell>
                <TableCell>{approval.submitted_by}</TableCell>
                <TableCell>{approval.deadline ? format(new Date(approval.deadline), 'MMM d, yyyy') : 'N/A'}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-1" /> View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}