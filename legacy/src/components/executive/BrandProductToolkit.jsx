import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Star,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  Users,
  Zap,
  Award,
  Palette,
  FileImage,
  Video,
  FileText,
  Presentation
} from 'lucide-react';
import { canadianProvincesAndTerritories } from '../utils/provinces';

export default function BrandProductToolkit() {
  const [activeView, setActiveView] = useState('assets');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [brandAssets, setBrandAssets] = useState([]);
  const [productRoadmap, setProductRoadmap] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate comprehensive brand assets with regional considerations
  const generateBrandAssets = () => {
    const assetTypes = ['logo', 'brand_guidelines', 'template', 'photo', 'video', 'presentation'];
    const categories = ['national_brand', 'event_branding', 'regional_assets', 'templates', 'media_kit', 'social_media'];
    
    const nationalAssets = [
      {
        id: 'cc_primary_logo',
        asset_name: 'Curling Canada Primary Logo',
        asset_type: 'logo',
        category: 'national_brand',
        file_url: '/assets/brand/cc-logo-primary.svg',
        thumbnail_url: '/assets/brand/cc-logo-primary-thumb.jpg',
        description: 'Primary Curling Canada logo for official use',
        tags: ['logo', 'primary', 'official', 'curling canada'],
        audience: ['internal', 'public', 'media', 'sponsor'],
        license_type: 'royalty_free',
        usage_terms: 'Official Curling Canada communications only. Maintain minimum spacing and do not alter colors.',
        version: '2024.1',
        is_active: true,
        download_count: 1247,
        last_updated: '2024-01-15',
        regional_usage: canadianProvincesAndTerritories.map(p => ({
          region: p.abbreviation,
          usage_count: Math.floor(Math.random() * 50) + 10,
          compliance_score: Math.floor(Math.random() * 30) + 70
        }))
      },
      {
        id: 'cc_secondary_logo',
        asset_name: 'Curling Canada Secondary Logo',
        asset_type: 'logo',
        category: 'national_brand',
        file_url: '/assets/brand/cc-logo-secondary.svg',
        thumbnail_url: '/assets/brand/cc-logo-secondary-thumb.jpg',
        description: 'Secondary logo variation for space-constrained applications',
        tags: ['logo', 'secondary', 'compact', 'curling canada'],
        audience: ['internal', 'public', 'media'],
        license_type: 'royalty_free',
        usage_terms: 'Use when primary logo cannot fit. Maintain brand guidelines.',
        version: '2024.1',
        is_active: true,
        download_count: 892,
        last_updated: '2024-01-15',
        regional_usage: canadianProvincesAndTerritories.map(p => ({
          region: p.abbreviation,
          usage_count: Math.floor(Math.random() * 40) + 5,
          compliance_score: Math.floor(Math.random() * 25) + 75
        }))
      }
    ];

    // Generate regional and event-specific assets
    const eventAssets = [
      'Brier', 'Scotties', 'Mixed Doubles', 'U18', 'U21', 'Seniors', 'Masters'
    ].map((event, index) => ({
      id: `${event.toLowerCase().replace(' ', '_')}_brand_kit`,
      asset_name: `${event} Championship Brand Kit`,
      asset_type: 'brand_guidelines',
      category: 'event_branding',
      file_url: `/assets/events/${event.toLowerCase()}/brand-kit.zip`,
      thumbnail_url: `/assets/events/${event.toLowerCase()}/thumbnail.jpg`,
      description: `Complete branding package for ${event} championship`,
      tags: ['event', 'championship', event.toLowerCase(), 'brand kit'],
      audience: ['internal', 'media', 'sponsor'],
      license_type: 'rights_managed',
      usage_terms: `Event-specific usage only. Valid during ${event} championship season.`,
      version: '2024.1',
      is_active: true,
      download_count: Math.floor(Math.random() * 200) + 50,
      last_updated: '2024-02-01',
      regional_usage: canadianProvincesAndTerritories.map(p => ({
        region: p.abbreviation,
        usage_count: Math.floor(Math.random() * 20) + 2,
        compliance_score: Math.floor(Math.random() * 20) + 80
      }))
    }));

    // Generate regional-specific assets
    const regionalAssets = canadianProvincesAndTerritories.map(province => ({
      id: `${province.abbreviation.toLowerCase()}_regional_kit`,
      asset_name: `${province.name} Regional Brand Elements`,
      asset_type: 'template',
      category: 'regional_assets',
      file_url: `/assets/regional/${province.abbreviation}/brand-elements.zip`,
      thumbnail_url: `/assets/regional/${province.abbreviation}/thumbnail.jpg`,
      description: `Regional branding elements and templates for ${province.name}`,
      tags: ['regional', province.abbreviation.toLowerCase(), 'templates', 'localization'],
      audience: ['internal'],
      license_type: 'internal_use_only',
      usage_terms: `Regional use only within ${province.name}. Must comply with national brand guidelines.`,
      version: '2024.1',
      is_active: true,
      download_count: Math.floor(Math.random() * 30) + 10,
      last_updated: '2024-01-20',
      regional_usage: [{
        region: province.abbreviation,
        usage_count: Math.floor(Math.random() * 30) + 15,
        compliance_score: Math.floor(Math.random() * 15) + 85
      }]
    }));

    return [...nationalAssets, ...eventAssets, ...regionalAssets];
  };

  // Generate product roadmap items
  const generateProductRoadmap = () => {
    const platforms = ['the_button', 'curling_os', 'scoring_hub', 'mobile_app', 'streaming_platform'];
    const priorities = ['critical', 'high', 'medium', 'low'];
    const statuses = ['backlog', 'planned', 'in_development', 'testing', 'deployed'];

    return [
      {
        id: 'multi_language_support',
        feature_name: 'Multi-Language Platform Support',
        platform: 'the_button',
        initiative_type: 'new_feature',
        priority: 'high',
        status: 'in_development',
        description: 'Full French and English language support across all user interfaces',
        business_value: 'Enables full accessibility for French-speaking Canadians, particularly in Quebec',
        target_release: '2024 Q3',
        estimated_effort: 'l',
        progress_percentage: 65,
        stakeholders: ['Marketing', 'Community Development', 'QC Regional Team'],
        dependencies: ['Content translation system', 'Regional content management'],
        regional_impact: canadianProvincesAndTerritories.map(p => ({
          region: p.abbreviation,
          impact_level: p.abbreviation === 'QC' ? 'critical' : p.abbreviation === 'NB' ? 'high' : 'medium',
          user_benefit: p.abbreviation === 'QC' ? 'Primary language support' : 'Bilingual accessibility'
        })),
        submitted_by: 'Regional Engagement Team',
        assigned_team: 'Platform Development',
        completion_date: null
      },
      {
        id: 'indigenous_cultural_integration',
        feature_name: 'Indigenous Cultural Integration',
        platform: 'curling_os',
        initiative_type: 'enhancement',
        priority: 'high',
        status: 'planned',
        description: 'Cultural sensitivity features and Indigenous community engagement tools',
        business_value: 'Demonstrates commitment to Truth and Reconciliation, expands community reach',
        target_release: '2024 Q4',
        estimated_effort: 'xl',
        progress_percentage: 15,
        stakeholders: ['Community Development', 'Indigenous Relations', 'Legal'],
        dependencies: ['Community consultation', 'Cultural advisory board'],
        regional_impact: canadianProvincesAndTerritories.map(p => ({
          region: p.abbreviation,
          impact_level: ['NT', 'NU', 'YT', 'MB', 'SK'].includes(p.abbreviation) ? 'critical' : 'high',
          user_benefit: 'Enhanced cultural representation and community engagement'
        })),
        submitted_by: 'Indigenous Relations Committee',
        assigned_team: 'Community Platform Team',
        completion_date: null
      },
      {
        id: 'regional_event_customization',
        feature_name: 'Regional Event Customization Tools',
        platform: 'scoring_hub',
        initiative_type: 'new_feature',
        priority: 'medium',
        status: 'backlog',
        description: 'Allow regional customization of scoring interfaces and event branding',
        business_value: 'Empowers regions to maintain local identity while using national platform',
        target_release: '2025 Q1',
        estimated_effort: 'm',
        progress_percentage: 5,
        stakeholders: ['Regional Coordinators', 'Event Operations', 'Branding Team'],
        dependencies: ['Brand compliance framework', 'Regional approval workflow'],
        regional_impact: canadianProvincesAndTerritories.map(p => ({
          region: p.abbreviation,
          impact_level: 'high',
          user_benefit: 'Localized event presentation and regional pride'
        })),
        submitted_by: 'Regional Advisory Committee',
        assigned_team: 'TBD',
        completion_date: null
      }
    ];
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setBrandAssets(generateBrandAssets());
      setProductRoadmap(generateProductRoadmap());
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getAssetTypeIcon = (type) => {
    const icons = {
      logo: Palette,
      brand_guidelines: FileText,
      template: FileImage,
      photo: FileImage,
      video: Video,
      presentation: Presentation
    };
    return icons[type] || FileImage;
  };

  const getStatusBadge = (status) => {
    const config = {
      backlog: { color: 'bg-gray-600', text: 'Backlog' },
      planned: { color: 'bg-blue-600', text: 'Planned' },
      in_development: { color: 'bg-yellow-600', text: 'In Development' },
      testing: { color: 'bg-purple-600', text: 'Testing' },
      deployed: { color: 'bg-green-600', text: 'Deployed' }
    };

    const { color, text } = config[status] || config.backlog;
    return <Badge className={`${color} text-white`}>{text}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const config = {
      critical: { color: 'bg-red-600', text: 'Critical' },
      high: { color: 'bg-orange-600', text: 'High' },
      medium: { color: 'bg-yellow-600', text: 'Medium' },
      low: { color: 'bg-green-600', text: 'Low' }
    };

    const { color, text } = config[priority] || config.medium;
    return <Badge className={`${color} text-white`}>{text}</Badge>;
  };

  const filteredAssets = brandAssets.filter(asset => {
    const matchesSearch = asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesRegion = selectedRegion === 'all' || 
                         (asset.regional_usage && asset.regional_usage.some(r => r.region === selectedRegion));
    return matchesSearch && matchesCategory && matchesRegion;
  });

  const BrandAssetLibrary = () => (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
              <Input
                placeholder="Search brand assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="national_brand">National Brand</SelectItem>
                <SelectItem value="event_branding">Event Branding</SelectItem>
                <SelectItem value="regional_assets">Regional Assets</SelectItem>
                <SelectItem value="templates">Templates</SelectItem>
                <SelectItem value="media_kit">Media Kit</SelectItem>
                <SelectItem value="social_media">Social Media</SelectItem>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAssets.map((asset) => {
          const IconComponent = getAssetTypeIcon(asset.asset_type);
          
          return (
            <Card key={asset.id} className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <IconComponent className="w-5 h-5 text-brand-red flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm leading-tight">{asset.asset_name}</CardTitle>
                    <p className="text-xs text-brand-text-secondary mt-1 line-clamp-2">
                      {asset.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    {asset.asset_type.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    v{asset.version}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Downloads:</span>
                    <span className="text-brand-text-primary">{asset.download_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Updated:</span>
                    <span className="text-brand-text-primary">
                      {new Date(asset.last_updated).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">License:</span>
                    <span className="text-brand-text-primary text-xs">
                      {asset.license_type.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {asset.regional_usage && (
                  <div className="text-xs">
                    <div className="text-brand-text-secondary mb-1">Regional Usage</div>
                    <div className="text-brand-text-primary">
                      {asset.regional_usage.length} regions using this asset
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t border-brand-border">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const ProductRoadmapView = () => (
    <div className="space-y-6">
      {productRoadmap.map((item) => (
        <Card key={item.id} className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{item.feature_name}</CardTitle>
                <p className="text-sm text-brand-text-secondary mt-1">{item.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="outline">{item.platform.replace('_', ' ')}</Badge>
                  {getStatusBadge(item.status)}
                  {getPriorityBadge(item.priority)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-brand-text-secondary">Progress</div>
                <div className="text-2xl font-bold text-brand-text-primary">
                  {item.progress_percentage}%
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-brand-text-secondary">Target Release</div>
                <div className="text-brand-text-primary font-medium">{item.target_release}</div>
              </div>
              <div>
                <div className="text-brand-text-secondary">Effort Size</div>
                <div className="text-brand-text-primary font-medium">
                  {item.estimated_effort.toUpperCase()}
                </div>
              </div>
              <div>
                <div className="text-brand-text-secondary">Assigned Team</div>
                <div className="text-brand-text-primary font-medium">{item.assigned_team}</div>
              </div>
            </div>

            <div>
              <div className="text-sm text-brand-text-secondary mb-2">Business Value</div>
              <p className="text-sm text-brand-text-primary">{item.business_value}</p>
            </div>

            {item.regional_impact && (
              <div>
                <div className="text-sm text-brand-text-secondary mb-2">Regional Impact</div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                  {item.regional_impact.map((impact) => (
                    <div key={impact.region} className="text-xs p-2 bg-brand-charcoal rounded">
                      <div className="font-medium text-brand-text-primary">{impact.region}</div>
                      <div className={`text-xs ${
                        impact.impact_level === 'critical' ? 'text-red-400' :
                        impact.impact_level === 'high' ? 'text-orange-400' :
                        'text-blue-400'
                      }`}>
                        {impact.impact_level}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.dependencies.length > 0 && (
              <div>
                <div className="text-sm text-brand-text-secondary mb-2">Dependencies</div>
                <div className="flex flex-wrap gap-1">
                  {item.dependencies.map((dep, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {dep}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

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
          <Star className="w-6 h-6 text-brand-red" />
          <div>
            <h3 className="text-xl font-bold text-brand-text-primary">Brand & Product Toolkit</h3>
            <p className="text-sm text-brand-text-secondary">
              Brand assets and product development resources for all regions
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="bg-brand-card-bg">
          <TabsTrigger value="assets">Brand Asset Library</TabsTrigger>
          <TabsTrigger value="roadmap">Product Roadmap</TabsTrigger>
          <TabsTrigger value="guidelines">Brand Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="mt-6">
          <BrandAssetLibrary />
        </TabsContent>

        <TabsContent value="roadmap" className="mt-6">
          <ProductRoadmapView />
        </TabsContent>

        <TabsContent value="guidelines" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-brand-text-secondary mb-4" />
              <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
                Brand Guidelines Portal Coming Soon
              </h3>
              <p className="text-brand-text-secondary">
                Interactive brand guidelines and compliance tools for all regional teams
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}