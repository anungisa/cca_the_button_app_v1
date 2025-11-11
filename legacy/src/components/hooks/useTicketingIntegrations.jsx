import { useState, useCallback } from 'react';

// Configuration - In production, these would come from a secure config service
const getApiConfig = () => ({
  ticketmaster: {
    baseUrl: '/api/integrations/ticketmaster',
    // API key would be handled server-side
  },
  seatgeek: {
    baseUrl: '/api/integrations/seatgeek',
    // API key would be handled server-side
  }
});

export const useTicketingIntegrations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const config = getApiConfig();

  // Ticketmaster Integration
  const ticketmasterAPI = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.ticketmaster.baseUrl}/${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      
      if (!response.ok) throw new Error(`Ticketmaster API error: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [config.ticketmaster.baseUrl]);

  // SeatGeek Integration  
  const seatGeekAPI = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.seatgeek.baseUrl}/${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      
      if (!response.ok) throw new Error(`SeatGeek API error: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [config.seatgeek.baseUrl]);

  // Get event tickets across platforms
  const getEventTickets = useCallback(async (eventId) => {
    try {
      const [ticketmaster, seatgeek] = await Promise.allSettled([
        ticketmasterAPI(`events/${eventId}/tickets`),
        seatGeekAPI(`events/${eventId}`)
      ]);

      return {
        ticketmaster: ticketmaster.status === 'fulfilled' ? ticketmaster.value : null,
        seatgeek: seatgeek.status === 'fulfilled' ? seatgeek.value : null,
        error: ticketmaster.status === 'rejected' || seatgeek.status === 'rejected'
      };
    } catch (err) {
      setError(err.message);
      return { error: true, message: err.message };
    }
  }, [ticketmasterAPI, seatGeekAPI]);

  // Create event on ticketing platforms
  const createEvent = useCallback(async (eventData) => {
    try {
      const ticketmasterEvent = await ticketmasterAPI('events', {
        method: 'POST',
        body: {
          name: eventData.name,
          dates: {
            start: {
              localDate: eventData.startDate,
              localTime: eventData.startTime
            }
          },
          venues: [{
            name: eventData.venue.name,
            address: eventData.venue.address
          }],
          classifications: [{
            segment: { name: 'Sports' },
            genre: { name: 'Curling' }
          }]
        }
      });

      return { success: true, ticketmaster: ticketmasterEvent };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [ticketmasterAPI]);

  return {
    ticketmasterAPI,
    seatGeekAPI,
    getEventTickets,
    createEvent,
    isLoading,
    error
  };
};