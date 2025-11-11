
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Compass, 
  Target, 
  TrendingUp,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function OnboardingRecommender({ pathways, onSelectPathway }) {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const loadUserAndRecommendations = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
        
        const recs = generateRecommendations(userData, pathways);
        setRecommendations(recs);
      } catch (error) {
        // User not logged in - show general recommendations
        const recs = generateRecommendations(null, pathways);
        setRecommendations(recs);
      }
    };
    
    loadUserAndRecommendations();
  }, [pathways]);

  const generateRecommendations = (userData, allPathways) => {
    const recommendations = [];
    
    if (!userData) {
      // New/anonymous user recommendations
      recommendations.push({
        pathway: allPathways.find(p => p.id === 'start_curling'),
        reason: 'Perfect for beginners',
        priority: 1
      });
      recommendations.push({
        pathway: allPathways.find(p => p.id === 'find_club'),
        reason: 'Find your local curling community',
        priority: 2
      });
      return recommendations.filter(r => r.pathway);
    }

    // Personalized recommendations based on user profile
    const { user_type, performance_tier, safe_sport_status, ma_region, preferred_position } = userData;
    const userAge = calculateAge(userData.date_of_birth);

    // Youth-specific recommendations
    if (userAge && userAge < 18) {
      recommendations.push({
        pathway: allPathways.find(p => p.id === 'youth_curling'),
        reason: 'Designed for young curlers like you',
        priority: 1
      });
      recommendations.push({
        pathway: allPathways.find(p => p.id === 'hit_draw_tap'),
        reason: 'Test and improve your skills',
        priority: 2
      });
    }

    // Performance tier recommendations
    if (performance_tier === 'none' && user_type === 'curler') {
      recommendations.push({
        pathway: allPathways.find(p => p.id === 'coaching'),
        reason: 'Develop your curling knowledge',
        priority: 2
      });
    }

    // Volunteer opportunities
    if (user_type === 'volunteer' || safe_sport_status === 'current') {
      recommendations.push({
        pathway: allPathways.find(p => p.id === 'volunteer'),
        reason: 'Your Safe Sport certification opens opportunities',
        priority: 1
      });
      recommendations.push({
        pathway: allPathways.find(p => p.id === 'officials'),
        reason: 'Become a certified official',
        priority: 3
      });
    }

    // Ice technician path
    if (user_type === 'volunteer' || user_type === 'curler') {
      recommendations.push({
        pathway: allPathways.find(p => p.id === 'ice_tech'),
        reason: 'Learn the art of ice making',
        priority: 3
      });
    }

    // Mixed doubles for advanced curlers
    if (performance_tier !== 'none' || user_type === 'athlete') {
      recommendations.push({
        pathway: allPathways.find(p => p.id === 'mixed_doubles'),
        reason: 'Try the fast-paced Olympic discipline',
        priority: 2
      });
    }

    // Wheelchair curling
    recommendations.push({
      pathway: allPathways.find(p => p.id === 'wheelchair_curling'),
      reason: 'Inclusive curling for everyone',
      priority: 4
    });

    return recommendations
      .filter(r => r.pathway)
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 3);
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (!isVisible || recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-brand-card-bg to-brand-charcoal border-brand-border mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-brand-text-primary">
            <Compass className="w-5 h-5 text-blue-400" />
            {user ? `Welcome back, ${user.full_name?.split(' ')[0]}!` : 'Welcome to Curling Canada!'}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsVisible(false)}
            className="text-brand-text-secondary hover:text-brand-text-primary"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">
              {user ? 'Recommended for your curling journey:' : 'Start your curling journey:'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => (
              <div 
                key={rec.pathway.id}
                className="bg-brand-charcoal rounded-lg p-4 border border-brand-border hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => onSelectPathway(rec.pathway)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-900/50 rounded-full flex items-center justify-center">
                    <rec.pathway.icon className="w-4 h-4 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-brand-text-primary">
                      {rec.pathway.title}
                    </h3>
                    <Badge variant="outline" className="text-xs mt-1 border-blue-400/30 text-blue-300">
                      {rec.reason}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-xs text-brand-text-secondary mb-3">
                  {rec.pathway.description.substring(0, 80)}...
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {rec.pathway.xpReward && (
                      <Badge className="bg-amber-900/50 text-amber-300 text-xs">
                        +{rec.pathway.xpReward} XP
                      </Badge>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-brand-text-secondary" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => document.getElementById('pathways-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-blue-300 border-blue-400/50 hover:bg-brand-card-bg"
            >
              <Target className="w-4 h-4 mr-2" />
              Explore All Pathways
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
