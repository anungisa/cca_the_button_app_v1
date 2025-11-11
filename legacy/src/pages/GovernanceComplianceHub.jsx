import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, FileText, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import GovernancePolicyBinder from '@/components/staffhq/governance/GovernancePolicyBinder';
import BoardCommitteeWorkspace from '@/components/staffhq/governance/BoardCommitteeWorkspace';
import GovernanceCalendar from '@/components/staffhq/governance/GovernanceCalendar';
import ComplianceDashboard from '@/components/staffhq/governance/ComplianceDashboard';
import DocumentApprovalWorkflow from '@/components/staffhq/governance/DocumentApprovalWorkflow';
import MAComplianceMatrix from '@/components/staffhq/governance/MAComplianceMatrix';

export default function GovernanceComplianceHub() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield, component: <ComplianceDashboard /> },
    { id: 'board', label: 'Board & Committees', icon: Users, component: <BoardCommitteeWorkspace /> },
    { id: 'policies', label: 'Policy Management', icon: FileText, component: <GovernancePolicyBinder /> },
    { id: 'meetings', label: 'Meeting Center', icon: Calendar, component: <GovernanceCalendar /> },
    { id: 'approvals', label: 'Document Approvals', icon: CheckCircle, component: <DocumentApprovalWorkflow /> },
    { id: 'ma_compliance', label: 'MA Compliance', icon: AlertTriangle, component: <MAComplianceMatrix /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-brand-red" />
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Governance & Compliance Hub</h2>
          <p className="text-brand-text-secondary">Manage board operations, policies, and regulatory compliance.</p>
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