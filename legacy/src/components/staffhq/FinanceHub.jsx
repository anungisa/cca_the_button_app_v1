import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Purchase } from '@/api/entities';
import { GrantApplication } from '@/api/entities';
import { SponsorContract } from '@/api/entities';
import { DollarSign, FileText, TrendingUp, AlertCircle, Plus, Download, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import WorkflowEngine from '../utils/WorkflowEngine';
import NotificationService from '../utils/NotificationService';

const RevenueTrackingPanel = () => {
  const [purchases, setPurchases] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRevenueData();
  }, []);

  const loadRevenueData = async () => {
    try {
      const [purchaseData, contractData] = await Promise.all([
        Purchase.filter({ status: 'completed' }, '-created_date', 20),
        SponsorContract.filter({ status: 'active' }, '-start_date', 10)
      ]);
      setPurchases(purchaseData);
      setContracts(contractData);
    } catch (error) {
      console.error('Failed to load revenue data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount / 100), 0) +
                     contracts.reduce((sum, c) => sum + c.contract_value, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Total Revenue YTD</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Active Contracts</p>
                <p className="text-2xl font-bold text-brand-text-primary">{contracts.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Monthly Recurring</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  ${(purchases.filter(p => p.purchase_type === 'subscription').length * 15).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? <p>Loading transactions...</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map(purchase => (
                  <TableRow key={purchase.id}>
                    <TableCell>{format(new Date(purchase.created_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{purchase.purchase_type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{purchase.product_name}</TableCell>
                    <TableCell>${(purchase.amount / 100).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={purchase.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'}>
                        {purchase.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const GrantManagementPanel = () => {
  const [grants, setGrants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadGrants();
  }, []);

  const loadGrants = async () => {
    try {
      const data = await GrantApplication.list('-created_date');
      setGrants(data);
    } catch (error) {
      console.error('Failed to load grants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const CreateGrantModal = () => {
    const [formData, setFormData] = useState({
      grant_name: '',
      grantor: '',
      status: 'draft',
      total_amount: '',
      focus_area: 'general_ftloc',
      contact_name: '',
      contact_email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await GrantApplication.create({
          ...formData,
          total_amount: parseFloat(formData.total_amount)
        });
        
        await WorkflowEngine.triggerWorkflow('grant_application_created', {
          grant_name: formData.grant_name,
          grantor: formData.grantor,
          total_amount: formData.total_amount
        });

        setShowCreateModal(false);
        loadGrants();
      } catch (error) {
        console.error('Failed to create grant application:', error);
        alert('Failed to create grant application. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Grant Application</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              placeholder="Grant Name" 
              value={formData.grant_name}
              onChange={e => setFormData({...formData, grant_name: e.target.value})}
              required 
            />
            <Input 
              placeholder="Grantor Organization" 
              value={formData.grantor}
              onChange={e => setFormData({...formData, grantor: e.target.value})}
              required 
            />
            <Input 
              placeholder="Total Amount" 
              type="number"
              value={formData.total_amount}
              onChange={e => setFormData({...formData, total_amount: e.target.value})}
              required 
            />
            <Select onValueChange={value => setFormData({...formData, focus_area: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Focus Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youth">Youth Development</SelectItem>
                <SelectItem value="gender_equity">Gender Equity</SelectItem>
                <SelectItem value="general_ftloc">General FTLOC</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              placeholder="Contact Name" 
              value={formData.contact_name}
              onChange={e => setFormData({...formData, contact_name: e.target.value})}
            />
            <Input 
              placeholder="Contact Email" 
              type="email"
              value={formData.contact_email}
              onChange={e => setFormData({...formData, contact_email: e.target.value})}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Grant Application'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-brand-text-primary">Grant Applications</h3>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Grant Application
        </Button>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-6">
          {isLoading ? <p>Loading grants...</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Grant Name</TableHead>
                  <TableHead>Grantor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Focus Area</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grants.map(grant => (
                  <TableRow key={grant.id}>
                    <TableCell className="font-medium">{grant.grant_name}</TableCell>
                    <TableCell>{grant.grantor}</TableCell>
                    <TableCell>${grant.total_amount?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={
                        grant.status === 'awarded' ? 'bg-green-600' :
                        grant.status === 'submitted' ? 'bg-blue-600' :
                        'bg-gray-600'
                      }>
                        {grant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{grant.focus_area?.replace('_', ' ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateGrantModal />
    </div>
  );
};

export default function FinanceHub() {
  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
          <DollarSign className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Finance Hub</h1>
          <p className="text-brand-text-secondary">Revenue tracking, grant management, and financial analytics</p>
        </div>
        <div className="ml-auto">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Financial Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-brand-card-bg border-brand-border">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="grants">Grants</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="mt-6">
          <RevenueTrackingPanel />
        </TabsContent>
        <TabsContent value="grants" className="mt-6">
          <GrantManagementPanel />
        </TabsContent>
        <TabsContent value="budgets" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-brand-text-secondary opacity-50" />
              <h3 className="text-xl font-semibold text-brand-text-primary mb-2">Budget Management</h3>
              <p className="text-brand-text-secondary">Advanced budget tracking and forecasting tools coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-12 text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-brand-text-secondary opacity-50" />
              <h3 className="text-xl font-semibold text-brand-text-primary mb-2">Financial Analytics</h3>
              <p className="text-brand-text-secondary">Detailed financial analytics and forecasting dashboard coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}