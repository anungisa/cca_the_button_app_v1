import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  Users,
  MessageSquare,
  Phone,
  Mail,
  Globe,
  Activity,
  FileText,
  Send,
  Plus,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Timer,
  Target,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @file CrisisRoom.js  
 * @description Crisis communications command center for managing organizational crises,
 * coordinating response teams, tracking stakeholder communications, and monitoring sentiment.
 */

export default function CrisisRoom() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [crisisSituations, setCrisisSituations] = useState([]);
  const [activeIncidents, setActiveIncidents] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCrisis, setSelectedCrisis] = useState(null);

  // Sample crisis data
  const sampleCrises = [
    {
      id: 'CR-001',
      title: 'Championship Venue Safety Concern',
      severity: 'high',
      status: 'active',
      created: '2024-01-15T10:30:00Z',
      lastUpdate: '2024-01-15T14:22:00Z',
      responseTeam: ['John Doe', 'Sarah Smith', 'Mike Johnson'],
      stakeholders: ['Athletes', 'Media', 'Sponsors', 'Venues'],
      description: 'Ice safety concerns raised at championship venue requiring immediate response.',
      communications: 12,
      mediaInquiries: 8,
      socialMentions: 45
    },
    {
      id: 'CR-002',
      title: 'Sponsorship Contract Dispute',
      severity: 'medium',
      status: 'monitoring',
      created: '2024-01-14T09:15:00Z',
      lastUpdate: '2024-01-15T11:45:00Z',
      responseTeam: ['Legal Team', 'Sponsorship Lead'],
      stakeholders: ['Sponsors', 'Media'],
      description: 'Public dispute with major sponsor requiring careful messaging.',
      communications: 6,
      mediaInquiries: 3,
      socialMentions: 18
    }
  ];

  const [crisisTemplates] = useState([
    {
      id: 'template-1',
      name: 'Athlete Safety Incident',
      severity: 'high',
      stakeholders: ['Athletes', 'Parents', 'Media', 'Safe Sport'],
      keyMessages: [
        'Athlete safety is our top priority',
        'We are investigating thoroughly',
        'We will provide updates as appropriate'
      ]
    },
    {
      id: 'template-2',  
      name: 'Event Cancellation',
      severity: 'medium',
      stakeholders: ['Athletes', 'Fans', 'Media', 'Venues'],
      keyMessages: [
        'Decision made with athlete safety in mind',
        'Working on rescheduling options',
        'Updates available on official channels'
      ]
    }
  ]);

  useEffect(() => {
    setCrisisSituations(sampleCrises);
    setActiveIncidents(sampleCrises.filter(c => c.status === 'active'));
  }, []);

  const getSeverityBadge = (severity) => {
    const config = {
      low: 'bg-yellow-500 text-white',
      medium: 'bg-orange-500 text-white', 
      high: 'bg-red-600 text-white',
      critical: 'bg-red-800 text-white'
    };
    return <Badge className={config[severity]}>{severity.toUpperCase()}</Badge>;
  };

  const getStatusBadge = (status) => {
    const config = {
      active: 'bg-red-600 text-white',
      monitoring: 'bg-orange-500 text-white',
      resolved: 'bg-green-600 text-white',
      closed: 'bg-gray-500 text-white'
    };
    return <Badge className={config[status]}>{status.replace('_', ' ').toUpperCase()}</Badge>;
  };

  const CrisisDashboard = () => (
    <div className="space-y-6">
      {/* Alert Status Bar */}
      {activeIncidents.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <ShieldAlert className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{activeIncidents.length} active crisis situation{activeIncidents.length !== 1 ? 's' : ''}</strong> - 
            Response teams deployed
          </AlertDescription>
        </Alert>
      )}

      {/* Crisis Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Active Crises</p>
                <p className="text-2xl font-bold text-red-600">{activeIncidents.length}</p>
              </div>
              <ShieldAlert className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Media Inquiries</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {crisisSituations.reduce((sum, c) => sum + c.mediaInquiries, 0)}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Social Mentions</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {crisisSituations.reduce((sum, c) => sum + c.socialMentions, 0)}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Response Teams</p>
                <p className="text-2xl font-bold text-brand-text-primary">3</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Crisis Situations */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Active Crisis Situations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeIncidents.length > 0 ? (
            <div className="space-y-4">
              {activeIncidents.map((crisis) => (
                <motion.div
                  key={crisis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-red-200 bg-red-50 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-brand-text-primary">{crisis.title}</h4>
                        {getSeverityBadge(crisis.severity)}
                        {getStatusBadge(crisis.status)}
                      </div>
                      <p className="text-sm text-brand-text-secondary mb-3">{crisis.description}</p>
                      <div className="flex items-center gap-4 text-xs text-brand-text-secondary">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {crisis.responseTeam.length} team members
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {crisis.mediaInquiries} inquiries
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {crisis.socialMentions} mentions
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedCrisis(crisis)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Manage
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-brand-text-secondary">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p className="font-medium">No Active Crisis Situations</p>
              <p className="text-sm">All systems normal</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const ResponseProtocols = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-brand-text-primary">Crisis Response Protocols</h3>
        <Button className="bg-brand-red hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          New Protocol
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {crisisTemplates.map((template) => (
          <Card key={template.id} className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{template.name}</CardTitle>
                {getSeverityBadge(template.severity)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-brand-text-secondary mb-2">Key Stakeholders:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.stakeholders.map((stakeholder) => (
                      <Badge key={stakeholder} variant="outline" className="text-xs">
                        {stakeholder}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-text-secondary mb-2">Key Messages:</p>
                  <ul className="space-y-1">
                    {template.keyMessages.map((message, index) => (
                      <li key={index} className="text-xs text-brand-text-secondary flex items-start gap-2">
                        <span className="w-1 h-1 bg-brand-text-secondary rounded-full mt-2 flex-shrink-0"></span>
                        {message}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const CommunicationsHub = () => (
    <div className="space-y-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Crisis Communications Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-blue-900">Email Alerts</p>
              <p className="text-sm text-blue-700">12 sent today</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Globe className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-green-900">Website Updates</p>
              <p className="text-sm text-green-700">3 published</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="font-semibold text-purple-900">Social Posts</p>
              <p className="text-sm text-purple-700">8 scheduled</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-brand-text-primary">Recent Communications</h4>
            <div className="space-y-2">
              {[
                { channel: 'Email', content: 'Safety update to championship participants', time: '2 hours ago', status: 'sent' },
                { channel: 'Website', content: 'Official statement on venue situation', time: '3 hours ago', status: 'published' },
                { channel: 'Social Media', content: 'Twitter thread addressing concerns', time: '4 hours ago', status: 'posted' }
              ].map((comm, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{comm.channel}</Badge>
                    <span className="text-sm text-brand-text-primary">{comm.content}</span>
                  </div>
                  <div className="text-xs text-brand-text-secondary">
                    {comm.time} • {comm.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const MonitoringCenter = () => (
    <div className="space-y-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Real-time Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-brand-text-primary mb-4">Media Mentions</h4>
              <div className="space-y-3">
                {[
                  { source: 'TSN', headline: 'Championship venue safety concerns addressed', sentiment: 'neutral', time: '1h ago' },
                  { source: 'Sportsnet', headline: 'Curling Canada responds to ice safety issues', sentiment: 'positive', time: '2h ago' },
                  { source: 'CBC Sports', headline: 'Athletes voice concerns over venue conditions', sentiment: 'negative', time: '3h ago' }
                ].map((mention, index) => (
                  <div key={index} className="p-3 bg-brand-charcoal/50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-brand-text-primary text-sm">{mention.source}</p>
                        <p className="text-xs text-brand-text-secondary mt-1">{mention.headline}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${
                          mention.sentiment === 'positive' ? 'bg-green-600' :
                          mention.sentiment === 'negative' ? 'bg-red-600' : 'bg-gray-600'
                        }`}>
                          {mention.sentiment}
                        </Badge>
                        <span className="text-xs text-brand-text-secondary">{mention.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-brand-text-primary mb-4">Social Media Sentiment</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-brand-text-secondary">Positive</span>
                    <span className="text-sm font-medium text-green-600">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-brand-text-secondary">Neutral</span>
                    <span className="text-sm font-medium text-gray-600">38%</span>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-brand-text-secondary">Negative</span>
                    <span className="text-sm font-medium text-red-600">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-red-600" />
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">Crisis Communications Room</h2>
            <p className="text-brand-text-secondary">Centralized crisis management and communications coordination</p>
          </div>
        </div>
        <Button className="bg-red-600 hover:bg-red-700" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Activate Crisis Response
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-brand-card-bg border-brand-border">
          <TabsTrigger value="dashboard">
            <Activity className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="protocols">
            <FileText className="w-4 h-4 mr-2" />
            Protocols
          </TabsTrigger>
          <TabsTrigger value="communications">
            <MessageSquare className="w-4 h-4 mr-2" />
            Communications
          </TabsTrigger>
          <TabsTrigger value="monitoring">
            <Target className="w-4 h-4 mr-2" />
            Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <CrisisDashboard />
        </TabsContent>

        <TabsContent value="protocols" className="mt-6">
          <ResponseProtocols />
        </TabsContent>

        <TabsContent value="communications" className="mt-6">
          <CommunicationsHub />
        </TabsContent>

        <TabsContent value="monitoring" className="mt-6">
          <MonitoringCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
}