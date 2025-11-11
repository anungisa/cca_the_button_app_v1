import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Youtube, Search, ExternalLink, Play, Clock } from 'lucide-react';
import { PlatformSetting } from '@/api/entities';

export default function YouTubeStreamGrid({ onSelect }) {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [featuredVideo, setFeaturedVideo] = useState(null);

  useEffect(() => {
    loadYouTubeContent();
  }, []);

  const loadYouTubeContent = async () => {
    try {
      // Load featured video
      const [featuredSetting] = await PlatformSetting.filter({ 
        setting_key: 'youtube_featured_video' 
      });
      
      if (featuredSetting?.setting_value) {
        try {
          const featured = JSON.parse(featuredSetting.setting_value);
          setFeaturedVideo(featured);
        } catch (e) {
          console.error('Failed to parse featured video:', e);
        }
      }

      // Load sample YouTube videos (in production, this would call the YouTube API)
      const sampleVideos = [
        {
          id: { videoId: 'sample1' },
          snippet: {
            title: '2024 Tim Hortons Brier - Championship Final',
            description: 'Watch the thrilling conclusion to the 2024 Brier',
            thumbnails: { medium: { url: 'https://images.unsplash.com/photo-1516985080664-ed2fc6a32937?w=400' } },
            publishedAt: '2024-03-17T00:00:00Z'
          }
        },
        {
          id: { videoId: 'sample2' },
          snippet: {
            title: 'Scotties Tournament of Hearts 2024 - Semi-Final',
            description: 'Team Einarson vs Team Jones in an epic showdown',
            thumbnails: { medium: { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400' } },
            publishedAt: '2024-02-24T00:00:00Z'
          }
        },
        {
          id: { videoId: 'sample3' },
          snippet: {
            title: 'World Curling Championships 2024 - Highlights',
            description: 'Best moments from the World Championships',
            thumbnails: { medium: { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400' } },
            publishedAt: '2024-04-07T00:00:00Z'
          }
        }
      ];

      setVideos(sampleVideos);
    } catch (error) {
      console.error('Error loading YouTube content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVideos = videos.filter(video =>
    video.snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.snippet.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVideoClick = (video) => {
    const videoId = video.id.videoId || video.id;
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  if (isLoading) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-brand-text-secondary">Loading YouTube content...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Featured Video */}
      {featuredVideo && (
        <Card className="bg-brand-card-bg border-brand-border overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-500" />
              Featured Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group" onClick={() => handleVideoClick(featuredVideo)}>
                <img 
                  src={featuredVideo.snippet.thumbnails.medium.url} 
                  alt={featuredVideo.snippet.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-16 h-16 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-text-primary mb-2">{featuredVideo.snippet.title}</h3>
                <p className="text-brand-text-secondary mb-4">{featuredVideo.snippet.description}</p>
                <Button onClick={() => handleVideoClick(featuredVideo)} className="bg-red-600 hover:bg-red-700">
                  <Youtube className="w-4 h-4 mr-2" />
                  Watch on YouTube
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
          <Input
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-brand-charcoal border-brand-border"
          />
        </div>
        <Button asChild variant="outline">
          <a href="https://www.youtube.com/@CurlingCanada" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit Channel
          </a>
        </Button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <Card key={video.id.videoId || video.id} className="bg-brand-card-bg border-brand-border overflow-hidden hover:border-brand-red transition-colors cursor-pointer group" onClick={() => handleVideoClick(video)}>
            <div className="relative aspect-video">
              <img 
                src={video.snippet.thumbnails.medium.url} 
                alt={video.snippet.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-12 h-12 text-white" />
              </div>
              <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                <Youtube className="w-3 h-3 mr-1" />
                YouTube
              </Badge>
            </div>
            <CardContent className="p-4">
              <h4 className="font-semibold text-brand-text-primary mb-2 line-clamp-2">
                {video.snippet.title}
              </h4>
              <p className="text-sm text-brand-text-secondary line-clamp-2 mb-3">
                {video.snippet.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
                <Clock className="w-3 h-3" />
                {new Date(video.snippet.publishedAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-12 text-center">
            <Youtube className="w-16 h-16 text-brand-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-brand-text-primary mb-2">
              No videos found
            </h3>
            <p className="text-brand-text-secondary">
              Try adjusting your search terms
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}