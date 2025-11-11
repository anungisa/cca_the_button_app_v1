
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, Filter, ArrowUpDown } from 'lucide-react';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';
import { format } from 'date-fns';

// Generate sample transaction data
const generateSampleTransactions = () => {
  const transactions = [];
  const categories = ['membership_fees', 'sponsorship', 'event_revenue', 'grants', 'operational_expense', 'staff_costs', 'marketing'];
  const types = ['revenue', 'expense'];
  
  canadianProvincesAndTerritories.forEach(province => {
    for (let i = 0; i < 50; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const amount = Math.floor(Math.random() * 50000) + 1000;
      
      transactions.push({
        id: `txn-${province.abbreviation}-${i}`,
        ma_region: province.abbreviation,
        transaction_type: type,
        category: category,
        amount: type === 'expense' ? -amount : amount,
        description: `${category.replace('_', ' ')} - ${province.name}`,
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: Math.random() > 0.1 ? 'completed' : 'pending',
        reference_id: `REF-${Math.floor(Math.random() * 10000)}`
      });
    }
  });
  
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export default function TransactionHistory({ selectedRegion }) {
  const [allTransactions] = useState(generateSampleTransactions());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredTransactions = useMemo(() => {
    let filtered = allTransactions;

    // Filter by region
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(txn => txn.ma_region === selectedRegion);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(txn => 
        txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.reference_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(txn => txn.category === categoryFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(txn => txn.transaction_type === typeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'amount') {
        aVal = Math.abs(aVal);
        bVal = Math.abs(bVal);
      }
      
      if (sortBy === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [allTransactions, selectedRegion, searchTerm, categoryFilter, typeFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStatusBadge = (status) => {
    return (
      <Badge className={status === 'completed' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}>
        {status}
      </Badge>
    );
  };

  const totalRevenue = filteredTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(filteredTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
  const netAmount = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-brand-text-secondary">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-brand-text-secondary">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-brand-text-secondary">Net Amount</p>
            <p className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>
              Transaction History
              {selectedRegion !== 'all' && ` - ${getProvinceNameByAbbreviation(selectedRegion)}`}
              <Badge variant="outline" className="ml-2">
                {filteredTransactions.length} transactions
              </Badge>
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="membership_fees">Membership Fees</SelectItem>
                <SelectItem value="sponsorship">Sponsorship</SelectItem>
                <SelectItem value="event_revenue">Event Revenue</SelectItem>
                <SelectItem value="grants">Grants</SelectItem>
                <SelectItem value="operational_expense">Operational</SelectItem>
                <SelectItem value="staff_costs">Staff Costs</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-brand-border/30"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Date <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Region</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-brand-border/30 text-right"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Amount <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.slice(0, 50).map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(new Date(transaction.date), 'PP')}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {transaction.category.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.ma_region}</TableCell>
                  <TableCell className={`text-right font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(transaction.amount).toLocaleString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell className="font-mono text-xs">{transaction.reference_id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredTransactions.length > 50 && (
            <div className="mt-4 text-center">
              <Button variant="outline">
                Load More ({filteredTransactions.length - 50} remaining)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
