import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Calendar, Brain, Users } from 'lucide-react';

import RewardManagementHub from '../components/staffhq/RewardManagementHub';
import EventManagementHub from '../components/staffhq/EventManagementHub';
import TriviaManagementHub from '../components/staffhq/TriviaManagementHub';

export default function ContentManagementHub() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brand-text-primary">Content Management</h1>
        <p className="text-brand-text-secondary">Manage rewards, events, trivia, and other community content.</p>
      </div>

      <Tabs defaultValue="rewards" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="rewards">
            <Gift className="w-4 h-4 mr-2" /> Rewards
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="w-4 h-4 mr-2" /> Events
          </TabsTrigger>
          <TabsTrigger value="trivia">
            <Brain className="w-4 h-4 mr-2" /> Trivia
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="rewards" className="mt-6">
          <RewardManagementHub />
        </TabsContent>
        
        <TabsContent value="events" className="mt-6">
          <EventManagementHub />
        </TabsContent>
        
        <TabsContent value="trivia" className="mt-6">
          <TriviaManagementHub />
        </TabsContent>
      </Tabs>
    </div>
  );
}