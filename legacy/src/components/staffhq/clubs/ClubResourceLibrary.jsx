import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KnowledgeArticle } from '@/api/entities';
import { Input } from '@/components/ui/input';
import { Loader2, Search, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ClubResourceLibrary() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      setIsLoading(true);
      try {
        const allArticles = await KnowledgeArticle.list();
        const clubResources = allArticles.filter(
          a => (a.target_roles?.includes('club_admin') || a.category === 'Club Operations') && a.status === 'published'
        );
        setArticles(clubResources);
        setFilteredArticles(clubResources);
      } catch (error) {
        console.error("Failed to load club resources:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadResources();
  }, []);

  useEffect(() => {
    const results = articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredArticles(results);
  }, [searchTerm, articles]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Club Resource Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <Input
              placeholder="Search for resources..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map(article => (
          <Card key={article.id} className="bg-brand-card-bg border-brand-border flex flex-col">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-red" />
                {article.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-brand-text-secondary mb-3 line-clamp-3">{article.description}</p>
              <div className="flex flex-wrap gap-1">
                {article.tags?.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <div className="p-4 pt-0">
              <Button variant="outline" className="w-full" asChild>
                <a href={article.content_url || '#'} target="_blank" rel="noopener noreferrer">View Resource</a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}