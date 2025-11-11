import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  Download, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Clock,
  TrendingUp,
  FileText
} from 'lucide-react';
import { SafeSportCompletion } from '@/api/entities';
import ResponsiveTabs from '../ui/ResponsiveTabs';

export default function AnalyticsCompliance() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [complianceData, setComplianceData] = useState({
    currentCertifications: 775,
    expired: 32,
    pending: 145,
    totalUsers: 952
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComplianceData();
  }, [selectedRegion]);

  const loadComplianceData = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from SafeSportCompletion entity
      // For now, using mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setComplianceData({
        currentCertifications: 775,
        expired: 32,
        pending: 145,
        totalUsers: 952
      });
    } catch (error) {
      console.error('Error loading compliance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // Mock export functionality
    alert('Exporting compliance report...');
  };

  const compliancePercentage = Math.round((complianceData.currentCertifications / complianceData.totalUsers) * 100);

  const analyticsTabsData = [
    {
      value: 'safesport',
      label: 'SafeSport Monitor',
      shortLabel: 'SafeSport',
      icon: Shield,
      content: (
        <div className="space-y-6">
          {/* Region Selection and Export - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-full sm:w-48 bg-brand-card-bg border-brand-border">
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="bc">British Columbia</SelectItem>
                  <SelectItem value="ab">Alberta</SelectItem>
                  <SelectItem value="sk">Saskatchewan</SelectItem>
                  <SelectItem value="mb">Manitoba</SelectItem>
                  <SelectItem value="on">Ontario</SelectItem>
                  <SelectItem value="qc">Quebec</SelectItem>
                  <SelectItem value="nb">New Brunswick</SelectItem>
                  <SelectItem value="ns">Nova Scotia</SelectItem>
                  <SelectItem value="pe">Prince Edward Island</SelectItem>
                  <SelectItem value="nl">Newfoundland</SelectItem>
                  <SelectItem value="yt">Yukon</SelectItem>
                  <SelectItem value="nt">Northwest Territories</SelectItem>
                  <SelectItem value="nu">Nunavut</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleExport}
              className="bg-brand-red hover:bg-red-700 text-white w-full sm:w-auto flex-shrink-0"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              <span className="truncate">Export</span>
            </Button>
          </div>

          {/* Stats Grid - Mobile Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1">
                  {complianceData.currentCertifications}
                </div>
                <p className="text-xs sm:text-sm text-brand-text-secondary">Current Certifications</p>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-red-400 mb-1">
                  {complianceData.expired}
                </div>
                <p className="text-xs sm:text-sm text-brand-text-secondary">Expired</p>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-1">
                  {complianceData.pending}
                </div>
                <p className="text-xs sm:text-sm text-brand-text-secondary">Pending</p>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">
                  {compliancePercentage}%
                </div>
                <p className="text-xs sm:text-sm text-brand-text-secondary">Compliance Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Overview */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg text-brand-text-primary">Compliance Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-brand-text-primary text-sm sm:text-base">Respect in Sport</span>
                </div>
                <Badge className="bg-green-600 text-white text-xs">
                  {Math.round((complianceData.currentCertifications / complianceData.totalUsers) * 100)}%
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <span className="text-brand-text-primary text-sm sm:text-base">Background Checks</span>
                </div>
                <Badge className="bg-yellow-600 text-white text-xs">
                  {Math.round(((complianceData.totalUsers - complianceData.pending) / complianceData.totalUsers) * 100)}%
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span className="text-brand-text-primary text-sm sm:text-base">Policy Acknowledgments</span>
                </div>
                <Badge className="bg-blue-600 text-white text-xs">92%</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Regional Breakdown */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg text-brand-text-primary">Regional Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { region: 'Ontario', compliance: 85, total: 342 },
                  { region: 'British Columbia', compliance: 78, total: 198 },
                  { region: 'Alberta', compliance: 91, total: 156 },
                  { region: 'Quebec', compliance: 73, total: 134 },
                  { region: 'Saskatchewan', compliance: 89, total: 122 }
                ].map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-brand-charcoal rounded">
                    <span className="text-brand-text-primary text-sm font-medium truncate flex-1 pr-2">
                      {data.region}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-brand-text-secondary">
                        {data.total} users
                      </span>
                      <Badge 
                        className={`text-xs ${
                          data.compliance >= 85 ? 'bg-green-600' : 
                          data.compliance >= 75 ? 'bg-yellow-600' : 'bg-red-600'
                        } text-white`}
                      >
                        {data.compliance}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      value: 'reporting',
      label: 'Grant Reporting',
      shortLabel: 'Grants',
      icon: FileText,
      content: (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Grant Reporting</h3>
            <p className="text-brand-text-secondary">Grant compliance reporting tools coming soon.</p>
          </CardContent>
        </Card>
      )
    },
    {
      value: 'sync',
      label: 'Data Sync Status',
      shortLabel: 'Sync',
      icon: TrendingUp,
      content: (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Data Sync Status</h3>
            <p className="text-brand-text-secondary">Real-time data synchronization monitoring coming soon.</p>
          </CardContent>
        </Card>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-4 pb-24 md:pb-8">
        <div className="h-8 bg-brand-card-bg rounded animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 bg-brand-card-bg rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-6 h-6 text-brand-red" />
          <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary">Analytics & Compliance</h2>
        </div>
        <p className="text-brand-text-secondary text-sm sm:text-base">
          Monitor compliance metrics and generate reports across all regions
        </p>
      </div>

      <ResponsiveTabs
        tabs={analyticsTabsData}
        defaultValue="safesport"
      />
    </div>
  );
}