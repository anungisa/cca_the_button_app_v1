import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Server, CheckCircle, XCircle, Loader2, RefreshCw,
  Activity, Zap, Clock, AlertTriangle, Play, Square
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { herokuManage } from '@/api/functions';

export default function HerokuIntegration() {
  const [apps, setApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [dynos, setDynos] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    setIsLoading(true);
    try {
      const response = await herokuManage({ action: 'list_apps' });
      if (response.data?.success) {
        setApps(response.data.apps || []);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to Load Apps",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadDynos = async (appId) => {
    try {
      const response = await herokuManage({ 
        action: 'list_dynos',
        app_id: appId
      });
      if (response.data?.success) {
        setDynos(response.data.dynos || []);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to Load Dynos",
        description: error.message,
      });
    }
  };

  const restartApp = async (appId) => {
    try {
      const response = await herokuManage({ 
        action: 'restart_app',
        app_id: appId
      });
      
      if (response.data?.success) {
        toast({
          title: "App Restarted",
          description: "All dynos have been restarted successfully",
        });
        loadDynos(appId);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Restart Failed",
        description: error.message,
      });
    }
  };

  const scaleDyno = async (appId, dynoType, quantity) => {
    try {
      const response = await herokuManage({ 
        action: 'scale_dyno',
        app_id: appId,
        dyno_type: dynoType,
        quantity: quantity
      });
      
      if (response.data?.success) {
        toast({
          title: "Dyno Scaled",
          description: `${dynoType} scaled to ${quantity}`,
        });
        loadDynos(appId);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Scale Failed",
        description: error.message,
      });
    }
  };

  const getDynoStatusColor = (state) => {
    switch (state) {
      case 'up': return 'bg-green-500';
      case 'starting': return 'bg-yellow-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-6 h-6 text-purple-500" />
            Heroku Infrastructure Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-brand-text-primary">Connected to Heroku</span>
            </div>
            <Button onClick={loadApps} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Apps Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {apps.map(app => (
            <Card 
              key={app.id} 
              className="bg-brand-card-bg border-brand-border hover:border-purple-500 transition-colors cursor-pointer"
              onClick={() => {
                setSelectedApp(app);
                loadDynos(app.id);
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{app.name}</span>
                  <Badge className="bg-purple-500">{app.stack?.name || 'heroku-22'}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-text-secondary">Region:</span>
                  <span className="text-brand-text-primary">{app.region?.name || 'us'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-text-secondary">Created:</span>
                  <span className="text-brand-text-primary">
                    {new Date(app.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      restartApp(app.id);
                    }}
                    className="flex-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Restart
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://dashboard.heroku.com/apps/${app.name}`, '_blank');
                    }}
                    className="flex-1"
                  >
                    View Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Selected App Details */}
      {selectedApp && (
        <Card className="bg-brand-card-bg border-brand-border border-2 border-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{ selectedApp.name} - Dynos</span>
              <Button 
                onClick={() => setSelectedApp(null)}
                variant="ghost"
                size="sm"
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="dynos">
              <TabsList>
                <TabsTrigger value="dynos">
                  <Activity className="w-4 h-4 mr-2" />
                  Dynos
                </TabsTrigger>
                <TabsTrigger value="config">
                  <Zap className="w-4 h-4 mr-2" />
                  Config
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dynos" className="space-y-4 mt-4">
                {dynos.length === 0 ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      No dynos running. This app may be sleeping or has no dynos configured.
                    </AlertDescription>
                  </Alert>
                ) : (
                  dynos.map(dyno => (
                    <div 
                      key={dyno.id}
                      className="p-4 bg-brand-charcoal rounded-lg border border-brand-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getDynoStatusColor(dyno.state)}`} />
                          <span className="font-medium text-brand-text-primary">
                            {dyno.type} - {dyno.name}
                          </span>
                        </div>
                        <Badge variant="outline">{dyno.state}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                        <div>
                          <span className="text-brand-text-secondary">Size:</span>
                          <span className="text-brand-text-primary ml-2">{dyno.size}</span>
                        </div>
                        <div>
                          <span className="text-brand-text-secondary">Command:</span>
                          <span className="text-brand-text-primary ml-2 text-xs truncate">
                            {dyno.command}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="config" className="mt-4">
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    Config var management coming soon. For now, manage config vars through the Heroku Dashboard.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}