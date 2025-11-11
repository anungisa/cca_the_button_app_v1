
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, BookOpen, GraduationCap, BellRing, ClipboardCheck, Globe } from 'lucide-react';
import ComplianceCommandCenter from '@/components/safesport/ComplianceCommandCenter';
import EducationPathwaysManager from '@/components/safesport/EducationPathwaysManager';
import LearningModuleHub from '@/components/safesport/LearningModuleHub';
import PolicyGovernanceBinder from '@/components/safesport/PolicyGovernanceBinder';
import IncidentOversightTriage from '@/components/safesport/IncidentOversightTriage';
import CommunicationsEnforcementLog from '@/components/safesport/CommunicationsEnforcementLog';
import AuditGrantReadiness from '@/components/safesport/AuditGrantReadiness';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { provinces } from '@/components/utils/provinces';

export default function SafeSportHub() {
  const [activeTab, setActiveTab] = useState('compliance');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const tabs = [
    { id: 'compliance', label: 'Compliance Center', icon: ClipboardCheck, component: <ComplianceCommandCenter selectedRegion={selectedRegion} /> },
    { id: 'incidents', label: 'Incident Triage', icon: BellRing, component: <IncidentOversightTriage selectedRegion={selectedRegion} /> },
    { id: 'policies', label: 'Policy Binder', icon: BookOpen, component: <PolicyGovernanceBinder selectedRegion={selectedRegion} /> },
    { id: 'education', label: 'Education Pathways', icon: GraduationCap, component: <EducationPathwaysManager selectedRegion={selectedRegion} /> },
    { id: 'modules', label: 'Learning Modules', icon: GraduationCap, component: <LearningModuleHub /> },
    { id: 'communications', label: 'Comms Log', icon: BellRing, component: <CommunicationsEnforcementLog selectedRegion={selectedRegion} /> },
    { id: 'audit', label: 'Audit Readiness', icon: Shield, component: <AuditGrantReadiness selectedRegion={selectedRegion} /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-brand-red" />
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">Safe Sport Hub</h2>
            <p className="text-brand-text-secondary">Manage policies, training, incidents, and compliance for Safe Sport.</p>
          </div>
        </div>
         <div className="flex items-center gap-2">
           <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <SelectValue placeholder="Select Region" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {provinces.map((province) => (
                <SelectItem key={province.abbreviation} value={province.abbreviation}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
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
