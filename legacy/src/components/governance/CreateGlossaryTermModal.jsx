import React, { useState, useEffect } from 'react';
import { BusinessGlossaryTerm } from '@/api/entities';
import { User } from '@/api/entities';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '../hooks/use-toast';
import { Loader2, Plus, X } from 'lucide-react';

export default function CreateGlossaryTermModal({ isOpen, onClose, existingTerm = null }) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    term_name: '',
    definition: '',
    category: 'membership',
    aliases: [],
    related_terms: [],
    data_sources: [],
    business_rules: [],
    examples: [],
    owner_department: 'operations',
    status: 'draft'
  });
  const [aliasInput, setAliasInput] = useState('');
  const [exampleInput, setExampleInput] = useState('');
  const [ruleInput, setRuleInput] = useState('');

  useEffect(() => {
    loadCurrentUser();
    if (existingTerm) {
      setFormData(existingTerm);
    }
  }, [existingTerm]);

  const loadCurrentUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleAddAlias = () => {
    if (aliasInput.trim()) {
      setFormData({
        ...formData,
        aliases: [...(formData.aliases || []), aliasInput.trim()]
      });
      setAliasInput('');
    }
  };

  const handleRemoveAlias = (index) => {
    setFormData({
      ...formData,
      aliases: formData.aliases.filter((_, i) => i !== index)
    });
  };

  const handleAddExample = () => {
    if (exampleInput.trim()) {
      setFormData({
        ...formData,
        examples: [...(formData.examples || []), exampleInput.trim()]
      });
      setExampleInput('');
    }
  };

  const handleRemoveExample = (index) => {
    setFormData({
      ...formData,
      examples: formData.examples.filter((_, i) => i !== index)
    });
  };

  const handleAddRule = () => {
    if (ruleInput.trim()) {
      setFormData({
        ...formData,
        business_rules: [...(formData.business_rules || []), ruleInput.trim()]
      });
      setRuleInput('');
    }
  };

  const handleRemoveRule = (index) => {
    setFormData({
      ...formData,
      business_rules: formData.business_rules.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async () => {
    if (!formData.term_name || !formData.definition) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Term name and definition are required."
      });
      return;
    }

    setIsSaving(true);
    try {
      const dataToSave = {
        ...formData,
        owner_user_id: currentUser?.id
      };

      if (existingTerm) {
        await BusinessGlossaryTerm.update(existingTerm.id, dataToSave);
        toast({
          title: "Term Updated",
          description: `"${formData.term_name}" has been updated.`
        });
      } else {
        await BusinessGlossaryTerm.create(dataToSave);
        toast({
          title: "Term Created",
          description: `"${formData.term_name}" has been added to the glossary.`
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving term:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save glossary term."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-brand-card-bg border-brand-border">
        <DialogHeader>
          <DialogTitle>
            {existingTerm ? 'Edit' : 'Add'} Business Glossary Term
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="term_name">Term Name *</Label>
              <Input
                id="term_name"
                value={formData.term_name}
                onChange={(e) => setFormData({...formData, term_name: e.target.value})}
                placeholder="e.g., Active Member"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="membership">Membership</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="high_performance">High Performance</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="governance">Governance</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="owner_department">Owner Department *</Label>
              <Select
                value={formData.owner_department}
                onValueChange={(value) => setFormData({...formData, owner_department: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive">Executive</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="hp">High Performance</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="safe_sport">Safe Sport</SelectItem>
                  <SelectItem value="club_services">Club Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="definition">Official Definition *</Label>
              <Textarea
                id="definition"
                value={formData.definition}
                onChange={(e) => setFormData({...formData, definition: e.target.value})}
                placeholder="Clear, authoritative definition of this term..."
                className="mt-1 min-h-[100px]"
              />
            </div>
          </div>

          {/* Aliases */}
          <div>
            <Label>Aliases (Alternative Names)</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={aliasInput}
                onChange={(e) => setAliasInput(e.target.value)}
                placeholder="Add an alias..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddAlias()}
              />
              <Button type="button" onClick={handleAddAlias} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.aliases?.map((alias, idx) => (
                <Badge key={idx} className="bg-gray-500/20 text-gray-400 gap-1">
                  {alias}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveAlias(idx)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Examples */}
          <div>
            <Label>Usage Examples</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={exampleInput}
                onChange={(e) => setExampleInput(e.target.value)}
                placeholder="Add an example..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddExample()}
              />
              <Button type="button" onClick={handleAddExample} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {formData.examples?.map((example, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-brand-charcoal/30 rounded">
                  <p className="text-sm text-brand-text-secondary flex-1">{example}</p>
                  <X className="w-4 h-4 cursor-pointer text-red-400 flex-shrink-0" onClick={() => handleRemoveExample(idx)} />
                </div>
              ))}
            </div>
          </div>

          {/* Business Rules */}
          <div>
            <Label>Business Rules</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={ruleInput}
                onChange={(e) => setRuleInput(e.target.value)}
                placeholder="Add a business rule..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
              />
              <Button type="button" onClick={handleAddRule} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {formData.business_rules?.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-brand-charcoal/30 rounded">
                  <p className="text-sm text-brand-text-secondary flex-1">{rule}</p>
                  <X className="w-4 h-4 cursor-pointer text-red-400 flex-shrink-0" onClick={() => handleRemoveRule(idx)} />
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({...formData, status: value})}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="review">In Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="deprecated">Deprecated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving} className="bg-brand-red">
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {existingTerm ? 'Update' : 'Create'} Term
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}