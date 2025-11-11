import { useState, useCallback } from 'react';

const getApiConfig = () => ({
  salesforce: {
    baseUrl: '/api/integrations/salesforce'
  },
  hubspot: {
    baseUrl: '/api/integrations/hubspot'
  }
});

export const useCRMIntegrations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const config = getApiConfig();

  const salesforceAPI = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.salesforce.baseUrl}/${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      
      if (!response.ok) throw new Error(`Salesforce API error: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [config.salesforce.baseUrl]);

  const hubspotAPI = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.hubspot.baseUrl}/${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      
      if (!response.ok) throw new Error(`HubSpot API error: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [config.hubspot.baseUrl]);

  const createLead = useCallback(async (platform, leadData) => {
    try {
      if (platform === 'salesforce') {
        return await salesforceAPI('sobjects/Lead', {
          method: 'POST',
          body: {
            FirstName: leadData.firstName,
            LastName: leadData.lastName,
            Email: leadData.email,
            Company: leadData.company || 'Individual',
            LeadSource: leadData.source || 'Web',
            Status: 'Open - Not Contacted'
          }
        });
      } else if (platform === 'hubspot') {
        return await hubspotAPI('contacts', {
          method: 'POST',
          body: {
            properties: {
              firstname: leadData.firstName,
              lastname: leadData.lastName,
              email: leadData.email,
              company: leadData.company,
              hs_lead_status: 'NEW',
              lifecyclestage: 'lead'
            }
          }
        });
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [salesforceAPI, hubspotAPI]);

  const syncIncidentToCRM = useCallback(async (platform, incidentData) => {
    try {
      if (platform === 'salesforce') {
        return await salesforceAPI('sobjects/Case', {
          method: 'POST',
          body: {
            Subject: incidentData.title,
            Description: incidentData.description,
            Priority: incidentData.priority,
            Status: 'New',
            Origin: 'Web',
            Type: 'Problem'
          }
        });
      } else if (platform === 'hubspot') {
        return await hubspotAPI('objects/tickets', {
          method: 'POST',
          body: {
            properties: {
              subject: incidentData.title,
              content: incidentData.description,
              hs_pipeline_stage: 'new',
              hs_ticket_priority: incidentData.priority
            }
          }
        });
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [salesforceAPI, hubspotAPI]);

  return {
    salesforceAPI,
    hubspotAPI,
    createLead,
    syncIncidentToCRM,
    isLoading,
    error
  };
};