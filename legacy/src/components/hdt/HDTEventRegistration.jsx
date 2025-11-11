import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Clock,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export default function HDTEventRegistration({ events, user }) {
  const [registeredEvents, setRegisteredEvents] = useState(new Set());

  const handleRegister = async (event) => {
    // In real implementation, would create registration record
    setRegisteredEvents(prev => new Set([...prev, event.id]));
    alert(`Successfully registered for ${event.name}!`);
  };

  const getEventStatusBadge = (event) => {
    const now = new Date();
    const startDate = new Date(event.start_date);
    const regDeadline = new Date(event.registration_deadline);
    
    if (now > startDate) {
      return <Badge className="bg-red-100 text-red-800">Completed</Badge>;
    } else if (now > regDeadline) {
      return <Badge className="bg-yellow-100 text-yellow-800">Registration Closed</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">Registration Open</Badge>;
    }
  };

  const isEligible = (event, userAge) => {
    // Simple age check - in real app would be more sophisticated
    return event.age_divisions.length === 0 || event.age_divisions.some(div => {
      const [min, max] = div.split('-').map(Number);
      return userAge >= min && userAge <= max;
    });
  };

  const upcomingEvents = events.filter(event => new Date(event.start_date) > new Date());
  const pastEvents = events.filter(event => new Date(event.start_date) <= new Date());

  return (
    <div className="space-y-6">
      {/* Upcoming Events */}
      <div>
        <h2 className="text-2xl font-bold text-brand-charcoal mb-6">Upcoming Events</h2>
        
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => {
              const isRegistered = registeredEvents.has(event.id);
              const canRegister = new Date() <= new Date(event.registration_deadline);
              
              return (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg mb-2">{event.name}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          {getEventStatusBadge(event)}
                          <Badge variant="outline" className="text-xs">
                            {event.event_type}
                          </Badge>
                        </div>
                      </div>
                      {isRegistered && (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>
                          {format(new Date(event.start_date), "MMM d, yyyy")}
                          {event.end_date !== event.start_date && (
                            <span> - {format(new Date(event.end_date), "MMM d, yyyy")}</span>
                          )}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{event.location.venue}, {event.location.city}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <span>
                          {event.registered_participants} / {event.max_participants || '∞'} registered
                        </span>
                      </div>
                      
                      {event.registration_fee > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                          <span>${event.registration_fee.toFixed(2)} registration fee</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span>
                          Registration closes {formatDistanceToNow(new Date(event.registration_deadline), { addSuffix: true })}
                        </span>
                      </div>
                      
                      {event.age_divisions.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-sm text-gray-600 mr-2">Age divisions:</span>
                          {event.age_divisions.map((division, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {division} years
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {event.prizes && event.prizes.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-4 h-4 text-amber-600" />
                            <span className="font-medium text-amber-900">Prizes & Rewards</span>
                          </div>
                          <ul className="text-sm text-amber-800 space-y-1">
                            {event.prizes.map((prize, idx) => (
                              <li key={idx}>
                                • {prize.description} 
                                {prize.points_reward && (
                                  <span className="font-medium"> (+{prize.points_reward} CurlPoints)</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                      {isRegistered ? (
                        <Button disabled className="w-full">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Registered
                        </Button>
                      ) : canRegister ? (
                        <Button 
                          onClick={() => handleRegister(event)}
                          className="w-full bg-brand-red hover:bg-red-700"
                        >
                          Register Now
                        </Button>
                      ) : (
                        <Button disabled className="w-full">
                          Registration Closed
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-brand-charcoal mb-2">No Upcoming Events</h3>
              <p className="text-gray-500">Check back soon for new Hit Draw Tap competitions!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-brand-charcoal mb-6">Past Events</h2>
          <div className="space-y-4">
            {pastEvents.map((event) => (
              <Card key={event.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-brand-charcoal">{event.name}</h3>
                      <p className="text-sm text-gray-600">
                        {format(new Date(event.start_date), "MMM d, yyyy")} • {event.location.city}
                      </p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}