import { useState, useCallback } from 'react';
import { SponsorCampaign, User } from '@/api/entities';

export const useSponsorAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock sponsor profiles for demo
  const getMockSponsorProfiles = () => [
    {
      id: 'sponsor_1',
      name: 'BalancePlus',
      tier: 'Platinum',
      logo_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
      bio: 'Leading curling equipment manufacturer, committed to advancing the sport at all levels.',
      contact_person: 'Sarah Johnson',
      contact_email: 'sarah@balanceplus.com',
      active_campaigns: 3,
      total_xp_distributed: 15420,
      engagement_rate: 8.2
    },
    {
      id: 'sponsor_2',
      name: 'Goldline Curling',
      tier: 'Gold',
      logo_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=200&fit=crop',
      bio: 'Premium curling stones and equipment trusted by champions worldwide.',
      contact_person: 'Mike Chen',
      contact_email: 'mike@goldlinecurling.com',
      active_campaigns: 2,
      total_xp_distributed: 8750,
      engagement_rate: 12.5
    },
    {
      id: 'sponsor_3',
      name: 'Asham Curling',
      tier: 'Silver',
      logo_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop',
      bio: 'Innovative curling shoes and accessories for competitive athletes.',
      contact_person: 'Jennifer Liu',
      contact_email: 'jen@ashamcurling.com',
      active_campaigns: 1,
      total_xp_distributed: 4200,
      engagement_rate: 6.8
    }
  ];

  const getMockCampaignMetrics = (campaignId, dateRange) => ({
    daily_metrics: [
      { date: '2024-01-10', impressions: 1250, completions: 89, clicks: 156 },
      { date: '2024-01-11', impressions: 1180, completions: 102, clicks: 174 },
      { date: '2024-01-12', impressions: 1420, completions: 125, clicks: 198 },
      { date: '2024-01-13', impressions: 980, completions: 78, clicks: 142 },
      { date: '2024-01-14', impressions: 1560, completions: 143, clicks: 221 }
    ],
    funnel_data: {
      impressions: 6390,
      clicks: 891,
      completions: 537,
      click_rate: 13.9,
      completion_rate: 60.3
    },
    channel_breakdown: {
      homepage: { impressions: 2450, completions: 201 },
      social_hub: { impressions: 1890, completions: 156 },
      club_pages: { impressions: 1250, completions: 98 },
      qr_scans: { impressions: 800, completions: 82 }
    }
  });

  // Create new sponsor campaign
  const createCampaign = useCallback(async (campaignData) => {
    setIsLoading(true);
    try {
      const campaign = await SponsorCampaign.create({
        ...campaignData,
        is_active: true,
        impressions: 0,
        completions: 0,
        created_date: new Date().toISOString()
      });
      return campaign;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get all campaigns with filters
  const getCampaigns = useCallback(async (filters = {}) => {
    setIsLoading(true);
    try {
      const campaigns = await SponsorCampaign.list('-created_date', 50);
      
      // Apply filters
      let filtered = campaigns;
      
      if (filters.sponsor_name) {
        filtered = filtered.filter(c => c.sponsor_name === filters.sponsor_name);
      }
      
      if (filters.campaign_type) {
        filtered = filtered.filter(c => c.quest_type === filters.campaign_type);
      }
      
      if (filters.date_from) {
        filtered = filtered.filter(c => new Date(c.start_date) >= new Date(filters.date_from));
      }
      
      return filtered;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get campaign performance metrics
  const getCampaignMetrics = useCallback(async (campaignId, dateRange) => {
    // In production, this would call the real API
    return getMockCampaignMetrics(campaignId, dateRange);
  }, []);

  // Get sponsor profiles
  const getSponsorProfiles = useCallback(async () => {
    // In production, this would call the real API
    return getMockSponsorProfiles();
  }, []);

  // Update campaign
  const updateCampaign = useCallback(async (campaignId, updates) => {
    setIsLoading(true);
    try {
      const updated = await SponsorCampaign.update(campaignId, updates);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Log sponsor engagement
  const logEngagement = useCallback(async (campaignId, userId, actionType) => {
    try {
      // This would typically call an API endpoint
      const campaign = await SponsorCampaign.get(campaignId);
      
      if (actionType === 'impression') {
        await SponsorCampaign.update(campaignId, {
          impressions: (campaign.impressions || 0) + 1
        });
      } else if (actionType === 'completion') {
        await SponsorCampaign.update(campaignId, {
          completions: (campaign.completions || 0) + 1
        });
      }
      
      return true;
    } catch (err) {
      console.error('Error logging engagement:', err);
      return false;
    }
  }, []);

  return {
    isLoading,
    error,
    createCampaign,
    getCampaigns,
    getCampaignMetrics,
    getSponsorProfiles,
    updateCampaign,
    logEngagement
  };
};

export default useSponsorAPI;