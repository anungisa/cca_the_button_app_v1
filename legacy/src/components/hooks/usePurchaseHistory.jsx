import { useState, useEffect } from 'react';
import { Purchase } from '@/api/entities';
import { useXP } from '@/components/XPContext';

export const usePurchaseHistory = (category = null) => {
  const { user } = useXP();
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPurchases();
    }
  }, [user, category]);

  const loadPurchases = async () => {
    setIsLoading(true);
    try {
      const filters = { user_id: user.id };
      if (category) {
        filters.product_category = category;
      }
      
      const userPurchases = await Purchase.filter(filters, '-created_date', 50);
      setPurchases(userPurchases);
    } catch (error) {
      console.error('Error loading purchases:', error);
      setPurchases([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getActiveSubscriptions = () => {
    return purchases.filter(p => 
      p.purchase_type === 'subscription' && 
      p.status === 'completed' &&
      p.subscription_details?.end_date &&
      new Date(p.subscription_details.end_date) > new Date()
    );
  };

  const getTotalSpent = () => {
    return purchases
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getPurchasesByCategory = () => {
    const categories = {};
    purchases.forEach(purchase => {
      const cat = purchase.product_category;
      if (!categories[cat]) {
        categories[cat] = [];
      }
      categories[cat].push(purchase);
    });
    return categories;
  };

  return {
    purchases,
    isLoading,
    getActiveSubscriptions,
    getTotalSpent,
    getPurchasesByCategory,
    refreshPurchases: loadPurchases
  };
};