import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Check, Clock, X, PlusCircle, Search, Download } from 'lucide-react';

export default function MediaAccreditationCenter() {
  const [accreditations, setAccreditations] = useState([
    { id: 'MA001', name: 'John Smith', outlet: 'SportsNet', type: 'Broadcast', status: 'Approved', photo_uploaded: true },
    { id: 'MA002', name: 'Jane Doe', outlet: 'TSN', type: 'Broadcast', status: 'Approved', photo_uploaded: true },
    { id: 'MA003', name: 'Peter Jones', outlet: 'The Globe and Mail', type: 'Print', status: 'Pending', photo_uploaded: false },
    { id: 'MA004', name: 'Emily White', outlet: 'CBC Sports', type: 'Digital', status: 'Approved', photo_uploaded: true },
    { id: 'MA005', name: 'Michael Brown', outlet: 'Local Gazette', type: 'Print', status: 'Rejected', photo_uploaded: true },
  ]);

  const stats = {
    approved: accreditations.filter(a => a.status === 'Approved').length,
    pending: accreditations.filter(a => a.status === 'Pending').length,
    rejected: accreditations.filter(a => a.status === 'Rejected').length,
  };

  const StatusBadge = ({ status }) => {
    const config = {
      Approved: { color: 'bg-green-600', icon: <Check className="w-3 h-3" /> },
      Pending: { color: 'bg-yellow-600', icon: <Clock className="w-3 h-3" /> },
      Rejected: { color: 'bg-red-600', icon: <X className="w-3 h-3" /> },
    };
    const { color, icon } = config[status] || { color: 'bg-gray-500' };
    return <Badge className={`${color} text-white flex items-center gap-1`}>{icon}{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-brand-red" />
            Media Accreditation Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-brand-charcoal">
              <CardContent className="p-4">
                <p className="text-sm text-brand-text-secondary">Approved</p>
                <p className="text-3xl font-bold text-green-400">{stats.approved}</p>
              </CardContent>
            </Card>
            <Card className="bg-brand-charcoal">
              <CardContent className="p-4">
                <p className="text-sm text-brand-text-secondary">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
              </CardContent>
            </Card>
            <Card className="bg-brand-charcoal">
              <CardContent className="p-4">
                <p className="text-sm text-brand-text-secondary">Rejected</p>
                <p className="text-3xl font-bold text-red-400">{stats.rejected}</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Accreditation Requests</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export List</Button>
              <Button size="sm"><PlusCircle className="w-4 h-4 mr-2" /> New Request</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
              <Input placeholder="Search by name or outlet..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Outlet</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Photo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accreditations.map(acc => (
                <TableRow key={acc.id}>
                  <TableCell className="font-mono text-xs">{acc.id}</TableCell>
                  <TableCell className="font-medium">{acc.name}</TableCell>
                  <TableCell>{acc.outlet}</TableCell>
                  <TableCell><Badge variant="secondary">{acc.type}</Badge></TableCell>
                  <TableCell>
                    {acc.photo_uploaded ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={acc.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      {acc.status === 'Pending' && <Button size="sm">Review</Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}