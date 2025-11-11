import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PressRelease } from '@/api/entities';
import { format } from 'date-fns';
import { PlusCircle, FileText, Eye, Edit, Send } from 'lucide-react';
// Assuming a modal component exists for creating/editing
// import CreatePressReleaseModal from './CreatePressReleaseModal';

export default function PressReleaseHub() {
  const [releases, setReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadReleases();
  }, []);

  const loadReleases = async () => {
    setIsLoading(true);
    try {
      const data = await PressRelease.list('-publish_date');
      setReleases(data);
    } catch (error) {
      console.error("Failed to load press releases:", error);
      // Fallback to sample data
      setReleases([
        { id: '1', title: 'Curling Canada announces 2026 Brier host city', category: 'championship_announcement', status: 'published', publish_date: '2024-11-15T14:00:00Z', priority: 'important' },
        { id: '2', title: 'PointsBet renews National Partnership', category: 'sponsor_news', status: 'approved', publish_date: '2024-12-01T13:00:00Z', priority: 'important' },
        { id: '3', title: 'Holiday message from CEO Nolan Thiessen', category: 'organizational_update', status: 'draft', publish_date: null, priority: 'routine' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      draft: { color: 'bg-gray-500', text: 'Draft' },
      review: { color: 'bg-yellow-500', text: 'In Review' },
      approved: { color: 'bg-blue-500', text: 'Approved' },
      published: { color: 'bg-green-600', text: 'Published' },
      archived: { color: 'bg-neutral-700', text: 'Archived' },
    };
    const { color, text } = config[status] || config.draft;
    return <Badge className={`${color} text-white`}>{text}</Badge>;
  };
  
  const getPriorityBadge = (priority) => {
    const config = {
      routine: { color: 'bg-gray-500', text: 'Routine' },
      important: { color: 'bg-blue-500', text: 'Important' },
      urgent: { color: 'bg-red-600', text: 'Urgent' },
    };
    const { color, text } = config[priority] || config.routine;
    return <Badge className={`${color} text-white`}>{text}</Badge>;
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Press Release Dashboard
          </CardTitle>
          <Button onClick={() => setShowCreateModal(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            New Press Release
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading releases...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Publish Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {releases.map(release => (
                <TableRow key={release.id}>
                  <TableCell className="font-medium text-brand-text-primary">{release.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {release.category.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(release.status)}</TableCell>
                  <TableCell>{getPriorityBadge(release.priority)}</TableCell>
                  <TableCell>
                    {release.publish_date ? format(new Date(release.publish_date), 'MMM d, yyyy h:mm a') : 'Not Scheduled'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon"><Send className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {/* Modal would be here, e.g. <CreatePressReleaseModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} /> */}
      </CardContent>
    </Card>
  );
}