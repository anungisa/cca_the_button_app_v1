import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Flag, Eye, CheckCircle, XCircle } from 'lucide-react';

export default function CommunityModeration() {
  const [flaggedContent, setFlaggedContent] = useState([
    {
      id: '1',
      type: 'post',
      content: 'This is some inappropriate content that was flagged by users...',
      reporter: 'user123',
      reason: 'inappropriate_language',
      status: 'pending',
      created_date: '2024-01-15'
    },
    {
      id: '2', 
      type: 'comment',
      content: 'Another piece of flagged content...',
      reporter: 'user456',
      reason: 'spam',
      status: 'pending',
      created_date: '2024-01-14'
    }
  ]);

  const handleModerate = (contentId, action) => {
    setFlaggedContent(prev => prev.map(item => 
      item.id === contentId ? { ...item, status: action } : item
    ));
  };

  const ModerationCard = ({ item }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-medium">
              Flagged {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </CardTitle>
            <Badge variant="outline" className="mt-1">
              {item.reason.replace('_', ' ')}
            </Badge>
          </div>
          <Badge variant={item.status === 'pending' ? 'destructive' : 'secondary'}>
            {item.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-brand-text-secondary mb-3 bg-brand-charcoal p-2 rounded">
          {item.content}
        </p>
        <div className="flex items-center justify-between text-xs text-brand-text-muted mb-3">
          <span>Reported by: {item.reporter}</span>
          <span>{new Date(item.created_date).toLocaleDateString()}</span>
        </div>
        {item.status === 'pending' && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleModerate(item.id, 'approved')}>
              <CheckCircle className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleModerate(item.id, 'removed')}>
              <XCircle className="w-4 h-4 mr-1" />
              Remove
            </Button>
            <Button size="sm" variant="ghost">
              <Eye className="w-4 h-4 mr-1" />
              Review
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6 text-center">
            <Flag className="w-8 h-8 text-brand-red mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-text-primary">
              {flaggedContent.filter(item => item.status === 'pending').length}
            </p>
            <p className="text-sm text-brand-text-secondary">Pending Reviews</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-text-primary">
              {flaggedContent.filter(item => item.status === 'approved').length}
            </p>
            <p className="text-sm text-brand-text-secondary">Approved</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6 text-center">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-text-primary">
              {flaggedContent.filter(item => item.status === 'removed').length}
            </p>
            <p className="text-sm text-brand-text-secondary">Removed</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Content Awaiting Moderation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flaggedContent.filter(item => item.status === 'pending').map(item => (
            <ModerationCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}