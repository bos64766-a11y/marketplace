import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, Check } from 'lucide-react';
import { getMediaUrl } from '../services/api';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { navigate, addToCart, isFavorite, toggleFavorite, t, getProductName, formatUnit } = useApp();
  const minQty = product.minOrder || 1;
  const [isAdded, setIsAdded] = useState(false);
  const favorite = isFavorite(product.id);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);
    addToCart(product, minQty);
    setTimeout(() => {
      setIsAdded(false);
    }, 900);
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const productName = getProductName(product);

  return (
    <div
      id={`card-product-${product.id}`}
      onClick={() => navigate(`/product/${product.slug}`)}
      className={`group relative flex flex-col justify-between bg-white rounded-xl border border-[#E5EAF2] hover:border-[#FF5A00]/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden p-2 sm:p-2.5 h-full ${className}`}
    >
      {/* Product Image Area - Image at top with Heart icon at top-right */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#F8FAFC] mb-1.5 sm:mb-2">
        <img
          src={getMediaUrl(product.images[0])}
          alt={productName}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&auto=format&fit=crop&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Favorite Heart Button - Top Right on the image */}
        <button
          id={`btn-fav-${product.id}`}
          onClick={handleToggleFav}
          className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm shadow-2xs z-10 ${
            favorite
              ? 'bg-white text-[#FF5A00]'
              : 'bg-white/85 hover:bg-white text-[#64748B] hover:text-[#FF5A00]'
          }`}
          aria-label={favorite ? 'Remove favorite' : 'Add favorite'}
        >
          <Heart
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform active:scale-125 ${
              favorite ? 'fill-[#FF5A00] text-[#FF5A00]' : ''
            }`}
          />
        </button>

        {/* Optional Discount Badge - Top Left on the image */}
        {discountPercent > 0 && (
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-[#E11D48] text-white text-[8px] sm:text-[8.5px] font-black shadow-xs z-10">
            -{discountPercent}%
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Product Name */}
          <h3 className="font-bold text-[11.5px] sm:text-[13px] text-[#1E293B] group-hover:text-[#FF5A00] transition-colors line-clamp-2 min-h-[28px] sm:min-h-[32px] leading-snug mb-1">
            {productName}
          </h3>

          {/* Subtitle / Artikul / Min order info */}
          <div className="flex items-center gap-1 text-[9.5px] sm:text-[10.5px] text-[#94A3B8] font-medium mb-1.5 truncate">
            <span>Art: {product.sku}</span>
            {product.minOrder && (
              <>
                <span>•</span>
                <span>Min: {minQty} {formatUnit(product.unit)}</span>
              </>
            )}
          </div>
        </div>

        {/* Price & "Sotib olish" Button */}
        <div className="pt-1 mt-auto space-y-1.5">
          {/* Price display */}
          <div className="flex flex-col xs:flex-row xs:items-baseline justify-between gap-0.5">
            <div className="flex items-baseline gap-1">
              <span className="text-[13.5px] sm:text-[16px] font-black text-[#FF5A00] tracking-tight">
                {formatPrice(product.price)}
              </span>
              <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-[#94A3B8]">{t.productCard.sum}</span>
            </div>

            {product.oldPrice && (
              <span className="text-[8.5px] sm:text-[9.5px] text-[#94A3B8] line-through font-medium">
                {formatPrice(product.oldPrice)} {t.productCard.sum}
              </span>
            )}
          </div>

          {/* Full-width "Sotib olish" / "Купить" Button */}
          <button
            id={`btn-add-cart-${product.id}`}
            onClick={handleAddToCart}
            className={`w-full h-7 sm:h-8 rounded-lg flex items-center justify-center gap-1.5 text-[10.5px] sm:text-[11.5px] font-bold transition-all duration-200 cursor-pointer shadow-2xs active:scale-98 ${
              isAdded
                ? 'bg-[#16A34A] text-white shadow-[#16A34A]/25'
                : 'bg-[#FF5A00] hover:bg-[#e04f00] text-white shadow-[#FF5A00]/25'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3" />
                <span>{t.productCard.inCart}</span>
              </>
            ) : (
              <span>{t.productCard.addToCart}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
