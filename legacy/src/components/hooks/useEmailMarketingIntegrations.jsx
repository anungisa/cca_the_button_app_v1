import { useState, useCallback } from 'react';

const getApiConfig = () => ({
  mailchimp: {
    baseUrl: '/api/integrations/mailchimp'
  },
  constantContact: {
    baseUrl: '/api/integrations/constant-contact'
  }
});

export const useEmailMarketingIntegrations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const config = getApiConfig();

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

  const constantContactAPI = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.constantContact.baseUrl}/${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      
      if (!response.ok) throw new Error(`Constant Contact API error: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [config.constantContact.baseUrl]);

  const createEmailList = useCallback(async (platform, listData) => {
    try {
      if (platform === 'mailchimp') {
        return await mailchimpAPI('lists', {
          method: 'POST',
          body: {
            name: listData.name,
            contact: {
              company: 'Curling Canada',
              address1: '1660 Vimont Court',
              city: 'Orleans',
              state: 'Ontario',
              zip: 'K4A 4J4',
              country: 'CA'
            },
            permission_reminder: listData.permissionReminder || 'You are receiving this email because you signed up for Curling Canada updates.',
            campaign_defaults: {
              from_name: 'Curling Canada',
              from_email: listData.fromEmail || 'info@curling.ca',
              subject: '',
              language: 'en'
            }
          }
        });
      } else if (platform === 'constantContact') {
        return await constantContactAPI('contact_lists', {
          method: 'POST',
          body: {
            name: listData.name,
            description: listData.description
          }
        });
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [mailchimpAPI, constantContactAPI]);

  const addSubscriber = useCallback(async (platform, listId, subscriberData) => {
    try {
      if (platform === 'mailchimp') {
        return await mailchimpAPI(`lists/${listId}/members`, {
          method: 'POST',
          body: {
            email_address: subscriberData.email,
            status: 'subscribed',
            merge_fields: {
              FNAME: subscriberData.firstName,
              LNAME: subscriberData.lastName,
              PHONE: subscriberData.phone,
              MMERGE4: subscriberData.province // Custom field for province
            },
            tags: subscriberData.tags || []
          }
        });
      } else if (platform === 'constantContact') {
        return await constantContactAPI('contacts', {
          method: 'POST',
          body: {
            email_address: {
              address: subscriberData.email,
              permission_to_send: 'implicit'
            },
            first_name: subscriberData.firstName,
            last_name: subscriberData.lastName,
            phone_numbers: subscriberData.phone ? [{
              phone_number: subscriberData.phone,
              kind: 'home'
            }] : [],
            list_memberships: [listId]
          }
        });
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [mailchimpAPI, constantContactAPI]);

  const sendCampaign = useCallback(async (platform, campaignData) => {
    try {
      if (platform === 'mailchimp') {
        // Create campaign
        const campaign = await mailchimpAPI('campaigns', {
          method: 'POST',
          body: {
            type: 'regular',
            recipients: {
              list_id: campaignData.listId,
              segment_opts: campaignData.segmentOpts
            },
            settings: {
              subject_line: campaignData.subject,
              title: campaignData.title,
              from_name: campaignData.fromName || 'Curling Canada',
              reply_to: campaignData.replyTo || 'info@curling.ca'
            }
          }
        });

        // Set content
        await mailchimpAPI(`campaigns/${campaign.id}/content`, {
          method: 'PUT',
          body: {
            html: campaignData.htmlContent
          }
        });

        // Send campaign
        return await mailchimpAPI(`campaigns/${campaign.id}/actions/send`, {
          method: 'POST'
        });

      } else if (platform === 'constantContact') {
        return await constantContactAPI('emails', {
          method: 'POST',
          body: {
            name: campaignData.title,
            email_campaign: {
              activities: [{
                format_type: 'HTML',
                from_email: campaignData.fromEmail || 'info@curling.ca',
                from_name: campaignData.fromName || 'Curling Canada',
                reply_to_email: campaignData.replyTo || 'info@curling.ca',
                subject: campaignData.subject,
                html_content: campaignData.htmlContent,
                contact_list_ids: [campaignData.listId]
              }]
            }
          }
        });
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [mailchimpAPI, constantContactAPI]);

  return {
    mailchimpAPI,
    constantContactAPI,
    createEmailList,
    addSubscriber,
    sendCampaign,
    isLoading,
    error
  };
};