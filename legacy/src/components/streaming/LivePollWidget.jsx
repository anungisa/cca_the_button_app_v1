import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Vote, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LivePollWidget({ gameId, polls, onInteraction }) {
  const [votedPolls, setVotedPolls] = useState(new Set());

  const handleVote = async (poll, selectedOption) => {
    if (votedPolls.has(poll.id)) return;

    try {
      // Submit vote
      await onInteraction('poll_vote', {
        poll_id: poll.id,
        selected_option: selectedOption,
        xpAwarded: 5 // Standard XP for poll participation
      });

      setVotedPolls(new Set([...votedPolls, poll.id]));
      
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  };

  const calculateResults = (poll) => {
    const totalVotes = poll.responses?.length || 0;
    const optionCounts = {};
    
    poll.poll_options.forEach(option => {
      optionCounts[option] = 0;
    });

    poll.responses?.forEach(response => {
      if (optionCounts.hasOwnProperty(response.selected_option)) {
        optionCounts[response.selected_option]++;
      }
    });

    return { optionCounts, totalVotes };
  };

  const activePoll = polls.find(poll => poll.is_active && new Date(poll.expires_at) > new Date());

  if (!activePoll) {
    return (
      <Card className="bg-brand-charcoal border-brand-border">
        <CardContent className="p-6 text-center">
          <Users className="w-8 h-8 text-brand-text-secondary mx-auto mb-2" />
          <p className="text-brand-text-secondary">No active polls right now.</p>
          <p className="text-xs text-brand-text-secondary mt-1">
            Polls appear during key moments in the game!
          </p>
        </CardContent>
      </Card>
    );
  }

  const hasVoted = votedPolls.has(activePoll.id);
  const { optionCounts, totalVotes } = calculateResults(activePoll);

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
              <Vote className="w-4 h-4 text-blue-400" />
              Live Poll
            </CardTitle>
            <div className="flex items-center gap-2">
              {activePoll.sponsor_info && (
                <Badge className="bg-purple-600 text-white text-xs">
                  {activePoll.sponsor_info.sponsor_name}
                </Badge>
              )}
              <Badge className="bg-amber-500 text-white">
                +5 XP
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Poll Question */}
          <div>
            <h4 className="font-medium text-brand-text-primary mb-2">
              {activePoll.poll_question}
            </h4>
            
            {activePoll.poll_type === 'sponsor_activation' && activePoll.sponsor_info && (
              <div className="flex items-center gap-2 mb-3">
                <img 
                  src={activePoll.sponsor_info.sponsor_logo} 
                  alt={activePoll.sponsor_info.sponsor_name}
                  className="w-4 h-4"
                />
                <span className="text-xs text-brand-text-secondary">
                  Sponsored by {activePoll.sponsor_info.sponsor_name}
                </span>
              </div>
            )}
          </div>

          {/* Poll Options */}
          <div className="space-y-2">
            {activePoll.poll_options.map((option, index) => {
              const voteCount = optionCounts[option] || 0;
              const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

              return (
                <div key={index} className="space-y-1">
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left h-auto p-3 relative overflow-hidden ${
                      hasVoted 
                        ? 'cursor-default' 
                        : 'hover:bg-brand-border'
                    }`}
                    onClick={() => handleVote(activePoll, option)}
                    disabled={hasVoted}
                  >
                    {/* Progress bar background for results */}
                    {hasVoted && (
                      <div 
                        className="absolute inset-0 bg-blue-500/20 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    )}
                    
                    <div className="relative flex items-center justify-between w-full">
                      <span className="text-brand-text-primary">{option}</span>
                      {hasVoted && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-brand-text-secondary">
                            {voteCount} ({Math.round(percentage)}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Vote Confirmation */}
          <AnimatePresence>
            {hasVoted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-3 rounded-lg bg-green-600/10 border border-green-600/20"
              >
                <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <p className="text-green-400 font-medium">Vote recorded! +5 XP</p>
                <p className="text-xs text-green-400/80 mt-1">
                  {totalVotes} total votes • Results updating live
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Poll Stats */}
          {hasVoted && (
            <div className="text-center pt-2 border-t border-brand-border">
              <p className="text-xs text-brand-text-secondary">
                <Users className="w-3 h-3 inline mr-1" />
                {totalVotes} fans have voted
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}