
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MapPin, Globe, Users, Star, BarChart, CheckSquare, FileText } from 'lucide-react';
import { LocationService } from './LocationService';
import { provinces } from '../utils/provinces';

/**
 * @file ClubSearchFilters.js
 * @description A dedicated component for all club search and filtering logic.
 * This encapsulates filter state and UI, cleaning up the main Clubs page.
 */
export default function ClubSearchFilters({ onFilterChange, clubs, filters, showAdminFilters }) {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (filters.province && filters.province !== 'all' && clubs.length > 0) {
      const uniqueCities = [...new Set(clubs
        .filter(c => c.location?.province === filters.province && c.location?.city)
        .map(c => c.location.city)
      )].sort();
      setCities(uniqueCities);
    } else {
      setCities([]);
    }
  }, [filters.province, clubs]);

  const handleFilter = (key, value) => {
    onFilterChange(prev => ({ ...prev, [key]: value, city: key === 'province' ? 'all' : prev.city }));
  };

  const handleLocationSort = async () => {
    const locationData = await LocationService.getUserLocationAndNearbyClubs(clubs);
    onFilterChange(prev => ({ ...prev, sortBy: 'distance', locationData }));
  };
  
  // CRITICAL FIX: Ensure provinces is a valid array before rendering.
  const safeProvinces = Array.isArray(provinces) ? provinces : [];

  return (
    <div className="space-y-4 p-4 bg-brand-card-bg border border-brand-border rounded-lg">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
        <Input
          placeholder="Search by club name or city..."
          className="pl-10"
          value={filters.searchTerm}
          onChange={(e) => handleFilter('searchTerm', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Select value={filters.province} onValueChange={(value) => handleFilter('province', value)}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Provinces</SelectItem>
            {safeProvinces.map(p => <SelectItem key={p.abbreviation} value={p.abbreviation}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.city} onValueChange={(value) => handleFilter('city', value)} disabled={filters.province === 'all'}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.sortBy} onValueChange={(value) => value === 'distance' ? handleLocationSort() : handleFilter('sortBy', value)}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="members"><Users className="w-4 h-4 mr-2" />By Members</SelectItem>
            <SelectItem value="name"><FileText className="w-4 h-4 mr-2" />Alphabetical</SelectItem>
            <SelectItem value="distance"><MapPin className="w-4 h-4 mr-2" />Closest to Me</SelectItem>
            <SelectItem value="xp"><Star className="w-4 h-4 mr-2" />By Engagement</SelectItem>
          </SelectContent>
        </Select>
        
        {showAdminFilters && (
           <Select value={filters.clubStatus} onValueChange={(value) => handleFilter('clubStatus', value)}>
             <SelectTrigger>
               <div className="flex items-center gap-2">
                 <CheckSquare className="w-4 h-4" />
                 <SelectValue />
               </div>
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All Statuses</SelectItem>
               <SelectItem value="active">Active</SelectItem>
               <SelectItem value="pilot">Pilot</SelectItem>
               <SelectItem value="featured">Featured</SelectItem>
               <SelectItem value="at_risk">At Risk</SelectItem>
               <SelectItem value="inactive">Inactive</SelectItem>
               <SelectItem value="suspended">Suspended</SelectItem>
             </SelectContent>
           </Select>
        )}
      </div>
    </div>
  );
}
