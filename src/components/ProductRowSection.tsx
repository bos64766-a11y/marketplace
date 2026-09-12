import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
}

interface ProductRowSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  categoryLink?: string;
  products: Product[];
  tabs?: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  autoScrollSpeed?: number; // pixels per frame (e.g. 0.5 - 0.7)
}

export const ProductRowSection: React.FC<ProductRowSectionProps> = ({
  id,
  title,
  subtitle,
  badge,
  icon,
  categoryLink = '/catalog',
  products,
  tabs,
  activeTab,
  onTabChange,
  autoScrollSpeed = 0.7,
}) => {
  const { navigate, t } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const firstCycleRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const animFrameIdRef = useRef<number | null>(null);

  // IntersectionObserver: Pause when out of screen to save battery/CPU
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  // Continuous infinite smooth conveyor loop to the left
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || products.length === 0 || !isVisible) return;

    let isRunning = true;

    const step = () => {
      if (!isPaused && el && isRunning) {
        el.scrollLeft += autoScrollSpeed;

        const cycleEl = firstCycleRef.current;
        if (cycleEl) {
          const cycleWidth = cycleEl.offsetWidth;
          // When 1 full cycle is scrolled, wrap back seamlessly
          if (cycleWidth > 0 && el.scrollLeft >= cycleWidth) {
            el.scrollLeft -= cycleWidth;
          }
        } else {
          if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) {
            el.scrollLeft = 0;
          }
        }
        checkScroll();
      }

      if (isRunning) {
        animFrameIdRef.current = requestAnimationFrame(step);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(step);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPaused, isVisible, autoScrollSpeed, products.length, checkScroll]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <section id={id} className="max-w-[1536px] mx-auto px-4 sm:px-8 py-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div>
            <h2 className="text-[22px] sm:text-[26px] md:text-[28px] font-extrabold text-[#1E293B] tracking-tight leading-[1.25]">
              {title}
            </h2>
          </div>

          {/* Optional Sub-Tabs */}
          {tabs && tabs.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[#F8FAFC] p-1 rounded-2xl border border-[#E2E8F0]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange && onTabChange(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#FF5A00] text-white shadow-md shadow-[#FF5A00]/25'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Action: Pill "Barchasini ko‘rish" + Control Arrows */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          <button
            onClick={() => navigate(categoryLink)}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-[#FF5A00] hover:bg-[#e04f00] px-4 py-2 rounded-2xl transition-all cursor-pointer shadow-md shadow-[#FF5A00]/25 active:scale-97 leading-[1.3]"
          >
            <span>{t.home.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`w-9 h-9 rounded-2xl flex items-center justify-center border transition-all cursor-pointer ${
                canScrollLeft
                  ? 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#FFF7ED] hover:text-[#FF5A00] hover:border-[#FF5A00]/30 shadow-2xs'
                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
              }`}
              aria-label="Oldingi mahsulotlar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`w-9 h-9 rounded-2xl flex items-center justify-center border transition-all cursor-pointer ${
                canScrollRight
                  ? 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#FFF7ED] hover:text-[#FF5A00] hover:border-[#FF5A00]/30 shadow-2xs'
                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
              }`}
              aria-label="Keyingi mahsulotlar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Container with Left & Right Gradient Fade Masks */}
      <div className="relative">
        {/* Left Fade Mask */}
        <div
          className={`absolute left-0 top-0 bottom-4 w-8 sm:w-14 bg-gradient-to-r from-white via-white/70 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Right Fade Mask */}
        <div className="absolute right-0 top-0 bottom-4 w-8 sm:w-14 bg-gradient-to-l from-white via-white/70 to-transparent z-10 pointer-events-none" />

        {/* Horizontal Auto-scrolling Carousel Container: Infinite Smooth Conveyor to Left */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex items-stretch overflow-x-auto pb-4 pt-1 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Cycle 1: Primary items */}
          <div ref={firstCycleRef} className="flex items-stretch gap-3.5 sm:gap-4 pr-3.5 sm:pr-4 shrink-0">
            {products.map((product, idx) => (
              <div
                key={`cycle1-${product.id}-${idx}`}
                className="w-[160px] sm:w-[185px] md:w-[200px] shrink-0 flex flex-col"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Cycle 2: Identical duplicate for seamless wrap */}
          <div className="flex items-stretch gap-3.5 sm:gap-4 pr-3.5 sm:pr-4 shrink-0" aria-hidden="true">
            {products.map((product, idx) => (
              <div
                key={`cycle2-${product.id}-${idx}`}
                className="w-[160px] sm:w-[185px] md:w-[200px] shrink-0 flex flex-col"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Cycle 3: Buffer for extra-wide displays */}
          <div className="flex items-stretch gap-3.5 sm:gap-4 pr-3.5 sm:pr-4 shrink-0" aria-hidden="true">
            {products.map((product, idx) => (
              <div
                key={`cycle3-${product.id}-${idx}`}
                className="w-[160px] sm:w-[185px] md:w-[200px] shrink-0 flex flex-col"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
