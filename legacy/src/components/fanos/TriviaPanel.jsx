import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TriviaQuestion } from '@/api/entities';
import { TriviaSession } from '@/api/entities';
import { useXP } from '@/components/XPContext';
import { Brain, CheckCircle, XCircle, Zap } from 'lucide-react';

export default function TriviaPanel() {
  const { user, awardPoints } = useXP();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDailyQuestion();
  }, []);

  const loadDailyQuestion = async () => {
    try {
      // Get today's trivia questions
      const questions = await TriviaQuestion.filter({ is_active: true });
      
      if (questions.length > 0) {
        // For demo purposes, select a random question
        // In production, you'd implement daily question logic
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        setCurrentQuestion(randomQuestion);
      }
    } catch (error) {
      console.error('Failed to load trivia question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!currentQuestion || selectedAnswer === null || !user) return;

    const correct = selectedAnswer === currentQuestion.correct_answer_index;
    setIsCorrect(correct);
    setShowResult(true);

    try {
      // Create trivia session record
      await TriviaSession.create({
        user_id: user.id,
        challenge_id: 'daily_trivia',
        session_type: 'single_player',
        questions_answered: [{
          question_id: currentQuestion.id,
          user_answer: selectedAnswer.toString(),
          correct_answer: currentQuestion.correct_answer_index.toString(),
          is_correct: correct,
          time_taken_seconds: 30, // Mock timing
          xp_earned: correct ? currentQuestion.xp_reward || 10 : 0
        }],
        final_score: correct ? 1 : 0,
        total_xp_earned: correct ? currentQuestion.xp_reward || 10 : 0,
        status: 'completed'
      });

      // Award XP if correct
      if (correct) {
        const xpReward = currentQuestion.xp_reward || 10;
        await awardPoints(xpReward, 'trivia_correct', 'Daily trivia question answered correctly');
        setStreak(prev => prev + 1);
      } else {
        setStreak(0);
      }
    } catch (error) {
      console.error('Failed to save trivia session:', error);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    loadDailyQuestion();
  };

  if (isLoading) {
    return (
      <Card className="bg-brand-charcoal border-brand-border">
        <CardContent className="p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto"></div>
          <p className="text-brand-text-secondary mt-2">Loading question...</p>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card className="bg-brand-charcoal border-brand-border">
        <CardContent className="p-4 text-center">
          <Brain className="w-8 h-8 text-brand-text-secondary mx-auto mb-2" />
          <p className="text-brand-text-secondary">No questions available</p>
          <Button onClick={loadDailyQuestion} size="sm" className="mt-2">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-charcoal border-brand-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-brand-red" />
            <span className="font-semibold text-brand-text-primary">Daily Trivia</span>
          </div>
          {streak > 0 && (
            <Badge className="bg-amber-500 text-white">
              <Zap className="w-3 h-3 mr-1" />
              {streak} streak
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-brand-text-primary font-medium">{currentQuestion.question_text}</p>
          
          {!showResult ? (
            <>
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedAnswer === index
                        ? 'bg-brand-red/20 border-brand-red text-brand-text-primary'
                        : 'bg-brand-card-bg border-brand-border text-brand-text-secondary hover:text-brand-text-primary'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              <Button 
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null}
                className="w-full bg-brand-red hover:bg-red-700"
              >
                Submit Answer
              </Button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className={`flex items-center justify-center gap-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                <span className="font-semibold">
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              
              <p className="text-brand-text-secondary text-sm">
                The correct answer was: <strong>{currentQuestion.options[currentQuestion.correct_answer_index]}</strong>
              </p>
              
              {isCorrect && (
                <Badge className="bg-green-600 text-white">
                  <Zap className="w-3 h-3 mr-1" />
                  +{currentQuestion.xp_reward || 10} XP
                </Badge>
              )}
              
              <Button onClick={handleNextQuestion} size="sm" className="mt-4">
                Next Question
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}