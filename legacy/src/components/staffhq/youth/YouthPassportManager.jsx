import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Search, Award } from 'lucide-react';
import { User, AthleteJourney } from '@/api/entities';
import { formatEnumString } from '@/components/utils/formatters';

const PASSPORT_MILESTONES = [
    'curlingreg_enrollment',
    'safe_sport_completed',
    'club_affiliation',
    'coach_assignment',
    'first_drill',
    'first_competition',
    'provincial_selection',
    'national_pool',
    'national_team'
];

const YouthUserRow = ({ user, milestones }) => {
    const completedCount = milestones.length;
    const totalMilestones = PASSPORT_MILESTONES.length;
    const progress = totalMilestones > 0 ? (completedCount / totalMilestones) * 100 : 0;
    const lastMilestone = milestones.length > 0 ? milestones.sort((a, b) => new Date(b.milestone_date) - new Date(a.milestone_date))[0] : null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <TableRow className="cursor-pointer hover:bg-brand-border/20">
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.ma_region || 'N/A'}</TableCell>
                    <TableCell>{user.home_club_name || 'N/A'}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Progress value={progress} className="w-24" />
                            <span className="text-xs text-brand-text-secondary">{Math.round(progress)}%</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline">{lastMilestone ? formatEnumString(lastMilestone.milestone_type) : 'Not Started'}</Badge>
                    </TableCell>
                </TableRow>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-brand-card-bg border-brand-border">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Award className="w-6 h-6 text-brand-red" />
                        {user.full_name}'s Youth Passport
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    <p className="text-brand-text-secondary">Review of completed milestones and achievements.</p>
                    <ul className="space-y-3">
                        {PASSPORT_MILESTONES.map(milestoneKey => {
                            const completed = milestones.find(m => m.milestone_type === milestoneKey);
                            return (
                                <li key={milestoneKey} className={`flex items-center p-3 rounded-md ${completed ? 'bg-green-500/10' : 'bg-brand-charcoal'}`}>
                                    <div className={`w-2 h-8 mr-4 rounded-full ${completed ? 'bg-green-500' : 'bg-brand-border'}`}></div>
                                    <div className="flex-1">
                                        <p className={`font-medium ${completed ? 'text-green-300' : 'text-brand-text-primary'}`}>{formatEnumString(milestoneKey)}</p>
                                        {completed && <p className="text-xs text-brand-text-secondary">Completed: {new Date(completed.milestone_date).toLocaleDateString()}</p>}
                                    </div>
                                    {completed && <Badge variant="success">Completed</Badge>}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default function YouthPassportManager() {
    const [users, setUsers] = useState([]);
    const [journeys, setJourneys] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [userData, journeyData] = await Promise.all([
                    User.filter({ user_type: 'athlete' }), // Assuming youth are marked as 'athlete'
                    AthleteJourney.list()
                ]);
                setUsers(Array.isArray(userData) ? userData : []);
                setJourneys(Array.isArray(journeyData) ? journeyData : []);
            } catch (error) {
                console.error("Failed to fetch youth data:", error);
                setUsers([]);
                setJourneys([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const journeysByAthlete = useMemo(() => {
        return journeys.reduce((acc, journey) => {
            if (!acc[journey.athlete_id]) {
                acc[journey.athlete_id] = [];
            }
            acc[journey.athlete_id].push(journey);
            return acc;
        }, {});
    }, [journeys]);

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        return users.filter(user =>
            user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.ma_region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.home_club_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    return (
        <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
                <CardTitle>Youth Passport Management</CardTitle>
                <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                    <Input
                        placeholder="Search by name, region, or club..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full max-w-lg bg-brand-charcoal"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>MA Region</TableHead>
                            <TableHead>Home Club</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Last Milestone</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <YouthUserRow key={user.id} user={user} milestones={journeysByAthlete[user.id] || []} />
                            ))
                        ) : (
                            <TableRow><TableCell colSpan="5" className="text-center">No youth athletes found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}