import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Activity, User, Settings, Shield } from 'lucide-react';
import { AuditLog } from '@/api/entities';
import { timeSince } from '../utils/timeSince';

const ChangeLog = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const auditLogs = await AuditLog.list('-created_date', 100);
      setLogs(auditLogs);
    } catch (error) {
      console.error("Failed to load audit logs:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getFeatureIcon = (feature) => {
    switch(feature) {
      case 'USER_ROLE_CHANGED': return <User className="w-4 h-4" />;
      case 'PLATFORM_SETTING_UPDATED': return <Settings className="w-4 h-4" />;
      case 'POLICY_APPROVED': return <Shield className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" /> Platform Change Log
        </CardTitle>
        <p className="text-brand-text-secondary">A log of critical administrative changes made to the platform.</p>
      </CardHeader>
      <CardContent>
        <div className="border border-brand-border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Feature</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Performed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center">Loading change log...</TableCell></TableRow>
              ) : logs.length > 0 ? (
                logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell>{timeSince(log.created_date)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center gap-2">
                        {getFeatureIcon(log.feature)}
                        <span>{log.feature.replace(/_/g, ' ').toLowerCase()}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{log.context?.description || 'N/A'}</TableCell>
                    <TableCell>{log.context?.user_email || 'System'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={4} className="text-center">No changes logged yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChangeLog;