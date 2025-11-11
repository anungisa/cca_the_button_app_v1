import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Clock, Zap, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TriviaQuestion } from '@/api/entities';

export default function LiveTriviaWidget({ gameId, currentEnd, onInteraction }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurrentQuestion();
  }, [gameId, currentEnd]);

  useEffect(() => {
    let timer;
    if (currentQuestion && timeLeft > 0 && !isAnswered) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeout();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isAnswered, currentQuestion]);

  const loadCurrentQuestion = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch questions relevant to the current game
      const questions = await TriviaQuestion.filter({ 
        is_active: true,
        category: 'current_events'
      });
      
      if (questions.length > 0) {
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        setCurrentQuestion(randomQuestion);
        setTimeLeft(30);
        setIsAnswered(false);
        setSelectedAnswer(null);
      }
    } catch (error) {
      console.error('Error loading trivia question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = async (answerIndex) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    const isCorrect = answerIndex === currentQuestion.correct_answer_index;
    const xpAwarded = isCorrect ? (currentQuestion.xp_reward || 10) : 2; // Participation XP

    await onInteraction('trivia_answer', {
      question_id: currentQuestion.id,
      answer: currentQuestion.options[answerIndex],
      isCorrect,
      xpAwarded
    });

    // Show next question after 3 seconds
    setTimeout(() => {
      loadCurrentQuestion();
    }, 3000);
  };

  const handleTimeout = () => {
    setIsAnswered(true);
    onInteraction('trivia_answer', {
      question_id: currentQuestion.id,
      answer: 'timeout',
      isCorrect: false,
      xpAwarded: 0
    });

    setTimeout(() => {
      loadCurrentQuestion();
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <Card className="bg-brand-charcoal border-brand-border">
        <CardContent className="p-6 text-center">
          <Target className="w-8 h-8 text-brand-text-secondary mx-auto mb-2" />
          <p className="text-brand-text-secondary">No trivia questions available right now.</p>
          <Button onClick={loadCurrentQuestion} className="mt-3" size="sm">
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="bg-brand-charcoal border-brand-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-red" />
              Live Trivia
            </CardTitle>
            <Badge className="bg-amber-500 text-white">
              <Zap className="w-3 h-3 mr-1" />
              {currentQuestion.xp_reward || 10} XP
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Timer */}
          {!isAnswered && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-text-secondary">Time remaining</span>
                <span className="font-mono text-brand-text-primary">{timeLeft}s</span>
              </div>
              <Progress 
                value={(timeLeft / 30) * 100} 
                className="h-2"
              />
            </div>
          )}

          {/* Question */}
          <div className="space-y-3">
            <h4 className="font-medium text-brand-text-primary leading-relaxed">
              {currentQuestion.question_text}
            </h4>

            {/* Answer Options */}
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => {
                let buttonStyle = "justify-start text-left h-auto p-3 ";
                
                if (isAnswered) {
                  if (index === currentQuestion.correct_answer_index) {
                    buttonStyle += "bg-green-600 text-white border-green-600";
                  } else if (index === selectedAnswer) {
                    buttonStyle += "bg-red-600 text-white border-red-600";
                  } else {
                    buttonStyle += "bg-brand-card-bg text-brand-text-secondary border-brand-border";
                  }
                } else {
                  buttonStyle += "bg-brand-card-bg hover:bg-brand-border text-brand-text-primary border-brand-border";
                }

                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={buttonStyle}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isAnswered}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{option}</span>
                      {isAnswered && index === currentQuestion.correct_answer_index && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {isAnswered && index === selectedAnswer && index !== currentQuestion.correct_answer_index && (
                        <XCircle className="w-4 h-4" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>

            {/* Result Message */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-3 rounded-lg bg-brand-card-bg/50"
                >
                  {selectedAnswer === currentQuestion.correct_answer_index ? (
                    <div className="text-green-400">
                      <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                      <p className="font-medium">Correct! +{currentQuestion.xp_reward || 10} XP</p>
                    </div>
                  ) : selectedAnswer !== null ? (
                    <div className="text-red-400">
                      <XCircle className="w-5 h-5 mx-auto mb-1" />
                      <p className="font-medium">Incorrect. +2 XP for trying!</p>
                    </div>
                  ) : (
                    <div className="text-brand-text-secondary">
                      <Clock className="w-5 h-5 mx-auto mb-1" />
                      <p className="font-medium">Time's up!</p>
                    </div>
                  )}
                  <p className="text-xs text-brand-text-secondary mt-1">Next question coming up...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}