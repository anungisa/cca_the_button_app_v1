
import React, { useState, useEffect } from 'react';
import { User, MysteryBox as MysteryBoxEntity, PointTransaction, LoyaltyProgram } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Gift, 
  Star, 
  Sparkles, 
  Trophy, 
  Heart,
  Zap,
  Clock,
  Package
} from 'lucide-react';
import { format } from 'date-fns';

export default function MysteryBox() {
  const [user, setUser] = useState(null);
  const [availableBoxes, setAvailableBoxes] = useState([]);
  const [claimedBoxes, setClaimedBoxes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [claimingBox, setClaimingBox] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
        
        // Load available mystery boxes
        const boxes = await MysteryBoxEntity.filter({ is_active: true });
        
        // Filter boxes based on user eligibility
        const available = boxes.filter(box => {
          const now = new Date();
          const startDate = new Date(box.availability.start_date);
          const endDate = new Date(box.availability.end_date);
          
          // Check time window
          if (now < startDate || now > endDate) return false;
          
          // Check if user already claimed
          if (box.claimed_by.includes(userData.id)) return false;
          
          // Check region requirement
          if (box.availability.ma_region && box.availability.ma_region !== userData.ma_region) return false;
          
          return true;
        });
        
        const claimed = boxes.filter(box => box.claimed_by.includes(userData.id));
        
        setAvailableBoxes(available);
        setClaimedBoxes(claimed);
        
      } catch (error) {
        console.error('Error loading mystery boxes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleClaimBox = async (box) => {
    setClaimingBox(box.id);
    
    try {
      // Randomly select rewards from the box
      const rewards = [];
      const totalRewards = Math.floor(Math.random() * 3) + 1; // 1-3 rewards
      
      for (let i = 0; i < totalRewards; i++) {
        const randomReward = box.contents[Math.floor(Math.random() * box.contents.length)];
        rewards.push(randomReward);
      }
      
      // Award points for any CurlPoints rewards
      let totalPoints = 0;
      rewards.forEach(reward => {
        if (reward.item_type === 'curl_points') {
          totalPoints += reward.item_value;
        }
      });
      
      if (totalPoints > 0) {
        await PointTransaction.create({
          user_id: user.id,
          points_amount: totalPoints,
          transaction_type: 'bonus',
          description: `Mystery Box: ${box.name}`,
          reference_id: box.id,
          source: 'mystery_box'
        });
        
        // Update loyalty points
        const loyaltyProfiles = await LoyaltyProgram.filter({ user_id: user.id });
        if (loyaltyProfiles.length > 0) {
          const profile = loyaltyProfiles[0];
          await LoyaltyProgram.update(profile.id, {
            curl_points: profile.curl_points + totalPoints,
            total_earned_points: profile.total_earned_points + totalPoints
          });
        }
      }
      
      // Update box claimed status
      await MysteryBoxEntity.update(box.id, {
        claimed_by: [...box.claimed_by, user.id]
      });
      
      // Update local state
      setAvailableBoxes(prev => prev.filter(b => b.id !== box.id));
      setClaimedBoxes(prev => [...prev, { ...box, claimed_by: [...box.claimed_by, user.id] }]);
      
      // Show rewards (in a real app, this would be a modal)
      const rewardText = rewards.map(r => `${r.item_name} (${r.rarity})`).join(', ');
      alert(`Mystery Box opened! You received: ${rewardText}`);
      
    } catch (error) {
      console.error('Error claiming mystery box:', error);
      alert('Failed to claim mystery box. Please try again.');
    } finally {
      setClaimingBox(null);
    }
  };

  const getBoxTypeIcon = (type) => {
    switch (type) {
      case 'weekend_drop': return Gift;
      case 'event_special': return Trophy;
      case 'sponsor_box': return Star;
      case 'season_finale': return Sparkles;
      default: return Package;
    }
  };

  const getBoxTypeColor = (type) => {
    switch (type) {
      case 'weekend_drop': return 'bg-blue-100 text-blue-800';
      case 'event_special': return 'bg-amber-100 text-amber-800';
      case 'sponsor_box': return 'bg-purple-100 text-purple-800';
      case 'season_finale': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mystery boxes...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Gift className="w-12 h-12 text-brand-red mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brand-charcoal mb-2">Mystery Rewards</h2>
            <p className="text-gray-600 mb-6">Sign in to discover surprise rewards!</p>
            <Button onClick={() => User.login()} className="bg-brand-red hover:bg-red-700">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-charcoal uppercase">Mystery Boxes</h1>
          <p className="text-gray-600 mt-1">
            Discover surprise rewards and exclusive items
          </p>
        </div>

        {/* Available Boxes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-brand-charcoal mb-6">Available Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableBoxes.map((box) => {
              const TypeIcon = getBoxTypeIcon(box.box_type);
              const timeLeft = new Date(box.availability.end_date) - new Date();
              const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));
              
              return (
                <Card key={box.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-red to-red-700 rounded-full flex items-center justify-center">
                          <TypeIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{box.name}</CardTitle>
                          <Badge className={getBoxTypeColor(box.box_type)}>
                            {box.box_type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{hoursLeft}h left</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{box.description}</p>
                    
                    {/* Possible Contents */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-brand-charcoal mb-2">Possible Contents:</h4>
                      <div className="flex flex-wrap gap-2">
                        {box.contents.slice(0, 4).map((item, index) => (
                          <Badge key={index} className={getRarityColor(item.rarity)}>
                            {item.item_name}
                          </Badge>
                        ))}
                        {box.contents.length > 4 && (
                          <Badge variant="outline">
                            +{box.contents.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Sponsor Info */}
                    {box.sponsor_info && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <img 
                            src={box.sponsor_info.sponsor_logo} 
                            alt={box.sponsor_info.sponsor_name}
                            className="h-6 object-contain"
                          />
                          <span className="text-sm font-medium text-brand-charcoal">
                            {box.sponsor_info.sponsor_name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{box.sponsor_info.sponsor_message}</p>
                      </div>
                    )}
                    
                    <Button
                      onClick={() => handleClaimBox(box)}
                      disabled={claimingBox === box.id}
                      className="w-full bg-brand-red hover:bg-red-700"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      {claimingBox === box.id ? 'Opening...' : 'Claim Box'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {availableBoxes.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-brand-charcoal mb-2">No Boxes Available</h3>
                <p className="text-gray-500">
                  Check back regularly for new mystery box drops!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Claimed Boxes */}
        <div>
          <h2 className="text-2xl font-bold text-brand-charcoal mb-6">Previously Claimed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {claimedBoxes.map((box) => {
              const TypeIcon = getBoxTypeIcon(box.box_type);
              
              return (
                <Card key={box.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                        <TypeIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-600">{box.name}</CardTitle>
                        <Badge variant="outline">Claimed</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 mb-2">{box.description}</p>
                    <p className="text-sm text-gray-400">
                      Claimed on {format(new Date(), 'MMM d, yyyy')}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {claimedBoxes.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Gift className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No boxes claimed yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
