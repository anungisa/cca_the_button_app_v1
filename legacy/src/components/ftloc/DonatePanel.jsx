
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox'; // Added Checkbox import
import { Heart } from 'lucide-react'; // DollarSign removed
import { useXP } from '../XPContext';
import PurchaseButton from '../purchasing/PurchaseButton'; // Added PurchaseButton import

export default function DonatePanel() {
  const { user, awardPoints } = useXP(); // User added as per outline
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [isRecurring, setIsRecurring] = useState(false);

  const suggestedAmounts = [10, 25, 50, 100, 250];

  const handleDonationSuccess = async (purchases) => {
    const donation = purchases[0];
    const amount = donation.amount / 100; // Convert back to dollars

    // Award XP for donation (1 point per dollar)
    await awardPoints(amount, 'ftloc_donation', `Donation: $${amount}`, donation.id);

    alert(`Thank you for your $${amount} donation to For The Love of Curling!`);
  };

  const createDonationProduct = (amount, recurring = false) => {
    const finalAmount = parseFloat(amount); // Ensure amount is a number
    if (isNaN(finalAmount) || finalAmount <= 0) {
      return []; // Return empty array if amount is invalid
    }
    return [{
      id: `ftloc_donation_${finalAmount}${recurring ? '_recurring' : ''}`,
      name: `FTLOC Donation - $${finalAmount}`,
      category: 'ftloc_donation',
      amount: finalAmount * 100, // Convert to cents
      subscription: recurring ? {
        billing_cycle: 'monthly',
        start_date: new Date().toISOString(),
        auto_renew: true,
        trial_days: 0
      } : undefined,
      metadata: {
        donation_amount: finalAmount,
        is_recurring: recurring,
        cause: 'youth_development'
      }
    }];
  };

  const currentDonationAmount = selectedAmount || parseFloat(customAmount) || 0;

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="text-xl text-brand-text-primary flex items-center gap-2">
          <Heart className="w-6 h-6 text-brand-red" />
          Make a Donation
        </CardTitle>
        <p className="text-brand-text-secondary">
          Support youth curling development across Canada
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Selection */}
        <div>
          <label className="text-brand-text-primary font-medium mb-3 block">
            Donation Amount
          </label>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {suggestedAmounts.map(amount => (
              <Button
                key={amount}
                variant={selectedAmount === amount ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
                className={selectedAmount === amount ? 'bg-brand-red hover:bg-brand-red/90 text-white' : 'border-brand-border text-brand-text-secondary hover:bg-brand-charcoal/50'}
              >
                ${amount}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-brand-text-secondary">$</span>
            <Input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(0);
              }}
              className="bg-brand-charcoal border-brand-border text-brand-text-primary flex-1"
            />
          </div>
        </div>

        {/* Recurring Option */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="recurring"
            checked={isRecurring}
            onCheckedChange={setIsRecurring}
            className="border-brand-border data-[state=checked]:bg-brand-red data-[state=checked]:text-white"
          />
          <label htmlFor="recurring" className="text-brand-text-primary text-sm">
            Make this a monthly recurring donation
          </label>
        </div>

        {/* Impact Message */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            💡 <strong>Your impact:</strong> ${currentDonationAmount} helps provide
            {currentDonationAmount >= 100 ? ' equipment for a full youth team' :
             currentDonationAmount >= 50 ? ' ice time for youth programs' :
             currentDonationAmount >= 25 ? ' equipment for young curlers' :
             ' support for youth development'}
          </p>
        </div>

        {/* Donate Button */}
        <PurchaseButton
          products={createDonationProduct(
            currentDonationAmount,
            isRecurring
          )}
          purchaseType={isRecurring ? 'subscription' : 'one_time'}
          buttonText={`Donate $${currentDonationAmount}${isRecurring ? '/month' : ''}`}
          buttonClassName="w-full bg-brand-red hover:bg-red-700 text-lg py-3"
          buttonSize="lg"
          disabled={currentDonationAmount <= 0}
          onSuccess={handleDonationSuccess}
        />

        <p className="text-brand-text-secondary text-xs text-center">
          Tax receipts will be issued for donations over $20
        </p>
      </CardContent>
    </Card>
  );
}
