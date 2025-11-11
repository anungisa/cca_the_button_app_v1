import React, { useState } from 'react';
import { DataQualityRule } from '@/api/entities';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '../hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function CreateQualityRuleModal({ isOpen, onClose }) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    rule_name: '',
    description: '',
    rule_type: 'completeness',
    target_entity: 'Club',
    target_field: '',
    validation_logic: {
      operator: 'not_null',
      threshold: null,
      expected_value: ''
    },
    severity: 'medium',
    check_frequency: 'daily',
    is_active: true
  });

  const handleSubmit = async () => {
    if (!formData.rule_name || !formData.target_entity || !formData.target_field) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Rule name, entity, and field are required."
      });
      return;
    }

    setIsSaving(true);
    try {
      await DataQualityRule.create(formData);
      toast({
        title: "Rule Created",
        description: `"${formData.rule_name}" has been created.`
      });
      onClose();
    } catch (error) {
      console.error('Error creating rule:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create quality rule."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-brand-card-bg border-brand-border">
        <DialogHeader>
          <DialogTitle>Create Data Quality Rule</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="rule_name">Rule Name *</Label>
            <Input
              id="rule_name"
              value={formData.rule_name}
              onChange={(e) => setFormData({...formData, rule_name: e.target.value})}
              placeholder="e.g., Club Must Have Email"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="What this rule checks for..."
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rule_type">Rule Type</Label>
              <Select
                value={formData.rule_type}
                onValueChange={(value) => setFormData({...formData, rule_type: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completeness">Completeness</SelectItem>
                  <SelectItem value="accuracy">Accuracy</SelectItem>
                  <SelectItem value="consistency">Consistency</SelectItem>
                  <SelectItem value="timeliness">Timeliness</SelectItem>
                  <SelectItem value="validity">Validity</SelectItem>
                  <SelectItem value="uniqueness">Uniqueness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="severity">Severity</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => setFormData({...formData, severity: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target_entity">Target Entity *</Label>
              <Select
                value={formData.target_entity}
                onValueChange={(value) => setFormData({...formData, target_entity: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Club">Club</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Donation">Donation</SelectItem>
                  <SelectItem value="ShotTrackerLog">ShotTrackerLog</SelectItem>
                  <SelectItem value="FinancialTransaction">FinancialTransaction</SelectItem>
                  <SelectItem value="SponsorContract">SponsorContract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="target_field">Target Field *</Label>
              <Input
                id="target_field"
                value={formData.target_field}
                onChange={(e) => setFormData({...formData, target_field: e.target.value})}
                placeholder="e.g., email, name"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="operator">Validation Operator</Label>
              <Select
                value={formData.validation_logic.operator}
                onValueChange={(value) => setFormData({
                  ...formData,
                  validation_logic: {...formData.validation_logic, operator: value}
                })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_null">Not Null</SelectItem>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                  <SelectItem value="in_range">In Range</SelectItem>
                  <SelectItem value="matches_pattern">Matches Pattern</SelectItem>
                  <SelectItem value="unique">Unique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="check_frequency">Check Frequency</Label>
              <Select
                value={formData.check_frequency}
                onValueChange={(value) => setFormData({...formData, check_frequency: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="real_time">Real-time</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="on_demand">On Demand</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving} className="bg-brand-red">
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Rule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}