import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Indicator showing when AI is preloading predicted data
 */
export const PredictiveLoadingIndicator = ({ predictions = [], className = "" }) => {
  if (predictions.length === 0) return null;

  const highConfidencePredictions = predictions.filter(p => p.confidence > 0.7);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-4 right-4 z-50 ${className}`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <Brain className="w-4 h-4 animate-pulse" />
        <span className="text-sm font-medium">AI Preparing Your Data</span>
        <Badge variant="secondary" className="bg-white/20 text-white">
          {highConfidencePredictions.length}
        </Badge>
      </div>
      
      {highConfidencePredictions.length > 0 && (
        <div className="mt-2 space-y-1">
          {highConfidencePredictions.slice(0, 3).map((prediction, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded text-xs flex items-center gap-2"
            >
              <Zap className="w-3 h-3" />
              <span>{prediction.reasoning}</span>
              <Badge variant="outline" className="text-xs">
                {Math.round(prediction.confidence * 100)}%
              </Badge>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

/**
 * Offline status indicator
 */
export const OfflineStatusIndicator = ({ queuedActions = [], className = "" }) => {
  const isOffline = !navigator.onLine;
  
  if (!isOffline && queuedActions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`fixed bottom-4 left-4 z-50 ${className}`}
    >
      <div className={`px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${
        isOffline ? 'bg-orange-600 text-white' : 'bg-green-600 text-white'
      }`}>
        <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-orange-300' : 'bg-green-300'} animate-pulse`} />
        <span className="text-sm font-medium">
          {isOffline ? 'Working Offline' : 'Syncing Changes'}
        </span>
        {queuedActions.length > 0 && (
          <Badge variant="secondary" className="bg-white/20 text-white">
            {queuedActions.length}
          </Badge>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Real-time analytics indicator
 */
export const AnalyticsIndicator = ({ alerts = [], className = "" }) => {
  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  
  if (alerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`fixed top-20 right-4 z-50 ${className}`}
    >
      <div className={`px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${
        criticalAlerts.length > 0 ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
      }`}>
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span className="text-sm font-medium">
          {criticalAlerts.length > 0 ? 'Critical Alert' : 'Analytics Active'}
        </span>
        <Badge variant="secondary" className="bg-white/20 text-white">
          {alerts.length}
        </Badge>
      </div>
    </motion.div>
  );
};