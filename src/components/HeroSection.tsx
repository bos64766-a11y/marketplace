import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Building2, Truck, Phone, FileText, Zap, ShieldCheck, Award } from 'lucide-react';
import { BannerSlide } from '../types';

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    id: 'slide-complex-supply',
    badge: 'KORXONALAR UCHUN',
    title: 'Kompleks ta’minot yechimi',
    description:
      'Biz sizning biznesingizga kerakli barcha mahsulotlarni bir joyda jamlaymiz va vaqtingizni tejaymiz.',
    btnText: 'Katalogni ko‘rish',
    btnLink: '/catalog',
    image: '/hero-supply-pack.jpg',
    imageAlt: 'Kompleks taʼminot yechimi',
  },
  {
    id: 'slide-cleaning-fast',
    badge: 'TEZKOR VA ISHONCHLI',
    title: 'Professional klining va kimyo',
    description:
      'SanPiN talablariga mos klining kimyolari, xo‘jalik inventarlari va tozalash vositalari to‘g‘ridan-to‘g‘ri ombordan.',
    btnText: 'Katalogni ko‘rish',
    btnLink: '/catalog/maishiy-kimyo',
    image: '/hero-supply-pack.jpg',
    imageAlt: 'Professional klining va tozalash',
  },
  {
    id: 'slide-ppe-safety',
    badge: 'ISHCHI XAVFSIZLIGI',
    title: 'Himoya vositalari va qo‘lqoplar',
    description:
      'Ishlab chiqarish va omborlar uchun barcha turdagi sertifikatlangan ishchi qo‘lqoplar va himoya anjomlari.',
    btnText: 'Katalogni ko‘rish',
    btnLink: '/catalog/himoya-vositalari',
    image: '/hero-supply-pack.jpg',
    imageAlt: 'Himoya vositalari va qo‘lqoplar',
  },
  {
    id: 'slide-official-vat',
    badge: '100% RASMIY SHARTNOMA',
    title: 'QQS bilan Didox e-faktura',
    description:
      'Barcha korporativ mijozlar uchun qonuniy shartnoma, hisob-faktura va Toshkent bo‘yicha bepul yetkazish.',
    btnText: 'Zayavka qoldirish',
    btnLink: '/request',
    image: '/hero-supply-pack.jpg',
    imageAlt: '100% Rasmiy B2B taʼminot',
  },
];

export const HeroSection: React.FC = () => {
  const { navigate, banners } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);

  const activeBanners = useMemo(() => {
    return banners.filter((b) => b.isActive !== false);
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
    }, 7000);
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
      {/* Premium B2B hero canvas */}
      {slide && (
        <div className="relative rounded-3xl bg-gradient-to-br from-white via-[#FFFBF8] to-[#F8FAFC] border border-[#E5EAF2] overflow-hidden px-5 py-6 sm:px-10 sm:py-10 lg:px-14 lg:py-12 shadow-sm transition-all">
          <div className="w-full grid grid-cols-12 gap-4 sm:gap-8 lg:gap-10 items-center">
            {/* Left Column: Typography, CTA & Trust Badges */}
            <div className="col-span-12 md:col-span-7 space-y-3 sm:space-y-4 max-w-xl">
              {/* Small orange badge */}
              {slide.badge && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#FF5A00]/20 text-[#FF5A00] font-extrabold text-[11px] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00] animate-pulse" />
                  <span>{slide.badge}</span>
                </div>
              )}

              {/* Headline */}
              <h1 className="text-[24px] xs:text-[28px] sm:text-[36px] md:text-[40px] lg:text-[46px] font-black text-[#1E293B] tracking-tight leading-[1.12]">
                {slide.title}
              </h1>

              {/* Subtitle */}
              {slide.description && (
                <p className="text-[13px] sm:text-[15px] md:text-[16px] text-[#64748B] font-normal leading-[1.5] max-w-lg">
                  {slide.description}
                </p>
              )}

              {/* Action Buttons and Trust row */}
              <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-3">
                <button
                  id="btn-hero-action"
                  onClick={() => navigate(slide.btnLink || '/catalog')}
                  className="bg-[#FF5A00] hover:bg-[#e04f00] active:scale-97 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl inline-flex items-center gap-2 shadow-md shadow-[#FF5A00]/25 transition-all cursor-pointer leading-[1.3]"
                >
                  <span>{slide.btnText || 'Katalogni ko‘rish'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/request')}
                  className="bg-[#F8FAFC] hover:bg-[#FFF7ED] text-[#1E293B] hover:text-[#FF5A00] border border-[#E2E8F0] font-bold text-sm sm:text-base px-5 py-3.5 rounded-2xl inline-flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Tezkor zayavka</span>
                </button>
              </div>

              {/* Micro B2B trust indicators */}
              <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-5 text-xs font-semibold text-[#475569]">
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#FF5A00]" />
                  24 soatda yetkazish
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                  Didox & QQS 12%
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#081B4B]" />
                  500+ korxona ishonchi
                </span>
              </div>
            </div>

            {/* Right Column: Natural supply composition image */}
            <div className="col-span-12 md:col-span-5 flex items-center justify-center md:justify-end">
              <div className="relative w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[420px] aspect-[4/3] flex items-center justify-center">
                <img
                  src={slide.image || '/hero-supply-pack.jpg'}
                  alt={slide.imageAlt || slide.title}
                  className="w-full h-full object-contain drop-shadow-xl transition-transform duration-500 hover:scale-104"
                />
              </div>
            </div>
          </div>

          {/* Slide Dots centered at bottom - only shown if multiple banners */}
          {activeBanners.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-4">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentIdx === idx ? 'w-6 bg-[#FF5A00]' : 'w-1.5 bg-[#CBD5E1] hover:bg-[#94A3B8]'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
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
