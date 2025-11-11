import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ShoppingCart, Receipt, RefreshCw, AlertCircle, FileText, Download
} from 'lucide-react';
import { useXP } from '../components/XPContext';
import { Purchase } from '@/api/entities';

const formatCurrency = (amountInCents) => {
  if (typeof amountInCents !== 'number') return '$0.00';
  return `$${(amountInCents / 100).toFixed(2)}`;
};

const getStatusVariant = (status) => {
  switch (status) {
    case 'completed':
    case 'shipped':
    case 'delivered':
      return 'success';
    case 'pending':
    case 'processing':
      return 'default';
    case 'failed':
    case 'cancelled':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export default function PurchaseHistory() {
  const { user } = useXP();
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadPurchaseHistory();
    }
  }, [user]);

  const loadPurchaseHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userPurchases = await Purchase.filter({ user_id: user.id }, '-created_date');
      setPurchases(userPurchases);
    } catch (e) {
      console.error("Error loading purchase history:", e);
      setError("Could not load your purchase history. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <Card className="max-w-md bg-brand-card-bg border-brand-border">
          <CardContent className="p-8 text-center">
            <ShoppingCart className="w-12 h-12 text-brand-red mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brand-text-primary mb-2">Access Denied</h2>
            <p className="text-brand-text-secondary">Please sign in to view your purchase history.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-red mx-auto mb-4" />
          <p className="text-brand-text-secondary">Loading your history...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500">{error}</p>
          <Button variant="outline" size="sm" onClick={loadPurchaseHistory} className="mt-4">
            Try again
          </Button>
        </div>
      );
    }

    if (purchases.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-brand-text-primary mb-2">No Purchases Found</h3>
          <p className="text-brand-text-secondary">Your purchase history is empty.</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map(purchase => (
            <TableRow key={purchase.id}>
              <TableCell>{new Date(purchase.created_date).toLocaleDateString()}</TableCell>
              <TableCell className="font-medium">{purchase.product_name}</TableCell>
              <TableCell className="capitalize">{purchase.product_category?.replace(/_/g, ' ') || 'General'}</TableCell>
              <TableCell>{formatCurrency(purchase.amount)}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(purchase.status)}>
                  {purchase.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" disabled={!purchase.receipt_url}>
                  <Download className="w-3 h-3 mr-1" />
                  Receipt
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">Purchase History</h1>
            <p className="text-brand-text-secondary">Review your recent transactions and subscriptions.</p>
          </div>
          <Button variant="outline" onClick={loadPurchaseHistory} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>My Transactions</CardTitle>
            <CardDescription>A complete log of all your purchases and redemptions.</CardDescription>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}