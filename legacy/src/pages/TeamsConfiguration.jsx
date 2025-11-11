import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlatformSetting } from '@/api/entities';
import { Loader2, TestTube2, Save, CheckCircle, XCircle } from 'lucide-react';
import { TeamsNotificationService } from '../components/utils/TeamsNotificationService';

export default function TeamsConfiguration() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // 'success', 'error', or null

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const setting = await PlatformSetting.filter({ setting_key: 'teams_webhook_url' });
      if (setting.length > 0) {
        setWebhookUrl(setting[0].setting_value);
      }
    } catch (error) {
      console.error("Failed to load Teams settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const existingSettings = await PlatformSetting.filter({ setting_key: 'teams_webhook_url' });
      const settingData = {
        setting_key: 'teams_webhook_url',
        setting_value: webhookUrl,
        setting_type: 'string',
        category: 'integrations',
        description: 'Webhook URL for Microsoft Teams notifications.'
      };

      if (existingSettings.length > 0) {
        await PlatformSetting.update(existingSettings[0].id, settingData);
      } else {
        await PlatformSetting.create(settingData);
      }
      alert('Settings saved successfully!');
    } catch (error) {
      console.error("Failed to save Teams settings:", error);
      alert('Error saving settings.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleTest = async () => {
    setIsTesting(true);
    setTestStatus(null);
    try {
      const success = await TeamsNotificationService.sendTestNotification(webhookUrl);
      if (success) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    } catch (error) {
      console.error("Failed to send test notification:", error);
      setTestStatus('error');
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <Card className="max-w-2xl mx-auto bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Microsoft Teams Integration</CardTitle>
          <CardDescription>Connect Staff HQ to a Teams channel to receive real-time notifications and approvals.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="webhook-url">Incoming Webhook URL</Label>
            <p className="text-sm text-brand-text-secondary mb-2">
              Create an "Incoming Webhook" connector in your desired Teams channel and paste the URL here.
            </p>
            <Input
              id="webhook-url"
              type="password"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-tenant.webhook.office.com/..."
            />
          </div>
          
          <div className="flex items-center gap-4">
             <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
            <Button onClick={handleTest} variant="outline" disabled={!webhookUrl || isTesting}>
              {isTesting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <TestTube2 className="w-4 h-4 mr-2" />}
              Send Test
            </Button>
            {testStatus === 'success' && <div className="flex items-center text-green-400"><CheckCircle className="w-4 h-4 mr-2" /> Test Succeeded!</div>}
            {testStatus === 'error' && <div className="flex items-center text-red-400"><XCircle className="w-4 h-4 mr-2" /> Test Failed.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}