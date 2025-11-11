
import React, { useState, useEffect } from 'react';
import { TriviaChallenge, TriviaLeaderboard, TriviaSession } from '@/api/entities';
import { useXP } from '../components/XPContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Trophy,
  Zap,
  Calendar,
  Users,
  Target,
  Clock,
  Award,
  TrendingUp,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import TriviaGameEngine from '../components/trivia/TriviaGameEngine';
import SponsorShowcase from '../components/home/SponsorShowcase';

export default function TriviaHub() {
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [leaderboards, setLeaderboards] = useState({});
  const [userStats, setUserStats] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [gameMode, setGameMode] = useState('lobby'); // lobby, playing, results
  const { user, loyaltyData } = useXP();

  useEffect(() => {
    loadTriviaData();
  }, []);

  const loadTriviaData = async () => {
    try {
      // Load active challenges
      const challenges = await TriviaChallenge.filter({ is_active: true });
      setActiveChallenges(challenges);

      // Load leaderboards
      const dailyLeaderboard = await TriviaLeaderboard.filter({ 
        leaderboard_type: 'daily',
        period: new Date().toISOString().split('T')[0]
      });
      
      const weeklyLeaderboard = await TriviaLeaderboard.filter({ 
        leaderboard_type: 'weekly'
      });

      setLeaderboards({
        daily: dailyLeaderboard[0] || { rankings: [] },
        weekly: weeklyLeaderboard[0] || { rankings: [] }
      });

      // Load user stats
      if (user) {
        const userSessions = await TriviaSession.filter({ 
          user_id: user.id,
          status: 'completed'
        }, '-created_date', 10);
        
        calculateUserStats(userSessions);
      }
    } catch (error) {
      console.error('Error loading trivia data:', error);
    }
  };

  const calculateUserStats = (sessions) => {
    if (sessions.length === 0) {
      setUserStats({
        gamesPlayed: 0,
        averageScore: 0,
        bestStreak: 0,
        totalXP: 0,
        accuracy: 0
      });
      return;
    }

    const stats = {
      gamesPlayed: sessions.length,
      totalXP: sessions.reduce((sum, s) => sum + s.total_xp_earned, 0),
      bestStreak: Math.max(...sessions.map(s => s.streak_achieved || 0)),
      averageScore: sessions.reduce((sum, s) => sum + s.final_score, 0) / sessions.length,
      accuracy: sessions.reduce((sum, s) => {
        const totalQuestions = s.questions_answered.length;
        const correctAnswers = s.questions_answered.filter(q => q.is_correct).length;
        return sum + (correctAnswers / totalQuestions);
      }, 0) / sessions.length * 100
    };

    setUserStats(stats);
  };

  const startChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setGameMode('playing');
  };

  const handleGameComplete = (results) => {
    setGameMode('results');
    loadTriviaData(); // Refresh stats and leaderboards
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'rookie': return 'bg-green-100 text-green-800';
      case 'club_level': return 'bg-blue-100 text-blue-800';
      case 'competitive': return 'bg-purple-100 text-purple-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChallengeTypeIcon = (type) => {
    switch (type) {
      case 'daily': return <Calendar className="w-4 h-4" />;
      case 'weekly': return <TrendingUp className="w-4 h-4" />;
      case 'head_to_head': return <Users className="w-4 h-4" />;
      case 'tournament': return <Trophy className="w-4 h-4" />;
      case 'lightning_round': return <Zap className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  if (gameMode === 'playing' && selectedChallenge) {
    return (
      <div className="min-h-screen bg-brand-charcoal">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4">
            <Button 
              onClick={() => setGameMode('lobby')} 
              variant="outline"
              className="mb-4"
            >
              ← Back to Lobby
            </Button>
          </div>
          <TriviaGameEngine 
            challengeId={selectedChallenge.id} 
            onComplete={handleGameComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-brand-text-primary mb-2">Trivia Central</h1>
          <p className="text-xl text-brand-text-secondary">Test your curling knowledge and compete with fans across Canada</p>
        </div>

        {/* User Stats Overview */}
        {userStats && (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-brand-card-bg border-brand-border text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-brand-text-primary">{userStats.gamesPlayed}</div>
                <div className="text-sm text-brand-text-secondary">Games Played</div>
              </CardContent>
            </Card>
            <Card className="bg-brand-card-bg border-brand-border text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-amber-400">{Math.round(userStats.averageScore)}</div>
                <div className="text-sm text-brand-text-secondary">Avg Score</div>
              </CardContent>
            </Card>
            <Card className="bg-brand-card-bg border-brand-border text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-400">{userStats.bestStreak}</div>
                <div className="text-sm text-brand-text-secondary">Best Streak</div>
              </CardContent>
            </Card>
            <Card className="bg-brand-card-bg border-brand-border text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-400">{Math.round(userStats.accuracy)}%</div>
                <div className="text-sm text-brand-text-secondary">Accuracy</div>
              </CardContent>
            </Card>
            <Card className="bg-brand-card-bg border-brand-border text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-brand-red">{userStats.totalXP}</div>
                <div className="text-sm text-brand-text-secondary">XP Earned</div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Tabs defaultValue="challenges" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-brand-card-bg border-brand-border">
            <TabsTrigger value="challenges">
              <Target className="w-4 h-4 mr-2" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="leaderboards">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboards
            </TabsTrigger>
            <TabsTrigger value="tournaments">
              <Award className="w-4 h-4 mr-2" />
              Tournaments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getChallengeTypeIcon(challenge.challenge_type)}
                          <CardTitle className="text-lg text-brand-text-primary">
                            {challenge.challenge_name}
                          </CardTitle>
                        </div>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-brand-text-secondary">Questions:</span>
                          <span className="text-brand-text-primary">{challenge.total_questions}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-brand-text-secondary">Time per Q:</span>
                          <span className="text-brand-text-primary">{challenge.time_limit_seconds}s</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-brand-text-secondary">Base XP:</span>
                          <span className="text-amber-400 font-semibold">{challenge.xp_base_reward}</span>
                        </div>
                        
                        {challenge.sponsor_info && (
                          <div className="mt-3 p-2 bg-brand-charcoal/50 rounded-md">
                            <div className="text-xs text-brand-text-secondary mb-1">Sponsored by</div>
                            <div className="text-sm font-semibold text-brand-text-primary">
                              {challenge.sponsor_info.sponsor_name}
                            </div>
                            {challenge.sponsor_info.bonus_xp > 0 && (
                              <div className="text-xs text-amber-400">
                                +{challenge.sponsor_info.bonus_xp} Bonus XP
                              </div>
                            )}
                          </div>
                        )}
                        
                        <Button 
                          onClick={() => startChallenge(challenge)}
                          className="w-full bg-brand-red hover:bg-red-700 mt-4"
                        >
                          Start Challenge
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboards" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Leaderboard */}
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    Daily Leaders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboards.daily?.rankings?.slice(0, 10).map((player, index) => (
                      <div key={player.user_id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-amber-400 text-black' :
                            index === 1 ? 'bg-gray-300 text-black' :
                            index === 2 ? 'bg-amber-600 text-white' :
                            'bg-brand-charcoal text-brand-text-primary'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-brand-text-primary">
                              {player.user_name}
                            </div>
                            {player.club_name && (
                              <div className="text-xs text-brand-text-secondary">
                                {player.club_name}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-brand-text-primary">
                            {player.score} pts
                          </div>
                          <div className="text-xs text-brand-text-secondary">
                            {Math.round(player.accuracy_percentage)}% acc
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center text-brand-text-secondary py-8">
                        No players yet today. Be the first!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Leaderboard */}
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    Weekly Champions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboards.weekly?.rankings?.slice(0, 10).map((player, index) => (
                      <div key={player.user_id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-amber-400 text-black' :
                            index === 1 ? 'bg-gray-300 text-black' :
                            index === 2 ? 'bg-amber-600 text-white' :
                            'bg-brand-charcoal text-brand-text-primary'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-brand-text-primary">
                              {player.user_name}
                            </div>
                            {player.club_name && (
                              <div className="text-xs text-brand-text-secondary">
                                {player.club_name}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-brand-text-primary">
                            {player.score} pts
                          </div>
                          <div className="text-xs text-brand-text-secondary">
                            {player.sessions_played} games
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center text-brand-text-secondary py-8">
                        No weekly champions yet!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tournaments" className="mt-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-8 text-center">
                <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-brand-text-primary mb-2">
                  Tournaments Coming Soon!
                </h3>
                <p className="text-brand-text-secondary mb-4">
                  Compete in head-to-head matches and seasonal tournaments for exclusive prizes.
                </p>
                <Button disabled className="bg-gray-600 text-gray-400">
                  Notify Me When Available
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Proud Partners Section */}
      <div className="mt-16 border-t border-brand-border/20 pt-12">
        <SponsorShowcase />
      </div>
    </div>
  );
}
