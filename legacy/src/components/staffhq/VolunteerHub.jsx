import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ClipboardList, PlusCircle, ShieldCheck, TrendingUp } from 'lucide-react';

export default function VolunteerHub() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-brand-text-primary">Volunteer Hub</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> New Volunteer Campaign
        </Button>
      </div>
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
            <Users className="h-4 w-4 text-brand-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-brand-text-secondary">+5% this month</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Roles</CardTitle>
            <ClipboardList className="h-4 w-4 text-brand-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-brand-text-secondary">Across 4 events</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <ShieldCheck className="h-4 w-4 text-brand-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">98%</div>
            <p className="text-xs text-brand-text-secondary">Safe Sport compliant</p>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Volunteer Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage volunteer rosters, recruitment campaigns, and track volunteer hours, compliance, and incidents.</p>
        </CardContent>
      </Card>
    </div>
  );
}