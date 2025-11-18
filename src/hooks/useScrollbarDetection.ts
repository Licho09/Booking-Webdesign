import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollbarDetectionResult {
  isUsingScrollbar: boolean;
  scrollbarWidth: number;
}

/**
 * Hook to detect when a user is actively using the scrollbar
 * (as opposed to mouse wheel, touch, or keyboard scrolling)
 * Returns false on mobile/touch devices since they don't use scrollbars
 */
export function useScrollbarDetection(): ScrollbarDetectionResult {
  const [isUsingScrollbar, setIsUsingScrollbar] = useState(false);
  const scrollbarWidthRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const mouseDownXRef = useRef<number | null>(null);
  const lastScrollTopRef = useRef<number>(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Detect if device is touch/mobile - if so, always return false (no scrollbar)
  const isTouchDevice = useRef<boolean>(false);
  
  useEffect(() => {
    // Check if device supports touch
    isTouchDevice.current = 'ontouchstart' in window || 
                            navigator.maxTouchPoints > 0 || 
                            (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    
    // On mobile, always return false since there's no scrollbar
    if (isTouchDevice.current) {
      setIsUsingScrollbar(false);
    }
  }, []);

  // Calculate scrollbar width
  const calculateScrollbarWidth = useCallback(() => {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.msOverflowStyle = 'scrollbar';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode?.removeChild(outer);

    scrollbarWidthRef.current = scrollbarWidth;
    return scrollbarWidth;
  }, []);

  // Check if mouse is over scrollbar area
  const isOverScrollbar = useCallback((clientX: number): boolean => {
    const viewportWidth = window.innerWidth;
    const scrollbarWidth = scrollbarWidthRef.current || calculateScrollbarWidth();
    const scrollbarStartX = viewportWidth - scrollbarWidth;
    
    // Check if mouse is in the scrollbar area (with some tolerance)
    return clientX >= scrollbarStartX - 5; // 5px tolerance
  }, [calculateScrollbarWidth]);

  // Handle mouse down - check if it's on the scrollbar
  const handleMouseDown = useCallback((e: MouseEvent) => {
    // Don't detect scrollbar on touch devices
    if (isTouchDevice.current) return;
    
    if (isOverScrollbar(e.clientX)) {
      isDraggingRef.current = true;
      mouseDownXRef.current = e.clientX;
      setIsUsingScrollbar(true);
    }
  }, [isOverScrollbar]);

  // Handle mouse move - if dragging and over scrollbar area, user is using scrollbar
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Don't detect scrollbar on touch devices
    if (isTouchDevice.current) return;
    
    if (isDraggingRef.current) {
      if (isOverScrollbar(e.clientX)) {
        setIsUsingScrollbar(true);
      }
    }
  }, [isOverScrollbar]);

  // Handle mouse up - stop tracking
  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      mouseDownXRef.current = null;
      
      // Reset after a short delay to allow for scroll inertia
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUsingScrollbar(false);
      }, 150);
    }
  }, []);

  // Handle scroll events - if scrolling while mouse is in scrollbar area, user is using scrollbar
  const handleScroll = useCallback(() => {
    // Don't detect scrollbar on touch devices
    if (isTouchDevice.current) {
      setIsUsingScrollbar(false);
      return;
    }
    
    const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
    const hasScrolled = currentScrollTop !== lastScrollTopRef.current;
    lastScrollTopRef.current = currentScrollTop;

    // If we're dragging and scrolling, user is definitely using scrollbar
    if (isDraggingRef.current && hasScrolled) {
      setIsUsingScrollbar(true);
    }
  }, []);

  // Alternative method: detect scroll without wheel event
  const wheelEventRef = useRef(false);
  
  const handleWheel = useCallback(() => {
    wheelEventRef.current = true;
    // Reset flag after a short delay
    setTimeout(() => {
      wheelEventRef.current = false;
    }, 100);
  }, []);

  const handleScrollAlternative = useCallback(() => {
    // If scroll happened but no wheel event, might be scrollbar
    if (!wheelEventRef.current && !isDraggingRef.current) {
      // Check if mouse is currently over scrollbar area
      // We can't directly check mouse position during scroll, so we use a different approach
      // This is less reliable but can catch some cases
    }
  }, []);

  useEffect(() => {
    // Calculate scrollbar width on mount
    calculateScrollbarWidth();

    // Recalculate on resize
    const handleResize = () => {
      calculateScrollbarWidth();
    };

    // Add event listeners
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleScroll, handleWheel, calculateScrollbarWidth]);

  return {
    isUsingScrollbar: isTouchDevice.current ? false : isUsingScrollbar,
    scrollbarWidth: scrollbarWidthRef.current
  };
}

