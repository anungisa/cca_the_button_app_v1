import React, { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, BookOpen, Shield, Database, Lightbulb, FlaskConical, Globe } from 'lucide-react';
import { useState } from 'react';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';

const AIModelsLab = React.lazy(() => import('../research/AIModelsLab'));
const ResearchPartnerships = React.lazy(() => import('../research/ResearchPartnerships'));
const DataPrivacyMonitor = React.lazy(() => import('../research/DataPrivacyMonitor'));
const ResearchResourcesHub = React.lazy(() => import('../research/ResearchResourcesHub'));
const InnovationRequestsLog = React.lazy(() => import('../research/InnovationRequestsLog'));

const LoadingFallback = () => (
    <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
    </div>
);

export default function ResearchHub() {
  const [selectedRegion, setSelectedRegion] = useState('all');

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <FlaskConical className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-brand-text-primary">Research & Data Hub</h1>
                    <p className="text-brand-text-secondary">
                        The central nervous system for data science, AI, and strategic research
                        {selectedRegion !== 'all' && ` - ${getProvinceNameByAbbreviation(selectedRegion)}`}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-brand-text-secondary" />
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-48">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        {canadianProvincesAndTerritories.map(province => (
                            <SelectItem key={province.abbreviation} value={province.abbreviation}>
                                {province.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        <Tabs defaultValue="ai_lab" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-brand-card-bg border-brand-border">
                <TabsTrigger value="ai_lab"><Brain className="w-4 h-4 mr-2" />AI Models Lab</TabsTrigger>
                <TabsTrigger value="partnerships"><BookOpen className="w-4 h-4 mr-2" />Partnerships</TabsTrigger>
                <TabsTrigger value="privacy"><Shield className="w-4 h-4 mr-2" />Data Privacy</TabsTrigger>
                <TabsTrigger value="resources"><Database className="w-4 h-4 mr-2" />Resources</TabsTrigger>
                <TabsTrigger value="innovation"><Lightbulb className="w-4 h-4 mr-2" />Innovation Log</TabsTrigger>
            </TabsList>

            <TabsContent value="ai_lab" className="mt-6">
                <Suspense fallback={<LoadingFallback />}>
                    <AIModelsLab selectedRegion={selectedRegion} />
                </Suspense>
            </TabsContent>
            <TabsContent value="partnerships" className="mt-6">
                <Suspense fallback={<LoadingFallback />}>
                    <ResearchPartnerships selectedRegion={selectedRegion} />
                </Suspense>
            </TabsContent>
            <TabsContent value="privacy" className="mt-6">
                <Suspense fallback={<LoadingFallback />}>
                    <DataPrivacyMonitor selectedRegion={selectedRegion} />
                </Suspense>
            </TabsContent>
            <TabsContent value="resources" className="mt-6">
                <Suspense fallback={<LoadingFallback />}>
                    <ResearchResourcesHub selectedRegion={selectedRegion} />
                </Suspense>
            </TabsContent>
            <TabsContent value="innovation" className="mt-6">
                <Suspense fallback={<LoadingFallback />}>
                    <InnovationRequestsLog selectedRegion={selectedRegion} />
                </Suspense>
            </TabsContent>
        </Tabs>
    </div>
  );
}