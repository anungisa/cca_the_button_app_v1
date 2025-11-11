
import React, { Suspense, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, Shield, Users, Radio, Megaphone, BarChart3, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Event } from '@/api/entities';
import { format } from 'date-fns';

// Lazy load components for performance
const EventPlanningDashboard = React.lazy(() => import('./EventPlanningDashboard'));
const VolunteerCommandCenter = React.lazy(() => import('./VolunteerCommandCenter'));
const ComplianceTracker = React.lazy(() => import('./ComplianceTracker'));
const LiveProductionConsole = React.lazy(() => import('./LiveProductionConsole'));
const CampaignBuilder = React.lazy(() => import('./CampaignBuilder'));
const UnifiedAnalytics = React.lazy(() => import('./UnifiedAnalytics'));

const LoadingFallback = () => (
    <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto mb-4"></div>
            <p className="text-brand-text-secondary">Loading Module...</p>
        </CardContent>
    </Card>
);

export default function EventOpsToolkit() {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Get eventId from URL params if provided
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('eventId');

        const loadEvents = async () => {
            try {
                // Assuming Event.list() returns a Promise of Event[]
                const eventList = await Event.list('-start_date');
                setEvents(eventList);

                // If eventId provided, select that event
                if (eventId) {
                    const targetEvent = eventList.find(e => e.id === eventId);
                    if (targetEvent) {
                        setSelectedEvent(targetEvent);
                    }
                }
            } catch (error) {
                console.error('Failed to load events:', error);
                // Optionally handle error state for UI
            } finally {
                setIsLoading(false);
            }
        };

        loadEvents();
    }, []); // Empty dependency array means this effect runs once on mount

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-brand-red" />
                <p className="ml-2 text-brand-text-secondary">Loading events...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text-primary">Event Operations Toolkit</h1>
                    <p className="text-brand-text-secondary">Comprehensive event management and volunteer coordination</p>
                </div>
                {selectedEvent && (
                    <Badge className="bg-brand-red text-white py-2 px-3 text-base">
                        Managing: {selectedEvent.name}
                    </Badge>
                )}
            </div>

            {!selectedEvent ? (
                <Card className="bg-brand-card-bg border-brand-border">
                    <CardHeader>
                        <CardTitle className="text-brand-text-primary">Select an Event</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3">
                            {events.length > 0 ? (
                                events.map(event => (
                                    <Button
                                        key={event.id}
                                        variant="outline"
                                        className="justify-start h-auto p-4 bg-brand-bg hover:bg-brand-card-bg border-brand-border"
                                        onClick={() => setSelectedEvent(event)}
                                    >
                                        <div className="text-left">
                                            <p className="font-medium text-brand-text-primary">{event.name}</p>
                                            <p className="text-sm text-brand-text-secondary">
                                                {format(new Date(event.start_date), 'MMM d, yyyy')} • {event.venue?.city || 'N/A'}
                                            </p>
                                        </div>
                                    </Button>
                                ))
                            ) : (
                                <p className="text-brand-text-secondary text-center">No events found. Please create one.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div>
                    <Button variant="outline" onClick={() => setSelectedEvent(null)} className="mb-6 bg-brand-bg hover:bg-brand-card-bg border-brand-border text-brand-text-primary">
                        ← Back to Event Selection
                    </Button>

                    <Tabs defaultValue="planning" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-brand-card-bg border-brand-border">
                            <TabsTrigger value="planning" className="flex items-center gap-2">
                                <CalendarCheck className="w-4 h-4" />
                                <span className="hidden sm:inline">Event Plans</span>
                                <span className="sm:hidden">Plans</span>
                            </TabsTrigger>
                            <TabsTrigger value="live" className="flex items-center gap-2">
                                <Radio className="w-4 h-4" />
                                <span className="hidden sm:inline">Live Production</span>
                                <span className="sm:hidden">Live</span>
                            </TabsTrigger>
                            <TabsTrigger value="volunteers" className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span className="hidden sm:inline">Volunteers</span>
                                <span className="sm:hidden">Vol.</span>
                            </TabsTrigger>
                            <TabsTrigger value="compliance" className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                <span className="hidden sm:inline">Compliance</span>
                                <span className="sm:hidden">Comp.</span>
                            </TabsTrigger>
                            <TabsTrigger value="campaigns" className="flex items-center gap-2">
                                <Megaphone className="w-4 h-4" />
                                <span className="hidden sm:inline">Campaigns</span>
                                <span className="sm:hidden">Camp.</span>
                            </TabsTrigger>
                            <TabsTrigger value="analytics" className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                <span className="hidden sm:inline">Analytics</span>
                                <span className="sm:hidden">Data</span>
                            </TabsTrigger>
                        </TabsList>

                        <Suspense fallback={<LoadingFallback />}>
                            <TabsContent value="planning" className="mt-6">
                                <EventPlanningDashboard event={selectedEvent} />
                            </TabsContent>

                            <TabsContent value="live" className="mt-6">
                                <LiveProductionConsole event={selectedEvent} />
                            </TabsContent>

                            <TabsContent value="volunteers" className="mt-6">
                                <VolunteerCommandCenter event={selectedEvent} />
                            </TabsContent>

                            <TabsContent value="compliance" className="mt-6">
                                <ComplianceTracker event={selectedEvent} />
                            </TabsContent>

                            <TabsContent value="campaigns" className="mt-6">
                                <CampaignBuilder event={selectedEvent} />
                            </TabsContent>

                            <TabsContent value="analytics" className="mt-6">
                                <UnifiedAnalytics event={selectedEvent} />
                            </TabsContent>
                        </Suspense>
                    </Tabs>
                </div>
            )}
        </div>
    );
}
