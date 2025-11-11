import { useState, useCallback } from 'react';

const getApiConfig = () => ({
  slack: {
    baseUrl: '/api/integrations/slack'
  }
});

export const useSlackIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const config = getApiConfig();

  const slackAPI = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.slack.baseUrl}/${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      
      if (!response.ok) throw new Error(`Slack API error: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [config.slack.baseUrl]);

  const sendNotification = useCallback(async (channel, message, options = {}) => {
    try {
      return await slackAPI('chat.postMessage', {
        method: 'POST',
        body: {
          channel,
          text: message,
          username: options.username || 'Curling Canada Bot',
          icon_emoji: options.icon || ':curling_stone:',
          attachments: options.attachments,
          blocks: options.blocks
        }
      });
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [slackAPI]);

  const createChannel = useCallback(async (name, isPrivate = false) => {
    try {
      const method = isPrivate ? 'groups.create' : 'channels.create';
      return await slackAPI(method, {
        method: 'POST',
        body: { name }
      });
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [slackAPI]);

  return {
    slackAPI,
    sendNotification,
    createChannel,
    isLoading,
    error
  };
};