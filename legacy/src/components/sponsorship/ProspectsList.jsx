import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { canadianProvincesAndTerritories } from '../utils/provinces';

const generateSampleProspects = () => {
    const statuses = ["lead", "contacted", "qualified", "proposal_sent", "on_hold", "not_a_fit"];
    let prospects = [];
    
    // Generate fewer prospects to avoid overwhelming the display
    canadianProvincesAndTerritories.slice(0, 5).forEach(p => {
        for(let i=0; i < 2; i++) {
            prospects.push({
                id: `prospect-${p.abbreviation}-${i}`,
                company_name: `${p.name} Corp ${i+1}`,
                contact_name: `Contact ${i+1}`,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                estimated_value: Math.floor(Math.random() * 40000) + 10000,
                last_contacted_date: `2024-0${Math.floor(Math.random() * 8) + 1}-15`,
                ma_region: p.abbreviation
            });
        }
    });
    
    prospects.push({ 
        id: 'prospect-nat-1', 
        company_name: 'Nationwide Insurance', 
        contact_name: 'Alex Ray', 
        status: 'qualified', 
        estimated_value: 300000, 
        last_contacted_date: '2024-08-01', 
        ma_region: null 
    });
    
    return prospects;
}

export default function ProspectsList({ selectedRegion }) {
    const [prospects, setProspects] = useState([]);
    
    useEffect(() => {
        // In real app, fetch from SponsorProspect entity
        setProspects(generateSampleProspects());
    }, []);

    const filteredProspects = useMemo(() => {
        if (selectedRegion === 'all') return prospects;
        return prospects.filter(p => !p.ma_region || p.ma_region === selectedRegion);
    }, [selectedRegion, prospects]);

    const getStatusBadge = (status) => {
        const config = {
            lead: "bg-gray-500",
            contacted: "bg-blue-500",
            qualified: "bg-teal-500",
            proposal_sent: "bg-purple-500",
            on_hold: "bg-orange-500",
            not_a_fit: "bg-red-600"
        };
        return <Badge className={`${config[status] || 'bg-gray-400'} text-white capitalize`}>{status.replace('_', ' ')}</Badge>;
    };

    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sponsorship Prospects</CardTitle>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Prospect
                </Button>
            </CardHeader>
            <CardContent>
                {filteredProspects.length === 0 ? (
                    <div className="text-center py-8 text-brand-text-secondary">
                        No prospects found for the selected region.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Region</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Estimated Value</TableHead>
                                    <TableHead>Last Contacted</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProspects.map((prospect) => (
                                    <TableRow key={prospect.id}>
                                        <TableCell className="font-semibold">{prospect.company_name}</TableCell>
                                        <TableCell>{prospect.contact_name}</TableCell>
                                        <TableCell><Badge variant="outline">{prospect.ma_region || 'National'}</Badge></TableCell>
                                        <TableCell>{getStatusBadge(prospect.status)}</TableCell>
                                        <TableCell>${prospect.estimated_value.toLocaleString()}</TableCell>
                                        <TableCell>{prospect.last_contacted_date}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm">View</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}