
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import {
  Shield,
  ClipboardList,
  AlertTriangle,
  GraduationCap,
  Plus,
  Gavel,
  Eye,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Globe
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';
import { SafeSportCompletion } from '@/api/entities';
import { SafeSportTraining } from '@/api/entities';
import { SafeSportPolicy } from '@/api/entities';

export default function SafeSportHub() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [timeframe, setTimeframe] = useState('current_year');
  const [viewMode, setViewMode] = useState('national');
  const [completionData, setCompletionData] = useState([]);
  const [trainingData, setTrainingData] = useState([]);
  const [policyData, setPolicyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    loadSafeSportData();
  }, [selectedRegion, timeframe]);

  const loadSafeSportData = async () => {
    setIsLoading(true);
    try {
      let completions = await SafeSportCompletion.list();
      let trainings = await SafeSportTraining.list();
      let policies = await SafeSportPolicy.list();

      // Filter by region if specified
      if (selectedRegion !== 'all') {
        completions = completions.filter(c => c.ma_region === selectedRegion);
      }

      setCompletionData(completions);
      setTrainingData(trainings);
      setPolicyData(policies);
    } catch (error) {
      console.error('Error loading Safe Sport data:', error);
      // Generate comprehensive sample data for all PTSOs
      setCompletionData(generateSampleCompletions());
      setTrainingData(generateSampleTrainings());
      setPolicyData(generateSamplePolicies());
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleCompletions = () => {
    const completions = [];
    const trainingTypes = ['respect_in_sport', 'nccp', 'concussion', 'mental_health', 'inclusion'];
    const userRoles = ['coach', 'official', 'volunteer', 'staff', 'athlete'];

    canadianProvincesAndTerritories.forEach(province => {
      // Generate multiple completions per province
      for (let i = 0; i < 50; i++) {
        completions.push({
          id: `comp-${province.abbreviation}-${i}`,
          user_id: `user-${province.abbreviation}-${i}`,
          training_id: trainingTypes[Math.floor(Math.random() * trainingTypes.length)],
          completion_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          expiry_date: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          status: Math.random() > 0.15 ? 'completed' : Math.random() > 0.5 ? 'expired' : 'renewed',
          ma_region: province.abbreviation,
          user_role: userRoles[Math.floor(Math.random() * userRoles.length)],
          score: Math.floor(Math.random() * 30) + 70
        });
      }
    });

    return completions;
  };

  const generateSampleTrainings = () => {
    return [
      {
        id: 'ris-1',
        module_name: 'Respect in Sport',
        training_type: 'respect_in_sport',
        target_roles: ['coach', 'official', 'volunteer'],
        is_mandatory: true,
        expiry_months: 60,
        completion_rate: 92
      },
      {
        id: 'nccp-1',
        module_name: 'NCCP Coaching Certification',
        training_type: 'nccp',
        target_roles: ['coach'],
        is_mandatory: true,
        expiry_months: 36,
        completion_rate: 87
      },
      {
        id: 'concussion-1',
        module_name: 'Concussion Awareness',
        training_type: 'concussion',
        target_roles: ['coach', 'official', 'staff'],
        is_mandatory: true,
        expiry_months: 24,
        completion_rate: 95
      },
      {
        id: 'mental-1',
        module_name: 'Mental Health First Aid',
        training_type: 'mental_health',
        target_roles: ['coach', 'staff'],
        is_mandatory: false,
        expiry_months: 36,
        completion_rate: 68
      },
      {
        id: 'inclusion-1',
        module_name: 'Inclusion and Diversity',
        training_type: 'inclusion',
        target_roles: ['coach', 'official', 'volunteer', 'staff'],
        is_mandatory: true,
        expiry_months: 48,
        completion_rate: 84
      }
    ];
  };

  const generateSamplePolicies = () => {
    const policies = [
      {
        id: 'pol-1',
        title: 'National Code of Conduct',
        policy_type: 'conduct_standard',
        version: '3.1',
        effective_date: '2024-01-01',
        status: 'active',
        compliance_mandatory: true,
        ma_region: null
      },
      {
        id: 'pol-2',
        title: 'National Abuse Prevention Policy',
        policy_type: 'abuse_prevention',
        version: '2.5',
        effective_date: '2024-01-01',
        status: 'active',
        compliance_mandatory: true,
        ma_region: null
      },
      {
        id: 'pol-3',
        title: 'National Inclusion Policy',
        policy_type: 'inclusion',
        version: '1.2',
        effective_date: '2024-03-01',
        status: 'under_review',
        compliance_mandatory: true,
        ma_region: null
      }
    ];
    // Add a specific policy for Ontario
    policies.push({
      id: 'pol-on-1',
      title: 'Ontario Rowan\'s Law Addendum',
      policy_type: 'legal_compliance',
      version: '1.0',
      effective_date: '2024-02-01',
      status: 'active',
      compliance_mandatory: true,
      ma_region: 'ON'
    });
    return policies;
  };

  // Calculate comprehensive analytics
  const analyticsData = React.useMemo(() => {
    const filteredCompletions = selectedRegion === 'all' 
      ? completionData 
      : completionData.filter(c => c.ma_region === selectedRegion);

    // Regional breakdown
    const regionalData = canadianProvincesAndTerritories.map(province => {
      const regionCompletions = completionData.filter(c => c.ma_region === province.abbreviation);
      const totalUsers = new Set(regionCompletions.map(c => c.user_id)).size;
      const completedTrainings = regionCompletions.filter(c => c.status === 'completed').length;
      const expiredTrainings = regionCompletions.filter(c => c.status === 'expired').length;
      
      return {
        region: province.abbreviation,
        region_name: province.name,
        total_users: totalUsers,
        completed: completedTrainings,
        expired: expiredTrainings,
        compliance_rate: totalUsers > 0 ? ((completedTrainings / regionCompletions.length) * 100).toFixed(1) : '0',
        completion_count: regionCompletions.length
      };
    });

    // Training completion rates
    const trainingCompletionData = trainingData.map(training => {
      const relevantCompletions = filteredCompletions.filter(c => c.training_id === training.training_type);
      const completedCount = relevantCompletions.filter(c => c.status === 'completed').length;
      const totalRequired = relevantCompletions.length;
      
      return {
        name: training.module_name,
        completion_rate: totalRequired > 0 ? ((completedCount / totalRequired) * 100).toFixed(1) : 0,
        completed: completedCount,
        total: totalRequired,
        is_mandatory: training.is_mandatory
      };
    });

    // Role-based completion
    const roleData = ['coach', 'official', 'volunteer', 'staff', 'athlete'].map(role => {
      const roleCompletions = filteredCompletions.filter(c => c.user_role === role);
      const completed = roleCompletions.filter(c => c.status === 'completed').length;
      
      return {
        role: role.charAt(0).toUpperCase() + role.slice(1),
        completed,
        total: roleCompletions.length,
        rate: roleCompletions.length > 0 ? ((completed / roleCompletions.length) * 100).toFixed(1) : 0
      };
    });

    // Overall stats
    const totalCompletions = filteredCompletions.length;
    const completedCount = filteredCompletions.filter(c => c.status === 'completed').length;
    const expiredCount = filteredCompletions.filter(c => c.status === 'expired').length;
    const overallComplianceRate = totalCompletions > 0 ? ((completedCount / totalCompletions) * 100).toFixed(1) : 0;

    return {
      regional: regionalData,
      trainingCompletion: trainingCompletionData,
      roleBreakdown: roleData,
      overall: {
        totalCompletions,
        completedCount,
        expiredCount,
        complianceRate: overallComplianceRate,
        uniqueUsers: new Set(filteredCompletions.map(c => c.user_id)).size
      }
    };
  }, [completionData, trainingData, selectedRegion]);
  
  const filteredPolicies = React.useMemo(() => {
      if (selectedRegion === 'all') return policyData;
      // Show national policies (ma_region is null) plus policies for the selected region
      return policyData.filter(p => !p.ma_region || p.ma_region === selectedRegion);
  }, [policyData, selectedRegion]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-600', text: 'Completed', icon: CheckCircle },
      expired: { color: 'bg-red-600', text: 'Expired', icon: AlertTriangle },
      renewed: { color: 'bg-blue-600', text: 'Renewed', icon: CheckCircle },
      pending: { color: 'bg-yellow-600', text: 'Pending', icon: Clock }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <config.icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const getComplianceColor = (rate) => {
    if (rate >= 95) return 'text-green-500';
    if (rate >= 85) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Mobile content renderer
  const renderMobileContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-4">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader><CardTitle className="text-base">Overall Compliance</CardTitle></CardHeader>
              <CardContent className="text-center">
                <div className={`text-4xl font-bold ${getComplianceColor(analyticsData.overall.complianceRate)}`}>
                  {analyticsData.overall.complianceRate}%
                </div>
                <p className="text-sm text-brand-text-secondary">National Average</p>
                <Progress value={analyticsData.overall.complianceRate} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader><CardTitle className="text-base">Training Status</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Completed</span>
                    <span className="font-semibold text-green-500">{analyticsData.overall.completedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expired</span>
                    <span className="font-semibold text-red-500">{analyticsData.overall.expiredCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users</span>
                    <span className="font-semibold">{analyticsData.overall.uniqueUsers}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'regional':
        return (
          <div className="space-y-3">
            {analyticsData.regional.slice(0, 6).map(region => (
              <Card key={region.region} className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-brand-text-primary">{region.region}</h4>
                    <Badge className={`${getComplianceColor(region.compliance_rate) === 'text-green-500' ? 'bg-green-600' : 
                      getComplianceColor(region.compliance_rate) === 'text-yellow-500' ? 'bg-yellow-600' : 'bg-red-600'} text-white`}>
                      {region.compliance_rate}%
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-brand-text-secondary">
                    <div className="flex justify-between">
                      <span>Users:</span>
                      <span>{region.total_users}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span>{region.completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expired:</span>
                      <span>{region.expired}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      
      default:
        return (
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-8 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-brand-text-secondary">Content coming soon</p>
            </CardContent>
          </Card>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-brand-card-bg rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-brand-card-bg rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-brand-card-bg rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header with Regional Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-brand-red" />
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">Safe Sport Hub</h2>
            <p className="text-brand-text-secondary">
              {selectedRegion === 'all' ? 'National' : getProvinceNameByAbbreviation(selectedRegion)} 
              {' '}compliance, training, and oversight
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
          <Button className="bg-brand-red hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Report Incident
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-2 md:mb-0">
                <p className="text-xs md:text-sm text-brand-text-secondary">Compliance Rate</p>
                <p className={`text-lg md:text-2xl font-bold ${getComplianceColor(analyticsData.overall.complianceRate)}`}>
                  {analyticsData.overall.complianceRate}%
                </p>
              </div>
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-400 self-end md:self-auto" />
            </div>
            <p className="text-xs text-brand-text-secondary md:hidden mt-1">+1.5% this month</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-2 md:mb-0">
                <p className="text-xs md:text-sm text-brand-text-secondary">Active Users</p>
                <p className="text-lg md:text-2xl font-bold text-brand-text-primary">
                  {analyticsData.overall.uniqueUsers}
                </p>
              </div>
              <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-400 self-end md:self-auto" />
            </div>
            <p className="text-xs text-brand-text-secondary md:hidden mt-1">Across all regions</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-2 md:mb-0">
                <p className="text-xs md:text-sm text-brand-text-secondary">Expired Training</p>
                <p className="text-lg md:text-2xl font-bold text-red-400">
                  {analyticsData.overall.expiredCount}
                </p>
              </div>
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-red-400 self-end md:self-auto" />
            </div>
            <p className="text-xs text-brand-text-secondary md:hidden mt-1">Need renewal</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-2 md:mb-0">
                <p className="text-xs md:text-sm text-brand-text-secondary">Policies Active</p>
                <p className="text-lg md:text-2xl font-bold text-purple-400">
                  {policyData.filter(p => p.status === 'active').length}
                </p>
              </div>
              <Gavel className="w-6 h-6 md:w-8 md:h-8 text-purple-400 self-end md:self-auto" />
            </div>
            <p className="text-xs text-brand-text-secondary md:hidden mt-1">Under review: {policyData.filter(p => p.status === 'under_review').length}</p>
          </CardContent>
        </Card>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full bg-brand-card-bg border-brand-border text-brand-text-primary h-12">
              <SelectValue>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Safe Sport Menu</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-brand-card-bg border-brand-border">
              <SelectItem value="dashboard" className="py-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5" />
                  <span>Dashboard</span>
                </div>
              </SelectItem>
              <SelectItem value="regional" className="py-3">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5" />
                  <span>Regional View</span>
                </div>
              </SelectItem>
              <SelectItem value="training" className="py-3">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5" />
                  <span>Training</span>
                </div>
              </SelectItem>
              <SelectItem value="policies" className="py-3">
                <div className="flex items-center gap-3">
                  <Gavel className="w-5 h-5" />
                  <span>Policies</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {renderMobileContent()}
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-brand-card-bg">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="regional" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Regional View</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Training</span>
            </TabsTrigger>
            <TabsTrigger value="policies" className="flex items-center gap-2">
              <Gavel className="w-4 h-4" />
              <span>Policies</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Training Completion Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.trainingCompletion.map((training, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-brand-text-primary">{training.name}</p>
                            {training.is_mandatory && (
                              <Badge className="bg-red-600 text-white text-xs">Mandatory</Badge>
                            )}
                          </div>
                          <span className="text-sm">{training.completion_rate}%</span>
                        </div>
                        <Progress value={training.completion_rate} className="h-2" />
                        <p className="text-xs text-brand-text-secondary mt-1">
                          {training.completed} of {training.total} completed
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Completion by Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analyticsData.roleBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="role" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="rate" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regional" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Regional Compliance Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.regional.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="compliance_rate" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Regional Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {analyticsData.regional.map((region, index) => (
                      <div key={region.region} className="p-3 bg-brand-charcoal/50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-brand-text-primary">{region.region_name}</h4>
                          <Badge className={`${getComplianceColor(region.compliance_rate) === 'text-green-500' ? 'bg-green-600' : 
                            getComplianceColor(region.compliance_rate) === 'text-yellow-500' ? 'bg-yellow-600' : 'bg-red-600'} text-white`}>
                            {region.compliance_rate}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-brand-text-secondary">
                          <div>
                            <span className="block">Users</span>
                            <span className="font-medium text-brand-text-primary">{region.total_users}</span>
                          </div>
                          <div>
                            <span className="block">Completed</span>
                            <span className="font-medium text-green-500">{region.completed}</span>
                          </div>
                          <div>
                            <span className="block">Expired</span>
                            <span className="font-medium text-red-500">{region.expired}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="training" className="mt-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Training Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingData.map((training, index) => (
                    <div key={training.id} className="p-4 bg-brand-charcoal/30 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-brand-text-primary">{training.module_name}</h4>
                          <p className="text-sm text-brand-text-secondary">
                            Target: {training.target_roles.join(', ')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {training.is_mandatory && (
                            <Badge className="bg-red-600 text-white">Mandatory</Badge>
                          )}
                          <Badge variant="outline">
                            {training.completion_rate || Math.floor(Math.random() * 30) + 70}% Complete
                          </Badge>
                        </div>
                      </div>
                      <Progress value={training.completion_rate || Math.floor(Math.random() * 30) + 70} className="mb-2" />
                      <p className="text-xs text-brand-text-secondary">
                        Expires every {training.expiry_months} months
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="mt-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Policy Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPolicies.map((policy, index) => (
                    <div key={policy.id} className="p-4 bg-brand-charcoal/30 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-brand-text-primary">{policy.title}</h4>
                          <p className="text-sm text-brand-text-secondary">Version: {policy.version}</p>
                          <p className="text-sm text-brand-text-secondary">Effective: {policy.effective_date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{policy.ma_region || 'National'}</Badge>
                          {getStatusBadge(policy.status)}
                          {policy.compliance_mandatory && (
                            <Badge className="bg-orange-600 text-white">Required</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
