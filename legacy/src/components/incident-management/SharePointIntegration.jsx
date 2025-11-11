import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, Link, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function SharePointIntegration({ incident }) {
  const [syncStatus, setSyncStatus] = useState('idle');
  const [folderUrl, setFolderUrl] = useState(null);

  const handleSync = async () => {
    setSyncStatus('syncing');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (incident) {
      setFolderUrl(`https://curlingcanada.sharepoint.com/sites/Incidents/INC-${incident.id}`);
      setSyncStatus('success');
    } else {
      setSyncStatus('error');
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Microsoft_SharePoint_logo.svg/1200px-Microsoft_SharePoint_logo.svg.png" alt="SharePoint" className="w-5 h-5" />
          SharePoint Document Sync
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-brand-text-secondary mb-4">
          Create a dedicated SharePoint folder for this incident to store all related documents, emails, and evidence securely.
        </p>
        {!incident ? (
          <div className="text-center py-4 text-brand-text-secondary">
            <p>Select an incident from the main dashboard to manage its SharePoint folder.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-brand-charcoal rounded-lg">
              <p className="text-sm font-medium">Selected Incident:</p>
              <p className="font-semibold text-brand-text-primary">{incident.title}</p>
            </div>
            {syncStatus === 'success' && folderUrl ? (
              <div className="flex items-center gap-2 p-3 bg-green-900/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-green-400 font-semibold">Folder Created</p>
                  <a href={folderUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">
                    {folderUrl}
                  </a>
                </div>
              </div>
            ) : (
              <Button onClick={handleSync} disabled={syncStatus === 'syncing'}>
                {syncStatus === 'syncing' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Folder...
                  </>
                ) : (
                  <>
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Create & Sync Incident Folder
                  </>
                )}
              </Button>
            )}
             {syncStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <p>Could not create folder. Please try again.</p>
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}