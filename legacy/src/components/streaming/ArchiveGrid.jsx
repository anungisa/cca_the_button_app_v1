import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Archive, Search, Calendar, Download, Play, Film } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ArchiveGrid({ onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState('all');

  // Sample archived content (would come from AWS S3 in production)
  const archivedContent = [
    {
      id: 'arch1',
      title: '2023 Tim Hortons Brier - Final',
      year: '2023',
      event: 'Brier',
      date: '2023-03-12',
      duration: '2:45:30',
      thumbnail: 'https://images.unsplash.com/photo-1516985080664-ed2fc6a32937?w=400',
      fileSize: '4.2 GB',
      format: 'MP4',
      quality: '1080p'
    },
    {
      id: 'arch2',
      title: '2022 Scotties Tournament of Hearts - Championship',
      year: '2022',
      event: 'Scotties',
      date: '2022-02-27',
      duration: '2:30:15',
      thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      fileSize: '3.8 GB',
      format: 'MP4',
      quality: '1080p'
    },
    {
      id: 'arch3',
      title: '2021 World Curling Championships - Semi-Final',
      year: '2021',
      event: 'Worlds',
      date: '2021-05-08',
      duration: '2:15:45',
      thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
      fileSize: '3.5 GB',
      format: 'MP4',
      quality: '720p'
    },
    {
      id: 'arch4',
      title: '2020 Canadian Mixed Doubles - Final',
      year: '2020',
      event: 'Mixed Doubles',
      date: '2020-03-22',
      duration: '1:45:20',
      thumbnail: 'https://images.unsplash.com/photo-1578949266097-178b4b4cc58a?w=400',
      fileSize: '2.8 GB',
      format: 'MP4',
      quality: '1080p'
    }
  ];

  const years = ['all', '2023', '2022', '2021', '2020', '2019'];
  const events = ['all', 'Brier', 'Scotties', 'Worlds', 'Mixed Doubles', 'Juniors'];

  const filteredContent = archivedContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === 'all' || item.year === selectedYear;
    const matchesEvent = selectedEvent === 'all' || item.event === selectedEvent;
    return matchesSearch && matchesYear && matchesEvent;
  });

  const handleDownload = (item) => {
    alert(`Download functionality for "${item.title}" will be implemented with AWS S3 integration`);
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-950/50 border-blue-800">
        <Archive className="h-4 w-4" />
        <AlertDescription>
          Access our historical archive of curling events. Videos are stored in AWS cold storage and may take a moment to retrieve.
        </AlertDescription>
      </Alert>

      {/* Filters */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film className="w-5 h-5" />
            Archive Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
              <Input
                placeholder="Search archive..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-brand-charcoal border-brand-border"
              />
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="bg-brand-charcoal border-brand-border">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year}>
                    {year === 'all' ? 'All Years' : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="bg-brand-charcoal border-brand-border">
                <SelectValue placeholder="Select Event" />
              </SelectTrigger>
              <SelectContent>
                {events.map(event => (
                  <SelectItem key={event} value={event}>
                    {event === 'all' ? 'All Events' : event}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Archive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((item) => (
          <Card key={item.id} className="bg-brand-card-bg border-brand-border overflow-hidden hover:border-brand-red transition-colors group">
            <div className="relative aspect-video cursor-pointer" onClick={() => onSelect && onSelect(item)}>
              <img 
                src={item.thumbnail} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-12 h-12 text-white" />
              </div>
              <Badge className="absolute top-2 left-2 bg-purple-600 text-white">
                <Archive className="w-3 h-3 mr-1" />
                Archive
              </Badge>
              <Badge className="absolute top-2 right-2 bg-black/80 text-white">
                {item.quality}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h4 className="font-semibold text-brand-text-primary mb-2 line-clamp-2">
                {item.title}
              </h4>
              <div className="space-y-2 text-sm text-brand-text-secondary mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.date).toLocaleDateString()}
                </div>
                <div className="flex items-center justify-between">
                  <span>Duration: {item.duration}</span>
                  <span>{item.fileSize}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onSelect && onSelect(item)}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Play
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDownload(item)}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-12 text-center">
            <Archive className="w-16 h-16 text-brand-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-brand-text-primary mb-2">
              No archived content found
            </h3>
            <p className="text-brand-text-secondary">
              Try adjusting your filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}