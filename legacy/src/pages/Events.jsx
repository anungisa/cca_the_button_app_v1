import React, { useState, useEffect, useMemo } from 'react';
import { Event } from '@/api/entities';
import { useEnhancedEntity } from '../components/hooks/useEnhancedEntity';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Loader2, Filter, RefreshCw, Plus } from 'lucide-react';
import EventCard from '../components/events/EventCard';
import EventFilters from '../components/events/EventFilters';
import EventDetailModal from '../components/events/EventDetailModal';
import CreateEventModal from '../components/events/CreateEventModal';
import RecommendedEventsCarousel from '../components/events/RecommendedEventsCarousel';
import { useXP } from '../components/XPContext';
import { usePermissions } from '../components/hooks/usePermissions';
import { format, isAfter, isBefore, parseISO } from 'date-fns';

export default function Events() {
  // ✅ USE REAL DATA with enhanced service
  const { 
    data: events, 
    isLoading, 
    error,
    create: createEvent,
    refresh: refreshEvents 
  } = useEnhancedEntity(Event, {
    autoLoad: true,
    sortBy: '-start_date',
    limit: 500,
    cacheTTL: 5
  });

  const { user } = useXP();
  const { permissions } = usePermissions();
  
  const [filters, setFilters] = useState({
    searchTerm: '',
    region: 'all',
    eventType: 'all',
    dateRange: 'upcoming'
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredEvents = useMemo(() => {
    let filtered = [...events];
    const now = new Date();

    // Date range filter
    if (filters.dateRange === 'upcoming') {
      filtered = filtered.filter(e => e.start_date && isAfter(parseISO(e.start_date), now));
    } else if (filters.dateRange === 'past') {
      filtered = filtered.filter(e => e.start_date && isBefore(parseISO(e.start_date), now));
    } else if (filters.dateRange === 'live') {
      filtered = filtered.filter(e => 
        e.start_date && e.end_date &&
        isAfter(now, parseISO(e.start_date)) && 
        isBefore(now, parseISO(e.end_date))
      );
    }

    // Search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(term) ||
        e.venue?.city?.toLowerCase().includes(term)
      );
    }

    // Region filter
    if (filters.region && filters.region !== 'all') {
      filtered = filtered.filter(e => 
        e.venue?.city?.includes(filters.region) ||
        e.ma_region === filters.region
      );
    }

    return filtered;
  }, [events, filters]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter(e => e.start_date && isAfter(parseISO(e.start_date), now))
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
      .slice(0, 6);
  }, [events]);

  const handleCreateEvent = async (eventData) => {
    try {
      const idempotencyKey = `create-event-${user.id}-${Date.now()}`;
      await createEvent(eventData, idempotencyKey);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error loading events: {error.message}</p>
        <Button onClick={refreshEvents}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Curling Events</h1>
          <p className="text-brand-text-secondary mt-1">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshEvents} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {permissions.canManageEvents && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          )}
        </div>
      </div>

      {upcomingEvents.length > 0 && (
        <RecommendedEventsCarousel events={upcomingEvents} />
      )}

      <EventFilters filters={filters} onFilterChange={setFilters} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-brand-card-bg animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => setSelectedEvent(event)}
            />
          ))}
        </div>
      )}

      {filteredEvents.length === 0 && !isLoading && (
        <div className="text-center py-12 text-brand-text-secondary">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-brand-text-primary mb-2">No events found</h3>
          <p className="text-sm">Try adjusting your filters or check back later.</p>
        </div>
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {showCreateModal && (
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateEvent}
        />
      )}
    </div>
  );
}