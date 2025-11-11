import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreatePressReleaseModal({ release, onSave, onClose }) {
  const [formData, setFormData] = useState(release || {
    title: '',
    category: 'organizational_update',
    status: 'draft',
    content: '',
    publish_date: new Date().toISOString().split('T')[0]
  });

  const handleSave = () => {
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] bg-brand-card-bg border-brand-border">
        <DialogHeader>
          <DialogTitle>{release ? 'Edit' : 'Create'} Press Release</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" value={formData.title} onChange={e => handleChange('title', e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Category</Label>
            <Select onValueChange={v => handleChange('category', v)} defaultValue={formData.category}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="championship_announcement">Championship Announcement</SelectItem>
                <SelectItem value="sponsor_news">Sponsor News</SelectItem>
                <SelectItem value="organizational_update">Organizational Update</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right mt-2">Content</Label>
            <Textarea id="content" value={formData.content} onChange={e => handleChange('content', e.target.value)} className="col-span-3 h-48" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="publish_date" className="text-right">Publish Date</Label>
            <Input id="publish_date" type="date" value={formData.publish_date} onChange={e => handleChange('publish_date', e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Release</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}