import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen } from 'lucide-react';
import { KnowledgeArticle } from '@/api/entities';
import KnowledgeArticleCard from '../components/knowledge/KnowledgeArticleCard';
import { useKnowledgeStats } from '../components/hooks/useKnowledgeStats';
import { useXP } from '../components/XPContext';

export default function KnowledgeCentreHub() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useXP();
  const { stats, isLoading: statsLoading } = useKnowledgeStats(user?.id, user?.role, user?.home_club_id);

  const categories = ["business_operations", "safety_first", "playing_conditions", "growth", "facilities", "governance", "resources"];

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    let filtered = articles;
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(a => a.category === categoryFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(a => 
        (a.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredArticles(filtered);
  }, [articles, searchTerm, categoryFilter]);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const data = await KnowledgeArticle.list();
      setArticles(data || []);
      setFilteredArticles(data || []);
    } catch (error) {
      console.error("Failed to load articles", error);
      setArticles([]);
      setFilteredArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Safe display of category names
  const formatCategoryName = (category) => {
    if (!category || typeof category !== 'string') return 'Unknown';
    return category.replace(/_/g, ' ');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-brand-text-primary">Knowledge Centre</h1>
        <p className="text-xl mt-2 text-brand-text-secondary">Your central repository for curling resources, guides, and best practices.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader><CardTitle>Articles Completed</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.completed}</p></CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader><CardTitle>XP Earned</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.xp_earned}</p></CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader><CardTitle>Most Popular Category</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold capitalize">{formatCategoryName(stats.top_category)}</p></CardContent>
        </Card>
      </div>
      
      <Card className="bg-brand-card-bg border-brand-border p-4">
        <div className="flex gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <Input placeholder="Search articles..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{formatCategoryName(cat)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p>Loading articles...</p>
        ) : (
          filteredArticles.map(article => (
            <KnowledgeArticleCard key={article.id} article={article} />
          ))
        )}
      </div>
    </div>
  );
}