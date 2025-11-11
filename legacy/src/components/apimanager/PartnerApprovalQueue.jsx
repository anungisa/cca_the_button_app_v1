import React, { useState } from 'react';
import { useOptimizedData } from '../hooks/useOptimizedData';
import { APIEcosystemService } from '../services/APIEcosystemService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function PartnerApprovalQueue() {
    // In a real app, this would fetch from a 'PartnerApplication' entity.
    // For now, we simulate by getting data from the service layer.
    const [apps, setApps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const fetchApps = async () => {
            setIsLoading(true);
            const pendingApps = await APIEcosystemService.listPendingApps();
            setApps(pendingApps);
            setIsLoading(false);
        };
        fetchApps();
    }, []);

    const handleApproval = async (appId, action) => {
        try {
            if (action === 'approve') {
                await APIEcosystemService.approvePartnerApp(appId, ['clubs', 'events']); // Default approval
                toast.success("Application approved!");
            } else {
                await APIEcosystemService.rejectPartnerApp(appId);
                toast.error("Application rejected.");
            }
            // Refetch
            const pendingApps = await APIEcosystemService.listPendingApps();
            setApps(pendingApps);
        } catch (error) {
            toast.error(`Failed to process application: ${error.message}`);
        }
    };

    if (isLoading) return <Loader2 className="w-6 h-6 animate-spin" />;

    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
                <CardTitle>Partner API Approval Queue</CardTitle>
            </CardHeader>
            <CardContent>
                {apps.length === 0 ? (
                    <p className="text-brand-text-secondary">No pending applications.</p>
                ) : (
                    <div className="space-y-4">
                        {apps.map(app => (
                            <div key={app.id} className="p-4 bg-brand-charcoal/50 rounded-lg flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold">{app.name} <span className="text-sm text-brand-text-secondary">by {app.company}</span></h4>
                                    <p className="text-sm text-brand-text-secondary">{app.useCase}</p>
                                    <div className="flex gap-2 mt-2">
                                        {app.requestedAPIs.map(api => <Badge key={api}>{api}</Badge>)}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="border-red-500 text-red-500" onClick={() => handleApproval(app.id, 'reject')}><X className="w-4 h-4" /></Button>
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproval(app.id, 'approve')}><Check className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}