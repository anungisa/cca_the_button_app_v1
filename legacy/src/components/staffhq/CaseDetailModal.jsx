import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Case } from '@/api/entities';
import { useXP } from '../XPContext';

const statusColors = {
  new: 'bg-blue-500',
  open: 'bg-green-500',
  in_progress: 'bg-yellow-500',
  on_hold: 'bg-gray-500',
  escalated: 'bg-orange-500',
  resolved: 'bg-purple-600',
  archived: 'bg-gray-700',
};

export default function CaseDetailModal({ caseItem, staffList, isOpen, onClose, onUpdate }) {
  const { user } = useXP();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedCase, setUpdatedCase] = useState(caseItem);
  const [newComment, setNewComment] = useState('');

  React.useEffect(() => {
    setUpdatedCase(caseItem);
    setIsEditing(false); // Reset editing state when case changes
  }, [caseItem]);

  if (!caseItem) return null;

  const handleUpdate = async () => {
    try {
      let dataToUpdate = {
        status: updatedCase.status,
        priority: updatedCase.priority,
        assigned_staff_id: updatedCase.assigned_staff_id,
        assigned_staff_name: updatedCase.assigned_staff_name,
      };

      // Add new comment to log if it exists
      if (newComment.trim()) {
        const communicationLog = [
          ...(caseItem.communications_log || []), 
          {
            date: new Date().toISOString(),
            author: user.full_name,
            note: newComment,
            channel: 'system'
          }
        ];
        dataToUpdate.communications_log = communicationLog;
      }
      
      await Case.update(caseItem.id, dataToUpdate);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to update case:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-brand-card-bg border-brand-border text-brand-text-primary max-w-2xl">
        <DialogHeader>
          <DialogTitle>{caseItem.case_title}</DialogTitle>
          <DialogDescription>
            Case #{caseItem.id?.slice(0, 8)} • Created: {new Date(caseItem.created_date).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
          {/* Case Details */}
        </div>
        <div className="flex justify-end pt-4 border-t border-brand-border">
          <Button onClick={handleUpdate} className="bg-brand-red hover:bg-red-700">Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}