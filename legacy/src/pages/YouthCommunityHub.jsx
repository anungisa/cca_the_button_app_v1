import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Users, Handshake, BarChart2, Zap } from 'lucide-react';
import { usePermissions } from '../components/hooks/usePermissions';
import { getProvinceNameByAbbreviation } from '../components/utils/provinces';

// Import the full dashboard components
import FTLOCDashboard from '../components/youth/FTLOCDashboard';
import PledgeManagementDashboard from '../components/youth/PledgeManagementDashboard';
import YouthProgramAnalytics from '../components/youth/YouthProgramAnalytics';
import HDTAnalyticsDashboard from '../components/youth/HDTAnalyticsDashboard';
import GenderEquityDashboard from '../components/youth/GenderEquityDashboard';

export default function YouthCommunityHub() {
    const { permissions } = usePermissions();

    if (!permissions.canAccessYouthAndCommunity) {
        return (
            <div className="flex items-center justify-center h-96">
                <Card className="bg-brand-card-bg border-brand-border">
                    <CardContent className="p-8 text-center">
                        <Heart className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Access Restricted</h3>
                        <p className="text-brand-text-secondary">You don't have permission to access the Youth & Community Hub.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                        <Heart className="w-8 h-8 text-pink-500" />
                        Youth & Community Hub
                    </CardTitle>
                    <p className="text-brand-text-secondary">Nurturing the next generation and engaging our communities.</p>
                </CardHeader>
            </Card>

            <Tabs defaultValue="ftloc" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                    <TabsTrigger value="ftloc"><Heart className="w-4 h-4 mr-2" />FTLOC</TabsTrigger>
                    <TabsTrigger value="pledges"><Handshake className="w-4 h-4 mr-2" />Pledges</TabsTrigger>
                    <TabsTrigger value="youth_analytics"><Users className="w-4 h-4 mr-2" />Youth Analytics</TabsTrigger>
                    <TabsTrigger value="hdt"><BarChart2 className="w-4 h-4 mr-2" />HDT Analytics</TabsTrigger>
                    <TabsTrigger value="equity"><Zap className="w-4 h-4 mr-2" />Gender Equity</TabsTrigger>
                </TabsList>
                <TabsContent value="ftloc" className="mt-4">
                    <FTLOCDashboard />
                </TabsContent>
                <TabsContent value="pledges" className="mt-4">
                    <PledgeManagementDashboard />
                </TabsContent>
                <TabsContent value="youth_analytics" className="mt-4">
                    <YouthProgramAnalytics />
                </TabsContent>
                <TabsContent value="hdt" className="mt-4">
                    <HDTAnalyticsDashboard />
                </TabsContent>
                 <TabsContent value="equity" className="mt-4">
                    <GenderEquityDashboard />
                </TabsContent>
            </Tabs>
        </div>
    );
}