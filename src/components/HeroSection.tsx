import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMediaUrl } from '../services/api';

export const HeroSection: React.FC = () => {
  const { navigate, banners, language } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const activeBanners = useMemo(() => {
    return (banners || []).filter((b) => b.isActive !== false);
  }, [banners]);

  // Reset index if out of bounds
  useEffect(() => {
    if (activeBanners.length > 0 && currentIdx >= activeBanners.length) {
      setCurrentIdx(0);
    }
  }, [activeBanners.length, currentIdx]);

  // Auto-advance sliding smoothly to the left every 5.5s
  useEffect(() => {
    if (activeBanners.length <= 1 || isHovered) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % activeBanners.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [activeBanners.length, isHovered]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % activeBanners.length);
  };

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    touchStartXRef.current = null;
    if (diff > 45) {
      // Swiped left -> next slide
      handleNext();
    } else if (diff < -45) {
      // Swiped right -> prev slide
      handlePrev();
    }
  };

  if (!activeBanners || activeBanners.length === 0) {
    return null;
  }

  return (
    <section id="section-hero-banner" className="max-w-[1536px] mx-auto px-4 sm:px-8 pt-3 sm:pt-4 pb-2 space-y-4">
      {/* Graphical Pure Image Banner Slider - Left sliding carousel track */}
      <div
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-md border border-[#E5EAF2] bg-white group transition-all"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Horizontal Carousel Track - Slides left with smooth cubic bezier */}
        <div
          className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
          style={{ transform: `translateX(-${currentIdx * 100}%)` }}
        >
          {activeBanners.map((slide, index) => {
            const isRu = language === 'ru';
            const hasRuImg = Boolean(slide?.image_ru && slide.image_ru.trim());
            const hasRuTitle = Boolean(slide?.title_ru && slide.title_ru.trim());

            const bannerImg = (isRu && hasRuImg)
              ? slide.image_ru!.trim()
              : (slide?.image?.trim() || '/banners/banner-clean-promo.webp');

            const bannerTitle = (isRu && hasRuTitle)
              ? slide.title_ru!.trim()
              : (slide?.title || 'SNABTASH B2B Banner');

            const slideKey = `hero-slide-${slide.id || index}-${language}`;

            return (
              <div
                key={slideKey}
                onClick={() => navigate(slide.btnLink || slide.ctaLink || '/catalog')}
                className="w-full min-w-full flex-shrink-0 cursor-pointer select-none relative"
                role="button"
                tabIndex={0}
              >
                <img
                  src={getMediaUrl(bannerImg) || '/banners/banner-clean-promo.webp'}
                  alt={bannerTitle}
                  className="w-full h-auto block select-none object-cover transition-transform duration-500 group-hover:scale-[1.004]"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  decoding="async"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (isRu && slide?.image && target.src !== slide.image) {
                      target.src = getMediaUrl(slide.image) || '/banners/banner-clean-promo.webp';
                    } else {
                      target.src = '/banners/banner-clean-promo.webp';
                    }
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows if > 1 banner */}
        {activeBanners.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-[#1E293B] hover:text-[#FF5A00] flex items-center justify-center shadow-lg border border-black/5 opacity-0 group-hover:opacity-100 sm:opacity-80 transition-all cursor-pointer z-10 active:scale-90"
              aria-label={language === 'ru' ? 'Предыдущий баннер' : 'Oldingi banner'}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-[#1E293B] hover:text-[#FF5A00] flex items-center justify-center shadow-lg border border-black/5 opacity-0 group-hover:opacity-100 sm:opacity-80 transition-all cursor-pointer z-10 active:scale-90"
              aria-label={language === 'ru' ? 'Следующий баннер' : 'Keyingi banner'}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Slide dots at bottom */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-full z-10">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIdx(idx);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIdx === idx ? 'w-6 bg-[#FF5A00]' : 'w-2 bg-white/70 hover:bg-white'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
