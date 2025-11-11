import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function CreateSocialPostModal({ onSave, onClose }) {
  const [formData, setFormData] = useState({
    platform: 'Twitter',
    content: '',
    status: 'draft',
    scheduled_at: new Date().toISOString().slice(0, 16),
  });
  
  const handleChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-brand-card-bg border-brand-border">
        <DialogHeader><DialogTitle>Create Social Post</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
           <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Platform</Label>
            <Select onValueChange={v => handleChange('platform', v)} defaultValue={formData.platform}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Twitter">Twitter</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right mt-2">Content</Label>
            <Textarea id="content" value={formData.content} onChange={e => handleChange('content', e.target.value)} className="col-span-3 h-32" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="scheduled_at" className="text-right">Schedule</Label>
            <Input id="scheduled_at" type="datetime-local" value={formData.scheduled_at} onChange={e => handleChange('scheduled_at', e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave({...formData, status: 'scheduled'})}>Schedule Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}