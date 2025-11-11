import { useState, useEffect } from 'react';

export const useCurlingIOAPI = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock connection status for demo
    const mockConnectionCheck = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsConnected(true);
        setLastSync(new Date().toISOString());
        setError(null);
        setIsLoading(false);
      }, 1000);
    };

    mockConnectionCheck();
  }, []);

  const syncEvents = async () => {
    try {
      setIsLoading(true);
      // Mock sync operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLastSync(new Date().toISOString());
      setError(null);
      return { success: true, message: 'Events synced successfully' };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const syncGames = async () => {
    try {
      setIsLoading(true);
      // Mock sync operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLastSync(new Date().toISOString());
      setError(null);
      return { success: true, message: 'Games synced successfully' };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setIsLoading(true);
      // Mock connection test
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(true);
      setError(null);
      return { success: true, message: 'Connection test successful' };
    } catch (err) {
      setIsConnected(false);
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    lastSync,
    error,
    isLoading,
    syncEvents,
    syncGames,
    testConnection
  };
};