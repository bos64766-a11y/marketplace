/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import {
  Heart,
  ShoppingCart,
  Check,
  Truck,
  Share2,
  ChevronRight,
  Boxes,
  Minus,
  Plus,
  MessageSquare,
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { navigate, addToCart, isFavorite, toggleFavorite, showToast, products, siteSettings } = useApp();

  const product = products.find((p) => p.slug === slug || p.id === slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(product?.minOrder || 1);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    return (
      <div className="max-w-[1536px] mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center mx-auto mb-4">
          <Boxes className="w-8 h-8" />
        </div>
        <h2 className="text-[24px] sm:text-[28px] font-bold text-[#0B2E73] mb-2">Mahsulot topilmadi</h2>
        <p className="text-[14px] text-[#667085] max-w-md mx-auto mb-6 leading-[1.55] font-normal">
          Siz qidirgan tovar mavjud emas yoki nomi o‘zgargan bo‘lishi mumkin. Katalogni ko‘rib chiqishingizni tavsiya qilamiz.
        </p>
        <button
          onClick={() => navigate('/catalog')}
          className="bg-[#FF5A00] hover:bg-[#e04f00] text-white px-6 py-2.5 rounded-xl font-semibold text-[14px] cursor-pointer shadow-xs transition-all"
        >
          Katalogga qaytish
        </button>
      </div>
    );
  }

  const favorite = isFavorite(product.id);

  // Related products from same category
  const relatedProducts = products.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id
  ).slice(0, 6);

  const minOrderAmount = siteSettings?.freeDeliveryThreshold || 500000;
  const currentTotal = product.price * quantity;
  const isMinMet = currentTotal >= minOrderAmount;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    showToast(`✓ ${product.name} savatga qo‘shildi`, 'success');
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  const handleDirectRequest = () => {
    addToCart(product, quantity);
    navigate('/request');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Havola nusxalandi', 'info');
    }
  };

  const handleAskQuestion = () => {
    if (siteSettings?.telegramBot) {
      const cleanBot = siteSettings.telegramBot.replace('@', '');
      window.open(`https://t.me/${cleanBot}`, '_blank');
    } else {
      navigate('/contacts');
    }
  };

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#667085] mb-6 overflow-x-auto whitespace-nowrap pb-1">
        <button onClick={() => navigate('/')} className="hover:text-[#0B2E73] cursor-pointer">
          Bosh sahifa
        </button>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <button
          onClick={() => navigate(`/catalog/${product.categoryId}`)}
          className="hover:text-[#0B2E73] cursor-pointer"
        >
          {product.categoryName}
        </button>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[#FF5A00] font-semibold truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Box (Matches Clean Deli Reference) */}
      <div className="bg-white rounded-[24px] border border-[#E5EAF2] p-5 sm:p-8 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* 1. Left: Gallery (4 cols) */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
            {/* Thumbnails list */}
            {product.images.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[460px] pb-1 sm:pb-0 shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-[#F8FAFC] ${
                      selectedImage === idx
                        ? 'border-[#FF5A00] shadow-xs'
                        : 'border-[#E2E8F0] hover:border-slate-400'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Product Image */}
            <div className="flex-1 relative aspect-square rounded-2xl overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center group p-4">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              {product.tag && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FFF7ED] text-[#FF5A00] border border-[#FF5A00]/20 shadow-xs">
                  {product.tag}
                </span>
              )}
            </div>
          </div>

          {/* 2. Middle: Info & Description (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Top utility links (Ulashish, Savol berish) */}
            <div className="flex items-center justify-end gap-4 text-xs font-medium text-[#64748B]">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-[#0B2E73] transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Ulashish</span>
              </button>
              <button
                onClick={handleAskQuestion}
                className="flex items-center gap-1.5 text-[#009B5A] hover:text-[#007A46] font-semibold transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Savol berish</span>
              </button>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-xl sm:text-2xl md:text-[25px] font-extrabold text-[#1E293B] tracking-tight leading-snug">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 text-xs text-[#64748B] mt-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                  Mavjud
                </span>
                <span>•</span>
                <span>Artikul: <strong className="text-[#1E293B]">{product.sku}</strong></span>
              </div>
            </div>

            {/* Mahsulot haqida (O tovare) with dotted lines */}
            <div className="pt-2 border-t border-[#F1F5F9]">
              <h3 className="text-sm font-extrabold text-[#1E293B] mb-3">Mahsulot haqida</h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[#64748B] shrink-0">Kategoriya</span>
                  <span className="border-b border-dotted border-[#CBD5E1] flex-1 mx-2" />
                  <span className="font-bold text-[#1E293B] text-right">{product.categoryName}</span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[#64748B] shrink-0">Brend</span>
                  <span className="border-b border-dotted border-[#CBD5E1] flex-1 mx-2" />
                  <span className="font-bold text-[#1E293B] text-right">{product.brand}</span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[#64748B] shrink-0">O‘lchov birligi</span>
                  <span className="border-b border-dotted border-[#CBD5E1] flex-1 mx-2" />
                  <span className="font-bold text-[#1E293B] text-right">{product.unit || 'dona'}</span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[#64748B] shrink-0">Min. buyurtma</span>
                  <span className="border-b border-dotted border-[#CBD5E1] flex-1 mx-2" />
                  <span className="font-bold text-[#1E293B] text-right">
                    {product.minOrder || 1} {product.unit || 'dona'}
                  </span>
                </div>
                {Object.entries(product.specifications || {}).map(([key, val]) => (
                  <div key={key} className="flex items-baseline justify-between gap-2">
                    <span className="text-[#64748B] shrink-0">{key}</span>
                    <span className="border-b border-dotted border-[#CBD5E1] flex-1 mx-2" />
                    <span className="font-bold text-[#1E293B] text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mahsulot tavsifi (Описание товара) */}
            <div className="pt-2 border-t border-[#F1F5F9]">
              <h3 className="text-sm font-extrabold text-[#1E293B] mb-2">Mahsulot tavsifi</h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                {product.description ||
                  'Ushbu tovar korxona va tashkilotlar uchun sifatli va ishonchli ta’minot vositasi hisoblanadi. SanPiN standartlariga to‘liq javob beradi.'}
              </p>
            </div>
          </div>

          {/* 3. Right: Sticky Buy Box Card (4 cols) */}
          <div className="lg:col-span-4 xl:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs space-y-4">
              {/* Price Display */}
              <div>
                {product.oldPrice && (
                  <div className="text-xs text-[#94A3B8] line-through font-semibold mb-0.5">
                    {product.oldPrice.toLocaleString('uz-UZ')} so‘m
                  </div>
                )}
                <div className="text-2xl sm:text-[28px] font-black text-[#0B2E73] tracking-tight leading-none">
                  {product.price.toLocaleString('uz-UZ')}{' '}
                  <span className="text-sm font-semibold text-[#64748B]">so‘m</span>
                </div>
                <div className="text-[11px] text-[#64748B] font-medium mt-1">
                  1 {product.unit || 'dona'} uchun narx
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-[#CBD5E1]">
                  <span className="text-xs font-semibold text-[#64748B]">
                    Miqdor:
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      id="btn-qty-minus"
                      onClick={() => setQuantity((q) => Math.max(product.minOrder || 1, q - 1))}
                      className="w-7 h-7 flex items-center justify-center text-[#64748B] hover:text-[#0B2E73] hover:bg-[#F1F5F9] rounded-lg transition-colors cursor-pointer"
                      aria-label="Kamaytirish"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-12 text-center font-bold text-xs text-[#1E293B]">
                      {quantity} {product.unit || 'dona'}
                    </span>
                    <button
                      id="btn-qty-plus"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-7 h-7 flex items-center justify-center text-[#64748B] hover:text-[#0B2E73] hover:bg-[#F1F5F9] rounded-lg transition-colors cursor-pointer"
                      aria-label="Ko‘paytirish"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Savatga qo'shish + Heart (Full width like reference) */}
                <div className="flex items-center gap-2">
                  <button
                    id="btn-product-detail-add-cart"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs min-w-0 ${
                      isAdding
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#0B2E73] hover:bg-[#071F4E] text-white'
                    }`}
                  >
                    {isAdding ? (
                      <>
                        <Check className="w-4 h-4 shrink-0" />
                        <span className="truncate">Qo‘shildi</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 shrink-0" />
                        <span className="truncate">Savatga qo‘shish</span>
                      </>
                    )}
                  </button>

                  <button
                    id="btn-product-detail-favorite"
                    onClick={() => toggleFavorite(product.id)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-colors cursor-pointer shrink-0 ${
                      favorite
                        ? 'bg-[#FFF1E8] border-[#FF5A00] text-[#FF5A00]'
                        : 'bg-white border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#64748B]'
                    }`}
                    aria-label="Sevimlilar"
                  >
                    <Heart className={`w-5 h-5 ${favorite ? 'fill-[#FF5A00]' : ''}`} />
                  </button>
                </div>

                {/* Total calculated sum for current item */}
                <div className="flex items-center justify-between text-xs py-1 px-1 border-t border-[#E2E8F0]">
                  <span className="text-[#64748B]">Jami summa:</span>
                  <span className="font-extrabold text-[#1E293B]">
                    {currentTotal.toLocaleString('uz-UZ')} so‘m
                  </span>
                </div>
              </div>

              {/* Minimal Summa & Zayavka berish status */}
              <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1E293B]">Minimal zayavka</span>
                  <span className="font-extrabold text-[#FF5A00]">
                    {minOrderAmount.toLocaleString('uz-UZ')} so‘m
                  </span>
                </div>

                {isMinMet && (
                  <button
                    onClick={handleDirectRequest}
                    className="w-full py-2.5 rounded-xl bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs font-extrabold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <span>Zayavka rasmiylashtirish</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Delivery Box (Доставка) */}
              <div className="pt-2 border-t border-[#E2E8F0]">
                <div className="font-extrabold text-[#1E293B] text-[11px] uppercase tracking-wider mb-2">
                  Yetkazib berish
                </div>
                <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-[#E2E8F0]">
                  <div className="flex items-center gap-2 text-[#1E293B] font-bold">
                    <Truck className="w-4 h-4 text-[#0B2E73]" />
                    <span>Kuryer orqali</span>
                  </div>
                  <span className="font-extrabold text-[#009B5A]">Bepul</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#14213D]">O‘xshash mahsulotlar</h3>
            <button
              onClick={() => navigate(`/catalog/${product.categoryId}`)}
              className="text-xs font-semibold text-[#FF5A00] hover:underline cursor-pointer"
            >
              Barchasini ko‘rish →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
