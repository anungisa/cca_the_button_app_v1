import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, CheckCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DEIResourceCard({ resource, onDownload, isCompleted }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="bg-brand-card-bg border-brand-border hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center">
                <resource.icon className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-text-primary">{resource.title}</h3>
                <Badge variant="outline" className="mt-1 capitalize border-purple-500/30 text-purple-300">
                  {resource.category}
                </Badge>
              </div>
            </div>
            {isCompleted && (
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 flex flex-col">
          <p className="text-brand-text-secondary flex-1">{resource.description}</p>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-brand-text-primary">Available Resources:</h4>
            {resource.resources.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-brand-charcoal/50 rounded">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-text-secondary" />
                  <span className="text-sm font-medium text-brand-text-primary">{item.name}</span>
                  <Badge variant="secondary" className="text-xs bg-brand-border text-brand-text-secondary">
                    {item.type}
                  </Badge>
                </div>
                <span className="text-xs text-brand-text-secondary">
                  {item.size || item.duration || item.readTime}
                </span>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={() => onDownload(resource)}
            disabled={isCompleted}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900/50 disabled:text-purple-400/50 mt-4"
          >
            <Download className="w-4 h-4 mr-2" />
            {isCompleted ? 'Completed' : 'Access Resources'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}