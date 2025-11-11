
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Subscription } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Zap, 
  Crown, 
  Check,
  Gift,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useXP } from '../components/XPContext';
import PurchaseButton from '../components/purchasing/PurchaseButton';

export default function FanPass() {
  const { user, loyaltyData } = useXP();
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscriptionData();
  }, [user]);

  const loadSubscriptionData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const subscriptions = await Subscription.filter({ 
        user_id: user.id, 
        subscription_type: 'fan_pass' 
      });
      
      if (subscriptions.length > 0) {
        setSubscription(subscriptions[0]);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Modified handleSubscribe to return product data for PurchaseButton
  const handleSubscribe = (planType) => { // Removed async as it's now preparing data, not performing an async action directly here.
    const products = [{
      id: `fan_pass_${planType}`,
      name: `Fan Pass ${planType === 'annual' ? 'Annual' : 'Monthly'}`,
      category: 'fan_pass',
      amount: planType === 'annual' ? 2500 : 299, // $25.00 or $2.99 (amounts usually in cents)
      subscription: {
        billing_cycle: planType === 'annual' ? 'annual' : 'monthly',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + (planType === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
        auto_renew: true,
        trial_days: 0
      },
      metadata: {
        xp_multiplier: 2,
        exclusive_badges: true
      }
    }];

    return products;
  };

  // New success handler for PurchaseButton
  const handlePurchaseSuccess = (purchases) => {
    // Assuming 'purchases' is an array of created subscription objects from the backend
    if (purchases && purchases.length > 0) {
      setSubscription(purchases[0]);
      alert('Successfully subscribed to Fan Pass!');
      // Refresh the page to show new subscription status immediately
      window.location.reload();
    } else {
        console.error('Purchase successful but no subscription data returned.');
        alert('Subscription successful, but failed to update status. Please refresh.');
    }
  };

  const fanPassFeatures = [
    {
      icon: Zap,
      title: '2x CurlPoints',
      description: 'Double your points on all activities',
      highlight: true
    },
    {
      icon: Crown,
      title: 'Exclusive Badges',
      description: 'Access to Fan Pass-only achievements',
      highlight: true
    },
    {
      icon: Gift,
      title: 'Priority Rewards',
      description: 'Early access to limited edition rewards',
      highlight: false
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Detailed progress tracking and insights',
      highlight: false
    },
    {
      icon: Star,
      title: 'Premium Support',
      description: 'Priority customer support',
      highlight: false
    },
    {
      icon: Award,
      title: 'Exclusive Content',
      description: 'Access to Fan Pass-only content and events',
      highlight: false
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  const isSubscribed = subscription && subscription.status === 'active';

  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
              <Star className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-brand-text-primary mb-4">
            Fan Pass
          </h1>
          <p className="text-xl text-brand-text-secondary max-w-3xl mx-auto">
            Supercharge your curling journey with exclusive perks, double XP, and premium features
          </p>
        </motion.div>

        {/* Current Status */}
        {isSubscribed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-amber-600 to-amber-700 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Crown className="w-8 h-8" />
                    <div>
                      <h3 className="text-xl font-bold">Fan Pass Active</h3>
                      <p className="opacity-90">
                        {subscription.plan_type === 'annual' ? 'Annual' : 'Monthly'} Plan
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm opacity-90">Expires</p>
                    <p className="font-semibold">
                      {new Date(subscription.expiry_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-brand-text-primary text-center mb-8">
            What's Included
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fanPassFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className={`bg-brand-card-bg border-brand-border h-full ${
                    feature.highlight ? 'ring-2 ring-amber-400' : ''
                  }`}>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        feature.highlight ? 'bg-amber-500' : 'bg-brand-charcoal'
                      }">
                        <IconComponent className="w-6 h-6 ${
                          feature.highlight ? 'text-white' : 'text-brand-red'
                        }" />
                      </div>
                      <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-brand-text-secondary">
                        {feature.description}
                      </p>
                      {feature.highlight && (
                        <Badge className="mt-3 bg-amber-500 text-white">
                          Premium Feature
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Pricing */}
        {!isSubscribed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-brand-text-primary text-center mb-8">
              Choose Your Plan
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Monthly Plan */}
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-brand-text-primary">Monthly</CardTitle>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold text-brand-text-primary">$2.99</span>
                    <span className="text-brand-text-secondary">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {fanPassFeatures.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-brand-text-secondary">{feature.title}</span>
                      </li>
                    ))}
                  </ul>
                  <PurchaseButton
                    products={handleSubscribe('monthly')} // Pass data directly
                    purchaseType="subscription"
                    buttonText="Subscribe Monthly"
                    buttonClassName="w-full bg-brand-red hover:bg-red-700"
                    onSuccess={handlePurchaseSuccess}
                  />
                </CardContent>
              </Card>

              {/* Annual Plan */}
              <Card className="bg-brand-card-bg border-brand-border ring-2 ring-amber-400 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-amber-500 text-white px-4 py-1">
                    BEST VALUE
                  </Badge>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-brand-text-primary">Annual</CardTitle>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold text-brand-text-primary">$25</span>
                    <span className="text-brand-text-secondary">/year</span>
                  </div>
                  <p className="text-green-400 text-sm">Save $10.88 per year!</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {fanPassFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-brand-text-secondary">{feature.title}</span>
                      </li>
                    ))}
                  </ul>
                  <PurchaseButton
                    products={handleSubscribe('annual')} // Pass data directly
                    purchaseType="subscription"
                    buttonText="Subscribe Annually"
                    buttonClassName="w-full bg-amber-500 hover:bg-amber-600 text-white"
                    onSuccess={handlePurchaseSuccess}
                  />
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Impact Stats */}
        {loyaltyData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12"
          >
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="text-center">Your Impact with Fan Pass</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-amber-400 mb-2">
                      {loyaltyData.total_earned_points * (isSubscribed ? 2 : 1)}
                    </div>
                    <p className="text-brand-text-secondary">
                      Total Points {isSubscribed ? '(with 2x multiplier)' : 'Earned'}
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {loyaltyData.badges?.length || 0}
                    </div>
                    <p className="text-brand-text-secondary">Badges Earned</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {loyaltyData.tier.replace('_', ' ').toUpperCase()}
                    </div>
                    <p className="text-brand-text-secondary">Current Tier</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
