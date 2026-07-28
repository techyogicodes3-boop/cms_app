'use client';

import { useState } from 'react';
import Image from 'next/image';

/**
 * Image component with fallback support
 * Handles loading states and errors gracefully
 */
export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = null,
  className = '',
  width,
  height,
  fill = false,
  objectFit = 'cover',
  priority = false,
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Default fallback gradient if no image or fallback provided
  const defaultFallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"%3E%3Cstop offset="0%" style="stop-color:%23cbd5e1;stop-opacity:1" /%3E%3Cstop offset="100%" style="stop-color:%2394a3b8;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="400" fill="url(%23grad)" /%3E%3C/svg%3E';

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      if (fallbackSrc) {
        setImgSrc(fallbackSrc);
      } else {
        setImgSrc(defaultFallback);
      }
    }
  };

  // If no src provided, show fallback immediately
  if (!src || src === '') {
    return (
      <div className={`bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 ${className}`}>
        {fill ? (
          <div className="absolute inset-0" />
        ) : (
          <div style={{ width, height }} />
        )}
      </div>
    );
  }

  // For Next.js Image component
  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        style={{ objectFit }}
        onError={handleError}
        priority={priority}
        {...props}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ objectFit }}
      onError={handleError}
      priority={priority}
      {...props}
    />
  );
}
