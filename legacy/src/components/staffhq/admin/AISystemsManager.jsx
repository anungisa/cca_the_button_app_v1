import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Database, MessageSquare, TrendingUp, Settings } from 'lucide-react';

import PredictiveWorkloadManager from '@/components/ai/PredictiveWorkloadManager';
import SentimentAnalysisEngine from '@/components/ai/SentimentAnalysisEngine';
import CRMIntegrationManager from '@/components/integrations/CRMIntegrationManager';

export default function AISystemsManager() {
  const [activeSystem, setActiveSystem] = useState('workload');

  const aiSystems = [
    {
      id: 'workload',
      name: 'Predictive Workload Manager',
      description: 'AI-powered incident volume prediction and staffing recommendations',
      icon: TrendingUp,
      status: 'active',
      component: PredictiveWorkloadManager
    },
    {
      id: 'sentiment',
      name: 'Sentiment Analysis Engine',
      description: 'Analyze communication sentiment across incidents and community posts',
      icon: MessageSquare,
      status: 'active',
      component: SentimentAnalysisEngine
    },
    {
      id: 'crm',
      name: 'CRM Integration Manager',
      description: 'Connect and sync data with external CRM systems',
      icon: Database,
      status: 'active',
      component: CRMIntegrationManager
    }
  ];

  const ActiveComponent = aiSystems.find(system => system.id === activeSystem)?.component;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-text-primary flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-400" />
          AI Systems Manager
        </h1>
        <p className="text-brand-text-secondary mt-2">
          Advanced AI and machine learning systems for intelligent operations
        </p>
      </div>

      <Tabs value={activeSystem} onValueChange={setActiveSystem}>
        <TabsList className="grid w-full grid-cols-3">
          {aiSystems.map((system) => (
            <TabsTrigger key={system.id} value={system.id} className="flex items-center gap-2">
              <system.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{system.name.split(' ')[0]}</span>
              <span className="sm:hidden">{system.id}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {aiSystems.map((system) => (
          <TabsContent key={system.id} value={system.id}>
            <system.component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}