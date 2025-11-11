import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MessageSquare, Shield, BarChart3, Heart, Flag } from 'lucide-react';
import CommunityPostManager from '@/components/staffhq/community/CommunityPostManager';
import UserEngagementTracker from '@/components/staffhq/community/UserEngagementTracker';
import CommunityModeration from '@/components/staffhq/community/CommunityModeration';
import CommunityAnalytics from '@/components/staffhq/community/CommunityAnalytics';
import KudosManagement from '@/components/staffhq/community/KudosManagement';

export default function CommunityHub() {
  const [activeTab, setActiveTab] = useState('posts');

  const tabs = [
    { id: 'posts', label: 'Community Posts', icon: MessageSquare, component: <CommunityPostManager /> },
    { id: 'engagement', label: 'User Engagement', icon: Users, component: <UserEngagementTracker /> },
    { id: 'kudos', label: 'Kudos System', icon: Heart, component: <KudosManagement /> },
    { id: 'moderation', label: 'Content Moderation', icon: Shield, component: <CommunityModeration /> },
    { id: 'analytics', label: 'Community Analytics', icon: BarChart3, component: <CommunityAnalytics /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-brand-red" />
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Community Hub</h2>
          <p className="text-brand-text-secondary">Manage community engagement, posts, and user interactions.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
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