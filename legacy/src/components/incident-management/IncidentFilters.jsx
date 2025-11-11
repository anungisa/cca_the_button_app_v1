import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'general_inquiry', label: 'General Inquiry' },
  { value: 'club_support', label: 'Club Support' },
  { value: 'ma_inquiry', label: 'MA Inquiry' },
  { value: 'safe_sport', label: 'Safe Sport' },
  { value: 'technical_issue', label: 'Technical Issue' },
  { value: 'volunteer_issue', label: 'Volunteer Issue' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'feedback', label: 'Feedback' }
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'new', label: 'New' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'escalated', label: 'Escalated' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' }
];

const priorityOptions = [
  { value: 'all', label: 'All Priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' }
];

const departmentOptions = [
  { value: 'all', label: 'All Departments' },
  { value: 'club_services', label: 'Club Services' },
  { value: 'safe_sport', label: 'Safe Sport' },
  { value: 'events', label: 'Events' },
  { value: 'sponsorship', label: 'Sponsorship' },
  { value: 'tech', label: 'Tech' },
  { value: 'hr', label: 'HR' },
  { value: 'finance', label: 'Finance' },
  { value: 'executive', label: 'Executive' }
];

export default function IncidentFilters({ filters, onFiltersChange, activeFiltersCount }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      status: 'all',
      priority: 'all',
      category: 'all',
      assignedTo: 'all',
      department: 'all'
    });
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} active
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="bg-brand-charcoal border-brand-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
              <SelectTrigger className="bg-brand-charcoal border-brand-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="bg-brand-charcoal border-brand-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Department</label>
            <Select value={filters.department} onValueChange={(value) => handleFilterChange('department', value)}>
              <SelectTrigger className="bg-brand-charcoal border-brand-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}