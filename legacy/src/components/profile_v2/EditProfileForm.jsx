import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import HomeClubSelector from '../HomeClubSelector';

// Reusable FormField component for consistency within this form
const FormField = ({ label, children, error }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-brand-text-secondary">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const EditProfileForm = ({ editForm, setEditForm, errors = {} }) => {
  const handleInputChange = (field) => (e) => {
    setEditForm(prev => ({ ...prev, [field]: e.target.value }));
  };
  
  const handleSelectChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Full Name" error={errors.full_name}>
          <Input 
            value={editForm.full_name || ''} 
            onChange={handleInputChange('full_name')}
            className="bg-brand-charcoal"
            aria-invalid={!!errors.full_name}
          />
        </FormField>
        <FormField label="Phone Number" error={errors.phone}>
          <Input 
            value={editForm.phone || ''}
            onChange={handleInputChange('phone')}
            placeholder="+1 (555) 555-5555"
            className="bg-brand-charcoal"
            aria-invalid={!!errors.phone}
          />
        </FormField>
      </div>

      <FormField label="Select Your Home Club">
        <HomeClubSelector
          selectedClubId={editForm.home_club_id}
          onSelectClub={(club) => {
            handleSelectChange('home_club_id', club.id);
            handleSelectChange('home_club_name', club.name);
          }}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Preferred Position">
          <Select value={editForm.preferred_position || ''} onValueChange={(value) => handleSelectChange('preferred_position', value)}>
            <SelectTrigger className="bg-brand-charcoal"><SelectValue placeholder="Select position..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="second">Second</SelectItem>
              <SelectItem value="third">Third</SelectItem>
              <SelectItem value="skip">Skip</SelectItem>
              <SelectItem value="alternate">Alternate</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Skill Level">
          <Select value={editForm.skill_level || ''} onValueChange={(value) => handleSelectChange('skill_level', value)}>
            <SelectTrigger className="bg-brand-charcoal"><SelectValue placeholder="Select skill level..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="competitive">Competitive</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>
    </div>
  );
};

export default EditProfileForm;