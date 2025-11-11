import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  Star, Zap, Shield, Crown, CreditCard, Calendar, RefreshCw, XCircle, CheckCircle2, Ticket, Loader2
} from 'lucide-react';
import { useXP } from '../components/XPContext';
import { Purchase } from '@/api/entities';
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';

const mockSubscriptions = [
  { id: 'fan_pass_pro', name: 'Fan Pass Pro', price: 12.99, interval: 'month', status: 'active', renewal_date: '2024-08-15', benefits: ['Ad-free viewing', 'Bonus XP', 'Exclusive Content'] },
  { id: 'smart_broom_plus', name: 'SmartBroom+', price: 99.99, interval: 'year', status: 'active', renewal_date: '2025-03-01', benefits: ['Advanced Analytics', 'Cloud Storage', 'Coach Insights'] },
];

const mockPurchaseHistory = [
  { id: 1, date: '2024-07-15', product: 'Fan Pass Pro (Monthly)', amount: 12.99, status: 'Completed' },
  { id: 2, date: '2024-06-15', product: 'Fan Pass Pro (Monthly)', amount: 12.99, status: 'Completed' },
  { id: 3, date: '2024-05-15', product: 'Fan Pass Pro (Monthly)', amount: 12.99, status: 'Completed' },
];

const SubscriptionCard = ({ sub }) => {
  const [autoRenew, setAutoRenew] = useState(true);

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              {sub.name}
            </CardTitle>
            <CardDescription>${sub.price}/{sub.interval}</CardDescription>
          </div>
          <Badge className={sub.status === 'active' ? 'bg-green-600' : 'bg-gray-500'}>{sub.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <h4 className="font-semibold text-brand-text-primary">Benefits:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-brand-text-secondary">
          {sub.benefits.map(b => <li key={b}>{b}</li>)}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Switch id={`autorenew-${sub.id}`} checked={autoRenew} onCheckedChange={setAutoRenew} />
          <label htmlFor={`autorenew-${sub.id}`} className="text-sm font-medium text-brand-text-secondary">Auto-renew</label>
        </div>
        <p className="text-sm text-brand-text-secondary">
          Renews on: {format(new Date(sub.renewal_date), 'MMMM d, yyyy')}
        </p>
      </CardFooter>
    </Card>
  );
};

export default function SubscriptionManagement() {
  const { user } = useXP();
  const [subscriptions, setSubscriptions] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscriptions();
    }
  }, [user]);

  const loadSubscriptions = async () => {
    setIsLoading(true);
    // Simulate fetching data
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubscriptions(mockSubscriptions);
    setPurchaseHistory(mockPurchaseHistory);
    setIsLoading(false);
  };
  
  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Ticket className="w-8 h-8 text-brand-red" />
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Manage Subscriptions</h1>
          <p className="text-brand-text-secondary">View your active subscriptions, manage payment methods, and see your purchase history.</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary mb-4">Your Subscriptions</h2>
          <div className="grid gap-6">
            {subscriptions.map(sub => <SubscriptionCard key={sub.id} sub={sub} />)}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary mb-4">Payment Methods</h2>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <CreditCard className="w-8 h-8 text-brand-text-secondary" />
                <div>
                  <p className="font-semibold text-brand-text-primary">Visa **** 4242</p>
                  <p className="text-sm text-brand-text-secondary">Expires 12/2026</p>
                </div>
              </div>
              <Button variant="outline">Manage Methods</Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary mb-4">Purchase History</h2>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-brand-border">
                    <tr>
                      <th className="p-4 text-left font-semibold text-brand-text-primary">Date</th>
                      <th className="p-4 text-left font-semibold text-brand-text-primary">Description</th>
                      <th className="p-4 text-right font-semibold text-brand-text-primary">Amount</th>
                      <th className="p-4 text-center font-semibold text-brand-text-primary">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseHistory.map(p => (
                      <tr key={p.id} className="border-b border-brand-border last:border-b-0">
                        <td className="p-4 text-brand-text-secondary">{p.date}</td>
                        <td className="p-4 text-brand-text-primary">{p.product}</td>
                        <td className="p-4 text-right text-brand-text-primary">${p.amount.toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <Badge variant={p.status === 'Completed' ? 'default' : 'destructive'}>{p.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}