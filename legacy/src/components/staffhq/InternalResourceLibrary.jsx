
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  Eye,
  Plus,
  Upload,
  Folder,
  Star,
  Clock,
  Users,
  Building,
  Shield,
  Briefcase,
  Heart,
  Zap,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import ResponsiveTabs from '../ui/ResponsiveTabs';

// Mock data - in a real app, this would come from an API/database
const mockDocuments = [
  {
    id: '1',
    title: 'Standard Operating Procedures - Events',
    description: 'Complete SOPs for event planning and execution',
    department: 'Operations',
    category: 'procedures',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    lastUpdated: '2024-01-10',
    author: 'Events Team',
    downloadCount: 45,
    isFavorite: true,
    tags: ['events', 'procedures', 'planning'],
    url: '#'
  },
  {
    id: '2',
    title: 'Employee Handbook 2024',
    description: 'Updated employee policies and procedures',
    department: 'HR',
    category: 'policies',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    lastUpdated: '2024-01-05',
    author: 'HR Department',
    downloadCount: 123,
    isFavorite: false,
    tags: ['hr', 'policies', 'handbook'],
    url: '#'
  },
  {
    id: '3',
    title: 'Sponsorship Contract Template',
    description: 'Standard contract template for sponsorship deals',
    department: 'Business',
    category: 'templates',
    fileType: 'DOCX',
    fileSize: '456 KB',
    lastUpdated: '2024-01-08',
    author: 'Legal Team',
    downloadCount: 67,
    isFavorite: true,
    tags: ['sponsorship', 'contracts', 'legal'],
    url: '#'
  },
  {
    id: '4',
    title: 'Crisis Communications Plan',
    description: 'Emergency communication protocols and templates',
    department: 'Communications',
    category: 'procedures',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    lastUpdated: '2024-01-12',
    author: 'Comms Team',
    downloadCount: 34,
    isFavorite: false,
    tags: ['crisis', 'communications', 'emergency'],
    url: '#'
  },
  {
    id: '5',
    title: 'Brand Guidelines 2024',
    description: 'Updated brand standards and visual identity guide',
    department: 'Marketing',
    category: 'guidelines',
    fileType: 'PDF',
    fileSize: '5.6 MB',
    lastUpdated: '2024-01-15',
    author: 'Marketing Team',
    downloadCount: 89,
    isFavorite: true,
    tags: ['brand', 'marketing', 'design'],
    url: '#'
  },
  {
    id: '6',
    title: 'Safe Sport Policy Updates',
    description: 'Latest policy updates and implementation guide',
    department: 'Safe Sport',
    category: 'policies',
    fileType: 'PDF',
    fileSize: '2.1 MB',
    lastUpdated: '2024-01-18',
    author: 'Safe Sport Team',
    downloadCount: 78,
    isFavorite: false,
    tags: ['safesport', 'policies', 'compliance'],
    url: '#'
  },
  {
    id: '7',
    title: 'Budget Template FY2024',
    description: 'Standard budget planning template',
    department: 'Finance',
    category: 'templates',
    fileType: 'XLSX',
    fileSize: '234 KB',
    lastUpdated: '2024-01-20',
    author: 'Finance Team',
    downloadCount: 56,
    isFavorite: false,
    tags: ['budget', 'finance', 'planning'],
    url: '#'
  },
  {
    id: '8',
    title: 'Volunteer Coordinator Guide',
    description: 'Best practices for managing volunteers',
    department: 'Operations',
    category: 'guides',
    fileType: 'PDF',
    fileSize: '3.2 MB',
    lastUpdated: '2024-01-22',
    author: 'Volunteer Team',
    downloadCount: 92,
    isFavorite: true,
    tags: ['volunteers', 'coordination', 'management'],
    url: '#'
  }
];

const departments = [
  { value: 'all', label: 'All Departments', icon: Building },
  { value: 'Operations', label: 'Operations', icon: Briefcase },
  { value: 'HR', label: 'Human Resources', icon: Users },
  { value: 'Marketing', label: 'Marketing', icon: Zap },
  { value: 'Communications', label: 'Communications', icon: Heart },
  { value: 'Finance', label: 'Finance', icon: Settings },
  { value: 'Business', label: 'Business', icon: Briefcase },
  { value: 'Safe Sport', label: 'Safe Sport', icon: Shield }
];

const categories = [
  { value: 'all', label: 'All Types' },
  { value: 'policies', label: 'Policies' },
  { value: 'procedures', label: 'Procedures' },
  { value: 'templates', label: 'Templates' },
  { value: 'guidelines', label: 'Guidelines' },
  { value: 'guides', label: 'Guides' }
];

const DocumentCard = ({ doc, onView, onDownload, onToggleFavorite }) => {
  const getFileIcon = (fileType) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return '📄';
      case 'docx': case 'doc': return '📝';
      case 'xlsx': case 'xls': return '📊';
      case 'pptx': case 'ppt': return '📽️';
      default: return '📁';
    }
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      'Operations': 'bg-blue-100 text-blue-800',
      'HR': 'bg-green-100 text-green-800',
      'Marketing': 'bg-purple-100 text-purple-800',
      'Communications': 'bg-pink-100 text-pink-800',
      'Finance': 'bg-yellow-100 text-yellow-800',
      'Business': 'bg-indigo-100 text-indigo-800',
      'Safe Sport': 'bg-red-100 text-red-800'
    };
    return colors[dept] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-brand-card-bg border-brand-border hover:border-brand-red transition-colors h-full">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getFileIcon(doc.fileType)}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-brand-text-primary text-sm leading-tight mb-1">
                  {doc.title}
                </h3>
                <p className="text-xs text-brand-text-secondary line-clamp-2">
                  {doc.description}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite(doc.id)}
              className="flex-shrink-0 w-8 h-8"
            >
              <Star className={`w-4 h-4 ${doc.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
            </Button>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            <Badge className={`text-xs ${getDepartmentColor(doc.department)}`}>
              {doc.department}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {doc.fileType}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {doc.fileSize}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs text-brand-text-secondary mb-3">
            <span>Updated: {new Date(doc.lastUpdated).toLocaleDateString()}</span>
            <span>{doc.downloadCount} downloads</span>
          </div>

          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onView(doc)}
              className="flex-1 text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            <Button 
              size="sm" 
              onClick={() => onDownload(doc)}
              className="flex-1 bg-brand-red hover:bg-red-700 text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function InternalResourceLibrary() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('all'); // This state is kept even if ResponsiveTabs is removed, as it's part of the filtering logic
  const [selectedDocument, setSelectedDocument] = useState(null);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Note: The 'viewMode' filter is no longer directly applied via ResponsiveTabs,
    // but the underlying filtering logic still works if desired for future use or
    // if a different UI component uses it. For this implementation, the simple
    // grid will display all filtered documents.
    const matchesDepartment = departmentFilter === 'all' || doc.department === departmentFilter;
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesView = viewMode === 'all' || (viewMode === 'favorites' && doc.isFavorite); // Kept for consistency, but not directly used by the simple grid display.

    return matchesSearch && matchesDepartment && matchesCategory && matchesView;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      case 'popular':
        return b.downloadCount - a.downloadCount;
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleView = (doc) => {
    setSelectedDocument(doc);
  };

  const handleDownload = (doc) => {
    // In a real app, this would trigger a file download
    alert(`Downloading: ${doc.title}`);
  };

  const handleToggleFavorite = (docId) => {
    setDocuments(docs => docs.map(doc => 
      doc.id === docId ? { ...doc, isFavorite: !doc.isFavorite } : doc
    ));
  };

  // The viewTabs structure is kept for potential future use or if the filtering logic depends on it,
  // but the ResponsiveTabs component itself is removed from rendering as per outline.
  const viewTabs = [
    {
      value: 'all',
      label: 'All Documents',
      icon: Folder,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedDocuments.map(doc => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onView={handleView}
              onDownload={handleDownload}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )
    },
    {
      value: 'favorites',
      label: 'Favorites',
      icon: Star,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedDocuments.filter(doc => doc.isFavorite).map(doc => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onView={handleView}
              onDownload={handleDownload}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )
    },
    {
      value: 'recent',
      label: 'Recent',
      icon: Clock,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedDocuments.slice(0, 6).map(doc => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onView={handleView}
              onDownload={handleDownload}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Internal Resource Library</h2>
          <p className="text-brand-text-secondary">Access internal documents, templates, and resources</p>
        </div>
        <Button className="bg-brand-red hover:bg-red-700">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary w-5 h-5" />
          <Input
            placeholder="Search documents, descriptions, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-brand-charcoal border-brand-border"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-40 bg-brand-charcoal border-brand-border">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32 bg-brand-charcoal border-brand-border">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 bg-brand-charcoal border-brand-border">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="alphabetical">A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-brand-text-secondary">
          {sortedDocuments.length} document{sortedDocuments.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedDocuments.map(doc => (
          <DocumentCard
            key={doc.id}
            doc={doc}
            onView={handleView}
            onDownload={handleDownload}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>

      {sortedDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-brand-text-primary mb-2">No documents found</h3>
          <p className="text-brand-text-secondary">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="max-w-4xl h-[80vh] bg-brand-card-bg border-brand-border">
            <DialogHeader>
              <DialogTitle className="text-brand-text-primary">{selectedDocument.title}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Document preview would appear here</p>
                <Button 
                  onClick={() => handleDownload(selectedDocument)}
                  className="bg-brand-red hover:bg-red-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Document
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
