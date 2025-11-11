import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ArrowRight } from 'lucide-react';
import { canadianProvincesAndTerritories } from '../utils/provinces';

const DealCard = ({ deal, onMoveStage }) => {
  return (
    <div className="p-3 mb-3 bg-brand-charcoal rounded-lg shadow">
      <div className="font-semibold text-brand-text-primary">{deal.deal_name}</div>
      <div className="text-sm text-brand-text-secondary">{deal.company_name}</div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center text-green-400">
          <DollarSign className="w-4 h-4 mr-1" />
          <span className="text-sm font-bold">${deal.deal_value.toLocaleString()}</span>
        </div>
        <Badge variant="outline">{deal.ma_region || 'National'}</Badge>
      </div>
    </div>
  );
};

const PipelineColumn = ({ stage, deals, title }) => {
  const totalValue = deals.reduce((sum, deal) => sum + deal.deal_value, 0);

  return (
    <div className="flex-1 p-3 rounded-lg bg-brand-card-bg border border-brand-border">
      <h3 className="font-semibold text-lg mb-2 capitalize text-brand-text-primary">{title}</h3>
      <div className="text-sm text-brand-text-secondary font-bold mb-4">${totalValue.toLocaleString()}</div>
      <div className="min-h-[200px]">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
        {deals.length === 0 && (
          <div className="text-center text-brand-text-secondary py-8 text-sm">
            No deals in this stage
          </div>
        )}
      </div>
    </div>
  );
};

const generateSampleDeals = () => {
    const stages = ["prospect", "proposal_sent", "negotiation", "contracted", "lost"];
    let deals = [];
    canadianProvincesAndTerritories.forEach(p => {
        for(let i = 0; i < 3; i++) {
            deals.push({
                id: `deal-${p.abbreviation}-${i}`,
                deal_name: `Partnership ${p.abbreviation} ${i+1}`,
                company_name: `Local Corp ${i+1}`,
                deal_value: Math.floor(Math.random() * 80000) + 20000,
                stage: stages[Math.floor(Math.random() * stages.length)],
                ma_region: p.abbreviation
            });
        }
    });
    deals.push({ 
      id: 'deal-nat-1', 
      deal_name: 'National Broadcast Partner', 
      company_name: 'National Media Inc.', 
      deal_value: 500000, 
      stage: 'negotiation', 
      ma_region: null 
    });
    return deals;
}

export default function PipelineBoard({ selectedRegion }) {
  const [deals, setDeals] = useState([]);
  
  useEffect(() => {
    // In real app, fetch deals from SponsorDeal entity
    setDeals(generateSampleDeals());
  }, []);

  const filteredDeals = useMemo(() => {
    if (selectedRegion === 'all') return deals;
    return deals.filter(d => !d.ma_region || d.ma_region === selectedRegion);
  }, [selectedRegion, deals]);

  const stages = [
    { key: "prospect", title: "Prospects" },
    { key: "proposal_sent", title: "Proposal Sent" },
    { key: "negotiation", title: "Negotiation" },
    { key: "contracted", title: "Contracted" },
    { key: "lost", title: "Lost" }
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => (
        <PipelineColumn
          key={stage.key}
          stage={stage.key}
          title={stage.title}
          deals={filteredDeals.filter((deal) => deal.stage === stage.key)}
        />
      ))}
    </div>
  );
}