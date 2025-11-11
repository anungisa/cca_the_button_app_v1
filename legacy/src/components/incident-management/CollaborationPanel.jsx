
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users,
  MessageSquare,
  UserPlus,
  Eye,
  EyeOff,
  Clock,
  Send,
  AlertTriangle,
  Shield,
  User, // Added from outline
  Lock // Added from outline
} from 'lucide-react';
import { Incident } from '@/api/entities';
import { NotificationService } from '../utils/NotificationService';

const departmentUsers = {
  club_services: [
    { id: '1', name: 'Sarah Johnson', role: 'Club Services Manager' },
    { id: '2', name: 'Mike Chen', role: 'Club Relations Specialist' }
  ],
  safe_sport: [
    { id: '3', name: 'Dr. Lisa Park', role: 'Safe Sport Director' },
    { id: '4', name: 'James Wilson', role: 'Safe Sport Coordinator' }
  ],
  tech: [
    { id: '5', name: 'Alex Kumar', role: 'IT Manager' },
    { id: '6', name: 'Emma Davis', role: 'Systems Administrator' }
  ],
  events: [
    { id: '7', name: 'Tom Rodriguez', role: 'Events Director' },
    { id: '8', name: 'Kelly O\'Brien', role: 'Event Coordinator' }
  ]
};

export default function CollaborationPanel({ incident, onUpdate }) {
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaborator, setNewCollaborator] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false); // Renamed from isInternalComment
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed from isUpdating
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [currentUser, setCurrentUser] = useState({ name: 'Current User' }); // Added

  if (!incident) {
    return null;
  }

  useEffect(() => {
    loadCollaborators();
  }, [incident]);

  useEffect(() => {
    // In a real app, you would fetch the current user's data
    // For now, we'll use a mock user
    // const user = await User.me();
    // setCurrentUser(user);
  }, []);

  const loadCollaborators = () => {
    // Extract collaborators from communications log
    const uniqueCollaborators = new Set();
    incident.communications_log?.forEach(log => {
      if (log.author_name !== 'System') {
        uniqueCollaborators.add(log.author_name);
      }
    });
    setCollaborators(Array.from(uniqueCollaborators));
  };

  const addCollaborator = async () => {
    if (!newCollaborator.trim()) return;

    setIsSubmitting(true); // Changed from setIsUpdating
    try {
      const updateData = {
        ...incident,
        communications_log: [
          ...(incident.communications_log || []),
          {
            date: new Date().toISOString(),
            author_name: 'System',
            note: `${newCollaborator} added as collaborator`,
            channel: 'system_note'
          }
        ]
      };

      await Incident.update(incident.id, updateData);

      // Send notification to new collaborator
      await NotificationService.sendCollaborationInvite({
        incidentId: incident.id,
        title: incident.title,
        collaborator: newCollaborator,
        invitedBy: currentUser.name // Using currentUser.name
      });

      setNewCollaborator('');
      onUpdate();
    } catch (error) {
      console.error('Error adding collaborator:', error);
    } finally {
      setIsSubmitting(false); // Changed from setIsUpdating
    }
  };

  const handleAddComment = async () => { // Renamed from addComment
    if (!newComment.trim()) return;

    setIsSubmitting(true); // Changed from setIsUpdating
    try {
      const updateData = {
        ...incident,
        communications_log: [
          ...(incident.communications_log || []),
          {
            date: new Date().toISOString(),
            author_name: currentUser.name, // Using currentUser.name
            note: newComment,
            channel: isInternal ? 'internal_note' : 'comment', // Using isInternal
            is_internal: isInternal // Using isInternal
          }
        ]
      };

      await Incident.update(incident.id, updateData);

      // Send notifications to collaborators if not internal
      if (!isInternal) { // Using isInternal
        await NotificationService.sendCommentNotification({
          incidentId: incident.id,
          title: incident.title,
          comment: newComment,
          author: currentUser.name, // Using currentUser.name
          collaborators: collaborators
        });
      }

      setNewComment('');
      setIsInternal(false); // Using setIsInternal
      onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false); // Changed from setIsUpdating
    }
  };

  const getDepartmentUsers = (department) => {
    return departmentUsers[department] || [];
  };

  const getCommentVisibility = (log) => {
    if (log.is_internal) {
      return { icon: EyeOff, color: 'text-orange-400', label: 'Internal Only' };
    }
    return { icon: Eye, color: 'text-green-400', label: 'Visible to All' };
  };

  return (
    <div className="space-y-6">
      {/* Collaborators Management */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Collaboration Team
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Collaborators */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Current Team</Label>
            <div className="flex flex-wrap gap-2">
              {collaborators.length > 0 ? (
                collaborators.map((collaborator, index) => (
                  <div key={index} className="flex items-center gap-2 bg-brand-charcoal/50 px-3 py-1 rounded-full">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {collaborator.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{collaborator}</span>
                  </div>
                ))
              ) : (
                <p className="text-brand-text-secondary text-sm">No collaborators assigned</p>
              )}
            </div>
          </div>

          {/* Add Collaborator */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Add Team Member</Label>
            <div className="flex gap-2">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-48 bg-brand-charcoal border-brand-border">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="club_services">Club Services</SelectItem>
                  <SelectItem value="safe_sport">Safe Sport</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                </SelectContent>
              </Select>

              <Select value={newCollaborator} onValueChange={setNewCollaborator}>
                <SelectTrigger className="flex-1 bg-brand-charcoal border-brand-border">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {getDepartmentUsers(selectedDepartment).map((user) => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.name} - {user.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={addCollaborator} disabled={isSubmitting || !newCollaborator}> {/* Changed from isUpdating */}
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Comment */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-400" />
            Add Comment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your comment or update..."
            className="bg-brand-charcoal border-brand-border"
            rows={3}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="internal-comment"
                checked={isInternal} // Changed from isInternalComment
                onCheckedChange={setIsInternal} // Changed from setIsInternalComment
              />
              <Label htmlFor="internal-comment" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Internal Only
              </Label>
            </div>

            <Button onClick={handleAddComment} disabled={isSubmitting || !newComment.trim()}> {/* Renamed from addComment, changed from isUpdating */}
              <Send className="w-4 h-4 mr-2" />
              Add Comment
            </Button>
          </div>

          {isInternal && ( // Changed from isInternalComment
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-orange-300">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Internal comments are only visible to staff members</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Communications Timeline */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Communications Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {incident.communications_log?.length > 0 ? (
              incident.communications_log
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((log, index) => {
                  const visibility = getCommentVisibility(log);
                  const VisibilityIcon = visibility.icon;

                  return (
                    <div key={index} className="border-l-2 border-brand-border pl-4 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {log.author_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-brand-text-primary">{log.author_name}</span>
                          <Badge variant="outline" className="text-xs">{log.channel}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <VisibilityIcon className={`w-4 h-4 ${visibility.color}`} />
                          <span className="text-xs text-brand-text-secondary">
                            {new Date(log.date).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-brand-text-primary text-sm">{log.note}</p>
                    </div>
                  );
                })
            ) : (
              <p className="text-brand-text-secondary text-center py-4">
                No communications recorded yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
