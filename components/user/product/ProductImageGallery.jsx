'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function ProductImageGallery({ images, productTitle }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [failedImages, setFailedImages] = useState({});

  useEffect(() => {
    if (images.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setSelectedImage((current) => (current + 1) % images.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [images.length]);

  const move = (direction) => {
    setSelectedImage((current) => (current + direction + images.length) % images.length);
  };
  const safeSelectedImage = images.length ? selectedImage % images.length : 0;
  const currentImage = images[safeSelectedImage];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="group relative aspect-square overflow-hidden rounded-lg border border-[#E8D8CC] bg-[#FFF9F3] shadow-[0_10px_30px_rgba(43,20,14,0.08)]">
        {currentImage?.url && !failedImages[currentImage.url] ? (
          <img
            src={currentImage.url}
            alt={currentImage.alt || productTitle}
            className="h-full w-full object-contain p-3"
            onError={() => setFailedImages((value) => ({ ...value, [currentImage.url]: true }))}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-tr from-[#F6ECDD] via-[#FFF9F3] to-[#E9B8B0]/40 text-[#C89A4B]">
            <ImageIcon className="h-14 w-14" aria-hidden="true" />
            <span className="text-sm font-medium text-[#7A625A]">No product image</span>
          </div>
        )}
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => move(-1)} aria-label="Previous product image" className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2E1A14] shadow-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#D85C6B]">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Next product image" className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2E1A14] shadow-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#D85C6B]">
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-[#2E1A14]/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {safeSelectedImage + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((img, index) => (
            <button
              key={img.id ?? `${img.url}-${index}`}
              type="button"
              onClick={() => setSelectedImage(index)}
              className={`aspect-square rounded-lg border-2 overflow-hidden ${
                safeSelectedImage === index
              ? 'border-[#D85C6B]'
              : 'border-[#E8D8CC]'
              }`}
            >
              {failedImages[img.url] ? (
                <span className="flex h-full w-full items-center justify-center bg-[#F6ECDD] text-[#C89A4B]">
                  <ImageIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              ) : (
                <img
                  src={img.url}
                  alt={img.alt}
                  className="h-full w-full object-contain p-1"
                  onError={() => setFailedImages((value) => ({ ...value, [img.url]: true }))}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
