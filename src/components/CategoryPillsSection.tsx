import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CategoryPillsSection: React.FC = () => {
  const { navigate, categories, getCategoryName, language } = useApp();
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
            {language === 'ru' ? 'Категории' : 'Kategoriyalar'}
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#64748B] font-normal leading-[1.5]">
            {language === 'ru' ? 'Быстрый поиск товаров по направлениям' : 'Kerakli yo‘nalish bo‘yicha tovarlarni tez toping'}
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

      {/* Infinite Scrolling Track with Pause on Hover */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex items-stretch overflow-x-auto no-scrollbar py-2 cursor-grab active:cursor-grabbing"
      >
        {/* Cycle 1: Original Items */}
        <div ref={firstCycleRef} className="flex items-stretch gap-3.5 sm:gap-4 pr-3.5 sm:pr-4 shrink-0">
          {allDisplayCategories.map((cat, idx) => (
            <button
              key={`cat1-${cat.id}-${idx}`}
              id={`btn-category-item-${cat.slug}`}
              onClick={() => navigate(`/catalog/${cat.slug}`)}
              className="group w-[136px] sm:w-[155px] md:w-[168px] shrink-0 bg-white hover:bg-[#FAFBFD] border border-[#E2E8F0] hover:border-[#FF5A00]/50 rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 flex flex-col items-center text-center transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg hover:-translate-y-1"
            >
              {/* Large Product Category Image */}
              <div className="w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] border border-[#E2E8F0]/70 group-hover:border-[#FF5A00]/30 transition-all mb-2.5 sm:mb-3 shadow-2xs">
                <img
                  src={cat.image}
                  alt={getCategoryName(cat)}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>

              {/* Category Name Label */}
              <span className="text-[13px] sm:text-[14px] md:text-[15px] font-bold text-[#1E293B] group-hover:text-[#FF5A00] transition-colors line-clamp-2 leading-[1.3] text-center px-1 flex-1 flex items-center justify-center">
                {getCategoryName(cat)}
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
              className="group w-[136px] sm:w-[155px] md:w-[168px] shrink-0 bg-white hover:bg-[#FAFBFD] border border-[#E2E8F0] hover:border-[#FF5A00]/50 rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 flex flex-col items-center text-center transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg hover:-translate-y-1"
            >
              {/* Large Product Category Image */}
              <div className="w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] border border-[#E2E8F0]/70 group-hover:border-[#FF5A00]/30 transition-all mb-2.5 sm:mb-3 shadow-2xs">
                <img
                  src={cat.image}
                  alt={getCategoryName(cat)}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>

              {/* Category Name Label */}
              <span className="text-[13px] sm:text-[14px] md:text-[15px] font-bold text-[#1E293B] group-hover:text-[#FF5A00] transition-colors line-clamp-2 leading-[1.3] text-center px-1 flex-1 flex items-center justify-center">
                {getCategoryName(cat)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
