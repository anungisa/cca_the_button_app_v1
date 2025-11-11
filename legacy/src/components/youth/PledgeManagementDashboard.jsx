
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Check, X, Filter } from 'lucide-react';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';

const generateSamplePledges = () => {
    let pledges = [];
    const pledgeTypes = ["try_curling", "volunteer", "bring_a_friend", "support_ftloc"];
    const names = ["Alice", "Bob", "Charlie", "Diana", "Eve"];

    canadianProvincesAndTerritories.forEach(p => {
        for (let i = 0; i < 2; i++) {
            pledges.push({
                id: `pl-${p.abbreviation}-${i}`,
                name: `${names[i]} from ${p.name}`,
                province: p.abbreviation,
                pledge_type: pledgeTypes[i % pledgeTypes.length],
                pledge_statement: `I pledge to ${pledgeTypes[i % pledgeTypes.length].replace(/_/g, ' ')} this season!`,
                status: 'pending_review'
            });
        }
    });
    return pledges;
};

export default function PledgeManagementDashboard({ selectedRegion }) {
    const [pledges, setPledges] = useState([]);
    const [statusFilter, setStatusFilter] = useState('pending_review');

    useEffect(() => {
        setPledges(generateSamplePledges());
    }, []);

    const handleUpdateStatus = (pledgeId, newStatus) => {
        setPledges(prev => prev.map(p => p.id === pledgeId ? { ...p, status: newStatus } : p));
    };

    const filteredPledges = useMemo(() => {
        return pledges.filter(p => 
            (selectedRegion === 'all' || p.province === selectedRegion) &&
            (statusFilter === 'all' || p.status === statusFilter)
        );
    }, [selectedRegion, statusFilter, pledges]);
    
    const getStatusBadge = (status) => {
        const config = {
            pending_review: { color: 'bg-yellow-500', text: 'Pending' },
            approved: { color: 'bg-green-500', text: 'Approved' },
            rejected: { color: 'bg-red-500', text: 'Rejected' },
        };
        const { color, text } = config[status] || { color: 'bg-gray-500', text: 'Unknown' };
        return <Badge className={`${color} text-white`}>{text}</Badge>;
    };

    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ClipboardCheck className="text-purple-500" />
                        Pledge Management
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-brand-text-secondary" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-brand-card-bg border-brand-border rounded-md p-1 text-sm text-brand-text-primary"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending_review">Pending Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </CardTitle>
                 <p className="text-brand-text-secondary">Viewing data for: {selectedRegion === 'all' ? 'National' : getProvinceNameByAbbreviation(selectedRegion)}</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {filteredPledges.length > 0 ? filteredPledges.map(pledge => (
                        <div key={pledge.id} className="p-4 bg-brand-charcoal rounded-lg flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h4 className="font-semibold text-brand-text-primary">{pledge.name}</h4>
                                    <Badge variant="secondary">{pledge.province}</Badge>
                                    {getStatusBadge(pledge.status)}
                                </div>
                                <p className="text-sm text-brand-text-secondary mt-1 italic">"{pledge.pledge_statement}"</p>
                            </div>
                            {pledge.status === 'pending_review' && (
                                <div className="flex gap-2">
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus(pledge.id, 'approved')}>
                                        <Check className="w-4 h-4 mr-1" /> Approve
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(pledge.id, 'rejected')}>
                                        <X className="w-4 h-4 mr-1" /> Reject
                                    </Button>
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="text-center py-8 text-brand-text-secondary">No pledges match the current filters.</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
