import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, FileText, BarChart3, Shield, AlertTriangle } from 'lucide-react';
import DocumentLibrary from './legal/DocumentLibrary';
import LegalReporting from './legal/LegalReporting';
import ComplianceOverviewPanel from './legal/ComplianceOverviewPanel';
import LegalCaseManagement from './legal/LegalCaseManagement';
import RiskAssessmentPanel from './legal/RiskAssessmentPanel';

export default function LegalComplianceHub() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
          <Scale className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Legal & Compliance Hub</h1>
          <p className="text-brand-text-secondary">Comprehensive legal document management, compliance tracking, and reporting.</p>
        </div>
      </div>

      <Tabs defaultValue="compliance" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-brand-card-bg border-brand-border">
          <TabsTrigger value="compliance">
            <Shield className="w-4 h-4 mr-2" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="cases">
            <Scale className="w-4 h-4 mr-2" />
            Legal Cases
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            Document Library
          </TabsTrigger>
          <TabsTrigger value="reporting">
            <BarChart3 className="w-4 h-4 mr-2" />
            Reporting
          </TabsTrigger>
          <TabsTrigger value="risk">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Risk Assessment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="mt-6">
          <ComplianceOverviewPanel />
        </TabsContent>

        <TabsContent value="cases" className="mt-6">
          <LegalCaseManagement />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentLibrary />
        </TabsContent>

        <TabsContent value="reporting" className="mt-6">
          <LegalReporting />
        </TabsContent>

        <TabsContent value="risk" className="mt-6">
          <RiskAssessmentPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}