import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PlaceholderPageProps {
  title: string;
  description: string;
  message?: string;
}

export default function PlaceholderPage({ title, description, message }: PlaceholderPageProps) {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          <p className="text-xl text-muted-foreground">{description}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>This page is under construction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {message || "We're working hard to bring you this content. Check back soon for updates!"}
            </p>
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
