'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import api from '../../../utils/axios';

const fallbackSlides = [
  {
    uuid: 'fallback-chocotraill',
    imageUrl: '/image.png',
    originalName: 'Chocotraill',
  },
];

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

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[activeIndex] || slides[0];
  const slideLabel = useMemo(() => activeSlide?.originalName || 'Chocotraill gift collection', [activeSlide]);

  return (
    <section className="relative overflow-hidden bg-[#2B140E] text-[#FFF9F3]">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <img
            key={slide.uuid || slide.publicId || slide.imageUrl}
            src={slide.imageUrl}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-out ${
              index === activeIndex ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0'
            }`}
          />
        ))}
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
            <img src={activeSlide?.imageUrl} alt={slideLabel} className="aspect-[4/3] w-full object-cover" />
          </div>
        </div>

        {slides.length > 1 && (
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.uuid || slide.publicId || index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${index === activeIndex ? 'w-8 bg-[#C89A4B]' : 'w-2.5 bg-[#FFF9F3]/70'}`}
                aria-label={`Show slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
