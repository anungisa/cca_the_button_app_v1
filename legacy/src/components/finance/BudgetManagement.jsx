
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';

// Generate regional budget data
const generateRegionalBudgets = () => {
  const budgets = {};
  
  canadianProvincesAndTerritories.forEach(province => {
    budgets[province.abbreviation] = {
      region_name: province.name,
      categories: [
        { 
          category: 'Program Development', 
          budgeted: Math.floor(Math.random() * 100000) + 50000, 
          spent: Math.floor(Math.random() * 60000) + 20000 
        },
        { 
          category: 'Event Operations', 
          budgeted: Math.floor(Math.random() * 80000) + 40000, 
          spent: Math.floor(Math.random() * 50000) + 15000 
        },
        { 
          category: 'Marketing & Communications', 
          budgeted: Math.floor(Math.random() * 40000) + 20000, 
          spent: Math.floor(Math.random() * 25000) + 10000 
        },
        { 
          category: 'Administrative', 
          budgeted: Math.floor(Math.random() * 30000) + 15000, 
          spent: Math.floor(Math.random() * 20000) + 8000 
        }
      ]
    };
  });
  
  return budgets;
};

export default function BudgetManagement({ selectedRegion }) {
  const [budgetData] = useState(generateRegionalBudgets());
  const [viewMode, setViewMode] = useState('summary');

  const processedBudgetData = useMemo(() => {
    if (selectedRegion === 'all') {
      // Aggregate all regional budgets
      const allCategories = {};
      
      Object.values(budgetData).forEach(region => {
        region.categories.forEach(cat => {
          if (!allCategories[cat.category]) {
            allCategories[cat.category] = { category: cat.category, budgeted: 0, spent: 0 };
          }
          allCategories[cat.category].budgeted += cat.budgeted;
          allCategories[cat.category].spent += cat.spent;
        });
      });

      return Object.values(allCategories).map(cat => ({
        ...cat,
        percentage: (cat.spent / cat.budgeted) * 100,
        remaining: cat.budgeted - cat.spent,
        status: (cat.spent / cat.budgeted) > 0.9 ? 'warning' : 'healthy'
      }));
    } else {
      // Show specific region
      const region = budgetData[selectedRegion];
      if (!region) return [];
      
      return region.categories.map(cat => ({
        ...cat,
        percentage: (cat.spent / cat.budgeted) * 100,
        remaining: cat.budgeted - cat.spent,
        status: (cat.spent / cat.budgeted) > 0.9 ? 'warning' : 'healthy'
      }));
    }
  }, [selectedRegion, budgetData]);

  const totalBudget = processedBudgetData.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = processedBudgetData.reduce((sum, cat) => sum + cat.spent, 0);
  const overallUtilization = (totalSpent / totalBudget) * 100;

  return (
    <div className="space-y-6">
      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Total Budget</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  ${(totalBudget / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-brand-text-secondary">
                  {selectedRegion === 'all' ? 'All Regions' : getProvinceNameByAbbreviation(selectedRegion)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Total Spent</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  ${(totalSpent / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-green-500">
                  {overallUtilization.toFixed(1)}% utilized
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Remaining</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  ${((totalBudget - totalSpent) / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-brand-text-secondary">
                  Available to spend
                </p>
              </div>
              <PieChart className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Budget Categories 
              {selectedRegion !== 'all' && ` - ${getProvinceNameByAbbreviation(selectedRegion)}`}
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'summary' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('summary')}
              >
                Summary
              </Button>
              <Button 
                variant={viewMode === 'detailed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('detailed')}
              >
                Detailed
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processedBudgetData.map((budget, index) => (
              <div key={index} className="p-4 bg-brand-charcoal/30 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-brand-text-primary">{budget.category}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={budget.status === 'warning' ? 'destructive' : 'secondary'}>
                        {budget.status === 'warning' ? 'High Utilization' : 'Healthy'}
                      </Badge>
                      {budget.status === 'warning' && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-text-primary">
                      ${budget.spent.toLocaleString()} / ${budget.budgeted.toLocaleString()}
                    </p>
                    <p className="text-sm text-brand-text-secondary">
                      ${budget.remaining.toLocaleString()} remaining
                    </p>
                  </div>
                </div>
                
                <Progress value={budget.percentage} className="mb-2" />
                <div className="flex justify-between text-sm text-brand-text-secondary">
                  <span>{budget.percentage.toFixed(1)}% utilized</span>
                  <span>Budget Period: FY 2024</span>
                </div>

                {viewMode === 'detailed' && (
                  <div className="mt-3 pt-3 border-t border-brand-border">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-brand-text-secondary">Monthly Average</p>
                        <p className="font-medium text-brand-text-primary">
                          ${(budget.spent / 12).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-brand-text-secondary">Projected End-of-Year</p>
                        <p className="font-medium text-brand-text-primary">
                          ${(budget.spent * 1.2).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
