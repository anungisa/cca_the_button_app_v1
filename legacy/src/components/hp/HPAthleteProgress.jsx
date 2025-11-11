import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Award, Calendar } from 'lucide-react';

const HPAthleteProgress = ({ progressData }) => {
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Athlete Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        {progressData ? (
          <div className="space-y-4">
            {/* Training Completion */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-brand-text-primary">Training Completion</span>
                <span className="text-sm text-brand-text-secondary">{progressData.training_completion}%</span>
              </div>
              <Progress value={progressData.training_completion} className="h-2" />
            </div>

            {/* Goals Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-brand-text-primary">Goals Achievement</span>
                <span className="text-sm text-brand-text-secondary">{progressData.goals_achieved}/{progressData.total_goals}</span>
              </div>
              <Progress value={(progressData.goals_achieved / progressData.total_goals) * 100} className="h-2" />
            </div>

            {/* Recent Achievements */}
            <div>
              <h4 className="text-sm font-medium text-brand-text-primary mb-2">Recent Achievements</h4>
              <div className="space-y-2">
                {progressData.recent_achievements?.map(achievement => (
                  <div key={achievement.id} className="flex items-center gap-2 p-2 bg-brand-charcoal/30 rounded">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-brand-text-primary">{achievement.title}</span>
                    <Badge className="bg-amber-900/50 text-amber-300 text-xs ml-auto">
                      {achievement.date}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Milestones */}
            <div>
              <h4 className="text-sm font-medium text-brand-text-primary mb-2">Upcoming Milestones</h4>
              <div className="space-y-2">
                {progressData.upcoming_milestones?.map(milestone => (
                  <div key={milestone.id} className="flex items-center gap-2 p-2 bg-brand-charcoal/30 rounded">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-brand-text-primary">{milestone.title}</span>
                    <Badge variant="outline" className="text-xs ml-auto border-brand-border text-brand-text-secondary">
                      {milestone.target_date}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-brand-text-secondary">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No progress data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HPAthleteProgress;