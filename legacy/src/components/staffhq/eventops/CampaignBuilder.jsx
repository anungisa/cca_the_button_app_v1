import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { MarketingCampaign } from '@/api/entities';
import { SponsorCampaign } from '@/api/entities';
import { Event } from '@/api/entities';
import { 
  Megaphone, Target, Calendar, Users, DollarSign, 
  BarChart3, Settings, Zap, Eye, Edit, Trash2,
  Send, Share2, TrendingUp, Clock, CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';

const CampaignBuilder = ({ event }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    if (event) {
      loadCampaigns();
    }
  }, [event]);

  const loadCampaigns = async () => {
    try {
      const [marketingCampaigns, sponsorCampaigns] = await Promise.all([
        MarketingCampaign.filter({ event_id: event.id }),
        SponsorCampaign.filter({ event_id: event.id })
      ]);

      // Combine and normalize campaigns
      const allCampaigns = [
        ...marketingCampaigns.map(c => ({ ...c, type: 'marketing' })),
        ...sponsorCampaigns.map(c => ({ ...c, type: 'sponsor' }))
      ];

      setCampaigns(allCampaigns);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const CampaignCard = ({ campaign }) => {
    const statusColors = {
      'draft': 'bg-gray-600',
      'scheduled': 'bg-blue-600',
      'active': 'bg-green-600',
      'paused': 'bg-yellow-600',
      'completed': 'bg-gray-500'
    };

    const typeIcons = {
      'marketing': Megaphone,
      'sponsor': DollarSign
    };

    const TypeIcon = typeIcons[campaign.type];

    return (
      <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-brand-charcoal rounded-lg">
                <TypeIcon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg">{campaign.campaign_name || campaign.name}</CardTitle>
                <p className="text-sm text-brand-text-secondary capitalize">
                  {campaign.type} Campaign
                </p>
              </div>
            </div>
            <Badge className={`${statusColors[campaign.status]} text-white text-xs`}>
              {campaign.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-brand-text-secondary line-clamp-2">
              {campaign.description || campaign.campaign_description}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-brand-text-secondary">Target Audience</p>
                <p className="text-brand-text-primary capitalize">
                  {campaign.target_audience || 'General'}
                </p>
              </div>
              <div>
                <p className="text-brand-text-secondary">Budget</p>
                <p className="text-brand-text-primary">
                  ${(campaign.budget || campaign.campaign_budget || 0).toLocaleString()}
                </p>
              </div>
            </div>

            {campaign.launch_date && (
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-secondary">Launch Date:</span>
                <span className="text-brand-text-primary">
                  {format(new Date(campaign.launch_date), 'MMM d, yyyy')}
                </span>
              </div>
            )}

            {campaign.performance_metrics && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-brand-text-primary">Performance:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Reach:</span>
                    <span className="text-brand-text-primary">
                      {campaign.performance_metrics.reach?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Engagement:</span>
                    <span className="text-brand-text-primary">
                      {campaign.performance_metrics.engagement_rate ? 
                        `${(campaign.performance_metrics.engagement_rate * 100).toFixed(1)}%` : '0%'
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-3">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => setSelectedCampaign(campaign)}
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CreateCampaignModal = () => {
    const [formData, setFormData] = useState({
      campaign_name: '',
      description: '',
      type: 'marketing',
      target_audience: 'general',
      budget: '',
      launch_date: '',
      end_date: '',
      channels: ['email']
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const campaignData = {
          ...formData,
          event_id: event.id,
          budget: parseFloat(formData.budget) || 0,
          status: 'draft'
        };

        if (formData.type === 'marketing') {
          await MarketingCampaign.create(campaignData);
        } else {
          await SponsorCampaign.create(campaignData);
        }

        setShowCreateModal(false);
        loadCampaigns();
      } catch (error) {
        console.error('Failed to create campaign:', error);
        alert('Failed to create campaign');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-brand-card-bg border border-brand-border rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-brand-border">
            <h3 className="text-xl font-semibold text-brand-text-primary">Create Campaign</h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Campaign Name *</label>
              <Input
                value={formData.campaign_name}
                onChange={(e) => setFormData({...formData, campaign_name: e.target.value})}
                placeholder="e.g., Championship Marketing Push"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Campaign objectives and key messages..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Campaign Type</label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({...formData, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">Marketing Campaign</SelectItem>
                    <SelectItem value="sponsor">Sponsor Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Target Audience</label>
                <Select
                  value={formData.target_audience}
                  onValueChange={(value) => setFormData({...formData, target_audience: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Public</SelectItem>
                    <SelectItem value="curlers">Curlers</SelectItem>
                    <SelectItem value="youth">Youth</SelectItem>
                    <SelectItem value="coaches">Coaches</SelectItem>
                    <SelectItem value="clubs">Clubs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Budget (CAD)</label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Launch Date</label>
                <Input
                  type="date"
                  value={formData.launch_date}
                  onChange={(e) => setFormData({...formData, launch_date: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Campaign'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-brand-text-primary">Campaign Builder</h3>
          <p className="text-sm text-brand-text-secondary">
            Create and manage marketing campaigns for {event?.event_name}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Megaphone className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(campaign => (
            <CampaignCard key={`${campaign.type}-${campaign.id}`} campaign={campaign} />
          ))}
        </div>
      ) : (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-12 text-center">
            <Megaphone className="w-16 h-16 mx-auto mb-4 text-brand-text-secondary opacity-50" />
            <h3 className="text-xl font-semibold text-brand-text-primary mb-2">No Campaigns Yet</h3>
            <p className="text-brand-text-secondary mb-6">
              Create marketing and sponsor campaigns to promote your event.
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Megaphone className="w-4 h-4 mr-2" />
              Create First Campaign
            </Button>
          </CardContent>
        </Card>
      )}

      {showCreateModal && <CreateCampaignModal />}
    </div>
  );
};

export default CampaignBuilder;