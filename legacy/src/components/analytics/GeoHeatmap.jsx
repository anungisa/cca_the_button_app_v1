import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, BarChart3 } from 'lucide-react';

const regionCoordinates = {
  'Alberta': { lat: 53.9333, lng: -116.5765, color: '#ef4444' },
  'British Columbia': { lat: 53.7267, lng: -127.6476, color: '#3b82f6' },
  'Manitoba': { lat: 53.7609, lng: -98.8139, color: '#10b981' },
  'New Brunswick': { lat: 46.5653, lng: -66.4619, color: '#f59e0b' },
  'Newfoundland and Labrador': { lat: 53.1355, lng: -57.6604, color: '#8b5cf6' },
  'Northwest Territories': { lat: 64.8255, lng: -124.8457, color: '#ec4899' },
  'Nova Scotia': { lat: 44.6820, lng: -63.7443, color: '#06b6d4' },
  'Nunavut': { lat: 70.2998, lng: -83.1076, color: '#84cc16' },
  'Ontario': { lat: 51.2538, lng: -85.3232, color: '#f97316' },
  'Prince Edward Island': { lat: 46.5107, lng: -63.4168, color: '#14b8a6' },
  'Quebec': { lat: 53.9214, lng: -73.2187, color: '#a855f7' },
  'Saskatchewan': { lat: 52.9399, lng: -106.4509, color: '#22c55e' },
  'Yukon': { lat: 64.0685, lng: -139.0918, color: '#eab308' }
};

export default function GeoHeatmap({ data, metric = 'completion_rate' }) {
  const [selectedMetric, setSelectedMetric] = useState(metric);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const getMetricValue = (regionData, metric) => {
    switch (metric) {
      case 'completion_rate':
        return regionData.responded / regionData.total * 100;
      case 'member_count':
        return regionData.totalMembers || 0;
      case 'readiness_index':
        return regionData.readinessScore || 0;
      default:
        return 0;
    }
  };

  const getColorIntensity = (value, maxValue) => {
    return Math.min(value / maxValue, 1);
  };

  const maxValue = Math.max(...Object.values(data || {}).map(d => getMetricValue(d, selectedMetric)));

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-red" />
            Geographic Distribution
          </CardTitle>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completion_rate">Survey Completion %</SelectItem>
              <SelectItem value="member_count">Member Count</SelectItem>
              <SelectItem value="readiness_index">Readiness Index</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Visualization */}
          <div className="relative h-64 bg-brand-charcoal rounded-lg p-4">
            <div className="text-center text-brand-text-secondary">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Interactive map visualization would render here</p>
              <p className="text-xs mt-1">Showing {selectedMetric.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Regional Cards */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {Object.entries(data || {}).map(([region, regionData]) => {
              const value = getMetricValue(regionData, selectedMetric);
              const intensity = getColorIntensity(value, maxValue);
              
              return (
                <div
                  key={region}
                  className="flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer"
                  style={{
                    backgroundColor: `rgba(239, 68, 68, ${intensity * 0.3})`,
                    borderLeft: `4px solid rgba(239, 68, 68, ${intensity})`
                  }}
                  onMouseEnter={() => setHoveredRegion(region)}
                  onMouseLeave={() => setHoveredRegion(null)}
                >
                  <div>
                    <div className="font-medium text-brand-text-primary text-sm">{region}</div>
                    <div className="text-xs text-brand-text-secondary">
                      {regionData.responded}/{regionData.total} clubs
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-brand-text-primary">
                      {selectedMetric === 'completion_rate' ? `${value.toFixed(1)}%` : value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between text-xs text-brand-text-secondary">
          <span>Low</span>
          <div className="flex-1 h-2 mx-4 rounded-full bg-gradient-to-r from-gray-300 to-red-500"></div>
          <span>High</span>
        </div>
      </CardContent>
    </Card>
  );
}