import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { canadianProvincesAndTerritories } from '../utils/provinces';

const generateSampleLogs = () => {
    let logs = [];
    const positions = ["lead", "second", "third", "skip"];
    const executions = ["Make", "Partial", "Limited", "Xmiss"];
    
    canadianProvincesAndTerritories.forEach(p => {
        for(let i=0; i < 2; i++) {
            logs.push({
                id: `log-${p.abbreviation}-${i}`,
                athlete_id: `ath-${p.abbreviation}-${i}`,
                athlete_name: `Athlete ${i+1} ${p.abbreviation}`,
                ma_region: p.abbreviation,
                event_name: `Regional Qualifier`,
                shot_number: '3A',
                position: positions[i % positions.length],
                execution: executions[i % executions.length],
                validation_status: 'pending'
            });
        }
    });
    return logs;
};

export default function GameLogAuditor({ selectedRegion }) {
    const [logs, setLogs] = useState(useMemo(generateSampleLogs, []));

    const handleUpdateStatus = (logId, status) => {
        setLogs(prev => prev.map(log => log.id === logId ? { ...log, validation_status: status } : log));
    };

    const filteredLogs = useMemo(() => {
        return logs.filter(log =>
            (selectedRegion === 'all' || log.ma_region === selectedRegion) &&
            log.validation_status === 'pending'
        );
    }, [selectedRegion, logs]);

    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
                <CardTitle>Game Log Validation Queue</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {filteredLogs.length > 0 ? filteredLogs.map(log => (
                        <div key={log.id} className="p-4 bg-brand-charcoal rounded-lg flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="mb-3 md:mb-0">
                                <h4 className="font-semibold text-brand-text-primary">{log.athlete_name} - {log.event_name}</h4>
                                <p className="text-sm text-brand-text-secondary">
                                    Shot: {log.shot_number} | Position: {log.position} | Execution: {log.execution}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus(log.id, 'validated')}>
                                    <Check className="w-4 h-4 mr-1" /> Validate
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(log.id, 'conflict')}>
                                    <X className="w-4 h-4 mr-1" /> Flag Conflict
                                </Button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-8 text-brand-text-secondary">Validation queue is empty.</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}