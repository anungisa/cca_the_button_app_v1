import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Play, Pause, Volume2, Maximize, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveStreamPlayer({ stream, onClose, hasAccess = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);

  if (!stream) {
    return null;
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-brand-text-primary">{stream.name}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative aspect-video bg-black">
            {hasAccess ? (
              // Actual video player would go here
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">Live Stream Player</p>
                  <p className="text-sm opacity-70">Now playing: {stream.name}</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Premium Content</h3>
                  <p className="text-sm opacity-70 mb-4">Upgrade to Curling+ to watch</p>
                  <Button className="bg-brand-red hover:bg-red-700">
                    Upgrade Now
                  </Button>
                </div>
              </div>
            )}

            {/* Player Controls */}
            {hasAccess && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePlayPause}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        className="w-20"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600 text-white">LIVE</Badge>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stream Info */}
          <div className="p-4">
            <p className="text-brand-text-secondary text-sm mb-2">{stream.description}</p>
            <div className="flex flex-wrap gap-2">
              {(stream.tags || []).map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-brand-charcoal text-brand-text-secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}