import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Smartphone, Zap, Gauge, TrendingUp, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const SmartBroomSessionView = ({ session, isOpen, onClose }) => {
  if (!session) return null;

  const chartData = session.session_data.map((d, index) => ({
    time: index,
    pressure: d.pressure,
    motion: d.motionBurst * 100
  }));

  const StatCard = ({ icon: Icon, value, label, unit, color }) => (
    <div className="bg-brand-card-bg/50 p-4 rounded-lg text-center">
      <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
      <p className="text-2xl font-bold text-brand-text-primary">{value}<span className="text-lg font-normal text-brand-text-secondary">{unit}</span></p>
      <p className="text-xs text-brand-text-secondary">{label}</p>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-brand-charcoal border-brand-border text-brand-text-primary">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Smartphone className="w-6 h-6 text-brand-red" />
            Smart Broom Session
          </DialogTitle>
          <DialogDescription>
            {format(new Date(session.session_date), 'MMMM d, yyyy HH:mm')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-4">
            <StatCard icon={Gauge} value={session.performance_metrics.overall_score} label="Overall Score" unit="/100" color="text-green-400" />
            <StatCard icon={Zap} value={session.performance_metrics.avg_pressure} label="Avg. Pressure" unit=" N" color="text-blue-400" />
            <StatCard icon={TrendingUp} value={session.performance_metrics.rhythm_score} label="Rhythm" unit="/100" color="text-purple-400" />
            <StatCard icon={CheckCircle} value={session.total_sweeps} label="Total Sweeps" unit="" color="text-amber-400" />
        </div>
        <div>
            <h4 className="font-semibold mb-2">Session Playback</h4>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" />
                    <XAxis dataKey="time" stroke="var(--brand-text-secondary)" fontSize={12} unit="s" />
                    <YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} unit="N" />
                    <YAxis yAxisId="right" orientation="right" stroke="#a855f7" fontSize={12} unit="%" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--brand-charcoal)', border: '1px solid var(--brand-border)' }} />
                    <Line yAxisId="left" type="monotone" dataKey="pressure" stroke="#3b82f6" strokeWidth={2} dot={false} name="Pressure" />
                    <Line yAxisId="right" type="monotone" dataKey="motion" stroke="#a855f7" strokeWidth={2} dot={false} name="Motion" />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SmartBroomSessionView;