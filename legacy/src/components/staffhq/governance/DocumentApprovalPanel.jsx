import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, User, ChevronsRight, Send } from 'lucide-react';
import { canadianProvincesAndTerritories } from '../../utils/provinces';
import { formatDistanceToNow } from 'date-fns';

const generateSampleApprovals = () => {
    const approvals = [
        { id: 'app-nat-1', document_title: 'Q3 Financial Statement', submitted_by: 'Finance Dept', workflow_stage: 'board_approval', ma_region: null, submission_date: '2024-08-28T10:00:00Z' },
        { id: 'app-nat-2', document_title: 'Updated Media Policy', submitted_by: 'Comms Team', workflow_stage: 'legal_review', ma_region: null, submission_date: '2024-08-25T15:30:00Z' },
    ];
    canadianProvincesAndTerritories.forEach(province => {
        approvals.push({
            id: `app-${province.abbreviation}-1`,
            document_title: `${province.name} Grant Application`,
            submitted_by: `${province.abbreviation} MA Admin`,
            workflow_stage: 'executive_review',
            ma_region: province.abbreviation,
            submission_date: `2024-08-20T09:00:00Z`
        });
    });
    return approvals;
};

export default function DocumentApprovalPanel({ selectedRegion }) {
    const [approvals, setApprovals] = useState([]);

    useEffect(() => {
        // In a real app, you would fetch this data from the DocumentApproval entity
        setApprovals(generateSampleApprovals());
    }, []);

    const filteredApprovals = useMemo(() => {
        if (selectedRegion === 'all') return approvals;
        return approvals.filter(a => !a.ma_region || a.ma_region === selectedRegion);
    }, [selectedRegion, approvals]);

    const getStageBadge = (stage) => {
        const config = {
            draft: { color: "bg-gray-500", text: "Draft" },
            legal_review: { color: "bg-yellow-600", text: "Legal Review" },
            executive_review: { color: "bg-orange-500", text: "Exec. Review" },
            board_approval: { color: "bg-purple-600", text: "Board Approval" },
            final_signatures: { color: "bg-blue-600", text: "Signatures" },
            completed: { color: "bg-green-600", text: "Completed" }
        };
        const { color, text } = config[stage] || config.draft;
        return <Badge className={`${color} text-white`}>{text}</Badge>;
    };

    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
                <CardTitle>Document Approval Workflows</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {filteredApprovals.sort((a,b) => new Date(b.submission_date) - new Date(a.submission_date)).map(approval => (
                        <div key={approval.id} className="grid grid-cols-3 items-center p-3 bg-brand-charcoal/30 rounded-lg gap-4">
                            <div className="col-span-1">
                                <p className="font-medium text-brand-text-primary">{approval.document_title}</p>
                                <p className="text-sm text-brand-text-secondary flex items-center gap-1">
                                    <User className="w-3 h-3" /> Submitted by {approval.submitted_by}
                                </p>
                            </div>
                            <div className="col-span-1 flex items-center justify-center">
                                <Badge variant="outline">{approval.ma_region || 'National'}</Badge>
                                <ChevronsRight className="w-4 h-4 text-brand-text-secondary mx-2" />
                                {getStageBadge(approval.workflow_stage)}
                            </div>
                            <div className="col-span-1 flex items-center justify-end gap-2">
                                <span className="text-xs text-brand-text-secondary">
                                    {formatDistanceToNow(new Date(approval.submission_date), { addSuffix: true })}
                                </span>
                                <Button size="sm" variant="outline">Review</Button>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
                                    <Send className="w-3 h-3" />Approve
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}