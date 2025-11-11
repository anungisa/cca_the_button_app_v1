
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Heart, Copy, CheckCircle, ExternalLink, Webhook, Shield,
  Download, Upload, RefreshCw, Database, FileSpreadsheet
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { base44 } from '@/api/base44Client';

export default function GiveCloudIntegration() {
  const [copied, setCopied] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const { toast } = useToast();

  const webhookUrl = 'https://base44.app/api/apps/686ddd789691a323a1380fee/functions/giveCloudWebhook';

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copied!",
      description: "Webhook URL copied to clipboard",
    });
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResults(null);

    try {
      toast({
        title: "Importing...",
        description: "Processing CSV file",
      });

      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file is empty or only contains headers');
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
      console.log('[CSV Import] Headers found:', headers);
      
      const donations = [];

      for (let i = 1; i < lines.length; i++) {
        // Handle CSV with quoted fields
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const donation = {};
        
        headers.forEach((header, index) => {
          donation[header] = values[index];
        });

        // Map common field names to our schema
        const donorEmail = donation.email || 
                          donation.donor_email || 
                          donation['donor email'] || 
                          donation['customer email'] || 
                          '';

        const donationData = {
          amount: parseFloat(
            donation.amount || 
            donation.total || 
            donation['total amount'] || 
            donation.price || 
            0
          ),
          type: (donation.recurring || donation.frequency || '').toLowerCase().includes('month') ? 'monthly' : 'one_time',
          donor_name: donation.name || donation.donor_name || donation['donor name'] || donation.customer || 'Anonymous',
          donor_email: donorEmail || `anonymous-${Date.now()}-${i}@givecloud.import`,
          anonymous: !donorEmail || (donation.anonymous || '').toLowerCase() === 'yes' || (donation.anonymous || '').toLowerCase() === 'true',
          tax_receipt_required: true,
          payment_status: 'completed',
          campaign: donation.campaign || donation.product || donation['product name'] || donation.designation || 'General Support',
          category: 'ftloc',
          ma_region: donation.province || donation.state || donation.region || null
        };

        if (donationData.amount > 0) {
          donations.push(donationData);
        }
      }

      console.log('[CSV Import] Parsed donations:', donations.length);

      if (donations.length === 0) {
        throw new Error('No valid donations found in CSV. Please check the format.');
      }

      // Bulk create donations
      let created = 0;
      let skipped = 0;
      let errors = 0;

      for (const donation of donations) {
        try {
          // Check if already exists (skip anonymous imports)
          if (!donation.donor_email.includes('@givecloud.import')) {
            const existing = await base44.entities.Donation.filter({
              donor_email: donation.donor_email,
              amount: donation.amount
            });

            if (existing.length > 0) {
              skipped++;
              continue;
            }
          }

          await base44.entities.Donation.create(donation);
          created++;
        } catch (error) {
          console.error('Failed to create donation:', error);
          errors++;
        }
      }

      setImportResults({
        total: donations.length,
        created,
        skipped,
        errors
      });

      toast({
        title: "Import Complete!",
        description: `Imported ${created} donations (${skipped} duplicates skipped, ${errors} errors)`,
      });

      e.target.value = '';

    } catch (error) {
      console.error('[CSV Import] Error:', error);
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: error.message,
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Webhook Setup */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500" />
            GiveCloud Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription>
              <div className="space-y-3">
                <p className="font-semibold">✅ Webhook Connected</p>
                <p className="text-sm">New donations will automatically sync to The Button.</p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-brand-text-primary mb-2 flex items-center gap-2">
                <Webhook className="w-5 h-5" />
                Webhook Configuration
              </h3>
              <p className="text-sm text-brand-text-secondary mb-4">
                Configure this webhook in your GiveCloud admin panel to automatically sync donations.
              </p>
            </div>

            <div className="bg-brand-charcoal/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-brand-text-secondary">Webhook URL</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyWebhookUrl}
                  className="gap-2"
                >
                  {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <code className="block text-xs bg-black/50 p-2 rounded break-all text-green-400">
                {webhookUrl}
              </code>
            </div>

            <Button 
              asChild
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              <a 
                href="https://curlingcanada.givecloud.co/jpanel/settings/integrations/webhooks" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open GiveCloud Webhooks Settings
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historical Data Import */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-blue-500" />
            Import Historical Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-brand-text-secondary mb-4">
                Export your donation history from GiveCloud as a CSV file and upload it here to import historical data.
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-brand-text-primary text-sm">📝 How to Export from GiveCloud:</h4>
              <ol className="text-xs text-brand-text-secondary space-y-1 ml-4">
                <li>1. Log in to GiveCloud admin panel</li>
                <li>2. Go to Reports → Donations/Orders</li>
                <li>3. Select the date range you want</li>
                <li>4. Click "Export" or "Download CSV"</li>
                <li>5. Upload the downloaded file below</li>
              </ol>
            </div>

            <div className="space-y-3">
              <Label htmlFor="csv-upload" className="text-base font-semibold">Upload CSV File</Label>
              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                disabled={isImporting}
                className="cursor-pointer"
              />
              <p className="text-xs text-brand-text-secondary">
                The CSV should include columns for: amount, donor name, donor email, campaign/product
              </p>
            </div>

            {isImporting && (
              <div className="flex items-center justify-center py-4">
                <RefreshCw className="w-5 h-5 animate-spin text-brand-red mr-2" />
                <span className="text-sm">Importing donations...</span>
              </div>
            )}

            {importResults && (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold">Import Results:</p>
                    <ul className="text-sm space-y-1">
                      <li>✅ {importResults.created} new donations imported</li>
                      <li>⏭️ {importResults.skipped} duplicates skipped</li>
                      <li>📊 {importResults.total} total in file</li>
                      {importResults.errors > 0 && (
                        <li className="text-yellow-500">⚠️ {importResults.errors} errors</li>
                      )}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Alert>
            <AlertDescription className="text-xs">
              <p className="font-semibold mb-2">💡 Note:</p>
              <p>GiveCloud's API access is limited. CSV import is the recommended method for historical data. Going forward, all new donations will sync automatically via webhook.</p>
            </AlertDescription>
          </Alert>

        </CardContent>
      </Card>
    </div>
  );
}
