import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KnowledgeArticle } from '@/api/entities';
import { BookOpen, Eye, Edit, Trash2, Star } from 'lucide-react';

export default function KnowledgeArticleManager() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        const data = await KnowledgeArticle.list('-created_date', 20);
        setArticles(data);
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadArticles();
  }, []);

  const handleToggleFeatured = async (articleId, isFeatured) => {
    try {
      await KnowledgeArticle.update(articleId, { is_featured: !isFeatured });
      setArticles(prev => prev.map(article => 
        article.id === articleId ? { ...article, is_featured: !isFeatured } : article
      ));
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-red-100 text-red-800'
  };

  const contentTypeIcons = {
    article: BookOpen,
    video: Eye,
    download: Trash2,
    template: Edit,
    checklist: Eye,
    webinar: Eye
  };

  const ArticleCard = ({ article }) => {
    const IconComponent = contentTypeIcons[article.content_type] || BookOpen;
    
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-base font-medium text-brand-text-primary flex items-center gap-2">
                <IconComponent className="w-4 h-4" />
                {article.is_featured && <Star className="w-4 h-4 text-yellow-500" />}
                {article.title}
              </CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge className={statusColors[article.status]}>
                  {article.status}
                </Badge>
                <Badge variant="outline">
                  {article.content_type}
                </Badge>
                <Badge variant="outline">
                  {article.difficulty_level}
                </Badge>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleToggleFeatured(article.id, article.is_featured)}
            >
              <Star className={`w-4 h-4 ${article.is_featured ? 'text-yellow-500' : 'text-gray-400'}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-brand-text-secondary mb-3 line-clamp-2">{article.description}</p>
          <div className="flex items-center justify-between text-xs text-brand-text-muted">
            <span>Category: {article.category}</span>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.view_count || 0} views
            </div>
          </div>
          <div className="flex gap-1 mt-2">
            {article.tags?.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 bg-brand-charcoal text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="w-8 h-8 animate-spin border-2 border-brand-red border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-brand-text-primary">Knowledge Articles</h3>
        <div className="text-sm text-brand-text-secondary">
          {articles.length} total articles
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}