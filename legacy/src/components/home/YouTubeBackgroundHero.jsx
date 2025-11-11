import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@/api/entities';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { PlatformSetting } from '@/api/entities';

export default function YouTubeBackgroundHero() {
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    loadFeaturedVideo();
  }, []);

  const loadFeaturedVideo = async () => {
    try {
      const [setting] = await PlatformSetting.filter({ 
        setting_key: 'youtube_featured_video' 
      });
      
      if (setting?.setting_value) {
        const videoData = JSON.parse(setting.setting_value);
        setFeaturedVideo(videoData);
      }
    } catch (error) {
      console.error('Error loading featured video:', error);
      setVideoError(true);
    }
  };

  // If no featured video or error, use image background
  if (!featuredVideo || videoError) {
    return (
      <div className="relative isolate overflow-hidden min-h-screen flex items-center">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1620151525692-2b79a54620f4?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/85 via-brand-charcoal/75 to-brand-charcoal/90"></div>
        <HeroContent />
      </div>
    );
  }

  const videoId = featuredVideo.id.videoId || featuredVideo.id;

  return (
    <div className="relative isolate overflow-hidden min-h-screen flex items-center">
      {/* YouTube Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
          className="absolute top-1/2 left-1/2 w-[177.77777778vh] h-[56.25vw] min-h-full min-w-full transform -translate-x-1/2 -translate-y-1/2"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          style={{ pointerEvents: 'none' }}
          onError={() => setVideoError(true)}
        />
      </div>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/85 via-brand-charcoal/75 to-brand-charcoal/90"></div>
      
      <HeroContent />
    </div>
  );
}

function HeroContent() {
  return (
    <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center">
      <div className="flex justify-center mb-8">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7eb979759_Curling-Canada_CMYK.png"
          alt="Curling Canada"
          className="h-20 w-auto drop-shadow-2xl"
        />
      </div>
      
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-2xl">
        Welcome to The Button
      </h1>
      
      <p className="text-xl md:text-2xl leading-8 text-gray-100 mb-10 max-w-3xl mx-auto">
        Your all-in-one digital hub for the Canadian curling community. Connect with clubs, track events, and get rewarded for your passion.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button 
          size="lg" 
          onClick={() => User.login()} 
          className="bg-brand-red hover:bg-red-700 text-lg px-8 py-6 shadow-2xl hover:shadow-brand-red/50 transition-all transform hover:scale-105"
        >
          Get Started <ArrowRight className="ml-2 w-6 h-6" />
        </Button>
        <Link to={createPageUrl('AboutCurling')}>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 transform hover:scale-105 transition-all"
          >
            Learn More <span aria-hidden="true" className="ml-2">→</span>
          </Button>
        </Link>
      </div>

      <div className="mt-16 animate-bounce">
        <svg className="w-6 h-6 mx-auto text-white/70" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </div>
  );
}