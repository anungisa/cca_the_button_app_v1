import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ResearchResource } from '@/api/entities';
import { BookCopy, Search, Download } from 'lucide-react';

const InternalResearchRepo = () => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const data = await ResearchResource.filter({ is_public: false });
      setResources(data || []);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (resource.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (resource.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return <div className="text-center p-8"><p className="text-brand-text-secondary">Loading repository...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-brand-text-primary">Internal Research Repository</h3>
        <p className="text-brand-text-secondary">A library of internal whitepapers, datasets, and analysis</p>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
            <Input
              placeholder="Search by title, description, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-brand-charcoal border-brand-border"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredResources.map(resource => (
          <Card key={resource.id} className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-semibold text-brand-text-primary mb-2">{resource.title}</h4>
                  <p className="text-sm text-brand-text-secondary mb-3">{resource.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-brand-border capitalize">
                      {resource.resource_type}
                    </Badge>
                    {(resource.tags || []).map((tag, i) => (
                      <Badge key={i} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredResources.length === 0 && (
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-8 text-center text-brand-text-secondary">
              No internal research resources found.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InternalResearchRepo;