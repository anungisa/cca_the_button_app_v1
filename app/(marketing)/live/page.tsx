import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LivePage() {
  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Live Streams</h1>
          <p className="text-xl text-muted-foreground">
            Watch curling events live from across Canada.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>No Live Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              There are no live streams currently available. Check back during event days!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
