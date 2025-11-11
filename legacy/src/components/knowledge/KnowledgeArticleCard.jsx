import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Download, 
  FileText, 
  Bookmark,
  BookmarkCheck,
  Clock,
  Zap,
  ExternalLink,
  CheckCircle2,
  Star
} from 'lucide-react';

const getContentIcon = (type) => {
  switch (type) {
    case 'video': return Play;
    case 'download': return Download;
    case 'template': return FileText;
    case 'webinar': return Play;
    default: return FileText;
  }
};

const getContentColor = (type) => {
  switch (type) {
    case 'video': return 'bg-red-900/50 text-red-300';
    case 'download': return 'bg-green-900/50 text-green-300';
    case 'template': return 'bg-blue-900/50 text-blue-300';
    case 'webinar': return 'bg-purple-900/50 text-purple-300';
    default: return 'bg-gray-700 text-gray-300';
  }
};

const getDifficultyColor = (level) => {
  switch (level) {
    case 'beginner': return 'bg-green-900/50 text-green-300';
    case 'intermediate': return 'bg-yellow-900/50 text-yellow-300';
    case 'advanced': return 'bg-red-900/50 text-red-300';
    default: return 'bg-gray-700 text-gray-300';
  }
};

export default function KnowledgeArticleCard({ 
  article, 
  userProgress, 
  onComplete, 
  onBookmark, 
  isRecommended = false 
}) {
  const ContentIcon = getContentIcon(article.content_type);
  const isCompleted = userProgress?.status === 'completed';
  const isBookmarked = userProgress?.status === 'bookmarked';

  const handleCardClick = () => {
    if (article.content_url) {
      window.open(article.content_url, '_blank');
      
      // Mark as completed if not already
      if (!isCompleted && onComplete) {
        onComplete();
      }
    }
  };

  return (
    <Card className={`bg-brand-card-bg border-brand-border hover:border-brand-red transition-all duration-300 cursor-pointer flex flex-col ${
      isRecommended ? 'ring-2 ring-amber-500/50 bg-amber-900/20' : ''
    } ${isCompleted ? 'border-green-500/30 bg-green-900/20' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${getContentColor(article.content_type)}`}>
                <ContentIcon className="w-4 h-4" />
              </div>
              <Badge className={`${getContentColor(article.content_type)} border-0`} variant="secondary">
                {article.content_type}
              </Badge>
              {isRecommended && (
                <Star className="w-4 h-4 text-amber-400 fill-current" />
              )}
            </div>
            <CardTitle className="text-lg leading-tight text-brand-text-primary">
              {article.title}
            </CardTitle>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onBookmark();
              }}
              className="h-8 w-8 text-brand-text-secondary hover:text-brand-text-primary"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-blue-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </Button>
            {isCompleted && (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex-grow flex flex-col">
        <p className="text-sm text-brand-text-secondary mb-4 line-clamp-2 flex-grow">
          {article.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={`${getDifficultyColor(article.difficulty_level)} border-0`}>
            {article.difficulty_level}
          </Badge>
          {article.duration_minutes && (
            <Badge variant="outline" className="text-xs border-brand-border text-brand-text-secondary">
              <Clock className="w-3 h-3 mr-1" />
              {article.duration_minutes} min
            </Badge>
          )}
          <Badge variant="outline" className="text-xs border-brand-border text-brand-text-secondary">
            <Zap className="w-3 h-3 mr-1 text-amber-400" />
            +{article.xp_reward || 25} XP
          </Badge>
        </div>
        
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {article.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs border-brand-border text-brand-text-secondary">
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="outline" className="text-xs border-brand-border text-brand-text-secondary">
                +{article.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <Button 
          onClick={handleCardClick}
          className={`w-full mt-auto ${isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-brand-red hover:bg-red-700'}`}
          disabled={!article.content_url}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Completed
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              {article.content_type === 'video' ? 'Watch' : 
               article.content_type === 'download' ? 'Download' : 'Read'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}