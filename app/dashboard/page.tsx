/**
 * Dashboard page for Template App
 * Displays the main dashboard interface for authenticated users
 * Features a sidebar navigation and content area
 * Requires a paid membership to access
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Welcome to your Curling Canada dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Track your events, teams, and loyalty rewards all in one place.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>
              Your recent activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>No recent activity found.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Stats</CardTitle>
            <CardDescription>
              Your account statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>All systems operational.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 