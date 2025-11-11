
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { useXP } from '../components/XPContext';
import AthleteDashboard from '../components/hp/AthleteDashboard';
import CoachDashboard from '../components/hp/CoachDashboard';
import { Target, Clipboard, UserCheck, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PerformanceCenter = () => {
  const { user, isLoading } = useXP();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>Please log in to access the Performance Center.</p>
      </div>
    );
  }

  const userType = user.user_type;
  const isAdmin = user.role === 'admin';

  // If the user is an athlete, show the athlete dashboard directly
  if (userType === 'athlete') {
    return <AthleteDashboard user={user} />;
  }
  
  // If the user is a coach, show the coach dashboard directly
  if (userType === 'coach') {
    return <CoachDashboard user={user} />;
  }

  // If the user is an admin but not specifically an athlete or coach, show the admin view with tabs
  if (isAdmin) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-brand-text-primary">Performance Center</h1>
              <p className="text-brand-text-secondary">Administrator View</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="coach" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-brand-card-bg border-brand-border">
            <TabsTrigger value="coach" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Coach View
            </TabsTrigger>
            <TabsTrigger value="athlete" className="flex items-center gap-2">
              <Clipboard className="w-4 h-4" />
              Athlete View
            </TabsTrigger>
          </TabsList>
          <TabsContent value="coach" className="mt-6">
            <CoachDashboard user={user} isAdminView={true} />
          </TabsContent>
          <TabsContent value="athlete" className="mt-6">
            <AthleteDashboard user={user} isAdminView={true} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Fallback for any other user type that is not athlete, coach, or admin
  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">Performance Center</h1>
            <p className="text-brand-text-secondary">High-performance tools for athletes and coaches.</p>
          </div>
        </div>
        <div className="p-8 text-center bg-brand-card-bg rounded-lg border-brand-border">
          <p className="text-brand-text-secondary">Your role ({userType}) does not have access to a specialized performance dashboard.</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCenter;
