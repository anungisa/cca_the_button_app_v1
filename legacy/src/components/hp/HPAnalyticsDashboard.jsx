import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShotTrackerLog } from '@/api/entities';
import { DrillLog } from '@/api/entities';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Loader2, Target, BookOpen, TrendingUp } from 'lucide-react';

export default function HPAnalyticsDashboard() {
    const [analyticsData, setAnalyticsData] = useState({
        accuracyOverTime: [],
        drillPerformance: [],
        shotTypeSuccess: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Mock data for analytics demonstration
                const accuracyOverTime = [
                    { month: 'Jan', draw: 85, hit: 88 },
                    { month: 'Feb', draw: 86, hit: 89 },
                    { month: 'Mar', draw: 88, hit: 90 },
                    { month: 'Apr', draw: 90, hit: 92 },
                    { month: 'May', draw: 91, hit: 93 },
                ];
                const drillPerformance = [
                    { name: 'Draw to Button', score: 4.2 },
                    { name: 'Hit and Roll', score: 4.5 },
                    { name: 'Guard Placement', score: 3.8 },
                    { name: 'Sweeping Power', score: 4.7 },
                ];
                const shotTypeSuccess = [
                    { name: 'Draw', make: 88, partial: 10, miss: 2 },
                    { name: 'Finesse Hit', make: 85, partial: 12, miss: 3 },
                    { name: 'Power Hit', make: 92, partial: 6, miss: 2 },
                ];
                setAnalyticsData({ accuracyOverTime, drillPerformance, shotTypeSuccess });
            } catch (error) {
                console.error("Failed to load HP analytics", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp/> Shot Accuracy Over Time</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analyticsData.accuracyOverTime}>
                            <XAxis dataKey="month" stroke="#888" />
                            <YAxis domain={[80, 100]} stroke="#888" unit="%" />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/>
                            <Legend />
                            <Line type="monotone" dataKey="draw" name="Draw Accuracy" stroke="#e11d48" />
                            <Line type="monotone" dataKey="hit" name="Hit Accuracy" stroke="#3b82f6" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
             <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-brand-card-bg border-brand-border">
                    <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen /> Average Drill Score</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analyticsData.drillPerformance} layout="vertical">
                                <XAxis type="number" domain={[0, 5]} stroke="#888" />
                                <YAxis type="category" dataKey="name" stroke="#888" width={110} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/>
                                <Bar dataKey="score" fill="#e11d48" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="bg-brand-card-bg border-brand-border">
                    <CardHeader><CardTitle className="flex items-center gap-2"><Target /> Shot Type Success Rate (%)</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analyticsData.shotTypeSuccess} layout="vertical">
                                <XAxis type="number" stackId="a" stroke="#888" unit="%" />
                                <YAxis type="category" dataKey="name" stroke="#888" width={90} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/>
                                <Legend />
                                <Bar dataKey="make" stackId="a" fill="#16a34a" name="Make" />
                                <Bar dataKey="partial" stackId="a" fill="#f59e0b" name="Partial" />
                                <Bar dataKey="miss" stackId="a" fill="#e11d48" name="Miss" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}