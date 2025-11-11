import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '../hooks/use-toast';
import { Upload, FileText, CheckCircle, AlertTriangle, Info, Download } from 'lucide-react';
import { Club } from '@/api/entities';
import { Event } from '@/api/entities';

export default function BulkDataImporter() {
  const [selectedEntity, setSelectedEntity] = useState('Club');
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [preview, setPreview] = useState(null);
  const { toast } = useToast();

  const entityOptions = [
    { 
      value: 'Club', 
      label: 'Clubs', 
      fields: ['name', 'location.city', 'location.province', 'location.address', 'location.postal_code', 'membership_count', 'ma_region'] 
    },
    { 
      value: 'Event', 
      label: 'Events', 
      fields: ['name', 'start_date', 'end_date', 'venue.name', 'venue.city'] 
    }
  ];

  const currentEntity = entityOptions.find(e => e.value === selectedEntity);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        variant: 'destructive',
        title: 'Invalid File',
        description: 'Please upload a CSV file'
      });
      return;
    }

    setFile(selectedFile);
    setResults(null); // Clear previous results
    
    // Preview first 5 rows
    const text = await selectedFile.text();
    const lines = text.split('\n').slice(0, 6); // Header + 5 rows
    const rows = lines.map(line => line.split(','));
    setPreview({ headers: rows[0], rows: rows.slice(1).filter(r => r.some(cell => cell.trim())) });
    
    toast({
      title: 'File Loaded',
      description: `Ready to import from ${selectedFile.name}`
    });
  };

  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    
    return result;
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a CSV file to import'
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setResults(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = parseCSVLine(lines[0]).map(h => h.trim());
      
      console.log('CSV Headers:', headers);
      
      const rows = lines.slice(1).map(line => parseCSVLine(line));
      console.log(`Processing ${rows.length} rows...`);
      
      let created = 0;
      let updated = 0;
      let skipped = 0;
      let errors = [];

      for (let i = 0; i < rows.length; i++) {
        try {
          const row = rows[i];
          
          // Skip empty rows
          if (!row.some(cell => cell.trim())) {
            skipped++;
            continue;
          }
          
          const data = {};
          
          headers.forEach((header, index) => {
            const value = row[index]?.trim().replace(/^"|"$/g, ''); // Remove quotes
            if (!value) return;
            
            // Handle nested fields (e.g., "location.city")
            if (header.includes('.')) {
              const [parent, child] = header.split('.');
              if (!data[parent]) data[parent] = {};
              data[parent][child] = value;
            } else {
              // Handle numbers
              if (header === 'membership_count' && value) {
                data[header] = parseInt(value) || 0;
              } else {
                data[header] = value;
              }
            }
          });

          if (!data.name) {
            errors.push({ row: i + 2, error: 'Missing name field' });
            continue;
          }

          // Check if entity exists
          if (selectedEntity === 'Club') {
            const [existing] = await Club.filter({ name: data.name });
            
            if (existing) {
              await Club.update(existing.id, data);
              updated++;
            } else {
              await Club.create(data);
              created++;
            }
          } else if (selectedEntity === 'Event') {
            const [existing] = await Event.filter({ name: data.name });
            
            if (existing) {
              await Event.update(existing.id, data);
              updated++;
            } else {
              await Event.create(data);
              created++;
            }
          }

          setProgress(Math.round(((i + 1) / rows.length) * 100));
        } catch (error) {
          console.error(`Error processing row ${i + 2}:`, error);
          errors.push({ row: i + 2, error: error.message });
        }
      }

      setResults({ created, updated, skipped, errors });
      
      toast({
        title: 'Import Complete!',
        description: `✅ Created: ${created} | 🔄 Updated: ${updated} | ⚠️ Errors: ${errors.length}`
      });

    } catch (error) {
      console.error('Import failed:', error);
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: error.message
      });
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const downloadTemplate = () => {
    const headers = currentEntity.fields.join(',');
    const exampleRow = selectedEntity === 'Club' 
      ? 'Example Curling Club,Toronto,Ontario,123 Main St,M1M 1M1,150,Ontario'
      : 'Example Tournament,2024-12-01,2024-12-03,Arena Name,Vancouver';
    
    const csvContent = `${headers}\n${exampleRow}\n`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedEntity}_Import_Template.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Template Downloaded',
      description: `Use this template to format your ${selectedEntity} data`
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Data Import
          </CardTitle>
          <CardDescription>
            Import hundreds of records at once from CSV files. Perfect for bulk uploads.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Entity Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text-primary">
              Step 1: Select Entity Type
            </label>
            <Select value={selectedEntity} onValueChange={setSelectedEntity} disabled={isProcessing}>
              <SelectTrigger className="bg-brand-charcoal border-brand-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {entityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expected Format Info */}
          {currentEntity && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Required CSV Columns:</strong>
                <div className="mt-2 font-mono text-xs bg-brand-charcoal p-2 rounded overflow-x-auto">
                  {currentEntity.fields.join(',')}
                </div>
                <p className="mt-2 text-xs">First row must be headers. Download template below for example.</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Step 2: Download Template */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text-primary">
              Step 2: Download Template (Optional)
            </label>
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Download {selectedEntity} CSV Template
            </Button>
          </div>

          {/* Step 3: File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text-primary">
              Step 3: Upload Your CSV File
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-brand-border rounded-lg p-8 text-center hover:border-brand-red hover:bg-brand-charcoal/30 transition-all">
                  {file ? (
                    <div className="space-y-2">
                      <FileText className="w-10 h-10 mx-auto text-brand-red" />
                      <div>
                        <p className="text-brand-text-primary font-medium">{file.name}</p>
                        <p className="text-brand-text-secondary text-sm">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          setFile(null);
                          setPreview(null);
                          setResults(null);
                        }}
                      >
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-10 h-10 mx-auto text-brand-text-secondary" />
                      <div>
                        <p className="text-brand-text-primary font-medium">Click to select CSV file</p>
                        <p className="text-brand-text-secondary text-sm">or drag and drop here</p>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                    className="hidden"
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Preview */}
          {preview && preview.rows.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-brand-text-primary">Preview (First 5 Rows)</h3>
              <div className="overflow-x-auto border border-brand-border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-brand-charcoal">
                    <tr>
                      {preview.headers.map((header, i) => (
                        <th key={i} className="px-4 py-2 text-left font-medium text-brand-text-primary border-b border-brand-border">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.map((row, i) => (
                      <tr key={i} className="border-t border-brand-border hover:bg-brand-charcoal/30">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2 text-brand-text-secondary">
                            {cell || <span className="text-brand-text-secondary/50 italic">empty</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-secondary">Processing records...</span>
                <span className="text-brand-text-primary font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          )}

          {/* Results Summary */}
          {results && (
            <Alert className={results.errors.length > 0 ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-green-500/50 bg-green-500/10'}>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <div className="font-medium text-lg">✅ Import Complete!</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-green-400 font-bold text-xl">{results.created}</div>
                      <div className="text-brand-text-secondary">Created</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-blue-400 font-bold text-xl">{results.updated}</div>
                      <div className="text-brand-text-secondary">Updated</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-gray-400 font-bold text-xl">{results.skipped}</div>
                      <div className="text-brand-text-secondary">Skipped</div>
                    </div>
                    <div className="space-y-1">
                      <div className={`font-bold text-xl ${results.errors.length > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {results.errors.length}
                      </div>
                      <div className="text-brand-text-secondary">Errors</div>
                    </div>
                  </div>
                  
                  {results.errors.length > 0 && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm text-yellow-400 hover:text-yellow-300 font-medium">
                        📋 View Error Details ({results.errors.length})
                      </summary>
                      <div className="mt-2 space-y-1 max-h-60 overflow-y-auto bg-brand-charcoal p-3 rounded">
                        {results.errors.map((err, i) => (
                          <div key={i} className="text-xs font-mono text-yellow-300">
                            <span className="text-yellow-500">Row {err.row}:</span> {err.error}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Step 4: Execute Import Button */}
          <div className="pt-4 border-t border-brand-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-brand-text-secondary">
                {file ? (
                  <span>✅ Ready to import {preview?.rows?.length || 0} records</span>
                ) : (
                  <span>⚠️ Please select a CSV file first</span>
                )}
              </div>
              <Button
                onClick={handleImport}
                disabled={!file || isProcessing}
                size="lg"
                className="bg-brand-red hover:bg-red-700 text-white font-medium px-8"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Importing... {progress}%
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Start Import
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}