import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, BookOpen, Plus, BarChart3, Tags, Users } from 'lucide-react';
import KnowledgeArticleManager from '@/components/staffhq/knowledge/KnowledgeArticleManager';
import CategoryManager from '@/components/staffhq/knowledge/CategoryManager';
import KnowledgeAnalytics from '@/components/staffhq/knowledge/KnowledgeAnalytics';

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState('articles');

  const tabs = [
    { id: 'articles', label: 'Articles', icon: BookOpen, component: <KnowledgeArticleManager /> },
    { id: 'categories', label: 'Categories', icon: Tags, component: <CategoryManager /> },
    { id: 'analytics', label: 'Usage Analytics', icon: BarChart3, component: <KnowledgeAnalytics /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-brand-red" />
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">Knowledge Base</h2>
            <p className="text-brand-text-secondary">Manage organizational knowledge and documentation.</p>
          </div>
        </div>
        {/* The "New Article" button was removed as its component does not exist */}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
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