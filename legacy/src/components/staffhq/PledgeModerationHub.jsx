import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pledge } from '@/api/entities';
import { CheckCircle, XCircle, Eye, Download, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const PledgeDetailModal = ({ pledge, onApprove, onReject }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const displayName = pledge.pledge_by === 'Organization' ? pledge.organization_name : pledge.name;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-brand-card-bg border-brand-border max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pledge Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={pledge.logo_url} alt={displayName} />
              <AvatarFallback>{displayName?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-bold">{displayName}</h3>
              <p className="text-brand-text-secondary">{pledge.province}</p>
              <Badge>{pledge.pledge_by}</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-brand-text-secondary">Pledge Type</label>
              <p className="text-brand-text-primary">{pledge.pledge_type}</p>
            </div>
            {pledge.website_url && (
              <div>
                <label className="text-sm font-medium text-brand-text-secondary">Website</label>
                <a href={pledge.website_url} target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">
                  {pledge.website_url}
                </a>
              </div>
            )}
          </div>
          
          {pledge.pledge_statement && (
            <div>
              <label className="text-sm font-medium text-brand-text-secondary">Pledge Statement</label>
              <p className="text-brand-text-primary bg-brand-charcoal p-3 rounded">"{pledge.pledge_statement}"</p>
            </div>
          )}
          
          {pledge.reason && (
            <div>
              <label className="text-sm font-medium text-brand-text-secondary">Reason</label>
              <p className="text-brand-text-primary">{pledge.reason}</p>
            </div>
          )}
          
          {pledge.media_attachments?.length > 0 && (
            <div>
              <label className="text-sm font-medium text-brand-text-secondary">Media Attachments</label>
              <div className="flex gap-2 mt-2">
                {pledge.media_attachments.map((media, index) => (
                  <div key={index} className="border border-brand-border rounded p-2">
                    <p className="text-xs">{media.type}: {media.url}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => { onApprove(pledge.id); setIsOpen(false); }}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button 
              onClick={() => { onReject(pledge.id); setIsOpen(false); }}
              variant="destructive"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PledgesTable = ({ pledges, onApprove, onReject, showActions = true }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Pledger</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Province</TableHead>
        <TableHead>Pledge</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Status</TableHead>
        {showActions && <TableHead>Actions</TableHead>}
      </TableRow>
    </TableHeader>
    <TableBody>
      {pledges.map(pledge => {
        const displayName = pledge.pledge_by === 'Organization' ? pledge.organization_name : pledge.name;
        return (
          <TableRow key={pledge.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={pledge.logo_url} alt={displayName} />
                  <AvatarFallback>{displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{displayName}</p>
                  <Badge variant="outline" className="text-xs">{pledge.pledge_by}</Badge>
                </div>
              </div>
            </TableCell>
            <TableCell>{pledge.pledge_type}</TableCell>
            <TableCell>{pledge.province}</TableCell>
            <TableCell className="max-w-xs truncate">{pledge.pledge_statement || 'No custom message'}</TableCell>
            <TableCell>{new Date(pledge.created_date).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={
                pledge.status === 'approved' ? 'default' :
                pledge.status === 'rejected' ? 'destructive' : 'secondary'
              }>
                {pledge.status}
              </Badge>
            </TableCell>
            {showActions && (
              <TableCell>
                <div className="flex gap-2">
                  <PledgeDetailModal pledge={pledge} onApprove={onApprove} onReject={onReject} />
                  {pledge.status === 'pending_review' && (
                    <>
                      <Button 
                        onClick={() => onApprove(pledge.id)}
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                      <Button 
                        onClick={() => onReject(pledge.id)}
                        size="sm" 
                        variant="destructive"
                      >
                        <XCircle className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            )}
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
);

export default function PledgeModerationHub() {
  const [pledges, setPledges] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, byType: {} });
  const [isLoading, setIsLoading] = useState(true);

  const fetchPledges = async () => {
    setIsLoading(true);
    try {
      const pledgesData = await Pledge.list('-created_date');
      setPledges(pledgesData || []);
      
      const pending = pledgesData?.filter(p => p.status === 'pending_review')?.length || 0;
      const approved = pledgesData?.filter(p => p.status === 'approved')?.length || 0;
      const individuals = pledgesData?.filter(p => p.pledge_by === 'Individual')?.length || 0;
      const organizations = pledgesData?.filter(p => p.pledge_by === 'Organization')?.length || 0;
      
      setStats({
        total: pledgesData?.length || 0,
        pending,
        approved,
        byType: { individuals, organizations }
      });
    } catch (error) {
      console.error('Failed to fetch pledges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (pledgeId) => {
    try {
      await Pledge.update(pledgeId, { status: 'approved' });
      fetchPledges();
    } catch (error) {
      console.error('Failed to approve pledge:', error);
    }
  };

  const handleReject = async (pledgeId) => {
    try {
      await Pledge.update(pledgeId, { status: 'rejected' });
      fetchPledges();
    } catch (error) {
      console.error('Failed to reject pledge:', error);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Type', 'Province', 'Pledge Type', 'Statement', 'Reason', 'Website', 'Status', 'Date'].join(','),
      ...pledges.map(p => [
        p.pledge_by === 'Organization' ? p.organization_name : p.name,
        p.pledge_by,
        p.province,
        p.pledge_type,
        `"${p.pledge_statement || ''}"`,
        `"${p.reason || ''}"`,
        p.website_url || '',
        p.status,
        new Date(p.created_date).toLocaleDateString()
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pledges-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  useEffect(() => {
    fetchPledges();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const pendingPledges = pledges.filter(p => p.status === 'pending_review');
  const approvedPledges = pledges.filter(p => p.status === 'approved');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Pledge Moderation</h1>
          <p className="text-brand-text-secondary">Review and manage community pledges</p>
        </div>
        <Button onClick={exportToCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Total Pledges</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Pending Review</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.pending}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Approved</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Individuals</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.byType.individuals}</p>
                <p className="text-xs text-brand-text-secondary">{stats.byType.organizations} Organizations</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Review ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({stats.approved})
          </TabsTrigger>
          <TabsTrigger value="all">All Pledges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Pledges Awaiting Review</CardTitle>
            </CardHeader>
            <CardContent>
              <PledgesTable pledges={pendingPledges} onApprove={handleApprove} onReject={handleReject} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="approved" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Approved Pledges</CardTitle>
            </CardHeader>
            <CardContent>
              <PledgesTable pledges={approvedPledges} onApprove={handleApprove} onReject={handleReject} showActions={false} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>All Pledges</CardTitle>
            </CardHeader>
            <CardContent>
              <PledgesTable pledges={pledges} onApprove={handleApprove} onReject={handleReject} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}