import React, { useState, useEffect } from 'react';
import { MarketingCampaign } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import CreateCampaignModal from './CreateCampaignModal';
import CampaignCard from './CampaignCard';

export default function CampaignManager() {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const loadCampaigns = async () => {
    setIsLoading(true);
    try {
      const data = await MarketingCampaign.list('-target_date');
      setCampaigns(data);
    } catch (e) {
      console.error("Failed to load campaigns", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleSave = async (data) => {
    if (editingCampaign) {
      await MarketingCampaign.update(editingCampaign.id, data);
    } else {
      await MarketingCampaign.create(data);
    }
    await loadCampaigns();
    setIsModalOpen(false);
    setEditingCampaign(null);
  };
  
  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCampaign(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-brand-text-primary">Marketing Campaigns</h3>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(campaign => (
          <CampaignCard key={campaign.id} campaign={campaign} onEdit={handleEdit} />
        ))}
      </div>

      {isModalOpen && (
        <CreateCampaignModal
          campaign={editingCampaign}
          onSave={handleSave}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCampaign(null);
          }}
        />
      )}
    </div>
  );
}