import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Users, 
  Lock, 
  AlertTriangle,
  UserCheck,
  UserX
} from 'lucide-react';
import { Incident } from '@/api/entities';

const confidentialityLevels = {
  public: {
    label: 'Public',
    description: 'Visible to all staff members',
    icon: Eye,
    color: 'bg-green-500/20 text-green-300'
  },
  internal: {
    label: 'Internal',
    description: 'Visible to relevant departments only',
    icon: Users,
    color: 'bg-blue-500/20 text-blue-300'
  },
  confidential: {
    label: 'Confidential',
    description: 'Restricted to assigned team and supervisors',
    icon: Shield,
    color: 'bg-orange-500/20 text-orange-300'
  },
  restricted: {
    label: 'Restricted',
    description: 'Executive and Safe Sport leadership only',
    icon: Lock,
    color: 'bg-red-500/20 text-red-300'
  }
};

const roleAccessMatrix = {
  safe_sport: {
    public: ['all_staff'],
    internal: ['safe_sport', 'executive', 'hr'],
    confidential: ['safe_sport_lead', 'executive'],
    restricted: ['safe_sport_director', 'ceo', 'legal']
  },
  club_support: {
    public: ['all_staff'],
    internal: ['club_services', 'ma_relations', 'executive'],
    confidential: ['club_services_lead', 'executive'],
    restricted: ['executive_director']
  },
  technical_issue: {
    public: ['all_staff'],
    internal: ['tech', 'support', 'executive'],
    confidential: ['tech_lead', 'executive'],
    restricted: ['cto', 'executive_director']
  }
};

export default function ConfidentialityManager({ incident, onUpdate }) {
  const [confidentialityLevel, setConfidentialityLevel] = useState(
    incident.is_confidential ? 'confidential' : 'internal'
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAccessList, setShowAccessList] = useState(false);

  const getCurrentLevel = () => {
    if (incident.is_confidential) {
      return incident.severity === 'level_4' ? 'restricted' : 'confidential';
    }
    return incident.category === 'general_inquiry' ? 'public' : 'internal';
  };

  const getAuthorizedRoles = (level) => {
    const categoryMatrix = roleAccessMatrix[incident.category] || roleAccessMatrix.club_support;
    return categoryMatrix[level] || [];
  };

  const updateConfidentiality = async () => {
    setIsUpdating(true);
    try {
      const isConfidential = ['confidential', 'restricted'].includes(confidentialityLevel);
      
      const updateData = {
        ...incident,
        is_confidential: isConfidential,
        severity: confidentialityLevel === 'restricted' ? 'level_4' : incident.severity,
        communications_log: [
          ...(incident.communications_log || []),
          {
            date: new Date().toISOString(),
            author_name: 'System',
            note: `Confidentiality level changed to: ${confidentialityLevels[confidentialityLevel].label}`,
            channel: 'system_note'
          }
        ]
      };

      await Incident.update(incident.id, updateData);
      onUpdate();
    } catch (error) {
      console.error('Error updating confidentiality:', error);
      alert('Failed to update confidentiality settings');
    } finally {
      setIsUpdating(false);
    }
  };

  const currentLevel = getCurrentLevel();
  const currentConfig = confidentialityLevels[currentLevel];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="space-y-4">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Confidentiality Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-brand-text-secondary">Current Level</span>
              <Badge className={currentConfig.color}>
                <CurrentIcon className="w-3 h-3 mr-1" />
                {currentConfig.label}
              </Badge>
            </div>
            <p className="text-sm text-brand-text-primary">{currentConfig.description}</p>
          </div>

          {/* Category-Based Recommendations */}
          {incident.category === 'safe_sport' && (
            <Alert className="bg-red-500/10 border-red-500/30">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200">
                Safe Sport incidents are automatically treated as confidential. 
                Consider restricted access for high-severity cases.
              </AlertDescription>
            </Alert>
          )}

          {/* Confidentiality Level Selector */}
          <div className="space-y-3">
            <Label>Change Confidentiality Level</Label>
            <Select value={confidentialityLevel} onValueChange={setConfidentialityLevel}>
              <SelectTrigger className="bg-brand-charcoal border-brand-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(confidentialityLevels).map(([level, config]) => (
                  <SelectItem key={level} value={level}>
                    <div className="flex items-center gap-2">
                      <config.icon className="w-4 h-4" />
                      <span>{config.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-brand-text-secondary">
              {confidentialityLevels[confidentialityLevel].description}
            </p>
          </div>

          {/* Access Control Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Who can access this incident?</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAccessList(!showAccessList)}
              >
                {showAccessList ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            
            {showAccessList && (
              <div className="p-3 bg-brand-charcoal/30 rounded-lg">
                <div className="space-y-2">
                  {getAuthorizedRoles(confidentialityLevel).map((role, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <UserCheck className="w-3 h-3 text-green-400" />
                      <span className="text-brand-text-primary capitalize">
                        {role.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                  
                  {confidentialityLevel !== 'public' && (
                    <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                      <UserX className="w-3 h-3 text-red-400" />
                      <span>All other staff members - No Access</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button
              onClick={updateConfidentiality}
              disabled={isUpdating || confidentialityLevel === currentLevel}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? 'Updating...' : 'Update Confidentiality'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confidentiality Guidelines */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-lg">Confidentiality Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <h4 className="font-medium text-brand-text-primary">When to Use Each Level:</h4>
            <ul className="space-y-1 text-brand-text-secondary">
              <li><strong>Public:</strong> General inquiries, feedback, non-sensitive technical issues</li>
              <li><strong>Internal:</strong> Club support, standard operational issues, MA relations</li>
              <li><strong>Confidential:</strong> Personnel matters, financial issues, sensitive complaints</li>
              <li><strong>Restricted:</strong> Legal matters, severe Safe Sport incidents, executive-level issues</li>
            </ul>
          </div>
          
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-200 text-sm">
              <strong>Remember:</strong> Once an incident is marked as confidential, 
              the change is logged in the audit trail and cannot be easily reversed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}