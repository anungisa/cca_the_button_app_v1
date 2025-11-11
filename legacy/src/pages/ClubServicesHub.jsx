import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, ClipboardList, BarChart2, Library, ShieldCheck, LifeBuoy } from 'lucide-react';
import ClubHealthDashboard from '@/components/staffhq/clubs/ClubHealthDashboard';
import ClubOnboardingTracker from '@/components/staffhq/clubs/ClubOnboardingTracker';
import SurveyAnalytics from '@/pages/SurveyAnalytics'; // Re-using existing page component
import ClubResourceLibrary from '@/components/staffhq/clubs/ClubResourceLibrary';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

export default function ClubServicesHub() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2, component: <ClubHealthDashboard /> },
    { id: 'onboarding', label: 'Onboarding', icon: ClipboardList, component: <ClubOnboardingTracker /> },
    { id: 'surveys', label: 'Survey Analytics', icon: ShieldCheck, component: <SurveyAnalytics /> },
    { id: 'resources', label: 'Resource Library', icon: Library, component: <ClubResourceLibrary /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building className="w-8 h-8 text-brand-red" />
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">Club Services Hub</h2>
            <p className="text-brand-text-secondary">Manage club onboarding, support, and engagement.</p>
          </div>
        </div>
        <Button asChild>
          <Link to={createPageUrl('Clubs')}>
            <LifeBuoy className="w-4 h-4 mr-2" />
            View Club Directory
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}