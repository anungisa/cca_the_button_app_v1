import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Database } from 'lucide-react';

export default function ExportPanel() {
  const handleDownloadAnnualSummary = () => {
    console.log('Downloading Annual Summary...');
    // Stub function - no actual export needed yet
  };

  const handleExportDEITracker = () => {
    console.log('Exporting DEI Tracker CSV...');
    // Stub function - no actual export needed yet
  };

  const handleViewRawData = () => {
    console.log('Viewing Raw Data...');
    // Stub function - no actual export needed yet
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Download className="w-5 h-5 text-brand-red" />
          <span>Export & Reporting</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={handleDownloadAnnualSummary}
            className="w-full justify-start bg-brand-charcoal/50 hover:bg-brand-charcoal text-brand-text-primary"
            variant="ghost"
          >
            <FileText className="w-4 h-4 mr-2" />
            Download Annual Summary
          </Button>
          
          <Button 
            onClick={handleExportDEITracker}
            className="w-full justify-start bg-brand-charcoal/50 hover:bg-brand-charcoal text-brand-text-primary"
            variant="ghost"
          >
            <Download className="w-4 h-4 mr-2" />
            Export DEI Tracker (CSV)
          </Button>
          
          <Button 
            onClick={handleViewRawData}
            className="w-full justify-start bg-brand-charcoal/50 hover:bg-brand-charcoal text-brand-text-primary"
            variant="ghost"
          >
            <Database className="w-4 h-4 mr-2" />
            View Raw Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}