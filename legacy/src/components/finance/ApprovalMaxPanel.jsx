import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Clock } from 'lucide-react';

export default function ApprovalMaxPanel({ transactions, onApprove }) {
  const pendingTransactions = transactions?.filter(
    (t) => t.approval_status === 'pending_approval' || t.payment_status === 'pending_approval'
  );

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Approval Queue</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingTransactions && pendingTransactions.length > 0 ? (
          <div className="space-y-4">
            {pendingTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-brand-charcoal rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-brand-text-primary">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-brand-text-secondary">
                    Category: {transaction.category}
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                   <p className="font-semibold text-red-500 text-lg">
                    ${Math.abs(transaction.amount).toLocaleString()}
                  </p>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-green-500 hover:bg-green-500/10"
                    onClick={() => onApprove(transaction.id)}
                  >
                    <Check className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-500/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-brand-text-secondary">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No transactions pending approval.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}