import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMediaUrl } from '../services/api';

export const HeroSection: React.FC = () => {
  const { navigate, banners, language } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);

  const activeBanners = useMemo(() => {
    return (banners || []).filter((b) => b.isActive !== false);
  }, [banners]);

  useEffect(() => {
    if (currentIdx >= activeBanners.length) {
      setCurrentIdx(0);
    }
  }, [activeBanners.length, currentIdx]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % activeBanners.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const slide = activeBanners[currentIdx] || activeBanners[0];

  // Language-based dynamic image and title selection
  const currentBannerImage = (language === 'ru' && slide?.image_ru)
    ? slide.image_ru
    : slide?.image;

  const currentBannerTitle = (language === 'ru' && slide?.title_ru)
    ? slide.title_ru
    : slide?.title;

  return (
    <section id="section-hero-banner" className="max-w-[1536px] mx-auto px-4 sm:px-8 pt-3 sm:pt-4 pb-2 space-y-4">
      {/* Graphical Pure Image Banner Slider - Aligned with 4 cards below */}
      {slide && (
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-md border border-[#E5EAF2] bg-white group transition-all">
          <div
            onClick={() => navigate(slide.btnLink || slide.ctaLink || '/catalog')}
            className="w-full block cursor-pointer select-none"
            role="button"
            tabIndex={0}
          >
            <img
              key={`${slide.id}-${language}`}
              src={getMediaUrl(currentBannerImage) || '/banners/banner-clean-promo.webp'}
              alt={currentBannerTitle || 'SNABTASH B2B Banner'}
              className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.006]"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/banners/banner-clean-promo.webp';
              }}
            />
          </div>

          {/* Navigation Arrows if > 1 banner */}
          {activeBanners.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIdx((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-[#1E293B] hover:text-[#FF5A00] flex items-center justify-center shadow-lg border border-black/5 opacity-0 group-hover:opacity-100 sm:opacity-80 transition-all cursor-pointer z-10"
                aria-label={language === 'ru' ? 'Предыдущий баннер' : 'Oldingi banner'}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIdx((prev) => (prev + 1) % activeBanners.length);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-[#1E293B] hover:text-[#FF5A00] flex items-center justify-center shadow-lg border border-black/5 opacity-0 group-hover:opacity-100 sm:opacity-80 transition-all cursor-pointer z-10"
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
                    className={`h-2 rounded-full transition-all cursor-pointer ${currentIdx === idx ? 'w-6 bg-[#FF5A00]' : 'w-2 bg-white/70 hover:bg-white'
                      }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};
