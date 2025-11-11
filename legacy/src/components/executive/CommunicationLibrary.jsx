import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  MessageSquare,
  FileText,
  BarChart3,
  Users,
  Award,
  TrendingUp,
  Download,
  Edit,
  Plus,
  Search,
  Filter,
  Eye,
  Share
} from 'lucide-react';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';

export default function CommunicationLibrary() {
  const [activeView, setActiveView] = useState('assets');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [communicationAssets, setCommunicationAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate comprehensive communication assets with regional coverage
  const generateCommunicationAssets = () => {
    const assetTypes = ['talking_points', 'impact_stats', 'testimonial', 'case_study', 'presentation', 'one_pager', 'video'];
    const audiences = ['clubs', 'mas', 'sponsors', 'board', 'staff', 'volunteers', 'fans', 'media'];

    const nationalAssets = [
      {
        id: 'platform_adoption_stats',
        title: 'Platform Adoption Success Stats',
        asset_type: 'impact_stats',
        target_audience: ['board', 'mas', 'sponsors'],
        content: 'National platform adoption has reached 72% across all provinces and territories, with significant improvements in operational efficiency and user engagement.',
        key_messages: [
          'Platform adoption exceeds 70% nationally',
          'User engagement up 45% year-over-year',
          'Operational efficiency improved by 30%',
          'All 13 Member Associations successfully onboarded'
        ],
        supporting_data: [
          { statistic: 'Platform Adoption Rate', value: '72%', source: 'Internal Analytics', date: '2024-01-20' },
          { statistic: 'User Engagement Growth', value: '45%', source: 'Platform Metrics', date: '2024-01-20' },
          { statistic: 'Efficiency Improvement', value: '30%', source: 'Operations Report', date: '2024-01-15' },
          { statistic: 'MA Onboarding', value: '100%', source: 'Rollout Tracker', date: '2024-01-10' }
        ],
        usage_context: 'Use in board presentations, sponsor meetings, and external communications to demonstrate digital transformation success',
        version: '2024.1',
        approval_status: 'approved',
        last_updated: '2024-01-20',
        created_by: 'Strategic Communications',
        approved_by: 'Executive Team',
        tags: ['digital transformation', 'success metrics', 'platform adoption'],
        regional_usage: canadianProvincesAndTerritories.map(p => ({
          region: p.abbreviation,
          usage_count: Math.floor(Math.random() * 20) + 5,
          last_used: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }))
      },
      {
        id: 'youth_engagement_success',
        title: 'Youth Engagement Initiative Success Story',
        asset_type: 'case_study',
        target_audience: ['clubs', 'mas', 'media', 'sponsors'],
        content: 'Our national youth engagement strategy has resulted in a 28% increase in youth participation across Canada, with particular success in Indigenous and newcomer communities.',
        key_messages: [
          'Youth participation increased 28% nationally',
          'Indigenous youth programs expanded to 8 provinces',
          'Newcomer programs established in major urban centers',
          'Future of Curling scholarship program launched'
        ],
        supporting_data: [
          { statistic: 'Youth Participation Growth', value: '28%', source: 'Program Metrics', date: '2024-01-18' },
          { statistic: 'Indigenous Programs', value: '8 provinces', source: 'Community Development', date: '2024-01-15' },
          { statistic: 'Newcomer Participants', value: '1,247', source: 'Outreach Programs', date: '2024-01-12' },
          { statistic: 'Scholarships Awarded', value: '$150,000', source: 'FTLOC Fund', date: '2024-01-10' }
        ],
        usage_context: 'Perfect for media interviews, community presentations, and sponsor activation events',
        version: '2024.1',
        approval_status: 'approved',
        last_updated: '2024-01-18',
        created_by: 'Community Development',
        approved_by: 'Communications Director',
        tags: ['youth development', 'community outreach', 'diversity', 'success story'],
        regional_usage: canadianProvincesAndTerritories.map(p => ({
          region: p.abbreviation,
          usage_count: Math.floor(Math.random() * 15) + 3,
          last_used: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }))
      }
    ];

    // Generate regional success stories
    const regionalAssets = canadianProvincesAndTerritories.map(province => ({
      id: `${province.abbreviation.toLowerCase()}_success_story`,
      title: `${province.name} Regional Success Highlights`,
      asset_type: 'testimonial',
      target_audience: ['clubs', 'mas', 'media'],
      content: `${province.name} has demonstrated exceptional leadership in our national initiatives, achieving remarkable results in platform adoption, community engagement, and volunteer development.`,
      key_messages: [
        `${province.name} leads in platform adoption`,
        'Strong volunteer community mobilization',
        'Innovative programming approaches',
        'Effective stakeholder engagement'
      ],
      supporting_data: [
        { statistic: 'Platform Adoption', value: `${Math.floor(Math.random() * 20) + 75}%`, source: 'Regional Analytics', date: '2024-01-15' },
        { statistic: 'Volunteer Growth', value: `${Math.floor(Math.random() * 30) + 15}%`, source: 'Volunteer Services', date: '2024-01-12' },
        { statistic: 'Community Events', value: `${Math.floor(Math.random() * 50) + 25}`, source: 'Event Tracking', date: '2024-01-10' },
        { statistic: 'Club Participation', value: `${Math.floor(Math.random() * 40) + 80}%`, source: 'Club Services', date: '2024-01-08' }
      ],
      usage_context: `Tailor for ${province.name} regional communications and local media engagement`,
      version: '2024.1',
      approval_status: 'approved',
      last_updated: '2024-01-15',
      created_by: `${province.abbreviation} Regional Team`,
      approved_by: 'Regional Communications Lead',
      tags: ['regional success', province.abbreviation.toLowerCase(), 'community engagement'],
      regional_usage: [{
        region: province.abbreviation,
        usage_count: Math.floor(Math.random() * 25) + 10,
        last_used: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }]
    }));

    // Generate audience-specific talking points
    const audienceAssets = audiences.map(audience => ({
      id: `${audience}_talking_points`,
      title: `${audience.charAt(0).toUpperCase() + audience.slice(1)} Communication Toolkit`,
      asset_type: 'talking_points',
      target_audience: [audience],
      content: `Tailored messaging framework for engaging with ${audience}, including key value propositions, common concerns, and success stories.`,
      key_messages: [
        `Value proposition for ${audience}`,
        'Addressing common concerns',
        'Success stories and testimonials',
        'Call-to-action messaging'
      ],
      supporting_data: [
        { statistic: 'Engagement Rate', value: `${Math.floor(Math.random() * 30) + 60}%`, source: 'Communications Analytics', date: '2024-01-20' },
        { statistic: 'Message Resonance', value: `${Math.floor(Math.random() * 20) + 75}%`, source: 'Feedback Surveys', date: '2024-01-18' },
        { statistic: 'Action Rate', value: `${Math.floor(Math.random() * 15) + 25}%`, source: 'Response Tracking', date: '2024-01-15' }
      ],
      usage_context: `Use when communicating with ${audience} stakeholders in any formal or informal setting`,
      version: '2024.1',
      approval_status: 'approved',
      last_updated: '2024-01-20',
      created_by: 'Strategic Communications',
      approved_by: 'Communications Director',
      tags: [audience, 'messaging', 'stakeholder engagement'],
      regional_usage: canadianProvincesAndTerritories.map(p => ({
        region: p.abbreviation,
        usage_count: Math.floor(Math.random() * 10) + 2,
        last_used: new Date(Date.now() - Math.random() * 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }))
    }));

    return [...nationalAssets, ...regionalAssets, ...audienceAssets];
  };

  const getAssetTypeIcon = (type) => {
    const icons = {
      talking_points: MessageSquare,
      impact_stats: BarChart3,
      testimonial: Users,
      case_study: FileText,
      presentation: FileText,
      one_pager: FileText,
      video: FileText
    };
    return icons[type] || FileText;
  };

  const getApprovalBadge = (status) => {
    const config = {
      draft: { color: 'bg-gray-600', text: 'Draft' },
      review: { color: 'bg-yellow-600', text: 'In Review' },
      approved: { color: 'bg-green-600', text: 'Approved' },
      archived: { color: 'bg-red-600', text: 'Archived' }
    };

    const { color, text } = config[status] || config.draft;
    return <Badge className={`${color} text-white`}>{text}</Badge>;
  };

  const filteredAssets = communicationAssets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || asset.asset_type === selectedType;
    const matchesAudience = selectedAudience === 'all' || asset.target_audience.includes(selectedAudience);
    const matchesRegion = selectedRegion === 'all' || 
                         (asset.regional_usage && asset.regional_usage.some(r => r.region === selectedRegion));
    return matchesSearch && matchesType && matchesAudience && matchesRegion;
  });

  const CommunicationAssetCard = ({ asset }) => {
    const IconComponent = getAssetTypeIcon(asset.asset_type);
    
    return (
      <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <IconComponent className="w-5 h-5 text-brand-red flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base leading-tight">{asset.title}</CardTitle>
              <p className="text-sm text-brand-text-secondary mt-1 line-clamp-2">
                {asset.content}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {asset.asset_type.replace('_', ' ')}
                </Badge>
                {getApprovalBadge(asset.approval_status)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-brand-text-secondary">Target Audience</div>
            <div className="flex flex-wrap gap-1">
              {asset.target_audience.map((audience, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {audience}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-brand-text-secondary">Key Messages</div>
            <ul className="text-xs text-brand-text-primary space-y-1">
              {asset.key_messages.slice(0, 2).map((message, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-brand-red">•</span>
                  <span>{message}</span>
                </li>
              ))}
              {asset.key_messages.length > 2 && (
                <li className="text-brand-text-secondary">
                  +{asset.key_messages.length - 2} more messages
                </li>
              )}
            </ul>
          </div>

          {asset.supporting_data && asset.supporting_data.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-brand-text-secondary">Key Statistics</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {asset.supporting_data.slice(0, 2).map((data, index) => (
                  <div key={index} className="bg-brand-charcoal p-2 rounded">
                    <div className="font-bold text-brand-text-primary">{data.value}</div>
                    <div className="text-brand-text-secondary text-xs">{data.statistic}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-brand-text-secondary">Last Updated</div>
              <div className="text-brand-text-primary">
                {new Date(asset.last_updated).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-brand-text-secondary">Version</div>
              <div className="text-brand-text-primary">{asset.version}</div>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-brand-border">
            <Button size="sm" variant="outline" className="flex-1">
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
            <Button size="sm" variant="outline">
              <Share className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const UsageAnalytics = () => {
    const totalUsage = communicationAssets.reduce((sum, asset) => 
      sum + (asset.regional_usage?.reduce((regionSum, region) => regionSum + region.usage_count, 0) || 0), 0
    );

    const topAssets = communicationAssets
      .map(asset => ({
        ...asset,
        totalUsage: asset.regional_usage?.reduce((sum, region) => sum + region.usage_count, 0) || 0
      }))
      .sort((a, b) => b.totalUsage - a.totalUsage)
      .slice(0, 5);

    const regionalUsage = canadianProvincesAndTerritories.map(province => ({
      region: province.abbreviation,
      region_name: province.name,
      usage: communicationAssets.reduce((sum, asset) => {
        const regionData = asset.regional_usage?.find(r => r.region === province.abbreviation);
        return sum + (regionData?.usage_count || 0);
      }, 0)
    })).sort((a, b) => b.usage - a.usage);

    return (
      <div className="space-y-6">
        {/* Usage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4 text-center">
              <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-text-primary">{communicationAssets.length}</div>
              <div className="text-sm text-brand-text-secondary">Total Assets</div>
            </CardContent>
          </Card>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-text-primary">{totalUsage}</div>
              <div className="text-sm text-brand-text-secondary">Total Usage</div>
            </CardContent>
          </Card>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-text-primary">
                {communicationAssets.filter(a => a.approval_status === 'approved').length}
              </div>
              <div className="text-sm text-brand-text-secondary">Approved Assets</div>
            </CardContent>
          </Card>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-text-primary">
                {Math.round(totalUsage / communicationAssets.length)}
              </div>
              <div className="text-sm text-brand-text-secondary">Avg. Usage per Asset</div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Assets */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Most Used Communication Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topAssets.map((asset, index) => (
                <div key={asset.id} className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={`w-6 h-6 p-0 flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-600' : index === 1 ? 'bg-gray-500' : index === 2 ? 'bg-amber-600' : 'bg-blue-600'
                    } text-white text-xs`}>
                      {index + 1}
                    </Badge>
                    <div>
                      <div className="font-medium text-brand-text-primary">{asset.title}</div>
                      <div className="text-sm text-brand-text-secondary">
                        {asset.asset_type.replace('_', ' ')} • {asset.target_audience.join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-brand-text-primary">{asset.totalUsage}</div>
                    <div className="text-sm text-brand-text-secondary">uses</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regional Usage */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Usage by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {regionalUsage.map((region, index) => (
                <div key={region.region} className="p-3 bg-brand-charcoal rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-brand-text-primary">{region.region}</span>
                    <span className="text-lg font-bold text-brand-text-primary">{region.usage}</span>
                  </div>
                  <div className="text-xs text-brand-text-secondary">{region.region_name}</div>
                  <div className="mt-2">
                    <div className="w-full bg-brand-border rounded-full h-2">
                      <div 
                        className="bg-brand-red h-2 rounded-full" 
                        style={{ width: `${Math.min((region.usage / Math.max(...regionalUsage.map(r => r.usage))) * 100, 100)}%` }}
                      ></div>
                    </div>
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
    const timer = setTimeout(() => {
      setCommunicationAssets(generateCommunicationAssets());
      setIsLoading(false);
    }, 1000);
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
          <MessageSquare className="w-6 h-6 text-brand-red" />
          <div>
            <h3 className="text-xl font-bold text-brand-text-primary">Communication Library</h3>
            <p className="text-sm text-brand-text-secondary">
              Centralized communication assets and messaging tools for all regions
            </p>
          </div>
        </div>
        <Button className="bg-brand-red hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Asset
        </Button>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="bg-brand-card-bg">
          <TabsTrigger value="assets">Communication Assets</TabsTrigger>
          <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="mt-6">
          <div className="space-y-6">
            {/* Filters */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                    <Input
                      placeholder="Search communication assets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Asset Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="talking_points">Talking Points</SelectItem>
                      <SelectItem value="impact_stats">Impact Stats</SelectItem>
                      <SelectItem value="testimonial">Testimonials</SelectItem>
                      <SelectItem value="case_study">Case Studies</SelectItem>
                      <SelectItem value="presentation">Presentations</SelectItem>
                      <SelectItem value="one_pager">One Pagers</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Audiences</SelectItem>
                      <SelectItem value="clubs">Clubs</SelectItem>
                      <SelectItem value="mas">Member Associations</SelectItem>
                      <SelectItem value="sponsors">Sponsors</SelectItem>
                      <SelectItem value="board">Board</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="volunteers">Volunteers</SelectItem>
                      <SelectItem value="fans">Fans</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Region" />
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
              </CardContent>
            </Card>

            {/* Asset Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAssets.map((asset) => (
                <CommunicationAssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <UsageAnalytics />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-brand-text-secondary mb-4" />
              <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
                Communication Templates Coming Soon
              </h3>
              <p className="text-brand-text-secondary">
                Pre-built templates for press releases, stakeholder communications, and regional messaging
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}