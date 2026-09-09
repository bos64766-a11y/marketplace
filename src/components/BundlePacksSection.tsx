import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BUNDLE_PACKAGES } from '../data/content';
import { BundlePackage } from '../types';
import { ArrowRight, Check, Layers, Heart } from 'lucide-react';

export const BundlePacksSection: React.FC = () => {
  const { addToCart, showToast, navigate, isFavorite, toggleFavorite } = useApp();
  const [addedBundleId, setAddedBundleId] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleAddBundle = (bundle: BundlePackage) => {
    setAddedBundleId(bundle.id);

    // Create a virtual bundle product representation for the cart
    const bundleProduct = {
      id: bundle.id,
      slug: bundle.slug,
      name: `[B2B To‘plam] ${bundle.title}`,
      categoryId: 'bundle',
      categoryName: 'B2B Paketlar',
      brand: 'SNABTASH Paket',
      sku: `BNDL-${bundle.id.toUpperCase().slice(-6)}`,
      rating: 5.0,
      reviewsCount: 28,
      price: bundle.price,
      oldPrice: bundle.oldPrice,
      inStock: true,
      stockCount: 100,
      images: [bundle.image],
      description: `${bundle.subtitle}. Tarkibi: ${bundle.itemsList}`,
      specifications: {
        'To‘plam turi': bundle.tag || 'B2B Kompleks',
        'Tarkibi': bundle.itemsList,
        'Mahsulotlar soni': `${bundle.itemsCount} turdagi`,
      },
      unit: 'to‘plam',
      minOrder: 1,
    };

    addToCart(bundleProduct, 1);
    showToast(`✓ "${bundle.title}" to‘plami savatga qo‘shildi!`, 'success');

    setTimeout(() => {
      setAddedBundleId(null);
    }, 1200);
  };

  return (
    <section id="section-bundle-packs" className="max-w-[1536px] mx-auto px-4 sm:px-8 py-8 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1E8] text-[#FF5A00] text-[12px] font-semibold mb-2.5 border border-[#FF5A00]/20">
            <Layers className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span>Tejamkor B2B Komplektlar</span>
          </div>
          <h2 className="text-[24px] sm:text-[26px] md:text-[30px] lg:text-[32px] font-bold text-[#0B2E73] tracking-[-0.02em] leading-[1.25]">
            Tayyor ta’minot to‘plamlari
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#64748B] font-normal leading-[1.5] mt-1">
            Har bir soha ehtiyoji uchun oldindan saralangan, 15% gacha arzonlashtirilgan to‘plamlar
          </p>
        </div>

        <button
          onClick={() => navigate('/catalog')}
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#FF5A00] hover:text-[#0B2E73] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>Katalogda ko‘rish</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bundles Grid: 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
        {BUNDLE_PACKAGES.map((bundle) => {
          const discountPercent = bundle.oldPrice
            ? Math.round(((bundle.oldPrice - bundle.price) / bundle.oldPrice) * 100)
            : null;
          const isAdded = addedBundleId === bundle.id;
          const favorite = isFavorite(bundle.id);

          return (
            <div
              key={bundle.id}
              id={`bundle-card-${bundle.id}`}
              className="group relative flex flex-col justify-between bg-white rounded-2xl sm:rounded-3xl border border-[#E5EAF2] hover:border-[#FF5A00]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden p-2.5 sm:p-4 h-full"
            >
              {/* Product Image Area - Square Image at top with Heart icon at top-right */}
              <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#F8FAFC] mb-2 sm:mb-3">
                <img
                  src={bundle.image}
                  alt={bundle.title}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Favorite Heart Button - Top Right on the image */}
                <button
                  id={`btn-fav-bundle-${bundle.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(bundle.id);
                  }}
                  className={`absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm shadow-sm z-10 ${
                    favorite
                      ? 'bg-white text-[#FF5A00]'
                      : 'bg-white/85 hover:bg-white text-[#64748B] hover:text-[#FF5A00]'
                  }`}
                  aria-label={favorite ? 'Sevimlilardan o‘chirish' : 'Sevimlilarga qo‘shish'}
                >
                  <Heart
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform active:scale-125 ${
                      favorite ? 'fill-[#FF5A00] text-[#FF5A00]' : ''
                    }`}
                  />
                </button>

                {/* Discount Badge - Top Left on the image */}
                {discountPercent && (
                  <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 px-1.5 py-0.5 sm:px-2 rounded-full bg-[#E11D48] text-white text-[9px] sm:text-[10px] font-black shadow-xs z-10">
                    -{discountPercent}%
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Product Name */}
                  <h3 className="font-bold text-[13px] sm:text-[16px] text-[#1E293B] group-hover:text-[#FF5A00] transition-colors line-clamp-2 min-h-[34px] sm:min-h-[42px] leading-[1.3] mb-1">
                    {bundle.title}
                  </h3>

                  {/* Subtitle / Category info */}
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#94A3B8] font-medium mb-2 sm:mb-3 truncate">
                    <span>{bundle.tag || 'B2B To‘plam'}</span>
                    <span>•</span>
                    <span>{bundle.itemsCount} xil tovar</span>
                  </div>
                </div>

                {/* Price & "Sotib olish" Button */}
                <div className="pt-1.5 sm:pt-2 mt-auto space-y-2 sm:space-y-3">
                  {/* Price display */}
                  <div className="flex flex-col xs:flex-row xs:items-baseline justify-between gap-0.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[15px] sm:text-[21px] font-black text-[#FF5A00] tracking-tight">
                        {formatPrice(bundle.price)}
                      </span>
                      <span className="text-[11px] sm:text-[13px] font-semibold text-[#94A3B8]">so‘m</span>
                    </div>

                    {bundle.oldPrice && (
                      <span className="text-[10px] sm:text-[12px] text-[#94A3B8] line-through font-medium">
                        {formatPrice(bundle.oldPrice)} so‘m
                      </span>
                    )}
                  </div>

                  {/* Full-width "Sotib olish" Button */}
                  <button
                    id={`btn-add-bundle-${bundle.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddBundle(bundle);
                    }}
                    className={`w-full h-9 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center gap-1.5 sm:gap-2 text-[12px] sm:text-[14px] font-bold transition-all duration-200 cursor-pointer shadow-md active:scale-98 ${
                      isAdded
                        ? 'bg-[#16A34A] text-white shadow-[#16A34A]/25'
                        : 'bg-[#FF5A00] hover:bg-[#e04f00] text-white shadow-[#FF5A00]/25'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Qo‘shildi</span>
                      </>
                    ) : (
                      <span>Sotib olish</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
