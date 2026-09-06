import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Truck, Phone, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { navigate, banners } = useApp();
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

  const B2B_NAV_CARDS = [
    {
      id: 'about',
      icon: Building2,
      title: 'Biz haqimizda',
      desc: 'Kompaniya haqida ma’lumot',
      link: '/about',
    },
    {
      id: 'delivery',
      icon: Truck,
      title: 'To‘lov va yetkazib berish',
      desc: 'To‘lov usullari va shartlari',
      link: '/delivery-payment',
    },
    {
      id: 'contacts',
      icon: Phone,
      title: 'Aloqa markazi',
      desc: 'Biz bilan bog‘laning',
      link: '/contacts',
    },
    {
      id: 'request',
      icon: FileText,
      title: 'Zayavka qoldirish',
      desc: 'So‘rovingizni yuboring',
      link: '/request',
    },
  ];

  return (
    <section id="section-hero-banner" className="max-w-[1536px] mx-auto px-4 sm:px-8 pt-3 sm:pt-4 pb-2 space-y-4">
      {/* Graphical Pure Image Banner Slider */}
      {slide && (
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs border border-[#E5EAF2] bg-white group">
          <div
            onClick={() => navigate(slide.btnLink || slide.ctaLink || '/catalog')}
            className="w-full block cursor-pointer select-none"
            role="button"
            tabIndex={0}
          >
            <img
              src={slide.image || '/banners/banner-clean-promo.png'}
              alt={slide.title || 'SNABTASH B2B Banner'}
              className="w-full h-auto object-cover sm:object-contain block transition-transform duration-500 group-hover:scale-[1.008]"
              loading="eager"
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
                aria-label="Oldingi banner"
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
                aria-label="Keyingi banner"
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
      )}

      {/* 4 B2B Quick Navigation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {B2B_NAV_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              id={`hero-b2b-card-${card.id}`}
              onClick={() => navigate(card.link)}
              className="bg-white border border-[#E5EAF2] hover:border-[#FF5A00]/50 p-4 sm:p-5 rounded-3xl flex flex-col items-center sm:items-start text-center sm:text-left transition-all shadow-xs hover:shadow-lg hover:-translate-y-0.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#FF5A00] flex items-center justify-center shrink-0 mb-3 group-hover:scale-105 transition-transform border border-[#FF5A00]/20">
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="text-[14px] sm:text-[15px] font-extrabold text-[#1E293B] group-hover:text-[#FF5A00] transition-colors leading-[1.3] line-clamp-1">
                {card.title}
              </h4>
              <p className="text-xs text-[#64748B] font-medium mt-1 leading-[1.35] line-clamp-2">
                {card.desc}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
