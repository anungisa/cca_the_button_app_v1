import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, Server } from 'lucide-react';
import { herokuManage } from '@/api/functions';

export default function HerokuTest() {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apps, setApps] = useState([]);

  const testConnection = async () => {
    setIsLoading(true);
    setStatus(null);
    
    try {
      // Test connection
      const testResponse = await herokuManage({ action: 'test' });
      
      if (testResponse.data?.connected) {
        setStatus('success');
        
        // Load apps
        const appsResponse = await herokuManage({ action: 'list_apps' });
        if (appsResponse.data?.success) {
          setApps(appsResponse.data.apps || []);
        }
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Heroku test failed:', error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-6 h-6 text-purple-500" />
            Heroku Connection Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testConnection} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing Connection...
              </>
            ) : (
              'Test Heroku Connection'
            )}
          </Button>

          {status === 'success' && (
            <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-green-500">Connected Successfully!</span>
              </div>
              <p className="text-sm text-brand-text-secondary mb-4">
                Found {apps.length} Heroku apps
              </p>
              {apps.length > 0 && (
                <div className="space-y-2">
                  {apps.map(app => (
                    <div key={app.id} className="p-3 bg-brand-charcoal rounded border border-brand-border">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-brand-text-primary">{app.name}</span>
                        <Badge className="bg-purple-500">{app.stack?.name || 'Unknown'}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-red-500">Connection Failed</span>
              </div>
              <p className="text-sm text-brand-text-secondary mt-2">
                Make sure HEROKU_API_KEY is set correctly in environment variables.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}