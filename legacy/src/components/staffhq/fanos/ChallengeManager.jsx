import React, { useState, useEffect } from 'react';
import { XPChallenge } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Trophy, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const EditChallengeModal = ({ challenge, onSave, onClose }) => {
  const [formData, setFormData] = useState(challenge || {
    name: '',
    description: '',
    challenge_type: 'log_activity',
    xp_reward: 50,
    is_active: true,
  });

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-brand-card-bg border-brand-border">
        <DialogHeader>
          <DialogTitle>{challenge ? 'Edit' : 'Create'} Challenge</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Challenge Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <Input type="number" placeholder="XP Reward" value={formData.xp_reward} onChange={(e) => setFormData({ ...formData, xp_reward: Number(e.target.value) })} />
          <Select value={formData.challenge_type} onValueChange={(value) => setFormData({ ...formData, challenge_type: value })}>
            <SelectTrigger><SelectValue placeholder="Challenge Type" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="post_in_community">Post in Community</SelectItem>
                <SelectItem value="log_activity">Log an Activity</SelectItem>
                <SelectItem value="complete_knowledge_article">Complete Knowledge Article</SelectItem>
                <SelectItem value="donate_to_ftloc">Donate to FTLOC</SelectItem>
                <SelectItem value="refer_friend">Refer a Friend</SelectItem>
                <SelectItem value="seasonal_event">Seasonal Event</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Checkbox id="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
            <label htmlFor="is_active" className="text-sm font-medium">Active</label>
          </div>
          <Button onClick={handleSave}>Save Challenge</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function ChallengeManager() {
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  
  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    setIsLoading(true);
    const fetchedChallenges = await XPChallenge.list();
    setChallenges(fetchedChallenges);
    setIsLoading(false);
  };

  const handleSaveChallenge = async (challengeData) => {
    if (editingChallenge) {
      await XPChallenge.update(editingChallenge.id, challengeData);
    } else {
      await XPChallenge.create(challengeData);
    }
    loadChallenges();
  };

  const handleDeleteChallenge = async (challengeId) => {
    await XPChallenge.delete(challengeId);
    loadChallenges();
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin"/></div>;

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5" /> Challenge Management</CardTitle>
          <Button onClick={() => { setEditingChallenge(null); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Create Challenge
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>XP Reward</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {challenges.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.challenge_type}</TableCell>
                <TableCell>{c.xp_reward}</TableCell>
                <TableCell>{c.is_active ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingChallenge(c); setIsModalOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteChallenge(c.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {isModalOpen && (
          <EditChallengeModal
            challenge={editingChallenge}
            onSave={handleSaveChallenge}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </CardContent>
    </Card>
  );
}