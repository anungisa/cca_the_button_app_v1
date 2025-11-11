import React, { useState, useEffect } from 'react';
import { User, HitDrawTap as HDTScore, HDTEvent } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Target, 
  Trophy, 
  Calendar, 
  Users, 
  Award,
  TrendingUp,
  Download,
  Plus,
  CheckCircle2,
  Star,
  Zap
} from 'lucide-react';
import { useXP } from '../components/XPContext';

import HDTScorecard from '../components/hdt/HDTScorecard';
import HDTLeaderboard from '../components/hdt/HDTLeaderboard';
import HDTCoachView from '../components/hdt/HDTCoachView';
import HDTEventRegistration from '../components/hdt/HDTEventRegistration';

export default function HitDrawTap() {
  const [user, setUser] = useState(null);
  const [myScores, setMyScores] = useState([]);
  const [events, setEvents] = useState([]);
  const [personalBest, setPersonalBest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { awardPoints, awardBadge } = useXP();

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
        
        // Load user's HDT scores
        const userScores = await HDTScore.filter({ user_id: userData.id }, '-submission_date', 20);
        setMyScores(userScores);
        
        // Calculate personal best
        if (userScores.length > 0) {
          const best = userScores.reduce((max, score) => 
            score.totals.grand_total > (max?.totals.grand_total || 0) ? score : max
          );
          setPersonalBest(best);
        }
        
        // Load upcoming events
        const upcomingEvents = await HDTEvent.filter({ is_active: true }, 'start_date', 10);
        setEvents(upcomingEvents);
        
      } catch (error) {
        console.error('Error loading HDT data:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleScoreSubmission = async (scoreData) => {
    try {
      // Save the score
      const newScore = await HDTScore.create({
        user_id: user.id,
        age_division: scoreData.age_division,
        scores: scoreData.scores,
        totals: scoreData.totals,
        club_id: user.club_id,
        ma_region: user.ma_region,
        submission_date: new Date().toISOString().split('T')[0]
      });
      
      // Check if it's a personal best
      const isPersonalBest = !personalBest || scoreData.totals.grand_total > personalBest.totals.grand_total;
      
      if (isPersonalBest) {
        await HDTScore.update(newScore.id, { is_personal_best: true });
        setPersonalBest(newScore);
        await awardPoints(50, 'bonus', 'Hit Draw Tap Personal Best!', newScore.id);
      }
      
      // Award base participation points
      await awardPoints(25, 'bonus', 'Hit Draw Tap Scorecard Completion', newScore.id);
      
      // Check for accuracy badges
      const accuracy = (scoreData.totals.grand_total / 75) * 100; // Assuming max possible is 75
      
      if (accuracy >= 80 && !user.badges?.some(b => b.badge_id === 'precision_pro')) {
        await awardBadge('precision_pro', 'Precision Pro', 'Achieved 80%+ accuracy in Hit Draw Tap');
      }
      
      if (scoreData.totals.tap_total >= 20 && !user.badges?.some(b => b.badge_id === 'tap_titan')) {
        await awardBadge('tap_titan', 'Tap Titan', 'Master of the tap shot technique');
      }
      
      if (scoreData.totals.draw_total >= 20 && !user.badges?.some(b => b.badge_id === 'draw_wizard')) {
        await awardBadge('draw_wizard', 'Draw Wizard', 'Expert at draw shot placement');
      }
      
      // Refresh scores
      const updatedScores = await HDTScore.filter({ user_id: user.id }, '-submission_date', 20);
      setMyScores(updatedScores);
      
      return true;
    } catch (error) {
      console.error('Error submitting score:', error);
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Hit Draw Tap...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Target className="w-12 h-12 text-brand-red mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brand-charcoal mb-2">Hit Draw Tap Challenge</h2>
            <p className="text-gray-600 mb-6">Test your curling skills and compete nationally!</p>
            <Button onClick={() => User.login()} className="bg-brand-red hover:bg-red-700">
              Sign In to Start
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCoach = user.user_type === 'volunteer' || user.coaching_status === 'certified';
  const isAdmin = user.user_type === 'ma_admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-charcoal uppercase mb-4">
            Hit Draw Tap Challenge
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test your curling accuracy, compete with youth across Canada, and earn CurlPoints!
          </p>
        </div>

        {/* Personal Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-brand-charcoal">
                {personalBest?.totals.grand_total || 0}
              </div>
              <div className="text-sm text-gray-600">Personal Best</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-brand-charcoal">{myScores.length}</div>
              <div className="text-sm text-gray-600">Attempts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-brand-charcoal">
                {myScores.filter(s => s.is_personal_best).length}
              </div>
              <div className="text-sm text-gray-600">Personal Records</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-brand-charcoal">
                {events.filter(e => new Date(e.start_date) > new Date()).length}
              </div>
              <div className="text-sm text-gray-600">Upcoming Events</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="scorecard" className="w-full">
          <TabsList className={`grid w-full ${isCoach ? 'grid-cols-5' : 'grid-cols-4'}`}>
            <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="my-scores">My Scores</TabsTrigger>
            {isCoach && <TabsTrigger value="coach">Coach View</TabsTrigger>}
          </TabsList>

          <TabsContent value="scorecard" className="space-y-6">
            <HDTScorecard onSubmit={handleScoreSubmission} user={user} />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <HDTLeaderboard />
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <HDTEventRegistration events={events} user={user} />
          </TabsContent>

          <TabsContent value="my-scores" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  My Hit Draw Tap History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {myScores.length > 0 ? (
                  <div className="space-y-4">
                    {myScores.map((score, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-brand-charcoal">
                                Score: {score.totals.grand_total}
                              </h3>
                              {score.is_personal_best && (
                                <Badge className="bg-amber-100 text-amber-800">
                                  <Star className="w-3 h-3 mr-1" />
                                  Personal Best
                                </Badge>
                              )}
                              {score.coach_verified && (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              Age Division: {score.age_division} • {score.submission_date}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-brand-charcoal">
                              {score.totals.hit_total}
                            </div>
                            <div className="text-sm text-gray-600">Hit</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-brand-charcoal">
                              {score.totals.draw_total}
                            </div>
                            <div className="text-sm text-gray-600">Draw</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-brand-charcoal">
                              {score.totals.tap_total}
                            </div>
                            <div className="text-sm text-gray-600">Tap</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-brand-charcoal mb-2">No Scores Yet</h3>
                    <p className="text-gray-500 mb-4">Complete your first scorecard to get started!</p>
                    <Button 
                      onClick={() => document.querySelector('[value="scorecard"]').click()}
                      className="bg-brand-red hover:bg-red-700"
                    >
                      Start First Scorecard
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {isCoach && (
            <TabsContent value="coach" className="space-y-6">
              <HDTCoachView user={user} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}