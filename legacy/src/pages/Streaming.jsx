import React, { useState, useEffect } from 'react';
import { StreamingEvent } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Calendar, 
  Users, 
  Video,
  Archive,
  Youtube,
  Clock,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StreamCard from '../components/streaming/StreamCard';
import UpcomingMatches from '../components/streaming/UpcomingMatches';
import ResponsiveStreamPlayer from '../components/streaming/ResponsiveStreamPlayer';
import YouTubeStreamGrid from '../components/streaming/YouTubeStreamGrid';
import ArchiveGrid from '../components/streaming/ArchiveGrid';
import { DemoStreamingData } from '../components/demo/DemoStreamingData';
import { useXP } from '../components/XPContext';

export default function Streaming() {
  const [activeTab, setActiveTab] = useState('live');
  const [liveStreams, setLiveStreams] = useState([]);
  const [upcomingStreams, setUpcomingStreams] = useState([]);
  const [replays, setReplays] = useState([]);
  const { user } = useXP();
  const [selectedStream, setSelectedStream] = useState(null);

  useEffect(() => {
    loadStreamingContent();
  }, []);

  const loadStreamingContent = async () => {
    try {
      // Load from database
      const events = await StreamingEvent.filter({}, '-start_time', 50);
      
      const now = new Date();
      const live = events.filter(e => {
        const start = new Date(e.start_time);
        const end = new Date(e.end_time);
        return start <= now && end >= now && e.event_type === 'live';
      });
      
      const upcoming = events.filter(e => {
        const start = new Date(e.start_time);
        return start > now;
      });
      
      const past = events.filter(e => {
        const end = new Date(e.end_time);
        return end < now || e.event_type === 'replay';
      });

      setLiveStreams(live.length > 0 ? live : DemoStreamingData.filter(s => s.event_type === 'live'));
      setUpcomingStreams(upcoming.length > 0 ? upcoming : DemoStreamingData.filter(s => s.event_type === 'upcoming'));
      setReplays(past.length > 0 ? past : DemoStreamingData.filter(s => s.event_type === 'replay'));
    } catch (error) {
      console.error('Error loading streams:', error);
      // Fallback to demo data
      setLiveStreams(DemoStreamingData.filter(s => s.event_type === 'live'));
      setUpcomingStreams(DemoStreamingData.filter(s => s.event_type === 'upcoming'));
      setReplays(DemoStreamingData.filter(s => s.event_type === 'replay'));
    }
  };

  const handleStreamSelect = (stream) => {
    setSelectedStream(stream);
  };

  const handleClosePlayer = () => {
    setSelectedStream(null);
  };

  if (selectedStream) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="player"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="h-screen w-screen flex items-center justify-center bg-brand-charcoal"
        >
          <ResponsiveStreamPlayer stream={selectedStream} onClose={handleClosePlayer} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="space-y-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Curling Canada Streaming</h1>
          <p className="text-brand-text-secondary mt-2 max-w-2xl mx-auto">
            Watch live curling events, catch up on replays, and access our video archive
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-brand-card-bg border-brand-border">
            <TabsTrigger value="live">
              <Play className="w-4 h-4 mr-2 text-red-500" />
              Live ({liveStreams.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              <Calendar className="w-4 h-4 mr-2" />
              Upcoming ({upcomingStreams.length})
            </TabsTrigger>
            <TabsTrigger value="replays">
              <Clock className="w-4 h-4 mr-2" />
              Replays ({replays.length})
            </TabsTrigger>
            <TabsTrigger value="youtube">
              <Youtube className="w-4 h-4 mr-2" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="archive">
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-6">
            {liveStreams.length === 0 ? (
              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-12 text-center">
                  <Play className="w-16 h-16 text-brand-text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-brand-text-primary mb-2">
                    No Live Streams
                  </h3>
                  <p className="text-brand-text-secondary">
                    Check back soon for live curling events
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveStreams.map(stream => (
                  <StreamCard 
                    key={stream.id} 
                    stream={stream} 
                    hasAccess={true} 
                    onSelect={handleStreamSelect} 
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            <UpcomingMatches events={upcomingStreams} onSelect={handleStreamSelect} />
          </TabsContent>

          <TabsContent value="replays" className="mt-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Recent Replays</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {replays.map(stream => (
                    <StreamCard 
                      key={stream.id} 
                      stream={stream} 
                      hasAccess={true} 
                      onSelect={handleStreamSelect} 
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="youtube" className="mt-6">
            <YouTubeStreamGrid onSelect={handleStreamSelect} />
          </TabsContent>

          <TabsContent value="archive" className="mt-6">
            <ArchiveGrid onSelect={handleStreamSelect} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}