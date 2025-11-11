
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, BarChart2, DollarSign, Target, Handshake, Building, Globe, Loader2 } from 'lucide-react';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';

const PipelineBoard = React.lazy(() => import('../sponsorship/PipelineBoard'));
const ProspectsList = React.lazy(() => import('../sponsorship/ProspectsList'));
const PartnerDirectory = React.lazy(() => import('../sponsorship/PartnerDirectory'));
const AssetInventory = React.lazy(() => import('../sponsorship/AssetInventory'));
const SponsorshipDashboard = React.lazy(() => import('../sponsorship/SponsorshipDashboard'));

const LoadingFallback = () => <div className="text-center p-8"><Loader2 className="w-8 h-8 mx-auto animate-spin" /></div>;

export default function SponsorshipHQ() {
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Dummy data generation for stats. In real app, this would be fetched and aggregated.
  const generateSampleData = () => {
    const deals = canadianProvincesAndTerritories.flatMap(p => ([
        { ma_region: p.abbreviation, stage: 'negotiation', deal_value: 50000 },
        { ma_region: p.abbreviation, stage: 'contracted', deal_value: 75000 },
        { ma_region: p.abbreviation, stage: 'prospect', deal_value: 20000 },
    ]));
    deals.push({ ma_region: null, stage: 'negotiation', deal_value: 250000 }); // National deal
    
    const partners = canadianProvincesAndTerritories.map(p => ({ ma_region: p.abbreviation, status: 'active' }));
    partners.push({ ma_region: null, status: 'active'});
    
    return { deals, partners };
  };

  const sampleData = useMemo(generateSampleData, []);

  const stats = useMemo(() => {
    const regionDeals = selectedRegion === 'all' 
        ? sampleData.deals 
        : sampleData.deals.filter(d => d.ma_region === selectedRegion || d.ma_region === null); // Include national deals in regional view
    
    const regionPartners = selectedRegion === 'all'
        ? sampleData.partners
        : sampleData.partners.filter(p => p.ma_region === selectedRegion || p.ma_region === null); // Include national partners in regional view

    return [
      { title: 'Pipeline Value', value: `$${(regionDeals.reduce((acc, d) => acc + d.deal_value, 0) / 1000).toFixed(0)}K`, icon: DollarSign },
      { title: 'Active Deals', value: regionDeals.filter(d => ['negotiation', 'contracted'].includes(d.stage)).length, icon: Target },
      { title: 'New Prospects', value: regionDeals.filter(d => d.stage === 'prospect').length, change: '+3 this week', icon: Handshake },
      { title: 'Active Partners', value: regionPartners.length, icon: Building },
    ];
  }, [selectedRegion, sampleData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">Sponsorship HQ</h1>
            <p className="text-brand-text-secondary">
              {selectedRegion === 'all' ? 'National & Regional' : getProvinceNameByAbbreviation(selectedRegion)} Sponsorship Management
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
              <SelectItem value="all">All Regions (National)</SelectItem>
              {canadianProvincesAndTerritories.map(p => (
                <SelectItem key={p.abbreviation} value={p.abbreviation}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-brand-card-bg border-brand-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brand-text-secondary">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-brand-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-text-primary">{stat.value}</div>
              {stat.change && <p className="text-xs text-green-500">{stat.change}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-brand-card-bg border-brand-border">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="prospects">Prospects</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="assets">Asset Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <React.Suspense fallback={<LoadingFallback />}>
            <SponsorshipDashboard selectedRegion={selectedRegion} />
          </React.Suspense>
        </TabsContent>
        <TabsContent value="pipeline" className="mt-6">
          <React.Suspense fallback={<LoadingFallback />}>
            <PipelineBoard selectedRegion={selectedRegion} />
          </React.Suspense>
        </TabsContent>
        <TabsContent value="prospects" className="mt-6">
          <React.Suspense fallback={<LoadingFallback />}>
            <ProspectsList selectedRegion={selectedRegion} />
          </React.Suspense>
        </TabsContent>
        <TabsContent value="partners" className="mt-6">
          <React.Suspense fallback={<LoadingFallback />}>
            <PartnerDirectory selectedRegion={selectedRegion} />
          </React.Suspense>
        </TabsContent>
        <TabsContent value="assets" className="mt-6">
          <React.Suspense fallback={<LoadingFallback />}>
            <AssetInventory selectedRegion={selectedRegion} />
          </React.Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
