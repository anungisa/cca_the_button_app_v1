import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Building2, 
  Users, 
  DollarSign,
  ArrowLeft,
  Download,
  Calendar,
  MapPin
} from 'lucide-react';
import { SurveySubmission } from '@/api/entities';
import { SurveyBenchmark } from '@/api/entities';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SurveyAnalytics() {
  const [surveys, setSurveys] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedYear, selectedRegion]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [surveyData, benchmarkData] = await Promise.all([
        SurveySubmission.filter({ year: parseInt(selectedYear) }),
        SurveyBenchmark.filter({ year: parseInt(selectedYear) })
      ]);
      
      setSurveys(surveyData || []);
      setBenchmarks(benchmarkData || []);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    // Stub for export functionality
    console.log('Exporting survey analytics data...');
  };

  const getCompletionStats = () => {
    const total = surveys.length;
    const completed = surveys.filter(s => s.is_complete).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, completionRate };
  };

  const getRegionalBreakdown = () => {
    const breakdown = {};
    surveys.forEach(survey => {
      const region = survey.ma_region || 'Unknown';
      if (!breakdown[region]) {
        breakdown[region] = { total: 0, completed: 0 };
      }
      breakdown[region].total++;
      if (survey.is_complete) {
        breakdown[region].completed++;
      }
    });
    
    return Object.entries(breakdown).map(([region, data]) => ({
      region,
      ...data,
      completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
    }));
  };

  const getFinancialHealthBreakdown = () => {
    const healthCounts = { excellent: 0, good: 0, fair: 0, poor: 0, critical: 0 };
    
    surveys.forEach(survey => {
      const financialHealth = survey.survey_data?.financials?.financial_health;
      if (financialHealth && healthCounts.hasOwnProperty(financialHealth)) {
        healthCounts[financialHealth]++;
      }
    });
    
    return healthCounts;
  };

  const stats = getCompletionStats();
  const regionalData = getRegionalBreakdown();
  const financialHealth = getFinancialHealthBreakdown();
  const regions = [...new Set(surveys.map(s => s.ma_region))].filter(Boolean);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-charcoal p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(createPageUrl('ClubServicesHub'))}
              className="text-brand-text-secondary hover:text-brand-text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Club Services
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-brand-text-primary">Survey Analytics</h1>
              <p className="text-brand-text-secondary">Club survey data insights and benchmarks</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleExportData} className="bg-brand-red hover:bg-red-700">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-text-secondary">Total Surveys</p>
                  <p className="text-3xl font-bold text-brand-text-primary">{stats.total}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-text-secondary">Completed</p>
                  <p className="text-3xl font-bold text-brand-text-primary">{stats.completed}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-text-secondary">Completion Rate</p>
                  <p className="text-3xl font-bold text-brand-text-primary">{stats.completionRate}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-text-secondary">Regions Active</p>
                  <p className="text-3xl font-bold text-brand-text-primary">{regions.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="regional" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-brand-card-bg border-brand-border">
            <TabsTrigger value="regional">Regional Breakdown</TabsTrigger>
            <TabsTrigger value="financial">Financial Health</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          </TabsList>

          <TabsContent value="regional" className="mt-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Survey Completion by Region</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionalData.map((region) => (
                    <div key={region.region} className="p-4 bg-brand-charcoal/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-brand-text-primary">{region.region}</h4>
                        <Badge variant={region.completionRate >= 80 ? 'default' : 'secondary'}>
                          {region.completionRate}% Complete
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-brand-text-secondary">
                        <span>{region.completed} of {region.total} clubs</span>
                        <div className="w-32 bg-brand-charcoal/50 rounded-full h-2">
                          <div 
                            className="bg-brand-red h-2 rounded-full transition-all duration-300"
                            style={{ width: `${region.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="mt-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Financial Health Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {Object.entries(financialHealth).map(([health, count]) => (
                    <div key={health} className="text-center p-4 bg-brand-charcoal/50 rounded-lg">
                      <p className="text-2xl font-bold text-brand-text-primary">{count}</p>
                      <p className="text-sm text-brand-text-secondary capitalize">{health}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benchmarks" className="mt-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>National Benchmarks</CardTitle>
              </CardHeader>
              <CardContent>
                {benchmarks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {benchmarks.map((benchmark) => (
                      <div key={benchmark.id} className="p-4 bg-brand-charcoal/50 rounded-lg">
                        <h4 className="font-medium text-brand-text-primary mb-3">{benchmark.ma_region}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-brand-text-secondary">Avg Revenue</span>
                            <span className="text-sm font-medium text-brand-text-primary">
                              ${benchmark.revenue_benchmarks?.avg_total_revenue?.toLocaleString() || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-brand-text-secondary">Avg Members</span>
                            <span className="text-sm font-medium text-brand-text-primary">
                              {benchmark.membership_benchmarks?.avg_total_members || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-brand-text-secondary">Youth %</span>
                            <span className="text-sm font-medium text-brand-text-primary">
                              {benchmark.membership_benchmarks?.avg_youth_percentage || 'N/A'}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-brand-text-secondary py-8">
                    No benchmark data available for the selected year and region.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}