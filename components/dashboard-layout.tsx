"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, Users, Star, Settings, Menu, ChevronLeft, Trophy, Target, Database } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, description: "Overview and statistics" },
  { name: "My Events", href: "/dashboard/events", icon: Calendar, description: "Registrations and schedule" },
  { name: "My Teams", href: "/dashboard/teams", icon: Users, description: "Team management" },
  { name: "Loyalty", href: "/dashboard/loyalty", icon: Star, description: "Points and rewards" },
  { name: "Performance", href: "/dashboard/performance", icon: Trophy, description: "Stats and analytics" },
  { name: "Targets", href: "/dashboard/targets", icon: Target, description: "Goals and progress" },
  { name: "Data Source", href: "/dashboard/data-source", icon: Database, description: "Data management" },
  { name: "Members", href: "/dashboard/members", icon: Users, description: "Member directory" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, description: "Account preferences" },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname?.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-curling-red-600">
            <div className="h-6 w-6 rounded-full bg-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none">
                <span className="text-curling-red-600">Curling</span> <span className="text-curling-blue-600">Canada</span>
              </span>
              <span className="text-xs text-muted-foreground">The Button</span>
            </div>
          )}
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)}
              className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-muted/50",
                active ? "bg-curling-red-50 dark:bg-curling-red-950/50 text-curling-red-700 dark:text-curling-red-300" : "text-muted-foreground hover:text-foreground")}
              title={sidebarCollapsed ? item.name : undefined}>
              <Icon className={cn("h-5 w-5 shrink-0", active && "text-curling-red-600 dark:text-curling-red-400")} />
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  {active && <span className="text-xs text-muted-foreground">{item.description}</span>}
                </div>
              )}
              {active && <div className="ml-auto h-2 w-2 rounded-full bg-curling-red-600" />}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        {!sidebarCollapsed && (
          <Button variant="ghost" size="sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="w-full justify-start gap-2">
            <ChevronLeft className="h-4 w-4" /><span>Collapse sidebar</span>
          </Button>
        )}
        {sidebarCollapsed && (
          <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="w-full" title="Expand sidebar">
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className={cn("hidden lg:flex lg:flex-col border-r bg-background transition-all duration-300", sidebarCollapsed ? "lg:w-20" : "lg:w-64")}>
        <SidebarContent />
      </aside>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0"><SidebarContent /></SheetContent>
      </Sheet>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" /><span className="sr-only">Toggle sidebar</span>
              </Button>
            </SheetTrigger>
          </Sheet>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{navigation.find((item) => isActive(item.href))?.name || "Dashboard"}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild className="hidden md:flex"><Link href="/">View Site</Link></Button>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-9 w-9", userButtonPopoverCard: "shadow-xl" } }} />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-muted/50"><div className="container py-6">{children}</div></main>
      </div>
    </div>
  );
}