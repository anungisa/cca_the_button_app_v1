import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from "@/components/hooks/use-toast";

const userTypes = ["fan", "curler", "athlete", "coach", "parent", "volunteer", "donor", "ma_admin", "staff", "hr", "governance", "executive", "devops", "field_staff"];
const systemRoles = ["user", "admin"];
const externalRoles = ["none", "board_member", "sponsor_contact", "club_president", "volunteer_lead"];

export default function UserEditModal({ user, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        user_type: user.user_type || 'fan',
        role: user.role || 'user',
        external_access_role: user.external_access_role || 'none',
        is_active: user.is_active !== false,
      });
    } else {
      // It's an invitation
      setFormData({
        full_name: '',
        email: '',
        user_type: 'fan',
        role: 'user',
        external_access_role: 'none',
        is_active: true,
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (user) {
        // Update existing user
        await User.update(user.id, formData);
        toast({
          title: "User Updated",
          description: `Successfully updated ${formData.full_name}.`,
        });
      } else {
        // Invite new user (This is a mock, real implementation would send an email)
        // For now, we create the user directly
        await User.create(formData);
        toast({
          title: "User Invited",
          description: `An invitation has been simulated for ${formData.email}.`,
        });
      }
      onSave();
    } catch (error) {
      console.error('Failed to save user:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: `Could not save user data. Please try again.`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-brand-card-bg border-brand-border text-brand-text-primary">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Invite New User'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label>Full Name</label>
            <Input name="full_name" value={formData.full_name} onChange={handleInputChange} className="bg-brand-charcoal" />
          </div>
          <div>
            <label>Email</label>
            <Input name="email" type="email" value={formData.email} onChange={handleInputChange} className="bg-brand-charcoal" disabled={!!user} />
          </div>
          <div>
            <label>User Type</label>
            <Select name="user_type" value={formData.user_type} onValueChange={(v) => handleSelectChange('user_type', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {userTypes.map(type => (
                  <SelectItem key={type} value={type} className="capitalize">{type.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label>System Role</label>
            <Select name="role" value={formData.role} onValueChange={(v) => handleSelectChange('role', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {systemRoles.map(role => (
                  <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label>External Access Role</label>
            <Select name="external_access_role" value={formData.external_access_role} onValueChange={(v) => handleSelectChange('external_access_role', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {externalRoles.map(role => (
                  <SelectItem key={role} value={role} className="capitalize">{role.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}