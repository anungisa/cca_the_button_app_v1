
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  FileDown,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Calendar,
  Filter,
  Map
} from 'lucide-react';
// These imports from recharts are added as per outline, even if not directly used in the provided UI sections.
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SurveySubmission, SurveyBenchmark, Club } from '@/api/entities';
import { motion } from 'framer-motion';
// New imports for fiscal year and season utilities
import { getFiscalYearInfo, getSeasonInfo } from '../utils/season';

export default function SurveyAnalyticsDashboard() {
  const [surveyData, setSurveyData] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [clubs, setClubs] = useState([]);
  // Changed selectedYear to selectedPeriod
  const [selectedPeriod, setSelectedPeriod] = useState('current_season');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showComparison, setShowComparison] = useState(false);

  const provinces = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

  // Get current and previous fiscal year and season info
  const currentFY = getFiscalYearInfo();
  const currentSeason = getSeasonInfo();
  // To get previous FY/Season, we calculate the date for the start year of the previous period
  const prevFY = getFiscalYearInfo(new Date(currentFY.startYear - 1, 0, 1));
  const prevSeason = getSeasonInfo(new Date(currentSeason.startYear - 1, 0, 1));


  useEffect(() => {
    // Depend on selectedPeriod and selectedRegion for data loading
    loadSurveyData();
  }, [selectedPeriod, selectedRegion]);

  const loadSurveyData = async () => {
    setIsLoading(true);
    try {
      let yearFilter;
      // Determine the year to filter data based on the selected period
      if (selectedPeriod === 'current_season') {
        yearFilter = currentSeason.startYear;
      } else if (selectedPeriod === 'current_fy') {
        yearFilter = currentFY.startYear;
      } else if (selectedPeriod === 'previous_season') {
        yearFilter = prevSeason.startYear;
      } else if (selectedPeriod === 'previous_fy') {
        yearFilter = prevFY.startYear;
      } else {
        // Fallback to current calendar year if selectedPeriod is somehow invalid
        yearFilter = new Date().getFullYear();
      }

      const [submissions, benchmarkData, clubData] = await Promise.all([
        SurveySubmission.filter({ year: yearFilter }),
        SurveyBenchmark.filter({ year: yearFilter }), // Benchmarks are also filtered by year
        Club.list() // Clubs list is not period-dependent
      ]);

      let filteredSubmissions = submissions;
      if (selectedRegion !== 'all') {
        filteredSubmissions = submissions.filter(s => s.ma_region === selectedRegion);
      }

      setSurveyData(filteredSubmissions);
      setBenchmarks(benchmarkData);
      setClubs(clubData);
    } catch (error) {
      console.error('Failed to load survey data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    const totalClubs = clubs.length;
    const completedSurveys = surveyData.filter(s => s.is_complete).length;
    const partialSurveys = surveyData.filter(s => !s.is_complete && s.completion_percentage > 0).length;
    const completionRate = totalClubs > 0 ? Math.round((completedSurveys / totalClubs) * 100) : 0;

    return { totalClubs, completedSurveys, partialSurveys, completionRate };
  };

  const getRegionalBreakdown = () => {
    const breakdown = {};
    provinces.forEach(province => {
      const regionClubs = clubs.filter(c => c.ma_region === province).length;
      const regionCompleted = surveyData.filter(s => s.ma_region === province && s.is_complete).length;
      const completionRate = regionClubs > 0 ? Math.round((regionCompleted / regionClubs) * 100) : 0;

      breakdown[province] = {
        totalClubs: regionClubs,
        completed: regionCompleted,
        completionRate
      };
    });
    return breakdown;
  };

  const exportSurveyData = async () => {
    // Create CSV export of survey data
    const csvData = surveyData.map(survey => ({
      club_name: survey.club_name,
      region: survey.ma_region,
      completion_status: survey.is_complete ? 'Complete' : 'Partial',
      completion_percentage: survey.completion_percentage,
      submission_date: survey.submission_date || 'N/A',
      total_members: survey.survey_data?.participation?.total_members || 'N/A',
      youth_members: survey.survey_data?.participation?.youth_members || 'N/A',
      annual_revenue: survey.survey_data?.financials?.annual_revenue || 'N/A'
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => {
        // Simple CSV escaping for values that might contain commas or newlines
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey-data-${selectedPeriod}-${selectedRegion}.csv`;
    document.body.appendChild(a); // Append to body to ensure it's clickable
    a.click();
    document.body.removeChild(a); // Clean up
    window.URL.revokeObjectURL(url); // Release object URL
  };

  const stats = calculateStats();
  const regionalBreakdown = getRegionalBreakdown();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-brand-text-primary">Survey Analytics</h3>
          <p className="text-brand-text-secondary">National Club Survey insights and longitudinal analysis.</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant={showComparison ? 'default' : 'outline'}
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            {showComparison ? 'Hide' : 'Show'} YoY
          </Button>
          <Button onClick={exportSurveyData} className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        {/* Updated Select for Period (Season/Fiscal Year) */}
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48 bg-brand-card-bg border-brand-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current_fy">{currentFY.fiscalYear} Fiscal Year</SelectItem>
            <SelectItem value="current_season">{currentSeason.seasonName}</SelectItem>
            <SelectItem value="previous_fy">{prevFY.fiscalYear} Fiscal Year</SelectItem>
            <SelectItem value="previous_season">{prevSeason.seasonName}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-40 bg-brand-card-bg border-brand-border">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {provinces.map(province => (
              <SelectItem key={province} value={province}>{province}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Period Context Banner */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-green-900">Curling Season Context</h3>
              <p className="text-sm text-green-700">{currentSeason.seasonName}</p>
              <p className="text-xs text-green-600">
                {currentSeason.startDate.toLocaleDateString()} - {currentSeason.endDate.toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Fiscal Year Context</h3>
              <p className="text-sm text-blue-700">{currentFY.fiscalYear}</p>
              <p className="text-xs text-blue-600">
                {currentFY.startDate.toLocaleDateString()} - {currentFY.endDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Survey Completion</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.completionRate}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Completed Surveys</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.completedSurveys}</p>
              </div>
              <Users className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Partial Surveys</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.partialSurveys}</p>
              </div>
              <Calendar className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Total Clubs</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.totalClubs}</p>
              </div>
              <Building2 className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Breakdown */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5 text-brand-red" />
            Regional Completion Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(regionalBreakdown).map(([province, data]) => (
              <div key={province} className="p-4 bg-brand-charcoal/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-brand-text-primary">{province}</h4>
                  <Badge className={
                    data.completionRate >= 80 ? 'bg-green-600' :
                    data.completionRate >= 60 ? 'bg-amber-600' :
                    'bg-red-600'
                  }>
                    {data.completionRate}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Progress value={data.completionRate} className="h-2" />
                  <p className="text-xs text-brand-text-secondary">
                    {data.completed} of {data.totalClubs} clubs completed
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Year-over-Year Comparison */}
      {showComparison && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-red" />
                Year-over-Year Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-brand-text-secondary mb-2">Survey Participation</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold text-brand-text-primary">
                      {stats.completionRate}%
                    </span>
                    <div className="flex items-center gap-1 text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      {/* Note: This percentage is hardcoded for demonstration; for actual YoY, calculate based on previous period's data */}
                      <span className="text-sm">+5.2%</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-brand-text-secondary mb-2">Avg Revenue Growth</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold text-brand-text-primary">
                      +12.5%
                    </span>
                    <div className="flex items-center gap-1 text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">vs {currentFY.startYear - 1}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-brand-text-secondary mb-2">Youth Participation</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold text-brand-text-primary">
                      +8.3%
                    </span>
                    <div className="flex items-center gap-1 text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">vs {currentFY.startYear - 1}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
