import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertTriangle, Download } from 'lucide-react';

const BulkDataImporter = () => {
  const [importType, setImportType] = useState('');
  const [file, setFile] = useState(null);
  const [importStatus, setImportStatus] = useState('idle'); // idle, processing, completed, error
  const [importResults, setImportResults] = useState({
    totalRows: 0,
    successRows: 0,
    errorRows: 0,
    errors: []
  });

  const importTypes = [
    { value: 'users', label: 'Users & Staff' },
    { value: 'clubs', label: 'Clubs' },
    { value: 'volunteers', label: 'Volunteers' },
    { value: 'events', label: 'Events' },
    { value: 'sponsors', label: 'Sponsors' }
  ];

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === 'text/csv') {
      setFile(uploadedFile);
    } else {
      alert('Please upload a CSV file.');
    }
  };

  const handleImport = async () => {
    if (!file || !importType) {
      alert('Please select both a file and import type.');
      return;
    }

    setImportStatus('processing');
    
    // Simulate import process
    setTimeout(() => {
      // Mock results
      const mockResults = {
        totalRows: 150,
        successRows: 142,
        errorRows: 8,
        errors: [
          'Row 15: Missing required field "email"',
          'Row 23: Invalid phone number format',
          'Row 34: Duplicate email address',
          'Row 67: Invalid MA region code',
          'Row 89: Missing required field "full_name"',
          'Row 102: Invalid date format',
          'Row 127: Club ID not found',
          'Row 141: Invalid role assignment'
        ]
      };
      
      setImportResults(mockResults);
      setImportStatus('completed');
    }, 3000);
  };

  const downloadTemplate = () => {
    // In a real implementation, this would generate and download an actual CSV template
    alert(`CSV template for ${importType} will be downloaded.`);
  };

  const getStatusBadge = () => {
    switch (importStatus) {
      case 'processing':
        return <Badge className="bg-blue-600">Processing...</Badge>;
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>;
      case 'error':
        return <Badge className="bg-red-600">Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-brand-text-primary">Bulk Data Import</h3>
        <p className="text-brand-text-secondary">Import large datasets from CSV files into the platform</p>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Data Import Configuration
            </span>
            {getStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Import Type
              </label>
              <Select value={importType} onValueChange={setImportType}>
                <SelectTrigger className="bg-brand-charcoal border-brand-border">
                  <SelectValue placeholder="Select data type to import" />
                </SelectTrigger>
                <SelectContent>
                  {importTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                CSV File
              </label>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="bg-brand-charcoal border-brand-border"
              />
            </div>
          </div>

          {importType && (
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-text-secondary" />
              <span className="text-sm text-brand-text-secondary">Need a template?</span>
              <Button variant="link" size="sm" onClick={downloadTemplate} className="p-0 h-auto">
                Download CSV template for {importTypes.find(t => t.value === importType)?.label}
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setFile(null);
                setImportType('');
                setImportStatus('idle');
                setImportResults({ totalRows: 0, successRows: 0, errorRows: 0, errors: [] });
              }}
            >
              Reset
            </Button>
            <Button 
              onClick={handleImport}
              disabled={!file || !importType || importStatus === 'processing'}
              className="bg-brand-red hover:bg-red-700"
            >
              {importStatus === 'processing' ? 'Processing...' : 'Start Import'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Results */}
      {importStatus === 'completed' && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Import Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-text-primary">{importResults.totalRows}</p>
                <p className="text-sm text-brand-text-secondary">Total Rows</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{importResults.successRows}</p>
                <p className="text-sm text-brand-text-secondary">Successful</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">{importResults.errorRows}</p>
                <p className="text-sm text-brand-text-secondary">Errors</p>
              </div>
            </div>

            {importResults.errorRows > 0 && (
              <Alert className="bg-yellow-900/20 border-yellow-500/30">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Import Completed with Errors</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1">
                    {importResults.errors.slice(0, 5).map((error, index) => (
                      <p key={index} className="text-sm font-mono">{error}</p>
                    ))}
                    {importResults.errors.length > 5 && (
                      <p className="text-sm italic">
                        ... and {importResults.errors.length - 5} more errors
                      </p>
                    )}
                  </div>
                  <Button variant="link" size="sm" className="mt-2 p-0 h-auto">
                    <Download className="w-4 h-4 mr-1" />
                    Download full error report
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkDataImporter;