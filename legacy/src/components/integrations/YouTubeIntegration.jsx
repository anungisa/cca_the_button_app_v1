import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '../hooks/use-toast';
import { Video, CheckCircle, AlertTriangle, ExternalLink, RefreshCw, Settings, Eye, Play } from 'lucide-react';
import { PlatformSetting } from '@/api/entities';

const YouTubeVideoCard = ({ video, onSelect, isSelected, onPreview }) => (
  <div 
    className={`bg-brand-card-bg border rounded-lg overflow-hidden hover:border-brand-red transition-all ${
      isSelected ? 'border-brand-red ring-2 ring-brand-red' : 'border-brand-border'
    }`}
  >
    <div className="relative aspect-video cursor-pointer" onClick={() => onSelect(video)}>
      <img 
        src={video.snippet.thumbnails.medium.url} 
        alt={video.snippet.title}
        className="w-full h-full object-cover"
      />
      {isSelected && (
        <div className="absolute inset-0 bg-brand-red/20 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-white drop-shadow-lg" />
        </div>
      )}
    </div>
    <div className="p-3">
      <h4 className="font-medium text-brand-text-primary text-sm line-clamp-2 mb-2">
        {video.snippet.title}
      </h4>
      <p className="text-xs text-brand-text-secondary mb-3">
        {new Date(video.snippet.publishedAt).toLocaleDateString()}
      </p>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(video);
          }}
          className="flex-1"
        >
          {isSelected ? 'Selected' : 'Select'}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onPreview(video);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
);

const VideoPreviewModal = ({ video, isOpen, onClose }) => {
  if (!isOpen || !video) return null;

  const videoId = video.id.videoId || video.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div className="bg-brand-card-bg rounded-lg max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-brand-border flex justify-between items-center">
          <h3 className="font-bold text-brand-text-primary">{video.snippet.title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="p-4">
          <p className="text-sm text-brand-text-secondary">
            {video.snippet.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function YouTubeIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [channelId, setChannelId] = useState('');
  const [channelInfo, setChannelInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [currentFeaturedVideo, setCurrentFeaturedVideo] = useState(null);
  const { toast } = useToast();

  // Helper function to call backend
  const callYouTubeFunction = async (params) => {
    try {
      // Dynamically import the function
      const { getYouTubeVideos } = await import('@/api/functions');
      
      const response = await getYouTubeVideos(params);
      
      // Handle different response formats
      return response.data || response;
    } catch (error) {
      console.error('YouTube API call failed:', error);
      throw new Error(error.message || 'Failed to connect to YouTube API');
    }
  };

  // Define fetchVideos first without dependencies
  const fetchVideos = useCallback(async (id) => {
    try {
      const data = await callYouTubeFunction({ 
        action: 'videos',
        channelId: id,
        maxResults: '12'
      });

      if (data.success) {
        setVideos(data.videos || []);
      } else {
        throw new Error(data.error || 'Failed to fetch videos');
      }
    } catch (error) {
      console.error('fetchVideos error:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Load Videos',
        description: error.message || 'Could not fetch videos from YouTube'
      });
    }
  }, [toast]);

  // Now fetchChannelInfo can use fetchVideos
  const fetchChannelInfo = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const data = await callYouTubeFunction({ 
        action: 'channel',
        channelId: id 
      });

      if (data.success) {
        setChannelInfo(data.channel);
        await fetchVideos(id);
      } else {
        throw new Error(data.error || 'Failed to fetch channel');
      }
    } catch (error) {
      console.error('fetchChannelInfo error:', error);
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: error.message || 'Failed to connect to YouTube'
      });
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [fetchVideos, toast]);

  useEffect(() => {
    // Load settings on mount
    const loadSettings = async () => {
      try {
        // Load channel ID from settings
        const [channelSetting] = await PlatformSetting.filter({ 
          setting_key: 'youtube_channel_id' 
        });
        
        if (channelSetting?.setting_value) {
          const savedChannelId = channelSetting.setting_value;
          setChannelId(savedChannelId);
          setIsConnected(true);
          await fetchChannelInfo(savedChannelId);
        }

        // Load featured video
        const [featuredSetting] = await PlatformSetting.filter({ 
          setting_key: 'youtube_featured_video' 
        });
        
        if (featuredSetting?.setting_value) {
          try {
            const featuredData = JSON.parse(featuredSetting.setting_value);
            setCurrentFeaturedVideo(featuredData);
            setSelectedVideo(featuredData);
          } catch (e) {
            console.error('Failed to parse featured video:', e);
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, [fetchChannelInfo]);

  const handleConnect = async () => {
    if (!channelId) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide a Channel ID'
      });
      return;
    }

    try {
      // Save to PlatformSetting
      const [existing] = await PlatformSetting.filter({ 
        setting_key: 'youtube_channel_id' 
      });

      if (existing) {
        await PlatformSetting.update(existing.id, { setting_value: channelId });
      } else {
        await PlatformSetting.create({
          setting_key: 'youtube_channel_id',
          setting_value: channelId,
          setting_type: 'string',
          category: 'integrations',
          description: 'YouTube Channel ID for video integration'
        });
      }

      setIsConnected(true);
      await fetchChannelInfo(channelId);

      toast({
        title: 'Connected Successfully',
        description: 'Your YouTube channel is now connected'
      });
    } catch (error) {
      console.error('handleConnect error:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Connect',
        description: error.message || 'Could not connect to YouTube'
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      const [existing] = await PlatformSetting.filter({ 
        setting_key: 'youtube_channel_id' 
      });

      if (existing) {
        await PlatformSetting.delete(existing.id);
      }

      setIsConnected(false);
      setChannelInfo(null);
      setVideos([]);
      setChannelId('');
      setSelectedVideo(null);
      setCurrentFeaturedVideo(null);
      
      toast({
        title: 'Disconnected',
        description: 'YouTube connection removed'
      });
    } catch (error) {
      console.error('handleDisconnect error:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Disconnect',
        description: error.message || 'Could not disconnect'
      });
    }
  };

  const handleSetFeaturedVideo = async () => {
    if (!selectedVideo) {
      toast({
        variant: 'destructive',
        title: 'No Video Selected',
        description: 'Please select a video first'
      });
      return;
    }

    try {
      const [existing] = await PlatformSetting.filter({ 
        setting_key: 'youtube_featured_video' 
      });

      const videoData = JSON.stringify(selectedVideo);

      if (existing) {
        await PlatformSetting.update(existing.id, { setting_value: videoData });
      } else {
        await PlatformSetting.create({
          setting_key: 'youtube_featured_video',
          setting_value: videoData,
          setting_type: 'object',
          category: 'integrations',
          description: 'Featured YouTube video for landing page'
        });
      }

      setCurrentFeaturedVideo(selectedVideo);

      toast({
        title: 'Featured Video Updated',
        description: 'This video will now appear on the landing page'
      });
    } catch (error) {
      console.error('handleSetFeaturedVideo error:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Update',
        description: error.message || 'Could not update featured video'
      });
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-red-500" />
            Connect YouTube Account
          </CardTitle>
          <CardDescription>
            Connect your Curling Canada YouTube channel to display videos and highlights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Setup Instructions:</strong>
              <ol className="list-decimal ml-4 mt-2 space-y-1 text-sm">
                <li>Go to your <a href="https://www.youtube.com/account_advanced" target="_blank" rel="noopener noreferrer" className="text-brand-red underline">YouTube Channel Settings</a></li>
                <li>Find your Channel ID under "Advanced Settings"</li>
                <li>Copy the Channel ID (starts with UC...)</li>
                <li>Paste it below</li>
              </ol>
              <p className="mt-2 text-xs text-brand-text-secondary">
                Note: YouTube API Key is securely stored on the server
              </p>
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div>
              <Label htmlFor="channelId">YouTube Channel ID</Label>
              <Input
                id="channelId"
                placeholder="UCxxxxxxxxxxxxxxxxxx"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                className="bg-brand-charcoal border-brand-border"
              />
              <p className="text-xs text-brand-text-secondary mt-1">
                Example: UCpfqjOhhh7eqoLMzC8P8dlQ (Curling Canada)
              </p>
            </div>
          </div>

          <Button 
            onClick={handleConnect} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <Video className="w-4 h-4 mr-2" />
                Connect YouTube
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              {channelInfo?.snippet.thumbnails.default.url && (
                <img 
                  src={channelInfo.snippet.thumbnails.default.url} 
                  alt={channelInfo.snippet.title}
                  className="w-20 h-20 rounded-full"
                />
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-brand-text-primary">
                    {channelInfo?.snippet.title}
                  </h3>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                </div>
                <p className="text-sm text-brand-text-secondary mb-2">
                  {channelInfo?.snippet.description}
                </p>
                <div className="flex gap-4 text-sm">
                  <span className="text-brand-text-secondary">
                    <strong className="text-brand-text-primary">{channelInfo?.statistics.subscriberCount}</strong> subscribers
                  </span>
                  <span className="text-brand-text-secondary">
                    <strong className="text-brand-text-primary">{channelInfo?.statistics.videoCount}</strong> videos
                  </span>
                </div>
                {channelInfo && (
                  <a 
                    href={`https://youtube.com/channel/${channelId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-red text-sm hover:underline flex items-center gap-1 mt-2"
                  >
                    View on YouTube <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fetchVideos(channelId)}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Featured Video */}
      {currentFeaturedVideo && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-brand-red" />
              Current Featured Video
            </CardTitle>
            <CardDescription>
              This video is currently displayed on your landing page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <img 
                src={currentFeaturedVideo.snippet.thumbnails.medium.url}
                alt={currentFeaturedVideo.snippet.title}
                className="w-48 h-auto rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-brand-text-primary mb-2">
                  {currentFeaturedVideo.snippet.title}
                </h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  {currentFeaturedVideo.snippet.description?.substring(0, 150)}...
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setPreviewVideo(currentFeaturedVideo)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Selection */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Select Featured Video for Landing Page</CardTitle>
          <CardDescription>
            Choose a video to display as the background on your public landing page
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedVideo && (
            <Alert className="mb-4">
              <Video className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  <strong>Selected:</strong> {selectedVideo.snippet.title}
                </span>
                <Button 
                  size="sm" 
                  onClick={handleSetFeaturedVideo}
                  className="ml-4"
                >
                  Save as Featured
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <YouTubeVideoCard
                key={video.id.videoId}
                video={video}
                onSelect={setSelectedVideo}
                onPreview={setPreviewVideo}
                isSelected={selectedVideo?.id.videoId === video.id.videoId}
              />
            ))}
          </div>

          {videos.length === 0 && !isLoading && (
            <div className="text-center py-8 text-brand-text-secondary">
              No videos found
            </div>
          )}
        </CardContent>
      </Card>

      <VideoPreviewModal 
        video={previewVideo}
        isOpen={!!previewVideo}
        onClose={() => setPreviewVideo(null)}
      />
    </div>
  );
}