import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

const EventFilters = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-brand-text-secondary" />
        <span className="text-sm text-brand-text-secondary">Filter:</span>
      </div>
      
      <Select value={filters.eventType} onValueChange={(value) => handleFilterChange('eventType', value)}>
        <SelectTrigger className="w-40 bg-brand-card-bg border-brand-border">
          <SelectValue placeholder="Event Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="championship">Championships</SelectItem>
          <SelectItem value="provincial">Provincial</SelectItem>
          <SelectItem value="learn_to_curl">Learn to Curl</SelectItem>
          <SelectItem value="club">Club Events</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={filters.audience} onValueChange={(value) => handleFilterChange('audience', value)}>
        <SelectTrigger className="w-40 bg-brand-card-bg border-brand-border">
          <SelectValue placeholder="Audience" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Audiences</SelectItem>
          <SelectItem value="fans">Fans</SelectItem>
          <SelectItem value="athletes">Athletes</SelectItem>
          <SelectItem value="youth">Youth</SelectItem>
          <SelectItem value="families">Families</SelectItem>
          <SelectItem value="beginners">Beginners</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
        <SelectTrigger className="w-40 bg-brand-card-bg border-brand-border">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          <SelectItem value="bc">British Columbia</SelectItem>
          <SelectItem value="ab">Alberta</SelectItem>
          <SelectItem value="sk">Saskatchewan</SelectItem>
          <SelectItem value="mb">Manitoba</SelectItem>
          <SelectItem value="on">Ontario</SelectItem>
          <SelectItem value="qc">Quebec</SelectItem>
          <SelectItem value="nb">New Brunswick</SelectItem>
          <SelectItem value="ns">Nova Scotia</SelectItem>
          <SelectItem value="pe">Prince Edward Island</SelectItem>
          <SelectItem value="nl">Newfoundland</SelectItem>
          <SelectItem value="nt">Northwest Territories</SelectItem>
          <SelectItem value="nu">Nunavut</SelectItem>
          <SelectItem value="yt">Yukon</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
        <SelectTrigger className="w-40 bg-brand-card-bg border-brand-border">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Dates</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="this_week">This Week</SelectItem>
          <SelectItem value="this_month">This Month</SelectItem>
          <SelectItem value="next_month">Next Month</SelectItem>
          <SelectItem value="this_season">This Season</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EventFilters;