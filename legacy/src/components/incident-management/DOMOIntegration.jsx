import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, UploadCloud } from 'lucide-react';

export default function DOMOIntegration({ incidents, onDataPushed }) {
  const [pushStatus, setPushStatus] = useState('idle');

  const handlePushToDomo = async () => {
    setPushStatus('pushing');
    // Simulate API call to push data
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Pushing ${incidents.length} incident records to DOMO.`);
    setPushStatus('success');
    if (onDataPushed) onDataPushed();
    setTimeout(() => setPushStatus('idle'), 3000);
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <img src="https://www.domo.com/assets/images/domo-logo.png" alt="DOMO" className="w-auto h-5" />
          DOMO Analytics Sync
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-brand-text-secondary mb-4">
          Push the latest incident data to your DOMO instance for advanced business intelligence and dashboarding.
        </p>
        <div className="flex items-center gap-4">
          <Button onClick={handlePushToDomo} disabled={pushStatus === 'pushing'}>
            {pushStatus === 'pushing' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Pushing Data...
              </>
            ) : pushStatus === 'success' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Sync Complete
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 mr-2" />
                Push All Incidents to DOMO
              </>
            )}
          </Button>
          <p className="text-sm text-brand-text-secondary">
            {incidents.length} records ready to sync.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}