import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function CreateCampaignModal({ campaign, onSave, onClose }) {
  const [formData, setFormData] = useState(campaign || {
    campaign_name: '',
    campaign_type: 'social_campaign',
    status: 'planning',
    priority: 'medium',
    target_date: '',
    budget_allocated: 0,
    budget_spent: 0,
    target_audience: [],
    channels: []
  });

  const handleSave = () => {
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-brand-card-bg border-brand-border">
        <DialogHeader>
          <DialogTitle>{campaign ? 'Edit' : 'Create'} Marketing Campaign</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={formData.campaign_name} onChange={e => handleChange('campaign_name', e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
             <Select onValueChange={value => handleChange('campaign_type', value)} defaultValue={formData.campaign_type}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="press_release">Press Release</SelectItem>
                  <SelectItem value="social_campaign">Social Campaign</SelectItem>
                  <SelectItem value="email_blast">Email Blast</SelectItem>
                  <SelectItem value="event_promotion">Event Promotion</SelectItem>
                </SelectContent>
              </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Target Date</Label>
            <Input id="date" type="date" value={formData.target_date} onChange={e => handleChange('target_date', e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="budget" className="text-right">Budget</Label>
            <Input id="budget" type="number" value={formData.budget_allocated} onChange={e => handleChange('budget_allocated', Number(e.target.value))} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Campaign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}