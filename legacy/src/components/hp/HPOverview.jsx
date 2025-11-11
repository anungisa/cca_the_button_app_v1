import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/api/entities';
import { Team } from '@/api/entities';
import { DrillLog } from '@/api/entities';
import { ShotTrackerLog } from '@/api/entities';
import { Users, Shield, BookOpen, Target, Loader2 } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function HPOverview() {
    const [stats, setStats] = useState({
        athletes: 0,
        teams: 0,
        drillsLogged: 0,
        shotsTracked: 0,
        athletesByTier: [],
        accuracyByPosition: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [athletes, teams, drillLogs, shotLogs] = await Promise.all([
                    User.filter({ performance_tier: { $ne: 'none' } }),
                    Team.list(),
                    DrillLog.list(),
                    ShotTrackerLog.list()
                ]);

                // Mock data for charts
                const athletesByTier = [
                    { name: 'Club Comp', count: 120 },
                    { name: 'Prov Team', count: 80 },
                    { name: 'Nat Pool', count: 45 },
                    { name: 'Nat Team', count: 25 }
                ];
                const accuracyByPosition = [
                    { name: 'Lead', accuracy: 88 },
                    { name: 'Second', accuracy: 85 },
                    { name: 'Third', accuracy: 91 },
                    { name: 'Skip', accuracy: 94 }
                ];

                setStats({
                    athletes: athletes.length,
                    teams: teams.length,
                    drillsLogged: drillLogs.length,
                    shotsTracked: shotLogs.length,
                    athletesByTier,
                    accuracyByPosition
                });

            } catch (error) {
                console.error("Failed to load HP overview data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const StatCard = ({ title, value, icon: Icon }) => (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-brand-text-secondary" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            </CardContent>
        </Card>
    );

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="HP Athletes" value={stats.athletes} icon={Users} />
                <StatCard title="Active Teams" value={stats.teams} icon={Shield} />
                <StatCard title="Drills Logged (Season)" value={stats.drillsLogged} icon={BookOpen} />
                <StatCard title="Shots Tracked (Season)" value={stats.shotsTracked} icon={Target} />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-brand-card-bg border-brand-border">
                    <CardHeader><CardTitle>Athletes by Performance Tier</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.athletesByTier}>
                                <XAxis dataKey="name" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                                <Bar dataKey="count" fill="#e11d48" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="bg-brand-card-bg border-brand-border">
                    <CardHeader><CardTitle>Shot Accuracy by Position</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.accuracyByPosition}>
                                <XAxis dataKey="name" stroke="#888" />
                                <YAxis domain={[70, 100]} stroke="#888" unit="%" />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                                <Bar dataKey="accuracy" fill="#e11d48" name="Accuracy (%)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}