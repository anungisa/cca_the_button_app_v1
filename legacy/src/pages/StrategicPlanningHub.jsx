import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Target, Rocket, BarChart } from 'lucide-react';
import KPIDashboard from '@/components/staffhq/strategic/KPIDashboard';
import GoalTracker from '@/components/staffhq/strategic/GoalTracker';
import InitiativeRoadmap from '@/components/staffhq/strategic/InitiativeRoadmap';

export default function StrategicPlanningHub() {
  const [activeTab, setActiveTab] = useState('goals');

  const tabs = [
    { id: 'goals', label: 'Goals & Objectives', icon: Target, component: <GoalTracker /> },
    { id: 'initiatives', label: 'Initiatives Roadmap', icon: Rocket, component: <InitiativeRoadmap /> },
    { id: 'kpis', label: 'KPI Dashboard', icon: BarChart, component: <KPIDashboard /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-8 h-8 text-brand-red" />
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Strategic Planning Hub</h2>
          <p className="text-brand-text-secondary">Define, track, and manage the organization's strategic goals and initiatives.</p>
        </div>
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