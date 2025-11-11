import React, { useState, useEffect } from 'react';
import { Reward } from '@/api/entities';
import { FinancialTransaction } from '@/api/entities';
import { useXP } from '../components/XPContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ShoppingCart, 
  Gift, 
  Star, 
  Search, 
  Filter,
  Zap,
  Award,
  Shirt,
  Ticket,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../components/hooks/use-toast';

// Simple RewardCard component inline to avoid import issues
const RewardCard = ({ reward, loyaltyData, user, onRedemptionSuccess, isBeingRedeemed }) => {
  const { toast } = useToast();

  const canRedeem = () => {
    if (!loyaltyData || !user) return false;
    if (loyaltyData.curl_points < reward.points_cost) return false;
    if (reward.stock_available !== null && reward.stock_available <= (reward.stock_claimed || 0)) return false;
    return true;
  };

  const handleRedeem = async () => {
    if (!canRedeem() || isBeingRedeemed) return;

    const products = [{
      product_id: reward.id,
      product_name: reward.name,
      amount: 0,
      metadata: {
        original_points_cost: reward.points_cost,
        reward_category: reward.category,
        requires_shipping: reward.category === 'merch'
      }
    }];

    await onRedemptionSuccess(products);
  };

  const isOutOfStock = reward.stock_available !== null && reward.stock_available <= (reward.stock_claimed || 0);

  return (
    <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-brand-text-primary line-clamp-2">
          {reward.name}
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <div className="bg-amber-500 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {reward.points_cost} Points
          </div>
          <div className="border border-brand-border text-brand-text-secondary px-2 py-1 rounded text-sm capitalize">
            {reward.category.replace('_', ' ')}
          </div>
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
              Out of Stock
            </Button>
          ) : !canRedeem() ? (
            <Button disabled className="w-full">
              {loyaltyData?.curl_points < reward.points_cost 
                ? `Need ${reward.points_cost - loyaltyData.curl_points} more points`
                : 'Cannot redeem'
              }
            </Button>
          ) : (
            <Button
              onClick={handleRedeem}
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function RewardStore() {
  const { user, loyaltyData, awardPoints, refreshXPData } = useXP();
  const [rewards, setRewards] = useState([]);
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState(null);

  const { toast } = useToast();

  const categories = [
    { id: 'all', name: 'All', icon: Gift },
    { id: 'merch', name: 'Merch', icon: Shirt },
    { id: 'experience', name: 'Experience', icon: Ticket },
    { id: 'discount', name: 'Discounts', icon: Star },
    { id: 'exclusive', name: 'Exclusive', icon: Award }
  ];

  useEffect(() => {
    loadRewards();
  }, []);

  useEffect(() => {
    filterRewards();
  }, [rewards, selectedCategory, searchTerm]);

  const loadRewards = async () => {
    setIsLoading(true);
    try {
      const rewardData = await Reward.filter({ is_active: true }, '-created_date');
      setRewards(rewardData || []);
    } catch (error) {
      console.error('Error loading rewards:', error);
      toast({
        variant: "destructive",
        title: "Error Loading Rewards",
        description: "Unable to load rewards. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterRewards = () => {
    let filtered = rewards;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(reward => reward.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(reward => 
        reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (reward.description && reward.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredRewards(filtered);
  };

  const handleRedemption = async (purchases) => {
    const purchase = purchases?.[0];
    if (!purchase) return;

    const pointsCost = purchase.metadata.original_points_cost;

    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be signed in to complete a redemption.",
      });
      return;
    }

    setRedeemingId(purchase.product_id);

    try {
      // 1. Create financial transaction for redemption
      await FinancialTransaction.create({
        transaction_type: 'reward_redemption',
        category: 'points_redeemed',
        amount: 0, // No monetary value, but could be assigned one
        points_cost: pointsCost,
        user_id: user.id,
        reference_id: purchase.product_id,
        product_details: {
          product_id: purchase.product_id,
          product_name: purchase.product_name,
        },
        description: `Redeemed: ${purchase.product_name}`,
        payment_status: purchase.metadata.requires_shipping ? 'pending' : 'completed',
        approval_status: 'approved',
      });

      // 2. Deduct points (this might also become part of a larger transaction service later)
      await awardPoints(-pointsCost, 'redeem_' + purchase.metadata.reward_category, 
        `Redeemed: ${purchase.product_name}`, purchase.product_id);
      
      // 3. Update stock on reward
      const originalReward = rewards.find(r => r.id === purchase.product_id);
      if (originalReward && originalReward.stock_available !== null) {
          await Reward.update(originalReward.id, {
              stock_claimed: (originalReward.stock_claimed || 0) + 1
          });
      }

      toast({
        title: "Redemption Successful!",
        description: `You've successfully redeemed ${purchase.product_name}.`,
      });
      
      // 4. Refresh data
      loadRewards();
      refreshXPData();

    } catch (error) {
      console.error('Redemption error:', error);
      toast({
        variant: "destructive",
        title: "Redemption Failed",
        description: "There was an error processing your redemption. Please try again.",
      });
    } finally {
      setRedeemingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-red" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-charcoal pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-brand-text-primary mb-4">Reward Store</h1>
          <p className="text-xl text-brand-text-secondary max-w-3xl mx-auto">
            Redeem your CurlPoints for exclusive merchandise, experiences, and discounts
          </p>
          
          {user && loyaltyData && (
            <div className="mt-6 inline-flex items-center gap-2 bg-brand-card-bg/80 backdrop-blur-sm px-6 py-3 rounded-lg border border-brand-border">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="text-2xl font-bold text-brand-text-primary">{loyaltyData.curl_points}</span>
              <span className="text-brand-text-secondary">CurlPoints Available</span>
            </div>
          )}
        </motion.div>

        {/* Search */}
        <Card className="mb-6 bg-brand-card-bg/80 backdrop-blur-sm border-brand-border">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
              <Input
                placeholder="Search rewards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-brand-charcoal border-brand-border text-brand-text-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="block md:hidden">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full bg-brand-card-bg border-brand-border text-brand-text-primary">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="hidden md:block">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    selectedCategory === category.id 
                      ? 'bg-brand-red text-white' 
                      : 'bg-brand-card-bg border-brand-border text-brand-text-secondary hover:text-brand-text-primary'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Rewards Grid */}
        {filteredRewards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredRewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <RewardCard 
                    reward={reward} 
                    loyaltyData={loyaltyData}
                    user={user}
                    onRedemptionSuccess={handleRedemption}
                    isBeingRedeemed={redeemingId === reward.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-brand-text-primary mb-2">No rewards found</h3>
            <p className="text-brand-text-secondary">
              Try adjusting your search or browse other categories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}