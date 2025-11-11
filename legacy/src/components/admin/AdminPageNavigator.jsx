import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import { pageRegistry } from '../utils/pageRegistry';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GripVertical, Search, ChevronsDownUp, X } from 'lucide-react';

const AdminPageNavigator = () => {
  const { permissions, isLoading } = usePermissions();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const panelRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const filteredPages = useMemo(() => {
    return pageRegistry
      .filter(page => page.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort();
  }, [searchTerm]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.drag-handle')) {
      isDragging.current = true;
      dragStartPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      panelRef.current.style.transition = 'none';
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (panelRef.current) {
      panelRef.current.style.transition = 'all 0.3s ease-in-out';
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (isLoading || !permissions.canAccessStaffHQ) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className={`fixed z-[9999] bg-brand-card-bg/80 backdrop-blur-lg border border-brand-red/50 rounded-lg shadow-2xl text-brand-text-primary transition-all duration-300 ease-in-out ${
        isOpen ? 'w-80 h-[70vh] opacity-100' : 'w-48 h-14 opacity-90 hover:opacity-100'
      }`}
      style={{
        bottom: `${position.y}px`,
        right: `${position.x}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex flex-col h-full">
        <div
          className={`drag-handle cursor-grab active:cursor-grabbing flex items-center p-2 border-b border-brand-border/50 ${isOpen ? 'justify-between' : 'justify-center'}`}
        >
          <GripVertical className="w-5 h-5 text-brand-text-secondary" />
          <h3 className="font-bold text-brand-text-primary text-sm">Admin Navigator</h3>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer"
          >
            {isOpen ? <X className="w-4 h-4" /> : <ChevronsDownUp className="w-4 h-4" />}
          </Button>
        </div>

        {isOpen && (
          <div className="p-2 flex-grow flex flex-col min-h-0">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
              <Input
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <ScrollArea className="flex-grow">
              <div className="pr-4">
                {filteredPages.map(pageName => (
                  <Link
                    key={pageName}
                    to={createPageUrl(pageName)}
                    className="block text-sm py-1.5 px-2 rounded-md hover:bg-brand-red hover:text-white transition-colors"
                  >
                    {pageName.replace(/([A-Z])/g, ' $1').trim()}
                  </Link>
                ))}
              </div>
            </ScrollArea>
            <p className="text-xs text-brand-text-muted text-center pt-2 border-t border-brand-border/50">
              {filteredPages.length} pages found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPageNavigator;