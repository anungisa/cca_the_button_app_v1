
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Megaphone,
  FileText,
  Users,
  BarChart3,
  Calendar,
  Send,
  Eye,
  Edit2,
  Plus,
  Search,
  Globe,
  TrendingUp,
  Clock // Added Clock icon for media contacts
} from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../../utils/provinces';
import { MarketingCampaign } from '@/api/entities';
import { PressRelease } from '@/api/entities';
import { MediaContact } from '@/api/entities';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CampaignCard = ({ campaign, onEdit }) => {
  const getStatusColor = (status) => {
    const colors = {
      planning: 'bg-gray-500',
      review: 'bg-yellow-600',
      approved: 'bg-blue-600',
      published: 'bg-green-600',
      completed: 'bg-green-700',
      cancelled: 'bg-red-600'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'text-red-500',
      high: 'text-orange-500',
      medium: 'text-yellow-500',
      low: 'text-gray-500'
    };
    return colors[priority] || 'text-gray-500';
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-brand-text-primary">{campaign.campaign_name}</h3>
            <p className="text-sm text-brand-text-secondary mt-1">{campaign.description}</p>
          </div>
          <Badge className={`${getStatusColor(campaign.status)} text-white`}>
            {campaign.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-text-secondary">Target Date:</span>
            <span className="text-brand-text-primary">
              {new Date(campaign.target_date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-text-secondary">Priority:</span>
            <span className={`font-medium capitalize ${getPriorityColor(campaign.priority)}`}>
              {campaign.priority}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-text-secondary">Assigned:</span>
            <span className="text-brand-text-primary">{campaign.assigned_name || 'Unassigned'}</span>
          </div>
          {campaign.budget_allocated && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-text-secondary">Budget:</span>
              <span className="text-brand-text-primary">
                ${campaign.budget_allocated?.toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex gap-2 pt-2 border-t border-brand-border">
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onEdit(campaign)}>
              <Edit2 className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PressReleaseCard = ({ release }) => {
  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-500',
      review: 'bg-yellow-600',
      approved: 'bg-blue-600',
      published: 'bg-green-600',
      archived: 'bg-gray-600'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-brand-text-primary">{release.title}</h3>
            <p className="text-sm text-brand-text-secondary mt-1">{release.summary}</p>
          </div>
          <Badge className={`${getStatusColor(release.status)} text-white`}>
            {release.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-brand-text-secondary">Category:</span>
            <Badge variant="outline">{release.category?.replace(/_/g, ' ')}</Badge>
          </div>
          {release.publish_date && (
            <div className="flex items-center justify-between">
              <span className="text-brand-text-secondary">Publish Date:</span>
              <span className="text-brand-text-primary">
                {new Date(release.publish_date).toLocaleDateString()}
              </span>
            </div>
          )}
          <div className="flex gap-2 pt-2 border-t border-brand-border">
            <Button size="sm" variant="outline" className="flex-1">
              <Edit2 className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Send className="w-3 h-3 mr-1" />
              Distribute
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MediaContactCard = ({ contact, onEdit, onContact }) => {
  const getRelationshipColor = (strength) => {
    const colors = {
      cold: 'text-gray-400',
      warm: 'text-yellow-500',
      established: 'text-blue-500',
      champion: 'text-green-500'
    };
    return colors[strength] || 'text-gray-400';
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-brand-text-primary">{contact.contact_name}</h4>
            <p className="text-sm text-brand-text-secondary">{contact.outlet_name}</p>
            <p className="text-xs text-brand-text-secondary">{contact.role}</p>
          </div>
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className="text-xs">{contact.region}</Badge>
            <Badge variant="secondary" className="text-xs">{contact.beat?.replace(/_/g, ' ')}</Badge>
          </div>
        </div>
        
        <div className="space-y-2 text-sm mb-3">
          <div className="flex items-center justify-between">
            <span className="text-brand-text-secondary">Relationship:</span>
            <span className={`font-medium capitalize ${getRelationshipColor(contact.relationship_strength)}`}>
              {contact.relationship_strength}
            </span>
          </div>
          {contact.last_contacted_date && (
            <div className="flex items-center justify-between">
              <span className="text-brand-text-secondary">Last Contact:</span>
              <span className="text-brand-text-primary">
                {new Date(contact.last_contacted_date).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onContact(contact)}>
            <Send className="w-3 h-3 mr-1" />
            Contact
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(contact)}>
            <Edit2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CommunicationsCenter() {
  const { permissions } = usePermissions();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [campaigns, setCampaigns] = useState([]);
  const [pressReleases, setPressReleases] = useState([]);
  const [mediaContacts, setMediaContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCommunicationsData();
  }, [selectedRegion]);

  const loadCommunicationsData = async () => {
    setIsLoading(true);
    try {
      // Load campaigns
      let campaignData = await MarketingCampaign.list();
      if (selectedRegion !== 'all') {
        campaignData = campaignData.filter(c => c.ma_region === selectedRegion);
      }
      setCampaigns(campaignData || []);

      // Load press releases
      let pressData = await PressRelease.list();
      if (selectedRegion !== 'all') {
        pressData = pressData.filter(p => p.ma_region === selectedRegion);
      }
      setPressReleases(pressData || []);

      // Load media contacts
      let contactData = await MediaContact.list();
      if (selectedRegion !== 'all') {
        contactData = contactData.filter(c => c.region === selectedRegion);
      }
      setMediaContacts(contactData || []);

    } catch (error) {
      console.error('Error loading communications data:', error);
      // Generate sample data if entities don't exist
      generateSampleData();
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleData = () => {
    // Generate sample campaigns
    const sampleCampaigns = [
      {
        id: 'camp-1',
        campaign_name: 'Championship Social Media Blitz',
        description: 'Social media campaign for upcoming championship',
        status: 'planning',
        priority: 'high',
        target_date: '2024-03-15',
        assigned_name: 'Sarah Johnson',
        budget_allocated: 5000,
        ma_region: null
      },
      {
        id: 'camp-2',
        campaign_name: 'Youth Curling Outreach',
        description: 'Campaign to promote youth programs',
        status: 'approved',
        priority: 'medium',
        target_date: '2024-04-01',
        assigned_name: 'Mike Chen',
        budget_allocated: 3000,
        ma_region: 'ON'
      },
      {
        id: 'camp-3',
        campaign_name: 'Brand Awareness Campaign - BC',
        description: 'Regional brand awareness initiative for British Columbia',
        status: 'published',
        priority: 'medium',
        target_date: '2024-05-20',
        assigned_name: 'Alice Green',
        budget_allocated: 4500,
        ma_region: 'BC'
      }
    ];

    // Generate sample press releases
    const sampleReleases = [
      {
        id: 'pr-1',
        title: 'Curling Canada Announces New Partnership',
        summary: 'Major sponsorship deal signed with national partner',
        status: 'draft',
        category: 'partnership',
        publish_date: '2024-03-20',
        ma_region: null
      },
      {
        id: 'pr-2',
        title: 'Provincial Championship Results',
        summary: 'Championship concludes with exciting finals',
        status: 'published',
        category: 'championship_announcement',
        publish_date: '2024-02-28',
        ma_region: 'BC'
      },
      {
        id: 'pr-3',
        title: 'Upcoming Junior League Sign-ups',
        summary: 'Encouraging youth participation in curling',
        status: 'approved',
        category: 'event_announcement',
        publish_date: '2024-04-10',
        ma_region: 'ON'
      }
    ];

    // Generate sample media contacts
    const sampleContacts = [];
    
    // National contacts
    sampleContacts.push(
      {
        id: 'mc-nat-1',
        contact_name: 'Sarah Mitchell',
        outlet_name: 'CBC Sports',
        contact_email: 'sarah.mitchell@cbc.ca',
        role: 'Senior Sports Reporter',
        beat: 'sports_general',
        region: 'National',
        relationship_strength: 'established',
        last_contacted_date: '2024-02-15',
        tags: ['curling', 'winter-sports'],
        is_active: true
      },
      {
        id: 'mc-nat-2',
        contact_name: 'David Chen',
        outlet_name: 'TSN',
        contact_email: 'dchen@tsn.ca',
        role: 'Curling Specialist',
        beat: 'curling_specialist',
        region: 'National',
        relationship_strength: 'champion',
        last_contacted_date: '2024-02-20',
        tags: ['curling', 'championships'],
        is_active: true
      },
      {
        id: 'mc-nat-3',
        contact_name: 'Emily White',
        outlet_name: 'National Post',
        contact_email: 'emily.white@nationalpost.com',
        role: 'Features Writer',
        beat: 'lifestyle',
        region: 'National',
        relationship_strength: 'warm',
        last_contacted_date: '2023-11-01',
        tags: ['human-interest'],
        is_active: true
      }
    );

    // Regional contacts for each province
    canadianProvincesAndTerritories.forEach(province => {
      sampleContacts.push({
        id: `mc-${province.abbreviation}-1`,
        contact_name: `${province.name} Reporter`,
        outlet_name: `${province.name} Daily News`,
        contact_email: `sports@${province.abbreviation.toLowerCase()}news.ca`,
        role: 'Sports Editor',
        beat: 'local_news',
        region: province.abbreviation,
        relationship_strength: ['cold', 'warm', 'established'][Math.floor(Math.random() * 3)],
        last_contacted_date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tags: ['local-sports'],
        is_active: true
      });
      sampleContacts.push({
        id: `mc-${province.abbreviation}-2`,
        contact_name: `Podcast Host ${province.abbreviation}`,
        outlet_name: `${province.name} Sports Podcast`,
        contact_email: `podcast@${province.abbreviation.toLowerCase()}sports.com`,
        role: 'Podcast Host',
        beat: 'digital_media',
        region: province.abbreviation,
        relationship_strength: ['cold', 'warm'][Math.floor(Math.random() * 2)],
        last_contacted_date: new Date(Date.now() - Math.floor(Math.random() * 730) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tags: ['audio', 'online'],
        is_active: true
      });
    });

    setCampaigns(sampleCampaigns);
    setPressReleases(sampleReleases);
    setMediaContacts(sampleContacts);
  };

  const filteredCampaigns = campaigns.filter(c => 
    c.campaign_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReleases = pressReleases.filter(r => 
    r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContacts = mediaContacts.filter(c =>
    c.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.outlet_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.beat?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate analytics data
  const analyticsData = useMemo(() => {
    // Campaign performance data
    const campaignPerformance = [
      { name: 'Jan', campaigns: 4, reach: 12000, engagement: 850 },
      { name: 'Feb', campaigns: 6, reach: 18000, engagement: 1200 },
      { name: 'Mar', campaigns: 5, reach: 15000, engagement: 980 },
      { name: 'Apr', campaigns: 8, reach: 25000, engagement: 1800 },
      { name: 'May', campaigns: 7, reach: 22000, engagement: 1500 },
      { name: 'Jun', campaigns: 9, reach: 28000, engagement: 2100 }
    ];

    // Media coverage by type
    const coverageByType = [
      { name: 'Press Releases', value: 35, color: '#0088FE' },
      { name: 'Feature Stories', value: 25, color: '#00C49F' },
      { name: 'Event Coverage', value: 30, color: '#FFBB28' },
      { name: 'Interviews', value: 10, color: '#FF8042' }
    ];

    // Regional engagement
    const regionalEngagement = canadianProvincesAndTerritories.map(p => ({
      region: p.abbreviation,
      engagement: Math.floor(Math.random() * 5000) + 1000,
      campaigns: Math.floor(Math.random() * 10) + 2
    }));

    return {
      campaignPerformance,
      coverageByType,
      regionalEngagement,
      totalReach: campaignPerformance.reduce((sum, item) => sum + item.reach, 0),
      avgEngagement: Math.round(campaignPerformance.reduce((sum, item) => sum + item.engagement, 0) / campaignPerformance.length),
      mediaPickups: 156,
      socialShares: 2340
    };
  }, []);


  // Calculate stats
  const stats = [
    { 
      title: 'Active Campaigns', 
      value: campaigns.filter(c => ['planning', 'approved', 'published'].includes(c.status)).length,
      icon: Megaphone,
      color: 'text-blue-500'
    },
    { 
      title: 'Published PRs', 
      value: pressReleases.filter(p => p.status === 'published').length,
      icon: FileText,
      color: 'text-green-500'
    },
    { 
      title: 'Media Contacts', 
      value: mediaContacts.length,
      icon: Users,
      color: 'text-purple-500'
    },
    { 
      title: 'This Month Reach', 
      value: '45.2K',
      icon: TrendingUp,
      color: 'text-orange-500'
    }
  ];

  if (!permissions.canAccessMarketingCenter) {
    return (
      <div className="p-8 text-center">
        <Megaphone className="w-12 h-12 mx-auto text-brand-text-secondary mb-4" />
        <h2 className="text-xl font-bold text-brand-text-primary mb-2">Access Restricted</h2>
        <p className="text-brand-text-secondary">You don't have permission to access the Communications Center.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-brand-card-bg rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-brand-card-bg rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-brand-card-bg rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Megaphone className="w-8 h-8 text-brand-red" />
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">Communications Center</h2>
            <p className="text-brand-text-secondary">
              {selectedRegion === 'all' ? 'National' : getProvinceNameByAbbreviation(selectedRegion)} marketing & media management
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-brand-text-secondary" />
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
          <Button className="bg-brand-red hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-secondary">{stat.title}</p>
                  <p className="text-2xl font-bold text-brand-text-primary">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <Input
              placeholder="Search campaigns, press releases, or contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-brand-card-bg">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns ({filteredCampaigns.length})</TabsTrigger>
          <TabsTrigger value="press">Press Releases ({filteredReleases.length})</TabsTrigger>
          <TabsTrigger value="contacts">Media Contacts ({filteredContacts.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Recent Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredCampaigns.slice(0, 3).map(campaign => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
                      <div>
                        <p className="font-medium text-brand-text-primary">{campaign.campaign_name}</p>
                        <p className="text-sm text-brand-text-secondary">
                          {new Date(campaign.target_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`${campaign.status === 'published' ? 'bg-green-600' : 'bg-blue-600'} text-white`}>
                        {campaign.status}
                      </Badge>
                    </div>
                  ))}
                  {filteredCampaigns.length === 0 && (
                    <p className="text-center text-brand-text-secondary py-4">No campaigns found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Recent Press Releases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredReleases.slice(0, 3).map(release => (
                    <div key={release.id} className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
                      <div>
                        <p className="font-medium text-brand-text-primary">{release.title}</p>
                        <p className="text-sm text-brand-text-secondary">
                          {new Date(release.publish_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`${release.status === 'published' ? 'bg-green-600' : 'bg-yellow-600'} text-white`}>
                        {release.status}
                      </Badge>
                    </div>
                  ))}
                  {filteredReleases.length === 0 && (
                    <p className="text-center text-brand-text-secondary py-4">No press releases found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
          {filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCampaigns.map(campaign => (
                <CampaignCard 
                  key={campaign.id} 
                  campaign={campaign} 
                  onEdit={(c) => console.log('Edit campaign:', c)}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-8 text-center">
                <Megaphone className="w-12 h-12 mx-auto text-brand-text-secondary mb-4" />
                <h3 className="text-lg font-semibold text-brand-text-primary mb-2">No campaigns found</h3>
                <p className="text-brand-text-secondary">
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first campaign to get started'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="press" className="mt-6">
          {filteredReleases.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredReleases.map(release => (
                <PressReleaseCard key={release.id} release={release} />
              ))}
            </div>
          ) : (
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-brand-text-secondary mb-4" />
                <h3 className="text-lg font-semibold text-brand-text-primary mb-2">No press releases found</h3>
                <p className="text-brand-text-secondary">
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first press release to get started'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contacts" className="mt-6">
          <div className="space-y-6">
            {/* Contact Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-brand-text-secondary">Total Contacts</p>
                      <p className="text-2xl font-bold text-brand-text-primary">{filteredContacts.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-brand-text-secondary">Champions</p>
                      <p className="text-2xl font-bold text-brand-text-primary">
                        {filteredContacts.filter(c => c.relationship_strength === 'champion').length}
                      </p>
                    </div>
                    <Badge className="bg-green-600 text-white">High Value</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-brand-text-secondary">Specialists</p>
                      <p className="text-2xl font-bold text-brand-text-primary">
                        {filteredContacts.filter(c => c.beat === 'curling_specialist').length}
                      </p>
                    </div>
                    <Badge className="bg-purple-600 text-white">Expert</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-brand-text-secondary">Needs Follow-up</p>
                      <p className="text-2xl font-bold text-brand-text-primary">
                        {filteredContacts.filter(c => {
                          if (!c.last_contacted_date) return true;
                          const daysSince = (new Date() - new Date(c.last_contacted_date)) / (1000 * 60 * 60 * 24);
                          return daysSince > 90;
                        }).length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Media Contacts Grid */}
            {filteredContacts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredContacts.map(contact => (
                  <MediaContactCard 
                    key={contact.id}
                    contact={contact}
                    onEdit={(c) => console.log('Edit contact:', c)}
                    onContact={(c) => console.log('Contact:', c)}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 mx-auto text-brand-text-secondary mb-4" />
                  <h3 className="text-lg font-semibold text-brand-text-primary mb-2">No media contacts found</h3>
                  <p className="text-brand-text-secondary">
                    {searchTerm || selectedRegion !== 'all' 
                      ? 'Try adjusting your search terms or region filter' 
                      : 'Add your first media contact to get started'}
                  </p>
                  <Button className="mt-4 bg-brand-red hover:bg-red-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-brand-text-secondary">Total Reach</p>
                      <p className="text-2xl font-bold text-brand-text-primary">
                        {analyticsData.totalReach.toLocaleString()}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-brand-text-secondary">Avg Engagement</p>
                      <p className="text-2xl font-bold text-brand-text-primary">
                        {analyticsData.avgEngagement.toLocaleString()}
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-brand-text-secondary">Media Pickups</p>
                      <p className="text-2xl font-bold text-brand-text-primary">{analyticsData.mediaPickups}</p>
                    </div>
                    <FileText className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-brand-text-secondary">Social Shares</p>
                      <p className="text-2xl font-bold text-brand-text-primary">{analyticsData.socialShares}</p>
                    </div>
                    <Users className="w-8 h-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Campaign Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData.campaignPerformance}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3b3b3b" />
                      <XAxis dataKey="name" tick={{ fill: '#a0a0a0' }} />
                      <YAxis yAxisId="left" tick={{ fill: '#a0a0a0' }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: '#a0a0a0' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#2a2a2a', border: 'none', borderRadius: '4px' }} 
                        labelStyle={{ color: '#ffffff' }} 
                        itemStyle={{ color: '#ffffff' }}
                      />
                      <Bar yAxisId="left" dataKey="campaigns" fill="#3B82F6" name="Campaigns" />
                      <Line yAxisId="right" type="monotone" dataKey="reach" stroke="#10B981" strokeWidth={2} name="Reach" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Coverage Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.coverageByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analyticsData.coverageByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#2a2a2a', border: 'none', borderRadius: '4px' }} 
                        labelStyle={{ color: '#ffffff' }} 
                        itemStyle={{ color: '#ffffff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Regional Performance */}
            {selectedRegion === 'all' && (
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Regional Engagement Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={analyticsData.regionalEngagement}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3b3b3b" />
                      <XAxis dataKey="region" tick={{ fill: '#a0a0a0' }} />
                      <YAxis tick={{ fill: '#a0a0a0' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#2a2a2a', border: 'none', borderRadius: '4px' }} 
                        labelStyle={{ color: '#ffffff' }} 
                        itemStyle={{ color: '#ffffff' }}
                      />
                      <Bar dataKey="engagement" fill="#3B82F6" name="Engagement" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
