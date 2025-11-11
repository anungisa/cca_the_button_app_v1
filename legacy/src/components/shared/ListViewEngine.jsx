/**
 * Universal List View Engine
 * Replaces dozens of custom list implementations
 */

import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ListViewEngine({
  data = [],
  renderCard,
  renderListItem,
  filters = [],
  searchFields = [],
  sortOptions = [],
  title,
  emptyMessage = 'No items found',
  defaultView = 'grid',
  enableViewToggle = true,
  className = ''
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [sortBy, setSortBy] = useState(sortOptions[0]?.value || null);
  const [viewMode, setViewMode] = useState(defaultView);

  // Filtering and searching
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm && searchFields.length > 0) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => {
          const value = getNestedValue(item, field);
          return String(value).toLowerCase().includes(term);
        })
      );
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(item => {
          const itemValue = getNestedValue(item, key);
          return itemValue === value;
        });
      }
    });

    // Apply sorting
    if (sortBy) {
      const sortOption = sortOptions.find(opt => opt.value === sortBy);
      if (sortOption) {
        result.sort((a, b) => {
          const aVal = getNestedValue(a, sortOption.field);
          const bVal = getNestedValue(b, sortOption.field);
          
          const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return sortOption.direction === 'desc' ? -comparison : comparison;
        });
      }
    }

    return result;
  }, [data, searchTerm, activeFilters, sortBy, searchFields, sortOptions]);

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, part) => current?.[part], obj);
  };

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      {title && (
        <h2 className="text-2xl font-bold text-brand-text-primary">{title}</h2>
      )}

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        {/* Search */}
        {searchFields.length > 0 && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Filters */}
        {filters.map(filter => (
          <Select
            key={filter.key}
            value={activeFilters[filter.key] || 'all'}
            onValueChange={(value) => handleFilterChange(filter.key, value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {filter.label}</SelectItem>
              {filter.options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {/* Sort */}
        {sortOptions.length > 0 && (
          <Select value={sortBy || ''} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* View Toggle */}
        {enableViewToggle && (
          <div className="flex gap-1 border border-brand-border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-brand-red' : ''}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-brand-red' : ''}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <p className="text-sm text-brand-text-secondary">
        Showing {processedData.length} of {data.length} items
      </p>

      {/* Content */}
      <AnimatePresence mode="wait">
        {processedData.length > 0 ? (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {viewMode === 'grid' && renderCard ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {processedData.map((item, idx) => (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.2 }}
                  >
                    {renderCard(item)}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {processedData.map((item, idx) => (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.2 }}
                  >
                    {renderListItem ? renderListItem(item) : renderCard(item)}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-brand-text-secondary">
            {emptyMessage}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}