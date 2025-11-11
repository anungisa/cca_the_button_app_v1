import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, FileText, Users, Calendar, AlertTriangle, CheckCircle, Scale } from 'lucide-react';

// Import governance components
import GovernancePolicyBinder from './governance/GovernancePolicyBinder';
import BoardCommitteeWorkspace from './governance/BoardCommitteeWorkspace';
import GovernanceCalendar from './governance/GovernanceCalendar';
import RiskComplianceDashboard from './governance/RiskComplianceDashboard';
import DocumentApprovalsWorkflow from './governance/DocumentApprovalsWorkflow';
import MAComplianceMatrix from './governance/MAComplianceMatrix';
import AuditHistoricalAccess from './governance/AuditHistoricalAccess';

export default function GovernanceComplianceHub() {
  const [activeTab, setActiveTab] = useState('policies');

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Scale className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Governance & Compliance Hub</CardTitle>
                <p className="text-brand-text-secondary">Administrative backbone for transparent and defensible governance operations</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600 text-white">Oksanna Coles - Director</Badge>
              <Badge variant="outline" className="border-brand-border text-brand-text-secondary">Secure Module</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-brand-card-bg border-brand-border">
          <TabsTrigger value="policies" className="text-xs">
            <FileText className="w-4 h-4 mr-0 lg:mr-2" />
            <span className="hidden sm:inline">Policies</span>
          </TabsTrigger>
          <TabsTrigger value="board" className="text-xs">
            <Users className="w-4 h-4 mr-0 lg:mr-2" />
            <span className="hidden sm:inline">Board</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="text-xs">
            <Calendar className="w-4 h-4 mr-0 lg:mr-2" />
            <span className="hidden sm:inline">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="text-xs">
            <Shield className="w-4 h-4 mr-0 lg:mr-2" />
            <span className="hidden sm:inline">Risk</span>
          </TabsTrigger>
          <TabsTrigger value="approvals" className="text-xs">
            <CheckCircle className="w-4 h-4 mr-0 lg:mr-2" />
            <span className="hidden sm:inline">Approvals</span>
          </TabsTrigger>
          <TabsTrigger value="ma-compliance" className="text-xs">
            <AlertTriangle className="w-4 h-4 mr-0 lg:mr-2" />
            <span className="hidden sm:inline">MA Matrix</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="text-xs">
            <FileText className="w-4 h-4 mr-0 lg:mr-2" />
            <span className="hidden sm:inline">Archive</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="policies">
          <GovernancePolicyBinder />
        </TabsContent>

        <TabsContent value="board">
          <BoardCommitteeWorkspace />
        </TabsContent>

        <TabsContent value="calendar">
          <GovernanceCalendar />
        </TabsContent>

        <TabsContent value="compliance">
          <RiskComplianceDashboard />
        </TabsContent>

        <TabsContent value="approvals">
          <DocumentApprovalsWorkflow />
        </TabsContent>

        <TabsContent value="ma-compliance">
          <MAComplianceMatrix />
        </TabsContent>

        <TabsContent value="audit">
          <AuditHistoricalAccess />
        </TabsContent>
      </Tabs>
    </div>
  );
}