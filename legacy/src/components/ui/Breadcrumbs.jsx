import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-brand-text-secondary">
      <Link 
        to={createPageUrl('Home')} 
        className="flex items-center hover:text-brand-text-primary transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4" />
          <span className={index === items.length - 1 ? 'text-brand-text-primary font-medium' : 'hover:text-brand-text-primary'}>
            {item.label}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
}