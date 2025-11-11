import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, AlertTriangle, CheckCircle, Users, FileText, Download } from 'lucide-react';
import { SafeSportCompletion, ComplianceItem } from '@/api/entities';

export default function CompliancePanel() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [complianceData, setComplianceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComplianceData();
  }, [selectedRegion]);

  const loadComplianceData = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      setComplianceData([
        { region: 'Ontario', current: 342, expired: 12, pending: 23, total: 377 },
        { region: 'British Columbia', current: 198, expired: 8, pending: 15, total: 221 },
        { region: 'Alberta', current: 156, expired: 5, pending: 12, total: 173 },
        { region: 'Quebec', current: 124, expired: 7, pending: 18, total: 149 }
      ]);
    } catch (error) {
      console.error('Error loading compliance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    alert('Exporting compliance report...');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
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
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-brand-text-primary">SafeSport Compliance</h3>
          <p className="text-sm text-brand-text-secondary">Monitor certification status across all regions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full sm:w-48 bg-brand-card-bg border-brand-border">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="bc">British Columbia</SelectItem>
              <SelectItem value="ab">Alberta</SelectItem>
              <SelectItem value="on">Ontario</SelectItem>
              <SelectItem value="qc">Quebec</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleExport}
            className="bg-brand-red hover:bg-red-700 text-white w-full sm:w-auto"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1">820</div>
            <p className="text-xs sm:text-sm text-brand-text-secondary">Current Certifications</p>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-red-400 mb-1">32</div>
            <p className="text-xs sm:text-sm text-brand-text-secondary">Expired</p>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-1">68</div>
            <p className="text-xs sm:text-sm text-brand-text-secondary">Pending</p>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">89%</div>
            <p className="text-xs sm:text-sm text-brand-text-secondary">Compliance Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Regional Breakdown */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-lg text-brand-text-primary">Regional Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {complianceData.map((region, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-brand-charcoal rounded-lg">
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-brand-text-primary text-sm sm:text-base truncate block">
                    {region.region}
                  </span>
                  <span className="text-xs text-brand-text-secondary">
                    {region.total} total users
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge className="bg-green-600 text-white text-xs">
                    {region.current}
                  </Badge>
                  <Badge className="bg-red-600 text-white text-xs">
                    {region.expired}
                  </Badge>
                  <Badge className="bg-yellow-600 text-white text-xs">
                    {region.pending}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}