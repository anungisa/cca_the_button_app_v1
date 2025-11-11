import React, { useState, useEffect } from 'react';
import { PressRelease } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CreatePressReleaseModal from './CreatePressReleaseModal';

export default function PressReleaseHub() {
  const [releases, setReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRelease, setEditingRelease] = useState(null);

  const loadReleases = async () => {
    setIsLoading(true);
    const data = await PressRelease.list('-publish_date');
    setReleases(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadReleases();
  }, []);

  const handleSave = async (data) => {
    if (editingRelease) {
      await PressRelease.update(editingRelease.id, data);
    } else {
      await PressRelease.create(data);
    }
    await loadReleases();
    setIsModalOpen(false);
    setEditingRelease(null);
  };

  const getStatusBadge = (status) => {
    const colors = {
      draft: 'bg-gray-500',
      review: 'bg-yellow-500',
      approved: 'bg-blue-500',
      published: 'bg-green-500',
    };
    return <Badge className={`${colors[status] || 'bg-gray-400'} text-white`}>{status}</Badge>;
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-brand-text-primary">Press Releases</h3>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Release
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Publish Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {releases.map(release => (
            <TableRow key={release.id}>
              <TableCell className="font-medium">{release.title}</TableCell>
              <TableCell>{release.category.replace(/_/g, ' ')}</TableCell>
              <TableCell>{getStatusBadge(release.status)}</TableCell>
              <TableCell>{new Date(release.publish_date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => { setEditingRelease(release); setIsModalOpen(true); }}>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isModalOpen && <CreatePressReleaseModal release={editingRelease} onSave={handleSave} onClose={() => { setIsModalOpen(false); setEditingRelease(null); }} />}
    </div>
  );
}