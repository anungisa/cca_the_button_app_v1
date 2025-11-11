import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AuctionItem } from '@/api/entities';
import { format, formatDistanceToNow } from 'date-fns';
import { Tag, Users, DollarSign, Clock, ExternalLink } from 'lucide-react';

const AuctionStats = ({ items }) => {
  const stats = items.reduce((acc, item) => {
    acc.totalValue += item.current_bid || 0;
    acc.totalBids += item.bid_count || 0;
    if (item.status === 'active') acc.activeItems++;
    return acc;
  }, { totalValue: 0, totalBids: 0, activeItems: 0 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-brand-charcoal border-brand-border">
        <CardContent className="p-4 flex items-center gap-4">
          <DollarSign className="w-8 h-8 text-green-400" />
          <div>
            <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
            <p className="text-sm text-brand-text-secondary">Total Current Bids</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-brand-charcoal border-brand-border">
        <CardContent className="p-4 flex items-center gap-4">
          <Users className="w-8 h-8 text-blue-400" />
          <div>
            <p className="text-2xl font-bold">{stats.totalBids.toLocaleString()}</p>
            <p className="text-sm text-brand-text-secondary">Total Bids Placed</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-brand-charcoal border-brand-border">
        <CardContent className="p-4 flex items-center gap-4">
          <Tag className="w-8 h-8 text-purple-400" />
          <div>
            <p className="text-2xl font-bold">{stats.activeItems}</p>
            <p className="text-sm text-brand-text-secondary">Active Items</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AuctionItemCard = ({ item }) => {
  const statusColors = {
    active: 'bg-green-600',
    closed: 'bg-gray-600',
    sold: 'bg-brand-red',
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <img src={item.image_url || 'https://placehold.co/600x400/1f2937/9ca3af?text=No+Image'} alt={item.item_name} className="rounded-t-lg aspect-[3/2] object-cover" />
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-brand-text-primary leading-tight">{item.item_name}</h3>
          <Badge className={`${statusColors[item.status]} text-white`}>{item.status}</Badge>
        </div>
        <p className="text-sm text-brand-text-secondary line-clamp-2">{item.description}</p>
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-brand-border/50">
          <div className="text-center">
            <p className="text-sm text-brand-text-secondary">Current Bid</p>
            <p className="text-xl font-bold text-green-400">${item.current_bid?.toLocaleString() || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-brand-text-secondary">Bids</p>
            <p className="text-xl font-bold">{item.bid_count || 0}</p>
          </div>
        </div>
        <div className="text-xs text-brand-text-secondary flex items-center justify-center gap-1">
          <Clock className="w-3 h-3" />
          {item.status === 'active' 
            ? `Closes ${formatDistanceToNow(new Date(item.end_date), { addSuffix: true })}`
            : `Closed on ${format(new Date(item.end_date), 'MMM d')}`
          }
        </div>
        <Button variant="outline" className="w-full">
          <ExternalLink className="w-4 h-4 mr-2" />
          View on 32auctions
        </Button>
      </CardContent>
    </Card>
  );
};

export default function AuctionManagementDashboard() {
  const [auctionItems, setAuctionItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuctionData = async () => {
      setIsLoading(true);
      try {
        const items = await AuctionItem.list('-end_date');
        setAuctionItems(items || []);
      } catch (error) {
        console.error("Failed to fetch auction items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuctionData();
  }, []);

  if (isLoading) {
    return <div>Loading auction data...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-brand-text-primary">32auctions Management</h2>
      <AuctionStats items={auctionItems} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {auctionItems.map(item => (
          <AuctionItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}