import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, RefreshCw, AlertCircle, Settings } from 'lucide-react';
import { FinanceService } from '../services/FinanceService';
import { useToast } from '@/components/hooks/use-toast';

export default function QuickBooksIntegration() {
    const [status, setStatus] = useState('connected');
    const [lastSync, setLastSync] = useState(new Date().toISOString());
    const [isSyncing, setIsSyncing] = useState(false);
    const { toast } = useToast();

    const handleForceSync = async () => {
        setIsSyncing(true);
        const result = await FinanceService.forceSync('QuickBooks');
        setIsSyncing(false);
        if (result.status === 'success') {
            setLastSync(new Date().toISOString());
            toast({
                title: "Sync Successful",
                description: "QuickBooks data has been updated.",
                variant: 'default',
            });
        } else {
            setStatus('error');
            toast({
                title: "Sync Failed",
                description: "Could not connect to QuickBooks. Please check settings.",
                variant: 'destructive',
            });
        }
    };

    const StatusIndicator = () => {
        switch (status) {
            case 'connected':
                return <Badge className="bg-green-600 text-white"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>;
            case 'error':
                return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>;
            default:
                return <Badge variant="secondary">Disconnected</Badge>;
        }
    };

    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <img src="https://i.imgur.com/v1hvf0D.png" alt="QuickBooks Logo" className="w-6 h-6" />
                        QuickBooks Integration
                    </CardTitle>
                    <StatusIndicator />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <p className="text-sm text-brand-text-secondary">
                        Automatically syncs transactions, invoices, and expense data.
                    </p>
                    <div className="text-xs text-brand-text-secondary">
                        Last Sync: {new Date(lastSync).toLocaleString()}
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button
                            size="sm"
                            onClick={handleForceSync}
                            disabled={isSyncing}
                            className="flex-1"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                            {isSyncing ? 'Syncing...' : 'Force Sync'}
                        </Button>
                        <Button size="sm" variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Manage
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}