import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Users, 
  BookOpen, 
  Target,
  Lightbulb,
  Megaphone,
  UserCheck,
} from 'lucide-react';
import { XPProvider, useXP } from '../components/XPContext';
import DEIResourceCard from '../components/dei/DEIResourceCard';
import DEIProgressTracker from '../components/dei/DEIProgressTracker';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const deiResources = [
  {
    id: 'diversity_importance',
    title: 'Importance of Diversity',
    description: 'Understanding why diversity strengthens our curling community.',
    icon: Users,
    category: 'foundation',
    resources: [
      { name: 'Diversity in Sport Research', type: 'pdf', size: '2.1 MB' },
      { name: 'Benefits of Inclusive Programming', type: 'video', duration: '8 min' },
      { name: 'Community Impact Stories', type: 'article', readTime: '5 min' }
    ]
  },
  {
    id: 'unconscious_bias',
    title: 'Unconscious Bias Training',
    description: 'Recognize and address unconscious bias in curling environments.',
    icon: Target,
    category: 'training',
    resources: [
      { name: 'Bias Recognition Workshop', type: 'interactive', duration: '30 min' },
      { name: 'Inclusive Language Guide', type: 'pdf', size: '1.8 MB' },
      { name: 'Self-Assessment Tool', type: 'quiz', duration: '10 min' }
    ]
  },
  {
    id: 'new_programs',
    title: 'New Program Ideas',
    description: 'Innovative programming to attract diverse participants.',
    icon: Lightbulb,
    category: 'programs',
    resources: [
      { name: 'Adaptive Curling Program Guide', type: 'pdf', size: '3.2 MB' },
      { name: 'Multicultural Outreach Template', type: 'template', size: '1.5 MB' },
      { name: 'Youth Diversity Program Examples', type: 'case_study', readTime: '12 min' }
    ]
  },
  {
    id: 'marketing_resources',
    title: 'Marketing Resource Library',
    description: 'Tools and templates for inclusive marketing campaigns.',
    icon: Megaphone,
    category: 'marketing',
    resources: [
      { name: 'Inclusive Imagery Guidelines', type: 'pdf', size: '2.7 MB' },
      { name: 'Social Media Templates', type: 'template', size: '4.1 MB' },
      { name: 'Community Outreach Toolkit', type: 'toolkit', size: '5.3 MB' }
    ]
  },
  {
    id: 'board_engagement',
    title: 'Board Engagement Toolkit',
    description: 'Engaging leadership in diversity and inclusion initiatives.',
    icon: UserCheck,
    category: 'governance',
    resources: [
      { name: 'Board DEI Policy Template', type: 'template', size: '1.2 MB' },
      { name: 'Leadership Training Module', type: 'video', duration: '25 min' },
      { name: 'Progress Tracking Worksheets', type: 'worksheet', size: '890 KB' }
    ]
  },
  {
    id: 'definitions_education',
    title: 'Glossary & Definitions',
    description: 'Essential terms and concepts for inclusive curling.',
    icon: BookOpen,
    category: 'education',
    resources: [
      { name: 'DEI Terminology Guide', type: 'pdf', size: '1.1 MB' },
      { name: 'Quick Reference Cards', type: 'printable', size: '2.3 MB' },
      { name: 'Educational Video Series', type: 'video', duration: '45 min' }
    ]
  }
];

function DEIHubContent() {
  const { awardPoints, awardBadge } = useXP();
  const [completedResources, setCompletedResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleResourceDownload = async (resource) => {
    if (completedResources.includes(resource.id)) return;
    
    await awardPoints(50, 'education', `Accessed DEI resource: ${resource.title}`);
    
    const newCompleted = [...completedResources, resource.id];
    setCompletedResources(newCompleted);
    
    if (newCompleted.length >= 3) {
      await awardBadge(
        'inclusion_advocate',
        'Inclusion Advocate',
        'Downloaded 3 or more DEI resources'
      );
      await awardPoints(100, 'achievement', 'Earned Inclusion Advocate badge');
    }
    
    if (newCompleted.length >= 6) {
      await awardBadge(
        'diversity_champion',
        'Diversity Champion',
        'Completed comprehensive DEI training'
      );
      await awardPoints(200, 'achievement', 'Earned Diversity Champion badge');
    }
    
    window.open('#', '_blank');
  };

  const filteredResources = selectedCategory === 'all' 
    ? deiResources 
    : deiResources.filter(r => r.category === selectedCategory);

  const categories = ['all', ...new Set(deiResources.map(r => r.category))];

  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-brand-text-primary mb-4">
            Diversity, Equity & Inclusion Hub
          </h1>
          <p className="text-xl text-brand-text-secondary max-w-3xl mx-auto">
            "Curling is a place for everyone." Explore resources, training, and tools to build 
            a more inclusive curling community for all participants.
          </p>
        </motion.div>

        <div className="mb-8">
          <DEIProgressTracker 
            completedResources={completedResources.length}
            totalResources={deiResources.length}
          />
        </div>

        <div className="mb-8">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 bg-brand-card-bg border-brand-border p-1 h-auto">
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category} 
                  className="capitalize text-brand-text-secondary data-[state=active]:bg-brand-red data-[state=active]:text-white"
                >
                  {category === 'all' ? 'All Topics' : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <DEIResourceCard
              key={resource.id}
              resource={resource}
              onDownload={handleResourceDownload}
              isCompleted={completedResources.includes(resource.id)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Lead Change?</h2>
              <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                Take your learning beyond the app. Host a DEI workshop at your club and 
                earn the prestigious "DEI Leader" badge.
              </p>
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white/90 text-purple-700 hover:bg-white"
                onClick={() => {
                  awardPoints(300, 'leadership', 'Committed to hosting DEI workshop');
                  awardBadge('dei_leader', 'DEI Leader', 'Committed to hosting a DEI workshop at their club');
                }}
              >
                <Users className="w-5 h-5 mr-2" />
                Commit to Host Workshop (+300 XP)
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function DEIHub() {
  return (
    <XPProvider>
      <DEIHubContent />
    </XPProvider>
  );
}