import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  TrendingUp,
  BarChart3,
  Globe,
  Calendar,
  Target,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../../utils/provinces';

export default function CommunityAnalyticsDashboard() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [timeframe, setTimeframe] = useState('current_year');
  const [isLoading, setIsLoading] = useState(false);

  // Sample data generation
  const generateSampleData = () => {
    const programTypes = ['clinic', 'league', 'camp', 'school_program'];
    const focusAreas = ['youth', 'gender_equity', 'indigenous', 'newcomers', 'adaptive'];
    
    const programs = canadianProvincesAndTerritories.flatMap(province => 
      Array.from({ length: 3 }, (_, i) => ({
        id: `prog-${province.abbreviation}-${i}`,
        name: `${province.name} ${programTypes[i % programTypes.length]}`,
        ma_region: province.abbreviation,
        program_type: programTypes[i % programTypes.length],
        focus_area: focusAreas[i % focusAreas.length],
        participant_count: Math.floor(Math.random() * 150) + 30,
        status: Math.random() > 0.3 ? 'active' : 'completed'
      }))
    );

    const initiatives = canadianProvincesAndTerritories.map(province => ({
      id: `init-${province.abbreviation}`,
      name: `${province.name} Youth Development`,
      ma_region: province.abbreviation,
      participant_count: Math.floor(Math.random() * 100) + 25,
      retention_rate: Math.floor(Math.random() * 40) + 60
    }));

    return { programs, initiatives };
  };

  const { programs, initiatives } = generateSampleData();

  // Analytics calculations
  const analyticsData = useMemo(() => {
    const filteredPrograms = selectedRegion === 'all' 
      ? programs 
      : programs.filter(p => p.ma_region === selectedRegion);

    const filteredInitiatives = selectedRegion === 'all'
      ? initiatives
      : initiatives.filter(i => i.ma_region === selectedRegion);

    // Regional data
    const regionalData = canadianProvincesAndTerritories.map(province => {
      const regionPrograms = programs.filter(p => p.ma_region === province.abbreviation);
      const regionInitiatives = initiatives.filter(i => i.ma_region === province.abbreviation);
      
      const totalParticipants = [
        ...regionPrograms.map(p => p.participant_count || 0),
        ...regionInitiatives.map(i => i.participant_count || 0)
      ].reduce((sum, count) => sum + count, 0);

      return {
        region: province.abbreviation,
        region_name: province.name,
        total_participants: totalParticipants,
        program_count: regionPrograms.length,
        initiative_count: regionInitiatives.length,
        avg_retention: regionInitiatives.length > 0 
          ? Math.round(regionInitiatives.reduce((sum, i) => sum + (i.retention_rate || 0), 0) / regionInitiatives.length)
          : 0
      };
    });

    // Program type distribution - simplified
    const programTypeData = [
      { type: 'Clinic', count: filteredPrograms.filter(p => p.program_type === 'clinic').length },
      { type: 'League', count: filteredPrograms.filter(p => p.program_type === 'league').length },
      { type: 'Camp', count: filteredPrograms.filter(p => p.program_type === 'camp').length },
      { type: 'School Program', count: filteredPrograms.filter(p => p.program_type === 'school_program').length }
    ].filter(item => item.count > 0);

    // Focus area distribution - simplified
    const focusAreaData = [
      { area: 'Youth', participants: filteredPrograms.filter(p => p.focus_area === 'youth').reduce((sum, p) => sum + p.participant_count, 0) },
      { area: 'Gender Equity', participants: filteredPrograms.filter(p => p.focus_area === 'gender_equity').reduce((sum, p) => sum + p.participant_count, 0) },
      { area: 'Indigenous', participants: filteredPrograms.filter(p => p.focus_area === 'indigenous').reduce((sum, p) => sum + p.participant_count, 0) },
      { area: 'Newcomers', participants: filteredPrograms.filter(p => p.focus_area === 'newcomers').reduce((sum, p) => sum + p.participant_count, 0) },
      { area: 'Adaptive', participants: filteredPrograms.filter(p => p.focus_area === 'adaptive').reduce((sum, p) => sum + p.participant_count, 0) }
    ].filter(item => item.participants > 0);

    // Initiative impact data - simplified
    const initiativeImpact = filteredInitiatives.slice(0, 10).map(initiative => ({
      name: initiative.name.length > 15 ? initiative.name.substring(0, 15) + '...' : initiative.name,
      participants: initiative.participant_count || 0,
      retention: initiative.retention_rate || 0
    }));

    // Overall statistics
    const totalParticipants = [
      ...filteredPrograms.map(p => p.participant_count || 0),
      ...filteredInitiatives.map(i => i.participant_count || 0)
    ].reduce((sum, count) => sum + count, 0);

    const avgRetention = filteredInitiatives.length > 0
      ? Math.round(filteredInitiatives.reduce((sum, i) => sum + (i.retention_rate || 0), 0) / filteredInitiatives.length)
      : 0;

    return {
      regional: regionalData,
      programTypes: programTypeData,
      focusAreas: focusAreaData,
      initiativeImpact: initiativeImpact,
      overall: {
        totalPrograms: filteredPrograms.length,
        totalInitiatives: filteredInitiatives.length,
        totalParticipants,
        avgRetention,
        activePrograms: filteredPrograms.filter(p => p.status === 'active').length
      }
    };
  }, [programs, initiatives, selectedRegion]);

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Community Analytics Dashboard</h2>
          <p className="text-brand-text-secondary">
            {selectedRegion === 'all' ? 'National' : getProvinceNameByAbbreviation(selectedRegion)} 
            {' '}community program analytics and insights
          </p>
        </div>
        <div className="flex items-center gap-3">
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Total Programs</p>
                <p className="text-2xl font-bold text-brand-text-primary">{analyticsData.overall.totalPrograms}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Total Participants</p>
                <p className="text-2xl font-bold text-brand-text-primary">{analyticsData.overall.totalParticipants.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Active Programs</p>
                <p className="text-2xl font-bold text-brand-text-primary">{analyticsData.overall.activePrograms}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Avg Retention</p>
                <p className="text2xl font-bold text-brand-text-primary">{analyticsData.overall.avgRetention}%</p>
              </div>
              <Target className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-brand-card-bg border-brand-border">
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="participation">
            <Users className="w-4 h-4 mr-2" />
            Participation
          </TabsTrigger>
          <TabsTrigger value="effectiveness">
            <Target className="w-4 h-4 mr-2" />
            Effectiveness
          </TabsTrigger>
          <TabsTrigger value="regional">
            <Globe className="w-4 h-4 mr-2" />
            Regional
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Program Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.programTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData.programTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Focus Areas Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.focusAreas}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="area" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="participants" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="participation" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Participation by Focus Area</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.focusAreas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="area" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="participants" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="effectiveness" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Initiative Impact Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsData.initiativeImpact.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analyticsData.initiativeImpact}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="participants" fill="#8884d8" name="Participants" />
                    <Bar dataKey="retention" fill="#82ca9d" name="Retention Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-brand-text-secondary">
                  No initiative data available for the selected region.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Regional Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.regional.slice(0, 10).map((region) => (
                  <div key={region.region} className="p-4 bg-brand-charcoal/30 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-brand-text-primary">{region.region_name}</h4>
                      <Badge variant="outline">{region.total_participants} participants</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-brand-text-secondary">
                      <div>
                        <span className="block">Programs</span>
                        <span className="font-medium text-brand-text-primary">{region.program_count}</span>
                      </div>
                      <div>
                        <span className="block">Initiatives</span>
                        <span className="font-medium text-brand-text-primary">{region.initiative_count}</span>
                      </div>
                      <div>
                        <span className="block">Avg Retention</span>
                        <span className="font-medium text-brand-text-primary">{region.avg_retention}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}