import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  Play, 
  Square, 
  Timer, 
  Activity,
  Gauge,
  Target,
  Zap,
  Tag
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function SessionMetaForm({ onStart, disabled, isRecording }) {
  const [type, setType] = useState('training');
  const [tags, setTags] = useState('');

  return (
    <div className="space-y-4">
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <Label htmlFor="sessionType" className="text-brand-text-secondary">Session Type</Label>
            <Select value={type} onValueChange={setType} disabled={isRecording}>
              <SelectTrigger id="sessionType" className="w-full bg-brand-charcoal border-brand-border text-brand-text-primary">
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent className="bg-brand-card-bg border-brand-border text-brand-text-primary">
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="test">Performance Test</SelectItem>
                <SelectItem value="competition">Competition</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sessionTags" className="text-brand-text-secondary">Tags (comma-separated)</Label>
            <Input 
              id="sessionTags"
              placeholder="e.g., Pre-Event, Fatigue Drill"
              value={tags}
              onChange={e => setTags(e.target.value)}
              disabled={isRecording}
              className="bg-brand-charcoal border-brand-border text-brand-text-primary"
            />
          </div>
      </div>
       <Button 
          onClick={() => onStart({ type, tags: tags.split(',').map(t => t.trim()).filter(Boolean) })} 
          disabled={disabled || isRecording}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Session
        </Button>
    </div>
  );
}

function MetricCard({ icon, value, label, unit, color }) {
    const Icon = icon;
    return (
        <Card className={`bg-brand-charcoal border-t-4 ${color}`}>
          <CardContent className="p-4 text-center">
            <Icon className="w-6 h-6 mx-auto mb-2 text-brand-text-secondary" />
            <div className="text-2xl font-bold text-brand-text-primary">{value}<span className="text-lg text-brand-text-secondary ml-1">{unit}</span></div>
            <div className="text-xs text-brand-text-secondary">{label}</div>
          </CardContent>
        </Card>
    );
}

export default function SweepSessionView({ 
  currentSession, 
  isRecording, 
  onStartRecording, 
  onStopRecording,
  isConnected 
}) {
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionMeta, setSessionMeta] = useState({ type: 'training', tags: [] });
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    avgPressure: 0, maxPressure: 0, totalSweeps: 0, currentPressure: 0
  });

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    } else {
      setSessionTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (currentSession.length > 0) {
      const pressures = currentSession.map(d => d.pressure).filter(p => p > 0);
      const avgPressure = pressures.reduce((a, b) => a + b, 0) / pressures.length || 0;
      const maxPressure = pressures.length > 0 ? Math.max(...pressures) : 0;
      const currentPressure = pressures[pressures.length - 1] || 0;
      setRealTimeMetrics({
        avgPressure: avgPressure.toFixed(1),
        maxPressure: maxPressure.toFixed(1),
        totalSweeps: pressures.length,
        currentPressure: currentPressure.toFixed(1)
      });
    }
  }, [currentSession]);

  const handleStartSession = (meta) => {
    setSessionMeta(meta);
    onStartRecording();
  };

  const handleStopSession = async () => {
    await onStopRecording(sessionMeta);
  };

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  const chartData = currentSession.slice(-100).map((p, i) => ({ i, pressure: p.pressure, motion: p.motionBurst }));

  return (
    <div className="space-y-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-brand-text-primary">
            <span className="flex items-center gap-2"><Activity className="w-5 h-5" />Live Session</span>
            <Badge className={`${isRecording ? 'bg-red-500/80 animate-pulse' : 'bg-brand-charcoal'} text-white`}>
              {isRecording ? 'RECORDING' : 'STOPPED'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-brand-text-secondary">
              <Timer className="w-4 h-4" />
              <span className="text-2xl font-mono text-brand-text-primary">{formatTime(sessionTime)}</span>
            </div>
            <div className="flex gap-2">
              {!isRecording ? (
                <SessionMetaForm onStart={handleStartSession} disabled={!isConnected} isRecording={isRecording} />
              ) : (
                <Button onClick={handleStopSession} className="bg-red-600 hover:bg-red-700 text-white">
                  <Square className="w-4 h-4 mr-2" />Stop & Save
                </Button>
              )}
            </div>
          </div>
          {!isConnected && !isRecording && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 text-center">
              <p className="text-sm text-yellow-300">Connect your Smart Broom to start a new session.</p>
            </div>
          )}
          {isRecording && (
              <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-brand-text-secondary"/>
                  {sessionMeta.tags.map(tag => <Badge key={tag} variant="secondary" className="bg-brand-charcoal text-brand-text-secondary border-brand-border">{tag}</Badge>)}
              </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={Zap} value={realTimeMetrics.currentPressure} label="Current Pressure" unit="N" color="border-blue-500" />
        <MetricCard icon={Target} value={realTimeMetrics.avgPressure} label="Avg Pressure" unit="N" color="border-green-500" />
        <MetricCard icon={Gauge} value={realTimeMetrics.maxPressure} label="Max Pressure" unit="N" color="border-purple-500" />
        <MetricCard icon={Activity} value={realTimeMetrics.totalSweeps} label="Total Sweeps" unit="" color="border-orange-500" />
      </div>

      {isRecording && chartData.length > 0 && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader><CardTitle className="text-brand-text-primary">Live Telemetry</CardTitle></CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPressure" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ED1C24" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ED1C24" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="i" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                  <Area type="monotone" dataKey="pressure" stroke="#ED1C24" fillOpacity={1} fill="url(#colorPressure)" strokeWidth={2} dot={false} name="Pressure (N)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}