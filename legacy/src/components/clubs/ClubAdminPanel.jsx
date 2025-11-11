
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, RefreshCw, Download, Upload, Mail, MessageSquare, 
  CheckSquare, Square, Eye, EyeOff, AlertTriangle, CheckCircle,
  Users, Building, MapPin, Calendar, FileText, ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { provinces } from '../utils/provinces'; // Import provinces

const BulkActionBar = ({ selectedClubs, onBulkAction, onClearSelection, allClubs }) => {
  const [bulkActionType, setBulkActionType] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBulkAction = async () => {
    if (!bulkActionType || selectedClubs.length === 0) return;
    
    setIsProcessing(true);
    try {
      await onBulkAction(bulkActionType, selectedClubs);
      setBulkActionType('');
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // FIX: Memoize safeClubs to prevent re-running useMemo on every render.
  const safeClubs = useMemo(() => (Array.isArray(allClubs) ? allClubs : []), [allClubs]);

  const availableRegions = useMemo(() => {
    if (safeClubs.length === 0) return [];
    return [...new Set(safeClubs.map(c => c.ma_region).filter(Boolean))].sort();
  }, [safeClubs]);

  if (selectedClubs.length === 0) return null;

  return (
    <Card className="bg-brand-red/10 border-brand-red/30 mb-4">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-brand-red text-white">
              {selectedClubs.length} clubs selected
            </Badge>
            <Select value={bulkActionType} onValueChange={setBulkActionType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Choose action..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sync_curlingreg">Sync with CurlingReg</SelectItem>
                <SelectItem value="update_status">Update Status</SelectItem>
                <SelectItem value="send_notification">Send Notification</SelectItem>
                <SelectItem value="export_data">Export Data</SelectItem>
                <SelectItem value="assign_region" disabled={availableRegions.length === 0}>Assign Region</SelectItem>
                <SelectItem value="bulk_edit">Bulk Edit Properties</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleBulkAction} 
              disabled={!bulkActionType || isProcessing}
              className="bg-brand-red hover:bg-red-700"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : null}
              Execute
            </Button>
            <Button variant="outline" onClick={onClearSelection}>
              Clear Selection
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ClubStatusBulkModal = ({ isOpen, onClose, selectedClubs, onConfirm }) => {
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [sendNotification, setSendNotification] = useState(true);

  const statusOptions = [
    { value: 'active', label: 'Active', color: 'text-green-400' },
    { value: 'pilot', label: 'Pilot Program', color: 'text-blue-400' },
    { value: 'inactive', label: 'Inactive', color: 'text-gray-400' },
    { value: 'featured', label: 'Featured', color: 'text-yellow-400' },
    { value: 'at_risk', label: 'At Risk', color: 'text-orange-400' },
    { value: 'suspended', label: 'Suspended', color: 'text-red-400' }
  ];

  const handleConfirm = () => {
    if (!newStatus) return;
    onConfirm({
      status: newStatus,
      adminNotes,
      sendNotification,
      clubs: selectedClubs
    });
    onClose();
  };

  // CRITICAL FIX: ensure selectedClubs is an array before mapping
  const safeSelectedClubs = Array.isArray(selectedClubs) ? selectedClubs : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-brand-card-bg border-brand-border max-w-md">
        <DialogHeader>
          <DialogTitle>Update Club Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-brand-text-secondary mb-2">
              Updating status for {safeSelectedClubs.length} clubs
            </p>
            <div className="max-h-24 overflow-y-auto bg-brand-charcoal/50 p-2 rounded text-xs">
              {safeSelectedClubs.map(club => (
                <div key={club.id} className="text-brand-text-secondary">
                  {club.name}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">New Status</label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className={option.color}>{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Admin Notes</label>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Optional notes about this status change..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Send Notification to Clubs</label>
            <Switch
              checked={sendNotification}
              onCheckedChange={setSendNotification}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleConfirm} disabled={!newStatus} className="flex-1">
              Update {safeSelectedClubs.length} Clubs
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ClubSyncProgress = ({ syncOperations, onClose }) => {
  const completedCount = syncOperations.filter(op => op.status === 'completed').length;
  const errorCount = syncOperations.filter(op => op.status === 'error').length;
  const progressPercent = (completedCount / syncOperations.length) * 100;

  return (
    <Dialog open={syncOperations.length > 0} onOpenChange={onClose}>
      <DialogContent className="bg-brand-card-bg border-brand-border max-w-lg">
        <DialogHeader>
          <DialogTitle>Syncing Clubs with CurlingReg</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{completedCount} of {syncOperations.length}</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2">
            {syncOperations.map((operation, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-brand-charcoal/50 rounded text-sm">
                <span className="truncate flex-1">{operation.clubName}</span>
                <div className="flex items-center gap-2">
                  {operation.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-400" />}
                  {operation.status === 'error' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                  {operation.status === 'processing' && (
                    <div className="w-4 h-4 animate-spin border-2 border-brand-red border-t-transparent rounded-full" />
                  )}
                  <span className="text-xs text-brand-text-secondary capitalize">
                    {operation.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {errorCount > 0 && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
              <p className="text-sm text-red-400">
                {errorCount} clubs failed to sync. Check individual club records for details.
              </p>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={onClose} disabled={progressPercent < 100}>
              {progressPercent < 100 ? 'Syncing...' : 'Close'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


const ClubAdminPanel = ({ clubs, onResyncClub }) => {
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [showBulkStatusModal, setShowBulkStatusModal] = useState(false);
  const [syncOperations, setSyncOperations] = useState([]);

  // FIX: Memoize safeClubs to prevent re-renders in child components.
  const safeClubs = useMemo(() => (Array.isArray(clubs) ? clubs : []), [clubs]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedClubs(safeClubs);
    } else {
      setSelectedClubs([]);
    }
  };

  const handleSelectClub = (club, checked) => {
    if (checked) {
      setSelectedClubs(prev => [...prev, club]);
    } else {
      setSelectedClubs(prev => prev.filter(c => c.id !== club.id));
    }
  };

  const handleBulkAction = async (actionType, clubs) => {
    switch (actionType) {
      case 'sync_curlingreg':
        await handleBulkSync(clubs);
        break;
      case 'update_status':
        setShowBulkStatusModal(true);
        break;
      case 'send_notification':
        await handleBulkNotification(clubs);
        break;
      case 'export_data':
        await handleBulkExport(clubs);
        break;
      default:
        console.log('Action not implemented:', actionType);
    }
  };

  const handleBulkSync = async (clubs) => {
    const operations = clubs.map(club => ({
      clubId: club.id,
      clubName: club.name,
      status: 'processing'
    }));
    setSyncOperations(operations);

    // Simulate sync process
    for (let i = 0; i < operations.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const success = Math.random() > 0.2; // 80% success rate
      operations[i].status = success ? 'completed' : 'error';
      setSyncOperations([...operations]);

      if (success) {
        await onResyncClub(operations[i].clubId);
      }
    }
  };

  const handleBulkNotification = async (clubs) => {
    // Mock notification sending
    console.log('Sending notifications to', clubs.length, 'clubs');
    // In real implementation, would call notification API
  };

  const handleBulkExport = async (clubs) => {
    const csvData = clubs.map(club => ({
      name: club.name,
      city: club.location?.city,
      province: club.location?.province,
      status: club.status,
      members: club.membership_count,
      lastSync: club.system_integrations?.curling_reg_synced
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clubs-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkStatusUpdate = async (updateData) => {
    console.log('Updating status for clubs:', updateData);
    // In real implementation, would update club statuses
    setSelectedClubs([]);
  };

  const isAllSelected = safeClubs.length > 0 && selectedClubs.length === safeClubs.length;
  const isPartiallySelected = selectedClubs.length > 0 && selectedClubs.length < safeClubs.length;

  return (
    <div className="space-y-4">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Club Administration
            </CardTitle>
            <Badge variant="outline" className="text-amber-400 border-amber-400">
              Admin View Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <BulkActionBar
            selectedClubs={selectedClubs}
            onBulkAction={handleBulkAction}
            onClearSelection={() => setSelectedClubs([])}
            allClubs={safeClubs}
          />

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isPartiallySelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Club Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Last Sync</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeClubs.map(club => (
                  <TableRow key={club.id} className={selectedClubs.some(c => c.id === club.id) ? 'bg-brand-red/10' : ''}>
                    <TableCell>
                      <Checkbox
                        checked={selectedClubs.some(c => c.id === club.id)}
                        onCheckedChange={(checked) => handleSelectClub(club, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{club.name}</div>
                      <div className="text-xs text-brand-text-secondary">{club.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3" />
                        {club.location?.city}, {club.location?.province}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`capitalize ${
                          club.status === 'active' ? 'bg-green-600' :
                          club.status === 'pilot' ? 'bg-blue-600' :
                          club.status === 'featured' ? 'bg-yellow-600' :
                          club.status === 'at_risk' ? 'bg-orange-600' :
                          club.status === 'suspended' ? 'bg-red-600' : 'bg-gray-600'
                        } text-white`}
                      >
                        {club.status || 'unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>{club.membership_count || 0}</TableCell>
                    <TableCell className="text-xs text-brand-text-secondary">
                      {club.system_integrations?.curling_reg_synced ? 
                        format(new Date(club.system_integrations.curling_reg_synced), 'MMM d, HH:mm') : 
                        'Never'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => onResyncClub(club.id)}>
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ClubStatusBulkModal
        isOpen={showBulkStatusModal}
        onClose={() => setShowBulkStatusModal(false)}
        selectedClubs={selectedClubs}
        onConfirm={handleBulkStatusUpdate}
      />

      <ClubSyncProgress
        syncOperations={syncOperations}
        onClose={() => setSyncOperations([])}
      />
    </div>
  );
};

export default ClubAdminPanel;
