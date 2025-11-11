import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Zap, Crown, Check, Gift, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FanPassActivation({ onSubscribe, currentPlan = null }) {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState('annual');

  const plans = {
    monthly: {
      price: 2.99,
      period: t('fanpass.monthly'),
      savings: null
    },
    annual: {
      price: 25,
      period: t('fanpass.annual'),
      savings: 10.88
    }
  };

  const benefits = [
    {
      icon: Zap,
      title: t('fanpass.benefit.double_xp'),
      description: 'Double your points on all activities',
      highlight: true
    },
    {
      icon: Crown,
      title: t('fanpass.benefit.exclusive_badges'),
      description: 'Access to Fan Pass-only achievements',
      highlight: true
    },
    {
      icon: Gift,
      title: t('fanpass.benefit.priority_rewards'),
      description: 'Early access to limited edition rewards',
      highlight: false
    }
  ];

  if (currentPlan) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-amber-600 to-amber-700 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Crown className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-bold">{t('fanpass.title')} Active</h3>
                  <p className="opacity-90">
                    {currentPlan.plan_type === 'annual' ? t('fanpass.annual') : t('fanpass.monthly')} Plan
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Expires</p>
                <p className="font-semibold">
                  {new Date(currentPlan.expiry_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
            <Star className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-brand-text-primary mb-4">
          {t('fanpass.title')}
        </h1>
        <p className="text-xl text-brand-text-secondary">
          {t('fanpass.subtitle')}
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => {
          const IconComponent = benefit.icon;
          return (
            <Card key={index} className={`bg-brand-card-bg border-brand-border ${
              benefit.highlight ? 'ring-2 ring-amber-400' : ''
            }`}>
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  benefit.highlight ? 'bg-amber-500' : 'bg-brand-charcoal'
                }`}>
                  <IconComponent className={`w-6 h-6 ${
                    benefit.highlight ? 'text-white' : 'text-brand-red'
                  }`} />
                </div>
                <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
                  {benefit.title}
                </h3>
                <p className="text-brand-text-secondary">
                  {benefit.description}
                </p>
                {benefit.highlight && (
                  <Badge className="mt-3 bg-amber-500 text-white">
                    Premium Feature
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {Object.entries(plans).map(([planKey, plan]) => (
          <Card key={planKey} className={`bg-brand-card-bg border-brand-border relative ${
            planKey === 'annual' ? 'ring-2 ring-amber-400' : ''
          }`}>
            {planKey === 'annual' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-amber-500 text-white px-4 py-1">
                  BEST VALUE
                </Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-brand-text-primary">{plan.period}</CardTitle>
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-bold text-brand-text-primary">${plan.price}</span>
                <span className="text-brand-text-secondary">/{planKey === 'annual' ? 'year' : 'month'}</span>
              </div>
              {plan.savings && (
                <p className="text-green-400 text-sm">Save ${plan.savings} per year!</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-brand-text-secondary">{benefit.title}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => onSubscribe(planKey)}
                className={`w-full ${
                  planKey === 'annual' 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                    : 'bg-brand-red hover:bg-red-700'
                }`}
              >
                {t('fanpass.upgrade_now')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}