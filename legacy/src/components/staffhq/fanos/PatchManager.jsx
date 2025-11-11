import React, { useState, useEffect } from 'react';
import { Patch } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Puzzle, Loader2 } from 'lucide-react';

const EditPatchModal = ({ patch, onSave, onClose }) => {
  const [formData, setFormData] = useState(patch || {
    name: '',
    qr_code_id: `patch-${Date.now()}`,
    event_id: '',
    xp_value: 100,
    rarity: 'common',
    image_url: ''
  });

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-brand-card-bg border-brand-border">
        <DialogHeader>
          <DialogTitle>{patch ? 'Edit' : 'Create'} Patch</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Patch Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input placeholder="Event ID" value={formData.event_id} onChange={(e) => setFormData({ ...formData, event_id: e.target.value })} />
          <Input placeholder="Image URL" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} />
          <Input type="number" placeholder="XP Value" value={formData.xp_value} onChange={(e) => setFormData({ ...formData, xp_value: Number(e.target.value) })} />
          <Select value={formData.rarity} onValueChange={(value) => setFormData({ ...formData, rarity: value })}>
            <SelectTrigger><SelectValue placeholder="Rarity" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="common">Common</SelectItem>
              <SelectItem value="uncommon">Uncommon</SelectItem>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="epic">Epic</SelectItem>
              <SelectItem value="legendary">Legendary</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSave}>Save Patch</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function PatchManager() {
  const [patches, setPatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatch, setEditingPatch] = useState(null);

  useEffect(() => {
    loadPatches();
  }, []);

  const loadPatches = async () => {
    setIsLoading(true);
    try {
      const fetchedPatches = await Patch.list();
      setPatches(fetchedPatches);
    } catch (error) {
      console.error("Error loading patches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePatch = async (patchData) => {
    if (editingPatch) {
      await Patch.update(editingPatch.id, patchData);
    } else {
      await Patch.create(patchData);
    }
    loadPatches();
  };

  const handleDeletePatch = async (patchId) => {
    await Patch.delete(patchId);
    loadPatches();
  };
  
  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin"/></div>;

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2"><Puzzle className="w-5 h-5" /> Patch Management</CardTitle>
          <Button onClick={() => { setEditingPatch(null); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Create Patch
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Event ID</TableHead>
              <TableHead>XP</TableHead>
              <TableHead>Rarity</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patches.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.event_id}</TableCell>
                <TableCell>{p.xp_value}</TableCell>
                <TableCell>{p.rarity}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingPatch(p); setIsModalOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                     <Button variant="ghost" size="icon" onClick={() => handleDeletePatch(p.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {isModalOpen && (
          <EditPatchModal
            patch={editingPatch}
            onSave={handleSavePatch}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </CardContent>
    </Card>
  );
}