import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CommunityProgram } from '@/api/entities';
import { canadianProvincesAndTerritories } from '../../utils/provinces';
import { Plus } from 'lucide-react';

const generateSamplePrograms = () => {
    let programs = [];
    const programTypes = ["league", "camp", "clinic", "special_event", "school_program"];
    const focusAreas = ["youth", "gender_equity", "indigenous", "newcomers", "adaptive"];
    const statuses = ["planning", "active", "completed"];

    canadianProvincesAndTerritories.forEach(p => {
        for (let i = 0; i < 3; i++) {
            programs.push({
                id: `prog-${p.abbreviation}-${i}`,
                name: `${p.name} Youth ${programTypes[i % programTypes.length]}`,
                program_type: programTypes[i % programTypes.length],
                focus_area: focusAreas[i % focusAreas.length],
                ma_region: p.abbreviation,
                participant_count: Math.floor(Math.random() * 100) + 20,
                start_date: `2024-0${i+1}-01`,
                end_date: `2024-0${i+1}-28`,
                status: statuses[i % statuses.length],
            });
        }
    });
    return programs;
};


const ProgramCard = ({ program }) => {
    const getStatusBadge = (status) => {
        const config = {
            planning: { color: 'bg-yellow-500', text: 'Planning' },
            active: { color: 'bg-green-500', text: 'Active' },
            completed: { color: 'bg-blue-500', text: 'Completed' },
            cancelled: { color: 'bg-red-500', text: 'Cancelled' },
        };
        const { color, text } = config[status] || { color: 'bg-gray-500', text: 'Unknown' };
        return <Badge className={`${color} text-white`}>{text}</Badge>;
    };

    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
                <CardTitle className="text-lg flex justify-between items-start">
                    {program.name}
                    {getStatusBadge(program.status)}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    <p className="text-brand-text-secondary">{program.description || "A community program to foster curling skills."}</p>
                    <div className="flex justify-between border-t border-brand-border pt-2 mt-2">
                        <span className="text-brand-text-secondary">Region:</span>
                        <Badge variant="outline">{program.ma_region}</Badge>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-brand-text-secondary">Focus Area:</span>
                        <span className="font-medium capitalize">{program.focus_area.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-brand-text-secondary">Participants:</span>
                        <span className="font-medium">{program.participant_count}</span>
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">View Details</Button>
                </div>
            </CardContent>
        </Card>
    );
};


export default function CommunityProgramManager({ selectedRegion }) {
    const [programs, setPrograms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPrograms = async () => {
            setIsLoading(true);
            try {
                // In a real app, this would fetch from the CommunityProgram entity
                // const allPrograms = await CommunityProgram.list();
                // setPrograms(allPrograms);
                setPrograms(generateSamplePrograms()); // Using sample data for now
            } catch (error) {
                console.error("Failed to load community programs:", error);
                setPrograms(generateSamplePrograms());
            } finally {
                setIsLoading(false);
            }
        };
        loadPrograms();
    }, []);

    const filteredPrograms = useMemo(() => {
        if (selectedRegion === 'all') return programs;
        return programs.filter(p => p.ma_region === selectedRegion);
    }, [selectedRegion, programs]);

    if (isLoading) {
        return <div className="text-center p-8">Loading programs...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Community Program Management</h2>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Program
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.map(program => (
                    <ProgramCard key={program.id} program={program} />
                ))}
            </div>
            {filteredPrograms.length === 0 && (
                 <Card className="bg-brand-card-bg border-brand-border">
                    <CardContent className="p-8 text-center text-brand-text-secondary">
                        No programs found for the selected region.
                    </CardContent>
                 </Card>
            )}
        </div>
    );
}