import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Clock, Shield, TriangleAlert, Building, User } from 'lucide-react';
import { format, formatDistanceToNow, differenceInHours } from 'date-fns';

const priorityConfig = {
  critical: { icon: TriangleAlert, color: 'text-red-400', label: 'Critical' },
  high: { icon: TriangleAlert, color: 'text-orange-400', label: 'High' },
  medium: { icon: TriangleAlert, color: 'text-yellow-400', label: 'Medium' },
  low: { icon: TriangleAlert, color: 'text-blue-400', label: 'Low' }
};

const statusConfig = {
  new: { color: 'bg-blue-500/20 text-blue-300', label: 'New' },
  open: { color: 'bg-cyan-500/20 text-cyan-300', label: 'Open' },
  in_progress: { color: 'bg-yellow-500/20 text-yellow-300', label: 'In Progress' },
  on_hold: { color: 'bg-gray-500/20 text-gray-400', label: 'On Hold' },
  escalated: { color: 'bg-orange-500/20 text-orange-400', label: 'Escalated' },
  resolved: { color: 'bg-green-500/20 text-green-300', label: 'Resolved' },
  closed: { color: 'bg-purple-500/20 text-purple-300', label: 'Closed' }
};

const slaConfig = {
  critical: 24,
  high: 72,
};

const SLATimer = ({ incident }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isBreached, setIsBreached] = useState(false);

  useEffect(() => {
    if (!incident || !slaConfig[incident.priority] || ['resolved', 'closed'].includes(incident.status)) {
      setTimeLeft('-');
      setIsBreached(false);
      return;
    }

    const slaHours = slaConfig[incident.priority];
    const createdDate = new Date(incident.created_date);
    const dueDate = new Date(createdDate.getTime() + slaHours * 60 * 60 * 1000);
    
    const updateTimer = () => {
      const hoursRemaining = differenceInHours(dueDate, new Date());
      if (hoursRemaining < 0) {
        setIsBreached(true);
        setTimeLeft('Breached');
      } else if (hoursRemaining < 24) {
        setTimeLeft(`${hoursRemaining}h`);
      } else {
        setTimeLeft(`${Math.floor(hoursRemaining / 24)}d ${hoursRemaining % 24}h`);
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 60000); // update every minute
    return () => clearInterval(interval);

  }, [incident]);

  if (timeLeft === '-') return <span className="text-brand-text-secondary">-</span>;

  return (
    <div className={`flex items-center gap-1 text-sm ${isBreached ? 'text-red-400 font-semibold' : 'text-brand-text-secondary'}`}>
      <Clock className="w-3.5 h-3.5" />
      <span>{timeLeft}</span>
    </div>
  );
};


export default function IncidentList({ incidents, onSelectIncident }) {
  if (!incidents || incidents.length === 0) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-brand-text-primary">No Incidents Found</h3>
          <p className="text-brand-text-secondary mt-2">Try adjusting your filters or check back later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <Table>
        <TableHeader>
          <TableRow className="border-b-brand-border">
            <TableHead>Priority</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Department</TableHead>
            <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead>SLA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => {
            if (!incident) return null;
            const priorityConfigItem = priorityConfig[incident.priority] || { icon: TriangleAlert, color: 'text-gray-400', label: 'Unknown' };
            const PriorityIcon = priorityConfigItem.icon;
            const priorityColor = priorityConfigItem.color;
            const statusStyle = statusConfig[incident.status] || statusConfig.open;

            return (
              <TableRow 
                key={incident.id} 
                onClick={() => onSelectIncident(incident)} 
                className="cursor-pointer hover:bg-brand-charcoal/50 border-b-brand-border"
              >
                <TableCell>
                  <div className="flex items-center gap-2" title={priorityConfigItem.label}>
                    <PriorityIcon className={`w-5 h-5 ${priorityColor}`} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-brand-text-primary">{incident.title}</div>
                  <div className="text-xs text-brand-text-secondary flex items-center gap-1">
                    #{incident.id?.substring(0, 6)}
                    {incident.is_confidential && <Shield className="w-3 h-3 text-red-400" title="Confidential"/>}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge className={`${statusStyle.color} border-0`}>{statusStyle.label}</Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                   <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                      <Building className="w-4 h-4" />
                      <span>{incident.assigned_department?.replace(/_/g, ' ') || 'N/A'}</span>
                   </div>
                </TableCell>
                 <TableCell className="hidden lg:table-cell">
                   <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                      <User className="w-4 h-4" />
                      <span>{incident.assigned_to_name || 'Unassigned'}</span>
                   </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-brand-text-secondary" title={format(new Date(incident.created_date), 'PPP p')}>
                  {formatDistanceToNow(new Date(incident.created_date), { addSuffix: true })}
                </TableCell>
                 <TableCell>
                   <SLATimer incident={incident} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}