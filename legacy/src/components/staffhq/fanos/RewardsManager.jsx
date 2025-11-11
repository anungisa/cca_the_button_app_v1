import React, { useState, useEffect } from 'react';
import { Reward } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Gift, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const EditRewardModal = ({ reward, onSave, onClose }) => {
  const [formData, setFormData] = useState(reward || {
    name: '',
    description: '',
    category: 'merch',
    points_cost: 1000,
    is_active: true
  });

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-brand-card-bg border-brand-border">
        <DialogHeader>
          <DialogTitle>{reward ? 'Edit' : 'Create'} Reward</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Reward Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <Input type="number" placeholder="Points Cost" value={formData.points_cost} onChange={(e) => setFormData({ ...formData, points_cost: Number(e.target.value) })} />
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="merch">Merch</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
              <SelectItem value="discount">Discount</SelectItem>
              <SelectItem value="exclusive">Exclusive</SelectItem>
              <SelectItem value="auction">Auction Item</SelectItem>
            </SelectContent>
          </Select>
           <div className="flex items-center space-x-2">
            <Checkbox id="is_active_reward" checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
            <label htmlFor="is_active_reward" className="text-sm font-medium">Active</label>
          </div>
          <Button onClick={handleSave}>Save Reward</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function RewardsManager() {
  const [rewards, setRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState(null);

  useEffect(() => { loadRewards(); }, []);

  const loadRewards = async () => {
    setIsLoading(true);
    const fetchedRewards = await Reward.list();
    setRewards(fetchedRewards);
    setIsLoading(false);
  };

  const handleSaveReward = async (rewardData) => {
    if (editingReward) {
      await Reward.update(editingReward.id, rewardData);
    } else {
      await Reward.create(rewardData);
    }
    loadRewards();
  };

  const handleDeleteReward = async (rewardId) => {
    await Reward.delete(rewardId);
    loadRewards();
  };
  
  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin"/></div>;

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2"><Gift className="w-5 h-5" /> Rewards Management</CardTitle>
          <Button onClick={() => { setEditingReward(null); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Create Reward
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Points Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rewards.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.category}</TableCell>
                <TableCell>{r.points_cost}</TableCell>
                <TableCell>{r.is_active ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingReward(r); setIsModalOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteReward(r.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {isModalOpen && (
          <EditRewardModal
            reward={editingReward}
            onSave={handleSaveReward}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </CardContent>
    </Card>
  );
}