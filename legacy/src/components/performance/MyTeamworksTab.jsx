import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTeamworksAPI } from '../hooks/useTeamworksAPI';
import { useXP } from '../XPContext';
import MyTeamworksCalendar from '../hp/MyTeamworksCalendar';
import TeamDocumentsPanel from '../hp/TeamDocumentsPanel';
import HPMessagesInbox from '../hp/HPMessagesInbox';
import HPAthleteProgress from '../hp/HPAthleteProgress';
import HPSyncAudit from '../hp/HPSyncAudit';
import { 
  Calendar, 
  FileText, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Zap,
  Clock,
  MapPin,
  Users
} from 'lucide-react';

export default function MyTeamworksTab({ user }) {
  const [activeSection, setActiveSection] = useState('schedule');
  const { 
    teamworksData, 
    isLoading, 
    lastSync, 
    syncNow,
    acknowledgeItem 
  } = useTeamworksAPI(user?.id);
  const { awardPoints } = useXP();

  const handleAcknowledge = async (itemId, itemType) => {
    try {
      await acknowledgeItem(itemId, itemType);
      await awardPoints(15, 'teamworks_acknowledge', `Acknowledged ${itemType}`);
    } catch (error) {
      console.error('Error acknowledging item:', error);
    }
  };

  const getSessionTypeIcon = (type) => {
    switch (type) {
      case 'training': return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'travel': return <MapPin className="w-4 h-4 text-green-400" />;
      case 'event': return <Calendar className="w-4 h-4 text-red-400" />;
      case 'meeting': return <Users className="w-4 h-4 text-purple-400" />;
      default: return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSessionTypeBadge = (type) => {
    const colors = {
      training: 'bg-blue-900/50 text-blue-300',
      travel: 'bg-green-900/50 text-green-300',
      event: 'bg-red-900/50 text-red-300',
      meeting: 'bg-purple-900/50 text-purple-300'
    };
    return colors[type] || 'bg-gray-700 text-gray-300';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Sync Status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">My Teamworks</h2>
          <p className="text-sm text-brand-text-secondary">
            Last synced: {lastSync ? new Date(lastSync).toLocaleString() : 'Never'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={syncNow} size="sm">
            <Clock className="w-4 h-4 mr-2" />
            Sync Now
          </Button>
          <Button variant="outline" asChild size="sm">
            <a href="https://app.teamworks.com" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Teamworks
            </a>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Upcoming Sessions</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {teamworksData?.upcoming_sessions?.length || 0}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Unread Messages</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {teamworksData?.unread_messages || 0}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Pending Tasks</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {teamworksData?.pending_assignments?.length || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">XP Available</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {(teamworksData?.pending_assignments?.length || 0) * 15}
                </p>
              </div>
              <Zap className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Schedule & Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Schedule */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Upcoming Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teamworksData?.upcoming_sessions?.length > 0 ? (
                <div className="space-y-3">
                  {teamworksData.upcoming_sessions.slice(0, 5).map((session, index) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getSessionTypeIcon(session.type)}
                        <div>
                          <h4 className="font-medium text-brand-text-primary">{session.title}</h4>
                          <p className="text-sm text-brand-text-secondary">
                            {new Date(session.start_time).toLocaleDateString('en-CA', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {session.location && (
                            <p className="text-xs text-brand-text-secondary">{session.location}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSessionTypeBadge(session.type)}>
                          {session.type}
                        </Badge>
                        {session.has_conflict && (
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        )}
                        {session.smart_broom_enabled && (
                          <Badge className="bg-amber-900/50 text-amber-300 text-xs">
                            Smart Broom
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {teamworksData.upcoming_sessions.length > 5 && (
                    <Button variant="outline" className="w-full mt-4">
                      View All Sessions ({teamworksData.upcoming_sessions.length})
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-brand-text-secondary">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming sessions scheduled</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignments & Logs */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Assignments & Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teamworksData?.pending_assignments?.length > 0 ? (
                <div className="space-y-3">
                  {teamworksData.pending_assignments.map((assignment, index) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-brand-text-secondary" />
                        <div>
                          <h4 className="font-medium text-brand-text-primary">{assignment.title}</h4>
                          <p className="text-sm text-brand-text-secondary">
                            Due: {new Date(assignment.due_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={assignment.is_overdue ? 'bg-red-900/50 text-red-300' : 'bg-blue-900/50 text-blue-300'}>
                          {assignment.is_overdue ? 'Overdue' : 'Pending'}
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={() => handleAcknowledge(assignment.id, 'assignment')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          15 XP
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-brand-text-secondary">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>All assignments completed!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Messages & Documents */}
        <div className="space-y-6">
          {/* Team Chat Snippet */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  Team Messages
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://app.teamworks.com/messages" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Full Chat
                  </a>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teamworksData?.recent_messages?.length > 0 ? (
                <div className="space-y-3">
                  {teamworksData.recent_messages.slice(0, 3).map((message, index) => (
                    <div key={message.id} className="p-3 bg-brand-charcoal/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-brand-text-primary">
                          {message.sender_name}
                        </span>
                        <span className="text-xs text-brand-text-secondary">
                          {new Date(message.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-brand-text-secondary line-clamp-2">
                        {message.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-brand-text-secondary">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent messages</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Coach Notes & Files */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-400" />
                Coach Notes & Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teamworksData?.coach_updates?.length > 0 ? (
                <div className="space-y-3">
                  {teamworksData.coach_updates.slice(0, 3).map((update, index) => (
                    <div key={update.id} className="p-3 bg-brand-charcoal/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-brand-text-primary">
                          {update.title}
                        </span>
                        {!update.acknowledged && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAcknowledge(update.id, 'coach_note')}
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Ack (+15 XP)
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-brand-text-secondary mb-2">
                        {new Date(update.created_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-brand-text-secondary line-clamp-2">
                        {update.content}
                      </p>
                      {update.file_url && (
                        <Button variant="outline" size="sm" className="mt-2">
                          <FileText className="w-3 h-3 mr-1" />
                          View File
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-brand-text-secondary">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent updates</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Smart Broom Integration */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Smart Broom Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teamworksData?.smart_broom_sessions?.length > 0 ? (
                <div className="space-y-2">
                  {teamworksData.smart_broom_sessions.slice(0, 3).map((session, index) => (
                    <div key={session.id} className="flex items-center justify-between p-2 bg-amber-900/20 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-brand-text-primary">
                          {session.session_name}
                        </p>
                        <p className="text-xs text-brand-text-secondary">
                          {new Date(session.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className="bg-amber-900/50 text-amber-300 text-xs">
                        Synced
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-brand-text-secondary">
                  <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No Smart Broom sessions detected</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}