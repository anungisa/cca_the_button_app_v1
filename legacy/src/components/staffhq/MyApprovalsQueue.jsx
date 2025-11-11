import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Inbox, Eye } from 'lucide-react';
import { User, DocumentApproval, MarketingCampaign, ComplianceItem } from '@/api/entities';
import ApprovalModal from './ApprovalModal';

const APPROVAL_CONFIG = {
  document: {
    entity: DocumentApproval,
    titleField: 'document_title',
    typeField: 'document_type',
    statusField: 'workflow_stage',
    pendingStatus: ['legal_review', 'executive_review', 'board_approval'],
  },
  marketing: {
    entity: MarketingCampaign,
    titleField: 'campaign_name',
    typeField: 'campaign_type',
    statusField: 'status',
    pendingStatus: ['review'],
  },
  compliance: {
    entity: ComplianceItem,
    titleField: 'title',
    typeField: 'compliance_type',
    statusField: 'status',
    pendingStatus: ['escalated'],
  },
};

export default function MyApprovalsQueue() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (e) {
        console.error("User not found for approvals");
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (user) {
      loadApprovals();
    }
  }, [user]);

  const loadApprovals = async () => {
    setIsLoading(true);
    let allApprovals = [];

    // This is a simplified fetch. A real system might have a dedicated endpoint.
    // We assume for now that approvals are implicitly assigned to roles/users.
    for (const key in APPROVAL_CONFIG) {
      const config = APPROVAL_CONFIG[key];
      try {
        const results = await config.entity.filter(
          (record) => config.pendingStatus.includes(record[config.statusField])
        );
        
        results.forEach(res => {
          allApprovals.push({
            id: res.id,
            title: res[config.titleField],
            type: res[config.typeField],
            status: res[config.statusField],
            entityType: key,
            data: res
          });
        });
      } catch (error) {
        console.error(`Error fetching approvals for ${key}:`, error);
      }
    }
    
    setItems(allApprovals);
    setIsLoading(false);
  };
  
  const handleApprovalComplete = () => {
    setSelectedItem(null);
    loadApprovals(); // Refresh the list
  }

  const getStatusBadge = (status) => {
    const normalizedStatus = status.replace(/_/g, ' ').toLowerCase();
    if (normalizedStatus.includes('review')) {
      return <Badge className="bg-yellow-600 text-white capitalize">Needs Review</Badge>;
    }
    if (normalizedStatus.includes('approval')) {
      return <Badge className="bg-blue-600 text-white capitalize">Needs Approval</Badge>;
    }
    return <Badge className="bg-orange-600 text-white capitalize">{normalizedStatus}</Badge>;
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border h-full">
      <CardHeader>
        <CardTitle>My Approval Queue</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-brand-text-secondary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-brand-text-secondary">
            <Inbox className="w-12 h-12 mx-auto mb-4" />
            <p className="font-medium">All clear!</p>
            <p className="text-sm">You have no pending approvals.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={`${item.entityType}-${item.id}`} className="bg-brand-charcoal p-3 rounded-lg flex items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-brand-text-primary">{item.title}</p>
                  <p className="text-xs text-brand-text-secondary capitalize">{item.entityType}: {item.type.replace(/_/g, ' ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(item.status)}
                  <Button size="sm" variant="outline" onClick={() => setSelectedItem(item)}>
                    <Eye className="w-4 h-4 mr-1 md:mr-2" />
                    <span className="hidden md:inline">Review</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {selectedItem && (
        <ApprovalModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onComplete={handleApprovalComplete}
        />
      )}
    </Card>
  );
}