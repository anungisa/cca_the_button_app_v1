
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Link2, 
  Users, 
  Calendar, 
  Building2, 
  ExternalLink, 
  Plus,
  Trash2,
  RefreshCw,
  Info
} from 'lucide-react';
import { Incident, Club, Event, User } from '@/api/entities';

export default function IntegrationPanel({ incident, onUpdate }) {
  const [linkedEntities, setLinkedEntities] = useState({
    clubs: [],
    events: [],
    users: [],
    relatedIncidents: []
  });
  const [searchResults, setSearchResults] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('club');
  const [isSearching, setIsSearching] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  const loadLinkedEntities = useCallback(async () => {
    if (!incident) {
      setLinkedEntities({ clubs: [], events: [], users: [], relatedIncidents: [] });
      return;
    }
    try {
      const linked = {
        clubs: [],
        events: [],
        users: [],
        relatedIncidents: []
      };

      // Load linked club if exists
      if (incident.club_id) {
        try {
          const club = await Club.get(incident.club_id);
          if (club) linked.clubs.push(club);
        } catch (error) {
          console.warn('Could not load linked club:', error);
        }
      }

      // Load linked event if exists
      if (incident.related_event_id) {
        try {
          const event = await Event.get(incident.related_event_id);
          if (event) linked.events.push(event);
        } catch (error) {
          console.warn('Could not load linked event:', error);
        }
      }

      // Load related user if exists
      if (incident.related_user_id) {
        try {
          const user = await User.get(incident.related_user_id);
          if (user) linked.users.push(user);
        } catch (error) {
          console.warn('Could not load linked user:', error);
        }
      }

      // Find related incidents (same club, category, or user)
      if (incident.club_id || incident.category) {
          try {
            const orClauses = [];
            if(incident.club_id) orClauses.push({ club_id: incident.club_id });
            if(incident.category) orClauses.push({ category: incident.category });

            const relatedIncidents = await Incident.filter({
              $or: orClauses
            }, '-created_date', 5);
            
            linked.relatedIncidents = relatedIncidents.filter(i => i.id !== incident.id);
          } catch (error) {
            console.warn('Could not load related incidents:', error);
          }
      }

      setLinkedEntities(linked);
    } catch (error) {
      console.error('Error loading linked entities:', error);
    }
  }, [incident]);

  useEffect(() => {
    loadLinkedEntities();
  }, [loadLinkedEntities]);

  const searchEntities = async () => {
    if (!incident || !searchTerm.trim()) return;

    setIsSearching(true);
    try {
      let results = [];

      switch (searchType) {
        case 'club':
          results = await Club.filter(
            { name: { $regex: searchTerm, $options: 'i' } },
            'name',
            10
          );
          break;
        case 'event':
          results = await Event.filter(
            { name: { $regex: searchTerm, $options: 'i' } },
            '-start_date',
            10
          );
          break;
        case 'user':
          results = await User.filter(
            { full_name: { $regex: searchTerm, $options: 'i' } },
            'full_name',
            10
          );
          break;
        case 'incident':
          results = await Incident.filter(
            { 
              title: { $regex: searchTerm, $options: 'i' },
              id: { $ne: incident.id }
            },
            '-created_date',
            10
          );
          break;
      }

      setSearchResults({ ...searchResults, [searchType]: results });
    } catch (error) {
      console.error('Error searching entities:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const linkEntity = async (entityType, entity) => {
    if (!incident) return;
    setIsLinking(true);
    try {
      let updateData = { ...incident };

      switch (entityType) {
        case 'club':
          updateData.club_id = entity.id;
          updateData.club_name = entity.name;
          break;
        case 'event':
          updateData.related_event_id = entity.id;
          break;
        case 'user':
          updateData.related_user_id = entity.id;
          break;
      }

      // Add to communications log
      updateData.communications_log = [
        ...(incident.communications_log || []),
        {
          date: new Date().toISOString(),
          author_name: 'System',
          note: `Linked ${entityType}: ${entity.name || entity.title || entity.full_name}`,
          channel: 'system_note'
        }
      ];

      await Incident.update(incident.id, updateData);
      onUpdate();
    } catch (error) {
      console.error('Error linking entity:', error);
      alert('Failed to link entity');
    } finally {
      setIsLinking(false);
    }
  };

  const unlinkEntity = async (entityType) => {
    if (!incident) return;
    setIsLinking(true);
    try {
      let updateData = { ...incident };

      switch (entityType) {
        case 'club':
          updateData.club_id = '';
          updateData.club_name = '';
          break;
        case 'event':
          updateData.related_event_id = '';
          break;
        case 'user':
          updateData.related_user_id = '';
          break;
      }

      // Add to communications log
      updateData.communications_log = [
        ...(incident.communications_log || []),
        {
          date: new Date().toISOString(),
          author_name: 'System',
          note: `Unlinked ${entityType}`,
          channel: 'system_note'
        }
      ];

      await Incident.update(incident.id, updateData);
      onUpdate();
    } catch (error) {
      console.error('Error unlinking entity:', error);
      alert('Failed to unlink entity');
    } finally {
      setIsLinking(false);
    }
  };

  const EntityCard = ({ entity, type, onUnlink }) => {
    const getEntityIcon = () => {
      switch (type) {
        case 'club': return Building2;
        case 'event': return Calendar;
        case 'user': return Users;
        case 'incident': return Link2;
        default: return Link2;
      }
    };

    const getEntityName = () => {
      return entity.name || entity.title || entity.full_name || 'Unknown';
    };

    const getEntityDetails = () => {
      switch (type) {
        case 'club':
          return entity.location?.city || 'No location';
        case 'event':
          return entity.start_date ? new Date(entity.start_date).toLocaleDateString() : 'No date';
        case 'user':
          return entity.email || 'No email';
        case 'incident':
          return entity.status || 'No status';
        default:
          return '';
      }
    };

    const EntityIcon = getEntityIcon();

    return (
      <div className="flex items-center justify-between p-3 bg-brand-charcoal/30 rounded-lg">
        <div className="flex items-center gap-3">
          <EntityIcon className="w-5 h-5 text-blue-400" />
          <div>
            <p className="font-medium text-brand-text-primary">{getEntityName()}</p>
            <p className="text-sm text-brand-text-secondary">{getEntityDetails()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" disabled={!incident}>
            <ExternalLink className="w-4 h-4" />
          </Button>
          {onUnlink && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onUnlink(type)}
              disabled={isLinking || !incident}
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (!incident) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-8 text-center">
          <Info className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-brand-text-primary">No Incident Selected</h3>
          <p className="text-brand-text-secondary mt-2">
            Please select an incident from the list to view and manage its linked entities.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Linked Entities */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-blue-400" />
              Linked Entities
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={loadLinkedEntities} disabled={!incident}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Linked Clubs */}
          {linkedEntities.clubs.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Clubs</h4>
              <div className="space-y-2">
                {linkedEntities.clubs.map((club) => (
                  <EntityCard
                    key={club.id}
                    entity={club}
                    type="club"
                    onUnlink={unlinkEntity}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Linked Events */}
          {linkedEntities.events.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Events</h4>
              <div className="space-y-2">
                {linkedEntities.events.map((event) => (
                  <EntityCard
                    key={event.id}
                    entity={event}
                    type="event"
                    onUnlink={unlinkEntity}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Linked Users */}
          {linkedEntities.users.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Related Users</h4>
              <div className="space-y-2">
                {linkedEntities.users.map((user) => (
                  <EntityCard
                    key={user.id}
                    entity={user}
                    type="user"
                    onUnlink={unlinkEntity}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Related Incidents */}
          {linkedEntities.relatedIncidents.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Related Incidents</h4>
              <div className="space-y-2">
                {linkedEntities.relatedIncidents.map((relatedIncident) => (
                  <EntityCard
                    key={relatedIncident.id}
                    entity={relatedIncident}
                    type="incident"
                  />
                ))}
              </div>
            </div>
          )}

          {Object.values(linkedEntities).every(arr => arr.length === 0) && (
            <p className="text-brand-text-secondary text-center py-4">
              No linked entities found
            </p>
          )}
        </CardContent>
      </Card>

      {/* Link New Entity */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-400" />
            Link New Entity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={searchType} onValueChange={setSearchType} disabled={!incident}>
              <SelectTrigger className="w-32 bg-brand-charcoal border-brand-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="club">Club</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="incident">Incident</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${searchType}s...`}
              className="flex-1 bg-brand-charcoal border-brand-border"
              disabled={!incident}
            />
            
            <Button onClick={searchEntities} disabled={isSearching || !incident}>
              {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Search'}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults[searchType]?.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Search Results</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {searchResults[searchType].map((entity) => (
                  <div key={entity.id} className="flex items-center justify-between p-3 bg-brand-charcoal/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-brand-text-primary">
                          {entity.name || entity.title || entity.full_name}
                        </p>
                        <p className="text-sm text-brand-text-secondary">
                          {searchType === 'club' && entity.location?.city}
                          {searchType === 'event' && entity.start_date && new Date(entity.start_date).toLocaleDateString()}
                          {searchType === 'user' && entity.email}
                          {searchType === 'incident' && entity.category}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => linkEntity(searchType, entity)}
                      disabled={isLinking || !incident}
                    >
                      Link
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
