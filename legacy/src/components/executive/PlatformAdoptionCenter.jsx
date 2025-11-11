import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Globe,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Shield,
  Zap,
  Building
} from 'lucide-react';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';
import { getFiscalYearInfo } from '../utils/season';

export default function PlatformAdoptionCenter() {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [viewMode, setViewMode] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  const currentFY = getFiscalYearInfo();

  // Platform adoption data with complete regional coverage
  const platformData = {
    curling_os: {
      name: 'CurlingOS',
      description: 'Unified operational platform for clubs and MAs',
      icon: Globe,
      color: 'text-blue-500',
      overall_progress: 72,
      target: 85,
      total_entities: 247,
      adopted_entities: 178,
      regional_data: canadianProvincesAndTerritories.map(province => ({
        region: province.abbreviation,
        region_name: province.name,
        total_clubs: Math.floor(Math.random() * 30) + 5,
        adopted_clubs: Math.floor(Math.random() * 25) + 3,
        adoption_rate: Math.floor(Math.random() * 40) + 60,
        status: Math.random() > 0.7 ? 'delayed' : Math.random() > 0.3 ? 'on_track' : 'completed',
        key_contact: `${province.abbreviation} Technical Lead`,
        blockers: Math.random() > 0.8 ? ['Training gaps', 'Technical issues'] : [],
        rollout_date: '2024-09-01',
        completion_date: Math.random() > 0.5 ? '2024-12-31' : null
      }))
    },
    the_button: {
      name: 'The Button (Fan Platform)',
      description: 'Fan engagement and loyalty platform',
      icon: Users,
      color: 'text-green-500',
      overall_progress: 89,
      target: 90,
      total_entities: 13,
      adopted_entities: 12,
      regional_data: canadianProvincesAndTerritories.map(province => ({
        region: province.abbreviation,
        region_name: province.name,
        total_clubs: Math.floor(Math.random() * 30) + 5,
        adopted_clubs: Math.floor(Math.random() * 28) + 4,
        adoption_rate: Math.floor(Math.random() * 20) + 80,
        status: Math.random() > 0.8 ? 'delayed' : 'completed',
        key_contact: `${province.abbreviation} Marketing Lead`,
        blockers: Math.random() > 0.9 ? ['Content localization'] : [],
        rollout_date: '2024-06-01',
        completion_date: '2024-08-31'
      }))
    },
    scoring_hub: {
      name: 'Live Scoring Hub',
      description: 'Real-time scoring and statistics platform',
      icon: BarChart3,
      color: 'text-purple-500',
      overall_progress: 45,
      target: 75,
      total_entities: 156,
      adopted_entities: 70,
      regional_data: canadianProvincesAndTerritories.map(province => ({
        region: province.abbreviation,
        region_name: province.name,
        total_clubs: Math.floor(Math.random() * 20) + 3,
        adopted_clubs: Math.floor(Math.random() * 10) + 1,
        adoption_rate: Math.floor(Math.random() * 50) + 25,
        status: Math.random() > 0.6 ? 'delayed' : Math.random() > 0.3 ? 'on_track' : 'planning',
        key_contact: `${province.abbreviation} Events Coordinator`,
        blockers: Math.random() > 0.7 ? ['Hardware requirements', 'Volunteer training'] : [],
        rollout_date: '2025-01-15',
        completion_date: null
      }))
    },
    safe_sport: {
      name: 'Safe Sport Compliance',
      description: 'Safe Sport training and compliance tracking',
      icon: Shield,
      color: 'text-red-500',
      overall_progress: 94,
      target: 100,
      total_entities: 13,
      adopted_entities: 13,
      regional_data: canadianProvincesAndTerritories.map(province => ({
        region: province.abbreviation,
        region_name: province.name,
        total_clubs: Math.floor(Math.random() * 30) + 5,
        adopted_clubs: Math.floor(Math.random() * 30) + 5,
        adoption_rate: Math.floor(Math.random() * 15) + 85,
        status: 'completed',
        key_contact: `${province.abbreviation} Safe Sport Officer`,
        blockers: [],
        rollout_date: '2024-01-01',
        completion_date: '2024-03-31'
      }))
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-600', text: 'Completed', icon: CheckCircle },
      on_track: { color: 'bg-blue-600', text: 'On Track', icon: TrendingUp },
      delayed: { color: 'bg-yellow-600', text: 'Delayed', icon: Clock },
      at_risk: { color: 'bg-red-600', text: 'At Risk', icon: AlertTriangle },
      planning: { color: 'bg-gray-600', text: 'Planning', icon: Clock }
    };

    const config = statusConfig[status] || statusConfig.planning;
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const PlatformOverviewCard = ({ platformKey, platform }) => (
    <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <platform.icon className={`w-6 h-6 ${platform.color}`} />
            <div>
              <CardTitle className="text-lg">{platform.name}</CardTitle>
              <p className="text-sm text-brand-text-secondary">{platform.description}</p>
            </div>
          </div>
          {getStatusBadge(platform.overall_progress >= platform.target ? 'completed' : 
                          platform.overall_progress >= platform.target * 0.8 ? 'on_track' : 'delayed')}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-brand-text-secondary">Overall Adoption</span>
            <span className="text-sm font-bold text-brand-text-primary">
              {platform.overall_progress}% ({platform.adopted_entities}/{platform.total_entities})
            </span>
          </div>
          <Progress value={platform.overall_progress} className="h-2" />
          <div className="flex items-center justify-between mt-1 text-xs text-brand-text-secondary">
            <span>Current</span>
            <span>Target: {platform.target}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-brand-text-secondary">Regions Complete</div>
            <div className="font-bold text-brand-text-primary">
              {platform.regional_data.filter(r => r.status === 'completed').length}/{platform.regional_data.length}
            </div>
          </div>
          <div>
            <div className="text-brand-text-secondary">At Risk</div>
            <div className="font-bold text-brand-text-primary">
              {platform.regional_data.filter(r => r.blockers.length > 0).length}
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => setSelectedPlatform(platformKey)}
        >
          View Regional Details
        </Button>
      </CardContent>
    </Card>
  );

  const RegionalDetailView = () => {
    const platform = platformData[selectedPlatform];
    if (!platform) return null;

    const filteredData = selectedRegion === 'all' 
      ? platform.regional_data 
      : platform.regional_data.filter(r => r.region === selectedRegion);

    return (
      <div className="space-y-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <platform.icon className={`w-6 h-6 ${platform.color}`} />
                <div>
                  <CardTitle>{platform.name} - Regional Progress</CardTitle>
                  <p className="text-sm text-brand-text-secondary">{platform.description}</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setSelectedPlatform('all')}>
                Back to Overview
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredData.map((region) => (
            <Card key={region.region} className="bg-brand-card-bg border-brand-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{region.region}</CardTitle>
                    <p className="text-sm text-brand-text-secondary">{region.region_name}</p>
                  </div>
                  {getStatusBadge(region.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-brand-text-secondary">Adoption Rate</span>
                    <span className="text-sm font-bold text-brand-text-primary">
                      {region.adoption_rate}%
                    </span>
                  </div>
                  <Progress value={region.adoption_rate} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-brand-text-secondary">Total Clubs</div>
                    <div className="font-bold text-brand-text-primary">{region.total_clubs}</div>
                  </div>
                  <div>
                    <div className="text-brand-text-secondary">Adopted</div>
                    <div className="font-bold text-brand-text-primary">{region.adopted_clubs}</div>
                  </div>
                </div>

                <div className="text-sm">
                  <div className="text-brand-text-secondary mb-1">Key Contact</div>
                  <div className="text-brand-text-primary">{region.key_contact}</div>
                </div>

                {region.blockers.length > 0 && (
                  <div className="text-sm">
                    <div className="text-brand-text-secondary mb-1">Current Blockers</div>
                    <div className="space-y-1">
                      {region.blockers.map((blocker, index) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1">
                          {blocker}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Rollout Date:</span>
                    <span className="text-brand-text-primary">
                      {new Date(region.rollout_date).toLocaleDateString()}
                    </span>
                  </div>
                  {region.completion_date && (
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Completed:</span>
                      <span className="text-brand-text-primary">
                        {new Date(region.completion_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const RolloutTimeline = () => {
    const allPlatforms = Object.values(platformData);
    
    return (
      <div className="space-y-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Platform Rollout Timeline</CardTitle>
            <p className="text-sm text-brand-text-secondary">
              Strategic rollout schedule across all provinces and territories
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {allPlatforms.map((platform, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <platform.icon className={`w-6 h-6 ${platform.color}`} />
                    <div>
                      <h3 className="font-semibold text-brand-text-primary">{platform.name}</h3>
                      <p className="text-sm text-brand-text-secondary">{platform.description}</p>
                    </div>
                    <div className="ml-auto">
                      <Progress value={platform.overall_progress} className="w-32 h-2" />
                      <div className="text-xs text-brand-text-secondary mt-1 text-right">
                        {platform.overall_progress}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {canadianProvincesAndTerritories.map((province) => {
                      const regionData = platform.regional_data.find(r => r.region === province.abbreviation);
                      return (
                        <div key={province.abbreviation} className="flex items-center gap-2 text-sm">
                          <div className={`w-3 h-3 rounded-full ${
                            regionData?.status === 'completed' ? 'bg-green-500' :
                            regionData?.status === 'on_track' ? 'bg-blue-500' :
                            regionData?.status === 'delayed' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`} />
                          <span className="text-brand-text-primary">{province.abbreviation}</span>
                          <span className="text-brand-text-secondary text-xs">
                            {regionData?.adoption_rate}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-brand-red" />
          <div>
            <h3 className="text-xl font-bold text-brand-text-primary">Platform Adoption Center</h3>
            <p className="text-sm text-brand-text-secondary">
              Track rollout progress across all platforms and regions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {canadianProvincesAndTerritories.map((province) => (
                <SelectItem key={province.abbreviation} value={province.abbreviation}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsList className="bg-brand-card-bg">
          <TabsTrigger value="overview">Platform Overview</TabsTrigger>
          <TabsTrigger value="regional">Regional Details</TabsTrigger>
          <TabsTrigger value="timeline">Rollout Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {selectedPlatform === 'all' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(platformData).map(([key, platform]) => (
                <PlatformOverviewCard key={key} platformKey={key} platform={platform} />
              ))}
            </div>
          ) : (
            <RegionalDetailView />
          )}
        </TabsContent>

        <TabsContent value="regional" className="mt-6">
          <RegionalDetailView />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <RolloutTimeline />
        </TabsContent>
      </Tabs>
    </div>
  );
}