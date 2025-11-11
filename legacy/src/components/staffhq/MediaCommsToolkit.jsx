import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Download, Send } from 'lucide-react';

const MediaCommsToolkit = () => {
  const mediaKits = [
    { name: 'The Button Brand Assets', size: '15.2 MB' },
    { name: 'FTLOC Campaign Kit 2024', size: '8.7 MB' },
    { name: 'National Events Fact Sheet', size: '1.2 MB' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            Push Notification Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-brand-text-secondary">Title</label>
            <Input placeholder="Notification Title" className="bg-brand-charcoal border-brand-border" />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-text-secondary">Message</label>
            <Textarea placeholder="Notification body..." className="bg-brand-charcoal border-brand-border" />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-text-secondary">Target Audience</label>
            <Select>
              <SelectTrigger className="bg-brand-charcoal border-brand-border">
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="hp_athletes">HP Athletes</SelectItem>
                <SelectItem value="volunteers">Volunteers</SelectItem>
                <SelectItem value="event_attendees">Event Attendees</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Schedule Notification
          </Button>
        </CardContent>
      </Card>
      <div className="space-y-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Media Kit Downloads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mediaKits.map(kit => (
              <div key={kit.name} className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
                <div>
                  <p className="font-medium text-brand-text-primary">{kit.name}</p>
                  <p className="text-xs text-brand-text-secondary">{kit.size}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader><CardTitle>Live Post Analytics</CardTitle></CardHeader>
          <CardContent className="text-center text-brand-text-secondary">
            <p>Social media analytics dashboard will be displayed here.</p>
            <p className="text-sm mt-2">DOMO integration pending.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MediaCommsToolkit;