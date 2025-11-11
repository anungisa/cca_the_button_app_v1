import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LogIn } from 'lucide-react';

const shotOptions = {
  positions: ['lead', 'second', 'third', 'skip'],
  turn_targets: ['CW C', 'CW S', 'CCW C', 'CCW S'],
  draw_types: ['Draws', 'Tick'],
  hit_types: ['Finesse', 'Power'],
  executions: ['Make', 'Partial', 'Limited', 'Xmiss'],
  deficiencies: ['None', 'Light', 'Heavy', 'Undercurl', 'Overcurl', 'Management'],
};

export default function ShotEntryForm({ athletes, onSaveShot, disabled }) {
  const [shotData, setShotData] = useState({
    athlete_id: '',
    end_number: 1,
    shot_number: '1A',
    position: 'lead',
    execution: 'Make',
    deficiency: 'None',
    notes: '',
  });

  const handleInputChange = (field, value) => {
    setShotData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!shotData.athlete_id) {
      alert('Please select an athlete.');
      return;
    }
    onSaveShot(shotData);
    // Reset for next shot, but keep end number
    setShotData(prev => ({
      ...prev,
      shot_number: '',
      notes: '',
      execution: 'Make',
      deficiency: 'None',
      athlete_id: '',
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-brand-card-bg border border-brand-border rounded-lg">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="athlete_id">Athlete</Label>
          <Select value={shotData.athlete_id} onValueChange={(v) => handleInputChange('athlete_id', v)} required>
            <SelectTrigger id="athlete_id"><SelectValue placeholder="Select Athlete" /></SelectTrigger>
            <SelectContent>{athletes.map(a => <SelectItem key={a.id} value={a.id}>{a.full_name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="end_number">End</Label>
          <Input id="end_number" type="number" min="1" max="12" value={shotData.end_number} onChange={(e) => handleInputChange('end_number', parseInt(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="shot_number">Shot</Label>
          <Input id="shot_number" value={shotData.shot_number} onChange={(e) => handleInputChange('shot_number', e.target.value)} placeholder="e.g., 1A" />
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Select value={shotData.position} onValueChange={(v) => handleInputChange('position', v)}>
            <SelectTrigger id="position"><SelectValue /></SelectTrigger>
            <SelectContent>{shotOptions.positions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="execution">Execution</Label>
          <Select value={shotData.execution} onValueChange={(v) => handleInputChange('execution', v)}>
            <SelectTrigger id="execution"><SelectValue /></SelectTrigger>
            <SelectContent>{shotOptions.executions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="deficiency">Deficiency</Label>
          <Select value={shotData.deficiency} onValueChange={(v) => handleInputChange('deficiency', v)}>
            <SelectTrigger id="deficiency"><SelectValue /></SelectTrigger>
            <SelectContent>{shotOptions.deficiencies.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" value={shotData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} placeholder="e.g., Picked, throw through..." />
        </div>
      </div>
      <Button type="submit" disabled={disabled} className="w-full bg-brand-red hover:bg-red-700">
        <LogIn className="w-4 h-4 mr-2" /> Log Shot
      </Button>
    </form>
  );
}