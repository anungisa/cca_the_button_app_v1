import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, AlertCircle } from 'lucide-react';

const MyTeamworksCalendar = ({ sessions, onSessionClick }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getSessionTypeColor = (type) => {
    switch (type) {
      case 'training': return 'border-l-blue-500 bg-blue-900/10';
      case 'travel': return 'border-l-green-500 bg-green-900/10';
      case 'event': return 'border-l-red-500 bg-red-900/10';
      case 'meeting': return 'border-l-purple-500 bg-purple-900/10';
      default: return 'border-l-gray-500 bg-gray-900/10';
    }
  };

  const groupSessionsByDate = (sessions) => {
    const grouped = {};
    sessions.forEach(session => {
      const date = new Date(session.start_time).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(session);
    });
    return grouped;
  };

  const groupedSessions = groupSessionsByDate(sessions || []);

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          Schedule Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedSessions)
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .slice(0, 7) // Show next 7 days
            .map(([date, dateSessions]) => (
              <div key={date} className="space-y-2">
                <h4 className="font-semibold text-brand-text-primary border-b border-brand-border pb-1">
                  {new Date(date).toLocaleDateString('en-CA', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h4>
                
                {dateSessions.map(session => (
                  <div
                    key={session.id}
                    className={`p-3 rounded-lg border-l-4 cursor-pointer hover:bg-brand-charcoal/30 transition-colors ${getSessionTypeColor(session.type)}`}
                    onClick={() => onSessionClick && onSessionClick(session)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-brand-text-primary">{session.title}</h5>
                          {session.has_conflict && (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-brand-text-secondary">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(session.start_time).toLocaleTimeString('en-CA', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                              -
                              {new Date(session.end_time).toLocaleTimeString('en-CA', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          
                          {session.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{session.location}</span>
                            </div>
                          )}
                          
                          {session.coach && (
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{session.coach}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={`text-xs ${
                          session.type === 'training' ? 'bg-blue-900/50 text-blue-300' :
                          session.type === 'travel' ? 'bg-green-900/50 text-green-300' :
                          session.type === 'event' ? 'bg-red-900/50 text-red-300' :
                          'bg-purple-900/50 text-purple-300'
                        }`}>
                          {session.type}
                        </Badge>
                        
                        {session.smart_broom_enabled && (
                          <Badge className="bg-amber-900/50 text-amber-300 text-xs">
                            Smart Broom
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          
          {Object.keys(groupedSessions).length === 0 && (
            <div className="text-center py-8 text-brand-text-secondary">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming sessions scheduled</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MyTeamworksCalendar;