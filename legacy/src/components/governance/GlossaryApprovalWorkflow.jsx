import React, { useState, useEffect } from 'react';
import { BusinessGlossaryTerm } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle, XCircle, Clock, Eye, MessageSquare,
  AlertTriangle, GitBranch, User as UserIcon, ArrowRight
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function GlossaryApprovalWorkflow({ term, onStatusChange }) {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [reviewComment, setReviewComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleApprove = async () => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User not authenticated."
      });
      return;
    }

    setIsProcessing(true);
    try {
      const updatedTerm = {
        status: 'approved',
        approved_by: currentUser.id,
        approval_date: new Date().toISOString(),
        change_history: [
          ...(term.change_history || []),
          {
            version: term.version,
            change_date: new Date().toISOString(),
            changed_by: currentUser.id,
            change_description: `Approved by ${currentUser.full_name}${reviewComment ? ': ' + reviewComment : ''}`,
            previous_definition: term.definition
          }
        ]
      };

      await BusinessGlossaryTerm.update(term.id, updatedTerm);
      
      toast({
        title: "Term Approved",
        description: `"${term.term_name}" is now approved and available organization-wide.`
      });
      
      if (onStatusChange) onStatusChange('approved');
    } catch (error) {
      console.error('Error approving term:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve glossary term."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!reviewComment.trim()) {
      toast({
        variant: "destructive",
        title: "Comment Required",
        description: "Please provide feedback for requested changes."
      });
      return;
    }

    setIsProcessing(true);
    try {
      const updatedTerm = {
        status: 'draft',
        change_history: [
          ...(term.change_history || []),
          {
            version: term.version,
            change_date: new Date().toISOString(),
            changed_by: currentUser.id,
            change_description: `Changes requested by ${currentUser.full_name}: ${reviewComment}`,
            previous_definition: term.definition
          }
        ]
      };

      await BusinessGlossaryTerm.update(term.id, updatedTerm);
      
      toast({
        title: "Changes Requested",
        description: "Term returned to draft for revision."
      });
      
      if (onStatusChange) onStatusChange('draft');
    } catch (error) {
      console.error('Error requesting changes:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to request changes."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!reviewComment.trim()) {
      toast({
        variant: "destructive",
        title: "Comment Required",
        description: "Please provide a reason for rejection."
      });
      return;
    }

    if (!confirm(`Are you sure you want to reject "${term.term_name}"?`)) return;

    setIsProcessing(true);
    try {
      const updatedTerm = {
        status: 'deprecated',
        change_history: [
          ...(term.change_history || []),
          {
            version: term.version,
            change_date: new Date().toISOString(),
            changed_by: currentUser.id,
            change_description: `Rejected by ${currentUser.full_name}: ${reviewComment}`,
            previous_definition: term.definition
          }
        ]
      };

      await BusinessGlossaryTerm.update(term.id, updatedTerm);
      
      toast({
        title: "Term Rejected",
        description: "Term has been marked as deprecated."
      });
      
      if (onStatusChange) onStatusChange('deprecated');
    } catch (error) {
      console.error('Error rejecting term:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject term."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const canApprove = currentUser && (
    currentUser.role === 'admin' ||
    currentUser.user_type === 'governance' ||
    currentUser.user_type === 'executive'
  );

  if (term.status === 'approved') {
    return (
      <Alert className="border-green-500/50 bg-green-500/10">
        <CheckCircle className="h-4 w-4 text-green-400" />
        <AlertDescription className="text-brand-text-secondary">
          <strong>Approved</strong> by {term.approved_by} on {new Date(term.approval_date).toLocaleDateString()}
        </AlertDescription>
      </Alert>
    );
  }

  if (term.status === 'deprecated') {
    return (
      <Alert className="border-red-500/50 bg-red-500/10">
        <XCircle className="h-4 w-4 text-red-400" />
        <AlertDescription className="text-brand-text-secondary">
          <strong>Deprecated:</strong> This term is no longer in use.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-purple-400" />
          Approval Workflow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <Clock className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-brand-text-secondary">
            <strong>Status: {term.status === 'review' ? 'Pending Review' : 'Draft'}</strong>
            <br />
            {term.status === 'review' 
              ? 'This term is awaiting approval from a data steward or governance lead.'
              : 'Submit this term for review when ready.'}
          </AlertDescription>
        </Alert>

        {canApprove && term.status === 'review' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-brand-text-primary mb-2 block">
                Review Comments (Optional)
              </label>
              <Textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Add comments about this approval, request changes, or provide feedback..."
                className="h-24"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleApprove}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700 flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={handleRequestChanges}
                disabled={isProcessing}
                variant="outline"
                className="flex-1"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Request Changes
              </Button>
              <Button
                onClick={handleReject}
                disabled={isProcessing}
                variant="outline"
                className="text-red-400 hover:text-red-300"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        )}

        {!canApprove && term.status === 'review' && (
          <Alert className="border-blue-500/50 bg-blue-500/10">
            <Eye className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-brand-text-secondary">
              This term is under review. Only data stewards and governance leads can approve.
            </AlertDescription>
          </Alert>
        )}

        {term.status === 'draft' && (
          <Button
            onClick={async () => {
              await BusinessGlossaryTerm.update(term.id, { status: 'review' });
              toast({ title: "Submitted for Review", description: "Term sent for approval." });
              if (onStatusChange) onStatusChange('review');
            }}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Submit for Review
          </Button>
        )}
      </CardContent>
    </Card>
  );
}