
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MessageCircle, 
  FileText, 
  Target, 
  Clock,
  MapPin,
  User,
  ChevronRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import useTeamworksAPI from '../hooks/useTeamworksAPI';
import { useXP } from '../XPContext';

export default function HPDashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { getCalendarData, getDocuments, getMessages, connectionStatus } = useTeamworksAPI();
  const { awardPoints } = useXP();

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [calendarData, documentsData, messagesData] = await Promise.all([
        getCalendarData(user.id),
        getDocuments(user.id),
        getMessages(user.id, true) // unread only
      ]);

      setDashboardData({
        todayEvents: calendarData.today_events || [],
        upcomingEvents: calendarData.upcoming_events?.slice(0, 3) || [],
        trainingBlocks: calendarData.training_blocks || [],
        pendingDocs: documentsData.documents?.filter(doc => doc.status === 'pending_review') || [],
        unreadMessages: messagesData.messages || [],
        unreadCount: messagesData.unread_count || 0
      });
    } catch (error) {
      console.error('Error loading HP dashboard:', error);
      // Set empty data instead of throwing error to prevent UI crash
      setDashboardData({
        todayEvents: [],
        upcomingEvents: [],
        trainingBlocks: [],
        pendingDocs: [],
        unreadMessages: [],
        unreadCount: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'training': return 'bg-blue-600';
      case 'fitness': return 'bg-green-600';
      case 'mental_training': return 'bg-purple-600';
      case 'competition': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getDocumentTypeIcon = (type) => {
    switch (type) {
      case 'nutrition': return '🥗';
      case 'fitness': return '💪';
      case 'logistics': return '✈️';
      case 'compliance': return '📋';
      default: return '📄';
    }
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
      {/* Connection Status */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'mock' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-brand-text-primary">
                Teamworks Status: {connectionStatus === 'connected' ? 'Connected' : 
                                 connectionStatus === 'mock' ? 'Demo Mode' : 'Disconnected'}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              High Performance
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData?.todayEvents?.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.todayEvents.map((event, index) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 bg-brand-charcoal rounded-lg">
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-brand-text-primary">{event.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-brand-text-secondary">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(event.start_time).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit' 
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {event.coach}
                          </div>
                        </div>
                      {event.xp_eligible && (
                        <Badge className="bg-amber-900/50 text-amber-300 text-xs">
                          +50 XP
                        </Badge>
                      )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-brand-text-secondary">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No events scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Messages & Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Unread Messages */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-400" />
                  Messages
                </div>
                {dashboardData?.unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {dashboardData.unreadCount}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData?.unreadMessages?.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.unreadMessages.slice(0, 3).map((message) => (
                    <div key={message.id} className="p-3 bg-brand-charcoal rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-brand-text-primary text-sm">
                          {message.from}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {message.from_role}
                        </Badge>
                      </div>
                      <p className="text-sm text-brand-text-secondary mb-1">
                        {message.subject}
                      </p>
                      <p className="text-xs text-brand-text-secondary truncate">
                        {message.preview}
                      </p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={createPageUrl('HPMessages')}>
                      View All Messages
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4 text-brand-text-secondary">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No new messages</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Documents */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-400" />
                Action Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData?.pendingDocs?.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.pendingDocs.slice(0, 3).map((doc) => (
                    <div key={doc.id} className="p-3 bg-brand-charcoal rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getDocumentTypeIcon(doc.type)}</span>
                        <span className="font-medium text-brand-text-primary text-sm">
                          {doc.title}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-brand-text-secondary">
                          Due: {new Date(doc.due_date).toLocaleDateString()}
                        </span>
                        <Badge className="bg-amber-900/50 text-amber-300 text-xs">
                          +{doc.xp_reward} XP
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={createPageUrl('HPDocuments')}>
                      View All Documents
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4 text-brand-text-secondary">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">All caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Training Blocks & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Training Block */}
        {dashboardData?.trainingBlocks?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Current Training Block
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.trainingBlocks.map((block) => (
                  <div key={block.id} className="p-4 bg-brand-charcoal rounded-lg">
                    <h4 className="font-medium text-brand-text-primary mb-2">{block.title}</h4>
                    <p className="text-sm text-brand-text-secondary mb-3">{block.focus}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-brand-text-secondary">
                        {new Date(block.start_date).toLocaleDateString()} - {new Date(block.end_date).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${block.completion_rate}%` }}
                          />
                        </div>
                        <span className="text-xs text-brand-text-secondary">
                          {block.completion_rate}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Coming Up
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData?.upcomingEvents?.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 bg-brand-charcoal rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-brand-text-primary text-sm">
                          {event.title}
                        </span>
                        <Badge className={`${getEventTypeColor(event.type)} text-white text-xs`}>
                          {event.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-brand-text-secondary">
                        <span>{new Date(event.start_time).toLocaleDateString()}</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-brand-text-secondary">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No upcoming events</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
