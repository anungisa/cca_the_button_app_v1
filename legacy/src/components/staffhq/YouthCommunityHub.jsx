import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Heart, ClipboardCheck, BarChartHorizontal, Trophy, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';

// Lazy load the hub components for better performance
const CommunityProgramManager = React.lazy(() => import('./youth/CommunityProgramManager'));
const FTLOCDashboard = React.lazy(() => import('../youth/FTLOCDashboard'));
const PledgeManagementDashboard = React.lazy(() => import('../youth/PledgeManagementDashboard'));
const CommunityAnalyticsDashboard = React.lazy(() => import('../youth/CommunityAnalyticsDashboard'));
const HDTAnalyticsDashboard = React.lazy(() => import('../youth/HDTAnalyticsDashboard'));

const LoadingFallback = () => (
    <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
    </div>
);

export default function YouthCommunityHub() {
  const [selectedRegion, setSelectedRegion] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">Youth & Community Hub</h1>
            <p className="text-brand-text-secondary">
              Managing grassroots programs, FTLOC, and community engagement
              {selectedRegion !== 'all' && ` - ${getProvinceNameByAbbreviation(selectedRegion)} View`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-brand-text-secondary" />
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48 bg-brand-card-bg border-brand-border">
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
      
      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-brand-card-bg border-brand-border">
          <TabsTrigger value="programs"><Users className="w-4 h-4 mr-2" />Programs</TabsTrigger>
          <TabsTrigger value="ftloc"><Heart className="w-4 h-4 mr-2" />FTLOC</TabsTrigger>
          <TabsTrigger value="pledges"><ClipboardCheck className="w-4 h-4 mr-2" />Pledges</TabsTrigger>
          <TabsTrigger value="hdt"><Trophy className="w-4 h-4 mr-2" />HDT Analytics</TabsTrigger>
          <TabsTrigger value="analytics"><BarChartHorizontal className="w-4 h-4 mr-2" />Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="mt-6">
            <React.Suspense fallback={<LoadingFallback />}>
                <CommunityProgramManager selectedRegion={selectedRegion} />
            </React.Suspense>
        </TabsContent>

        <TabsContent value="ftloc" className="mt-6">
            <React.Suspense fallback={<LoadingFallback />}>
                <FTLOCDashboard selectedRegion={selectedRegion} />
            </React.Suspense>
        </TabsContent>

        <TabsContent value="pledges" className="mt-6">
            <React.Suspense fallback={<LoadingFallback />}>
                <PledgeManagementDashboard selectedRegion={selectedRegion} />
            </React.Suspense>
        </TabsContent>

        <TabsContent value="hdt" className="mt-6">
             <React.Suspense fallback={<LoadingFallback />}>
                <HDTAnalyticsDashboard selectedRegion={selectedRegion} />
            </React.Suspense>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
            <React.Suspense fallback={<LoadingFallback />}>
                <CommunityAnalyticsDashboard selectedRegion={selectedRegion} />
            </React.Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}