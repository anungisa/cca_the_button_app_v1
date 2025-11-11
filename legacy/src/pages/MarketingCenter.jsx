import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Megaphone, LayoutList, BookUser, CalendarClock, Library, BarChartHorizontal } from 'lucide-react';
import CampaignManager from '@/components/staffhq/marketing/CampaignManager';
import PressReleaseHub from '@/components/staffhq/marketing/PressReleaseHub';
import MediaContactsDB from '@/components/staffhq/marketing/MediaContactsDB';
import SocialSchedulingPanel from '@/components/staffhq/marketing/SocialSchedulingPanel';
import BrandLibrary from '@/components/staffhq/marketing/BrandLibrary';
import MediaAnalyticsDashboard from '@/components/staffhq/marketing/MediaAnalyticsDashboard';

export default function MarketingCenter() {
  const [activeTab, setActiveTab] = useState('campaigns');

  const tabs = [
    { id: 'campaigns', label: 'Campaigns', icon: LayoutList, component: <CampaignManager /> },
    { id: 'press', label: 'Press Releases', icon: Megaphone, component: <PressReleaseHub /> },
    { id: 'contacts', label: 'Media Contacts', icon: BookUser, component: <MediaContactsDB /> },
    { id: 'social', label: 'Social Scheduler', icon: CalendarClock, component: <SocialSchedulingPanel /> },
    { id: 'assets', label: 'Brand Library', icon: Library, component: <BrandLibrary /> },
    { id: 'analytics', label: 'Analytics', icon: BarChartHorizontal, component: <MediaAnalyticsDashboard /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Megaphone className="w-8 h-8 text-brand-red" />
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Comms & Media Center</h2>
          <p className="text-brand-text-secondary">Manage all external communications and marketing efforts.</p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
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