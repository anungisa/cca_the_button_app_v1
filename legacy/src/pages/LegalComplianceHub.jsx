import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, FileText, Shield, AlertTriangle, BarChart3, BookOpen, Globe } from 'lucide-react';
import DocumentLibrary from '@/components/staffhq/legal/DocumentLibrary';
import LegalCaseManagement from '@/components/staffhq/legal/LegalCaseManagement';
import ComplianceOverviewPanel from '@/components/staffhq/legal/ComplianceOverviewPanel';
import RiskAssessmentPanel from '@/components/staffhq/legal/RiskAssessmentPanel';
import LegalReporting from '@/components/staffhq/legal/LegalReporting';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { canadianProvincesAndTerritories } from '@/components/utils/provinces';

export default function LegalComplianceHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const tabs = [
    { id: 'overview', label: 'Compliance Overview', icon: BarChart3, component: <ComplianceOverviewPanel selectedRegion={selectedRegion} /> },
    { id: 'documents', label: 'Document Library', icon: FileText, component: <DocumentLibrary selectedRegion={selectedRegion} /> },
    { id: 'cases', label: 'Legal Cases', icon: Scale, component: <LegalCaseManagement selectedRegion={selectedRegion} /> },
    { id: 'risk', label: 'Risk Assessment', icon: AlertTriangle, component: <RiskAssessmentPanel selectedRegion={selectedRegion} /> },
    { id: 'reports', label: 'Legal Reporting', icon: BookOpen, component: <LegalReporting selectedRegion={selectedRegion} /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8 text-brand-red" />
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">Legal & Compliance Hub</h2>
            <p className="text-brand-text-secondary">Manage legal matters, compliance tracking, and risk assessment.</p>
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
              {canadianProvincesAndTerritories.map((province) => (
                <SelectItem key={province.abbreviation} value={province.abbreviation}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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