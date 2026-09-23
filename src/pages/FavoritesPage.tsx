import React from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { favorites, navigate, products, t } = useApp();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5EAF2]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2E73] tracking-tight">
            {t.favoritesPage.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            {t.favoritesPage.subtitle} ({favoriteProducts.length} {t.favoritesPage.countUnit})
          </p>
        </div>
      </div>

      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-[#E5EAF2] p-8 sm:p-12 text-center shadow-xs my-8">
          <div className="w-16 h-16 rounded-full bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#0B2E73] mb-2">
            {t.favoritesPage.emptyTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] mb-6">
            {t.favoritesPage.emptyDesc}
          </p>
          <button
            id="btn-favorites-go-catalog"
            onClick={() => navigate('/catalog')}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-[#0B2E73] hover:bg-[#08245A] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{t.favoritesPage.viewCatalog}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
