import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Video, Mic, Tv, Calendar, PlayCircle, BarChartHorizontal } from 'lucide-react';

export default function BroadcastProductionConsole() {
    const broadcastSchedule = [
        { time: '14:00 EST', event: 'Pre-Game Show', status: 'ON AIR' },
        { time: '14:30 EST', event: 'Game: Einarson vs. Homan', status: 'Live' },
        { time: '17:00 EST', event: 'Post-Game Analysis', status: 'Upcoming' },
        { time: '18:00 EST', event: 'Evening Recap', status: 'Upcoming' },
    ];
    
    const feeds = [
        { name: 'Main Broadcast Feed', status: 'good', bitrate: '8.5 Mbps' },
        { name: 'Sheet A ISO Cam', status: 'good', bitrate: '6.0 Mbps' },
        { name: 'Sheet B ISO Cam', status: 'warning', bitrate: '4.2 Mbps' },
        { name: 'Press Conference Feed', status: 'standby', bitrate: 'N/A' },
    ];

    const StatusBadge = ({ status }) => {
        const config = {
          'ON AIR': { color: 'bg-red-600' },
          Live: { color: 'bg-green-600' },
          Upcoming: { color: 'bg-blue-600' },
          good: { color: 'bg-green-600' },
          warning: { color: 'bg-yellow-600' },
          standby: { color: 'bg-gray-600' },
        };
        const { color } = config[status] || { color: 'bg-gray-500' };
        return <Badge className={`${color} text-white`}>{status}</Badge>;
    };

    return (
        <div className="space-y-6">
            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader><CardTitle className="flex items-center gap-2"><Video className="w-6 h-6 text-brand-red" />Broadcast & Production</CardTitle></CardHeader>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-brand-card-bg border-brand-border">
                    <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5"/>Run of Show</CardTitle></CardHeader>
                    <CardContent>
                        {broadcastSchedule.map(item => (
                            <div key={item.time} className="flex items-center justify-between p-3 mb-2 bg-brand-charcoal rounded-lg">
                                <div>
                                    <p className="font-medium">{item.event}</p>
                                    <p className="text-sm text-brand-text-secondary">{item.time}</p>
                                </div>
                                <StatusBadge status={item.status} />
                            </div>
                        ))}
                    </CardContent>
                </Card>
                 <Card className="bg-brand-card-bg border-brand-border">
                    <CardHeader><CardTitle className="flex items-center gap-2"><Tv className="w-5 h-5"/>Live Feed Status</CardTitle></CardHeader>
                    <CardContent>
                         {feeds.map(feed => (
                            <div key={feed.name} className="flex items-center justify-between p-3 mb-2 bg-brand-charcoal rounded-lg">
                                <p className="font-medium">{feed.name}</p>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-brand-text-secondary">{feed.bitrate}</span>
                                    <StatusBadge status={feed.status} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader><CardTitle>Production Control</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex-col gap-2"><PlayCircle className="w-6 h-6"/>Graphics & Overlays</Button>
                    <Button variant="outline" className="h-20 flex-col gap-2"><Mic className="w-6 h-6"/>Commentary Control</Button>
                    <Button variant="outline" className="h-20 flex-col gap-2"><BarChartHorizontal className="w-6 h-6"/>Instant Replay</Button>
                    <Button variant="outline" className="h-20 flex-col gap-2"><Tv className="w-6 h-6"/>Commercial Breaks</Button>
                </CardContent>
            </Card>
        </div>
    );
}