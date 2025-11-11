
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  History,
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  Activity,
  Shield,
  Clock,
  AlertTriangle,
  GitCommitVertical // Added from outline
} from 'lucide-react';
import { format, parseISO } from 'date-fns'; // Added parseISO

// Updated audit event types to incorporate new icons and maintain existing functionality
const auditEventTypes = {
  created: { icon: GitCommitVertical, color: 'text-green-400', label: 'Created' }, // Icon and color from outline
  status_changed: { icon: GitCommitVertical, color: 'text-blue-400', label: 'Status Changed' }, // Icon and color from outline
  priority_changed: { icon: AlertTriangle, color: 'text-orange-400', label: 'Priority Changed' }, // Kept original icon
  assigned: { icon: GitCommitVertical, color: 'text-yellow-400', label: 'Assigned' }, // Icon and color from outline
  escalated: { icon: GitCommitVertical, color: 'text-orange-400', label: 'Escalated' }, // Icon and color from outline
  note_added: { icon: GitCommitVertical, color: 'text-gray-400', label: 'Note Added' }, // New type from outline
  collaborator_added: { icon: User, color: 'text-teal-400', label: 'Collaborator Added' }, // Kept original icon
  resolved: { icon: GitCommitVertical, color: 'text-purple-400', label: 'Resolved' }, // Icon and color from outline
  closed: { icon: Activity, color: 'text-gray-400', label: 'Closed' } // Kept original icon
};

export default function AuditTrail({ incident }) {
  // Return null if incident data is not provided to prevent rendering errors
  if (!incident) {
    return null;
  }

  const getAuditLog = () => {
    const events = [];

    // Initial creation event
    events.push({
      id: '1',
      type: 'created',
      timestamp: parseISO(incident.created_date), // Use parseISO
      user: incident.created_by,
      details: `Incident created: ${incident.title}`,
      metadata: {
        category: incident.category,
        priority: incident.priority,
        confidential: incident.is_confidential
      }
    });

    // Parse communications log for audit events
    incident.communications_log?.forEach((log, index) => {
      let eventType = 'note_added'; // Default to 'note_added' as per outline suggestion
      let details = log.note;

      // Detect specific event types based on content
      if (log.note.includes('Status changed')) {
        eventType = 'status_changed';
      } else if (log.note.includes('Escalated')) {
        eventType = 'escalated';
      } else if (log.note.includes('added as collaborator')) {
        eventType = 'collaborator_added';
      } else if (log.note.includes('assigned to')) {
        eventType = 'assigned';
      } else if (log.note.includes('Priority changed')) { // Preserving original detection
        eventType = 'priority_changed';
      } else if (log.note.includes('resolved')) { // Preserving original detection
        eventType = 'resolved';
      } else if (log.note.includes('closed')) { // Preserving original detection
        eventType = 'closed';
      }

      events.push({
        id: `log-${index}`,
        type: eventType,
        timestamp: parseISO(log.date), // Use parseISO
        user: log.author_name,
        details: details,
        metadata: {
          channel: log.channel,
          internal: log.is_internal
        }
      });
    });

    // Sort by timestamp (newest first)
    events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return events;
  };

  const checkComplianceRequirements = () => {
    const isHighRisk = incident.category === 'safe_sport' ||
                       incident.priority === 'critical' ||
                       incident.escalation_level >= 2;

    const retentionPeriod = isHighRisk ? '7 years' : '3 years';
    const requiresLegalReview = incident.category === 'safe_sport' &&
                               incident.severity === 'level_4';

    return {
      isHighRisk,
      retentionPeriod,
      requiresLegalReview,
      auditReady: true,
      exportRequired: isHighRisk,
      confidentialityLevel: incident.is_confidential ? 'Confidential' : 'Internal'
    };
  };

  // Derived data based on incident prop, no longer state
  const auditEvents = getAuditLog();
  const complianceData = checkComplianceRequirements();

  const exportAuditLog = () => {
    const auditReport = {
      incident: {
        id: incident.id,
        title: incident.title,
        category: incident.category,
        priority: incident.priority,
        status: incident.status,
        created_date: incident.created_date,
        is_confidential: incident.is_confidential
      },
      audit_trail: auditEvents.map(event => ({
        ...event,
        timestamp: event.timestamp.toISOString() // Convert Date objects back to ISO string for export
      })),
      compliance_data: complianceData,
      export_metadata: {
        exported_by: 'Current User', // Placeholder, replace with actual user
        export_date: new Date().toISOString(),
        export_reason: 'Compliance Documentation'
      }
    };

    const blob = new Blob([JSON.stringify(auditReport, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-${incident.id}-audit-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (timestamp) => {
    // timestamp is already a Date object from getAuditLog
    return format(timestamp, 'PPpp');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="timeline">Audit Timeline</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-400" />
                  Complete Audit Trail
                </CardTitle>
                <Button variant="outline" onClick={exportAuditLog}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {auditEvents.map((event) => {
                  const eventConfig = auditEventTypes[event.type];
                  const EventIcon = eventConfig?.icon || Activity; // Fallback to Activity if type not found

                  return (
                    <div key={event.id} className="flex gap-4 p-4 bg-brand-charcoal/30 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-brand-charcoal rounded-full flex items-center justify-center">
                          <EventIcon className={`w-4 h-4 ${eventConfig?.color}`} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <Badge className={eventConfig?.color.replace('text-', 'bg-').replace('-400', '-500/20').replace('-500', '-600/20').replace('-300', '-400/20')}>
                            {eventConfig?.label || event.type}
                          </Badge>
                          <span className="text-xs text-brand-text-secondary">
                            {formatTimestamp(event.timestamp)}
                          </span>
                        </div>

                        <p className="text-brand-text-primary text-sm mb-2">{event.details}</p>

                        <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
                          <User className="w-3 h-3" />
                          <span>{event.user}</span>

                          {event.metadata?.internal && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                <span>Internal</span>
                              </div>
                            </>
                          )}

                          {event.metadata?.confidential && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>Confidential</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {complianceData && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-brand-charcoal/50 rounded-lg">
                      <h4 className="font-medium mb-2">Risk Classification</h4>
                      <Badge className={complianceData.isHighRisk ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}>
                        {complianceData.isHighRisk ? 'High Risk' : 'Standard Risk'}
                      </Badge>
                    </div>

                    <div className="p-4 bg-brand-charcoal/50 rounded-lg">
                      <h4 className="font-medium mb-2">Retention Period</h4>
                      <span className="text-brand-text-primary">{complianceData.retentionPeriod}</span>
                    </div>

                    <div className="p-4 bg-brand-charcoal/50 rounded-lg">
                      <h4 className="font-medium mb-2">Confidentiality Level</h4>
                      <Badge variant="outline">{complianceData.confidentialityLevel}</Badge>
                    </div>

                    <div className="p-4 bg-brand-charcoal/50 rounded-lg">
                      <h4 className="font-medium mb-2">Audit Ready</h4>
                      <Badge className="bg-green-500/20 text-green-300">
                        {complianceData.auditReady ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>

                  {complianceData.requiresLegalReview && (
                    <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                        <span className="font-medium text-orange-300">Legal Review Required</span>
                      </div>
                      <p className="text-orange-200 text-sm">
                        This incident requires legal review due to its severity and category.
                        Ensure all documentation is complete before resolution.
                      </p>
                    </div>
                  )}

                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h4 className="font-medium mb-2 text-blue-300">Document Retention Guidelines</h4>
                    <ul className="text-blue-200 text-sm space-y-1">
                      <li>• All communications must be preserved for {complianceData.retentionPeriod}</li>
                      <li>• Confidential incidents require secure storage</li>
                      <li>• Audit logs are automatically generated and immutable</li>
                      <li>• Export capabilities available for compliance reporting</li>
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
