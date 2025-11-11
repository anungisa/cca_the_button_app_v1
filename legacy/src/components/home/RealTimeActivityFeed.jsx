import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Star, Trophy, MessageSquare } from 'lucide-react';
import { timeSince } from '../utils/timeSince';

// Mock Data
const feedItems = [
    { id: 1, user: 'Brad Gushue', action: 'earned the "Provincial Champion" badge!', icon: Trophy, time: new Date(Date.now() - 1000 * 60 * 5) },
    { id: 2, user: 'Jennifer Jones', action: 'redeemed 5,000 points for a signed jersey.', icon: Star, time: new Date(Date.now() - 1000 * 60 * 22) },
    { id: 3, user: 'Your Club President', action: 'posted a new update in the Community Hub.', icon: MessageSquare, time: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: 4, user: 'Kerri Einarson', action: 'just went on a 5-day login streak!', icon: Star, time: new Date(Date.now() - 1000 * 60 * 60 * 8) },
];

export default function RealTimeActivityFeed() {
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Community Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
            {feedItems.map(item => (
                <li key={item.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-charcoal rounded-full flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-brand-text-secondary" />
                    </div>
                    <div>
                        <p className="text-sm text-brand-text-primary">
                            <span className="font-bold">{item.user}</span> {item.action}
                        </p>
                        <p className="text-xs text-brand-text-secondary">{timeSince(item.time)}</p>
                    </div>
                </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  );
}