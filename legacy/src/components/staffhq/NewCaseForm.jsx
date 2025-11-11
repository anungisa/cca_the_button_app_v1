import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Case } from '@/api/entities';
import { useXP } from '../XPContext';

export default function NewCaseForm({ staffList, onSuccess }) {
  const { user } = useXP();
  const [formData, setFormData] = useState({
    case_title: '',
    case_type: 'general_feedback',
    priority: 'medium',
    status: 'new',
    description: '',
    assigned_staff_id: '',
    assigned_staff_name: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAssigneeChange = (staffId) => {
    const selectedStaff = staffList.find(s => s.id === staffId);
    setFormData(prev => ({
      ...prev,
      assigned_staff_id: staffId,
      assigned_staff_name: selectedStaff?.full_name || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await Case.create({
        ...formData,
        created_by: user?.email, // Ensure created_by is set
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to create case:", error);
      alert("Error creating case. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div>
        <label className="text-sm font-medium text-brand-text-primary">Title</label>
        <Input name="case_title" value={formData.case_title} onChange={handleInputChange} required className="mt-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-brand-text-primary">Type</label>
          <Select name="case_type" value={formData.case_type} onValueChange={(v) => handleSelectChange('case_type', v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pledge_follow_up">Pledge Follow-up</SelectItem>
              <SelectItem value="club_support">Club Support</SelectItem>
              <SelectItem value="ma_inquiry">MA Inquiry</SelectItem>
              <SelectItem value="technical_issue">Technical Issue</SelectItem>
              <SelectItem value="general_feedback">General Feedback</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-brand-text-primary">Priority</label>
          <Select name="priority" value={formData.priority} onValueChange={(v) => handleSelectChange('priority', v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium text-brand-text-primary">Assign To</label>
        <Select value={formData.assigned_staff_id} onValueChange={handleAssigneeChange}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="Unassigned" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>Unassigned</SelectItem>
            {staffList.map(staff => (
              <SelectItem key={staff.id} value={staff.id}>{staff.full_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-brand-text-primary">Description</label>
        <Textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="mt-1" />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>Cancel</Button>
        <Button type="submit" disabled={isLoading} className="bg-brand-red hover:bg-red-700">
          {isLoading ? 'Creating...' : 'Create Case'}
        </Button>
      </div>
    </form>
  );
}