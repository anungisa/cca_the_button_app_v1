import React, { useState, useEffect } from 'react';
import { TriviaQuestion, TriviaChallenge, TriviaSession } from '@/api/entities';
import { useXP } from '../XPContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Timer, Zap, Trophy, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TriviaGameEngine({ challengeId, onComplete }) {
  const [challenge, setChallenge] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [session, setSession] = useState(null);
  const [gameState, setGameState] = useState('loading'); // loading, playing, question_result, game_complete
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  
  const { awardPoints, user } = useXP();

  useEffect(() => {
    loadChallenge();
  }, [challengeId]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeUp();
    }
  }, [timeLeft, gameState]);

  const loadChallenge = async () => {
    try {
      const challengeData = await TriviaChallenge.get(challengeId);
      setChallenge(challengeData);
      
      // Load questions for this challenge
      const questionPromises = challengeData.question_pool.map(id => 
        TriviaQuestion.get(id)
      );
      const loadedQuestions = await Promise.all(questionPromises);
      
      // Shuffle and limit questions
      const shuffled = loadedQuestions.sort(() => Math.random() - 0.5);
      const selectedQuestions = shuffled.slice(0, challengeData.total_questions);
      setQuestions(selectedQuestions);
      
      // Create session
      const newSession = await TriviaSession.create({
        user_id: user.id,
        challenge_id: challengeId,
        session_type: 'single_player',
        questions_answered: [],
        final_score: 0,
        total_xp_earned: 0,
        status: 'in_progress'
      });
      setSession(newSession);
      
      setTimeLeft(challengeData.time_limit_seconds);
      setGameState('playing');
    } catch (error) {
      console.error('Error loading challenge:', error);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    if (gameState !== 'playing') return;
    
    setSelectedAnswer(answerIndex);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correct_answer_index;
    const timeTaken = challenge.time_limit_seconds - timeLeft;
    
    // Calculate XP with streak bonus
    let xpEarned = 0;
    if (isCorrect) {
      xpEarned = challenge.xp_base_reward;
      
      // Time bonus (faster = more XP)
      const timeBonus = Math.max(0, Math.floor((timeLeft / challenge.time_limit_seconds) * 20));
      xpEarned += timeBonus;
      
      // Streak bonus
      const newStreak = streak + 1;
      if (newStreak >= 3) {
        xpEarned = Math.floor(xpEarned * challenge.streak_multiplier);
      }
      
      setStreak(newStreak);
      setMaxStreak(Math.max(maxStreak, newStreak));
      setScore(score + 1);
    } else {
      setStreak(0);
    }
    
    // Record the answer
    const questionResult = {
      question_id: currentQuestion.id,
      user_answer: currentQuestion.options[answerIndex],
      correct_answer: currentQuestion.options[currentQuestion.correct_answer_index],
      is_correct: isCorrect,
      time_taken_seconds: timeTaken,
      xp_earned: xpEarned
    };
    
    setAnsweredQuestions(prev => [...prev, questionResult]);
    
    // Award XP immediately
    if (xpEarned > 0) {
      awardPoints(xpEarned, 'trivia_correct', `Trivia: ${currentQuestion.question_text.substring(0, 50)}...`);
    }
    
    setGameState('question_result');
    
    // Auto-advance after showing result
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setTimeLeft(challenge.time_limit_seconds);
        setGameState('playing');
      } else {
        completeGame();
      }
    }, 2000);
  };

  const handleTimeUp = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const questionResult = {
      question_id: currentQuestion.id,
      user_answer: 'No Answer',
      correct_answer: currentQuestion.options[currentQuestion.correct_answer_index],
      is_correct: false,
      time_taken_seconds: challenge.time_limit_seconds,
      xp_earned: 0
    };
    
    setAnsweredQuestions(prev => [...prev, questionResult]);
    setStreak(0);
    setGameState('question_result');
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setTimeLeft(challenge.time_limit_seconds);
        setGameState('playing');
      } else {
        completeGame();
      }
    }, 2000);
  };

  const completeGame = async () => {
    const totalXP = answeredQuestions.reduce((sum, q) => sum + q.xp_earned, 0);
    
    // Update session
    await TriviaSession.update(session.id, {
      questions_answered: answeredQuestions,
      final_score: score,
      total_xp_earned: totalXP,
      completion_time_seconds: (questions.length * challenge.time_limit_seconds) - timeLeft,
      streak_achieved: maxStreak,
      status: 'completed'
    });
    
    setGameState('game_complete');
    
    // Check for achievements
    checkAchievements();
    
    if (onComplete) {
      onComplete({
        score,
        totalXP,
        maxStreak,
        accuracy: (score / questions.length) * 100
      });
    }
  };

  const checkAchievements = async () => {
    const achievements = [];
    
    // Perfect score achievement
    if (score === questions.length) {
      achievements.push('trivia_perfectionist');
    }
    
    // Speed demon (all answers in under 15 seconds each)
    const avgTime = answeredQuestions.reduce((sum, q) => sum + q.time_taken_seconds, 0) / answeredQuestions.length;
    if (avgTime < 15) {
      achievements.push('trivia_speed_demon');
    }
    
    // Streak master
    if (maxStreak >= 7) {
      achievements.push('trivia_streak_master');
    }
    
    // Award achievement badges
    // This would connect to the badge system
  };

  if (gameState === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  if (gameState === 'game_complete') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-brand-text-primary mb-2">Game Complete!</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-brand-card-bg p-4 rounded-lg">
            <div className="text-2xl font-bold text-brand-text-primary">{score}/{questions.length}</div>
            <div className="text-sm text-brand-text-secondary">Correct</div>
          </div>
          <div className="bg-brand-card-bg p-4 rounded-lg">
            <div className="text-2xl font-bold text-amber-400">{maxStreak}</div>
            <div className="text-sm text-brand-text-secondary">Best Streak</div>
          </div>
        </div>
        <Button onClick={() => window.location.reload()} className="bg-brand-red hover:bg-red-700">
          Play Again
        </Button>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Game Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-brand-red" />
            <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-brand-text-primary'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-green-400" />
              <span className="font-semibold text-brand-text-primary">{score}</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-amber-400">{streak}</span>
              </div>
            )}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="text-center mt-2 text-sm text-brand-text-secondary">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-brand-card-bg border-brand-border mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-brand-text-primary">
                {currentQuestion?.question_text}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion?.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={gameState !== 'playing'}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`w-full justify-start text-left h-auto p-4 ${
                    gameState === 'question_result' && index === currentQuestion.correct_answer_index
                      ? 'bg-green-600 hover:bg-green-600 text-white'
                      : gameState === 'question_result' && selectedAnswer === index && index !== currentQuestion.correct_answer_index
                      ? 'bg-red-600 hover:bg-red-600 text-white'
                      : ''
                  }`}
                >
                  <span className="mr-3 font-semibold">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Streak Indicator */}
      {streak >= 3 && gameState === 'playing' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center mb-4"
        >
          <Badge className="bg-amber-500 text-white text-lg px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            {streak} Streak! XP Multiplier Active
          </Badge>
        </motion.div>
      )}
    </div>
  );
}