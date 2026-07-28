'use client';

import { useState } from 'react';

export default function ProductImageGallery({ images, productTitle }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="aspect-square overflow-hidden rounded-lg border border-[#E8D8CC] bg-[#FFF9F3] shadow-[0_10px_30px_rgba(43,20,14,0.08)]">
        <img
          src={images[selectedImage]?.url || '/placeholder-product.jpg'}
          alt={images[selectedImage]?.alt || productTitle}
          className="h-full w-full object-contain p-3"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square rounded-lg border-2 overflow-hidden ${
                selectedImage === index
              ? 'border-[#D85C6B]'
              : 'border-[#E8D8CC]'
              }`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="h-full w-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
