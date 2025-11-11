import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, Eye, BarChart3 } from 'lucide-react';

export default function StreamingAnalyticsPanel({ events = [] }) {
  const totalStreams = events.length;
  const liveStreams = events.filter(e => e.event_type === 'live').length;
  const totalWatchTime = 4320; // Mock data
  const uniqueViewers = 12500; // Mock data

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-red" />
          Streaming Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-brand-charcoal rounded-lg text-center">
            <Eye className="w-6 h-6 mx-auto text-blue-400 mb-2" />
            <p className="text-xl font-bold text-brand-text-primary">{uniqueViewers.toLocaleString()}</p>
            <p className="text-xs text-brand-text-secondary">Unique Viewers</p>
          </div>
          <div className="p-4 bg-brand-charcoal rounded-lg text-center">
            <Clock className="w-6 h-6 mx-auto text-purple-400 mb-2" />
            <p className="text-xl font-bold text-brand-text-primary">{(totalWatchTime / 60).toFixed(0)}h</p>
            <p className="text-xs text-brand-text-secondary">Total Watch Time</p>
          </div>
          <div className="p-4 bg-brand-charcoal rounded-lg text-center">
            <Users className="w-6 h-6 mx-auto text-green-400 mb-2" />
            <p className="text-xl font-bold text-brand-text-primary">{totalStreams}</p>
            <p className="text-xs text-brand-text-secondary">Total Events</p>
          </div>
          <div className="p-4 bg-brand-charcoal rounded-lg text-center">
            <div className="relative inline-block">
              <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0 animate-ping"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0"></div>
              <Eye className="w-6 h-6 mx-auto text-red-400 mb-2" />
            </div>
            <p className="text-xl font-bold text-brand-text-primary">{liveStreams}</p>
            <p className="text-xs text-brand-text-secondary">Live Now</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}