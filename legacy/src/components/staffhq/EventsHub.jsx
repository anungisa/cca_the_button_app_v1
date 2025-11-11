import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, ClipboardList, Plus, FileText, Loader2 } from 'lucide-react';
import EventPlanningDashboard from './eventops/EventPlanningDashboard';
const EventTemplateManager = React.lazy(() => import('./eventops/EventTemplateManager'));

export default function EventsHub() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-brand-red" />
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">Event Operations</h2>
            <p className="text-brand-text-secondary">Plan, execute, and review all event operations from a central hub.</p>
          </div>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">
            <ClipboardList className="w-4 h-4 mr-2" />
            Event Plans
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="w-4 h-4 mr-2" />
            Plan Templates
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-6">
          <EventPlanningDashboard />
        </TabsContent>
        <TabsContent value="templates" className="mt-6">
          <React.Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
            <EventTemplateManager />
          </React.Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}