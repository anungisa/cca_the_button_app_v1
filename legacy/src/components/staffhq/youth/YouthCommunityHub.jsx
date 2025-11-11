import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FTLOCDashboard from '../../youth/FTLOCDashboard';
import AuctionManagementDashboard from '../../youth/AuctionManagementDashboard';
import PledgeManagementDashboard from '../../youth/PledgeManagementDashboard';
import YouthProgramAnalytics from '../../youth/YouthProgramAnalytics';
import HDTAnalyticsDashboard from '../../youth/HDTAnalyticsDashboard';
import GenderEquityDashboard from '../../youth/GenderEquityDashboard';

export default function YouthCommunityHub() {
    return (
        <div className="p-4 md:p-6">
            <h1 className="text-2xl font-bold text-brand-text-primary mb-6">Youth & Community Hub</h1>

            <Tabs defaultValue="ftloc" className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-brand-card-bg border-brand-border">
                    <TabsTrigger value="ftloc">FTLOC</TabsTrigger>
                    <TabsTrigger value="pledges">Pledges</TabsTrigger>
                    <TabsTrigger value="auctions">Auctions</TabsTrigger>
                    <TabsTrigger value="youth_analytics">Youth Analytics</TabsTrigger>
                    <TabsTrigger value="hdt_analytics">HDT Analytics</TabsTrigger>
                    <TabsTrigger value="gender_equity">Gender Equity</TabsTrigger>
                </TabsList>
                <TabsContent value="ftloc" className="mt-6">
                    <FTLOCDashboard />
                </TabsContent>
                <TabsContent value="pledges" className="mt-6">
                    <PledgeManagementDashboard />
                </TabsContent>
                <TabsContent value="auctions" className="mt-6">
                    <AuctionManagementDashboard />
                </TabsContent>
                <TabsContent value="youth_analytics" className="mt-6">
                    <YouthProgramAnalytics />
                </TabsContent>
                <TabsContent value="hdt_analytics" className="mt-6">
                    <HDTAnalyticsDashboard />
                </TabsContent>
                <TabsContent value="gender_equity" className="mt-6">
                    <GenderEquityDashboard />
                </TabsContent>
            </Tabs>
        </div>
    );
}