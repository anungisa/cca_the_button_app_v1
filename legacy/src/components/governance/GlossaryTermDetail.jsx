
import React, { useState, useEffect } from 'react';
import { BusinessGlossaryTerm } from '@/api/entities';
import { User } from '@/api/entities';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import {
  Edit, Trash2, CheckCircle, Clock, Database,
  Tag, FileText, GitBranch, User as UserIcon, Calendar, Loader2
} from 'lucide-react';
import CreateGlossaryTermModal from './CreateGlossaryTermModal';
import GlossaryUsageTracker from './GlossaryUsageTracker'; // Assuming this path for the new component
import GlossaryApprovalWorkflow from './GlossaryApprovalWorkflow'; // Assuming this path for the new component

export default function GlossaryTermDetail({ term, isOpen, onClose }) {
  const { toast } = useToast();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('definition');

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${term.term_name}"?`)) return;

    setIsDeleting(true);
    try {
      await BusinessGlossaryTerm.delete(term.id);
      toast({
        title: "Term Deleted",
        description: `"${term.term_name}" has been removed from the glossary.`
      });
      onClose();
    } catch (error) {
      console.error('Error deleting term:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete glossary term."
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // handleApprove is removed as its functionality is now within GlossaryApprovalWorkflow

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'review': return 'bg-yellow-500/20 text-yellow-400';
      case 'draft': return 'bg-gray-500/20 text-gray-400';
      case 'deprecated': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <>
      <Dialog open={isOpen && !showEditModal} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-brand-card-bg border-brand-border">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-3">
                {term.term_name}
                <Badge className={getStatusColor(term.status)}>
                  {term.status}
                </Badge>
              </DialogTitle>
              <div className="flex gap-2">
                {/* The Approve button is removed here, handled by GlossaryApprovalWorkflow */}
                <Button onClick={() => setShowEditModal(true)} variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  disabled={isDeleting}
                  className="text-red-400 hover:text-red-300"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="definition">Definition</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="sources">Data Sources</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="definition" className="space-y-4 mt-4">
              <Card className="bg-brand-charcoal/30 border-brand-border">
                <CardContent className="p-4">
                  <h4 className="font-medium text-brand-text-primary mb-2">Official Definition</h4>
                  <p className="text-brand-text-secondary">{term.definition}</p>
                </CardContent>
              </Card>

              {term.aliases && term.aliases.length > 0 && (
                <Card className="bg-brand-charcoal/30 border-brand-border">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Also Known As
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {term.aliases.map((alias, idx) => (
                        <Badge key={idx} variant="outline">{alias}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {term.examples && term.examples.length > 0 && (
                <Card className="bg-brand-charcoal/30 border-brand-border">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Examples
                    </h4>
                    <ul className="space-y-2">
                      {term.examples.map((example, idx) => (
                        <li key={idx} className="text-sm text-brand-text-secondary flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">•</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {term.business_rules && term.business_rules.length > 0 && (
                <Card className="bg-brand-charcoal/30 border-brand-border">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Business Rules
                    </h4>
                    <ul className="space-y-2">
                      {term.business_rules.map((rule, idx) => (
                        <li key={idx} className="text-sm text-brand-text-secondary flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">→</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="usage" className="space-y-4 mt-4">
              <GlossaryUsageTracker termId={term.id} />
            </TabsContent>

            <TabsContent value="sources" className="space-y-4 mt-4">
              <Card className="bg-brand-charcoal/30 border-brand-border">
                <CardContent className="p-4">
                  <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Data Sources
                  </h4>
                  {term.data_sources && term.data_sources.length > 0 ? (
                    <div className="space-y-2">
                      {term.data_sources.map((source, idx) => (
                        <div key={idx} className="p-3 bg-brand-charcoal/50 rounded border border-brand-border">
                          <p className="text-sm font-medium text-brand-text-primary">{source.system}</p>
                          <p className="text-xs text-brand-text-secondary">
                            Entity: {source.entity} → Field: {source.field_name}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-brand-text-secondary">No data sources mapped yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workflow" className="space-y-4 mt-4">
              <GlossaryApprovalWorkflow
                term={term}
                onStatusChange={(newStatus) => {
                  toast({
                    title: "Status Updated",
                    description: `Term status changed to ${newStatus}.`
                  });
                  setTimeout(() => onClose(), 1000); // Close after a short delay to show toast
                }}
              />
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-4">
              <Card className="bg-brand-charcoal/30 border-brand-border">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                      <div>
                        <p className="text-sm font-medium text-brand-text-primary">Current Version</p>
                        <p className="text-xs text-brand-text-secondary">v{term.version || 1}</p>
                      </div>
                      {term.approved_by && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-brand-text-primary">Approved By</p>
                          <p className="text-xs text-brand-text-secondary">
                            {new Date(term.approval_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {term.change_history && term.change_history.length > 0 ? (
                      <div className="space-y-2">
                        {term.change_history.map((change, idx) => (
                          <div key={idx} className="p-3 bg-brand-charcoal/50 rounded border border-brand-border">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="outline" className="text-xs">v{change.version}</Badge>
                              <span className="text-xs text-brand-text-secondary">
                                {new Date(change.change_date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-brand-text-secondary">{change.change_description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-brand-text-secondary">No change history available.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {showEditModal && (
        <CreateGlossaryTermModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            onClose(); // Also close the detail modal after editing
          }}
          existingTerm={term}
        />
      )}
    </>
  );
}
