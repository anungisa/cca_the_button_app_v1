import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  TrendingUp,
  Filter,
  Search,
  Download,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SessionHistoryPanel({ sessions, user, accessLevel, onSessionUpdate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);

  const filteredSessions = sessions.filter(session =>
    session.session_tags?.some(tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    ) || session.session_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getSessionTypeColor = (type) => {
    switch(type) {
      case 'training': return 'bg-blue-900/50 text-blue-300';
      case 'competition': return 'bg-red-900/50 text-red-300';
      case 'test': return 'bg-purple-900/50 text-purple-300';
      case 'demo': return 'bg-green-900/50 text-green-300';
      default: return 'bg-gray-900/50 text-gray-300';
    }
  };

  if (sessions.length === 0) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-brand-text-primary mb-2">
            No Sessions Yet
          </h3>
          <p className="text-brand-text-secondary mb-6">
            Connect your Smart Broom and start your first session to see data here.
          </p>
          <Button className="bg-brand-red hover:bg-red-700">
            Connect Device
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-brand-text-primary mb-1">
              {sessions.length}
            </div>
            <div className="text-sm text-brand-text-secondary">Total Sessions</div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-brand-text-primary mb-1">
              {Math.round(sessions.reduce((sum, s) => sum + (s.session_duration_minutes || 0), 0) / 60)}h
            </div>
            <div className="text-sm text-brand-text-secondary">Training Time</div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-brand-text-primary mb-1">
              {sessions.reduce((sum, s) => sum + (s.total_sweeps || 0), 0)}
            </div>
            <div className="text-sm text-brand-text-secondary">Total Sweeps</div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-brand-text-primary mb-1">
              {sessions.filter(s => s.is_personal_best).length}
            </div>
            <div className="text-sm text-brand-text-secondary">Personal Bests</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
                <Input
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-brand-charcoal border-brand-border text-brand-text-primary"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-brand-border text-brand-text-secondary">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="border-brand-border text-brand-text-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg hover:border-brand-red transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-charcoal rounded-full flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-brand-red" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-brand-text-primary">
                          {new Date(session.session_date).toLocaleDateString()}
                        </h3>
                        <Badge className={getSessionTypeColor(session.session_type)}>
                          {session.session_type}
                        </Badge>
                        {session.is_personal_best && (
                          <Badge className="bg-amber-500 text-white">PB</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-brand-text-secondary">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(session.session_duration_minutes)}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {session.total_sweeps} sweeps
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {accessLevel !== 'free' && session.performance_metrics && (
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-sm text-brand-text-secondary">Avg Pressure</p>
                          <p className="font-bold text-brand-text-primary">
                            {session.performance_metrics.avg_pressure?.toFixed(1)}N
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-brand-text-secondary">Consistency</p>
                          <p className="font-bold text-brand-text-primary">
                            {session.performance_metrics.rhythm_score?.toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSession(session)}
                      className="border-brand-border text-brand-text-secondary"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>

                {session.session_tags && session.session_tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {session.session_tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="text-xs bg-brand-charcoal px-2 py-1 rounded text-brand-text-secondary"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Session Details Modal (simplified) */}
      {selectedSession && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Session Details
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSession(null)}
                className="text-brand-text-secondary"
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-brand-text-secondary mb-1">Date & Time</p>
                <p className="text-brand-text-primary font-semibold">
                  {new Date(selectedSession.session_date).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-brand-text-secondary mb-1">Duration</p>
                <p className="text-brand-text-primary font-semibold">
                  {formatDuration(selectedSession.session_duration_minutes)}
                </p>
              </div>
              <div>
                <p className="text-sm text-brand-text-secondary mb-1">Total Sweeps</p>
                <p className="text-brand-text-primary font-semibold">
                  {selectedSession.total_sweeps}
                </p>
              </div>
              <div>
                <p className="text-sm text-brand-text-secondary mb-1">Session Type</p>
                <Badge className={getSessionTypeColor(selectedSession.session_type)}>
                  {selectedSession.session_type}
                </Badge>
              </div>
            </div>

            {accessLevel !== 'free' && selectedSession.performance_metrics && (
              <div className="mt-6">
                <h4 className="font-semibold text-brand-text-primary mb-4">Performance Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-brand-charcoal rounded-lg">
                    <p className="text-sm text-brand-text-secondary">Avg Pressure</p>
                    <p className="text-lg font-bold text-brand-text-primary">
                      {selectedSession.performance_metrics.avg_pressure?.toFixed(1)}N
                    </p>
                  </div>
                  <div className="text-center p-3 bg-brand-charcoal rounded-lg">
                    <p className="text-sm text-brand-text-secondary">Max Pressure</p>
                    <p className="text-lg font-bold text-brand-text-primary">
                      {selectedSession.performance_metrics.max_pressure?.toFixed(1)}N
                    </p>
                  </div>
                  <div className="text-center p-3 bg-brand-charcoal rounded-lg">
                    <p className="text-sm text-brand-text-secondary">Consistency</p>
                    <p className="text-lg font-bold text-brand-text-primary">
                      {selectedSession.performance_metrics.rhythm_score?.toFixed(0)}%
                    </p>
                  </div>
                  <div className="text-center p-3 bg-brand-charcoal rounded-lg">
                    <p className="text-sm text-brand-text-secondary">Overall Score</p>
                    <p className="text-lg font-bold text-brand-text-primary">
                      {selectedSession.performance_metrics.overall_score?.toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}