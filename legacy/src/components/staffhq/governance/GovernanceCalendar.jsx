import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GovernanceMeeting } from '@/api/entities';
import { Calendar, Users, MapPin, Plus, Video } from 'lucide-react';

export default function GovernanceCalendar() {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMeetings = async () => {
      setIsLoading(true);
      try {
        const data = await GovernanceMeeting.list('-date');
        setMeetings(data);
      } catch (error) {
        console.error('Error loading meetings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMeetings();
  }, []);

  const getMeetingTypeColor = (type) => {
    switch (type) {
      case 'board_meeting': return 'bg-blue-600';
      case 'agm': return 'bg-purple-600';
      case 'committee_meeting': return 'bg-green-600';
      case 'executive_session': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-brand-text-primary">Meeting Center</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {meetings.map((meeting) => (
          <Card key={meeting.id} className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold text-brand-text-primary">
                    {meeting.meeting_title}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge className={`${getMeetingTypeColor(meeting.meeting_type)} text-white`}>
                      {meeting.meeting_type.replace(/_/g, ' ')}
                    </Badge>
                    <Badge className={`${getStatusColor(meeting.status)} text-white`}>
                      {meeting.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                <Calendar className="w-4 h-4" />
                <span>{new Date(meeting.date).toLocaleDateString()} at {new Date(meeting.date).toLocaleTimeString()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                <Users className="w-4 h-4" />
                <span>{meeting.committee.replace(/_/g, ' ')} Committee</span>
              </div>

              {meeting.location && (
                <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                  {meeting.location === 'Virtual' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                  <span>{meeting.location}</span>
                </div>
              )}

              {meeting.attendees && (
                <div className="mt-3">
                  <p className="text-xs text-brand-text-secondary mb-1">
                    Attendees ({meeting.attendees.filter(a => a.rsvp_status === 'attending').length}/{meeting.attendees.length})
                  </p>
                  <div className="flex -space-x-2">
                    {meeting.attendees.slice(0, 5).map((attendee, idx) => (
                      <div key={idx} className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-brand-charcoal">
                        {attendee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                    {meeting.attendees.length > 5 && (
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs border-2 border-brand-charcoal">
                        +{meeting.attendees.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">View Details</Button>
                {meeting.agenda_url && (
                  <Button variant="outline" size="sm">Agenda</Button>
                )}
                {meeting.minutes_url && (
                  <Button variant="outline" size="sm">Minutes</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}