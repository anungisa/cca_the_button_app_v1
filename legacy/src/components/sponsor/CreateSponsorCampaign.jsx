import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Eye, 
  MousePointer, 
  Share2, 
  QrCode,
  Target,
  Gift,
  ExternalLink,
  Award,
  Upload,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import useSponsorAPI from '../hooks/useSponsorAPI';

const ACTIVATION_TYPES = [
  { 
    value: 'watch_video', 
    label: 'Watch Video', 
    icon: Eye, 
    description: 'User watches sponsored content',
    xp_range: [25, 100]
  },
  { 
    value: 'visit_url', 
    label: 'Visit Website', 
    icon: ExternalLink, 
    description: 'Redirect to sponsor website',
    xp_range: [10, 50]
  },
  { 
    value: 'social_share', 
    label: 'Social Challenge', 
    icon: Share2, 
    description: 'Share sponsor content on social media',
    xp_range: [50, 200]
  },
  { 
    value: 'scan_qr', 
    label: 'Event QR Scan', 
    icon: QrCode, 
    description: 'Scan QR code at sponsored event',
    xp_range: [100, 500]
  }
];

const REWARD_TYPES = [
  { value: 'xp_only', label: 'XP Only', icon: Target },
  { value: 'badge', label: 'Badge + XP', icon: Award },
  { value: 'entry', label: 'Contest Entry', icon: Gift },
  { value: 'link_unlock', label: 'Unlock Content', icon: ExternalLink }
];

const TARGET_AUDIENCES = [
  { value: 'all', label: 'All Users' },
  { value: 'clubs', label: 'Club Members' },
  { value: 'mas', label: 'MA Officials' },
  { value: 'volunteers', label: 'Volunteers' },
  { value: 'hp', label: 'High Performance' },
  { value: 'youth', label: 'Youth (Under 18)' }
];

export default function CreateSponsorCampaign({ onSubmit, onCancel }) {
  const [campaign, setCampaign] = useState({
    sponsor_name: '',
    name: '',
    description: '',
    quest_type: 'watch_video',
    quest_payload: '',
    xp_reward: 50,
    start_date: '',
    end_date: '',
    target_audience: 'all',
    reward_type: 'xp_only',
    banner_url: '',
    badge_name: '',
    contest_details: ''
  });

  const [sponsorProfiles, setSponsorProfiles] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const { getSponsorProfiles, createCampaign, isLoading } = useSponsorAPI();

  useEffect(() => {
    loadSponsorProfiles();
  }, []);

  const loadSponsorProfiles = async () => {
    try {
      const profiles = await getSponsorProfiles();
      setSponsorProfiles(profiles);
    } catch (error) {
      console.error('Error loading sponsor profiles:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCampaign = await createCampaign(campaign);
      onSubmit(newCampaign);
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const getSelectedActivationType = () => {
    return ACTIVATION_TYPES.find(type => type.value === campaign.quest_type);
  };

  const CampaignPreview = () => (
    <Card className="bg-brand-charcoal border-brand-border">
      <CardHeader>
        <CardTitle className="text-sm">User View Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quest Card Preview */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-4 rounded-lg text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              {React.createElement(getSelectedActivationType()?.icon || Target, { className: "w-4 h-4" })}
            </div>
            <div>
              <h4 className="font-bold text-sm">{campaign.name || 'Campaign Name'}</h4>
              <p className="text-xs text-white/80">by {campaign.sponsor_name || 'Sponsor'}</p>
            </div>
          </div>
          <p className="text-sm text-white/90 mb-3">
            {campaign.description || 'Campaign description will appear here...'}
          </p>
          <div className="flex justify-between items-center">
            <Badge className="bg-amber-500 text-white">
              +{campaign.xp_reward} XP
            </Badge>
            <Button size="sm" className="bg-white/20 hover:bg-white/30">
              Start Quest
            </Button>
          </div>
        </div>

        {/* Audience Info */}
        <div className="text-xs text-brand-text-secondary">
          <p><strong>Audience:</strong> {TARGET_AUDIENCES.find(a => a.value === campaign.target_audience)?.label}</p>
          <p><strong>Duration:</strong> {campaign.start_date || 'TBD'} to {campaign.end_date || 'TBD'}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Form */}
      <div className="lg:col-span-2">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-red" />
              Create Sponsor Campaign
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-brand-text-primary">Campaign Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-text-primary mb-2">
                      Sponsor
                    </label>
                    <Select 
                      value={campaign.sponsor_name} 
                      onValueChange={(value) => setCampaign({...campaign, sponsor_name: value})}
                    >
                      <SelectTrigger className="bg-brand-charcoal border-brand-border text-brand-text-primary">
                        <SelectValue placeholder="Select sponsor" />
                      </SelectTrigger>
                      <SelectContent>
                        {sponsorProfiles.map(sponsor => (
                          <SelectItem key={sponsor.id} value={sponsor.name}>
                            {sponsor.name} ({sponsor.tier})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-text-primary mb-2">
                      Campaign Name
                    </label>
                    <Input
                      value={campaign.name}
                      onChange={(e) => setCampaign({...campaign, name: e.target.value})}
                      className="bg-brand-charcoal border-brand-border text-brand-text-primary"
                      placeholder="Summer Curling Challenge"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-2">
                    Description
                  </label>
                  <Textarea
                    value={campaign.description}
                    onChange={(e) => setCampaign({...campaign, description: e.target.value})}
                    className="bg-brand-charcoal border-brand-border text-brand-text-primary"
                    placeholder="Describe what users need to do to complete this quest..."
                    rows={3}
                  />
                </div>
              </div>

              <Separator className="bg-brand-border" />

              {/* Activation Setup */}
              <div className="space-y-4">
                <h3 className="font-semibold text-brand-text-primary">Activation Setup</h3>
                
                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-2">
                    Activation Type
                  </label>
                  <Select 
                    value={campaign.quest_type} 
                    onValueChange={(value) => setCampaign({...campaign, quest_type: value})}
                  >
                    <SelectTrigger className="bg-brand-charcoal border-brand-border text-brand-text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVATION_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getSelectedActivationType() && (
                    <p className="text-xs text-brand-text-secondary mt-1">
                      {getSelectedActivationType().description} • Suggested XP: {getSelectedActivationType().xp_range[0]}–{getSelectedActivationType().xp_range[1]}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-text-primary mb-2">
                      Content URL/Payload
                    </label>
                    <Input
                      value={campaign.quest_payload}
                      onChange={(e) => setCampaign({...campaign, quest_payload: e.target.value})}
                      className="bg-brand-charcoal border-brand-border text-brand-text-primary"
                      placeholder="https://example.com or QR code data"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-text-primary mb-2">
                      XP Reward
                    </label>
                    <Input
                      type="number"
                      value={campaign.xp_reward}
                      onChange={(e) => setCampaign({...campaign, xp_reward: parseInt(e.target.value)})}
                      className="bg-brand-charcoal border-brand-border text-brand-text-primary"
                      min="1"
                      max="1000"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-brand-border" />

              {/* Targeting & Rewards */}
              <div className="space-y-4">
                <h3 className="font-semibold text-brand-text-primary">Targeting & Rewards</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-text-primary mb-2">
                      Target Audience
                    </label>
                    <Select 
                      value={campaign.target_audience} 
                      onValueChange={(value) => setCampaign({...campaign, target_audience: value})}
                    >
                      <SelectTrigger className="bg-brand-charcoal border-brand-border text-brand-text-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TARGET_AUDIENCES.map(audience => (
                          <SelectItem key={audience.value} value={audience.value}>
                            {audience.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-text-primary mb-2">
                      Reward Type
                    </label>
                    <Select 
                      value={campaign.reward_type} 
                      onValueChange={(value) => setCampaign({...campaign, reward_type: value})}
                    >
                      <SelectTrigger className="bg-brand-charcoal border-brand-border text-brand-text-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REWARD_TYPES.map(reward => (
                          <SelectItem key={reward.value} value={reward.value}>
                            <div className="flex items-center gap-2">
                              <reward.icon className="w-4 h-4" />
                              <span>{reward.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-text-primary mb-2">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={campaign.start_date}
                      onChange={(e) => setCampaign({...campaign, start_date: e.target.value})}
                      className="bg-brand-charcoal border-brand-border text-brand-text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-text-primary mb-2">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={campaign.end_date}
                      onChange={(e) => setCampaign({...campaign, end_date: e.target.value})}
                      className="bg-brand-charcoal border-brand-border text-brand-text-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-brand-red hover:bg-red-700"
                >
                  {isLoading ? 'Creating...' : 'Create Campaign'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onCancel}
                  className="border-brand-border text-brand-text-secondary"
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="text-brand-text-secondary"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {previewMode ? 'Hide' : 'Show'} Preview
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Preview Panel */}
      <div className="space-y-6">
        <CampaignPreview />
        
        {/* Quick Stats */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="text-sm">Expected Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-brand-text-secondary">Est. Reach:</span>
              <span className="text-brand-text-primary font-medium">
                {campaign.target_audience === 'all' ? '15,000+' : '2,500+'} users
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-text-secondary">XP Budget:</span>
              <span className="text-brand-text-primary font-medium">
                {(campaign.xp_reward * 250).toLocaleString()} XP
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-text-secondary">Duration:</span>
              <span className="text-brand-text-primary font-medium">
                {campaign.start_date && campaign.end_date ? 
                  `${Math.ceil((new Date(campaign.end_date) - new Date(campaign.start_date)) / (1000 * 60 * 60 * 24))} days` : 
                  'TBD'
                }
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}