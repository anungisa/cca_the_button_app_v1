import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BoardMember } from '@/api/entities';
import { Users, Mail, Phone, Calendar, Plus, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const BoardMemberCard = ({ member, onEdit }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'chair': return 'bg-purple-600';
      case 'vice_chair': return 'bg-blue-600';
      case 'treasurer': return 'bg-green-600';
      case 'secretary': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Card className="bg-brand-charcoal border-brand-border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold text-brand-text-primary">{member.name}</CardTitle>
            <Badge className={`${getRoleColor(member.role)} text-white mt-1`}>
              {member.role.replace('_', ' ')}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onEdit(member)}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
          <Mail className="w-4 h-4" />
          <span>{member.email}</span>
        </div>
        {member.contact_info?.phone && (
          <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
            <Phone className="w-4 h-4" />
            <span>{member.contact_info.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
          <Calendar className="w-4 h-4" />
          <span>Term: {new Date(member.term_start).getFullYear()} - {new Date(member.term_end).getFullYear()}</span>
        </div>
        {member.committee_memberships && member.committee_memberships.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {member.committee_memberships.map((committee, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {committee.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const BoardMemberForm = ({ member, onSave, onClose }) => {
  const [formData, setFormData] = useState(member || {
    name: '',
    email: '',
    role: 'director',
    term_start: '',
    term_end: '',
    committee_memberships: []
  });

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-brand-card-bg border-brand-border max-w-md">
        <DialogHeader>
          <DialogTitle>{member ? 'Edit' : 'Add'} Board Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Form fields would go here - simplified for space */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">Save Member</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function BoardCommitteeWorkspace() {
  const [boardMembers, setBoardMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMember, setEditingMember] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const loadBoardMembers = async () => {
      setIsLoading(true);
      try {
        const data = await BoardMember.list();
        setBoardMembers(data);
      } catch (error) {
        console.error('Error loading board members:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBoardMembers();
  }, []);

  const handleSave = async (memberData) => {
    if (editingMember) {
      await BoardMember.update(editingMember.id, memberData);
    } else {
      await BoardMember.create(memberData);
    }
    // Reload data
    const data = await BoardMember.list();
    setBoardMembers(data);
    setEditingMember(null);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingMember(null);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div></div>;
  }

  const executiveMembers = boardMembers.filter(m => ['chair', 'vice_chair', 'treasurer', 'secretary'].includes(m.role));
  const directors = boardMembers.filter(m => m.role === 'director');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-brand-text-primary">Board & Committee Management</h3>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Executive Committee
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {executiveMembers.map((member) => (
              <BoardMemberCard key={member.id} member={member} onEdit={handleEdit} />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Board Directors ({directors.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {directors.map((member) => (
              <BoardMemberCard key={member.id} member={member} onEdit={handleEdit} />
            ))}
          </div>
        </div>
      </div>

      {isFormOpen && (
        <BoardMemberForm
          member={editingMember}
          onSave={handleSave}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}