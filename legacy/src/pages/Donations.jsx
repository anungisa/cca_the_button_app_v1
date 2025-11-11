
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Heart, 
  CreditCard, 
  DollarSign, 
  Users, 
  Share2,
  CheckCircle,
  Building,
  Trophy,
  Star,
  ShieldCheck,
  Target,
  BookOpen,
  Gift,
  Loader2,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";

const DonationHistory = ({ donations, title }) => {
  const safeDonations = Array.isArray(donations) ? donations : [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-brand-red" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {safeDonations.length > 0 ? (
          <div className="space-y-3">
            {safeDonations.slice(0, 5).map((donation) => (
              <div key={donation.id} className="border-l-2 border-brand-red pl-3 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-brand-charcoal">
                      ${donation.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {donation.campaign || "General Support"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(donation.created_date), "MMM d, yyyy")}
                    </div>
                  </div>
                  {!donation.anonymous && (
                    <Heart className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Heart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No donations yet.</p>
            <p className="text-gray-400 text-xs">Be the first to support Canadian curling!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Campaign icon mapping
const getCampaignIcon = (campaignName) => {
  const name = campaignName.toLowerCase();
  if (name.includes('youth') || name.includes('junior')) return Users;
  if (name.includes('girl') || name.includes('women')) return Trophy;
  if (name.includes('safe') || name.includes('sport')) return ShieldCheck;
  if (name.includes('club') || name.includes('facility')) return Building;
  if (name.includes('access') || name.includes('inclusion')) return Heart;
  if (name.includes('coach') || name.includes('training')) return BookOpen;
  if (name.includes('high') || name.includes('performance')) return Target;
  return Heart;
};

// Campaign image mapping
const getCampaignImage = (campaignName) => {
  const name = campaignName.toLowerCase();
  if (name.includes('youth') || name.includes('junior')) 
    return "https://images.unsplash.com/photo-1598448496850-7561f0326a54?q=80&w=600&auto=format&fit=crop";
  if (name.includes('girl') || name.includes('women')) 
    return "https://images.unsplash.com/photo-1594736797933-d0401ba0bf61?q=80&w=600&auto=format&fit=crop";
  if (name.includes('safe') || name.includes('sport')) 
    return "https://images.unsplash.com/photo-1559166631-ef2084400183?q=80&w=600&auto=format&fit=crop";
  if (name.includes('club') || name.includes('facility')) 
    return "https://images.unsplash.com/photo-1634453075338-04285871f109?q=80&w=600&auto=format&fit=crop";
  if (name.includes('coach') || name.includes('training')) 
    return "https://images.unsplash.com/photo-1571019613454-1cb2a99de769?q=80&w=600&auto=format&fit=crop";
  return "https://images.unsplash.com/photo-1609902726285-00668009f004?q=80&w=600&auto=format&fit=crop";
};

export default function Donations() {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [showImpactStory, setShowImpactStory] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    type: "one_time",
    donor_name: "",
    donor_email: "",
    anonymous: false,
    tax_receipt_required: true,
    monthly_amount: ""
  });

  // Load data once on mount
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        // Load user
        try {
          const userData = await base44.auth.me();
          if (mounted) {
            setUser(userData);
            setFormData(prev => ({
              ...prev,
              donor_name: userData.full_name || "",
              donor_email: userData.email || "",
              ma_region: userData.ma_region || ""
            }));
          }
        } catch (error) {
          console.log('User not authenticated');
        }

        // Load donations ONCE
        const donationData = await base44.entities.Donation.list('-created_date', 500);
        if (mounted) {
          setDonations(donationData || []);
          
          // Generate campaigns from donation data
          const campaignMap = {};
          
          donationData.forEach(donation => {
            const campaignName = donation.campaign || 'General Support';
            if (!campaignMap[campaignName]) {
              campaignMap[campaignName] = {
                id: campaignName.toLowerCase().replace(/\s+/g, '_'),
                title: campaignName,
                raised: 0,
                donorCount: new Set(),
                donations: []
              };
            }
            campaignMap[campaignName].raised += donation.amount;
            campaignMap[campaignName].donorCount.add(donation.donor_email);
            campaignMap[campaignName].donations.push(donation);
          });

          // Convert to campaign array
          const campaignList = Object.values(campaignMap).map((camp) => ({
            id: camp.id,
            title: camp.title,
            description: `Supporting ${camp.title} with ${camp.donorCount.size} donors contributing to this important cause.`,
            goal: Math.max(1000, Math.ceil(camp.raised * 1.5 / 1000) * 1000), // Set goal 50% higher than current, rounded to nearest 1000, min 1000
            raised: camp.raised,
            icon: getCampaignIcon(camp.title),
            image: getCampaignImage(camp.title),
            impact: `${camp.donorCount.size} supporter${camp.donorCount.size !== 1 ? 's' : ''} have contributed ${camp.donations.length} donation${camp.donations.length !== 1 ? 's' : ''}`,
            featured: false // Will be set after sorting
          }));

          // Sort by raised amount
          campaignList.sort((a, b) => b.raised - a.raised);
          
          // Mark top 2 campaigns as featured
          if (campaignList.length > 0) {
            campaignList[0].featured = true;
            if (campaignList.length > 1) {
              campaignList[1].featured = true;
            }
          }

          if (mounted) {
            setCampaigns(campaignList);
          }
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []); // Only run once on mount

  const refreshDonations = async () => {
    setIsLoading(true);
    try {
      const donationData = await base44.entities.Donation.list('-created_date', 500);
      setDonations(donationData || []);
      
      // Regenerate campaigns
      const campaignMap = {};
      
      donationData.forEach(donation => {
        const campaignName = donation.campaign || 'General Support';
        if (!campaignMap[campaignName]) {
          campaignMap[campaignName] = {
            id: campaignName.toLowerCase().replace(/\s+/g, '_'),
            title: campaignName,
            raised: 0,
            donorCount: new Set(),
            donations: []
          };
        }
        campaignMap[campaignName].raised += donation.amount;
        campaignMap[campaignName].donorCount.add(donation.donor_email);
        campaignMap[campaignName].donations.push(donation);
      });

      const campaignList = Object.values(campaignMap).map((camp) => ({
        id: camp.id,
        title: camp.title,
        description: `Supporting ${camp.title} with ${camp.donorCount.size} donors contributing to this important cause.`,
        goal: Math.max(1000, Math.ceil(camp.raised * 1.5 / 1000) * 1000),
        raised: camp.raised,
        icon: getCampaignIcon(camp.title),
        image: getCampaignImage(camp.title),
        impact: `${camp.donorCount.size} supporter${camp.donorCount.size !== 1 ? 's' : ''} have contributed ${camp.donations.length} donation${camp.donations.length !== 1 ? 's' : ''}`,
        featured: false
      }));

      campaignList.sort((a, b) => b.raised - a.raised);

      if (campaignList.length > 0) {
        campaignList[0].featured = true;
        if (campaignList.length > 1) {
          campaignList[1].featured = true;
        }
      }

      setCampaigns(campaignList);
      
    } catch (error) {
      console.error('Error refreshing donations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    setDonationSuccess(false);
    setShowImpactStory(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setDonationSuccess(false);
    
    try {
      const donationData = {
        ...formData,
        amount: parseFloat(formData.amount),
        payment_status: "completed",
        campaign: selectedCampaign.title,
        category: selectedCampaign.id
      };

      await base44.entities.Donation.create(donationData);
      
      setFormData({
        amount: "", 
        type: "one_time", 
        donor_name: user?.full_name || "",
        donor_email: user?.email || "", 
        anonymous: false, 
        tax_receipt_required: true,
        monthly_amount: ""
      });
      setDonationSuccess(true);
      setShowImpactStory(true);
      
      // Refresh donations list and campaigns
      await refreshDonations();
      
    } catch (error) {
      console.error("Error creating donation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareSupport = () => {
    const text = `I just supported ${selectedCampaign.title} with Curling Canada! Join me in growing our sport. #CurlingCanada #SupportCurling`;
    if (navigator.share) {
      navigator.share({
        title: 'Supporting Canadian Curling',
        text: text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(text + ' ' + window.location.href);
      alert('Share message copied to clipboard!');
    }
  };

  const DonationForm = () => (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-brand-red" />
          Support: {selectedCampaign.title}
        </CardTitle>
        <p className="text-gray-600">{selectedCampaign.impact}</p>
      </CardHeader>
      <CardContent>
        {donationSuccess && showImpactStory ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-brand-charcoal mb-2">Thank You for Your Impact!</h3>
            <p className="text-gray-600 mb-4">Your generous donation makes a real difference in Canadian curling.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold mb-2">Your Impact</h4>
              <p className="text-sm text-gray-700">{selectedCampaign.impact}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={shareSupport} className="bg-blue-600 hover:bg-blue-700">
                <Share2 className="w-4 h-4 mr-2" />
                Share Your Support
              </Button>
              <Button variant="outline" onClick={() => setSelectedCampaign(null)}>
                Back to Campaigns
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Donation Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({...formData, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_time">One-time Donation</SelectItem>
                  <SelectItem value="monthly">Monthly Giving</SelectItem>
                  <SelectItem value="annual">Annual Commitment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">
                {formData.type === 'monthly' ? 'Monthly Amount' : 'Donation Amount'} *
              </Label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <Input 
                  id="amount" 
                  type="number" 
                  min="5" 
                  value={formData.amount} 
                  onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                  className="pl-10" 
                  placeholder="25.00" 
                  required 
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {[25, 50, 100, 250, 500].map(amount => (
                  <Button 
                    key={amount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({...formData, amount: amount.toString()})}
                    className="text-xs"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="donor_name">Full Name *</Label>
                <Input 
                  id="donor_name" 
                  value={formData.donor_name} 
                  onChange={(e) => setFormData({...formData, donor_name: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="donor_email">Email *</Label>
                <Input 
                  id="donor_email" 
                  type="email" 
                  value={formData.donor_email} 
                  onChange={(e) => setFormData({...formData, donor_email: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="tax_receipt" 
                  checked={formData.tax_receipt_required}
                  onCheckedChange={(checked) => setFormData({...formData, tax_receipt_required: checked})}
                />
                <Label htmlFor="tax_receipt" className="text-sm">
                  I would like a tax receipt for this donation
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="anonymous" 
                  checked={formData.anonymous}
                  onCheckedChange={(checked) => setFormData({...formData, anonymous: checked})}
                />
                <Label htmlFor="anonymous" className="text-sm">
                  Make this donation anonymous
                </Label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setSelectedCampaign(null)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-brand-red hover:bg-red-700 flex-1">
                <CreditCard className="w-4 h-4 mr-2" />
                {isSubmitting ? "Processing..." : `Donate $${formData.amount || '0'}`}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );

  const CampaignTile = ({ campaign }) => {
    const progressPercent = (campaign.raised / campaign.goal) * 100;
    
    return (
      <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${campaign.featured ? 'ring-2 ring-brand-red' : ''}`}>
        {campaign.featured && (
          <div className="bg-brand-red text-white text-xs font-bold px-3 py-1 text-center">
            TOP CAMPAIGN
          </div>
        )}
        <div className="relative">
          <img 
            src={campaign.image} 
            alt={campaign.title} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 right-4">
            <campaign.icon className="w-8 h-8 text-white bg-black/50 rounded-full p-1.5" />
          </div>
        </div>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{campaign.title}</span>
            <Badge variant="outline" className="text-xs">
              {Math.round(progressPercent)}% funded
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">{campaign.description}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium">
                ${campaign.raised.toLocaleString()} of ${campaign.goal.toLocaleString()}
              </span>
            </div>
            <Progress value={progressPercent} className="w-full h-2" />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Impact</span>
            </div>
            <p className="text-xs text-blue-700">{campaign.impact}</p>
          </div>

          <Button 
            onClick={() => handleCampaignSelect(campaign)} 
            className="w-full bg-brand-red hover:bg-red-700"
            size="lg"
          >
            <Heart className="w-4 h-4 mr-2" />
            Support This Campaign
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brand-charcoal uppercase mb-4">Support Canadian Curling</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your donation fuels the future of curling in Canada, from grassroots programs to the podium. 
            Every contribution makes a meaningful impact on our sport and community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedCampaign ? (
              <DonationForm />
            ) : isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
              </div>
            ) : campaigns.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
                  <p className="text-gray-500">Campaigns will appear here as donations are received.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Featured Campaigns */}
                {campaigns.filter(c => c.featured).length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-brand-charcoal mb-6 flex items-center gap-2">
                      <Star className="w-6 h-6 text-amber-500" />
                      Top Campaigns
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {campaigns.filter(c => c.featured).map(campaign => (
                        <CampaignTile key={campaign.id} campaign={campaign} />
                      ))}
                    </div>
                  </div>
                )}

                {/* All Campaigns */}
                {campaigns.filter(c => !c.featured).length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-brand-charcoal mb-6">All Campaigns</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {campaigns.filter(c => !c.featured).map(campaign => (
                        <CampaignTile key={campaign.id} campaign={campaign} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Stats */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-brand-red" />
                    Our Impact
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={refreshDonations}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-red" />
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brand-charcoal">
                        ${donations.reduce((sum, d) => sum + (d.amount || 0), 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Total Raised</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-brand-charcoal">{donations.length}</div>
                        <div className="text-xs text-gray-500">Donations</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-brand-charcoal">
                          {new Set(donations.map(d => d.donor_email)).size}
                        </div>
                        <div className="text-xs text-gray-500">Supporters</div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Donation History */}
            <DonationHistory 
              donations={user ? donations.filter(d => d.donor_email === user.email) : donations} 
              title={user ? "Your Donation History" : "Recent Support"} 
            />

            {/* Tax Information */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Tax Benefits</h4>
                <p className="text-sm text-blue-700">
                  Curling Canada is a registered charity. All donations are tax-deductible 
                  and you'll receive an official tax receipt.
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Charity Registration: 12345-6789-RR0001
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
