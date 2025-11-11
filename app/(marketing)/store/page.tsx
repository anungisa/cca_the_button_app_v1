import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StorePage() {
  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Curling Canada Store</h1>
          <p className="text-xl text-muted-foreground">
            Official merchandise and equipment from Curling Canada.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Store Opening Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our online store is coming soon. Browse official Curling Canada merchandise, equipment, and apparel.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
