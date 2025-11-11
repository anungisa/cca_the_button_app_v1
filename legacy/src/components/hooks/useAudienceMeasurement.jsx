import { useState, useCallback } from 'react';

// Configuration - In production, these would come from a secure config service
const getApiConfig = () => ({
  numeris: {
    baseUrl: '/api/integrations/numeris'
  },
  comscore: {
    baseUrl: '/api/integrations/comscore'
  },
  googleAnalytics: {
    baseUrl: '/api/integrations/google-analytics'
  }
});

export const useAudienceMeasurement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const config = getApiConfig();

  // Numeris (Canadian TV ratings) Integration
  const numerisAPI = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.numeris.baseUrl}/${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      
      if (!response.ok) throw new Error(`Numeris API error: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [config.numeris.baseUrl]);

  // Comscore Integration
  const comscoreAPI = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.comscore.baseUrl}/${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      
      if (!response.ok) throw new Error(`Comscore API error: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [config.comscore.baseUrl]);

  // Google Analytics 4 Integration
  const ga4API = useCallback(async (reportRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(config.googleAnalytics.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportRequest)
      });
      
      if (!response.ok) throw new Error(`GA4 API error: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [config.googleAnalytics.baseUrl]);

  // Get comprehensive audience data
  const getAudienceData = useCallback(async (eventId, dateRange) => {
    try {
      const [tv, digital, streaming] = await Promise.allSettled([
        numerisAPI(`events/${eventId}/ratings`, { 
          body: { dateRange } 
        }),
        ga4API({
          dateRanges: [dateRange],
          metrics: [
            { name: 'activeUsers' },
            { name: 'sessions' },
            { name: 'averageSessionDuration' }
          ],
          dimensions: [
            { name: 'eventName' },
            { name: 'country' }
          ]
        }),
        comscoreAPI(`streaming/${eventId}`)
      ]);

      return {
        tv_ratings: tv.status === 'fulfilled' ? tv.value : null,
        digital_analytics: digital.status === 'fulfilled' ? digital.value : null,
        streaming_metrics: streaming.status === 'fulfilled' ? streaming.value : null,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      setError(err.message);
      return { error: true, message: err.message };
    }
  }, [numerisAPI, ga4API, comscoreAPI]);

  // Get demographic breakdown
  const getDemographics = useCallback(async (eventId) => {
    try {
      const demographics = await ga4API({
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }],
        dimensions: [
          { name: 'userAgeBracket' },
          { name: 'userGender' },
          { name: 'country' }
        ],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            stringFilter: {
              value: eventId,
              matchType: 'EXACT'
            }
          }
        }
      });

      return { success: true, demographics };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [ga4API]);

  return {
    numerisAPI,
    comscoreAPI,
    ga4API,
    getAudienceData,
    getDemographics,
    isLoading,
    error
  };
};