import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, PlusCircle, Send, BarChart2, Users, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const mockNewsletters = [
  { 
    id: 1, 
    name: 'Monthly Member Update - December', 
    status: 'Sent', 
    sent: '118,430', 
    open_rate: '31.2%',
    click_rate: '4.8%',
    subscribers: '125,000',
    send_date: '2024-12-01'
  },
  { 
    id: 2, 
    name: 'Brier 2025 Ticket Pre-Sale', 
    status: 'Sent', 
    sent: '48,812', 
    open_rate: '47.3%',
    click_rate: '12.1%',
    subscribers: '50,000',
    send_date: '2024-11-15'
  },
  { 
    id: 3, 
    name: 'FTLOC Supporter Newsletter', 
    status: 'Draft', 
    sent: 'N/A', 
    open_rate: 'N/A',
    click_rate: 'N/A',
    subscribers: '35,000',
    send_date: null
  },
  { 
    id: 4, 
    name: 'New Year Championship Preview', 
    status: 'Scheduled', 
    sent: 'N/A', 
    open_rate: 'N/A',
    click_rate: 'N/A',
    subscribers: '125,000',
    send_date: '2025-01-02'
  },
];

export default function NewsletterToolkit() {
  const [newsletters, setNewsletters] = useState(mockNewsletters);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Sent': return 'bg-green-600';
      case 'Scheduled': return 'bg-blue-600';
      case 'Draft': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const formatNumber = (num) => {
    if (num === 'N/A') return num;
    return parseInt(num.replace(',', '')).toLocaleString();
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-brand-text-primary">
          <Mail className="w-5 h-5" />
          Newsletter Toolkit
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Manage Lists
          </Button>
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            New Newsletter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-brand-charcoal p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-brand-text-primary">125K</div>
            <div className="text-sm text-brand-text-secondary">Total Subscribers</div>
          </div>
          <div className="bg-brand-charcoal p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">32.1%</div>
            <div className="text-sm text-brand-text-secondary">Avg Open Rate</div>
          </div>
          <div className="bg-brand-charcoal p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">6.2%</div>
            <div className="text-sm text-brand-text-secondary">Avg Click Rate</div>
          </div>
        </div>

        {/* Newsletter List */}
        {newsletters.map(item => (
          <div key={item.id} className="bg-brand-charcoal p-4 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-brand-text-primary mb-1">{item.name}</h4>
                <div className="flex items-center gap-4 text-xs text-brand-text-secondary">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> 
                    {formatNumber(item.subscribers)} subscribers
                  </span>
                  {item.send_date && (
                    <span>Sent: {item.send_date}</span>
                  )}
                </div>
              </div>
              <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
            </div>
            
            {item.status === 'Sent' && (
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Send className="w-3 h-3 text-brand-text-secondary" />
                  <span className="text-brand-text-secondary">Sent:</span>
                  <span className="text-brand-text-primary font-medium">{item.sent}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-3 h-3 text-brand-text-secondary" />
                  <span className="text-brand-text-secondary">Opened:</span>
                  <span className="text-brand-text-primary font-medium">{item.open_rate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-3 h-3 text-brand-text-secondary" />
                  <span className="text-brand-text-secondary">Clicked:</span>
                  <span className="text-brand-text-primary font-medium">{item.click_rate}</span>
                </div>
              </div>
            )}

            {item.status === 'Draft' && (
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button size="sm">Schedule</Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}