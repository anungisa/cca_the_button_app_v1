import React, { useState, useEffect } from 'react';
import { AuditLog } from '@/api/entities';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { timeSince } from '../utils/timeSince';

const AuditLogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const auditLogs = await AuditLog.list('-created_date', 50); // Get last 50 log entries
        setLogs(auditLogs);
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (isLoading) {
    return <div className="h-64 bg-brand-charcoal rounded-lg animate-pulse" />;
  }
  
  if (logs.length === 0) {
      return <p className="text-brand-text-secondary text-center">No audit logs found.</p>
  }

  return (
    <div className="max-h-[500px] overflow-y-auto">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {logs.map(log => (
                    <TableRow key={log.id}>
                        <TableCell className="text-xs text-brand-text-secondary">{timeSince(new Date(log.created_date))}</TableCell>
                        <TableCell>{log.user_email}</TableCell>
                        <TableCell>
                            <Badge variant="secondary">{log.action}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {log.entity_type && <p><strong>Entity:</strong> {log.entity_type} ({log.entity_id})</p>}
                          {log.changes && <p><strong>Change:</strong> {log.changes.field} from '{log.changes.old_value}' to '{log.changes.new_value}'</p>}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
};

export default AuditLogViewer;