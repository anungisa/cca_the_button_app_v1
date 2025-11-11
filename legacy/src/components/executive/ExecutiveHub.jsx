import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Target, Rocket, Users, Building, GitBranch } from 'lucide-react';
import StrategicKPIDashboard from './StrategicKPIDashboard';
import PlatformAdoptionCenter from './PlatformAdoptionCenter';
import BrandProductToolkit from './BrandProductToolkit';
import StakeholderRelationshipLog from './StakeholderRelationshipLog';

export default function ExecutiveHub() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-brand-red" />
                <div>
                    <h2 className="text-2xl font-bold text-brand-text-primary">Executive Hub</h2>
                    <p className="text-brand-text-secondary">Strategic oversight and key performance indicators.</p>
                </div>
            </div>
            <Tabs defaultValue="strategy" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="strategy"><TrendingUp className="w-4 h-4 mr-2" />Strategy</TabsTrigger>
                    <TabsTrigger value="adoption"><Building className="w-4 h-4 mr-2" />Platform Adoption</TabsTrigger>
                    <TabsTrigger value="brand"><GitBranch className="w-4 h-4 mr-2" />Brand & Product</TabsTrigger>
                    <TabsTrigger value="stakeholders"><Users className="w-4 h-4 mr-2" />Stakeholders</TabsTrigger>
                </TabsList>
                <TabsContent value="strategy" className="mt-6">
                    <StrategicKPIDashboard />
                </TabsContent>
                <TabsContent value="adoption" className="mt-6">
                    <PlatformAdoptionCenter />
                </TabsContent>
                <TabsContent value="brand" className="mt-6">
                    <BrandProductToolkit />
                </TabsContent>
                <TabsContent value="stakeholders" className="mt-6">
                    <StakeholderRelationshipLog />
                </TabsContent>
            </Tabs>
        </div>
    );
}