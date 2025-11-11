import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EventsRegisterPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Register for Events</h1>
          <p className="text-xl text-muted-foreground">
            Sign up for upcoming curling events.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please browse our events page and click on specific events to register.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
