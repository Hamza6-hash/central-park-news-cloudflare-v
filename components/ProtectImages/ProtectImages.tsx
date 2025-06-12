// components/OptimizedProtectedImage.js
// @ts-ignore
"use client";
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

const OptimizedProtectedImage = ({ 
  src, 
  alt, 
  fill = false,
  width,
  height,
  watermarkText = "Protected",
  className = '',
  quality = 75,
  loading = "lazy",
  priority = false,
  sizes,
  ...props 
}) => {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  // Optimized dev tools detection with debouncing
  const detectDevTools = useCallback(() => {
    const threshold = 160;
    const isOpen = 
      window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold;
    
    if (isOpen !== isDevToolsOpen) {
      setIsDevToolsOpen(isOpen);
    }
  }, [isDevToolsOpen]);

  useEffect(() => {
    // Only run detection in production or when needed
    if (process.env.NODE_ENV === 'development') return;
    
    let timeoutId;
    const debouncedDetect = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(detectDevTools, 100);
    };

    const interval = setInterval(detectDevTools, 1000); // Reduced frequency
    window.addEventListener('resize', debouncedDetect);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedDetect);
    };
  }, [detectDevTools]);

  const preventInteraction = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, []);

  // Hide image if dev tools are detected (only in production)
  if (process.env.NODE_ENV === 'production' && isDevToolsOpen) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={fill ? { position: 'absolute', inset: 0 } : { width, height }}
      >
        <p className="text-gray-500 text-sm">Content Protected</p>
      </div>
    );
  }

  const containerStyle = {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    ...(fill ? { position: 'relative', width: '100%', height: '100%' } : {})
  };

  const imageProps = {
    src,
    alt,
    quality,
    loading,
    priority,
    onContextMenu: preventInteraction,
    onDragStart: preventInteraction,
    onSelectStart: preventInteraction,
    className: `protected-image ${props.className || ''}`,
    style: {
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      pointerEvents: 'none'
    },
    ...props
  };

  if (fill) {
    imageProps.fill = true;
    imageProps.sizes = sizes;
  } else {
    imageProps.width = width;
    imageProps.height = height;
  }

  return (
    <div 
      className={`select-none ${fill ? 'relative w-full h-full' : 'relative inline-block'} ${className}`}
      onContextMenu={preventInteraction}
      onDragStart={preventInteraction}
      onSelectStart={preventInteraction}
      style={containerStyle}
    >
      {/* Lightweight invisible overlay */}
      <div 
        className="absolute inset-0 z-10 bg-transparent"
        onContextMenu={preventInteraction}
        onDragStart={preventInteraction}
        style={{ 
          pointerEvents: 'auto',
          userSelect: 'none'
        }}
      />
      
      {/* Subtle watermark overlay - only shows on hover */}
      <div 
        className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none opacity-0 hover:opacity-20 transition-opacity duration-300"
        style={{ 
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
        }}
      >
        <div 
          className="text-white text-lg font-bold transform rotate-45 select-none"
          style={{ 
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            fontSize: 'clamp(12px, 2vw, 18px)' // Responsive font size
          }}
        >
          {watermarkText}
        </div>
      </div>
      
      <Image {...imageProps} />
    </div>
  );
};

export default OptimizedProtectedImage;