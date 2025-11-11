import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  Download, 
  FileText,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Calendar,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useDomoEmbed } from './useDomoEmbed';
import { useXP } from '../XPContext';

export default function OrgAnalyticsDashboard({ user, dashboardConfig, organizationType }) {
  const [selectedFilters, setSelectedFilters] = useState({
    dateRange: '30d',
    club: 'all',
    ageGroup: 'all',
    program: 'all'
  });
  
  const [complianceData, setComplianceData] = useState({
    safeSportCompliance: 85,
    membershipGrowth: 12,
    youthEngagement: 68,
    eventParticipation: 92
  });

  const { 
    embedUrl, 
    isLoading, 
    error, 
    handleEmbedEvent,
    canExport 
  } = useDomoEmbed(dashboardConfig, user);
  
  const { awardPoints, awardBadge } = useXP();

  const handleExportCompliance = async () => {
    try {
      await awardPoints(200, 'analytics', 'Generated compliance report');
      await awardBadge('compliance_champion', 'Compliance Champion', 'Exported organizational compliance report');
      
      // Mock export functionality
      alert('Compliance report exported! Check your downloads.');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    
    // Award XP for advanced filter usage
    awardPoints(2, 'analytics', 'Applied analytics filter');
  };

  const getClubHealthScore = (metrics) => {
    const scores = [
      metrics.safeSportCompliance,
      metrics.membershipGrowth > 0 ? 100 : 50,
      metrics.youthEngagement,
      metrics.eventParticipation
    ];
    
    const average = scores.reduce((a, b) => a + b) / scores.length;
    
    if (average >= 90) return { score: 'Excellent', color: 'text-green-400', bg: 'bg-green-900/20' };
    if (average >= 75) return { score: 'Good', color: 'text-blue-400', bg: 'bg-blue-900/20' };
    if (average >= 60) return { score: 'Fair', color: 'text-amber-400', bg: 'bg-amber-900/20' };
    return { score: 'Needs Attention', color: 'text-red-400', bg: 'bg-red-900/20' };
  };

  const healthScore = getClubHealthScore(complianceData);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-brand-card-bg rounded-lg mb-6"></div>
          <div className="h-64 bg-brand-card-bg rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-brand-card-bg rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Health Score */}
      <Card className={`${healthScore.bg} border-brand-border`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-brand-text-primary mb-2">
                {organizationType === 'ma_admin' ? 'MA Analytics Dashboard' : 'Club Insights Dashboard'}
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand-text-secondary" />
                  <span className="text-brand-text-secondary text-sm">Health Score:</span>
                  <Badge className={`${healthScore.color} bg-transparent border-current`}>
                    {healthScore.score}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-text-secondary" />
                  <span className="text-brand-text-secondary text-sm">
                    {organizationType === 'ma_admin' ? 'Managing 47 Clubs' : '342 Active Members'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={handleExportCompliance}
                className="border-brand-border text-brand-text-secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button 
                variant="outline"
                className="border-brand-border text-brand-text-secondary"
              >
                <FileText className="w-4 h-4 mr-2" />
                Compliance PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-green-400" />
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-brand-text-primary">
              {complianceData.safeSportCompliance}%
            </div>
            <div className="text-sm text-brand-text-secondary">Safe Sport Certified</div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-brand-text-primary">
              +{complianceData.membershipGrowth}%
            </div>
            <div className="text-sm text-brand-text-secondary">Membership Growth</div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <div className="text-xs text-purple-400">U18</div>
            </div>
            <div className="text-2xl font-bold text-brand-text-primary">
              {complianceData.youthEngagement}%
            </div>
            <div className="text-sm text-brand-text-secondary">Youth Engagement</div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <CheckCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-brand-text-primary">
              {complianceData.eventParticipation}%
            </div>
            <div className="text-sm text-brand-text-secondary">Event Participation</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-text-secondary" />
              <span className="text-sm text-brand-text-secondary">Filters:</span>
            </div>
            
            <Select 
              value={selectedFilters.dateRange} 
              onValueChange={(value) => handleFilterChange('dateRange', value)}
            >
              <SelectTrigger className="w-32 bg-brand-charcoal border-brand-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>

            {organizationType === 'ma_admin' && (
              <Select 
                value={selectedFilters.club} 
                onValueChange={(value) => handleFilterChange('club', value)}
              >
                <SelectTrigger className="w-40 bg-brand-charcoal border-brand-border">
                  <SelectValue placeholder="All Clubs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clubs</SelectItem>
                  <SelectItem value="calgary_cc">Calgary Curling Club</SelectItem>
                  <SelectItem value="edmonton_gc">Edmonton Granite Club</SelectItem>
                  <SelectItem value="lethbridge_cc">Lethbridge Curling Club</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Select 
              value={selectedFilters.ageGroup} 
              onValueChange={(value) => handleFilterChange('ageGroup', value)}
            >
              <SelectTrigger className="w-32 bg-brand-charcoal border-brand-border">
                <SelectValue placeholder="All Ages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="youth">Youth (U18)</SelectItem>
                <SelectItem value="junior">Junior (18-25)</SelectItem>
                <SelectItem value="adult">Adult (25+)</SelectItem>
                <SelectItem value="senior">Senior (55+)</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={selectedFilters.program} 
              onValueChange={(value) => handleFilterChange('program', value)}
            >
              <SelectTrigger className="w-32 bg-brand-charcoal border-brand-border">
                <SelectValue placeholder="All Programs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="competitive">Competitive</SelectItem>
                <SelectItem value="recreational">Recreational</SelectItem>
                <SelectItem value="learn_to_curl">Learn to Curl</SelectItem>
                <SelectItem value="youth">Youth Programs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Embed */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-0">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="700"
              frameBorder="0"
              className="rounded-lg"
              onLoad={() => handleEmbedEvent({ type: 'org_dashboard_load' })}
            />
          ) : (
            <div className="p-8 text-center">
              <BarChart3 className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
              <p className="text-brand-text-secondary">Loading organizational dashboard...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-amber-900/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-brand-text-primary">
                    Safe Sport Renewals Due
                  </p>
                  <p className="text-xs text-brand-text-secondary">12 members need renewal</p>
                </div>
                <Badge className="bg-amber-600 text-white">High</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-brand-text-primary">
                    Membership Report Overdue
                  </p>
                  <p className="text-xs text-brand-text-secondary">Monthly report due in 3 days</p>
                </div>
                <Badge className="bg-blue-600 text-white">Medium</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-brand-text-primary">
                    100% Safe Sport Compliance Achieved
                  </p>
                  <p className="text-xs text-brand-text-secondary">2 days ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-900/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-brand-text-primary">
                    Youth Program Enrollment +25%
                  </p>
                  <p className="text-xs text-brand-text-secondary">This month</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}