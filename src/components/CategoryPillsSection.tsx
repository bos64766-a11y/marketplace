import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CategoryPillsSection: React.FC = () => {
  const { navigate, categories } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstCycleRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Continuous infinite smooth conveyor loop to the left
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isRunning = true;
    const step = () => {
      if (!isPaused && el && isRunning) {
        el.scrollLeft += 0.6;
        const cycleEl = firstCycleRef.current;
        if (cycleEl && cycleEl.offsetWidth > 0 && el.scrollLeft >= cycleEl.offsetWidth) {
          el.scrollLeft -= cycleEl.offsetWidth;
        }
        checkScroll();
      }
      if (isRunning) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [isPaused]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  // Dynamic categories from AppContext synced with Admin panel
  const allDisplayCategories = categories;

  return (
    <section id="section-categories" className="max-w-[1536px] mx-auto px-4 sm:px-8 py-6">
      {/* Category Header with Title on Left and Carousel Arrows on Right (Mockup Style) */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[22px] sm:text-[26px] md:text-[28px] font-extrabold text-[#1E293B] tracking-tight leading-[1.25]">
            Kategoriyalar
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#64748B] font-normal leading-[1.5]">
            Kerakli yo‘nalish bo‘yicha tovarlarni tez toping
          </p>
        </div>

        {/* Carousel Control Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
              canScrollLeft
                ? 'bg-white border-[#CBD5E1] text-[#0B2E73] hover:bg-[#F1F5F9] shadow-xs'
                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
            }`}
            aria-label="Oldingi kategoriyalar"
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
            aria-label="Keyingi kategoriyalar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Categories Grid with realistic product images: Infinite Smooth Conveyor to Left */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex items-stretch overflow-x-auto pb-2 scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Cycle 1: Primary items */}
        <div ref={firstCycleRef} className="flex items-stretch gap-3.5 sm:gap-4 pr-3.5 sm:pr-4 shrink-0">
          {allDisplayCategories.map((cat, idx) => (
            <button
              key={`cat1-${cat.id}-${idx}`}
              id={`btn-category-item-${cat.slug}`}
              onClick={() => navigate(`/catalog/${cat.slug}`)}
              className="group w-[130px] sm:w-[150px] md:w-[155px] shrink-0 bg-white hover:bg-[#FAFBFD] border border-[#F1F5F9] hover:border-[#FF5A00]/40 rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md"
            >
              {/* Real Product Image Container */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#F8FAFC] group-hover:bg-[#FFF7ED] p-2 flex items-center justify-center transition-all mb-2.5 group-hover:scale-106 overflow-hidden border border-[#F1F5F9]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              </div>

              {/* Category Name Label */}
              <span className="text-[13px] sm:text-[14px] font-bold text-[#1E293B] group-hover:text-[#FF5A00] transition-colors line-clamp-1 leading-[1.3]">
                {cat.name}
              </span>

              {/* Product Count Pill */}
              <span className="text-[11px] font-bold text-[#FF5A00] bg-[#FFF7ED] px-2 py-0.5 rounded-full mt-1.5">
                {cat.count} ta tovar
              </span>
            </button>
          ))}
        </div>

        {/* Cycle 2: Duplicate for seamless wrap */}
        <div className="flex items-stretch gap-3.5 sm:gap-4 pr-3.5 sm:pr-4 shrink-0" aria-hidden="true">
          {allDisplayCategories.map((cat, idx) => (
            <button
              key={`cat2-${cat.id}-${idx}`}
              onClick={() => navigate(`/catalog/${cat.slug}`)}
              className="group w-[130px] sm:w-[150px] md:w-[155px] shrink-0 bg-white hover:bg-[#FAFBFD] border border-[#F1F5F9] hover:border-[#FF5A00]/40 rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#F8FAFC] group-hover:bg-[#FFF7ED] p-2 flex items-center justify-center transition-all mb-2.5 group-hover:scale-106 overflow-hidden border border-[#F1F5F9]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              </div>

              <span className="text-[13px] sm:text-[14px] font-bold text-[#1E293B] group-hover:text-[#FF5A00] transition-colors line-clamp-1 leading-[1.3]">
                {cat.name}
              </span>

              <span className="text-[11px] font-bold text-[#FF5A00] bg-[#FFF7ED] px-2 py-0.5 rounded-full mt-1.5">
                {cat.count} ta tovar
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
