import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingBag, Plus, Minus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { navigate, addToCart, isFavorite, toggleFavorite } = useApp();
  const minQty = product.minOrder || 1;
  const [quantity, setQuantity] = useState(minQty);
  const [isAdded, setIsAdded] = useState(false);
  const favorite = isFavorite(product.id);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => Math.min(prev + 1, 999));
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => Math.max(prev - 1, minQty));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);
    addToCart(product, quantity);
    setTimeout(() => {
      setIsAdded(false);
    }, 900);
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  // Only display high-value marketing badges (filter out raw weights/volumes)
  const isMarketingTag =
    product.tag &&
    !product.tag.toLowerCase().includes('gr') &&
    !product.tag.toLowerCase().includes('ml') &&
    !product.tag.toLowerCase().includes('litr');

  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div
      id={`card-product-${product.id}`}
      onClick={() => navigate(`/product/${product.slug}`)}
      className={`group relative flex flex-col justify-between bg-white rounded-3xl border border-[#E5EAF2] hover:border-[#FF5A00]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden p-4 sm:p-5 h-full ${className}`}
    >
      {/* Top Bar: Tag / Brand / QQS & Favorite Heart */}
      <div className="flex items-center justify-between gap-1.5 mb-3 z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          {isMarketingTag ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF7ED] text-[#FF5A00] border border-[#FF5A00]/20">
              {product.tag}
            </span>
          ) : product.brand ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]">
              {product.brand}
            </span>
          ) : null}
          <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-bold bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20">
            QQS bilan
          </span>
        </div>

        <button
          id={`btn-fav-${product.id}`}
          onClick={handleToggleFav}
          className={`w-8 h-8 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
            favorite
              ? 'bg-[#FFF7ED] text-[#FF5A00] shadow-xs'
              : 'bg-[#F8FAFC] hover:bg-[#FFF7ED] text-[#94A3B8] hover:text-[#FF5A00] border border-[#E2E8F0]'
          }`}
          aria-label={favorite ? 'Sevimlilardan o‘chirish' : 'Sevimlilarga qo‘shish'}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              favorite ? 'fill-[#FF5A00] text-[#FF5A00]' : ''
            }`}
          />
        </button>
      </div>

      {/* Product Image Area - Pure white stage with subtle hover zoom */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white mb-3.5 flex items-center justify-center p-2 group-hover:bg-[#FAFBFD] transition-colors">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&auto=format&fit=crop&q=80';
          }}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {discountPercent > 0 && (
          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#E11D48] text-white text-[10px] font-black shadow-xs">
            -{discountPercent}%
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* SKU / Artikul line */}
          <div className="flex items-center justify-between text-[11px] font-medium text-[#94A3B8] mb-1">
            <span>Art: {product.sku}</span>
            <span>Min: {minQty} {product.unit || 'ta'}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-[14px] sm:text-[15px] text-[#1E293B] group-hover:text-[#FF5A00] transition-colors line-clamp-2 min-h-[42px] leading-[1.35] mb-1">
            {product.name}
          </h3>

          {/* Subtitle / Unit / Packaging */}
          <p className="text-[12px] font-medium text-[#64748B] mb-3 truncate">
            {product.categoryName} • {product.unit || '1 dona'}
          </p>
        </div>

        {/* Price & Interactive Stepper + Cart Button */}
        <div className="pt-3 border-t border-[#F1F5F9] mt-auto space-y-3">
          {/* Price display */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[18px] sm:text-[19px] font-black text-[#FF5A00] tracking-tight">
                {formatPrice(product.price)}
              </span>
              <span className="text-[12px] font-bold text-[#64748B] ml-1">so‘m</span>
            </div>

            {product.oldPrice && (
              <span className="text-[12px] text-[#94A3B8] line-through font-medium">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Stepper + Cart Button */}
          <div className="flex items-center justify-between gap-2.5">
            {/* [ -  1  + ] Stepper */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-2 py-1 w-[90px] sm:w-[96px] h-10"
            >
              <button
                onClick={handleDecrement}
                disabled={quantity <= minQty}
                className="w-6 h-6 flex items-center justify-center text-[#475569] hover:text-[#FF5A00] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Kamaytirish"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-black text-[#1E293B] select-none">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-6 h-6 flex items-center justify-center text-[#475569] hover:text-[#FF5A00] transition-colors cursor-pointer"
                aria-label="Ko‘paytirish"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Rounded Shopping Bag / Cart Action Button */}
            <button
              id={`btn-add-cart-${product.id}`}
              onClick={handleAddToCart}
              className={`flex-1 h-10 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all duration-200 cursor-pointer shadow-md shadow-[#FF5A00]/25 active:scale-95 ${
                isAdded
                  ? 'bg-[#16A34A] text-white shadow-[#16A34A]/25'
                  : 'bg-[#FF5A00] hover:bg-[#e04f00] text-white'
              }`}
              title="Savatga qo‘shish"
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Qo‘shildi</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Savatga</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
