import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Handshake } from 'lucide-react';

export const PartnersSection: React.FC = () => {
  const { partners } = useApp();
  const displayPartners = partners && partners.length > 0 ? partners : [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstCycleRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  // Continuous infinite smooth conveyor loop to the left
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || displayPartners.length === 0) return;

    let isRunning = true;
    let animId: number;

    const step = () => {
      if (!isPaused && el && isRunning) {
        el.scrollLeft += 0.8;
        const cycleEl = firstCycleRef.current;
        if (cycleEl && cycleEl.offsetWidth > 0 && el.scrollLeft >= cycleEl.offsetWidth) {
          el.scrollLeft -= cycleEl.offsetWidth;
        }
        checkScroll();
      }
      if (isRunning) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [isPaused, checkScroll, displayPartners.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 350);
    }
  };

  if (displayPartners.length === 0) {
    return null;
  }

  return (
    <section id="section-partners" className="max-w-[1536px] mx-auto px-4 sm:px-8 py-8 border-t border-[#EEF2F6]">
      {/* Header with Title and Nav Arrows */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7ED] text-[#FF5A00] text-[11px] sm:text-xs font-bold mb-2 border border-[#FF5A00]/20">
            <Handshake className="w-3.5 h-3.5" />
            <span>Ishonchli hamkorlik</span>
          </div>
          <h2 className="text-[20px] sm:text-[24px] md:text-[26px] font-extrabold text-[#1E293B] tracking-tight leading-[1.25]">
            Bizning hamkorlarimiz
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#64748B] font-normal mt-0.5">
            O‘zbekistonning yetakchi kompaniyalari va korxonalari biz bilan birga
          </p>
        </div>

        {/* Carousel Control Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
              canScrollLeft
                ? 'bg-white border-[#CBD5E1] text-[#1E293B] hover:bg-[#F1F5F9] shadow-xs'
                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
            }`}
            aria-label="Oldingi hamkorlar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
              canScrollRight
                ? 'bg-[#FF5A00] hover:bg-[#e04f00] text-white border-[#FF5A00] shadow-xs'
                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
            }`}
            aria-label="Keyingi hamkorlar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Infinite Scroll Carousel */}
      <div className="relative">
        {/* Left Fade */}
        <div
          className={`absolute left-0 top-0 bottom-2 w-8 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Right Fade */}
        <div className="absolute right-0 top-0 bottom-2 w-8 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex items-stretch overflow-x-auto pb-2 pt-1 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Cycle 1 */}
          <div ref={firstCycleRef} className="flex items-stretch gap-3 sm:gap-3.5 pr-3 sm:pr-3.5 shrink-0">
            {displayPartners.map((partner, idx) => (
              <div
                key={`p1-${partner.id}-${idx}`}
                id={`partner-card-${partner.id}`}
                className="w-[140px] sm:w-[160px] md:w-[170px] shrink-0 bg-white hover:bg-[#FAFBFD] border border-[#E2E8F0] hover:border-[#FF5A00]/40 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-2xs hover:shadow-lg hover:-translate-y-1 group cursor-default"
              >
                {partner.logo ? (
                  <div className="w-full aspect-square max-w-[118px] sm:max-w-[136px] rounded-xl sm:rounded-2xl bg-white p-0.5 sm:p-1 flex items-center justify-center mb-2 overflow-hidden border border-[#F1F5F9] shadow-2xs group-hover:scale-105 transition-transform">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square max-w-[118px] sm:max-w-[136px] rounded-xl sm:rounded-2xl bg-[#FFF7ED] text-[#FF5A00] flex items-center justify-center mb-2 font-black text-2xl sm:text-3xl border border-[#FF5A00]/20 group-hover:scale-105 transition-transform">
                    {partner.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <span className="font-bold text-[13px] sm:text-[14px] text-[#1E293B] group-hover:text-[#FF5A00] transition-colors line-clamp-1 leading-snug">
                  {partner.name}
                </span>
                <span className="text-[11px] sm:text-xs text-[#64748B] font-medium mt-0.5 line-clamp-1">
                  {partner.category}
                </span>
              </div>
            ))}
          </div>

          {/* Cycle 2 (Seamless loop wrap) */}
          <div className="flex items-stretch gap-3 sm:gap-3.5 pr-3 sm:pr-3.5 shrink-0" aria-hidden="true">
            {displayPartners.map((partner, idx) => (
              <div
                key={`p2-${partner.id}-${idx}`}
                className="w-[140px] sm:w-[160px] md:w-[170px] shrink-0 bg-white hover:bg-[#FAFBFD] border border-[#E2E8F0] hover:border-[#FF5A00]/40 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-2xs hover:shadow-lg hover:-translate-y-1 group cursor-default"
              >
                {partner.logo ? (
                  <div className="w-full aspect-square max-w-[118px] sm:max-w-[136px] rounded-xl sm:rounded-2xl bg-white p-0.5 sm:p-1 flex items-center justify-center mb-2 overflow-hidden border border-[#F1F5F9] shadow-2xs group-hover:scale-105 transition-transform">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square max-w-[118px] sm:max-w-[136px] rounded-xl sm:rounded-2xl bg-[#FFF7ED] text-[#FF5A00] flex items-center justify-center mb-2 font-black text-2xl sm:text-3xl border border-[#FF5A00]/20 group-hover:scale-105 transition-transform">
                    {partner.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <span className="font-bold text-[13px] sm:text-[14px] text-[#1E293B] group-hover:text-[#FF5A00] transition-colors line-clamp-1 leading-snug">
                  {partner.name}
                </span>
                <span className="text-[11px] sm:text-xs text-[#64748B] font-medium mt-0.5 line-clamp-1">
                  {partner.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
