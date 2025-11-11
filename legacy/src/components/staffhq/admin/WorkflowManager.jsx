
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Plus, Edit, Trash2, Play, Pause, Bot, Settings, AlertTriangle, Info,
  ChevronDown, ChevronUp, Circle, CheckCircle, XCircle
} from 'lucide-react';
import { WorkflowDefinition } from '@/api/entities';

const WorkflowForm = ({ workflow, onSave, onCancel, entities }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: { entity: '', operation: '' },
    conditions: [],
    actions: [],
    is_active: true,
    ...workflow
  });

  const entityOptions = entities.map(e => e.name);
  const operationOptions = ['create', 'update', 'delete'];
  const actionTypeOptions = ['create_notification', 'send_teams_notification', 'send_email', 'update_entity'];
  const conditionOperatorOptions = ['equals', 'not_equals', 'contains', 'greater_than', 'less_than'];

  const handleAddCondition = () => {
    setFormData(prev => ({
      ...prev,
      conditions: [...prev.conditions, { field: '', operator: 'equals', value: '' }]
    }));
  };

  const handleAddAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, { action_type: 'create_notification', parameters: {} }]
    }));
  };

  const handleConditionChange = (index, field, value) => {
    const newConditions = [...formData.conditions];
    newConditions[index][field] = value;
    setFormData(prev => ({ ...prev, conditions: newConditions }));
  };

  const handleActionChange = (index, field, value) => {
    const newActions = [...formData.actions];
    newActions[index][field] = value;
    if (field === 'action_type') newActions[index].parameters = {}; // Reset params on type change
    setFormData(prev => ({ ...prev, actions: newActions }));
  };

  const handleActionParamChange = (index, key, value) => {
    const newActions = [...formData.actions];
    newActions[index].parameters[key] = value;
    setFormData(prev => ({ ...prev, actions: newActions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderActionParams = (action, index) => {
    switch(action.action_type) {
      case 'create_notification':
        return (
          <>
            <Input placeholder="User ID (e.g., {{assigned_to}})" value={action.parameters.user_id || ''} onChange={e => handleActionParamChange(index, 'user_id', e.target.value)} />
            <Input placeholder="Title" value={action.parameters.title || ''} onChange={e => handleActionParamChange(index, 'title', e.target.value)} />
            <Input placeholder="Message" value={action.parameters.message || ''} onChange={e => handleActionParamChange(index, 'message', e.target.value)} />
          </>
        );
      case 'send_teams_notification':
         return (
          <>
            <Input placeholder="Channel (e.g., general)" value={action.parameters.channel || ''} onChange={e => handleActionParamChange(index, 'channel', e.target.value)} />
            <Input placeholder="Title" value={action.parameters.title || ''} onChange={e => handleActionParamChange(index, 'title', e.target.value)} />
            <Input placeholder="Message" value={action.parameters.message || ''} onChange={e => handleActionParamChange(index, 'message', e.target.value)} />
          </>
        );
      case 'send_email':
        return (
          <>
            <Input placeholder="To (e.g., {{entity.reporter_email}})" value={action.parameters.to || ''} onChange={e => handleActionParamChange(index, 'to', e.target.value)} />
            <Input placeholder="Subject" value={action.parameters.subject || ''} onChange={e => handleActionParamChange(index, 'subject', e.target.value)} />
            <Textarea placeholder="Body (supports placeholders like {{entity.title}})" value={action.parameters.body || ''} onChange={e => handleActionParamChange(index, 'body', e.target.value)} />
          </>
        );
      case 'update_entity':
        return (
          <>
            <Select value={action.parameters.entityToUpdate || ''} onValueChange={value => handleActionParamChange(index, 'entityToUpdate', value)}>
              <SelectTrigger><SelectValue placeholder="Entity to Update" /></SelectTrigger>
              <SelectContent>{entityOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
            </Select>
            <Input placeholder="Record ID (e.g., {{entity.id}})" value={action.parameters.recordId || ''} onChange={e => handleActionParamChange(index, 'recordId', e.target.value)} />
            <Textarea placeholder='Fields to Update (JSON format), e.g., {"status": "resolved", "priority": "low"}' value={action.parameters.fieldsToUpdate || ''} onChange={e => handleActionParamChange(index, 'fieldsToUpdate', e.target.value)} className="font-mono text-sm" />
          </>
        );
      default:
        return <p className="text-xs text-brand-text-secondary">Parameter configuration not available for this action type.</p>
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto my-4">
      <CardHeader>
        <CardTitle>{workflow ? 'Edit Workflow' : 'Create New Workflow'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input placeholder="Workflow Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <Textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />

          {/* Trigger */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Trigger</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Select value={formData.trigger.entity} onValueChange={value => setFormData({...formData, trigger: {...formData.trigger, entity: value}})}>
                <SelectTrigger><SelectValue placeholder="Select Entity" /></SelectTrigger>
                <SelectContent>{entityOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={formData.trigger.operation} onValueChange={value => setFormData({...formData, trigger: {...formData.trigger, operation: value}})}>
                <SelectTrigger><SelectValue placeholder="Select Operation" /></SelectTrigger>
                <SelectContent>{operationOptions.map(opt => <SelectItem key={opt} value={opt} className="capitalize">{opt}</SelectItem>)}</SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Conditions */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Conditions (All must be true)</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {formData.conditions.map((cond, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input placeholder="Field (e.g., priority)" value={cond.field} onChange={e => handleConditionChange(index, 'field', e.target.value)} />
                  <Select value={cond.operator} onValueChange={value => handleConditionChange(index, 'operator', value)}>
                    <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                    <SelectContent>{conditionOperatorOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input placeholder="Value" value={cond.value} onChange={e => handleConditionChange(index, 'value', e.target.value)} />
                  <Button variant="ghost" size="icon" onClick={() => setFormData(prev => ({...prev, conditions: prev.conditions.filter((_, i) => i !== index)}))}><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={handleAddCondition}>Add Condition</Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Actions</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {formData.actions.map((action, index) => (
                <div key={index} className="p-2 border border-brand-border rounded space-y-2">
                  <div className="flex gap-2 items-center">
                    <Select value={action.action_type} onValueChange={value => handleActionChange(index, 'action_type', value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{actionTypeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => setFormData(prev => ({...prev, actions: prev.actions.filter((_, i) => i !== index)}))}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  <div className="pl-4 space-y-2">{renderActionParams(action, index)}</div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={handleAddAction}>Add Action</Button>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center pt-4">
            <div className="flex items-center gap-2">
              <Switch checked={formData.is_active} onCheckedChange={checked => setFormData({...formData, is_active: checked})} />
              <label>Active</label>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
              <Button type="submit">Save Workflow</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default function WorkflowManager() {
  const [workflows, setWorkflows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [availableEntities, setAvailableEntities] = useState([]);

  const loadWorkflows = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await WorkflowDefinition.list();
      setWorkflows(data);
    } catch (e) {
      console.error("Failed to load workflows", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // In a real app, we'd fetch a list of all entity schemas.
    // For now, we'll hardcode the relevant ones.
    setAvailableEntities([{name: 'Task'}, {name: 'Project'}, {name: 'Incident'}, {name: 'HRDocument'}]);
    loadWorkflows();
  }, [loadWorkflows]);

  const handleSaveWorkflow = async (data) => {
    if (editingWorkflow) {
      await WorkflowDefinition.update(editingWorkflow.id, data);
    } else {
      await WorkflowDefinition.create(data);
    }
    setEditingWorkflow(null);
    setIsCreating(false);
    loadWorkflows();
  };

  const handleToggleActive = async (workflow) => {
    await WorkflowDefinition.update(workflow.id, { is_active: !workflow.is_active });
    loadWorkflows();
  };

  const handleDeleteWorkflow = async (id) => {
    if (window.confirm("Are you sure you want to delete this workflow?")) {
      await WorkflowDefinition.delete(id);
      loadWorkflows();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-6 h-6" /> Workflow Automation
            </CardTitle>
            <CardDescription>Automate routine tasks and notifications across the platform.</CardDescription>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" /> Create Workflow
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isCreating || editingWorkflow ? (
          <WorkflowForm
            workflow={editingWorkflow}
            onSave={handleSaveWorkflow}
            onCancel={() => { setIsCreating(false); setEditingWorkflow(null); }}
            entities={availableEntities}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map(wf => (
                <TableRow key={wf.id}>
                  <TableCell>
                    <Switch checked={wf.is_active} onCheckedChange={() => handleToggleActive(wf)} />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{wf.name}</div>
                    <div className="text-xs text-brand-text-secondary">{wf.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {`On ${wf.trigger?.entity} ${wf.trigger?.operation}`}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditingWorkflow(wf)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteWorkflow(wf.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
