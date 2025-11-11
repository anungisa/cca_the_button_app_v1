
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

export default function EditCampaignModal({ isOpen, onClose, campaign, onSubmit }) {
  const [formData, setFormData] = useState(campaign || {
    campaign_name: '',
    campaign_type: 'press_release',
    priority: 'medium',
    target_date: '',
    description: '',
    budget_allocated: 0
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-brand-card-bg border-brand-border">
        <DialogHeader>
          <DialogTitle className="text-brand-text-primary">Edit Campaign</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Campaign Name"
            value={formData.campaign_name}
            onChange={(e) => handleChange('campaign_name', e.target.value)}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={formData.campaign_type} onValueChange={(v) => handleChange('campaign_type', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Campaign Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="press_release">Press Release</SelectItem>
                <SelectItem value="social_campaign">Social Campaign</SelectItem>
                <SelectItem value="email_blast">Email Blast</SelectItem>
                <SelectItem value="partnership_announcement">Partnership Announcement</SelectItem>
                <SelectItem value="event_promotion">Event Promotion</SelectItem>
                <SelectItem value="sponsor_activation">Sponsor Activation</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={formData.priority} onValueChange={(v) => handleChange('priority', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Textarea
            placeholder="Campaign Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="h-24"
          />
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Campaign
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
