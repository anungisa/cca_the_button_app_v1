import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Reward } from '@/api/entities';
import { Redemption } from '@/api/entities/Redemption';
import { PlusCircle, Edit, Trash2, Gift, Users, TrendingUp } from 'lucide-react';

const CreateRewardModal = ({ onRewardCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'merch',
    points_cost: '',
    tier_requirement: 'granite_rookie',
    stock_available: '',
    image_url: '',
    sponsor_name: '',
    expiry_date: ''
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const rewardData = {
        ...formData,
        points_cost: parseInt(formData.points_cost),
        stock_available: formData.stock_available ? parseInt(formData.stock_available) : null
      };
      await Reward.create(rewardData);
      onRewardCreated();
      setIsOpen(false);
      setFormData({
        name: '', description: '', category: 'merch', points_cost: '',
        tier_requirement: 'granite_rookie', stock_available: '', image_url: '',
        sponsor_name: '', expiry_date: ''
      });
    } catch (error) {
      console.error('Failed to create reward:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="w-4 h-4 mr-2" />Create Reward</Button>
      </DialogTrigger>
      <DialogContent className="bg-brand-card-bg border-brand-border max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Reward</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Reward Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input
              placeholder="Points Cost"
              type="number"
              value={formData.points_cost}
              onChange={(e) => setFormData({...formData, points_cost: e.target.value})}
              required
            />
          </div>
          
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="merch">Merchandise</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
                <SelectItem value="discount">Discount</SelectItem>
                <SelectItem value="exclusive">Exclusive</SelectItem>
                <SelectItem value="auction">Auction</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={formData.tier_requirement} onValueChange={(val) => setFormData({...formData, tier_requirement: val})}>
              <SelectTrigger>
                <SelectValue placeholder="Tier Requirement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="granite_rookie">All Tiers</SelectItem>
                <SelectItem value="sheet_star">Sheet Star+</SelectItem>
                <SelectItem value="house_hero">House Hero+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Stock Available (leave blank for unlimited)"
              type="number"
              value={formData.stock_available}
              onChange={(e) => setFormData({...formData, stock_available: e.target.value})}
            />
            <Input
              placeholder="Sponsor Name (optional)"
              value={formData.sponsor_name}
              onChange={(e) => setFormData({...formData, sponsor_name: e.target.value})}
            />
          </div>
          
          <Input
            placeholder="Image URL"
            value={formData.image_url}
            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
          />
          
          <Input
            placeholder="Expiry Date (optional)"
            type="date"
            value={formData.expiry_date}
            onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Reward'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const RewardsTable = ({ rewards, onRefresh }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Points Cost</TableHead>
        <TableHead>Stock</TableHead>
        <TableHead>Tier</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {rewards.map(reward => (
        <TableRow key={reward.id}>
          <TableCell className="font-medium">{reward.name}</TableCell>
          <TableCell>
            <Badge variant="outline">{reward.category}</Badge>
          </TableCell>
          <TableCell>{reward.points_cost} pts</TableCell>
          <TableCell>
            {reward.stock_available === null ? 'Unlimited' : 
             `${reward.stock_available - (reward.stock_claimed || 0)} / ${reward.stock_available}`}
          </TableCell>
          <TableCell>{reward.tier_requirement.replace('_', ' ')}</TableCell>
          <TableCell>
            <Badge variant={reward.is_active ? 'default' : 'secondary'}>
              {reward.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </TableCell>
          <TableCell>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const RedemptionsTable = ({ redemptions }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>User</TableHead>
        <TableHead>Reward</TableHead>
        <TableHead>Points Cost</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {redemptions.map(redemption => (
        <TableRow key={redemption.id}>
          <TableCell>{redemption.user_id}</TableCell>
          <TableCell>{redemption.reward_name}</TableCell>
          <TableCell>{redemption.points_cost} pts</TableCell>
          <TableCell>
            <Badge variant={
              redemption.status === 'completed' ? 'default' :
              redemption.status === 'shipped' ? 'default' :
              redemption.status === 'denied' ? 'destructive' : 'secondary'
            }>
              {redemption.status}
            </Badge>
          </TableCell>
          <TableCell>{new Date(redemption.created_date).toLocaleDateString()}</TableCell>
          <TableCell>
            <Button variant="outline" size="sm">Fulfill</Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default function RewardManagementHub() {
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [stats, setStats] = useState({ totalRewards: 0, activeRewards: 0, pendingRedemptions: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [rewardsData, redemptionsData] = await Promise.all([
        Reward.list('-created_date'),
        Redemption.list('-created_date', 50)
      ]);
      
      setRewards(rewardsData || []);
      setRedemptions(redemptionsData || []);
      
      setStats({
        totalRewards: rewardsData?.length || 0,
        activeRewards: rewardsData?.filter(r => r.is_active)?.length || 0,
        pendingRedemptions: redemptionsData?.filter(r => r.status === 'pending_fulfillment')?.length || 0
      });
    } catch (error) {
      console.error('Failed to fetch reward data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Reward Management</h1>
          <p className="text-brand-text-secondary">Manage the Granite Circle reward store and redemptions</p>
        </div>
        <CreateRewardModal onRewardCreated={fetchData} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Total Rewards</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.totalRewards}</p>
              </div>
              <Gift className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Active Rewards</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.activeRewards}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Pending Fulfillment</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.pendingRedemptions}</p>
              </div>
              <Users className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="rewards" className="w-full">
        <TabsList>
          <TabsTrigger value="rewards">Rewards Catalog</TabsTrigger>
          <TabsTrigger value="redemptions">Redemptions Queue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rewards" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Rewards Catalog</CardTitle>
            </CardHeader>
            <CardContent>
              <RewardsTable rewards={rewards} onRefresh={fetchData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="redemptions" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Redemptions Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <RedemptionsTable redemptions={redemptions} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}