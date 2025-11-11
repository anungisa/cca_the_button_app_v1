import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { DocumentApproval, MarketingCampaign, ComplianceItem } from '@/api/entities';
import { NotificationService } from '../utils/NotificationService';

export default function ApprovalModal({ item, isOpen, onClose, onComplete }) {
  const [decision, setDecision] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApproval = async (approved) => {
    setIsSubmitting(true);
    try {
      await processApproval(item, approved, comments);
      onComplete();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error processing approval:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const processApproval = async (item, approved, comments) => {
    const APPROVAL_CONFIG = {
      document: DocumentApproval,
      marketing: MarketingCampaign,
      compliance: ComplianceItem
    };

    const entity = APPROVAL_CONFIG[item.entityType];
    if (!entity) return;

    let updateData = {};
    let notificationData = {
      title: '',
      message: '',
      notification_type: approved ? 'approval_request' : 'general_announcement'
    };

    switch (item.entityType) {
      case 'document':
        updateData = {
          workflow_stage: approved ? getNextStage(item.status) : 'revision_requested'
        };
        if (item.data.submitted_by) {
          notificationData = {
            user_id: item.data.submitted_by,
            title: `Document ${approved ? 'Approved' : 'Needs Revision'}`,
            message: `${item.title}: ${approved ? 'Approved and moved to next stage' : 'Requires revision'}`,
            link_to: 'GovernanceComplianceHub'
          };
        }
        break;
        
      case 'marketing':
        updateData = {
          status: approved ? 'approved' : 'revision_required'
        };
        if (item.data.assigned_to) {
          notificationData = {
            user_id: item.data.assigned_to,
            title: `Campaign ${approved ? 'Approved' : 'Needs Revision'}`,
            message: `${item.title}: ${approved ? 'Approved for execution' : 'Please revise and resubmit'}`,
            link_to: 'MarketingCenter'
          };
        }
        break;
        
      case 'compliance':
        updateData = {
          status: approved ? 'resolved' : 'in_progress'
        };
        if (item.data.assigned_to) {
          notificationData = {
            user_id: item.data.assigned_to,
            title: `Compliance Item ${approved ? 'Resolved' : 'Needs Action'}`,
            message: `${item.title}: ${approved ? 'Marked as resolved' : 'Requires additional action'}`,
            link_to: 'GovernanceComplianceHub'
          };
        }
        break;
    }

    // Add comments to update data
    if (comments) {
      updateData.approval_comments = comments;
    }

    await entity.update(item.id, updateData);

    // Send notification
    if (notificationData.user_id) {
      await NotificationService.send(notificationData);
    }
  };

  const getNextStage = (currentStage) => {
    const stageFlow = {
      'legal_review': 'executive_review',
      'executive_review': 'board_approval',
      'board_approval': 'final_signatures'
    };
    return stageFlow[currentStage] || 'completed';
  };

  const resetForm = () => {
    setDecision('');
    setComments('');
  };

  const getTypeIcon = (entityType) => {
    switch (entityType) {
      case 'document': return <CheckCircle className="w-5 h-5 text-blue-400" />;
      case 'marketing': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'compliance': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <CheckCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-brand-card-bg border-brand-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTypeIcon(item.entityType)}
            Approval Required
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-brand-charcoal p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-brand-text-primary">{item.title}</h3>
              <Badge className="capitalize">{item.type.replace('_', ' ')}</Badge>
            </div>
            <p className="text-sm text-brand-text-secondary mb-2">
              Status: <span className="capitalize">{item.status.replace('_', ' ')}</span>
            </p>
            
            {/* Show relevant details based on item type */}
            {item.entityType === 'document' && item.data.document_url && (
              <Button variant="outline" size="sm" asChild className="mt-2">
                <a href={item.data.document_url} target="_blank" rel="noopener noreferrer">
                  View Document
                </a>
              </Button>
            )}
            
            {item.entityType === 'marketing' && (
              <div className="mt-2 text-sm text-brand-text-secondary">
                <p>Target Date: {item.data.target_date}</p>
                <p>Assigned To: {item.data.assigned_name}</p>
                {item.data.budget_allocated > 0 && (
                  <p>Budget: ${item.data.budget_allocated.toLocaleString()}</p>
                )}
              </div>
            )}
            
            {item.entityType === 'compliance' && (
              <div className="mt-2 text-sm text-brand-text-secondary">
                <p>Due Date: {item.data.due_date}</p>
                <p>Risk Level: <span className="capitalize">{item.data.risk_level}</span></p>
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="comments">Comments (Optional)</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add any feedback or instructions..."
              rows={3}
              className="bg-brand-charcoal border-brand-border mt-1"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => handleApproval(false)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Request Revision'}
          </Button>
          <Button 
            onClick={() => handleApproval(true)}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? 'Processing...' : 'Approve'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}