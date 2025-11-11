import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeamsPage() {
  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Teams</h1>
          <p className="text-xl text-muted-foreground">
            Browse curling teams and rankings across Canada.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Team listings and rankings will be available soon. Check back later!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
