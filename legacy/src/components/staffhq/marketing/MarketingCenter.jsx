
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Changed 'Button' to 'button'
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { MarketingCampaign } from '@/api/entities';
import { PressRelease } from '@/api/entities';
import { SocialPost } from '@/api/entities';
import { BrandAsset } from '@/api/entities';
import { MediaContact } from '@/api/entities';
import { Megaphone, PlusCircle, Calendar, TrendingUp, FileText, Image, Send, Eye, Users, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import WorkflowEngine from '../../utils/WorkflowEngine';
import NotificationService from '../../utils/NotificationService';

const QuickStats = () => {
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    scheduledPosts: 0,
    mediaContacts: 0,
    brandAssets: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [campaigns, posts, contacts, assets] = await Promise.all([
        MarketingCampaign.filter({ status: 'approved' }),
        SocialPost.filter({ status: 'scheduled' }),
        MediaContact.filter({ is_active: true }),
        BrandAsset.filter({ is_active: true })
      ]);

      setStats({
        activeCampaigns: campaigns.length,
        scheduledPosts: posts.length,
        mediaContacts: contacts.length,
        brandAssets: assets.length
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = "text-blue-400" }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-brand-text-primary">{value}</p>
            <p className="text-sm font-medium text-brand-text-primary">{title}</p>
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-brand-card-bg rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        title="Active Campaigns"
        value={stats.activeCampaigns}
        icon={Megaphone}
        color="text-green-400"
      />
      <StatCard
        title="Scheduled Posts"
        value={stats.scheduledPosts}
        icon={Calendar}
        color="text-blue-400"
      />
      <StatCard
        title="Media Contacts"
        value={stats.mediaContacts}
        icon={Users}
        color="text-purple-400"
      />
      <StatCard
        title="Brand Assets"
        value={stats.brandAssets}
        icon={Image}
        color="text-amber-400"
      />
    </div>
  );
};

const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await MarketingCampaign.list('-target_date');
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const CreateCampaignModal = () => {
    const [formData, setFormData] = useState({
      campaign_name: '',
      campaign_type: 'event_promotion',
      priority: 'medium',
      target_date: '',
      description: '',
      target_audience: ['fans'],
      channels: ['website'],
      budget_allocated: '',
      auto_create_assets: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        const campaignData = {
          ...formData,
          budget_allocated: parseFloat(formData.budget_allocated) || 0,
          assigned_to: 'current_user',
          assigned_name: 'Marketing Team'
        };

        const newCampaign = await MarketingCampaign.create(campaignData);
        
        // Auto-create assets if requested
        if (formData.auto_create_assets) {
          await createCampaignAssets(newCampaign);
        }
        
        await WorkflowEngine.triggerWorkflow('marketing_campaign_created', {
          campaign_name: formData.campaign_name,
          campaign_type: formData.campaign_type,
          target_date: formData.target_date,
          priority: formData.priority
        });

        setShowCreateModal(false);
        loadCampaigns();
      } catch (error) {
        console.error('Failed to create campaign:', error);
        alert('Failed to create campaign. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const createCampaignAssets = async (campaign) => {
      try {
        // Create social media posts
        const socialPosts = [
          {
            platform: 'Twitter',
            content: `Exciting news! ${campaign.campaign_name} is coming soon. Stay tuned for more details! 🥌 #Curling`,
            status: 'draft'
          },
          {
            platform: 'Facebook',
            content: `We're thrilled to announce ${campaign.campaign_name}. Get ready for something amazing!`,
            status: 'draft'
          }
        ];

        for (const post of socialPosts) {
          await SocialPost.create(post);
        }

        // Create press release template
        await PressRelease.create({
          title: `${campaign.campaign_name} - Press Release`,
          category: 'championship_announcement',
          status: 'draft',
          content: `FOR IMMEDIATE RELEASE\n\n[Campaign content to be developed]`,
          author: 'Marketing Team'
        });

      } catch (error) {
        console.error('Failed to create campaign assets:', error);
      }
    };

    return (
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Marketing Campaign</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Campaign Name *</label>
                <Input
                  value={formData.campaign_name}
                  onChange={(e) => setFormData({...formData, campaign_name: e.target.value})}
                  placeholder="Enter campaign name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Campaign Type</label>
                <Select
                  value={formData.campaign_type}
                  onValueChange={(value) => setFormData({...formData, campaign_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="press_release">Press Release</SelectItem>
                    <SelectItem value="social_campaign">Social Campaign</SelectItem>
                    <SelectItem value="email_blast">Email Blast</SelectItem>
                    <SelectItem value="partnership_announcement">Partnership Announcement</SelectItem>
                    <SelectItem value="event_promotion">Event Promotion</SelectItem>
                    <SelectItem value="sponsor_activation">Sponsor Activation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Campaign description and objectives"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Target Date</label>
                <Input
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => setFormData({...formData, target_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({...formData, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Budget</label>
              <Input
                type="number"
                value={formData.budget_allocated}
                onChange={(e) => setFormData({...formData, budget_allocated: e.target.value})}
                placeholder="0.00"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Auto-create campaign assets</label>
              <Switch
                checked={formData.auto_create_assets}
                onCheckedChange={(checked) => setFormData({...formData, auto_create_assets: checked})}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Campaign'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const statusColors = {
    'planning': 'bg-gray-600',
    'review': 'bg-yellow-600',
    'approved': 'bg-blue-600',
    'published': 'bg-green-600',
    'completed': 'bg-purple-600',
    'cancelled': 'bg-red-600'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-brand-text-primary">Campaign Manager</h3>
        <Button onClick={() => setShowCreateModal(true)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-brand-charcoal rounded"></div>
                  <div className="h-3 bg-brand-charcoal rounded w-3/4"></div>
                  <div className="h-3 bg-brand-charcoal rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          campaigns.map(campaign => (
            <Card key={campaign.id} className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{campaign.campaign_name}</CardTitle>
                    <p className="text-sm text-brand-text-secondary">{campaign.campaign_type.replace('_', ' ')}</p>
                  </div>
                  <Badge className={`${statusColors[campaign.status]} text-white text-xs`}>
                    {campaign.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-brand-text-secondary line-clamp-2">
                    {campaign.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-text-secondary">
                      {campaign.target_date ? format(new Date(campaign.target_date), 'MMM d, yyyy') : 'No date set'}
                    </span>
                    <Badge className={
                      campaign.priority === 'urgent' ? 'bg-red-600' :
                      campaign.priority === 'high' ? 'bg-orange-600' :
                      campaign.priority === 'medium' ? 'bg-blue-600' :
                      'bg-gray-600'
                    }>
                      {campaign.priority}
                    </Badge>
                  </div>
                  {campaign.budget_allocated > 0 && (
                    <div className="text-sm text-brand-text-secondary">
                      Budget: ${campaign.budget_allocated.toLocaleString()}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Send className="w-4 h-4 mr-1" />
                      Launch
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <CreateCampaignModal />
    </div>
  );
};

const MediaContactsManager = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await MediaContact.filter({ is_active: true });
      setContacts(data);
    } catch (error) {
      console.error('Failed to load media contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.outlet_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'all' || contact.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  const regions = [...new Set(contacts.map(c => c.region))].filter(Boolean);

  const relationshipColors = {
    'champion': 'bg-green-600',
    'established': 'bg-blue-600',
    'warm': 'bg-yellow-600',
    'cold': 'bg-gray-600'
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Media Contacts ({filteredContacts.length})</CardTitle>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map(contact => (
            <Card key={contact.id} className="bg-brand-charcoal border-brand-border/50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-brand-text-primary">{contact.contact_name}</h4>
                      <p className="text-sm text-brand-text-secondary">{contact.outlet_name}</p>
                      <p className="text-xs text-brand-text-secondary">{contact.role}</p>
                    </div>
                    <Badge className={`${relationshipColors[contact.relationship_strength]} text-white text-xs`}>
                      {contact.relationship_strength}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-xs text-brand-text-secondary">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      {contact.contact_email}
                    </div>
                    {contact.contact_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {contact.contact_phone}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-8 text-brand-text-secondary">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No media contacts match your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SocialScheduler = () => {
  const [socialPosts, setSocialPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSocialPosts();
  }, []);

  const loadSocialPosts = async () => {
    try {
      const data = await SocialPost.list('-scheduled_at');
      setSocialPosts(data.slice(0, 10)); // Show recent 10 posts
    } catch (error) {
      console.error('Failed to load social posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const platformIcons = {
    'Twitter': '🐦',
    'Facebook': '👥',
    'Instagram': '📸',
    'LinkedIn': '💼'
  };

  const statusColors = {
    'draft': 'bg-gray-600',
    'scheduled': 'bg-blue-600', 
    'published': 'bg-green-600',
    'error': 'bg-red-600'
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Social Media Scheduler
          </CardTitle>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-brand-charcoal rounded animate-pulse"></div>
            ))}
          </div>
        ) : socialPosts.length > 0 ? (
          <div className="space-y-4">
            {socialPosts.map(post => (
              <div key={post.id} className="p-4 bg-brand-charcoal rounded-lg flex items-start gap-4">
                <div className="w-8 h-8 bg-brand-red/10 rounded-full flex items-center justify-center">
                  <span>{platformIcons[post.platform] || '📱'}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={statusColors[post.status]}>
                      {post.status}
                    </Badge>
                    <span className="text-sm text-brand-text-secondary">
                      {post.platform}
                    </span>
                  </div>
                  <p className="text-brand-text-primary text-sm line-clamp-2">
                    {post.content}
                  </p>
                  {post.scheduled_at && (
                    <p className="text-xs text-brand-text-secondary mt-2">
                      {post.status === 'scheduled' ? 'Scheduled for: ' : 'Published: '}
                      {format(new Date(post.scheduled_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-brand-text-secondary">
            <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No social posts scheduled</p>
            <Button className="mt-4" size="sm">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create First Post
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const BrandAssetLibrary = () => {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const data = await BrandAsset.list('-created_date');
      setAssets(data.slice(0, 8)); // Show recent 8 assets
    } catch (error) {
      console.error('Failed to load brand assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const assetTypeIcons = {
    'logo': '🏷️',
    'video': '🎥',
    'photo': '📸',
    'template': '📄',
    'brand_guidelines': '📋'
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Brand Asset Library
          </CardTitle>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Upload Asset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-brand-charcoal rounded animate-pulse"></div>
            ))}
          </div>
        ) : assets.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {assets.map(asset => (
              <div key={asset.id} className="group cursor-pointer">
                <div className="aspect-square bg-brand-charcoal rounded-lg flex items-center justify-center mb-2 group-hover:bg-brand-border transition-colors">
                  <span className="text-2xl">
                    {assetTypeIcons[asset.asset_type] || '📁'}
                  </span>
                </div>
                <p className="text-sm text-brand-text-primary font-medium truncate">
                  {asset.asset_name}
                </p>
                <p className="text-xs text-brand-text-secondary">
                  {asset.asset_type.replace('_', ' ')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-brand-text-secondary">
            <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No brand assets available</p>
            <Button className="mt-4" size="sm">
              <PlusCircle className="w-4 h-4 mr-2" />
              Upload First Asset
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function MarketingCenter() {
  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-lg flex items-center justify-center">
          <Megaphone className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Marketing Center</h1>
          <p className="text-brand-text-secondary">Campaign management, content creation, and brand assets</p>
        </div>
      </div>

      <QuickStats />

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-brand-card-bg border-brand-border">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="media">Media Contacts</TabsTrigger>
          <TabsTrigger value="assets">Brand Assets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="mt-6">
          <CampaignManager />
        </TabsContent>
        
        <TabsContent value="social" className="mt-6">
          <SocialScheduler />
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <MediaContactsManager />
        </TabsContent>
        
        <TabsContent value="assets" className="mt-6">
          <BrandAssetLibrary />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-12 text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-brand-text-secondary opacity-50" />
              <h3 className="text-xl font-semibold text-brand-text-primary mb-2">Marketing Analytics</h3>
              <p className="text-brand-text-secondary">Campaign performance metrics and ROI analysis coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
