import { useState, useCallback } from 'react';

// Configuration - In production, these would come from a secure config service
const getApiConfig = () => ({
  googleAds: {
    baseUrl: '/api/integrations/google-ads'
  },
  facebookAds: {
    baseUrl: '/api/integrations/facebook-ads'
  },
  mailchimp: {
    baseUrl: '/api/integrations/mailchimp'
  }
});

export const useMarketingIntegrations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const config = getApiConfig();

  // Google Ads Integration
  const googleAdsAPI = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.googleAds.baseUrl}/${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      
      if (!response.ok) throw new Error(`Google Ads API error: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [config.googleAds.baseUrl]);

  // Facebook Ads Integration
  const facebookAdsAPI = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.facebookAds.baseUrl}/${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      
      if (!response.ok) throw new Error(`Facebook Ads API error: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [config.facebookAds.baseUrl]);

  // Mailchimp Integration
  const mailchimpAPI = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.mailchimp.baseUrl}/${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      
      if (!response.ok) throw new Error(`Mailchimp API error: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [config.mailchimp.baseUrl]);

  // Create integrated marketing campaign
  const createCampaign = useCallback(async (campaignData) => {
    try {
      const results = await Promise.allSettled([
        googleAdsAPI('campaigns', {
          method: 'POST',
          body: {
            name: campaignData.name,
            advertising_channel_type: 'SEARCH',
            status: 'PAUSED',
            start_date: campaignData.startDate,
            end_date: campaignData.endDate,
            budget: campaignData.budget
          }
        }),
        facebookAdsAPI('campaigns', {
          method: 'POST',
          body: {
            name: campaignData.name,
            objective: 'TRAFFIC',
            status: 'PAUSED',
            daily_budget: campaignData.dailyBudget
          }
        }),
        mailchimpAPI('campaigns', {
          method: 'POST',
          body: {
            type: 'regular',
            recipients: {
              list_id: campaignData.emailListId
            },
            settings: {
              subject_line: campaignData.emailSubject,
              title: campaignData.name,
              from_name: 'Curling Canada',
              reply_to: campaignData.replyTo
            }
          }
        })
      ]);

      return {
        google_ads: results[0].status === 'fulfilled' ? results[0].value : null,
        facebook_ads: results[1].status === 'fulfilled' ? results[1].value : null,
        email_campaign: results[2].status === 'fulfilled' ? results[2].value : null,
        success: results.some(r => r.status === 'fulfilled')
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [googleAdsAPI, facebookAdsAPI, mailchimpAPI]);

  // Get campaign performance across platforms
  const getCampaignPerformance = useCallback(async (campaignIds) => {
    try {
      const [googlePerf, facebookPerf, emailPerf] = await Promise.allSettled([
        googleAdsAPI(`campaigns/${campaignIds.google}/metrics`),
        facebookAdsAPI(`campaigns/${campaignIds.facebook}/insights`),
        mailchimpAPI(`campaigns/${campaignIds.email}/reports`)
      ]);

      return {
        google_performance: googlePerf.status === 'fulfilled' ? googlePerf.value : null,
        facebook_performance: facebookPerf.status === 'fulfilled' ? facebookPerf.value : null,
        email_performance: emailPerf.status === 'fulfilled' ? emailPerf.value : null,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      setError(err.message);
      return { error: true, message: err.message };
    }
  }, [googleAdsAPI, facebookAdsAPI, mailchimpAPI]);

  return {
    googleAdsAPI,
    facebookAdsAPI,
    mailchimpAPI,
    createCampaign,
    getCampaignPerformance,
    isLoading,
    error
  };
};