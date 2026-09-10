'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function ImageSlider({ images = [], alt = 'Product', className = '', imageClassName = '' }) {
  const slides = useMemo(() => [...new Set(images.filter(Boolean))], [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [failed, setFailed] = useState({});

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const move = (direction) => {
    setActiveIndex((current) => (current + direction + slides.length) % slides.length);
  };

  const safeIndex = slides.length ? activeIndex % slides.length : 0;
  const currentImage = slides[safeIndex];
  const showImage = currentImage && !failed[currentImage];

  return (
    <div className={`group/slider relative overflow-hidden ${className}`}>
      {showImage ? (
        <img
          src={currentImage}
          alt={`${alt}${slides.length > 1 ? `, image ${safeIndex + 1} of ${slides.length}` : ''}`}
          className={`h-full w-full object-contain p-2 transition-opacity duration-300 ${imageClassName}`}
          onError={() => setFailed((value) => ({ ...value, [currentImage]: true }))}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-[#F6ECDD] via-[#FFF9F3] to-[#E9B8B0]/40 text-[#C89A4B]">
          <ImageIcon className="h-10 w-10" aria-hidden="true" />
        </div>
      )}

      {slides.length > 1 && (
        <>
          <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); move(-1); }} aria-label={`Previous image for ${alt}`} className="absolute left-2 top-1/2 z-20 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2E1A14] shadow-md transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#D85C6B]">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); move(1); }} aria-label={`Next image for ${alt}`} className="absolute right-2 top-1/2 z-20 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2E1A14] shadow-md transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#D85C6B]">
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 rounded-full bg-[#2E1A14]/55 px-2.5 py-1.5 backdrop-blur-sm" aria-label={`Image ${safeIndex + 1} of ${slides.length}`}>
            {slides.map((slide, index) => (
              <button key={`${slide}-${index}`} type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setActiveIndex(index); }} aria-label={`Show image ${index + 1}`} className={`h-1.5 rounded-full transition-all ${index === safeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/55 hover:bg-white/80'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
