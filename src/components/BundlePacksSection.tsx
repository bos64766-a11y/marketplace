import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BUNDLE_PACKAGES } from '../data/content';
import { BundlePackage } from '../types';
import { PackageCheck, ArrowRight, Check, ShoppingBag, Sparkles, Layers } from 'lucide-react';

export const BundlePacksSection: React.FC = () => {
  const { addToCart, showToast, navigate } = useApp();
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

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {BUNDLE_PACKAGES.map((bundle) => {
          const discountPercent = bundle.oldPrice
            ? Math.round(((bundle.oldPrice - bundle.price) / bundle.oldPrice) * 100)
            : null;
          const isAdded = addedBundleId === bundle.id;

          return (
            <div
              key={bundle.id}
              id={`bundle-card-${bundle.id}`}
              className="group bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#FF5A00] hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-5 relative"
            >
              {/* Badge & Discount */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#EBF2FC] text-[#0B2E73] border border-[#0B2E73]/15">
                  {bundle.tag}
                </span>

                {discountPercent && (
                  <span className="px-2 py-0.5 rounded-md bg-[#FF3B30] text-white text-[11px] font-semibold shadow-xs">
                    -{discountPercent}% chegirma
                  </span>
                )}
              </div>

              {/* Image Container */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#FAFCFE] mb-4 flex items-center justify-center">
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
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-[16px] text-[#0F172A] group-hover:text-[#0B2E73] transition-colors line-clamp-1 leading-[1.3]">
                    {bundle.title}
                  </h3>
                  <p className="text-[13px] text-[#64748B] font-normal mt-1 line-clamp-2 leading-[1.4]">
                    {bundle.subtitle}
                  </p>

                  {/* Included items list pill */}
                  <div className="mt-3 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[12px] text-[#334155] leading-relaxed">
                    <span className="font-semibold text-[#0B2E73] block mb-0.5">Paket tarkibi:</span>
                    <span className="line-clamp-2">{bundle.itemsList}</span>
                  </div>
                </div>

                {/* Price & Add Button */}
                <div className="mt-4 pt-3 border-t border-[#EEF2F6] flex items-center justify-between gap-2">
                  <div>
                    {bundle.oldPrice && (
                      <span className="text-[12px] text-[#94A3B8] line-through block font-normal">
                        {formatPrice(bundle.oldPrice)} so‘m
                      </span>
                    )}
                    <span className="text-[16px] font-bold text-[#0F172A]">
                      {formatPrice(bundle.price)} <span className="text-[12px] font-medium text-[#64748B]">so‘m</span>
                    </span>
                  </div>

                  <button
                    id={`btn-add-bundle-${bundle.id}`}
                    onClick={() => handleAddBundle(bundle)}
                    className={`px-3.5 py-2.5 rounded-xl font-semibold text-[13px] sm:text-[14px] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      isAdded
                        ? 'bg-[#009B5A] text-white'
                        : 'bg-[#FF5A00] hover:bg-[#e04f00] text-white active:scale-95'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Qo‘shildi</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Savatga</span>
                      </>
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
