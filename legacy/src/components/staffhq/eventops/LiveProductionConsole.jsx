import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Game } from '@/api/entities';
import { StreamingEvent } from '@/api/entities';
import { LiveInteraction } from '@/api/entities';
import { Radio, Video, Users, MessageSquare, Settings, AlertTriangle, Play, Pause, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

const StreamControlPanel = ({ event, onUpdateStream }) => {
  const [streamStatus, setStreamStatus] = useState('offline');
  const [streamSettings, setStreamSettings] = useState({
    quality: '1080p',
    bitrate: '4000',
    enableChat: true,
    enableTrivia: true,
    moderationLevel: 'medium'
  });

  const handleStreamToggle = () => {
    const newStatus = streamStatus === 'live' ? 'offline' : 'live';
    setStreamStatus(newStatus);
    onUpdateStream({ status: newStatus });
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="w-5 h-5" />
          Live Stream Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${streamStatus === 'live' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="font-medium text-brand-text-primary">
              {streamStatus === 'live' ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
          <Button 
            onClick={handleStreamToggle}
            variant={streamStatus === 'live' ? 'destructive' : 'default'}
            className="flex items-center gap-2"
          >
            {streamStatus === 'live' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {streamStatus === 'live' ? 'Stop Stream' : 'Go Live'}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Stream Quality</label>
            <Select value={streamSettings.quality} onValueChange={(value) => 
              setStreamSettings({...streamSettings, quality: value})
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="720p">720p HD</SelectItem>
                <SelectItem value="1080p">1080p Full HD</SelectItem>
                <SelectItem value="4k">4K Ultra HD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Bitrate (kbps)</label>
            <Input 
              value={streamSettings.bitrate}
              onChange={(e) => setStreamSettings({...streamSettings, bitrate: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enable Live Chat</label>
            <Switch 
              checked={streamSettings.enableChat}
              onCheckedChange={(checked) => setStreamSettings({...streamSettings, enableChat: checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enable Live Trivia</label>
            <Switch 
              checked={streamSettings.enableTrivia}
              onCheckedChange={(checked) => setStreamSettings({...streamSettings, enableTrivia: checked})}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LiveInteractionPanel = ({ event }) => {
  const [interactions, setInteractions] = useState([]);
  const [stats, setStats] = useState({
    totalViewers: 0,
    chatMessages: 0,
    triviaResponses: 0,
    sponsorEngagements: 0
  });

  useEffect(() => {
    if (event) {
      loadLiveInteractions();
      // Set up real-time updates
      const interval = setInterval(loadLiveInteractions, 5000);
      return () => clearInterval(interval);
    }
  }, [event]);

  const loadLiveInteractions = async () => {
    try {
      const liveInteractions = await LiveInteraction.filter(
        { event_id: event.id },
        '-timestamp',
        50
      );
      setInteractions(liveInteractions);

      // Calculate stats
      const chatCount = liveInteractions.filter(i => i.interaction_type === 'chat_message').length;
      const triviaCount = liveInteractions.filter(i => i.interaction_type === 'trivia_answer').length;
      const sponsorCount = liveInteractions.filter(i => i.interaction_type === 'sponsor_quest_completed').length;

      setStats({
        totalViewers: Math.floor(Math.random() * 1000) + 500, // Mock data
        chatMessages: chatCount,
        triviaResponses: triviaCount,
        sponsorEngagements: sponsorCount
      });
    } catch (error) {
      console.error('Failed to load live interactions:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-brand-text-primary">{stats.totalViewers}</div>
            <div className="text-sm text-brand-text-secondary">Live Viewers</div>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-brand-text-primary">{stats.chatMessages}</div>
            <div className="text-sm text-brand-text-secondary">Chat Messages</div>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-brand-text-primary">{stats.triviaResponses}</div>
            <div className="text-sm text-brand-text-secondary">Trivia Responses</div>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-brand-text-primary">{stats.sponsorEngagements}</div>
            <div className="text-sm text-brand-text-secondary">Sponsor Clicks</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Interactions Feed */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Live Interaction Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {interactions.length > 0 ? (
              interactions.map((interaction, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-brand-charcoal rounded">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="text-sm text-brand-text-primary">
                      {interaction.interaction_type.replace('_', ' ')}
                    </div>
                    <div className="text-xs text-brand-text-secondary">
                      {format(new Date(interaction.timestamp), 'HH:mm:ss')}
                    </div>
                  </div>
                  {interaction.xp_awarded > 0 && (
                    <Badge className="bg-brand-gold text-brand-charcoal">
                      +{interaction.xp_awarded} XP
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-brand-text-secondary">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No live interactions yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function LiveProductionConsole({ event }) {
  const [activeGames, setActiveGames] = useState([]);
  const [streamEvents, setStreamEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (event) {
      loadProductionData();
    }
  }, [event]);

  const loadProductionData = async () => {
    try {
      const [games, streams] = await Promise.all([
        Game.filter({ event_id: event.id, status: 'live' }),
        StreamingEvent.filter({ name: event.name })
      ]);
      
      setActiveGames(games);
      setStreamEvents(streams);
    } catch (error) {
      console.error('Failed to load production data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStream = (updates) => {
    console.log('Stream updates:', updates);
    // Handle stream updates
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Live Production Console</h2>
          <p className="text-brand-text-secondary">Real-time streaming and audience engagement management</p>
        </div>
        <Badge className="bg-brand-red text-white px-3 py-1">
          {event.name}
        </Badge>
      </div>

      <Tabs defaultValue="stream" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-brand-card-bg border-brand-border">
          <TabsTrigger value="stream">Stream Control</TabsTrigger>
          <TabsTrigger value="engagement">Live Engagement</TabsTrigger>
          <TabsTrigger value="analytics">Real-time Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="stream" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StreamControlPanel event={event} onUpdateStream={handleUpdateStream} />
            
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Active Games</CardTitle>
              </CardHeader>
              <CardContent>
                {activeGames.length > 0 ? (
                  <div className="space-y-3">
                    {activeGames.map(game => (
                      <div key={game.id} className="p-3 bg-brand-charcoal rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-brand-text-primary">
                              {game.team1?.name} vs {game.team2?.name}
                            </p>
                            <p className="text-sm text-brand-text-secondary">
                              Sheet {game.sheet} • End {game.current_end}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-brand-text-primary">
                              {game.team1?.total_score || 0} - {game.team2?.total_score || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-brand-text-secondary">
                    <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No active games</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          <LiveInteractionPanel event={event} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Real-time Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-brand-text-secondary">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Advanced Analytics Dashboard</h3>
                <p>Real-time viewer analytics, engagement metrics, and performance insights coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}