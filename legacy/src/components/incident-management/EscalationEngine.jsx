
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, TrendingUp, Clock, User, Send } from 'lucide-react';
import { Incident } from '@/api/entities';
import { NotificationService } from '../utils/NotificationService';

const escalationLevels = {
  0: { label: 'Standard', color: 'bg-green-500/20 text-green-300' },
  1: { label: 'Manager', color: 'bg-yellow-500/20 text-yellow-300' },
  2: { label: 'Director', color: 'bg-orange-500/20 text-orange-300' },
  3: { label: 'Executive', color: 'bg-red-500/20 text-red-300' }
};

const departmentEscalationMap = {
  club_services: {
    1: 'Club Services Manager',
    2: 'Operations Director',
    3: 'Executive Director'
  },
  safe_sport: {
    1: 'Safe Sport Manager',
    2: 'Safe Sport Director',
    3: 'CEO'
  },
  tech: {
    1: 'IT Manager',
    2: 'Technology Director',
    3: 'COO'
  },
  events: {
    1: 'Events Manager',
    2: 'Events Director',
    3: 'Executive Director'
  }
};

const slaBreachRules = {
  critical: { responseHours: 1, resolutionHours: 24 },
  high: { responseHours: 4, resolutionHours: 72 },
  medium: { responseHours: 24, resolutionHours: 168 },
  low: { responseHours: 72, resolutionHours: 336 }
};

export default function EscalationEngine({ incident, onEscalate, onClose }) {
  const [escalationReason, setEscalationReason] = useState('');
  const [targetLevel, setTargetLevel] = useState(incident ? incident.escalation_level + 1 : 1);
  const [isEscalating, setIsEscalating] = useState(false);
  const [slaStatus, setSlaStatus] = useState(null);

  if (!incident) {
    return null;
  }

  useEffect(() => {
    checkSLAStatus();
  }, [incident]);

  const checkSLAStatus = () => {
    const now = new Date();
    const createdDate = new Date(incident.created_date);
    const hoursSinceCreated = (now - createdDate) / (1000 * 60 * 60);
    
    const slaRule = slaBreachRules[incident.priority];
    const isResponseBreached = hoursSinceCreated > slaRule.responseHours && 
                              ['new', 'open'].includes(incident.status);
    const isResolutionBreached = hoursSinceCreated > slaRule.resolutionHours && 
                                !['resolved', 'closed'].includes(incident.status);

    setSlaStatus({
      isResponseBreached,
      isResolutionBreached,
      hoursSinceCreated: Math.round(hoursSinceCreated * 10) / 10,
      responseHours: slaRule.responseHours,
      resolutionHours: slaRule.resolutionHours
    });
  };

  const getEscalationTarget = (level) => {
    const deptMap = departmentEscalationMap[incident.assigned_department];
    return deptMap?.[level] || `Level ${level} Escalation`;
  };

  const handleEscalate = async () => {
    setIsEscalating(true);
    try {
      const escalationData = {
        ...incident,
        escalation_level: targetLevel,
        status: 'escalated',
        assigned_to_name: getEscalationTarget(targetLevel),
        communications_log: [
          ...(incident.communications_log || []),
          {
            date: new Date().toISOString(),
            author_name: 'System',
            note: `Escalated to Level ${targetLevel}: ${escalationReason}`,
            channel: 'system_note'
          }
        ]
      };

      await Incident.update(incident.id, escalationData);
      
      // Send notifications
      await NotificationService.sendEscalationNotification({
        incidentId: incident.id,
        title: incident.title,
        escalationLevel: targetLevel,
        reason: escalationReason,
        department: incident.assigned_department
      });

      onEscalate();
    } catch (error) {
      console.error('Error escalating incident:', error);
      alert('Failed to escalate incident');
    } finally {
      setIsEscalating(false);
    }
  };

  const getAutoEscalationSuggestion = () => {
    if (slaStatus?.isResolutionBreached) {
      return {
        level: Math.min(3, incident.escalation_level + 2),
        reason: `SLA breach: Resolution overdue by ${(slaStatus.hoursSinceCreated - slaStatus.resolutionHours).toFixed(1)} hours`
      };
    }
    if (slaStatus?.isResponseBreached) {
      return {
        level: Math.min(3, incident.escalation_level + 1),
        reason: `SLA breach: Response overdue by ${(slaStatus.hoursSinceCreated - slaStatus.responseHours).toFixed(1)} hours`
      };
    }
    if (incident.priority === 'critical' && incident.escalation_level === 0) {
      return {
        level: 1,
        reason: 'Critical priority incident requires management oversight'
      };
    }
    return null;
  };

  const autoSuggestion = getAutoEscalationSuggestion();

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-400" />
          Escalation Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="p-4 bg-brand-charcoal/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-brand-text-secondary">Current Level</span>
            <Badge className={escalationLevels[incident.escalation_level]?.color}>
              {escalationLevels[incident.escalation_level]?.label}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-text-secondary">Assigned To</span>
            <span className="text-brand-text-primary">{incident.assigned_to_name || 'Unassigned'}</span>
          </div>
        </div>

        {/* SLA Status */}
        {slaStatus && (
          <div className="p-4 bg-brand-charcoal/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">SLA Status</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Hours Since Created:</span>
                <span>{slaStatus.hoursSinceCreated}h</span>
              </div>
              <div className="flex justify-between">
                <span>Response SLA:</span>
                <Badge className={slaStatus.isResponseBreached ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}>
                  {slaStatus.responseHours}h {slaStatus.isResponseBreached ? '(BREACHED)' : '(OK)'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Resolution SLA:</span>
                <Badge className={slaStatus.isResolutionBreached ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}>
                  {slaStatus.resolutionHours}h {slaStatus.isResolutionBreached ? '(BREACHED)' : '(OK)'}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Auto-Escalation Suggestion */}
        {autoSuggestion && (
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <span className="font-medium text-orange-300">Escalation Recommended</span>
            </div>
            <p className="text-sm text-orange-200 mb-3">{autoSuggestion.reason}</p>
            <Button 
              size="sm" 
              onClick={() => {
                setTargetLevel(autoSuggestion.level);
                setEscalationReason(autoSuggestion.reason);
              }}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Apply Suggestion
            </Button>
          </div>
        )}

        {/* Manual Escalation */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Escalate To</label>
            <Select value={targetLevel.toString()} onValueChange={(value) => setTargetLevel(parseInt(value))}>
              <SelectTrigger className="bg-brand-charcoal border-brand-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(escalationLevels)
                  .filter(([level]) => parseInt(level) > incident.escalation_level)
                  .map(([level, config]) => (
                    <SelectItem key={level} value={level}>
                      {config.label} - {getEscalationTarget(parseInt(level))}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Escalation Reason</label>
            <Textarea
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              placeholder="Explain why this incident needs to be escalated..."
              className="bg-brand-charcoal border-brand-border"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleEscalate}
              disabled={isEscalating || !escalationReason.trim()}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Send className="w-4 h-4 mr-2" />
              {isEscalating ? 'Escalating...' : 'Escalate Incident'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
