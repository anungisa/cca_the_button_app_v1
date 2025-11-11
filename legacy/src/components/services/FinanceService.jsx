import { canadianProvincesAndTerritories } from '../utils/provinces';

// --- MOCK DATA GENERATION ---
// In a real app, this service would make API calls to QuickBooks, Budgyt, etc.
// For now, it generates realistic sample data to simulate that process.
const generateSampleFinancialData = () => {
  const financialData = {
    transactions: [],
    budgets: [],
    grants: [],
    sponsorships: [],
    vendors: [],
    approvals: []
  };

  // Simulate fetching data from QuickBooks (Transactions)
  canadianProvincesAndTerritories.forEach(province => {
    const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'];
    months.forEach(month => {
      financialData.transactions.push({
        id: `txn-${province.abbreviation}-${month}-mem`,
        source: 'QuickBooks',
        ma_region: province.abbreviation,
        month, type: 'revenue', category: 'membership_fees',
        amount: Math.floor(Math.random() * 15000) + 5000,
        description: `${province.name} Membership Dues`, approval_status: 'approved'
      });
      financialData.transactions.push({
        id: `txn-${province.abbreviation}-${month}-exp`,
        source: 'QuickBooks',
        ma_region: province.abbreviation,
        month, type: 'expense', category: 'operational_expense',
        amount: -(Math.floor(Math.random() * 8000) + 3000),
        description: `${province.name} Facility Costs`, approval_status: 'approved'
      });
    });
  });
  // National Transactions
  financialData.transactions.push({
    id: `txn-nat-2024-06-spon`, source: 'QuickBooks', ma_region: null,
    month: '2024-06', type: 'revenue', category: 'sponsorship', amount: 250000,
    description: 'National Partner Sponsorship', approval_status: 'approved'
  });


  // Simulate fetching data from Budgyt (Budgets)
  canadianProvincesAndTerritories.forEach(province => {
    financialData.budgets.push({
      id: `bud-${province.abbreviation}`, source: 'Budgyt', ma_region: province.abbreviation,
      region_name: province.name, fiscal_year: 2024,
      total_budget: Math.floor(Math.random() * 200000) + 100000,
      spent_amount: Math.floor(Math.random() * 80000) + 40000,
      committed_amount: Math.floor(Math.random() * 30000) + 10000,
      variance_threshold: 0.1,
      categories: [
        { name: 'Operations', budgeted: 50000, spent: 32000, variance: -0.36 },
        { name: 'Events', budgeted: 40000, spent: 28000, variance: -0.30 },
      ]
    });
  });

  // Simulate internal data (Grants, Approvals, etc.)
  financialData.grants.push({ 
    id: 'grant-1', source: 'Internal', ma_region: 'ON', 
    grant_name: `Ontario Sport Development Grant`, amount: 50000,
    status: 'awarded', due_date: '2024-12-31', report_due_date: '2025-01-31'
  });
  financialData.vendors.push({
    id: 'vendor-1', source: 'Internal', ma_region: 'AB', vendor_name: `Alberta Ice Supplies`,
    contract_value: 25000, contract_type: 'equipment_lease', status: 'active',
    start_date: '2024-01-01', end_date: '2024-12-31', performance_rating: 4.5
  });
  financialData.approvals.push({
    id: 'appr-1', source: 'Internal', ma_region: null, type: 'expense', category: 'marketing',
    amount: -25000, description: 'National Championship Marketing Campaign',
    approval_status: 'pending_approval', requested_by: 'Marketing Director', due_date: '2024-07-20'
  });

  return financialData;
};

// --- MOCK SERVICE INTERFACE ---
export const FinanceService = {
  /**
   * Fetches and aggregates all financial data from various sources.
   * @returns {Promise<object>} A promise that resolves to the aggregated financial data.
   */
  getAggregatedFinancialData: async () => {
    console.log("FinanceService: Simulating fetching data from QuickBooks, Budgyt, and internal DB...");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const data = generateSampleFinancialData();
    console.log("FinanceService: Data aggregation complete.");
    return data;
  },

  /**
   * Simulates forcing a sync with an external system.
   * @param {string} systemName - The name of the system to sync (e.g., 'QuickBooks').
   * @returns {Promise<{status: string, message: string}>} A promise that resolves to the sync status.
   */
  forceSync: async (systemName) => {
    console.log(`FinanceService: Initiating force sync with ${systemName}...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`FinanceService: Sync with ${systemName} completed.`);
    return { status: 'success', message: `Successfully synced with ${systemName}.` };
  }
};