import React, { useState, useEffect } from 'react';
import { User, KnowledgeProgress } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  FileText, 
  Award, 
  CheckCircle2,
  Clock,
  Upload,
  BookOpen,
  Users,
  Building,
  Zap,
  Star,
  Target
} from 'lucide-react';
import { useXP } from '../components/XPContext';

const GOVERNANCE_ACTIONS = [
  {
    id: 'constitution_upload',
    title: 'Upload Club Constitution',
    description: 'Upload your current club constitution and bylaws',
    xp_reward: 100,
    badge: { id: 'governance_pro', name: 'Governance Pro', description: 'Uploaded club constitution' },
    icon: FileText,
    category: 'Documentation'
  },
  {
    id: 'annual_report',
    title: 'Submit Annual Report',
    description: 'Complete and submit your annual club report',
    xp_reward: 200,
    badge: { id: 'transparent_club', name: 'Transparent Club', description: 'Submitted annual report on time' },
    icon: Upload,
    category: 'Reporting'
  },
  {
    id: 'board_training',
    title: 'Complete Board Training',
    description: 'Take Curling Canada board governance training',
    xp_reward: 150,
    badge: { id: 'board_pro', name: 'Board Pro', description: 'Completed board governance training' },
    icon: BookOpen,
    category: 'Training'
  },
  {
    id: 'safe_sport_renewal',
    title: 'Renew Safe Sport Status',
    description: 'Update Safe Sport certification for club leaders',
    xp_reward: 75,
    badge: { id: 'verified_leader', name: 'Verified Leader', description: 'Maintained Safe Sport compliance' },
    icon: Shield,
    category: 'Compliance'
  },
  {
    id: 'insurance_review',
    title: 'Insurance Review',
    description: 'Complete annual insurance review and renewal',
    xp_reward: 100,
    badge: { id: 'risk_manager', name: 'Risk Manager', description: 'Completed insurance review' },
    icon: Building,
    category: 'Risk Management'
  },
  {
    id: 'member_survey',
    title: 'Conduct Member Survey',
    description: 'Survey members on club satisfaction and needs',
    xp_reward: 125,
    badge: { id: 'member_advocate', name: 'Member Advocate', description: 'Conducted member satisfaction survey' },
    icon: Users,
    category: 'Engagement'
  }
];

const SEASONAL_CHALLENGES = [
  {
    id: 'q1_challenge',
    title: 'Q1 Foundation Builder',
    description: 'Complete 3 governance actions in Q1',
    target: 3,
    xp_reward: 300,
    badge: { id: 'foundation_builder', name: 'Foundation Builder', description: 'Built strong governance foundation' }
  },
  {
    id: 'annual_champion',
    title: 'Annual Governance Champion',
    description: 'Complete all 6 governance actions in one year',
    target: 6,
    xp_reward: 1000,
    badge: { id: 'governance_champion', name: 'Governance Champion', description: 'Master of club governance' }
  }
];

export default function GovernanceGamification() {
  const [user, setUser] = useState(null);
  const [completedActions, setCompletedActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { awardPoints, awardBadge } = useXP();

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
        
        // Load completed governance actions
        const progress = await KnowledgeProgress.filter({ 
          user_id: userData.id,
          status: 'completed' 
        });
        
        const governanceActions = progress.filter(p => 
          GOVERNANCE_ACTIONS.some(action => action.id === p.article_id)
        );
        
        setCompletedActions(governanceActions);
        
      } catch (error) {
        console.error('Error loading governance data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleCompleteAction = async (action) => {
    try {
      // Record completion
      await KnowledgeProgress.create({
        user_id: user.id,
        article_id: action.id,
        status: 'completed',
        completion_date: new Date().toISOString()
      });

      // Award XP
      await awardPoints(
        action.xp_reward, 
        'bonus', 
        `Governance Action: ${action.title}`,
        action.id
      );

      // Award badge
      if (action.badge) {
        await awardBadge(action.badge.id, action.badge.name, action.badge.description);
      }

      // Update local state
      setCompletedActions(prev => [...prev, {
        user_id: user.id,
        article_id: action.id,
        status: 'completed',
        completion_date: new Date().toISOString()
      }]);

      // Check for seasonal challenges
      const newCompletedCount = completedActions.length + 1;
      
      for (const challenge of SEASONAL_CHALLENGES) {
        if (newCompletedCount === challenge.target) {
          await awardPoints(challenge.xp_reward, 'bonus', `Challenge: ${challenge.title}`, challenge.id);
          if (challenge.badge) {
            await awardBadge(challenge.badge.id, challenge.badge.name, challenge.badge.description);
          }
        }
      }

    } catch (error) {
      console.error('Error completing governance action:', error);
    }
  };

  const isActionCompleted = (actionId) => {
    return completedActions.some(a => a.article_id === actionId);
  };

  const getCompletionStats = () => {
    const completed = completedActions.length;
    const total = GOVERNANCE_ACTIONS.length;
    const percentage = (completed / total) * 100;
    const totalXP = GOVERNANCE_ACTIONS
      .filter(action => isActionCompleted(action.id))
      .reduce((sum, action) => sum + action.xp_reward, 0);
    
    return { completed, total, percentage, totalXP };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Governance Hub...</p>
        </div>
      </div>
    );
  }

  const stats = getCompletionStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-charcoal uppercase mb-4">
            Governance Gamification
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Strengthen your club's foundation through gamified governance actions and earn rewards
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-brand-charcoal">{stats.completed}</div>
              <div className="text-sm text-gray-600">Actions Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-brand-charcoal">{stats.percentage.toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-brand-charcoal">{stats.totalXP}</div>
              <div className="text-sm text-gray-600">XP Earned</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-brand-charcoal">
                {completedActions.filter(a => GOVERNANCE_ACTIONS.find(ga => ga.id === a.article_id)?.badge).length}
              </div>
              <div className="text-sm text-gray-600">Badges Earned</div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-brand-charcoal">Overall Progress</h3>
              <Badge className="bg-blue-100 text-blue-800">
                {stats.completed}/{stats.total} Complete
              </Badge>
            </div>
            <Progress value={stats.percentage} className="h-3 mb-2" />
            <p className="text-sm text-gray-600">
              {stats.total - stats.completed} actions remaining to complete all governance requirements
            </p>
          </CardContent>
        </Card>

        {/* Governance Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {GOVERNANCE_ACTIONS.map((action) => {
            const isCompleted = isActionCompleted(action.id);
            const IconComponent = action.icon;
            
            return (
              <Card key={action.id} className={`transition-all duration-200 ${
                isCompleted ? 'bg-green-50 border-green-200' : 'hover:shadow-lg'
              }`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isCompleted ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${
                          isCompleted ? 'text-green-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{action.title}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">
                          {action.category}
                        </Badge>
                      </div>
                    </div>
                    {isCompleted && (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{action.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-amber-100 text-amber-800">
                        <Zap className="w-3 h-3 mr-1" />
                        +{action.xp_reward} XP
                      </Badge>
                      {action.badge && (
                        <Badge className="bg-purple-100 text-purple-800">
                          <Award className="w-3 h-3 mr-1" />
                          {action.badge.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleCompleteAction(action)}
                    disabled={isCompleted}
                    className={`w-full ${
                      isCompleted 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-brand-red hover:bg-red-700'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Complete Action
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Seasonal Challenges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Seasonal Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SEASONAL_CHALLENGES.map((challenge) => {
                const progress = Math.min(stats.completed, challenge.target);
                const isCompleted = progress >= challenge.target;
                
                return (
                  <div key={challenge.id} className={`p-4 border rounded-lg ${
                    isCompleted ? 'bg-amber-50 border-amber-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-brand-charcoal">{challenge.title}</h3>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                      </div>
                      {isCompleted && (
                        <Award className="w-6 h-6 text-amber-500" />
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{progress}/{challenge.target}</span>
                      </div>
                      <Progress value={(progress / challenge.target) * 100} className="h-2" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-100 text-amber-800">
                        <Zap className="w-3 h-3 mr-1" />
                        +{challenge.xp_reward} XP
                      </Badge>
                      {challenge.badge && (
                        <Badge className="bg-purple-100 text-purple-800">
                          <Award className="w-3 h-3 mr-1" />
                          {challenge.badge.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}