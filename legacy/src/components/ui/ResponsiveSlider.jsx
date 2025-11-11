import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useDragControls } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

/**
 * ResponsiveSlider Component - Optimized for touch and desktop
 * @param {Object} props
 * @param {React.ReactNode[]} props.children - Array of React elements to display in slider
 * @param {Object} props.itemsPerView - Number of items to show per screen size
 * @param {number} props.spacing - Gap between items in pixels (default: 16)
 * @param {boolean} props.autoPlay - Enable auto-play functionality (default: false)
 * @param {number} props.autoPlayInterval - Auto-play interval in ms (default: 5000)
 * @param {boolean} props.showArrows - Show navigation arrows (default: true)
 * @param {boolean} props.showDots - Show dot indicators (default: true)
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onSlideChange - Callback when slide changes
 */
export default function ResponsiveSlider({
  children,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
  spacing = 16,
  autoPlay = false,
  autoPlayInterval = 5000,
  showArrows = true,
  showDots = true,
  className = "",
  onSlideChange
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [itemsVisible, setItemsVisible] = useState(itemsPerView.mobile);
  const containerRef = useRef(null);
  const isMobile = useIsMobile();
  const dragControls = useDragControls();
  
  const x = useMotionValue(0);
  const dragProgress = useTransform(x, [-200, 0, 200], [-1, 0, 1]);

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsVisible(itemsPerView.mobile);
      } else if (width < 1024) {
        setItemsVisible(itemsPerView.tablet);
      } else {
        setItemsVisible(itemsPerView.desktop);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, [itemsPerView]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isDragging) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const maxIndex = Math.max(0, children.length - itemsVisible);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isDragging, children.length, itemsVisible]);

  const maxIndex = Math.max(0, children.length - itemsVisible);

  const goToSlide = (index) => {
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(clampedIndex);
    onSlideChange?.(clampedIndex);
  };

  const goToPrevious = () => goToSlide(currentIndex - 1);
  const goToNext = () => goToSlide(currentIndex + 1);

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const threshold = 50;
    const velocity = Math.abs(info.velocity.x);
    
    // Enhanced drag logic with velocity consideration
    if ((info.offset.x > threshold || velocity > 500) && currentIndex > 0) {
      goToPrevious();
    } else if ((info.offset.x < -threshold || velocity > 500) && currentIndex < maxIndex) {
      goToNext();
    }
    
    x.set(0);
  };

  const itemWidth = `calc((100% - ${spacing * (itemsVisible - 1)}px) / ${itemsVisible})`;

  return (
    <div className={`relative ${className}`}>
      {/* Navigation Arrows */}
      {showArrows && !isMobile && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-brand-card-bg/80 backdrop-blur-sm border border-brand-border hover:bg-brand-card-bg disabled:opacity-30"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-brand-card-bg/80 backdrop-blur-sm border border-brand-border hover:bg-brand-card-bg disabled:opacity-30"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </>
      )}

      {/* Main slider container */}
      <div className="overflow-hidden" ref={containerRef}>
        <motion.div
          className="flex"
          style={{ gap: `${spacing}px` }}
          animate={{ x: `calc(-${currentIndex} * (100% + ${spacing}px) / ${itemsVisible})` }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            mass: 0.8
          }}
          drag={isMobile ? "x" : false}
          dragControls={dragControls}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          style={{ x }}
        >
          {children.map((child, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0"
              style={{ width: itemWidth }}
              whileTap={isMobile ? { scale: 0.98 } : {}}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Dot Indicators */}
      {showDots && maxIndex > 0 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-brand-red w-6' 
                  : 'bg-brand-text-secondary hover:bg-brand-text-primary'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Mobile drag hint */}
      {isMobile && !isDragging && (
        <div className="text-center mt-2">
          <p className="text-xs text-brand-text-secondary">Swipe to navigate</p>
        </div>
      )}
    </div>
  );
}