import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, ClipboardList, BookOpen, BarChart2, Smile, Award, FolderLock, LineChart } from 'lucide-react';
import HRKPIsDashboard from '@/components/staffhq/hr/HRKPIsDashboard';
import StaffDirectory from '@/components/staffhq/hr/StaffDirectory';
import OnboardingTracker from '@/components/staffhq/hr/OnboardingTracker';
import PolicyLibrary from '@/components/staffhq/hr/PolicyLibrary';
import DEIMetricsDashboard from '@/components/staffhq/hr/DEIMetricsDashboard';
import EmployeeFeedbackHub from '@/components/staffhq/hr/EmployeeFeedbackHub';
import LearningDevelopmentHub from '@/components/staffhq/hr/LearningDevelopmentHub';
import SecureDocsVault from '@/components/staffhq/hr/SecureDocsVault';

export default function PeopleCultureHub() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LineChart, component: <HRKPIsDashboard /> },
    { id: 'directory', label: 'Staff Directory', icon: Users, component: <StaffDirectory /> },
    { id: 'onboarding', label: 'Onboarding', icon: ClipboardList, component: <OnboardingTracker /> },
    { id: 'policies', label: 'Policy Library', icon: BookOpen, component: <PolicyLibrary /> },
    { id: 'dei', label: 'DEI Metrics', icon: BarChart2, component: <DEIMetricsDashboard /> },
    { id: 'feedback', label: 'Employee Feedback', icon: Smile, component: <EmployeeFeedbackHub /> },
    { id: 'learning', label: 'Learning & Dev', icon: Award, component: <LearningDevelopmentHub /> },
    { id: 'docs', label: 'Secure Documents', icon: FolderLock, component: <SecureDocsVault /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-brand-red" />
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">People & Culture Hub</h2>
          <p className="text-brand-text-secondary">Manage all aspects of human resources and organizational culture.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
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