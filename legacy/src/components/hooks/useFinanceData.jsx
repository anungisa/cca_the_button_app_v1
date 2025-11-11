import { useState, useEffect } from 'react';
import { FinanceService } from '../services/FinanceService';

export const useFinanceData = () => {
  const [data, setData] = useState({
    transactions: [],
    budgets: [],
    grants: [],
    vendors: [],
    approvals: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await FinanceService.getAggregatedFinancialData();
      setData(result);
    } catch (err) {
      console.error("Error fetching financial data:", err);
      setError("Failed to load financial data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};