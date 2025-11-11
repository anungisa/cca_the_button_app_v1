import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Search, Download, Eye, Trash2, Image, FileText, Video } from 'lucide-react';
import { motion } from 'framer-motion';

const mockAssets = [
  {
    id: 1,
    name: 'CC_Logo_Primary_2024.png',
    type: 'image',
    category: 'logos',
    campaign: 'Brand Refresh 2024',
    size: '2.4 MB',
    uploaded_date: '2024-11-15',
    url: 'https://via.placeholder.com/400x300?text=CC+Logo'
  },
  {
    id: 2,
    name: 'Championship_Media_Kit.pdf',
    type: 'document',
    category: 'media_kits',
    campaign: 'Brier 2024',
    size: '15.7 MB',
    uploaded_date: '2024-11-10',
    url: '#'
  },
  {
    id: 3,
    name: 'Team_Canada_Action_Shot.jpg',
    type: 'image',
    category: 'photos',
    campaign: 'Olympics Prep',
    size: '8.2 MB',
    uploaded_date: '2024-11-08',
    url: 'https://via.placeholder.com/400x300?text=Team+Canada'
  },
  {
    id: 4,
    name: 'Sponsor_Partnership_Video.mp4',
    type: 'video',
    category: 'videos',
    campaign: 'Partnership Launch',
    size: '125.8 MB',
    uploaded_date: '2024-11-05',
    url: '#'
  }
];

export default function MediaAssetManager() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCampaign, setFilterCampaign] = useState('all');

  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.campaign.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || asset.category === filterCategory;
    const matchesCampaign = filterCampaign === 'all' || asset.campaign === filterCampaign;
    
    return matchesSearch && matchesCategory && matchesCampaign;
  });

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5 text-blue-400" />;
      case 'video': return <Video className="w-5 h-5 text-red-400" />;
      case 'document': return <FileText className="w-5 h-5 text-green-400" />;
      default: return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      logos: 'bg-purple-600',
      media_kits: 'bg-blue-600',
      photos: 'bg-green-600',
      videos: 'bg-red-600',
      banners: 'bg-amber-600'
    };
    return colors[category] || 'bg-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Media Asset Manager</h2>
          <p className="text-brand-text-secondary">Centralized storage for logos, media kits, and campaign assets.</p>
        </div>
        
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-red hover:bg-red-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload Assets
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-brand-card-bg border-brand-border">
            <DialogHeader>
              <DialogTitle className="text-brand-text-primary">Upload Media Assets</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-brand-border rounded-lg p-12 text-center">
                <Upload className="w-16 h-16 mx-auto text-brand-text-secondary mb-4" />
                <p className="text-brand-text-primary font-medium mb-2">Drop files here or click to browse</p>
                <p className="text-brand-text-secondary text-sm">Supports JPG, PNG, PDF, MP4, and more</p>
                <Button variant="outline" className="mt-4">Choose Files</Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-brand-text-primary">Category</label>
                  <Select>
                    <SelectTrigger className="bg-brand-charcoal border-brand-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="logos">Logos</SelectItem>
                      <SelectItem value="media_kits">Media Kits</SelectItem>
                      <SelectItem value="photos">Photos</SelectItem>
                      <SelectItem value="videos">Videos</SelectItem>
                      <SelectItem value="banners">Banners</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-text-primary">Campaign</label>
                  <Input
                    placeholder="Associated campaign..."
                    className="bg-brand-charcoal border-brand-border"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                <Button className="bg-brand-red hover:bg-red-700">Upload Files</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
              <Input
                placeholder="Search assets by name or campaign..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-brand-charcoal border-brand-border"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48 bg-brand-charcoal border-brand-border">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="logos">Logos</SelectItem>
                <SelectItem value="media_kits">Media Kits</SelectItem>
                <SelectItem value="photos">Photos</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
                <SelectItem value="banners">Banners</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCampaign} onValueChange={setFilterCampaign}>
              <SelectTrigger className="w-48 bg-brand-charcoal border-brand-border">
                <SelectValue placeholder="All Campaigns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                <SelectItem value="Brand Refresh 2024">Brand Refresh 2024</SelectItem>
                <SelectItem value="Brier 2024">Brier 2024</SelectItem>
                <SelectItem value="Olympics Prep">Olympics Prep</SelectItem>
                <SelectItem value="Partnership Launch">Partnership Launch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAssets.map(asset => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
          >
            <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                {asset.type === 'image' && (
                  <div className="aspect-video bg-brand-charcoal rounded-lg mb-4 overflow-hidden">
                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                  </div>
                )}
                {asset.type !== 'image' && (
                  <div className="aspect-video bg-brand-charcoal rounded-lg mb-4 flex items-center justify-center">
                    {getFileIcon(asset.type)}
                  </div>
                )}
                
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-brand-text-primary truncate">{asset.name}</h3>
                    <p className="text-xs text-brand-text-secondary">{asset.campaign}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={getCategoryColor(asset.category)}>
                      {asset.category.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-brand-text-secondary">{asset.size}</span>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-brand-text-secondary">No assets match your current filters.</p>
        </div>
      )}
    </div>
  );
}