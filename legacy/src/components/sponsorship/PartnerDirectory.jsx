import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { canadianProvincesAndTerritories } from '../utils/provinces';

const generateSampleContracts = () => {
    const nationalSponsors = [
        { id: 'c-nat-1', sponsor_name: 'Tim Hortons', deal_id: 'd-nat-1', status: 'active', docusign_status: 'completed', contact_email: 'legal@timhortons.ca', ma_region: null },
        { id: 'c-nat-2', sponsor_name: 'PointsBet', deal_id: 'd-nat-2', status: 'active', docusign_status: 'draft', contact_email: 'contracts@pointsbet.com', ma_region: null },
    ];
    const regionalSponsors = canadianProvincesAndTerritories.map(p => ({
        id: `c-${p.abbreviation}-1`,
        sponsor_name: `${p.name} Regional Bank`,
        deal_id: `d-${p.abbreviation}-1`,
        status: 'active',
        docusign_status: 'draft',
        contact_email: `regional@bank.${p.abbreviation.toLowerCase()}.ca`,
        ma_region: p.abbreviation
    }));
    return [...nationalSponsors, ...regionalSponsors];
};

export default function PartnerDirectory({ selectedRegion }) {
  const [contracts, setContracts] = useState([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch from SponsorContract entity
    setContracts(generateSampleContracts());
  }, []);

  const filteredContracts = useMemo(() => {
    if (selectedRegion === 'all') return contracts;
    return contracts.filter(c => !c.ma_region || c.ma_region === selectedRegion);
  }, [selectedRegion, contracts]);

  const handleSendForSignature = async (contract) => {
    setIsSending(true);
    try {
      // Simulate DocuSign API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update contract status
      setContracts(prev => prev.map(c => 
        c.id === contract.id ? { ...c, docusign_status: 'sent' } : c
      ));
    } catch (error) {
      console.error('Failed to send for signature:', error);
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      draft: { color: 'bg-gray-500', text: 'Draft' },
      sent: { color: 'bg-blue-500', text: 'Sent' },
      completed: { color: 'bg-green-600', text: 'Completed' },
      voided: { color: 'bg-red-600', text: 'Voided' }
    };
    const { color, text } = config[status] || config.draft;
    return <Badge className={`${color} text-white`}>{text}</Badge>;
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Partner Contracts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredContracts.map(contract => (
            <div key={contract.id} className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
              <div>
                <p className="font-semibold text-brand-text-primary">{contract.sponsor_name}</p>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-brand-text-secondary">Status: {contract.status}</p>
                    <Badge variant="outline">{contract.ma_region || 'National'}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-brand-text-secondary mb-1">DocuSign Status</span>
                  {getStatusBadge(contract.docusign_status)}
                </div>
                {contract.docusign_status === 'draft' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleSendForSignature(contract)}
                    disabled={isSending}
                  >
                    {isSending ? 'Sending...' : 'Send with DocuSign'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}