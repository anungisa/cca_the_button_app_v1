import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataPrivacyAudit } from '@/api/entities';
import { Shield, Plus, Eye, Edit, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function DataPrivacyMonitor() {
  const [audits, setAudits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const sampleAudits = [
    { id: 'dpa_001', dataset_name: 'Member Database', data_classification: 'restricted', risk_rating: 'high', consent_status: 'obtained', last_audit_date: '2024-01-10' },
    { id: 'dpa_002', dataset_name: 'Fan Engagement Data', data_classification: 'confidential', risk_rating: 'medium', consent_status: 'obtained', last_audit_date: '2024-02-05' },
    { id: 'dpa_003', dataset_name: 'Anonymous Survey Results', data_classification: 'internal', risk_rating: 'low', consent_status: 'not_required', last_audit_date: '2023-12-15' },
    { id: 'dpa_004', dataset_name: 'Youth Participant PII', data_classification: 'restricted', risk_rating: 'critical', consent_status: 'pending', last_audit_date: '2024-03-01' },
  ];

  useEffect(() => {
    loadAudits();
  }, []);

  const loadAudits = async () => {
    setIsLoading(true);
    try {
      const data = await DataPrivacyAudit.list();
      setAudits(data.length > 0 ? data : sampleAudits);
    } catch (error) {
      console.error('Failed to load privacy audits:', error);
      setAudits(sampleAudits);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadge = (level) => {
    const config = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      critical: 'bg-red-600',
    };
    return <Badge className={`${config[level]} text-white capitalize`}>{level}</Badge>;
  };
  
  const getConsentIcon = (status) => {
    const config = {
      obtained: <CheckCircle className="w-4 h-4 text-green-500" />,
      pending: <Clock className="w-4 h-4 text-yellow-500" />,
      expired: <AlertTriangle className="w-4 h-4 text-red-500" />,
      not_required: <Shield className="w-4 h-4 text-gray-500" />,
    };
    return config[status] || <Shield className="w-4 h-4" />;
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-brand-red"/>Data Privacy & Ethics Monitor</CardTitle>
        <Button><Plus className="w-4 h-4 mr-2"/>New Audit</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dataset</TableHead>
              <TableHead>Classification</TableHead>
              <TableHead>Risk Rating</TableHead>
              <TableHead>Consent Status</TableHead>
              <TableHead>Last Audited</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? ([...Array(4)].map((_, i) => (
              <TableRow key={i}><TableCell colSpan="6"><div className="h-8 bg-brand-charcoal/50 rounded animate-pulse" /></TableCell></TableRow>
            ))) : audits.map(audit => (
              <TableRow key={audit.id}>
                <TableCell className="font-medium text-brand-text-primary">{audit.dataset_name}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{(audit.data_classification || '').replace(/_/g, ' ')}</Badge></TableCell>
                <TableCell>{getRiskBadge(audit.risk_rating)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center gap-2 capitalize">
                    {getConsentIcon(audit.consent_status)}
                    {(audit.consent_status || '').replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{audit.last_audit_date ? format(new Date(audit.last_audit_date), 'MMM d, yyyy') : 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm"><Eye className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm"><Edit className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}