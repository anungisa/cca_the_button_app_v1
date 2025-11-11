import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Check, 
  Star, 
  CreditCard, 
  Smartphone,
  Download,
  Crown,
  Zap,
  Shield,
  X,
  ArrowRight
} from 'lucide-react';
import { CurlingPlusSubscription } from '@/api/entities';
import { useXP } from '@/components/XPContext';

const FeatureItem = ({ icon: Icon, text, isPremium = false }) => (
  <div className="flex items-center gap-3 py-2">
    <Icon className={`w-5 h-5 ${isPremium ? 'text-amber-400' : 'text-green-400'}`} />
    <span className="text-brand-text-primary">{text}</span>
  </div>
);

const PricingCard = ({ 
  tier, 
  monthlyPrice, 
  annualPrice, 
  features, 
  isPopular = false, 
  onSelect,
  billingCycle,
  setBillingCycle 
}) => {
  const price = billingCycle === 'annual' ? annualPrice : monthlyPrice;
  const annualSavings = (monthlyPrice * 12) - annualPrice;
  
  return (
    <Card className={`relative ${isPopular ? 'border-brand-red ring-2 ring-brand-red/20' : 'border-brand-border'} bg-brand-card-bg`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-brand-red text-white px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl text-brand-text-primary">{tier}</CardTitle>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-brand-text-primary">
            ${price}
            <span className="text-sm text-brand-text-secondary font-normal">
              /{billingCycle === 'annual' ? 'year' : 'month'}
            </span>
          </div>
          {billingCycle === 'annual' && annualSavings > 0 && (
            <div className="text-sm text-green-400">
              Save ${annualSavings.toFixed(2)} per year!
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {features.map((feature, index) => (
            <FeatureItem key={index} {...feature} />
          ))}
        </div>
        
        <Button 
          onClick={() => onSelect(tier.toLowerCase().replace(' ', '_'), price)}
          className={`w-full ${isPopular ? 'bg-brand-red hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          Choose {tier}
        </Button>
      </CardContent>
    </Card>
  );
};

export default function CurlingPlusModal({ isOpen, onClose, initialTier = 'basic' }) {
  const { user } = useXP();
  const [selectedTier, setSelectedTier] = useState(initialTier);
  const [billingCycle, setBillingCycle] = useState('annual');
  const [step, setStep] = useState('plans'); // plans, payment, processing, success
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [promoCode, setPromoCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const tiers = {
    basic: {
      name: 'Curling+ Basic',
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      features: [
        { icon: Play, text: 'Live streaming access' },
        { icon: Download, text: 'Watch replays' },
        { icon: Smartphone, text: '2 devices' },
        { icon: Shield, text: 'HD quality' }
      ]
    },
    premium: {
      name: 'Curling+ Premium',
      monthlyPrice: 19.99,
      annualPrice: 199.99,
      features: [
        { icon: Play, text: 'Live streaming access' },
        { icon: Download, text: 'Unlimited replays' },
        { icon: Smartphone, text: '5 devices' },
        { icon: Shield, text: '4K quality' },
        { icon: Star, text: 'Exclusive content', isPremium: true },
        { icon: Zap, text: 'Early access', isPremium: true }
      ]
    },
    championship: {
      name: 'Curling+ Championship',
      monthlyPrice: 29.99,
      annualPrice: 299.99,
      features: [
        { icon: Play, text: 'All live events' },
        { icon: Download, text: 'Offline viewing' },
        { icon: Smartphone, text: 'Unlimited devices' },
        { icon: Shield, text: '4K + HDR quality' },
        { icon: Star, text: 'VIP exclusive content', isPremium: true },
        { icon: Crown, text: 'Championship access', isPremium: true },
        { icon: Zap, text: 'Behind-the-scenes', isPremium: true }
      ]
    }
  };

  const handleTierSelect = async (tier, price) => {
    setSelectedTier(tier);
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!user) {
      alert('Please sign in to subscribe');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Calculate end date
      const startDate = new Date();
      const endDate = new Date();
      if (billingCycle === 'annual') {
        endDate.setFullYear(startDate.getFullYear() + 1);
      } else {
        endDate.setMonth(startDate.getMonth() + 1);
      }

      // Create subscription
      const subscription = await CurlingPlusSubscription.create({
        user_id: user.id,
        subscription_tier: selectedTier,
        billing_cycle: billingCycle,
        status: 'active',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        payment_method: {
          type: paymentMethod,
          last_four: '4242',
          brand: 'visa'
        },
        pricing: {
          monthly_price: tiers[selectedTier].monthlyPrice,
          annual_price: tiers[selectedTier].annualPrice,
          currency: 'CAD'
        },
        features_enabled: getFeaturesForTier(selectedTier),
        trial_info: {
          is_trial: true,
          trial_days: 7,
          trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      });

      setStep('success');
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
        window.location.reload(); // Refresh to show new subscription status
      }, 3000);

    } catch (error) {
      console.error('Subscription error:', error);
      alert('Subscription failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getFeaturesForTier = (tier) => {
    const baseFeatures = ['live_streaming', 'replays'];
    const premiumFeatures = [...baseFeatures, 'exclusive_content', 'multi_device', '4k_quality'];
    const championshipFeatures = [...premiumFeatures, 'championship_access', 'early_access', 'offline_viewing'];
    
    switch (tier) {
      case 'premium': return premiumFeatures;
      case 'championship': return championshipFeatures;
      default: return baseFeatures;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-brand-card-bg border-brand-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl text-brand-text-primary flex items-center gap-2">
              <Play className="w-6 h-6 text-brand-red" />
              Upgrade to Curling+
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        {step === 'plans' && (
          <div className="space-y-6">
            {/* Billing Toggle */}
            <div className="flex justify-center">
              <div className="bg-brand-charcoal p-1 rounded-lg">
                <Button
                  variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setBillingCycle('monthly')}
                  className={billingCycle === 'monthly' ? 'bg-brand-red' : ''}
                >
                  Monthly
                </Button>
                <Button
                  variant={billingCycle === 'annual' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setBillingCycle('annual')}
                  className={billingCycle === 'annual' ? 'bg-brand-red' : ''}
                >
                  Annual
                  <Badge className="ml-2 bg-green-600 text-white text-xs">Save 20%</Badge>
                </Button>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(tiers).map(([key, tier], index) => (
                <PricingCard
                  key={key}
                  tier={tier.name}
                  monthlyPrice={tier.monthlyPrice}
                  annualPrice={tier.annualPrice}
                  features={tier.features}
                  isPopular={key === 'premium'}
                  onSelect={handleTierSelect}
                  billingCycle={billingCycle}
                  setBillingCycle={setBillingCycle}
                />
              ))}
            </div>

            {/* Free Trial Info */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
              <h3 className="font-semibold text-green-400 mb-2">🎉 7-Day Free Trial</h3>
              <p className="text-green-300 text-sm">
                Start your subscription with a free 7-day trial. Cancel anytime during the trial period.
              </p>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-brand-text-primary mb-2">
                Complete Your Subscription
              </h3>
              <p className="text-brand-text-secondary">
                {tiers[selectedTier]?.name} - ${billingCycle === 'annual' ? tiers[selectedTier]?.annualPrice : tiers[selectedTier]?.monthlyPrice}/{billingCycle === 'annual' ? 'year' : 'month'}
              </p>
            </div>

            <Card className="bg-brand-charcoal border-brand-border">
              <CardHeader>
                <CardTitle className="text-brand-text-primary">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={paymentMethod === 'credit_card' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('credit_card')}
                    className="flex items-center gap-2 h-12"
                  >
                    <CreditCard className="w-5 h-5" />
                    Credit Card
                  </Button>
                  <Button
                    variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('paypal')}
                    className="flex items-center gap-2 h-12"
                  >
                    PayPal
                  </Button>
                </div>

                {paymentMethod === 'credit_card' && (
                  <div className="space-y-3">
                    <Input placeholder="Card Number" className="bg-brand-card-bg border-brand-border" />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="MM/YY" className="bg-brand-card-bg border-brand-border" />
                      <Input placeholder="CVC" className="bg-brand-card-bg border-brand-border" />
                    </div>
                    <Input placeholder="Cardholder Name" className="bg-brand-card-bg border-brand-border" />
                  </div>
                )}

                <div className="space-y-2">
                  <Input
                    placeholder="Promo Code (Optional)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="bg-brand-card-bg border-brand-border"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('plans')} className="flex-1">
                Back to Plans
              </Button>
              <Button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className="flex-1 bg-brand-red hover:bg-red-700"
              >
                {isProcessing ? 'Processing...' : 'Start Free Trial'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-text-primary mb-2">
                Welcome to Curling+!
              </h3>
              <p className="text-brand-text-secondary">
                Your 7-day free trial has started. Enjoy unlimited access to all Curling+ content.
              </p>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-300 text-sm">
                You won't be charged until your trial ends. Cancel anytime in your account settings.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}