import React, { lazy } from 'react';
import { BrainCircuit, FileText, FlaskConical, BarChart, Users, Microscope, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LazyPageWrapper from '../components/LazyPageWrapper';
import { usePermissions } from '../components/hooks/usePermissions';

const StrategicDataOverview = lazy(() => import('../components/research/StrategicDataOverview'));
const AIModelsLab = lazy(() => import('../components/research/AIModelsLab'));
const ResearchPartnerships = lazy(() => import('../components/research/ResearchPartnerships'));
const InternalResearchRepo = lazy(() => import('../components/research/InternalResearchRepo'));
const InnovationRequestsLog = lazy(() => import('../components/research/InnovationRequestsLog'));
const DataPrivacyMonitor = lazy(() => import('../components/research/DataPrivacyMonitor'));
const ResearchResourcesHub = lazy(() => import('../components/research/ResearchResourcesHub'));
const PredictiveAnalyticsShowcase = lazy(() => import('../components/research/PredictiveAnalyticsShowcase'));


export default function ResearchHub() {
    const { permissions } = usePermissions();

    if (!permissions.canAccessResearchHub) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p>You do not have permission to view the Research Hub.</p>
            </div>
        );
    }
  return (
    <div className="min-h-screen bg-brand-charcoal text-brand-text-primary p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-brand-red" />
            Research & Innovation Hub
          </h1>
          <p className="text-brand-text-secondary mt-1">
            Driving the future of curling through data, insights, and technology.
          </p>
        </header>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="overview"><BarChart className="w-4 h-4 mr-2" />Overview</TabsTrigger>
            <TabsTrigger value="predictive"><Zap className="w-4 h-4 mr-2" />Predictive</TabsTrigger>
            <TabsTrigger value="models"><FlaskConical className="w-4 h-4 mr-2" />AI Models</TabsTrigger>
            <TabsTrigger value="partnerships"><Users className="w-4 h-4 mr-2" />Partnerships</TabsTrigger>
            <TabsTrigger value="repo"><FileText className="w-4 h-4 mr-2" />Repository</TabsTrigger>
            <TabsTrigger value="requests"><Microscope className="w-4 h-4 mr-2" />Innovation</TabsTrigger>
            <TabsTrigger value="privacy"><Users className="w-4 h-4 mr-2" />Privacy</TabsTrigger>
            <TabsTrigger value="resources"><FileText className="w-4 h-4 mr-2" />Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <LazyPageWrapper><StrategicDataOverview /></LazyPageWrapper>
          </TabsContent>
          <TabsContent value="predictive" className="mt-6">
            <LazyPageWrapper><PredictiveAnalyticsShowcase /></LazyPageWrapper>
          </TabsContent>
          <TabsContent value="models" className="mt-6">
            <LazyPageWrapper><AIModelsLab /></LazyPageWrapper>
          </TabsContent>
          <TabsContent value="partnerships" className="mt-6">
            <LazyPageWrapper><ResearchPartnerships /></LazyPageWrapper>
          </TabsContent>
          <TabsContent value="repo" className="mt-6">
            <LazyPageWrapper><InternalResearchRepo /></LazyPageWrapper>
          </TabsContent>
           <TabsContent value="requests" className="mt-6">
            <LazyPageWrapper><InnovationRequestsLog /></LazyPageWrapper>
          </TabsContent>
           <TabsContent value="privacy" className="mt-6">
            <LazyPageWrapper><DataPrivacyMonitor /></LazyPageWrapper>
          </TabsContent>
           <TabsContent value="resources" className="mt-6">
            <LazyPageWrapper><ResearchResourcesHub /></LazyPageWrapper>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}