
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  MessageSquare,
  History,
  Users,
  Shield,
  Link2,
  TrendingUp,
  Settings,
  X,
  Lock,
  Paperclip,
  GitCommitVertical
} from 'lucide-react';
import { Incident } from '@/api/entities';
import CollaborationPanel from './CollaborationPanel';
import AuditTrail from './AuditTrail';
import ConfidentialityManager from './ConfidentialityManager';
import IntegrationPanel from './IntegrationPanel';
import EscalationEngine from './EscalationEngine';
import { useToast } from '../hooks/use-toast';
import { triggerWorkflows } from '@/api/functions';

const statusConfig = {
  new: { color: 'bg-blue-500/20 text-blue-300', label: 'New' },
  open: { color: 'bg-green-500/20 text-green-300', label: 'Open' },
  in_progress: { color: 'bg-yellow-500/20 text-yellow-300', label: 'In Progress' },
  on_hold: { color: 'bg-gray-500/20 text-gray-300', label: 'On Hold' },
  escalated: { color: 'bg-orange-500/20 text-orange-300', label: 'Escalated' },
  resolved: { color: 'bg-purple-500/20 text-purple-300', label: 'Resolved' },
  closed: { color: 'bg-gray-700/20 text-gray-400', label: 'Closed' }
};

const priorityConfig = {
  low: { color: 'bg-green-500/20 text-green-300', label: 'Low' },
  medium: { color: 'bg-yellow-500/20 text-yellow-300', label: 'Medium' },
  high: { color: 'bg-orange-500/20 text-orange-300', label: 'High' },
  critical: { color: 'bg-red-500/20 text-red-300', label: 'Critical' }
};

export default function IncidentDetailModal({ incidentId, isOpen, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState('details');
  const [showEscalation, setShowEscalation] = useState(false);
  const [incident, setIncident] = useState(null);
  const [originalIncident, setOriginalIncident] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchIncidentData = async () => {
      if (incidentId && isOpen) {
        try {
          const fetchedIncident = await Incident.get(incidentId);
          setIncident(fetchedIncident);
          setOriginalIncident(fetchedIncident);
        } catch (error) {
          console.error('Failed to fetch incident:', error);
          toast({
            title: "Error",
            description: "Failed to load incident details.",
            variant: "destructive",
          });
          onClose();
        }
      } else if (!isOpen) {
        setIncident(null);
        setOriginalIncident(null);
      }
    };
    fetchIncidentData();
  }, [incidentId, isOpen, onClose, toast]);

  if (!incident) return null;

  const handleIncidentReload = async () => {
    if (!incident || !incident.id) return;
    try {
      const reloadedIncident = await Incident.get(incident.id);
      setIncident(reloadedIncident);
      setOriginalIncident(reloadedIncident);
      if (onUpdate) onUpdate(reloadedIncident);
    } catch (error) {
      console.error('Error reloading incident:', error);
      toast({
        title: "Error",
        description: "Failed to reload incident details.",
        variant: "destructive",
      });
      if (onUpdate) onUpdate();
    }
  };

  const handleUpdate = async (field, value) => {
    if (!incident) return;

    const updatedFields = { [field]: value };
    try {
      setIncident(prev => ({ ...prev, ...updatedFields }));

      await incident.update(updatedFields);
      
      const updatedIncident = await Incident.get(incident.id);

      setIncident(updatedIncident);
      setOriginalIncident(updatedIncident);
      if (onUpdate) onUpdate(updatedIncident);

      toast({
        title: "Incident Updated",
        description: `Incident ${field} successfully updated.`,
      });

      triggerWorkflows({
        entityName: 'Incident',
        operation: 'update',
        entityData: updatedIncident
      });

    } catch (error) {
      console.error("Error updating incident:", error);
      toast({
        title: "Error",
        description: `Failed to update incident ${field}.`,
        variant: "destructive",
      });
      setIncident(originalIncident);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-brand-card-bg border-brand-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-brand-red" />
              {incident.title}
              {incident.is_confidential && (
                <Badge className="bg-red-500/20 text-red-300 ml-2">
                  <Shield className="w-3 h-3 mr-1" />
                  Confidential
                </Badge>
              )}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge className={statusConfig[incident.status]?.color}>
                {statusConfig[incident.status]?.label}
              </Badge>
              <Badge className={priorityConfig[incident.priority]?.color}>
                {priorityConfig[incident.priority]?.label}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-brand-charcoal/30 rounded-lg mb-6">
          <div>
            <p className="text-sm text-brand-text-secondary">Category</p>
            <p className="font-medium text-brand-text-primary capitalize">
              {incident.category?.replace('_', ' ')}
            </p>
          </div>
          <div>
            <p className="text-sm text-brand-text-secondary">Assigned To</p>
            <p className="font-medium text-brand-text-primary">
              {incident.assigned_to_name || 'Unassigned'}
            </p>
          </div>
          <div>
            <p className="text-sm text-brand-text-secondary">Created</p>
            <p className="font-medium text-brand-text-primary">
              {formatDate(incident.created_date)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant="outline"
            onClick={() => setShowEscalation(!showEscalation)}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Escalate
          </Button>
        </div>

        {showEscalation && (
          <div className="mb-6">
            <EscalationEngine
              incident={incident}
              onEscalate={() => {
                setShowEscalation(false);
                handleIncidentReload();
              }}
              onClose={() => setShowEscalation(false)}
            />
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:block">Details</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:block">Audit Trail</span>
            </TabsTrigger>
            <TabsTrigger value="confidentiality" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:block">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              <span className="hidden sm:block">Links</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:block">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <CollaborationPanel
              incident={incident}
              onUpdate={handleIncidentReload}
            />
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <AuditTrail incident={incident} />
          </TabsContent>

          <TabsContent value="confidentiality" className="mt-6">
            <ConfidentialityManager
              incident={incident}
              onUpdate={handleIncidentReload}
            />
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <IntegrationPanel
              incident={incident}
              onUpdate={handleIncidentReload}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="text-center py-8 text-brand-text-secondary">
              Additional settings and configuration options coming soon...
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t border-brand-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
