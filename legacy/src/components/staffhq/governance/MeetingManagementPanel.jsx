import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Clock, ChevronRight } from 'lucide-react';
import { canadianProvincesAndTerritories } from '../../utils/provinces';
import { format } from 'date-fns';

const generateSampleMeetings = () => {
    const meetings = [
        { id: 'meet-nat-1', meeting_title: 'Q3 National Board Meeting', date: '2024-09-15T10:00:00Z', status: 'scheduled', ma_region: null, committee: 'Board' },
        { id: 'meet-nat-2', meeting_title: 'Annual General Meeting (AGM)', date: '2024-10-20T13:00:00Z', status: 'scheduled', ma_region: null, committee: 'National' },
        { id: 'meet-nat-3', meeting_title: 'Finance & Audit Committee', date: '2024-08-25T11:00:00Z', status: 'completed', ma_region: null, committee: 'Finance' },
    ];
    canadianProvincesAndTerritories.forEach(province => {
        meetings.push({
            id: `meet-${province.abbreviation}-1`,
            meeting_title: `${province.name} MA Quarterly Review`,
            date: `2024-09-05T14:00:00Z`,
            status: 'scheduled',
            ma_region: province.abbreviation,
            committee: 'MA Liaison'
        });
        meetings.push({
            id: `meet-${province.abbreviation}-2`,
            meeting_title: `${province.name} Safe Sport Committee Sync`,
            date: `2024-07-22T10:00:00Z`,
            status: 'completed',
            ma_region: province.abbreviation,
            committee: 'Safe Sport'
        });
    });
    return meetings;
};

export default function MeetingManagementPanel({ selectedRegion }) {
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        // In a real app, you would fetch this data from the GovernanceMeeting entity
        setMeetings(generateSampleMeetings());
    }, []);

    const filteredMeetings = useMemo(() => {
        if (selectedRegion === 'all') return meetings;
        return meetings.filter(m => !m.ma_region || m.ma_region === selectedRegion);
    }, [selectedRegion, meetings]);

    const getStatusBadge = (status) => {
        const config = {
            scheduled: "bg-blue-600",
            completed: "bg-green-600",
            cancelled: "bg-red-600",
        };
        return <Badge className={`${config[status] || 'bg-gray-500'} text-white`}>{status}</Badge>;
    };

    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
                <CardTitle>Meeting Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {filteredMeetings.sort((a, b) => new Date(b.date) - new Date(a.date)).map(meeting => (
                        <div key={meeting.id} className="flex items-center justify-between p-3 bg-brand-charcoal/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-md ${meeting.status === 'scheduled' ? 'bg-blue-500/20' : 'bg-green-500/20'}`}>
                                    <Calendar className={`w-5 h-5 ${meeting.status === 'scheduled' ? 'text-blue-400' : 'text-green-400'}`} />
                                </div>
                                <div>
                                    <p className="font-medium text-brand-text-primary">{meeting.meeting_title}</p>
                                    <p className="text-sm text-brand-text-secondary flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        {format(new Date(meeting.date), 'MMMM d, yyyy h:mm a')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline">{meeting.ma_region || 'National'}</Badge>
                                <Badge variant="secondary">{meeting.committee}</Badge>
                                {getStatusBadge(meeting.status)}
                                <Button size="sm" variant="ghost" className="flex items-center gap-1">
                                    Details <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}