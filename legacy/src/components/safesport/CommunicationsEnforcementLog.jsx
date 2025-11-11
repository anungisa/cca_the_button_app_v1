import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SafeSportCommunication } from '@/api/entities';
import { 
  Send, 
  Calendar, 
  Users, 
  Mail, 
  Bell, 
  Globe, 
  PlusCircle,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

const CommunicationsEnforcementLog = () => {
  const [communications, setCommunications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommunication, setNewCommunication] = useState({
    title: '',
    message_type: 'general_announcement',
    content: '',
    target_audience: ['all'],
    delivery_method: ['email'],
    priority: 'medium',
    scheduled_send: '',
    ma_filter: [],
    club_filter: []
  });

  const messageTypes = [
    { value: 'policy_update', label: 'Policy Update', icon: '📋' },
    { value: 'training_reminder', label: 'Training Reminder', icon: '🎓' },
    { value: 'compliance_deadline', label: 'Compliance Deadline', icon: '⏰' },
    { value: 'incident_alert', label: 'Incident Alert', icon: '🚨' },
    { value: 'general_announcement', label: 'General Announcement', icon: '📢' }
  ];

  const audiences = [
    'all', 'athletes', 'coaches', 'officials', 'volunteers', 'staff', 'board', 'parents', 'clubs', 'mas'
  ];

  const deliveryMethods = [
    { value: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { value: 'app_notification', label: 'App Notification', icon: <Bell className="w-4 h-4" /> },
    { value: 'website_banner', label: 'Website Banner', icon: <Globe className="w-4 h-4" /> },
    { value: 'dashboard_alert', label: 'Dashboard Alert', icon: <AlertTriangle className="w-4 h-4" /> }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500' }
  ];

  useEffect(() => {
    loadCommunications();
  }, []);

  const loadCommunications = async () => {
    setIsLoading(true);
    try {
      const allCommunications = await SafeSportCommunication.list('-created_date');
      setCommunications(allCommunications);
    } catch (error) {
      console.error("Error loading communications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCommunication = async () => {
    try {
      const communication = {
        ...newCommunication,
        status: newCommunication.scheduled_send ? 'scheduled' : 'draft',
        created_by: 'jen_ferris' // In real app, this would be current user
      };
      
      await SafeSportCommunication.create(communication);
      await loadCommunications();
      setShowCreateModal(false);
      setNewCommunication({
        title: '',
        message_type: 'general_announcement',
        content: '',
        target_audience: ['all'],
        delivery_method: ['email'],
        priority: 'medium',
        scheduled_send: '',
        ma_filter: [],
        club_filter: []
      });
    } catch (error) {
      console.error("Error creating communication:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'cancelled':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : 'bg-gray-500';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleString('en-CA');
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Communications & Enforcement Log</CardTitle>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                New Communication
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-brand-card-bg border-brand-border">
              <DialogHeader>
                <DialogTitle className="text-brand-text-primary">Create Communication</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-2">Title</label>
                  <Input
                    value={newCommunication.title}
                    onChange={(e) => setNewCommunication({...newCommunication, title: e.target.value})}
                    placeholder="Communication title"
                    className="bg-brand-charcoal border-brand-border"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-text-primary mb-2">Message Type</label>
                    <Select value={newCommunication.message_type} onValueChange={(value) => setNewCommunication({...newCommunication, message_type: value})}>
                      <SelectTrigger className="bg-brand-charcoal border-brand-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {messageTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-brand-text-primary mb-2">Priority</label>
                    <Select value={newCommunication.priority} onValueChange={(value) => setNewCommunication({...newCommunication, priority: value})}>
                      <SelectTrigger className="bg-brand-charcoal border-brand-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map(priority => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${priority.color}`}></div>
                              {priority.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-2">Content</label>
                  <Textarea
                    value={newCommunication.content}
                    onChange={(e) => setNewCommunication({...newCommunication, content: e.target.value})}
                    placeholder="Communication content"
                    className="bg-brand-charcoal border-brand-border h-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-2">Target Audience</label>
                  <div className="grid grid-cols-3 gap-2">
                    {audiences.map(audience => (
                      <label key={audience} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newCommunication.target_audience.includes(audience)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewCommunication({
                                ...newCommunication,
                                target_audience: [...newCommunication.target_audience, audience]
                              });
                            } else {
                              setNewCommunication({
                                ...newCommunication,
                                target_audience: newCommunication.target_audience.filter(a => a !== audience)
                              });
                            }
                          }}
                          className="text-brand-red"
                        />
                        <span className="text-sm capitalize text-brand-text-primary">{audience}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-2">Delivery Methods</label>
                  <div className="grid grid-cols-2 gap-2">
                    {deliveryMethods.map(method => (
                      <label key={method.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newCommunication.delivery_method.includes(method.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewCommunication({
                                ...newCommunication,
                                delivery_method: [...newCommunication.delivery_method, method.value]
                              });
                            } else {
                              setNewCommunication({
                                ...newCommunication,
                                delivery_method: newCommunication.delivery_method.filter(m => m !== method.value)
                              });
                            }
                          }}
                          className="text-brand-red"
                        />
                        <div className="flex items-center gap-2">
                          {method.icon}
                          <span className="text-sm text-brand-text-primary">{method.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-2">Schedule Send (Optional)</label>
                  <Input
                    type="datetime-local"
                    value={newCommunication.scheduled_send}
                    onChange={(e) => setNewCommunication({...newCommunication, scheduled_send: e.target.value})}
                    className="bg-brand-charcoal border-brand-border"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCommunication}>
                    <Send className="w-4 h-4 mr-2" />
                    Create Communication
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-brand-text-secondary">
          Manage system-wide communications and enforcement notifications.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-brand-charcoal">
            <TabsTrigger value="recent">Recent Communications</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="mt-6">
            <div className="space-y-4">
              {communications.map(comm => (
                <motion.div
                  key={comm.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-brand-charcoal border-brand-border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(comm.status)}
                            <h4 className="font-semibold text-brand-text-primary">{comm.title}</h4>
                            <Badge className={`${getPriorityColor(comm.priority)} text-white text-xs`}>
                              {comm.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {messageTypes.find(t => t.value === comm.message_type)?.label || comm.message_type}
                            </Badge>
                          </div>
                          <p className="text-sm text-brand-text-secondary mb-3 line-clamp-2">
                            {comm.content}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs text-brand-text-secondary">
                            <span>To: {comm.target_audience?.join(', ')}</span>
                            <span>•</span>
                            <span>Via: {comm.delivery_method?.join(', ')}</span>
                            <span>•</span>
                            <span>Scheduled: {formatDate(comm.scheduled_send)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {comm.engagement_stats && (
                            <div className="text-right text-xs text-brand-text-secondary">
                              <p>Sent: {comm.engagement_stats.sent_count || 0}</p>
                              <p>Opened: {comm.engagement_stats.opened_count || 0}</p>
                            </div>
                          )}
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {communications.length === 0 && (
                <div className="text-center py-8 text-brand-text-secondary">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No communications found. Create your first communication above.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="scheduled" className="mt-6">
            <div className="space-y-4">
              {communications.filter(c => c.status === 'scheduled').map(comm => (
                <Card key={comm.id} className="bg-brand-charcoal border-brand-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-brand-text-primary">{comm.title}</h4>
                        <p className="text-sm text-brand-text-secondary">
                          Scheduled for: {formatDate(comm.scheduled_send)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Cancel</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {communications.filter(c => c.status === 'scheduled').length === 0 && (
                <div className="text-center py-8 text-brand-text-secondary">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No scheduled communications.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-brand-charcoal">
                <CardContent className="p-4 text-center">
                  <h3 className="text-2xl font-bold text-brand-text-primary">
                    {communications.reduce((acc, c) => acc + (c.engagement_stats?.sent_count || 0), 0)}
                  </h3>
                  <p className="text-sm text-brand-text-secondary">Total Messages Sent</p>
                </CardContent>
              </Card>
              <Card className="bg-brand-charcoal">
                <CardContent className="p-4 text-center">
                  <h3 className="text-2xl font-bold text-brand-text-primary">
                    {communications.reduce((acc, c) => acc + (c.engagement_stats?.opened_count || 0), 0)}
                  </h3>
                  <p className="text-sm text-brand-text-secondary">Total Opens</p>
                </CardContent>
              </Card>
              <Card className="bg-brand-charcoal">
                <CardContent className="p-4 text-center">
                  <h3 className="text-2xl font-bold text-brand-text-primary">
                    {((communications.reduce((acc, c) => acc + (c.engagement_stats?.opened_count || 0), 0) / 
                       Math.max(communications.reduce((acc, c) => acc + (c.engagement_stats?.sent_count || 0), 0), 1)) * 100).toFixed(1)}%
                  </h3>
                  <p className="text-sm text-brand-text-secondary">Open Rate</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CommunicationsEnforcementLog;