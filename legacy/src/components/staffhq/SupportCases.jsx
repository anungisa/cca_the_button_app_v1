import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  MessageSquare,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Mail,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SupportCases() {
  const [cases, setCases] = useState([
    { id: 'SUP-001', clubName: 'Thunder Bay Curling Club', subject: 'Membership Sync Issue', status: 'open', priority: 'high', lastUpdate: '2 hours ago', assignedTo: 'Tech Support' },
    { id: 'SUP-002', clubName: 'Calgary Curling Club', subject: 'Survey access question', status: 'resolved', priority: 'low', lastUpdate: '1 day ago', assignedTo: 'Club Services' },
    { id: 'SUP-003', clubName: 'Halifax Mayflower Club', subject: 'Grant application help', status: 'in_progress', priority: 'medium', lastUpdate: '4 hours ago', assignedTo: 'Finance Team' },
    { id: 'SUP-004', clubName: 'Ottawa Curling Club', subject: 'Compliance question', status: 'open', priority: 'medium', lastUpdate: '5 hours ago', assignedTo: 'Governance' },
    { id: 'SUP-005', clubName: 'St. John\'s Curling Club', subject: 'Facility rental inquiry', status: 'new', priority: 'low', lastUpdate: '2 days ago', assignedTo: 'Unassigned' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredCases = cases.filter(c => {
    const searchMatch = c.clubName.toLowerCase().includes(searchTerm.toLowerCase()) || c.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'all' || c.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || c.priority === priorityFilter;
    return searchMatch && statusMatch && priorityMatch;
  });

  const getStatusBadge = (status) => {
    const config = {
      new: 'bg-blue-600',
      open: 'bg-yellow-600',
      in_progress: 'bg-purple-600',
      resolved: 'bg-green-600',
    };
    return <Badge className={`${config[status]} text-white capitalize`}>{status.replace('_', ' ')}</Badge>;
  };
  
  const getPriorityBadge = (priority) => {
    const config = {
      low: 'bg-gray-500',
      medium: 'bg-blue-500',
      high: 'bg-orange-500',
    };
    return <Badge className={`${config[priority]} text-white capitalize`}>{priority}</Badge>;
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Club Support Cases</CardTitle>
        <Button className="bg-brand-red hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          New Case
        </Button>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-brand-charcoal/50 rounded-lg">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <Input
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cases Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Club Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell className="font-medium">{caseItem.id}</TableCell>
                  <TableCell>{caseItem.clubName}</TableCell>
                  <TableCell className="max-w-xs truncate">{caseItem.subject}</TableCell>
                  <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                  <TableCell>{getPriorityBadge(caseItem.priority)}</TableCell>
                  <TableCell>{caseItem.lastUpdate}</TableCell>
                  <TableCell>{caseItem.assignedTo}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredCases.length === 0 && (
          <div className="text-center py-12 text-brand-text-secondary">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No support cases match your filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}