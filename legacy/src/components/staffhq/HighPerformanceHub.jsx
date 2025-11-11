import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import { 
  Target, 
  Users, 
  ClipboardList, 
  BrainCircuit,
  BookOpen,
  Loader2,
  Globe
} from 'lucide-react';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';

const HPOverview = React.lazy(() => import('../hp/HPOverview'));
const GameLogAuditor = React.lazy(() => import('../hp/GameLogAuditor'));
const DrillLibraryManager = React.lazy(() => import('../hp/DrillLibraryManager'));
const HPAnalyticsDashboard = React.lazy(() => import('../hp/HPAnalyticsDashboard'));

const LoadingFallback = () => (
    <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
    </div>
);

export default function HighPerformanceHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target, component: <HPOverview selectedRegion={selectedRegion} /> },
    { id: 'logs', label: 'Game Logs', icon: ClipboardList, component: <GameLogAuditor selectedRegion={selectedRegion} /> },
    { id: 'drills', label: 'Drill Library', icon: BookOpen, component: <DrillLibraryManager selectedRegion={selectedRegion} /> },
    { id: 'analytics', label: 'Analytics', icon: BrainCircuit, component: <HPAnalyticsDashboard selectedRegion={selectedRegion} /> }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;
  
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header and Region Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
                <Target className="w-7 h-7 text-white" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-brand-text-primary">High Performance Hub</h1>
                <p className="text-brand-text-secondary">
                  National & Regional Athlete Development
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


      {isMobile ? (
        <div className="space-y-4">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full bg-brand-card-bg border-brand-border text-brand-text-primary">
              <SelectValue>
                <div className="flex items-center gap-2">
                  {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab).icon, { className: "w-4 h-4" })}
                  {tabs.find(t => t.id === activeTab)?.label}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-brand-card-bg border-brand-border">
              {tabs.map((tab) => (
                <SelectItem key={tab.id} value={tab.id}>
                  <div className="flex items-center gap-2">
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div>
            <Suspense fallback={<LoadingFallback />}>
              {ActiveComponent}
            </Suspense>
          </div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-brand-card-bg">
            {tabs.map(tab => <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2"><tab.icon className="w-4 h-4"/>{tab.label}</TabsTrigger>)}
          </TabsList>
          {tabs.map(tab => (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
                <Suspense fallback={<LoadingFallback />}>
                    {tab.component}
                </Suspense>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}