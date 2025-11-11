import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, Database } from 'lucide-react';
import { mongoSync } from '@/api/functions';

export default function MongoTest() {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState(null);

  const testConnection = async () => {
    setIsLoading(true);
    setStatus(null);
    setDetails(null);
    
    try {
      const response = await mongoSync({ action: 'test' });
      
      console.log('MongoDB test response:', response);
      
      if (response.data?.connected) {
        setStatus('success');
        setDetails(response.data);
      } else {
        setStatus('error');
        setDetails(response.data);
      }
    } catch (error) {
      console.error('MongoDB test failed:', error);
      setStatus('error');
      setDetails({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const syncData = async () => {
    setIsLoading(true);
    
    try {
      const response = await mongoSync({ 
        action: 'sync',
        entities: ['Club', 'User', 'Event', 'Donation']
      });
      
      if (response.data?.success) {
        setStatus('synced');
        setDetails(response.data);
      }
    } catch (error) {
      console.error('MongoDB sync failed:', error);
      setStatus('error');
      setDetails({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6 text-green-500" />
            MongoDB Connection Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={testConnection} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>

            <Button 
              onClick={syncData} 
              disabled={isLoading || status !== 'success'}
              className="flex-1"
              variant="outline"
            >
              Sync Sample Data
            </Button>
          </div>

          {status === 'success' && (
            <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-green-500">Connected Successfully!</span>
              </div>
              <div className="text-sm text-brand-text-secondary space-y-1">
                <p>✅ Connected to MongoDB Atlas</p>
                <p>✅ Database: {details?.database || 'thebutton'}</p>
                <p>✅ Ready to sync data</p>
              </div>
            </div>
          )}

          {status === 'synced' && (
            <div className="p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-blue-500">Data Synced!</span>
              </div>
              <div className="text-sm text-brand-text-secondary space-y-1">
                {details?.summary && Object.entries(details.summary).map(([entity, count]) => (
                  <p key={entity}>✅ {entity}: {count} records synced</p>
                ))}
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-red-500">Connection Failed</span>
              </div>
              <p className="text-sm text-brand-text-secondary">
                {details?.error || 'Make sure MONGODB_URI is set correctly'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}