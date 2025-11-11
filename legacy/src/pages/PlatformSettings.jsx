import React from 'react';
import { Settings, Shield, Activity, Upload, Wand2, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SettingsManager from '../components/admin/SettingsManager';
import AuditLogViewer from '../components/admin/AuditLogViewer';
import MaintenanceModeControl from '../components/admin/MaintenanceModeControl';
import WorkflowManager from '../components/staffhq/admin/WorkflowManager';
import BulkDataImporter from '../components/admin/BulkDataImporter';
import ClubDataNormalizer from '../components/admin/ClubDataNormalizer';
import SystemHealthDashboard from '../components/admin/SystemHealthDashboard';
import ScheduledJobsManager from '../components/staffhq/admin/ScheduledJobsManager';

export default function PlatformSettings() {
  return (
    <div className="min-h-screen bg-brand-charcoal text-brand-text-primary">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Platform Settings
          </h1>
          <p className="text-brand-text-secondary mt-1">
            Manage system-wide configurations, security, and automation.
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-8">
            <TabsTrigger value="general">
              <Settings className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="health">
              <Activity className="w-4 h-4 mr-2" />
              Health
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Clock className="w-4 h-4 mr-2" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="import">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </TabsTrigger>
            <TabsTrigger value="normalize">
              <Wand2 className="w-4 h-4 mr-2" />
              Normalize
            </TabsTrigger>
            <TabsTrigger value="automation">
              <Settings className="w-4 h-4 mr-2" />
              Workflows
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              <Activity className="w-4 h-4 mr-2" />
              Maintenance
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <SettingsManager category="general" />
          </TabsContent>

          <TabsContent value="health" className="mt-6">
            <SystemHealthDashboard />
          </TabsContent>

          <TabsContent value="jobs" className="mt-6">
            <ScheduledJobsManager />
          </TabsContent>

          <TabsContent value="import" className="mt-6">
            <BulkDataImporter />
          </TabsContent>

          <TabsContent value="normalize" className="mt-6">
            <ClubDataNormalizer />
          </TabsContent>
          
          <TabsContent value="automation" className="mt-6">
            <WorkflowManager />
          </TabsContent>

          <TabsContent value="security" className="mt-6 space-y-6">
            <AuditLogViewer />
          </TabsContent>

          <TabsContent value="maintenance" className="mt-6 space-y-6">
            <MaintenanceModeControl />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}