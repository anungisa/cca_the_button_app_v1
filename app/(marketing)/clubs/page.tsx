import { Suspense } from "react";
import { db } from "@/db/db";
import { clubs } from "@/db/schema/clubs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Globe, Users } from "lucide-react";

async function getClubs() {
  try {
    const allClubs = await db.select().from(clubs).orderBy(clubs.province, clubs.city);
    return allClubs;
  } catch (error) {
    console.error("Error fetching clubs:", error);
    return [];
  }
}

export default async function ClubsPage() {
  const allClubs = await getClubs();
  
  // Group clubs by province
  const clubsByProvince = allClubs.reduce((acc, club) => {
    const province = club.province || "Other";
    if (!acc[province]) {
      acc[province] = [];
    }
    acc[province].push(club);
    return acc;
  }, {} as Record<string, typeof allClubs>);

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Curling Clubs</h1>
          <p className="text-xl text-muted-foreground">
            Find curling clubs across Canada. Connect with your local curling community.
          </p>
        </div>

        {Object.entries(clubsByProvince).map(([province, provinceClubs]) => (
          <div key={province} className="space-y-4">
            <h2 className="text-2xl font-bold">{province}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {provinceClubs.map((club) => (
                <Card key={club.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{club.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {club.city}, {club.province}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {club.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {club.description}
                      </p>
                    )}
                    <div className="space-y-2 text-sm">
                      {club.numberOfSheets && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{club.numberOfSheets} sheets</span>
                        </div>
                      )}
                      {club.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a href={`tel:${club.phone}`} className="hover:underline">
                            {club.phone}
                          </a>
                        </div>
                      )}
                      {club.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={club.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline truncate"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {allClubs.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No clubs found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
