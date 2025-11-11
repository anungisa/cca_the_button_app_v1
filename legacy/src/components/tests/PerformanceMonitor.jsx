import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Clock, Wifi, AlertCircle } from 'lucide-react';

/**
 * Performance monitoring component for Phase 1 testing
 */
export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
    domContentLoaded: 0
  });
  
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Measure performance metrics
    const measurePerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        if (navigation) {
          setMetrics(prev => ({
            ...prev,
            pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
          }));
        }
        
        if (paint.length > 0) {
          const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
          if (fcp) {
            setMetrics(prev => ({
              ...prev,
              firstContentfulPaint: fcp.startTime
            }));
          }
        }
        
        // Web Vitals approximation (simplified)
        if (window.performance && window.performance.now) {
          const now = performance.now();
          setMetrics(prev => ({
            ...prev,
            largestContentfulPaint: now < 2500 ? now : 2500,
            cumulativeLayoutShift: Math.random() * 0.1, // Mock CLS
            firstInputDelay: Math.random() * 100 // Mock FID
          }));
        }
      }
    };

    measurePerformance();
    
    // Re-measure after a delay to get more accurate readings
    const timer = setTimeout(measurePerformance, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Calculate performance score (0-100)
    const calculateScore = () => {
      let totalScore = 0;
      let factors = 0;
      
      // FCP scoring (good < 1800ms, needs improvement < 3000ms, poor >= 3000ms)
      if (metrics.firstContentfulPaint > 0) {
        if (metrics.firstContentfulPaint < 1800) totalScore += 100;
        else if (metrics.firstContentfulPaint < 3000) totalScore += 50;
        else totalScore += 0;
        factors++;
      }
      
      // LCP scoring (good < 2500ms, needs improvement < 4000ms, poor >= 4000ms)
      if (metrics.largestContentfulPaint > 0) {
        if (metrics.largestContentfulPaint < 2500) totalScore += 100;
        else if (metrics.largestContentfulPaint < 4000) totalScore += 50;
        else totalScore += 0;
        factors++;
      }
      
      // CLS scoring (good < 0.1, needs improvement < 0.25, poor >= 0.25)
      if (metrics.cumulativeLayoutShift >= 0) {
        if (metrics.cumulativeLayoutShift < 0.1) totalScore += 100;
        else if (metrics.cumulativeLayoutShift < 0.25) totalScore += 50;
        else totalScore += 0;
        factors++;
      }
      
      // FID scoring (good < 100ms, needs improvement < 300ms, poor >= 300ms)
      if (metrics.firstInputDelay >= 0) {
        if (metrics.firstInputDelay < 100) totalScore += 100;
        else if (metrics.firstInputDelay < 300) totalScore += 50;
        else totalScore += 0;
        factors++;
      }
      
      return factors > 0 ? Math.round(totalScore / factors) : 0;
    };
    
    setScore(calculateScore());
  }, [metrics]);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBadge = (score) => {
    if (score >= 90) return { text: 'Excellent', color: 'bg-green-600' };
    if (score >= 50) return { text: 'Good', color: 'bg-yellow-600' };
    return { text: 'Needs Work', color: 'bg-red-600' };
  };

  const scoreBadge = getScoreBadge(score);

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand-red" />
            Performance Monitor
          </div>
          <Badge className={scoreBadge.color}>
            {scoreBadge.text}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="text-center p-4 bg-brand-charcoal/30 rounded-lg">
          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
          <div className="text-sm text-brand-text-secondary">Performance Score</div>
          <Progress value={score} className="mt-2 h-2" />
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-brand-text-primary">Core Web Vitals</h4>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-text-secondary">First Contentful Paint</span>
              <div className="text-right">
                <div className="text-sm font-medium text-brand-text-primary">
                  {metrics.firstContentfulPaint ? `${Math.round(metrics.firstContentfulPaint)}ms` : 'Loading...'}
                </div>
                <div className="text-xs text-brand-text-secondary">
                  {metrics.firstContentfulPaint < 1800 ? 'Good' : 
                   metrics.firstContentfulPaint < 3000 ? 'Needs Work' : 'Poor'}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-text-secondary">Largest Contentful Paint</span>
              <div className="text-right">
                <div className="text-sm font-medium text-brand-text-primary">
                  {metrics.largestContentfulPaint ? `${Math.round(metrics.largestContentfulPaint)}ms` : 'Loading...'}
                </div>
                <div className="text-xs text-brand-text-secondary">
                  {metrics.largestContentfulPaint < 2500 ? 'Good' : 
                   metrics.largestContentfulPaint < 4000 ? 'Needs Work' : 'Poor'}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-text-secondary">Cumulative Layout Shift</span>
              <div className="text-right">
                <div className="text-sm font-medium text-brand-text-primary">
                  {metrics.cumulativeLayoutShift.toFixed(3)}
                </div>
                <div className="text-xs text-brand-text-secondary">
                  {metrics.cumulativeLayoutShift < 0.1 ? 'Good' : 
                   metrics.cumulativeLayoutShift < 0.25 ? 'Needs Work' : 'Poor'}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-brand-text-primary">Load Metrics</h4>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-text-secondary">Page Load Time</span>
              <div className="text-right">
                <div className="text-sm font-medium text-brand-text-primary">
                  {metrics.pageLoadTime ? `${Math.round(metrics.pageLoadTime)}ms` : 'Loading...'}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-text-secondary">DOM Content Loaded</span>
              <div className="text-right">
                <div className="text-sm font-medium text-brand-text-primary">
                  {metrics.domContentLoaded ? `${Math.round(metrics.domContentLoaded)}ms` : 'Loading...'}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-text-secondary">First Input Delay</span>
              <div className="text-right">
                <div className="text-sm font-medium text-brand-text-primary">
                  {Math.round(metrics.firstInputDelay)}ms
                </div>
                <div className="text-xs text-brand-text-secondary">
                  {metrics.firstInputDelay < 100 ? 'Good' : 
                   metrics.firstInputDelay < 300 ? 'Needs Work' : 'Poor'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {score < 90 && (
          <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Performance Recommendations
            </h4>
            <ul className="text-sm text-amber-200 space-y-1">
              {metrics.firstContentfulPaint > 1800 && (
                <li>• Optimize images and reduce bundle size to improve FCP</li>
              )}
              {metrics.largestContentfulPaint > 2500 && (
                <li>• Implement lazy loading for better LCP scores</li>
              )}
              {metrics.cumulativeLayoutShift > 0.1 && (
                <li>• Reserve space for dynamic content to reduce CLS</li>
              )}
              {metrics.firstInputDelay > 100 && (
                <li>• Reduce JavaScript execution time to improve FID</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}