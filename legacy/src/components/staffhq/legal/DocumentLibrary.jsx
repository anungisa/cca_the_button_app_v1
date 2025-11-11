import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HRDocument } from '@/api/entities';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Search, Download, Eye, Loader2 } from 'lucide-react';

export default function DocumentLibrary() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      try {
        // Filter for legal-related documents
        const allDocs = await HRDocument.list('-upload_date');
        const legalDocs = allDocs.filter(doc => 
          ['employment_agreement', 'certificate', 'general', 'other'].includes(doc.document_type) ||
          doc.tags?.some(tag => tag.toLowerCase().includes('legal'))
        );
        setDocuments(legalDocs);
        setFilteredDocs(legalDocs);
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDocuments();
  }, []);

  useEffect(() => {
    const results = documents.filter(doc =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredDocs(results);
  }, [searchTerm, documents]);

  const getTypeColor = (type) => {
    const colors = {
      employment_agreement: 'bg-blue-600 text-white',
      certificate: 'bg-green-600 text-white',
      general: 'bg-purple-600 text-white',
      other: 'bg-gray-600 text-white'
    };
    return colors[type] || 'bg-gray-600 text-white';
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Legal Document Library</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => (
          <Card key={doc.id} className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {doc.title}
                  </CardTitle>
                  <Badge className={`${getTypeColor(doc.document_type)} mt-2`}>
                    {doc.document_type.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-brand-text-secondary">
                  <p>Version: {doc.version}</p>
                  <p>Uploaded: {new Date(doc.upload_date).toLocaleDateString()}</p>
                  <p>By: {doc.uploaded_by}</p>
                </div>
                {doc.tags && (
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}