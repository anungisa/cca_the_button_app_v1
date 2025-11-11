import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Handshake, FileText, BarChart3 } from 'lucide-react';
import CaseHub from './CaseHub';
import SurveyAnalyticsDashboard from './SurveyAnalyticsDashboard';

export default function CommunityServicesHub() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-text-primary">Community Services</h2>
        <p className="text-brand-text-secondary">Tools for managing community support, case management, and survey analytics.</p>
      </div>

      <Tabs defaultValue="cases" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-brand-card-bg">
          <TabsTrigger value="cases" className="flex items-center gap-2">
            <Handshake className="w-4 h-4" />
            Case Management
          </TabsTrigger>
          <TabsTrigger value="surveys" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Survey Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="mt-6">
          <CaseHub />
        </TabsContent>

        <TabsContent value="surveys" className="mt-6">
          <SurveyAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}