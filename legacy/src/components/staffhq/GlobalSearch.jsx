
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, User, FileText, Calendar, Building2, ChevronRight, X } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Import entities directly
import { User as StaffUser } from '@/api/entities';
import { Case } from '@/api/entities/Case';
import { Event } from '@/api/entities';
import { Club } from '@/api/entities';

const ResultCard = ({ title, items, icon: Icon, type }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-text-primary">
          <Icon className="w-5 h-5" />
          {title} ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.slice(0, 5).map((item) => (
          <ResultItem key={item.id} item={item} type={type} />
        ))}
        {items.length > 5 && (
          <Button variant="link" asChild className="p-0 h-auto">
            <Link to={createPageUrl(`StaffHQ?hub=${type}`)}>View all {items.length} results</Link>
          </Button>
        )}
      </CardContent>
    </Card>
);

const ResultItem = ({ item, type }) => (
    <Link to={createPageUrl(`/${type}/${item.id}`)} className="block p-3 bg-brand-charcoal rounded-lg hover:bg-brand-border transition-colors">
        <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-brand-text-primary text-sm truncate">
                {type === 'users' ? item.full_name : item.name || item.case_title}
                </h4>
                <p className="text-xs text-brand-text-secondary truncate">
                {type === 'users' ? item.email :
                type === 'cases' ? `ID: ${item.id}` :
                type === 'events' ? new Date(item.start_date).toLocaleDateString() :
                item.location?.city || `ID: ${item.id}`}
                </p>
            </div>
            <ChevronRight className="w-4 h-4 text-brand-text-secondary flex-shrink-0" />
        </div>
    </Link>
);

export default function GlobalSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const searchFilters = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'users', label: 'Users', icon: User },
    { id: 'cases', label: 'Cases', icon: FileText },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'clubs', label: 'Clubs', icon: Building2 },
  ];

  const performSearch = useMemo(() => async () => {
    if (searchTerm.length < 3) {
      setResults([]);
      return;
    }
    setIsLoading(true);

    // Safe search functions with error handling
    const filterMap = {
      users: async () => {
        try {
          // Check if StaffUser or its list method is undefined (e.g., during testing or if import failed silently)
          if (!StaffUser || typeof StaffUser.list !== 'function') {
            console.warn('StaffUser entity or list method not available.');
            return [];
          }
          const allUsers = await StaffUser.list();
          if (!Array.isArray(allUsers)) return [];
          return allUsers.filter(user => 
            (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        } catch (error) {
          console.error('Error fetching users:', error);
          return [];
        }
      },
      cases: async () => {
        try {
          if (!Case || typeof Case.list !== 'function') {
            console.warn('Case entity or list method not available.');
            return [];
          }
          const allCases = await Case.list();
          if (!Array.isArray(allCases)) return [];
          return allCases.filter(case_ => 
            (case_.case_title && case_.case_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (case_.description && case_.description.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        } catch (error) {
          console.error('Error fetching cases:', error);
          return [];
        }
      },
      events: async () => {
        try {
          if (!Event || typeof Event.list !== 'function') {
            console.warn('Event entity or list method not available.');
            return [];
          }
          const allEvents = await Event.list();
          if (!Array.isArray(allEvents)) return [];
          return allEvents.filter(event => 
            event.name && event.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        } catch (error) {
          console.error('Error fetching events:', error);
          return [];
        }
      },
      clubs: async () => {
        try {
          if (!Club || typeof Club.list !== 'function') {
            console.warn('Club entity or list method not available.');
            return [];
          }
          const allClubs = await Club.list();
          if (!Array.isArray(allClubs)) return [];
          return allClubs.filter(club => 
            (club.name && club.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (club.location?.city && club.location.city.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        } catch (error) {
          console.error('Error fetching clubs:', error);
          return [];
        }
      },
    };

    try {
      let searchResults = [];

      if (activeFilter === 'all') {
        const [users, cases, events, clubs] = await Promise.allSettled([
          filterMap.users(),
          filterMap.cases(),
          filterMap.events(),
          filterMap.clubs()
        ]);

        searchResults = [
          { type: 'users', data: users.status === 'fulfilled' ? users.value : [] },
          { type: 'cases', data: cases.status === 'fulfilled' ? cases.value : [] },
          { type: 'events', data: events.status === 'fulfilled' ? events.value : [] },
          { type: 'clubs', data: clubs.status === 'fulfilled' ? clubs.value : [] }
        ].filter(result => result.data.length > 0);
      } else {
        const data = await filterMap[activeFilter]();
        if (data.length > 0) {
          searchResults = [{ type: activeFilter, data }];
        }
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, activeFilter]);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }
    const delayedSearch = setTimeout(performSearch, 300);
    return () => clearTimeout(delayedSearch);
  }, [performSearch, searchTerm]);

  // Clear search when closing popover
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-brand-text-secondary">
          <Search className="w-5 h-5" />
          <span className="sr-only">Search</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-screen max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 border-brand-border bg-brand-charcoal">
        <div className="p-4 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-5 h-5" />
            <Input
              placeholder="Search users, cases, events, clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-brand-card-bg border-brand-border text-brand-text-primary h-12"
              autoFocus
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {searchFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  activeFilter === filter.id 
                    ? 'bg-brand-red text-white' 
                    : 'bg-brand-card-bg border-brand-border text-brand-text-secondary hover:text-brand-text-primary'
                }`}
              >
                <filter.icon className="w-4 h-4" />
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto"></div>
              <p className="text-brand-text-secondary mt-2">Searching...</p>
            </div>
          )}

          {!isLoading && searchTerm.length >= 3 && results.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
              <p className="text-brand-text-primary font-medium">No results found</p>
              <p className="text-brand-text-secondary">Try different search terms or filters</p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {results.map((result) => (
                <ResultCard
                  key={result.type}
                  title={searchFilters.find(f => f.id === result.type)?.label || result.type}
                  items={result.data}
                  icon={searchFilters.find(f => f.id === result.type)?.icon || Search}
                  type={result.type}
                />
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
