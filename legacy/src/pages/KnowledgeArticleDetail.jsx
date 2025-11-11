import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { KnowledgeArticle } from '@/api/entities';
import { KnowledgeProgress } from '@/api/entities';
import { ArticleFeedback } from '@/api/entities';
import { BookOpen, Clock, Award, ThumbsUp, ThumbsDown, ArrowLeft, Eye, Download, Share } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useXP } from '../components/XPContext';
import WorkflowEngine from '../components/utils/WorkflowEngine';

const FeedbackSection = ({ articleId, userId, existingFeedback }) => {
  const [feedback, setFeedback] = useState(existingFeedback || null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedbackSubmit = async (wasHelpful) => {
    if (!userId) return;
    
    setIsSubmitting(true);
    try {
      await ArticleFeedback.create({
        article_id: articleId,
        user_id: userId,
        was_helpful: wasHelpful,
        comment: comment.trim() || null
      });
      
      setFeedback({ was_helpful: wasHelpful, comment });
      setComment('');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (feedback) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            {feedback.was_helpful ? (
              <ThumbsUp className="w-5 h-5 text-green-500" />
            ) : (
              <ThumbsDown className="w-5 h-5 text-red-500" />
            )}
            <span className="text-brand-text-primary font-medium">
              Thank you for your feedback!
            </span>
          </div>
          {feedback.comment && (
            <p className="text-brand-text-secondary italic">"{feedback.comment}"</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Was this article helpful?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button
            onClick={() => handleFeedbackSubmit(true)}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <ThumbsUp className="w-4 h-4" />
            Yes, helpful
          </Button>
          <Button
            variant="outline"
            onClick={() => handleFeedbackSubmit(false)}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <ThumbsDown className="w-4 h-4" />
            Not helpful
          </Button>
        </div>
        <Textarea
          placeholder="Any additional comments? (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
      </CardContent>
    </Card>
  );
};

export default function KnowledgeArticleDetail() {
  const { user, awardPoints } = useXP();
  const [article, setArticle] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [userFeedback, setUserFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  // Get article ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');

  useEffect(() => {
    if (articleId) {
      loadArticleData();
    }
  }, [articleId, user]);

  const loadArticleData = async () => {
    try {
      const [articleData, progressData, feedbackData] = await Promise.all([
        KnowledgeArticle.filter({ id: articleId }),
        user ? KnowledgeProgress.filter({ user_id: user.id, article_id: articleId }) : [],
        user ? ArticleFeedback.filter({ user_id: user.id, article_id: articleId }) : []
      ]);

      if (articleData.length > 0) {
        setArticle(articleData[0]);
        setUserProgress(progressData[0] || null);
        setUserFeedback(feedbackData[0] || null);
      }
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsCompleted = async () => {
    if (!user || !article) return;
    
    setIsMarkingComplete(true);
    try {
      // Create or update progress record
      const progressData = {
        user_id: user.id,
        article_id: article.id,
        status: 'completed',
        completion_date: new Date().toISOString()
      };

      if (userProgress) {
        await KnowledgeProgress.update(userProgress.id, progressData);
      } else {
        await KnowledgeProgress.create(progressData);
      }

      // Award XP
      await awardPoints(
        article.xp_reward,
        'knowledge_article_completed',
        `Completed: ${article.title}`,
        article.id
      );

      // Trigger workflow
      await WorkflowEngine.triggerWorkflow('knowledge_article_completed', {
        user_id: user.id,
        article_id: article.id,
        category: article.category,
        xp_awarded: article.xp_reward
      });

      setUserProgress({ ...progressData, id: userProgress?.id || 'new' });
    } catch (error) {
      console.error('Failed to mark article as completed:', error);
      alert('Failed to mark as completed. Please try again.');
    } finally {
      setIsMarkingComplete(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <Card className="bg-brand-card-bg border-brand-border max-w-md">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-brand-text-secondary" />
            <p className="text-brand-text-primary">Article not found</p>
            <Link to={createPageUrl('KnowledgeBase')}>
              <Button className="mt-4">Back to Knowledge Base</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCompleted = userProgress?.status === 'completed';
  const difficultyColors = {
    'beginner': 'bg-green-100 text-green-800',
    'intermediate': 'bg-yellow-100 text-yellow-800', 
    'advanced': 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-brand-charcoal pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to={createPageUrl('KnowledgeBase')}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Knowledge Base
              </Button>
            </Link>
            {isCompleted && (
              <Badge className="bg-green-600 text-white flex items-center gap-1">
                <Award className="w-3 h-3" />
                Completed
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-brand-text-primary mb-4">{article.title}</h1>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge className={difficultyColors[article.difficulty_level]}>
              {article.difficulty_level}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.duration_minutes} min read
            </Badge>
            <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
              <Award className="w-3 h-3" />
              +{article.xp_reward} XP
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.content_type}
            </Badge>
          </div>

          {article.description && (
            <p className="text-lg text-brand-text-secondary">{article.description}</p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-8">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-8">
              {article.content_type === 'video' && article.content_url ? (
                <div className="mb-6">
                  <div className="aspect-video bg-brand-charcoal rounded-lg flex items-center justify-center">
                    <p className="text-brand-text-secondary">
                      Video content: <a href={article.content_url} target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">
                        {article.content_url}
                      </a>
                    </p>
                  </div>
                </div>
              ) : article.content_url ? (
                <div className="mb-6">
                  <Button asChild variant="outline">
                    <a href={article.content_url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      View/Download Content
                    </a>
                  </Button>
                </div>
              ) : null}

              <div className="prose prose-invert max-w-none">
                <p className="text-brand-text-primary leading-relaxed">
                  This is a placeholder for the full article content. In a real implementation, 
                  this would contain the complete article text, images, and formatting.
                </p>
                <p className="text-brand-text-secondary mt-4">
                  Content would be loaded from the <code>content_url</code> or stored directly 
                  in the article record depending on the implementation approach.
                </p>
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-brand-border">
                  <h4 className="text-sm font-semibold text-brand-text-primary mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map(tag => (
                      <span key={tag} className="text-sm bg-brand-charcoal text-brand-text-secondary px-3 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          {user && !isCompleted && (
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-brand-text-primary">Mark as Completed</h3>
                    <p className="text-sm text-brand-text-secondary">
                      Complete this article to earn {article.xp_reward} XP
                    </p>
                  </div>
                  <Button onClick={markAsCompleted} disabled={isMarkingComplete}>
                    {isMarkingComplete ? 'Processing...' : 'Mark Complete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feedback */}
          {user && (
            <FeedbackSection
              articleId={article.id}
              userId={user.id}
              existingFeedback={userFeedback}
            />
          )}
        </div>
      </div>
    </div>
  );
}