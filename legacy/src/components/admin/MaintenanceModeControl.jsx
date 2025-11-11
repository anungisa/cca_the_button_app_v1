import React, { useState, useEffect } from 'react';
import { PlatformSetting } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Wrench, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const MaintenanceModeControl = () => {
  const [setting, setSetting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMaintenanceSetting = async () => {
      setIsLoading(true);
      try {
        const settings = await PlatformSetting.filter({ setting_key: 'maintenance_mode' }, '', 1);
        if (settings.length > 0) {
          setSetting(settings[0]);
        }
      } catch (error) {
        console.error("Failed to fetch maintenance mode setting:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaintenanceSetting();
  }, []);

  const handleToggle = async (checked) => {
    if (!setting) return;
    setIsLoading(true);
    const newValue = String(checked);
    try {
      await PlatformSetting.update(setting.id, { setting_value: newValue });
      setSetting(prev => ({ ...prev, setting_value: newValue }));
      toast({
        title: `Maintenance Mode ${checked ? 'Enabled' : 'Disabled'}`,
        description: `The platform is now ${checked ? 'in' : 'out of'} maintenance mode.`,
      });
    } catch (error) {
      console.error("Failed to update maintenance mode:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update maintenance mode status.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!setting && !isLoading) {
    return null; // Don't render if the setting doesn't exist
  }
  
  const isMaintenanceMode = setting?.setting_value === 'true';

  return (
    <Card className="bg-yellow-900/20 border-yellow-500/30 border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-300">
          <Wrench className="w-5 h-5" />
          Maintenance Mode
        </CardTitle>
        <CardDescription className="text-yellow-400/80">
          Enable this to show a maintenance page to all non-admin users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="font-medium text-brand-text-primary">
            {isMaintenanceMode ? 'Maintenance Mode is ON' : 'Maintenance Mode is OFF'}
          </p>
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Switch
              checked={isMaintenanceMode}
              onCheckedChange={handleToggle}
              aria-label="Toggle maintenance mode"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceModeControl;