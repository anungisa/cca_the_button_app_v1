import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SafeSportTraining } from '@/api/entities';
import { SafeSportCompletion } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Users, Clock, CheckCircle, Loader2, Plus } from 'lucide-react';

export default function LearningModuleHub() {
  const [modules, setModules] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [trainingData, completionData] = await Promise.all([
          SafeSportTraining.list(),
          SafeSportCompletion.list()
        ]);
        setModules(trainingData);
        setCompletions(completionData);
      } catch (error) {
        console.error('Error loading learning modules:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const getCompletionRate = (moduleId) => {
    const moduleCompletions = completions.filter(c => c.training_id === moduleId).length;
    return moduleCompletions > 0 ? Math.round((moduleCompletions / 100) * 100) : 0; // Mock calculation
  };

  const getTypeColor = (type) => {
    const colors = {
      respect_in_sport: 'bg-blue-600 text-white',
      nccp: 'bg-green-600 text-white',
      concussion: 'bg-red-600 text-white',
      mental_health: 'bg-purple-600 text-white',
      inclusion: 'bg-yellow-600 text-white',
      governance: 'bg-indigo-600 text-white',
      custom: 'bg-gray-600 text-white'
    };
    return colors[type] || 'bg-gray-600 text-white';
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-brand-text-primary">Learning Modules</h3>
          <p className="text-brand-text-secondary">Manage safe sport training modules and track completion rates.</p>
        </div>
        <Button className="bg-brand-red hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map(module => {
          const completionRate = getCompletionRate(module.id);
          return (
            <Card key={module.id} className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <PlayCircle className="w-4 h-4" />
                      {module.module_name}
                    </CardTitle>
                    <Badge className={`${getTypeColor(module.training_type)} mt-2`}>
                      {module.training_type.replace('_', ' ')}
                    </Badge>
                  </div>
                  {module.is_mandatory && (
                    <Badge variant="destructive" className="text-xs">Required</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-brand-text-secondary space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>{module.duration_minutes} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    <span>For: {module.target_roles?.join(', ')}</span>
                  </div>
                  {module.xp_reward > 0 && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>{module.xp_reward} XP reward</span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Completion Rate</span>
                    <span>{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Edit Module
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    View Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}