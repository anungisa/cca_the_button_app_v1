import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function UploadAssetModal({ onSave, onClose }) {
  const [formData, setFormData] = useState({
    asset_name: '',
    asset_type: 'logo',
    file_url: '',
    audience: ['internal'],
    license_type: 'internal_use_only'
  });

  const handleSave = () => {
    onSave(formData);
  };
  
  const handleChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-brand-card-bg border-brand-border">
        <DialogHeader><DialogTitle>Upload Brand Asset</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Asset Name</Label>
            <Input id="name" value={formData.asset_name} onChange={e => handleChange('asset_name', e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">File URL</Label>
            <Input id="url" placeholder="Enter public URL to the asset" value={formData.file_url} onChange={e => handleChange('file_url', e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Asset Type</Label>
            <Select onValueChange={v => handleChange('asset_type', v)} defaultValue={formData.asset_type}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="logo">Logo</SelectItem>
                <SelectItem value="photo">Photo</SelectItem>
                <SelectItem value="template">Template</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Asset</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}