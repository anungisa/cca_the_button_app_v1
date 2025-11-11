import { useState, useCallback } from 'react';

// Configuration - In production, these would come from a secure config service
const getApiConfig = () => ({
  tsn: {
    baseUrl: '/api/integrations/tsn'
  },
  youtube: {
    baseUrl: '/api/integrations/youtube'
  },
  twitter: {
    baseUrl: '/api/integrations/twitter'
  },
  facebook: {
    baseUrl: '/api/integrations/facebook'
  },
  instagram: {
    baseUrl: '/api/integrations/instagram'
  }
});

export const useBroadcastIntegrations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const config = getApiConfig();

  // TSN API Integration
  const tsnAPI = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.tsn.baseUrl}/${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      
      if (!response.ok) throw new Error(`TSN API error: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [config.tsn.baseUrl]);

  // YouTube Analytics Integration
  const youtubeAPI = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.youtube.baseUrl}/${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      
      if (!response.ok) throw new Error(`YouTube API error: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [config.youtube.baseUrl]);

  // Social Media APIs Integration
  const socialMediaAPI = useCallback(async (platform, endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      let apiUrl;
      
      switch (platform) {
        case 'twitter':
          apiUrl = `${config.twitter.baseUrl}/${endpoint}`;
          break;
        case 'facebook':
          apiUrl = `${config.facebook.baseUrl}/${endpoint}`;
          break;
        case 'instagram':
          apiUrl = `${config.instagram.baseUrl}/${endpoint}`;
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }

      const response = await fetch(apiUrl, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      
      if (!response.ok) throw new Error(`${platform} API error: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [config.twitter.baseUrl, config.facebook.baseUrl, config.instagram.baseUrl]);

  // Get comprehensive broadcast metrics
  const getBroadcastMetrics = useCallback(async (eventId) => {
    try {
      const [tv, youtube, social] = await Promise.allSettled([
        tsnAPI(`events/${eventId}/metrics`),
        youtubeAPI(`videos?part=statistics&id=${eventId}`),
        Promise.all([
          socialMediaAPI('twitter', `tweets/${eventId}/metrics`),
          socialMediaAPI('facebook', `posts/${eventId}/insights`),
          socialMediaAPI('instagram', `media/${eventId}/insights`)
        ])
      ]);

      return {
        tv_metrics: tv.status === 'fulfilled' ? tv.value : null,
        youtube_metrics: youtube.status === 'fulfilled' ? youtube.value : null,
        social_metrics: social.status === 'fulfilled' ? social.value : null,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      setError(err.message);
      return { error: true, message: err.message };
    }
  }, [tsnAPI, youtubeAPI, socialMediaAPI]);

  // Schedule broadcast content
  const scheduleBroadcast = useCallback(async (broadcastData) => {
    try {
      const tsnSchedule = await tsnAPI('schedule', {
        method: 'POST',
        body: {
          event_id: broadcastData.eventId,
          start_time: broadcastData.startTime,
          duration: broadcastData.duration,
          feed_url: broadcastData.feedUrl,
          metadata: broadcastData.metadata
        }
      });

      return { success: true, schedule: tsnSchedule };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [tsnAPI]);

  return {
    tsnAPI,
    youtubeAPI,
    socialMediaAPI,
    getBroadcastMetrics,
    scheduleBroadcast,
    isLoading,
    error
  };
};