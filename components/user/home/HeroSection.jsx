'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import api from '../../../utils/axios';

const fallbackSlides = [
  {
    uuid: 'fallback-chocotraill',
    imageUrl: '/image.png',
    originalName: 'Chocotraill',
  },
];

const isVideoSlide = (slide) => slide?.mediaType === 'video' || slide?.mimeType?.startsWith('video/');

export default function HeroSection() {
  const [slides, setSlides] = useState(fallbackSlides);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let ignore = false;

    const fetchSlides = async () => {
      try {
        const response = await api.get('/api/v1/sliders');
        const nextSlides = response.data?.data?.filter((slide) => slide.imageUrl) || [];
        if (!ignore && nextSlides.length > 0) {
          setSlides(nextSlides);
          setActiveIndex(0);
        }
      } catch (error) {
        console.error('Error fetching slider images:', error);
      }
    };

    fetchSlides();
    return () => {
      ignore = true;
    };
  }, []);

  const activeSlide = slides[activeIndex] || slides[0];
  const slideLabel = useMemo(() => activeSlide?.originalName || 'Chocotraill gift collection', [activeSlide]);
  const showNext = useCallback(() => setActiveIndex((current) => (current + 1) % slides.length), [slides.length]);
  const showPrevious = useCallback(() => setActiveIndex((current) => (current - 1 + slides.length) % slides.length), [slides.length]);
  const handleMediaError = useCallback(() => {
    if (slides.length <= 1) {
      setSlides(fallbackSlides);
      setActiveIndex(0);
      return;
    }
    showNext();
  }, [showNext, slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const duration = Number(activeSlide?.duration || 0);
    const delay = isVideoSlide(activeSlide)
      ? duration > 0 ? Math.min((duration + 1) * 1000, 120000) : 60000
      : 2000;
    const timer = window.setTimeout(showNext, delay);
    return () => window.clearTimeout(timer);
  }, [activeSlide, showNext, slides.length]);

  return (
    <section className="relative overflow-hidden bg-[#2B140E] text-[#FFF9F3]">
      <div className="absolute inset-0">
        {isVideoSlide(activeSlide) ? (
          <video
            key={activeSlide.uuid || activeSlide.publicId || activeSlide.imageUrl}
            src={activeSlide.mediaUrl || activeSlide.imageUrl}
            autoPlay
            muted
            playsInline
            loop={slides.length === 1}
            preload="metadata"
            onEnded={slides.length > 1 ? showNext : undefined}
            onError={handleMediaError}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <img
            key={activeSlide?.uuid || activeSlide?.publicId || activeSlide?.imageUrl}
            src={activeSlide?.mediaUrl || activeSlide?.imageUrl}
            alt=""
            onError={handleMediaError}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(43,20,14,0.92)_0%,rgba(43,20,14,0.74)_42%,rgba(43,20,14,0.28)_100%)]" />
      </div>

      <div className="relative mx-auto grid min-h-[520px] max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
        <div className="max-w-2xl animate-[fadeUp_700ms_ease-out_both]">
          <div className="mb-4 inline-flex max-w-full items-center gap-2 border-y border-[#C89A4B]/60 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#C89A4B] sm:mb-5 sm:gap-3 sm:text-xs sm:tracking-[0.24em]">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Made with love, just for them
          </div>
          <h1 className="brand-serif text-4xl font-bold leading-[0.98] sm:text-5xl lg:text-6xl xl:text-7xl">
            Thoughtful Gifts.
            <span className="block text-[#E9B8B0]">Beautiful Moments.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#FFF9F3]/90 sm:mt-5 sm:text-lg sm:leading-7">
            Premium chocolates, curated hampers, and personalized corporate gifts crafted in Mumbai and delivered across India.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/catalogues" className="ui-btn-secondary w-full border-[#C89A4B] px-6 py-3 text-[#FFF9F3] hover:bg-[#C89A4B] hover:text-[#2B140E] sm:w-auto">
              Explore Combos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/corporate-gifting" className="ui-btn-primary w-full px-6 py-3 sm:w-auto">
              Corporate Gifting/Bulk Order
            </Link>
          </div>
        </div>

        <div className="hidden justify-end lg:flex" aria-label={slideLabel}>
          <div className="w-full max-w-xl overflow-hidden rounded-lg border border-[#C89A4B]/45 bg-[#FFFCF8]/10 shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur">
            {isVideoSlide(activeSlide) ? (
              <video src={activeSlide?.mediaUrl || activeSlide?.imageUrl} aria-label={slideLabel} controls muted playsInline preload="metadata" className="aspect-[4/3] w-full bg-black object-contain" />
            ) : (
              <img src={activeSlide?.mediaUrl || activeSlide?.imageUrl} alt={slideLabel} className="aspect-[4/3] w-full object-cover" />
            )}
          </div>
        </div>

        {slides.length > 1 && (
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#2B140E]/55 px-2 py-1.5 backdrop-blur-sm">
            <button type="button" onClick={showPrevious} aria-label="Previous home media" className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#C89A4B]">
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {slides.map((slide, index) => (
              <button
                key={slide.uuid || slide.publicId || index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${index === activeIndex ? 'w-8 bg-[#C89A4B]' : 'w-2.5 bg-[#FFF9F3]/70'}`}
                aria-label={`Show slide ${index + 1}`}
              />
            ))}
            <button type="button" onClick={showNext} aria-label="Next home media" className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#C89A4B]">
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
