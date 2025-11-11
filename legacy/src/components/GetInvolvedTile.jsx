import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  Lock, 
  CheckCircle,
  Star,
  Users,
  Clock
} from 'lucide-react';

export default function GetInvolvedTile({ 
  pathway, 
  userProgress = null,
  isRecommended = false,
  isAccessible = true,
  onClick 
}) {
  const {
    id,
    title,
    description,
    icon: Icon,
    xpReward,
    estimatedTime,
    difficulty,
    participantCount,
    requirements = [],
    nextSteps = []
  } = pathway;

  const getProgressPercent = () => {
    if (!userProgress) return 0;
    return Math.min((userProgress.completedSteps / nextSteps.length) * 100, 100);
  };

  const getDifficultyColor = (level) => {
    switch(level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border-gray-200 text-gray-900 ${
      isRecommended ? 'ring-2 ring-brand-red shadow-lg' : ''
    } ${!isAccessible ? 'opacity-60' : ''}`}>
      {isRecommended && (
        <div className="bg-brand-red text-white text-xs font-bold px-3 py-1 text-center">
          RECOMMENDED FOR YOU
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isRecommended ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-700'
            }`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900 font-semibold">{title}</CardTitle>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className={getDifficultyColor(difficulty)}>
                  {difficulty}
                </Badge>
                {xpReward && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
                    <Star className="w-3 h-3" />
                    {xpReward} XP
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {!isAccessible && <Lock className="w-5 h-5 text-gray-400" />}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {estimatedTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{estimatedTime}</span>
            </div>
          )}
          {participantCount && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{participantCount.toLocaleString()} participants</span>
            </div>
          )}
        </div>

        {/* Progress Bar (if user has started) */}
        {userProgress && getProgressPercent() > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{userProgress.completedSteps}/{nextSteps.length} completed</span>
            </div>
            <Progress value={getProgressPercent()} className="w-full bg-gray-200" />
          </div>
        )}

        {/* Requirements */}
        {requirements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900">Requirements:</h4>
            <ul className="space-y-1">
              {requirements.map((req, index) => (
                <li key={index} className="text-xs text-gray-600 flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Steps Preview */}
        {nextSteps.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900">What you'll do:</h4>
            <ul className="space-y-1">
              {nextSteps.slice(0, 3).map((step, index) => (
                <li key={index} className="text-xs text-gray-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-red rounded-full flex-shrink-0" />
                  {step}
                </li>
              ))}
              {nextSteps.length > 3 && (
                <li className="text-xs text-gray-500">+ {nextSteps.length - 3} more steps</li>
              )}
            </ul>
          </div>
        )}

        <Button 
          onClick={() => onClick(pathway)}
          disabled={!isAccessible}
          className={`w-full font-medium ${
            isRecommended 
              ? 'bg-brand-red hover:bg-red-700 text-white' 
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          } disabled:bg-gray-300 disabled:text-gray-500`}
        >
          {userProgress && getProgressPercent() > 0 ? 'Continue' : 'Get Started'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}