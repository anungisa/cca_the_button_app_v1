
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Gift, Crown, Zap, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import PurchaseButton from '../purchasing/PurchaseButton';

const tierColors = {
  granite_rookie: 'bg-gray-600',
  sheet_star: 'bg-blue-600',
  house_hero: 'bg-purple-600',
  button_boss: 'bg-red-600',
  hack_master: 'bg-green-600',
  granite_legacy: 'bg-amber-500'
};

const tierIcons = {
  granite_rookie: Star,
  sheet_star: Star,
  house_hero: Crown,
  button_boss: Crown,
  hack_master: Zap,
  granite_legacy: Gift
};

export default function RewardCard({ reward, loyaltyData, user, onRedemptionSuccess, isBeingRedeemed = false }) {

  const canRedeem = () => {
    if (!loyaltyData || !user) return false;
    
    // Check points
    if (loyaltyData.curl_points < reward.points_cost) return false;
    
    // Check tier requirement
    if (reward.tier_requirement && loyaltyData.tier !== reward.tier_requirement) {
      const tierOrder = ['granite_rookie', 'sheet_star', 'house_hero', 'button_boss', 'hack_master', 'granite_legacy'];
      const currentTierIndex = tierOrder.indexOf(loyaltyData.tier);
      const requiredTierIndex = tierOrder.indexOf(reward.tier_requirement);
      if (currentTierIndex < requiredTierIndex) return false;
    }
    
    // Check stock
    if (reward.stock_available !== null && reward.stock_available <= (reward.stock_claimed || 0)) return false;
    
    return true;
  };

  const handleRedemption = () => {
    const products = [{
      id: reward.id,
      name: reward.name,
      category: 'reward_redemption',
      amount: 0, // Points redemption, no monetary cost
      metadata: {
        original_points_cost: reward.points_cost,
        reward_category: reward.category,
        requires_shipping: reward.category === 'merch'
      }
    }];

    return products;
  };

  const TierIcon = reward.tier_requirement ? tierIcons[reward.tier_requirement] : Gift;
  const isOutOfStock = reward.stock_available !== null && reward.stock_available <= (reward.stock_claimed || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg text-brand-text-primary line-clamp-2">
              {reward.name}
            </CardTitle>
            {reward.tier_requirement && (
              <div className={`w-8 h-8 ${tierColors[reward.tier_requirement]} rounded-full flex items-center justify-center flex-shrink-0 ml-2`}>
                <TierIcon className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-amber-500 text-white flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {reward.points_cost} Points
            </Badge>
            
            <Badge variant="outline" className="border-brand-border text-brand-text-secondary capitalize">
              {reward.category.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between">
          <div>
            {reward.image_url && (
              <div className="mb-4 bg-brand-charcoal rounded-lg overflow-hidden">
                <img 
                  src={reward.image_url} 
                  alt={reward.name}
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
            
            <p className="text-brand-text-secondary text-sm mb-4 line-clamp-3">
              {reward.description}
            </p>

            {reward.sponsor_name && (
              <p className="text-xs text-brand-text-secondary mb-2">
                Sponsored by <span className="text-brand-red font-medium">{reward.sponsor_name}</span>
              </p>
            )}

            {reward.stock_available !== null && (
              <p className="text-xs text-brand-text-secondary mb-4">
                {reward.stock_available - (reward.stock_claimed || 0)} remaining
              </p>
            )}
          </div>

          <div className="mt-auto">
            {!user ? (
              <Button disabled className="w-full">
                Sign in to redeem
              </Button>
            ) : isOutOfStock ? (
              <Button disabled className="w-full">
                <AlertCircle className="w-4 h-4 mr-2" />
                Out of Stock
              </Button>
            ) : !canRedeem() ? (
              <Button disabled className="w-full">
                {loyaltyData?.curl_points < reward.points_cost 
                  ? `Need ${reward.points_cost - loyaltyData.curl_points} more points`
                  : 'Tier requirement not met'
                }
              </Button>
            ) : (
              <PurchaseButton
                products={handleRedemption()}
                purchaseType="reward_redemption"
                onSuccess={onRedemptionSuccess}
                disabled={isBeingRedeemed}
              >
                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                  disabled={isBeingRedeemed}
                >
                  {isBeingRedeemed ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Redeem Now'
                  )}
                </Button>
              </PurchaseButton>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
