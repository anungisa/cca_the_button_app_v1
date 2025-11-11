import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle2, XCircle, Clock, ArrowRight, 
  MessageSquare, User, Calendar, Download,
  FileText, Eye, Edit, AlertTriangle
} from 'lucide-react';
import { FormSubmission } from '@/api/entities';

const STATUS_COLORS = {
  draft: 'bg-gray-500',
  submitted: 'bg-blue-500',
  in_review: 'bg-yellow-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
  reopened: 'bg-orange-500',
  archived: 'bg-gray-600'
};

const STATUS_ICONS = {
  draft: Clock,
  submitted: Clock,
  in_review: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
  reopened: ArrowRight,
  archived: FileText
};

export default function FormWorkflowEngine({ submissionId, currentUser, onStatusChange }) {
  const [submission, setSubmission] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSubmission = useCallback(async () => {
    if (!submissionId) {
      setIsLoading(false);
      setError('No submission ID provided');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const submissions = await FormSubmission.filter({ id: submissionId });
      
      if (submissions && submissions.length > 0) {
        const data = submissions[0];
        setSubmission(data);
        setComments(data.comments || []);
      } else {
        setError('Submission not found');
        setSubmission(null);
      }
    } catch (error) {
      console.error('Error loading submission:', error);
      setError(error.message || 'Failed to load submission');
      setSubmission(null);
    } finally {
      setIsLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    loadSubmission();
  }, [loadSubmission]);

  const canUserApprove = useCallback(() => {
    if (!submission || !submission.workflow_state || !currentUser) return false;
    
    const currentStep = submission.workflow_state.current_step || 0;
    const approvalSteps = submission.workflow_state.approvals || [];
    const currentApproval = approvalSteps[currentStep];
    
    return currentApproval && 
           (currentApproval.approver_id === currentUser.id || 
            currentUser.roles?.includes(currentApproval.approver_role));
  }, [submission, currentUser]);

  const handleAction = async (action, comment = '') => {
    if (!submission || !currentUser) return;

    try {
      const updates = {
        status: action,
        workflow_state: {
          ...submission.workflow_state,
          routing_history: [
            ...(submission.workflow_state?.routing_history || []),
            {
              from_user: currentUser.id,
              action: action,
              timestamp: new Date().toISOString(),
              comments: comment
            }
          ]
        }
      };

      if (action === 'approved' && submission.workflow_state?.approval_steps?.length > 0) {
        const currentStep = submission.workflow_state.current_step || 0;
        const approvals = [...(submission.workflow_state.approvals || [])];
        
        approvals[currentStep] = {
          ...(approvals[currentStep] || {}),
          step: currentStep,
          approver_id: currentUser.id,
          approver_name: currentUser.full_name || currentUser.email,
          status: 'approved',
          comments: comment,
          timestamp: new Date().toISOString()
        };

        const nextStep = currentStep + 1;
        if (nextStep < submission.workflow_state.approval_steps.length) {
          updates.status = 'in_review';
          updates.workflow_state.current_step = nextStep;
        } else {
          updates.status = 'approved';
        }

        updates.workflow_state.approvals = approvals;
      }

      if (comment) {
        updates.comments = [
          ...(submission.comments || []),
          {
            author_id: currentUser.id,
            author_name: currentUser.full_name || currentUser.email,
            comment: comment,
            timestamp: new Date().toISOString(),
            is_internal: true
          }
        ];
      }

      await FormSubmission.update(submissionId, updates);
      
      await loadSubmission();
      setNewComment('');
      
      if (onStatusChange && typeof onStatusChange === 'function') {
        onStatusChange(action);
      }
      
    } catch (error) {
      console.error('Error updating submission:', error);
      setError('Failed to update submission: ' + error.message);
    }
  };

  const exportSubmission = async (format) => {
    try {
      const exportData = {
        submission_id: submissionId,
        format: format,
        include_workflow: true,
        include_comments: true
      };
      
      console.log('Exporting submission:', exportData);
      
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  if (error || !submissionId) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
        <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
          {error || 'No Submission Selected'}
        </h3>
        <p className="text-brand-text-secondary">
          {error || 'Please select a submission from the Submissions tab to review it here'}
        </p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center py-8 text-brand-text-secondary">
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Submission not found</p>
      </div>
    );
  }

  const StatusIcon = STATUS_ICONS[submission.status] || FileText;
  const canApprove = canUserApprove();

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <StatusIcon className="w-6 h-6 text-brand-text-primary" />
              <div>
                <CardTitle className="text-xl text-brand-text-primary">{submission.form_title || 'Untitled Form'}</CardTitle>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge className={`${STATUS_COLORS[submission.status] || 'bg-gray-500'} text-white`}>
                    {(submission.status || 'unknown').replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-sm text-brand-text-secondary">
                    Submitted by {submission.submitter_name || 'Unknown'} on {new Date(submission.created_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Select onValueChange={exportSubmission}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Export" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Workflow Progress */}
      {submission.workflow_state?.approval_steps?.length > 0 && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="text-brand-text-primary">Approval Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submission.workflow_state.approval_steps.map((step, index) => {
                const approval = submission.workflow_state.approvals?.find(a => a.step === index);
                const isCurrent = submission.workflow_state.current_step === index;
                const isCompleted = approval?.status === 'approved';
                const isRejected = approval?.status === 'rejected';

                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isRejected ? 'bg-red-500 text-white' :
                      isCurrent ? 'bg-yellow-500 text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> :
                       isRejected ? <XCircle className="w-4 h-4" /> :
                       <span className="text-sm font-bold">{index + 1}</span>}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-brand-text-primary">
                        Step {index + 1}: {step.approver_role || 'Approval Required'}
                      </div>
                      {approval && (
                        <div className="text-sm text-brand-text-secondary">
                          {approval.status} by {approval.approver_name} on {new Date(approval.timestamp).toLocaleDateString()}
                          {approval.comments && <div className="mt-1 italic">"{approval.comments}"</div>}
                        </div>
                      )}
                    </div>
                    {isCurrent && (
                      <Badge variant="outline" className="border-brand-border">Current Step</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions Panel */}
      {canApprove && submission.status === 'in_review' && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="text-brand-text-primary">Review Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-brand-text-primary">Add Comment</label>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your review comments..."
                rows={3}
                className="bg-brand-charcoal border-brand-border text-brand-text-primary"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => handleAction('approved', newComment)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => handleAction('rejected', newComment)}
                className="bg-red-600 hover:bg-red-700"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => handleAction('reopened', newComment)}
                variant="outline"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Request Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Thread */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-text-primary">
            <MessageSquare className="w-5 h-5" />
            Comments & Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-brand-text-secondary py-4">No comments yet</p>
            ) : (
              comments.map((comment, index) => (
                <div key={index} className="border-l-2 border-brand-border pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4" />
                    <span className="font-medium text-sm text-brand-text-primary">{comment.author_name}</span>
                    <span className="text-xs text-brand-text-secondary">
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                    {comment.is_internal && (
                      <Badge variant="outline" className="text-xs border-brand-border">Internal</Badge>
                    )}
                  </div>
                  <p className="text-sm text-brand-text-primary">{comment.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Comment */}
          <div className="mt-6 pt-4 border-t border-brand-border">
            <div className="flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
                className="flex-1 bg-brand-charcoal border-brand-border text-brand-text-primary"
              />
              <Button
                onClick={() => {
                  if (newComment.trim()) {
                    handleAction(submission.status, newComment);
                  }
                }}
                disabled={!newComment.trim()}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}