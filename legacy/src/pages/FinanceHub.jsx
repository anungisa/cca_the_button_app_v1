
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, BarChart3, FileText, CreditCard, TrendingUp, Building, Globe } from 'lucide-react';
import FinancialDashboard from '@/components/finance/FinancialDashboard';
import BudgetManagement from '@/components/finance/BudgetManagement';
import TransactionHistory from '@/components/finance/TransactionHistory';
import FinancialReports from '@/components/finance/FinancialReports';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { canadianProvincesAndTerritories } from '@/components/utils/provinces';

export default function FinanceHub() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3, component: <FinancialDashboard /> },
    { id: 'budget', label: 'Budget Management', icon: TrendingUp, component: <BudgetManagement selectedRegion={selectedRegion} /> },
    { id: 'transactions', label: 'Transactions', icon: CreditCard, component: <TransactionHistory selectedRegion={selectedRegion} /> },
    { id: 'reports', label: 'Financial Reports', icon: FileText, component: <FinancialReports /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-brand-red" />
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">Finance Hub</h2>
            <p className="text-brand-text-secondary">Manage budgets, transactions, and financial reporting.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <SelectValue placeholder="Select Region" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {canadianProvincesAndTerritories.map((province) => (
                <SelectItem key={province.abbreviation} value={province.abbreviation}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild className="w-full sm:w-auto">
            <Link to={createPageUrl('Donations')}>
              <Building className="w-4 h-4 mr-2" />
              View Donations
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
