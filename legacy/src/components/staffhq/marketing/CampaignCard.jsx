import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Users, Target, Calendar } from 'lucide-react';

const CampaignCard = ({ campaign, onEdit }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'published': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const budgetProgress = campaign.budget_allocated > 0 ? (campaign.budget_spent / campaign.budget_allocated) * 100 : 0;

  return (
    <Card className="bg-brand-card-bg border-brand-border flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-brand-text-primary">{campaign.campaign_name}</CardTitle>
          <Badge className={`${getStatusColor(campaign.status)} text-white`}>{campaign.status}</Badge>
        </div>
        <p className="text-sm text-brand-text-secondary">{campaign.campaign_type.replace(/_/g, ' ')}</p>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-center text-sm text-brand-text-secondary">
          <Target className="w-4 h-4 mr-2" />
          <span>{campaign.target_audience.join(', ')}</span>
        </div>
        <div className="flex items-center text-sm text-brand-text-secondary">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Target Date: {new Date(campaign.target_date).toLocaleDateString()}</span>
        </div>
        <div>
          <p className="text-sm text-brand-text-secondary mb-1">Budget: ${campaign.budget_spent.toLocaleString()} / ${campaign.budget_allocated.toLocaleString()}</p>
          <Progress value={budgetProgress} />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => onEdit(campaign)}>View & Edit</Button>
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;