import { Suspense } from "react";
import { db } from "@/db/db";
import { events } from "@/db/schema/events";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";
import Link from "next/link";
import { sql } from "drizzle-orm";

async function getEvents() {
  try {
    const allEvents = await db
      .select()
      .from(events)
      .where(sql`${events.isPublic} = true`)
      .orderBy(events.startDate);
    return allEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function EventsPage() {
  const allEvents = await getEvents();
  
  const now = new Date();
  const upcomingEvents = allEvents.filter(e => new Date(e.startDate) > now);
  const pastEvents = allEvents.filter(e => new Date(e.startDate) <= now);

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Curling Events</h1>
          <p className="text-xl text-muted-foreground">
            Discover and register for curling events across Canada.
          </p>
        </div>

        {/* Upcoming Events */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(event.startDate)}
                        </CardDescription>
                      </div>
                      <Badge variant={event.eventType === "competition" ? "default" : "secondary"}>
                        {event.eventType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {event.description}
                      </p>
                    )}
                    <div className="space-y-2 text-sm">
                      {(event.city || event.province) && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {event.city && event.province 
                              ? `${event.city}, ${event.province}`
                              : event.city || event.province || "Location TBA"}
                          </span>
                        </div>
                      )}
                      {event.maxParticipants && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {event.currentParticipants || 0} / {event.maxParticipants} registered
                          </span>
                        </div>
                      )}
                      {event.registrationFee && Number(event.registrationFee) > 0 && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>${event.registrationFee} {event.currency || "CAD"}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button asChild className="flex-1">
                        <Link href={`/events/${event.slug}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-2">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No upcoming events at this time.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Past Events</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.slice(0, 6).map((event) => (
                <Card key={event.id} className="opacity-75">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                    <CardDescription>{formatDate(event.startDate)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{event.status || "completed"}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
