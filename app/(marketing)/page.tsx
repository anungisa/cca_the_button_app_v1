/**
 * Curling Canada Home Page - The Button Platform
 * Modern landing page for authenticated and non-authenticated users
 * Features hero section, quick actions, events, and community highlights
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  Building, 
  Calendar, 
  Video, 
  Users,
  Trophy,
  Star,
  Shield,
  TrendingUp,
  MapPin
} from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { CurlingCanadaHeader } from "@/components/curling-canada-header";
import { CurlingCanadaFooter } from "@/components/curling-canada-footer";

// Feature cards for landing page
const features = [
  {
    icon: Users,
    title: "Find Your Community",
    description: "Connect with curling clubs across Canada, register for events, and stay up-to-date with your local curling scene."
  },
  {
    icon: Star,
    title: "Granite Circle Rewards",
    description: "Earn points for everything you do—from watching live games to volunteering. Redeem for exclusive merchandise and experiences."
  },
  {
    icon: Trophy,
    title: "Performance Tracking",
    description: "Advanced tools for competitive athletes including shot tracking and SmartBroom integration to analyze and improve your game."
  },
  {
    icon: Shield,
    title: "Safe Sport Commitment",
    description: "Access resources, manage certifications, and find help through our integrated Safe Sport hub for a safe environment."
  }
];

// Quick stats
const stats = [
  { value: "1M+", label: "Canadians Curl" },
  { value: "700+", label: "Curling Clubs" },
  { value: "1959", label: "Founded" },
  { value: "100K+", label: "Active Members" }
];

// Quick actions for authenticated users
const quickActions = [
  { name: "Find a Club", href: "/clubs", icon: Building, color: "bg-curling-blue-600" },
  { name: "Upcoming Events", href: "/events", icon: Calendar, color: "bg-curling-red-600" },
  { name: "Watch Live", href: "/live", icon: Video, color: "bg-curling-gold-600" },
  { name: "My Dashboard", href: "/dashboard", icon: TrendingUp, color: "bg-curling-blue-700" }
];

export default async function HomePage() {
  const { userId } = auth();
  const isAuthenticated = !!userId;

  if (isAuthenticated) {
    // Show dashboard for authenticated users
    return (
      <div className="flex flex-col min-h-screen">
        <CurlingCanadaHeader />
        
        <main className="flex-1">
          {/* Welcome Banner */}
          <section className="bg-gradient-to-r from-curling-red-600 to-curling-red-700 text-white py-12">
            <div className="container">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back!</h1>
              <p className="text-lg opacity-90">Your curling community awaits</p>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="py-12">
            <div className="container">
              <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.name} href={action.href}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardHeader>
                          <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <CardTitle className="text-lg">{action.name}</CardTitle>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Upcoming Events */}
          <section className="py-12 bg-muted/50">
            <div className="container">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
                <Button variant="outline" asChild>
                  <Link href="/events">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">Event Title {i}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-2">
                            <Calendar className="h-4 w-4" />
                            <span>Nov 15-17, 2025</span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Toronto Curling Club</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>

        <CurlingCanadaFooter />
      </div>
    );
  }

  // Landing page for non-authenticated users
  return (
    <div className="flex flex-col min-h-screen">
      <CurlingCanadaHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-curling-red-50 to-white dark:from-gray-900 dark:to-background py-24 sm:py-32">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-8 flex justify-center">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-curling-red-500 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-white"></div>
                  </div>
                  <div className="text-left">
                    <h1 className="text-3xl font-bold">
                      <span className="text-curling-red-600">Curling</span>{" "}
                      <span className="text-curling-blue-600">Canada</span>
                    </h1>
                    <p className="text-sm text-muted-foreground">The Button</p>
                  </div>
                </div>
              </div>
              
              <h2 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                Your Digital Hub for Canadian Curling
              </h2>
              
              <p className="text-xl leading-8 text-muted-foreground mb-10">
                Connect with clubs, track events, watch live streams, and get rewarded for your passion. 
                Join over 100,000 curlers across Canada.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" asChild className="bg-curling-red-600 hover:bg-curling-red-700">
                  <Link href="/sign-up">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 sm:py-32">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-curling-red-600">Everything Curling</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                One community, one platform
              </p>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                The Button integrates every part of your curling journey, from finding your first club to tracking high-performance stats.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="border-2 hover:border-curling-red-300 transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 bg-curling-red-100 dark:bg-curling-red-900/20 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-curling-red-600" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-gradient-to-r from-curling-red-600 to-curling-blue-600 text-white">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container">
            <Card className="bg-gradient-to-r from-curling-red-50 to-curling-blue-50 dark:from-gray-900 dark:to-gray-800 border-2">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Join the Community?</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Create your account today and start connecting with curlers across Canada. 
                  Earn rewards, track your progress, and be part of something special.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="bg-curling-red-600 hover:bg-curling-red-700">
                    <Link href="/sign-up">Sign Up Free</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/clubs">Find a Club Near You</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <CurlingCanadaFooter />
      <CurlingCanadaFooter />
    </div>
  );
}
