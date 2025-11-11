
import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Search, Edit2, Trash2, Eye, FileText, Video, Download, Loader2, Users, Globe, Calendar, MessageCircle, Settings, AlertTriangle } from 'lucide-react';
import { useXP } from '../../XPContext';
import { KnowledgeArticle } from '@/api/entities';
import { ArticleCategory } from '@/api/entities';
import { format } from 'date-fns';

const CategoryManager = React.lazy(() => import('./CategoryManager'));

const ArticleFormModal = ({ isOpen, onClose, onSave, article, categories }) => {
  const { user } = useXP();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (article) {
      setFormData(article);
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        content_type: 'article',
        full_content: '',
        content_url: '',
        tags: [],
        status: 'draft',
      });
    }
  }, [article, isOpen]);

  const handleSave = async () => {
    const dataToSave = {
      ...formData,
      tags: Array.isArray(formData.tags) ? formData.tags : formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      author_name: user.full_name,
    };
    await onSave(dataToSave);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{article ? 'Edit' : 'Create'} Article</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input placeholder="Article Title" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <Textarea placeholder="Brief Description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
              <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
              <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={formData.content_type} onValueChange={(v) => setFormData({ ...formData, content_type: v })}>
              <SelectTrigger><SelectValue placeholder="Content Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="download">Download</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.content_type === 'article' ? (
            <Textarea placeholder="Full article content..." value={formData.full_content || ''} onChange={(e) => setFormData({ ...formData, full_content: e.target.value })} rows={10} />
          ) : (
            <Input placeholder="Content URL (e.g., YouTube, PDF link)" value={formData.content_url || ''} onChange={(e) => setFormData({ ...formData, content_url: e.target.value })} />
          )}
          <Input placeholder="Tags (comma-separated)" defaultValue={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''} onBlur={(e) => setFormData({ ...formData, tags: e.target.value })} />
          <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Article</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ViewArticleModal = ({ isOpen, onClose, article }) => {
  if (!isOpen || !article) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{article.title}</DialogTitle>
          <DialogDescription>Category: {article.category} | Last updated: {article.updated_date ? format(new Date(article.updated_date), 'PPP') : 'N/A'}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <p className="font-semibold">Description:</p>
          <p>{article.description}</p>
          {article.full_content && (
            <>
              <p className="font-semibold mt-4">Content:</p>
              <div className="prose prose-sm max-w-none text-brand-text-primary" dangerouslySetInnerHTML={{ __html: article.full_content.replace(/\n/g, '<br />') }} />
            </>
          )}
          {article.content_url && <p><strong>URL:</strong> <a href={article.content_url} target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">{article.content_url}</a></p>}
          <div className="flex gap-2 flex-wrap">
            {article.tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default function KnowledgeManagementHub() {
  const { user } = useXP();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ articles: 0, categories: 0, featured: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [viewingArticle, setViewingArticle] = useState(null);
  const [deletingArticle, setDeletingArticle] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [articlesData, categoriesData] = await Promise.all([
        KnowledgeArticle.list(),
        ArticleCategory.list()
      ]);
      
      const safeArticles = articlesData || [];
      const safeCategories = categoriesData || [];

      setArticles(safeArticles);
      setCategories(safeCategories);

      const featuredCount = safeArticles.filter(a => a.is_featured).length;
      setStats({ articles: safeArticles.length, categories: safeCategories.length, featured: featuredCount });

    } catch (error) {
      console.error("Failed to load knowledge hub data:", error);
      // Set to empty arrays on error to prevent crashes
      setArticles([]);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveArticle = async (data) => {
    try {
      if (editingArticle) {
        await KnowledgeArticle.update(editingArticle.id, data);
      } else {
        await KnowledgeArticle.create({ ...data, created_by: user.id, author_name: user.full_name });
      }
    } catch(e) { console.error(e); } finally {
      setIsFormModalOpen(false);
      setEditingArticle(null);
      loadData();
    }
  };

  const handleDeleteArticle = async () => {
    if (deletingArticle) {
      await KnowledgeArticle.delete(deletingArticle.id);
      setDeletingArticle(null);
      loadData();
    }
  };

  const openFormModal = (article = null) => {
    setEditingArticle(article);
    setIsFormModalOpen(true);
  };
  
  const filteredArticles = articles.filter(article => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = article.title.toLowerCase().includes(term) ||
                          (article.tags || []).some(tag => tag.toLowerCase().includes(term));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const StatCard = ({ title, value, icon: Icon }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-brand-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-brand-text-primary">{value}</p>
        </div>
        <Icon className="w-8 h-8 text-brand-red" />
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-brand-charcoal min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
            <Globe className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">Knowledge Management</h1>
            <p className="text-brand-text-secondary">Create, organize, and manage internal knowledge resources</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <StatCard title="Total Articles" value={stats.articles} icon={FileText} />
          <StatCard title="Total Categories" value={stats.categories} icon={BookOpen} />
          <StatCard title="Featured Articles" value={stats.featured} icon={Users} />
          <StatCard title="Views This Month" value="2,847" icon={Eye} />
        </div>
        
        <Tabs defaultValue="articles">
          <TabsList className="grid w-full grid-cols-4 bg-brand-card-bg">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="articles" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex-1 relative w-full">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                      <Input placeholder="Search articles or tags..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map(cat => <SelectItem key={cat.id || cat.name} value={cat.name}>{cat.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button onClick={() => openFormModal()} className="bg-brand-red text-white hover:bg-red-700 w-full md:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Article
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredArticles.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell className="font-medium text-brand-text-primary">
                            <div>
                              {article.title}
                              {article.is_featured && (
                                <Badge className="ml-2 bg-amber-600 text-white">Featured</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{article.category}</TableCell>
                          <TableCell>
                            <Badge className={
                              article.status === 'published' ? 'bg-green-600' :
                              article.status === 'draft' ? 'bg-yellow-600' : 'bg-gray-600'
                            }>
                              {article.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{article.author_name || 'Unknown'}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => setViewingArticle(article)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openFormModal(article)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setDeletingArticle(article)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredArticles.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-brand-text-secondary">
                            No articles found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="categories" className="mt-6">
            <Suspense fallback={<div className="flex justify-center items-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
              <CategoryManager />
            </Suspense>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Popular Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredArticles.slice(0, 5).map(article => (
                      <div key={article.id} className="flex items-center justify-between">
                        <span className="text-sm text-brand-text-primary truncate">{article.title}</span>
                        <Badge variant="outline">{Math.floor(Math.random() * 500) + 100} views</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.slice(0, 5).map(category => (
                      <div key={category.id || category.name} className="flex items-center justify-between">
                        <span className="text-sm text-brand-text-primary">{category.name}</span>
                        <Badge variant="outline">
                          {articles.filter(a => a.category === category.name).length} articles
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Article Templates</CardTitle>
                <p className="text-sm text-brand-text-secondary">
                  Pre-built templates to help staff create consistent, high-quality knowledge articles
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: 'Event Planning Guide', icon: Calendar, description: 'Template for event planning documentation' },
                    { name: 'Policy Update', icon: FileText, description: 'Standard format for policy changes' },
                    { name: 'Training Material', icon: Users, description: 'Educational content template' },
                    { name: 'FAQ Format', icon: MessageCircle, description: 'Frequently asked questions template' },
                    { name: 'Process Documentation', icon: Settings, description: 'Step-by-step process guide' },
                    { name: 'Troubleshooting Guide', icon: AlertTriangle, description: 'Problem resolution template' }
                  ].map(template => (
                    <Card key={template.name} className="bg-brand-charcoal border-brand-border hover:border-brand-red transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <template.icon className="w-5 h-5 text-brand-red" />
                          <h4 className="font-semibold text-brand-text-primary">{template.name}</h4>
                        </div>
                        <p className="text-sm text-brand-text-secondary mb-3">{template.description}</p>
                        <Button size="sm" variant="outline" className="w-full">
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ArticleFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSave={handleSaveArticle} article={editingArticle} categories={categories} />
        <ViewArticleModal isOpen={!!viewingArticle} onClose={() => setViewingArticle(null)} article={viewingArticle} />
        <AlertDialog open={!!deletingArticle} onOpenChange={() => setDeletingArticle(null)}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the article. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteArticle}>Delete</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
