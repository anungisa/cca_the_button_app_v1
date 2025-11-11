
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Clock, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight,
  MapPin,
  Calendar,
  Award,
  ExternalLink
} from 'lucide-react';

export default function PathwayInfoDrawer({ 
  pathway, 
  isOpen, 
  onClose, 
  onStartPathway,
  userProgress = null 
}) {
  if (!pathway) return null;

  const {
    title,
    description,
    longDescription,
    icon: Icon,
    xpReward,
    estimatedTime,
    difficulty,
    participantCount,
    requirements = [],
    nextSteps = [],
    resources = [],
    events = [],
    testimonials = []
  } = pathway;

  const getProgressPercent = () => {
    if (!userProgress || nextSteps.length === 0) return 0;
    return Math.min((userProgress.completedSteps / nextSteps.length) * 100, 100);
  };

  const getDifficultyColor = (level) => {
    switch(level) {
      case 'beginner': return 'bg-green-900/50 text-green-300 border-green-400/30';
      case 'intermediate': return 'bg-yellow-900/50 text-yellow-300 border-yellow-400/30';
      case 'advanced': return 'bg-red-900/50 text-red-300 border-red-400/30';
      default: return 'bg-gray-700 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-brand-card-bg border-l border-brand-border text-brand-text-primary">
        <SheetHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <SheetTitle className="text-xl text-brand-text-primary">{title}</SheetTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className={getDifficultyColor(difficulty)}>
                  {difficulty}
                </Badge>
                {xpReward && (
                  <Badge variant="outline" className="flex items-center gap-1 border-amber-400/30 text-amber-300">
                    <Star className="w-3 h-3" />
                    {xpReward} XP
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <SheetDescription className="text-base leading-relaxed text-brand-text-secondary">
            {longDescription || description}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            {estimatedTime && (
              <div className="flex items-center gap-2 p-3 bg-brand-charcoal rounded-lg">
                <Clock className="w-4 h-4 text-brand-text-secondary" />
                <div>
                  <div className="text-sm font-medium text-brand-text-primary">{estimatedTime}</div>
                  <div className="text-xs text-brand-text-secondary">Time commitment</div>
                </div>
              </div>
            )}
            {participantCount && (
              <div className="flex items-center gap-2 p-3 bg-brand-charcoal rounded-lg">
                <Users className="w-4 h-4 text-brand-text-secondary" />
                <div>
                  <div className="text-sm font-medium text-brand-text-primary">{participantCount.toLocaleString()}</div>
                  <div className="text-xs text-brand-text-secondary">Participants</div>
                </div>
              </div>
            )}
          </div>

          {/* Progress (if user has started) */}
          {userProgress && getProgressPercent() > 0 && (
            <div className="space-y-3 p-4 bg-blue-900/20 rounded-lg border border-blue-400/30">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-400" />
                <span className="font-medium text-blue-300">Your Progress</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-brand-text-secondary">
                  <span>Completed</span>
                  <span>{userProgress.completedSteps}/{nextSteps.length} steps</span>
                </div>
                <Progress value={getProgressPercent()} className="w-full bg-brand-charcoal" />
              </div>
            </div>
          )}

          {/* Requirements */}
          {requirements.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-brand-text-primary">Requirements</h3>
              <ul className="space-y-2">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-brand-text-secondary">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          {nextSteps.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-brand-text-primary">What You'll Do</h3>
              <ol className="space-y-2">
                {nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-brand-text-secondary">
                    <div className="w-6 h-6 bg-brand-red text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Upcoming Events */}
          {events.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-brand-text-primary">Upcoming Events</h3>
              <div className="space-y-2">
                {events.slice(0, 3).map((event, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-brand-border rounded-lg bg-brand-charcoal">
                    <Calendar className="w-4 h-4 text-brand-text-secondary" />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-brand-text-primary">{event.name}</div>
                      <div className="text-xs text-brand-text-secondary flex items-center gap-2">
                        <span>{event.date}</span>
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand-text-secondary" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {resources.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-brand-text-primary">Helpful Resources</h3>
              <div className="space-y-2">
                {resources.map((resource, index) => (
                  <a 
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border border-brand-border rounded-lg hover:bg-brand-charcoal transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-brand-text-secondary" />
                    <div>
                      <div className="font-medium text-sm text-brand-text-primary">{resource.title}</div>
                      <div className="text-xs text-brand-text-secondary">{resource.description}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand-text-secondary" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Testimonials */}
          {testimonials.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-brand-text-primary">Success Stories</h3>
              <div className="space-y-3">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="p-4 bg-brand-charcoal rounded-lg">
                    <p className="text-sm italic text-brand-text-secondary mb-2">"{testimonial.quote}"</p>
                    <div className="text-xs text-brand-text-secondary">
                      <span className="font-medium text-brand-text-primary">{testimonial.name}</span>
                      {testimonial.role && <span> • {testimonial.role}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="sticky bottom-0 bg-brand-card-bg pt-4 border-t border-brand-border">
            <Button 
              onClick={() => onStartPathway(pathway)}
              className="w-full bg-brand-red hover:bg-red-700 text-lg py-6"
            >
              {userProgress && getProgressPercent() > 0 ? 'Continue Journey' : 'Start This Pathway'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
