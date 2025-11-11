import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldAlert, List, Plus, BarChart3, Users, Settings } from 'lucide-react';
import IncidentList from '@/components/incident-management/IncidentList';
import IncidentStats from '@/components/incident-management/IncidentStats';
import CreateIncidentModal from '@/components/incident-management/CreateIncidentModal';
import EscalationEngine from '@/components/incident-management/EscalationEngine';
import PredictiveAnalytics from '@/components/incident-management/PredictiveAnalytics';
import IntegrationPanel from '@/components/incident-management/IntegrationPanel';

export default function IncidentManagementHub() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, component: <IncidentStats /> },
    { id: 'incidents', label: 'All Incidents', icon: List, component: <IncidentList /> },
    { id: 'escalation', label: 'Escalation Rules', icon: Users, component: <EscalationEngine /> },
    { id: 'analytics', label: 'Predictive Analytics', icon: BarChart3, component: <PredictiveAnalytics /> },
    { id: 'integrations', label: 'Integrations', icon: Settings, component: <IntegrationPanel /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-brand-red" />
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">Incident Management Hub</h2>
            <p className="text-brand-text-secondary">Track, manage, and resolve incidents across the organization.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Incident
        </button>
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

      {isCreateModalOpen && (
        <CreateIncidentModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
}