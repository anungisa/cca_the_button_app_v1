import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Zap,
  Trophy,
  Users,
  Target
} from 'lucide-react';
import { useXP } from '../XPContext';
import { ConsentRegistry } from '../utils/ConsentRegistry';
import PredictionModal from '../pointsbet/PredictionModal';
import LiveOddsPanel from '../pointsbet/LiveOddsPanel';
import { useIsMobile } from '../hooks/useIsMobile';

export default function ResponsiveStreamPlayer({ 
  stream, 
  game = null, 
  onXPEarned = null,
  showPredictions = true 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [showOdds, setShowOdds] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [lastXPAward, setLastXPAward] = useState(0);
  const [hasGamblingConsent, setHasGamblingConsent] = useState(false);
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const isMobile = useIsMobile();
  const { user, awardPoints } = useXP();

  useEffect(() => {
    checkGamblingConsent();
  }, []);

  useEffect(() => {
    // XP tracking for watch time
    const interval = setInterval(() => {
      if (isPlaying) {
        setWatchTime(prev => prev + 1);
        
        // Award XP every 15 minutes (900 seconds)
        if (watchTime > 0 && watchTime % 900 === 0 && watchTime !== lastXPAward) {
          awardXP();
          setLastXPAward(watchTime);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, watchTime, lastXPAward]);

  const checkGamblingConsent = async () => {
    const consent = await ConsentRegistry.hasConsent('prediction_games');
    setHasGamblingConsent(consent);
    setShowOdds(consent && showPredictions);
  };

  const awardXP = async () => {
    if (!user || !awardPoints) return;
    
    const baseXP = 15;
    const isLive = stream?.event_type === 'live';
    const isPrimeTime = new Date().getHours() >= 19 && new Date().getHours() <= 22;
    
    let multiplier = 1;
    if (isLive) multiplier *= 1.5;
    if (isPrimeTime) multiplier *= 1.2;
    
    const finalXP = Math.round(baseXP * multiplier);
    
    await awardPoints(finalXP, 'livestream', `Watched ${stream?.name} for 15 minutes`, stream?.id);
    onXPEarned?.(finalXP);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatWatchTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Main Video Player */}
      <motion.div
        ref={containerRef}
        className={`relative bg-black rounded-lg overflow-hidden ${
          isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video'
        }`}
        layout
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={stream?.premium_url || stream?.free_highlight_url}
          poster={stream?.thumbnail_url}
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Video Controls Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="icon"
              variant="ghost"
              onClick={togglePlay}
              className="w-16 h-16 bg-white/20 hover:bg-white/30 text-white"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button size="icon" variant="ghost" onClick={toggleMute} className="text-white hover:bg-white/20">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <span className="text-white text-sm font-medium">
                  {formatWatchTime(watchTime)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* XP Indicator */}
                {user && (
                  <Badge className="bg-amber-500/80 text-white">
                    <Zap className="w-3 h-3 mr-1" />
                    +{Math.floor(watchTime / 900) * 15} XP
                  </Badge>
                )}

                {/* Live Indicator */}
                {stream?.event_type === 'live' && (
                  <Badge className="bg-red-500 text-white animate-pulse">
                    LIVE
                  </Badge>
                )}

                {!isMobile && (
                  <Button size="icon" variant="ghost" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stream Info Overlay */}
        <div className="absolute top-4 left-4 right-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white font-bold text-lg md:text-xl">{stream?.name}</h3>
              {stream?.description && (
                <p className="text-white/80 text-sm mt-1">{stream?.description}</p>
              )}
            </div>
            
            {stream?.tags && (
              <div className="flex flex-wrap gap-1">
                {stream.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} className="bg-white/20 text-white text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Interactive Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live Game Predictions */}
        {showPredictions && game && hasGamblingConsent && (
          <Card className="bg-brand-card-bg border-brand-border lg:col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-brand-text-primary flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Live Predictions
                </h4>
                <Badge className="bg-purple-600 text-white">Sponsored by PointsBet</Badge>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => setShowPredictionModal(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Make Your Predictions
                </Button>
                
                <div className="text-center text-xs text-brand-text-secondary">
                  Earn XP for every prediction • 18+ only
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stream Stats */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <h4 className="font-semibold text-brand-text-primary mb-3">Your Session</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-brand-text-secondary text-sm">Watch Time</span>
                <span className="font-bold text-brand-text-primary">{formatWatchTime(watchTime)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-text-secondary text-sm">XP Earned</span>
                <span className="font-bold text-amber-400">{Math.floor(watchTime / 900) * 15}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-text-secondary text-sm">Next XP</span>
                <span className="font-bold text-brand-text-primary">
                  {15 - (watchTime % 900 / 60)} min
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Odds Panel */}
      <AnimatePresence>
        {showOdds && game && (
          <LiveOddsPanel game={game} />
        )}
      </AnimatePresence>

      {/* Prediction Modal */}
      <PredictionModal
        isOpen={showPredictionModal}
        onClose={() => setShowPredictionModal(false)}
        game={game}
        currentEnd={game?.current_end || 1}
      />
    </div>
  );
}