import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Save, 
  RotateCcw,
  Zap,
  Trophy,
  AlertCircle
} from 'lucide-react';

const CATEGORIES = [
  { id: 'hit', name: 'Hit', icon: '🎯', description: 'Remove opponent stones' },
  { id: 'draw', name: 'Draw', icon: '📐', description: 'Place stones in target area' },
  { id: 'tap', name: 'Tap', icon: '👆', description: 'Light contact with stones' }
];

const AGE_DIVISIONS = [
  { value: '6-7', label: '6-7 Years' },
  { value: '8-9', label: '8-9 Years' },
  { value: '10-12', label: '10-12 Years' }
];

export default function HDTScorecard({ onSubmit, user }) {
  const [ageDivision, setAgeDivision] = useState('');
  const [scores, setScores] = useState({
    hit: [0, 0, 0, 0, 0],
    draw: [0, 0, 0, 0, 0],
    tap: [0, 0, 0, 0, 0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateScore = (category, index, value) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 5) {
      const newScores = { ...scores };
      newScores[category][index] = numValue;
      setScores(newScores);
    }
  };

  const calculateTotals = () => {
    const hit_total = scores.hit.reduce((sum, score) => sum + score, 0);
    const draw_total = scores.draw.reduce((sum, score) => sum + score, 0);
    const tap_total = scores.tap.reduce((sum, score) => sum + score, 0);
    const grand_total = hit_total + draw_total + tap_total;
    
    return { hit_total, draw_total, tap_total, grand_total };
  };

  const resetScores = () => {
    setScores({
      hit: [0, 0, 0, 0, 0],
      draw: [0, 0, 0, 0, 0],
      tap: [0, 0, 0, 0, 0]
    });
  };

  const handleSubmit = async () => {
    if (!ageDivision) {
      alert('Please select your age division');
      return;
    }

    setIsSubmitting(true);
    
    const totals = calculateTotals();
    const scoreData = {
      age_division: ageDivision,
      scores,
      totals
    };

    const success = await onSubmit(scoreData);
    
    if (success) {
      alert('Score submitted successfully! You earned CurlPoints!');
      resetScores();
    } else {
      alert('Failed to submit score. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Age Division Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-red" />
            Digital Scorecard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Select Your Age Division
            </label>
            <Select value={ageDivision} onValueChange={setAgeDivision}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Choose age division" />
              </SelectTrigger>
              <SelectContent>
                {AGE_DIVISIONS.map((division) => (
                  <SelectItem key={division.value} value={division.value}>
                    {division.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {ageDivision && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Scoring Instructions</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Enter scores from 0-5 for each attempt</li>
                    <li>• Complete 5 attempts in each category</li>
                    <li>• 0 = Complete miss, 5 = Perfect execution</li>
                    <li>• Ask your coach for help if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scoring Grid */}
      {CATEGORIES.map((category) => (
        <Card key={category.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <span className="capitalize">{category.name}</span>
                <p className="text-sm font-normal text-gray-600">{category.description}</p>
              </div>
              <Badge className="bg-gray-100 text-gray-800 ml-auto">
                Total: {scores[category.id].reduce((sum, score) => sum + score, 0)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {scores[category.id].map((score, index) => (
                <div key={index} className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attempt {index + 1}
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    value={score}
                    onChange={(e) => updateScore(category.id, index, e.target.value)}
                    className="text-center text-lg font-bold"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Totals Summary */}
      <Card className="bg-gradient-to-r from-brand-red to-red-700 text-white">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Score Summary</h3>
            <div className="text-5xl font-bold mb-2">{totals.grand_total}</div>
            <p className="text-red-100">Total Score</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{totals.hit_total}</div>
              <div className="text-red-100 text-sm">Hit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totals.draw_total}</div>
              <div className="text-red-100 text-sm">Draw</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totals.tap_total}</div>
              <div className="text-red-100 text-sm">Tap</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={resetScores}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-brand-red"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!ageDivision || isSubmitting || totals.grand_total === 0}
              className="bg-white text-brand-red hover:bg-gray-100"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Submit Score
                </>
              )}
            </Button>
          </div>

          {totals.grand_total > 0 && (
            <div className="text-center mt-4">
              <Badge className="bg-amber-500 text-white">
                <Zap className="w-3 h-3 mr-1" />
                Earn 25+ CurlPoints
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}