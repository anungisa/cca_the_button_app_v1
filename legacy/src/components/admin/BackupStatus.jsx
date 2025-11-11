import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, HardDrive, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const BackupStatus = () => {
  // This is mock data. In a real app, this would come from a backend monitoring service.
  const backupInfo = {
    lastBackupDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'success',
    nextBackupDate: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
    lastVerificationDate: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    verificationStatus: 'success',
    storageLocation: 'Canada Central (Azure)',
  };

  const getStatusChip = (status) => {
    const isSuccess = status === 'success';
    return (
      <Badge className={isSuccess ? 'bg-green-600' : 'bg-red-600'}>
        {isSuccess ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
        {isSuccess ? 'Success' : 'Failed'}
      </Badge>
    );
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" /> Backup & Recovery Status
        </CardTitle>
        <p className="text-brand-text-secondary">Monitor the status of automated system data backups.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-brand-charcoal">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center justify-between">
                Last Backup
                {getStatusChip(backupInfo.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-brand-text-primary">
                {new Date(backupInfo.lastBackupDate).toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-brand-charcoal">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center justify-between">
                Last Verification
                {getStatusChip(backupInfo.verificationStatus)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-brand-text-primary">
                {new Date(backupInfo.lastVerificationDate).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-text-secondary">
              <Clock className="w-4 h-4" />
              <span>Next Scheduled Backup</span>
            </div>
            <span className="font-medium text-brand-text-primary">
              {new Date(backupInfo.nextBackupDate).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-text-secondary">
              <HardDrive className="w-4 h-4" />
              <span>Storage Location</span>
            </div>
            <span className="font-medium text-brand-text-primary">{backupInfo.storageLocation}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline">View Verification Logs</Button>
          <Button>Initiate Manual Backup</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackupStatus;