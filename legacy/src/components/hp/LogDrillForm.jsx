import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DrillLog } from '@/api/entities';
import { DrillLibrary } from '@/api/entities';
import { User } from '@/api/entities';
import { Target, Plus } from 'lucide-react';
import { useXP } from '../XPContext';
import WorkflowEngine from '../utils/WorkflowEngine';

const DrillRatingButtons = ({ selectedScore, onScoreChange }) => {
  return (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3, 4, 5].map(score => (
        <Button
          key={score}
          type="button"
          variant={selectedScore === score ? "default" : "outline"}
          className={`w-12 h-12 rounded-full ${
            selectedScore === score ? 'bg-brand-red text-white' : ''
          }`}
          onClick={() => onScoreChange(score)}
        >
          {score}
        </Button>
      ))}
    </div>
  );
};

export default function LogDrillForm({ athleteId, onDrillLogged }) {
  const { user } = useXP();
  const [drills, setDrills] = useState([]);
  const [formData, setFormData] = useState({
    drill_id: '',
    athlete_id: athleteId,
    coach_id: user?.id || '',
    date: new Date().toISOString().split('T')[0],
    score: null,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDrill, setSelectedDrill] = useState(null);

  useEffect(() => {
    loadDrills();
  }, []);

  const loadDrills = async () => {
    try {
      const drillData = await DrillLibrary.list('title');
      setDrills(drillData);
    } catch (error) {
      console.error('Failed to load drills:', error);
    }
  };

  const handleDrillSelect = (drillId) => {
    const drill = drills.find(d => d.id === drillId);
    setSelectedDrill(drill);
    setFormData({...formData, drill_id: drillId});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.score) {
      alert('Please select a performance score.');
      return;
    }

    setIsSubmitting(true);
    try {
      await DrillLog.create(formData);
      
      // Award XP based on drill completion and score
      const xpReward = selectedDrill?.xp_reward || 20;
      const bonusXP = formData.score >= 4 ? 10 : 0; // Bonus for excellent performance
      
      await WorkflowEngine.triggerWorkflow('drill_completed', {
        athlete_id: athleteId,
        coach_id: formData.coach_id,
        drill_id: formData.drill_id,
        score: formData.score,
        xp_awarded: xpReward + bonusXP
      });

      // Reset form
      setFormData({
        drill_id: '',
        athlete_id: athleteId,
        coach_id: user?.id || '',
        date: new Date().toISOString().split('T')[0],
        score: null,
        notes: ''
      });
      setSelectedDrill(null);
      
      if (onDrillLogged) onDrillLogged();
      alert('Drill logged successfully!');
    } catch (error) {
      console.error('Failed to log drill:', error);
      alert('Failed to log drill. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-brand-red" />
          Log Drill Session
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Select Drill *
            </label>
            <Select onValueChange={handleDrillSelect} required>
              <SelectTrigger>
                <SelectValue placeholder="Choose a drill from the library" />
              </SelectTrigger>
              <SelectContent>
                {drills.map(drill => (
                  <SelectItem key={drill.id} value={drill.id}>
                    <div>
                      <div className="font-medium">{drill.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {drill.focus_area} • {drill.difficulty}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDrill && (
            <div className="p-4 bg-brand-charcoal rounded-lg">
              <h4 className="font-semibold text-brand-text-primary mb-2">{selectedDrill.title}</h4>
              <p className="text-sm text-brand-text-secondary mb-2">{selectedDrill.description}</p>
              <div className="flex gap-2">
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                  {selectedDrill.focus_area}
                </span>
                <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                  {selectedDrill.difficulty}
                </span>
                <span className="text-xs bg-amber-600 text-white px-2 py-1 rounded">
                  +{selectedDrill.xp_reward} XP
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Date
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-4">
              Performance Score * (1 = Needs Work, 5 = Excellent)
            </label>
            <DrillRatingButtons 
              selectedScore={formData.score}
              onScoreChange={(score) => setFormData({...formData, score})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Coach Notes
            </label>
            <Textarea
              placeholder="Add specific feedback, observations, or areas for improvement..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Logging Drill...' : 'Log Drill Session'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}