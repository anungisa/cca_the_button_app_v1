
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Trash2, Loader2, DollarSign, Users, TrendingUp, Handshake } from 'lucide-react';
import { Donation } from '@/api/entities';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { formatEnumString } from '../../utils/formatters';

const MetricCard = ({ title, value, icon: Icon, change, changeType, period }) => (
    <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-text-secondary">{title}</CardTitle>
            <Icon className="h-5 w-5 text-brand-text-secondary" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-brand-text-primary">{value}</div>
            <p className="text-xs text-brand-text-secondary">
                <span className={changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>
                    {change}
                </span>
                {' '}{period}
            </p>
        </CardContent>
    </Card>
);

export default function FTLOCDashboard() {
    const defaultDonation = {
        donor_name: '',
        amount: 0,
        category: 'FINANCIAL_AID',
        recognition_level: 'BRONZE',
        created_date: new Date().toISOString().split('T')[0],
        comments: '',
        payment_status: 'PENDING', // New field
        type: 'ONE_TIME',          // New field
        is_anonymous: false        // New field
    };

    const [donations, setDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentDonation, setCurrentDonation] = useState(defaultDonation);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const allDonations = await Donation.list();
            setDonations(Array.isArray(allDonations) ? allDonations : []);
        } catch(e) {
            console.error(e);
            setDonations([]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddClick = () => {
        setIsEditing(false);
        setCurrentDonation(defaultDonation);
        setIsDialogOpen(true);
    };

    const handleEditClick = (donation) => {
        setIsEditing(true);
        setCurrentDonation({
            ...donation,
            created_date: donation.created_date ? new Date(donation.created_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            payment_status: donation.payment_status || 'PENDING', // Provide default for existing data
            type: donation.type || 'ONE_TIME',                   // Provide default for existing data
            is_anonymous: donation.is_anonymous || false         // Provide default for existing data
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => { // Renamed from handleDeleteClick
        if (window.confirm('Are you sure you want to delete this donation?')) {
            setIsLoading(true);
            try {
                await Donation.delete(id);
                fetchData();
            } catch (e) {
                console.error('Error deleting donation:', e);
                alert('Failed to delete donation.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSaveDonation = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isEditing) {
                await Donation.update(currentDonation.id, currentDonation);
            } else {
                await Donation.create(currentDonation);
            }
            setIsDialogOpen(false);
            fetchData();
        } catch (e) {
            console.error('Error saving donation:', e);
            alert('Failed to save donation.');
        } finally {
            setIsLoading(false);
        }
    };

    const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const numberOfDonors = new Set(donations.map(d => d.donor_name)).size;
    const avgDonation = numberOfDonors > 0 ? (totalDonations / numberOfDonors).toFixed(2) : 0;

    const statusColors = {
        pending: 'bg-yellow-500/10 text-yellow-400',
        completed: 'bg-green-500/10 text-green-400',
        failed: 'bg-red-500/10 text-red-400',
        refunded: 'bg-purple-500/10 text-purple-400',
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Donations"
                    value={`$${totalDonations.toLocaleString()}`}
                    icon={DollarSign}
                    change="+15.3% "
                    changeType="increase"
                    period="this month"
                />
                <MetricCard
                    title="Number of Donors"
                    value={numberOfDonors.toLocaleString()}
                    icon={Users}
                    change="+5% "
                    changeType="increase"
                    period="this month"
                />
                <MetricCard
                    title="Average Donation"
                    value={`$${avgDonation}`}
                    icon={TrendingUp}
                    change="-2.1% "
                    changeType="decrease"
                    period="this month"
                />
                <MetricCard
                    title="New Partnerships"
                    value="7"
                    icon={Handshake}
                    change="+2"
                    changeType="increase"
                    period="this quarter"
                />
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-brand-card-bg border-brand-border">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Edit Donation' : 'Add New Donation'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveDonation} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="donor_name" className="text-right">
                                Donor Name
                            </Label>
                            <Input
                                id="donor_name"
                                value={currentDonation.donor_name}
                                onChange={(e) => setCurrentDonation({ ...currentDonation, donor_name: e.target.value })}
                                className="col-span-3 bg-brand-input-bg text-brand-text-primary border-brand-border"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                value={currentDonation.amount}
                                onChange={(e) => setCurrentDonation({ ...currentDonation, amount: parseFloat(e.target.value) || 0 })}
                                className="col-span-3 bg-brand-input-bg text-brand-text-primary border-brand-border"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Category
                            </Label>
                            <Select
                                onValueChange={(value) => setCurrentDonation({ ...currentDonation, category: value })}
                                value={currentDonation.category}
                            >
                                <SelectTrigger className="col-span-3 bg-brand-input-bg text-brand-text-primary border-brand-border">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className="bg-brand-card-bg text-brand-text-primary border-brand-border">
                                    <SelectItem value="FINANCIAL_AID">Financial Aid</SelectItem>
                                    <SelectItem value="RESEARCH">Research</SelectItem>
                                    <SelectItem value="COMMUNITY_OUTREACH">Community Outreach</SelectItem>
                                    <SelectItem value="GENERAL_SUPPORT">General Support</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="recognition_level" className="text-right">
                                Recognition
                            </Label>
                            <Select
                                onValueChange={(value) => setCurrentDonation({ ...currentDonation, recognition_level: value })}
                                value={currentDonation.recognition_level}
                            >
                                <SelectTrigger className="col-span-3 bg-brand-input-bg text-brand-text-primary border-brand-border">
                                    <SelectValue placeholder="Select recognition level" />
                                </SelectTrigger>
                                <SelectContent className="bg-brand-card-bg text-brand-text-primary border-brand-border">
                                    <SelectItem value="BRONZE">Bronze</SelectItem>
                                    <SelectItem value="SILVER">Silver</SelectItem>
                                    <SelectItem value="GOLD">Gold</SelectItem>
                                    <SelectItem value="PLATINUM">Platinum</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* New field: Payment Status */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="payment_status" className="text-right">
                                Status
                            </Label>
                            <Select
                                onValueChange={(value) => setCurrentDonation({ ...currentDonation, payment_status: value })}
                                value={currentDonation.payment_status}
                            >
                                <SelectTrigger className="col-span-3 bg-brand-input-bg text-brand-text-primary border-brand-border">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-brand-card-bg text-brand-text-primary border-brand-border">
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="FAILED">Failed</SelectItem>
                                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* New field: Type */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Type
                            </Label>
                            <Select
                                onValueChange={(value) => setCurrentDonation({ ...currentDonation, type: value })}
                                value={currentDonation.type}
                            >
                                <SelectTrigger className="col-span-3 bg-brand-input-bg text-brand-text-primary border-brand-border">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-brand-card-bg text-brand-text-primary border-brand-border">
                                    <SelectItem value="ONE_TIME">One-time</SelectItem>
                                    <SelectItem value="RECURRING">Recurring</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="created_date" className="text-right">
                                Date
                            </Label>
                            <Input
                                id="created_date"
                                type="date"
                                value={currentDonation.created_date}
                                onChange={(e) => setCurrentDonation({ ...currentDonation, created_date: e.target.value })}
                                className="col-span-3 bg-brand-input-bg text-brand-text-primary border-brand-border"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="comments" className="text-right">
                                Comments
                            </Label>
                            <Input
                                id="comments"
                                value={currentDonation.comments}
                                onChange={(e) => setCurrentDonation({ ...currentDonation, comments: e.target.value })}
                                className="col-span-3 bg-brand-input-bg text-brand-text-primary border-brand-border"
                            />
                        </div>
                        {/* New field: Is Anonymous */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="is_anonymous" className="text-right">
                                Anonymous
                            </Label>
                            <div className="col-span-3 flex items-center">
                                <Checkbox
                                    id="is_anonymous"
                                    checked={currentDonation.is_anonymous}
                                    onCheckedChange={(checked) => setCurrentDonation({ ...currentDonation, is_anonymous: checked })}
                                    className="h-4 w-4 text-brand-primary border-brand-border data-[state=checked]:bg-brand-primary data-[state=checked]:text-white"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="bg-brand-primary hover:bg-brand-primary-hover text-white">
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Donations</CardTitle>
                    <Button onClick={handleAddClick} className="bg-brand-primary hover:bg-brand-primary-hover text-white">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Donation
                    </Button>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Donor</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead> {/* New column */}
                                    <TableHead>Category</TableHead>
                                    <TableHead>Type</TableHead>   {/* New column */}
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(donations || []).map((donation) => (
                                    <TableRow key={donation.id}>
                                        <TableCell className="font-medium">
                                            {donation.is_anonymous ? 'Anonymous' : donation.donor_name || 'Anonymous'}
                                        </TableCell>
                                        <TableCell>${(donation.amount || 0).toFixed(2)}</TableCell>
                                        {/* New column: Status */}
                                        <TableCell>
                                            <Badge className={statusColors[donation.payment_status?.toLowerCase()] || 'bg-gray-500/10'}>
                                                {formatEnumString(donation.payment_status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{formatEnumString(donation.category)}</TableCell>
                                        {/* New column: Type */}
                                        <TableCell>{formatEnumString(donation.type)}</TableCell>
                                        <TableCell>{new Date(donation.created_date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEditClick(donation)}
                                                    className="text-brand-primary hover:bg-brand-hover-bg"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(donation.id)}
                                                    className="text-red-500 hover:bg-brand-hover-bg"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
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
}
