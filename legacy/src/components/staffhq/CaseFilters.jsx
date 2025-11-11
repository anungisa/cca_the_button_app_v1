import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

export default function CaseFilters({ filters, setFilters, staffList }) {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-brand-charcoal rounded-lg border border-brand-border">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
        <Input
          placeholder="Search by title or club name..."
          className="pl-9 bg-brand-card-bg border-brand-border"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 md:flex gap-4">
        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger className="w-full md:w-[150px] bg-brand-card-bg border-brand-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
          <SelectTrigger className="w-full md:w-[150px] bg-brand-card-bg border-brand-border">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.assigned_staff_name} onValueChange={(value) => handleFilterChange('assigned_staff_name', value)}>
          <SelectTrigger className="w-full md:w-[180px] bg-brand-card-bg border-brand-border">
            <SelectValue placeholder="Assigned To" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Staff</SelectItem>
            {staffList.map(staff => (
              <SelectItem key={staff} value={staff}>{staff}</SelectItem>
            ))}
             <SelectItem value="unassigned">Unassigned</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}