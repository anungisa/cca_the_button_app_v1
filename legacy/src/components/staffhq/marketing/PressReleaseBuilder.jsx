import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

export default function PressReleaseBuilder({ release: initialRelease, onSubmit, onCancel }) {
  const [release, setRelease] = useState(initialRelease || {
    title: '',
    category: 'championship_announcement',
    status: 'draft',
    priority: 'routine',
    content: '',
    summary: '',
  });

  const handleChange = (field, value) => {
    setRelease(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field, date) => {
    handleChange(field, date ? date.toISOString() : '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(release);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Press Release Title"
        value={release.title}
        onChange={(e) => handleChange('title', e.target.value)}
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select value={release.category} onValueChange={(v) => handleChange('category', v)}>
          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="championship_announcement">Championship Announcement</SelectItem>
            <SelectItem value="sponsor_news">Sponsor News</SelectItem>
            <SelectItem value="athlete_spotlight">Athlete Spotlight</SelectItem>
            <SelectItem value="organizational_update">Organizational Update</SelectItem>
            <SelectItem value="partnership">Partnership</SelectItem>
            <SelectItem value="award_announcement">Award Announcement</SelectItem>
          </SelectContent>
        </Select>
        <Select value={release.priority} onValueChange={(v) => handleChange('priority', v)}>
          <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="routine">Routine</SelectItem>
            <SelectItem value="important">Important</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Textarea
        placeholder="Summary for media advisories..."
        value={release.summary}
        onChange={(e) => handleChange('summary', e.target.value)}
        className="h-24"
      />
      <Textarea
        placeholder="Full press release content..."
        value={release.content}
        onChange={(e) => handleChange('content', e.target.value)}
        className="h-48"
        required
      />
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {release.embargo_date ? format(new Date(release.embargo_date), 'PPP') : <span>Embargo Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={release.embargo_date ? new Date(release.embargo_date) : null} onSelect={(d) => handleDateChange('embargo_date', d)} /></PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {release.publish_date ? format(new Date(release.publish_date), 'PPP') : <span>Publish Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={release.publish_date ? new Date(release.publish_date) : null} onSelect={(d) => handleDateChange('publish_date', d)} /></PopoverContent>
        </Popover>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Release</Button>
      </div>
    </form>
  );
}