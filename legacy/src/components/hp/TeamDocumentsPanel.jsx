import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, CheckCircle2 } from 'lucide-react';

const TeamDocumentsPanel = ({ documents, onAcknowledge, onDownload }) => {
  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return '📄';
      case 'video': return '🎥';
      case 'image': return '🖼️';
      default: return '📄';
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-400" />
          Team Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documents && documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-brand-charcoal/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getFileTypeIcon(doc.file_type)}</span>
                  <div>
                    <h4 className="font-medium text-brand-text-primary">{doc.title}</h4>
                    <p className="text-sm text-brand-text-secondary">
                      From {doc.author} • {new Date(doc.created_date).toLocaleDateString()}
                    </p>
                    {doc.description && (
                      <p className="text-xs text-brand-text-secondary mt-1">{doc.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {doc.acknowledged ? (
                    <Badge className="bg-green-900/50 text-green-300">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Reviewed
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => onAcknowledge(doc.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Review
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDownload(doc.file_url, doc.title)}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-brand-text-secondary">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No documents available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamDocumentsPanel;