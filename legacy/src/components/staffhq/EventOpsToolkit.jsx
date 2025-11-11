import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, CheckSquare, MapPin, Loader2 } from 'lucide-react';
import EventPlanningDashboard from './eventops/EventPlanningDashboard';
import VolunteerCoordination from './eventops/VolunteerCoordination';

export default function EventOpsToolkit() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEventData = async () => {
      try {
        // Mock data for now - in real app would fetch from Event entity
        setTimeout(() => {
          setUpcomingEvents([
            { id: 1, name: 'Provincial Championships', date: '2024-02-15', location: 'Toronto', status: 'planning' },
            { id: 2, name: 'Youth Development Camp', date: '2024-03-01', location: 'Calgary', status: 'confirmed' },
            { id: 3, name: 'Masters Tournament', date: '2024-03-15', location: 'Vancouver', status: 'planning' }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading event data:', error);
        setUpcomingEvents([]);
        setIsLoading(false);
      }
    };

    loadEventData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-text-primary">Event Operations Toolkit</h2>
        <p className="text-brand-text-secondary">Comprehensive event planning and execution tools.</p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-brand-card-bg">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-brand-text-secondary">Upcoming Events</p>
                    <p className="text-2xl font-bold text-brand-text-primary">{upcomingEvents?.length || 0}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-brand-red" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-brand-text-secondary">Active Volunteers</p>
                    <p className="text-2xl font-bold text-brand-text-primary">147</p>
                  </div>
                  <Users className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-brand-text-secondary">Tasks Pending</p>
                    <p className="text-2xl font-bold text-brand-text-primary">23</p>
                  </div>
                  <CheckSquare className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-brand-charcoal/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-brand-red" />
                        <div>
                          <h4 className="font-semibold text-brand-text-primary">{event.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-brand-text-secondary">
                            <span>{event.date}</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {event.status}
                        </span>
                        <Button size="sm">Manage</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-brand-text-secondary text-center py-8">No upcoming events scheduled</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning">
          <EventPlanningDashboard />
        </TabsContent>

        <TabsContent value="volunteers">
          <VolunteerCoordination />
        </TabsContent>

        <TabsContent value="logistics">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Logistics Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brand-text-secondary">Logistics management tools coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}