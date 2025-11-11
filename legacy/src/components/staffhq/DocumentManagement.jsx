import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, Upload, Download, Search, Trash2, Edit, Share2, MoreVertical, Folder, Clock, User
} from 'lucide-react';
import { useXP } from '../XPContext';
import { HRDocument } from '@/api/entities';
import { UploadFile } from '@/api/integrations';

const UploadDocumentModal = ({ isOpen, onClose, onUploadSuccess, projectId = null }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useXP();

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      if (!title) {
        setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !title) return;
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      await HRDocument.create({
        title,
        file_url,
        document_type: projectId ? 'project_brief' : 'general',
        uploaded_by: user.id,
        project_id: projectId,
        access_level: projectId ? 'project_team' : 'hr_only',
        upload_date: new Date().toISOString(),
        version: '1.0'
      });
      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setIsUploading(false);
      setFile(null);
      setTitle('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>Share files with your team or for your records.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            placeholder="Document Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input type="file" onChange={handleFileChange} />
          {file && <p className="text-sm text-brand-text-secondary">Selected: {file.name}</p>}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isUploading}>Cancel</Button>
            <Button onClick={handleUpload} disabled={isUploading || !file || !title}>
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function DocumentManagement({ projectId = null }) {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const filter = projectId ? { project_id: projectId } : {};
      const docs = await HRDocument.filter(filter, '-upload_date');
      setDocuments(docs);
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await HRDocument.delete(docId);
        loadDocuments();
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  return (
    <div className="p-6 bg-brand-charcoal min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-primary">Document Library</h1>
          <p className="text-brand-text-secondary">Central repository for all your files and documents.</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {isLoading ? (
        <p className="text-brand-text-secondary">Loading documents...</p>
      ) : (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length > 0 ? filteredDocuments.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium text-brand-text-primary">{doc.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.document_type}</Badge>
                    </TableCell>
                    <TableCell className="text-brand-text-secondary text-sm">
                      {new Date(doc.upload_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{doc.access_level.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                      </a>
                      <Button variant="ghost" size="sm"><Share2 className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan="5" className="text-center text-brand-text-secondary py-8">
                      No documents found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <UploadDocumentModal 
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={loadDocuments}
        projectId={projectId}
      />
    </div>
  );
}