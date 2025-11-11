import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const generateSampleDrills = () => ([
    { id: 'drill-1', title: 'Standard Draw to the Button', ma_region: null, focus_area: 'weight_control', difficulty: 'intermediate' },
    { id: 'drill-2', title: 'Four-Rock Hit and Roll', ma_region: null, focus_area: 'delivery', difficulty: 'advanced' },
    { id: 'drill-3', title: 'ON - Advanced Sweeping Intervals', ma_region: 'ON', focus_area: 'sweeping', difficulty: 'advanced' },
    { id: 'drill-4', title: 'BC - Beginner Weight Judgment', ma_region: 'BC', focus_area: 'weight_control', difficulty: 'beginner' },
]);

export default function DrillLibraryManager({ selectedRegion }) {
    const allDrills = useMemo(generateSampleDrills, []);

    const filteredDrills = useMemo(() => {
        if (selectedRegion === 'all') return allDrills;
        // Show national (null) and region-specific drills
        return allDrills.filter(d => d.ma_region === null || d.ma_region === selectedRegion);
    }, [selectedRegion, allDrills]);

    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Drill Library</CardTitle>
                <Button><Plus className="w-4 h-4 mr-2"/> Add Drill</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {filteredDrills.map(drill => (
                        <div key={drill.id} className="p-4 bg-brand-charcoal rounded-lg flex justify-between items-center">
                            <div>
                                <h4 className="font-semibold text-brand-text-primary">{drill.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="capitalize">{drill.focus_area.replace('_', ' ')}</Badge>
                                    <Badge variant="secondary" className="capitalize">{drill.difficulty}</Badge>
                                </div>
                            </div>
                            <Badge className={drill.ma_region ? 'bg-blue-600 text-white' : ''}>{drill.ma_region || 'National'}</Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}