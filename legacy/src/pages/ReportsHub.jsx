import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, FileText } from 'lucide-react';
import OperationalReports from '@/components/staffhq/reports/OperationalReports';
import AnalyticsDashboard from '@/components/staffhq/reports/AnalyticsDashboard';

export default function ReportsHub() {
  const [activeTab, setActiveTab] = useState('operational');

  const tabs = [
    { id: 'operational', label: 'Operational Reports', icon: FileText, component: <OperationalReports /> },
    { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3, component: <AnalyticsDashboard /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-brand-red" />
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Reports Hub</h2>
          <p className="text-brand-text-secondary">Generate and manage reports across all organizational functions.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
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