import React, { useState, useEffect, useCallback } from 'react';
import { PlatformSetting } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '../hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Save, Loader2, Info } from 'lucide-react';

const SettingsManager = ({ category }) => {
  const [settings, setSettings] = useState([]);
  const [initialSettings, setInitialSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await PlatformSetting.filter({ category: category });
      setSettings(data);
      setInitialSettings(JSON.parse(JSON.stringify(data))); // Deep copy
    } catch (error) {
      console.error(`Failed to load settings for category ${category}:`, error);
      toast({ variant: "destructive", title: "Error", description: "Could not load settings." });
    } finally {
      setIsLoading(false);
    }
  }, [category, toast]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSettingChange = (id, value) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, setting_value: value } : setting
      )
    );
  };

  const renderSettingInput = (setting) => {
    const value = setting.setting_value;

    switch (setting.setting_type) {
      case 'boolean':
        return (
          <Switch
            checked={value === 'true'}
            onCheckedChange={(checked) => handleSettingChange(setting.id, String(checked))}
            disabled={!setting.is_editable_by_ui}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="bg-brand-charcoal border-brand-border"
            disabled={!setting.is_editable_by_ui}
          />
        );
      case 'object':
      case 'array':
         return (
          <Textarea
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="bg-brand-charcoal border-brand-border min-h-[100px] font-mono text-sm"
            disabled={!setting.is_editable_by_ui}
          />
        );
      default: // string
         if (setting.value_options && setting.value_options.length > 0) {
            return (
                 <Select onValueChange={(val) => handleSettingChange(setting.id, val)} value={value}>
                    <SelectTrigger className="bg-brand-charcoal border-brand-border">
                        <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                        {setting.value_options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
            )
         }
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="bg-brand-charcoal border-brand-border"
            disabled={!setting.is_editable_by_ui}
          />
        );
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    let success = true;
    for (const setting of settings) {
      const initial = initialSettings.find(s => s.id === setting.id);
      if (initial && initial.setting_value !== setting.setting_value) {
        try {
          // Validate JSON if applicable
          if (['object', 'array'].includes(setting.setting_type)) {
              JSON.parse(setting.setting_value);
          }
          await PlatformSetting.update(setting.id, { setting_value: setting.setting_value });
        } catch (error) {
          success = false;
          console.error(`Failed to update setting ${setting.setting_key}:`, error);
          toast({
            variant: "destructive",
            title: `Error saving ${setting.setting_key}`,
            description: error.message.includes('JSON') ? 'Invalid JSON format.' : 'Could not save setting.'
          });
        }
      }
    }
    setIsSaving(false);
    if (success) {
      toast({ title: "Success", description: "Settings have been saved." });
      loadSettings(); // Reload to confirm changes
    }
  };

  if (isLoading) {
    return <div className="h-64 bg-brand-card-bg rounded-lg animate-pulse border border-brand-border" />;
  }
  
  if (settings.length === 0) {
      return (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No Settings Found</AlertTitle>
            <AlertDescription>
                There are no settings configured for the '{category}' category.
            </AlertDescription>
         </Alert>
      )
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="capitalize">{category} Settings</CardTitle>
        <CardDescription>Manage platform settings for the {category} category.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings.map((setting) => (
          <div key={setting.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-t border-brand-border pt-6">
            <div className="md:col-span-1">
              <h4 className="font-semibold text-brand-text-primary">{setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
              <p className="text-sm text-brand-text-secondary">{setting.description}</p>
              {!setting.is_editable_by_ui && (
                  <p className="text-xs text-yellow-400 mt-1">This setting can only be changed by developers.</p>
              )}
            </div>
            <div className="md:col-span-2">
              {renderSettingInput(setting)}
            </div>
          </div>
        ))}
      </CardContent>
      <div className="p-6 pt-0 flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
      </div>
    </Card>
  );
};

export default SettingsManager;