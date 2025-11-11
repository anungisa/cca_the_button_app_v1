import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Mail, 
  Phone, 
  Crown, 
  BarChart3, 
  Calendar,
  Edit3,
  Save,
  Plus,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import useSponsorAPI from '../hooks/useSponsorAPI';

const SPONSOR_TIERS = [
  { value: 'Bronze', color: 'bg-amber-600', benefits: ['Basic XP campaigns', 'Standard reporting'] },
  { value: 'Silver', color: 'bg-gray-400', benefits: ['Enhanced targeting', 'Priority support', '2x XP multiplier'] },
  { value: 'Gold', color: 'bg-yellow-500', benefits: ['Custom badges', 'Exclusive events', 'Advanced analytics'] },
  { value: 'Platinum', color: 'bg-purple-500', benefits: ['Homepage placement', 'Unlimited campaigns', 'Dedicated manager'] }
];

export default function SponsorProfileManager() {
  const [sponsors, setSponsors] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  
  const { getSponsorProfiles, getCampaigns, isLoading } = useSponsorAPI();

  useEffect(() => {
    loadSponsors();
  }, []);

  const loadSponsors = async () => {
    try {
      const profiles = await getSponsorProfiles();
      setSponsors(profiles);
      if (profiles.length > 0 && !selectedSponsor) {
        setSelectedSponsor(profiles[0]);
        setEditForm(profiles[0]);
      }
    } catch (error) {
      console.error('Error loading sponsors:', error);
    }
  };

  const handleSave = async () => {
    // In production, this would call an API to update the sponsor
    console.log('Updating sponsor:', editForm);
    setIsEditing(false);
    
    // Update local state
    const updatedSponsors = sponsors.map(s => 
      s.id === editForm.id ? editForm : s
    );
    setSponsors(updatedSponsors);
    setSelectedSponsor(editForm);
  };

  const getTierConfig = (tier) => {
    return SPONSOR_TIERS.find(t => t.value === tier) || SPONSOR_TIERS[0];
  };

  const SponsorCard = ({ sponsor, isActive, onClick }) => {
    const tierConfig = getTierConfig(sponsor.tier);
    
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`cursor-pointer transition-all duration-200 ${
          isActive ? 'ring-2 ring-brand-red' : ''
        }`}
        onClick={() => onClick(sponsor)}
      >
        <Card className={`bg-brand-card-bg border-brand-border ${isActive ? 'border-brand-red' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={sponsor.logo_url} 
                alt={sponsor.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold text-brand-text-primary">{sponsor.name}</h3>
                <Badge className={`${tierConfig.color} text-white text-xs`}>
                  <Crown className="w-3 h-3 mr-1" />
                  {sponsor.tier}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-brand-text-primary">{sponsor.active_campaigns}</p>
                <p className="text-xs text-brand-text-secondary">Active</p>
              </div>
              <div>
                <p className="text-lg font-bold text-brand-text-primary">
                  {(sponsor.total_xp_distributed / 1000).toFixed(1)}k
                </p>
                <p className="text-xs text-brand-text-secondary">XP Given</p>
              </div>
              <div>
                <p className="text-lg font-bold text-brand-text-primary">{sponsor.engagement_rate}%</p>
                <p className="text-xs text-brand-text-secondary">Engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const SponsorDetailView = () => {
    if (!selectedSponsor) return null;
    
    const tierConfig = getTierConfig(selectedSponsor.tier);
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedSponsor.logo_url} 
                  alt={selectedSponsor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-2xl font-bold text-brand-text-primary">
                    {isEditing ? (
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="bg-brand-charcoal border-brand-border text-brand-text-primary"
                      />
                    ) : (
                      selectedSponsor.name
                    )}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${tierConfig.color} text-white`}>
                      <Crown className="w-3 h-3 mr-1" />
                      {selectedSponsor.tier} Partner
                    </Badge>
                    <Badge variant="outline" className="border-brand-border text-brand-text-secondary">
                      {selectedSponsor.active_campaigns} Active Campaigns
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm(selectedSponsor);
                      }}
                      className="border-brand-border text-brand-text-secondary"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                    className="border-brand-border text-brand-text-secondary"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-brand-charcoal/50 p-4 rounded-lg text-center">
                <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-brand-text-primary">
                  {selectedSponsor.engagement_rate}%
                </p>
                <p className="text-sm text-brand-text-secondary">Engagement Rate</p>
              </div>
              
              <div className="bg-brand-charcoal/50 p-4 rounded-lg text-center">
                <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-brand-text-primary">
                  {(selectedSponsor.total_xp_distributed / 1000).toFixed(1)}k
                </p>
                <p className="text-sm text-brand-text-secondary">XP Distributed</p>
              </div>
              
              <div className="bg-brand-charcoal/50 p-4 rounded-lg text-center">
                <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-brand-text-primary">12.5k</p>
                <p className="text-sm text-brand-text-secondary">Users Reached</p>
              </div>
              
              <div className="bg-brand-charcoal/50 p-4 rounded-lg text-center">
                <BarChart3 className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-brand-text-primary">
                  {selectedSponsor.active_campaigns}
                </p>
                <p className="text-sm text-brand-text-secondary">Active Campaigns</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-brand-card-bg border-brand-border">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-2">
                    Company Bio
                  </label>
                  {isEditing ? (
                    <Textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      className="bg-brand-charcoal border-brand-border text-brand-text-primary"
                      rows={3}
                    />
                  ) : (
                    <p className="text-brand-text-secondary">{selectedSponsor.bio}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-text-primary mb-2">
                      Partnership Tier
                    </label>
                    {isEditing ? (
                      <Select 
                        value={editForm.tier} 
                        onValueChange={(value) => setEditForm({...editForm, tier: value})}
                      >
                        <SelectTrigger className="bg-brand-charcoal border-brand-border text-brand-text-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SPONSOR_TIERS.map(tier => (
                            <SelectItem key={tier.value} value={tier.value}>
                              {tier.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-brand-text-primary">{selectedSponsor.tier}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-text-primary mb-2">
                      Contact Person
                    </label>
                    {isEditing ? (
                      <Input
                        value={editForm.contact_person}
                        onChange={(e) => setEditForm({...editForm, contact_person: e.target.value})}
                        className="bg-brand-charcoal border-brand-border text-brand-text-primary"
                      />
                    ) : (
                      <p className="text-brand-text-primary">{selectedSponsor.contact_person}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-2">
                    Contact Email
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editForm.contact_email}
                      onChange={(e) => setEditForm({...editForm, contact_email: e.target.value})}
                      className="bg-brand-charcoal border-brand-border text-brand-text-primary"
                    />
                  ) : (
                    <p className="text-brand-text-primary">{selectedSponsor.contact_email}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="benefits">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Partnership Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-4 h-4 rounded-full ${tierConfig.color}`}></div>
                    <h3 className="font-semibold text-brand-text-primary">
                      {selectedSponsor.tier} Tier Benefits
                    </h3>
                  </div>
                  
                  <ul className="space-y-2">
                    {tierConfig.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-brand-text-secondary">
                        <div className="w-1.5 h-1.5 bg-brand-red rounded-full"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  {selectedSponsor.tier === 'Platinum' && (
                    <div className="mt-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                      <h4 className="font-semibold text-purple-300 mb-2">Exclusive Platinum Features</h4>
                      <ul className="text-sm text-purple-100 space-y-1">
                        <li>• Featured placement on homepage</li>
                        <li>• Custom XP multipliers (up to 5x)</li>
                        <li>• Dedicated account manager</li>
                        <li>• Priority campaign approval</li>
                        <li>• Advanced audience segmentation</li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="campaigns">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Campaign History
                  <Button 
                    size="sm" 
                    className="bg-brand-red hover:bg-red-700"
                    onClick={() => {/* Navigate to create campaign */}}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Campaign
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock campaign data */}
                  {[
                    { name: 'Summer Sweep Challenge', status: 'active', xp: 2500, engagement: 12.5 },
                    { name: 'Equipment Showcase', status: 'completed', xp: 1800, engagement: 8.3 },
                    { name: 'Youth Development Fund', status: 'paused', xp: 950, engagement: 6.1 }
                  ].map((campaign, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-brand-text-primary">{campaign.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            className={`text-xs ${
                              campaign.status === 'active' ? 'bg-green-600' :
                              campaign.status === 'completed' ? 'bg-blue-600' :
                              'bg-gray-600'
                            } text-white`}
                          >
                            {campaign.status}
                          </Badge>
                          <span className="text-xs text-brand-text-secondary">
                            {campaign.xp} XP • {campaign.engagement}% engagement
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-brand-text-secondary">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sponsor List */}
      <div className="lg:col-span-1">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-text-primary">Sponsors</h2>
            <Button 
              size="sm" 
              onClick={() => setShowAddForm(true)}
              className="bg-brand-red hover:bg-red-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {sponsors.map((sponsor) => (
            <SponsorCard
              key={sponsor.id}
              sponsor={sponsor}
              isActive={selectedSponsor?.id === sponsor.id}
              onClick={(sponsor) => {
                setSelectedSponsor(sponsor);
                setEditForm(sponsor);
                setIsEditing(false);
              }}
            />
          ))}
        </div>
      </div>

      {/* Sponsor Details */}
      <div className="lg:col-span-3">
        <SponsorDetailView />
      </div>
    </div>
  );
}