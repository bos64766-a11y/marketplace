import React, { useState, useMemo, useEffect } from 'react';
import { useSEO } from '../hooks/useSEO';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { getMediaUrl } from '../services/api';
import {
  SlidersHorizontal,
  X,
  Sparkles,
  HeartHandshake,
  FileSpreadsheet,
  Car,
  HardHat,
  Shirt,
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  Boxes,
  ShieldCheck,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Car: <Car className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  HeartHandshake: <HeartHandshake className="w-4 h-4" />,
  HandHeart: <HeartHandshake className="w-4 h-4" />,
  FileSpreadsheet: <FileSpreadsheet className="w-4 h-4" />,
  FileText: <FileSpreadsheet className="w-4 h-4" />,
  HardHat: <HardHat className="w-4 h-4" />,
  ShieldCheck: <HardHat className="w-4 h-4" />,
  Shirt: <Shirt className="w-4 h-4" />,
};

interface CatalogPageProps {
  initialCategory?: string;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ initialCategory }) => {
  const {
    currentPath,
    navigate,
    searchQuery,
    setSearchQuery,
    products,
    categories,
    language,
    t,
    getCategoryName,
  } = useApp();

  // Extract selected category from props or pathname
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (initialCategory) return initialCategory;
    const pathOnly = currentPath.split(/[?#]/)[0];
    const match = pathOnly.match(/^\/catalog\/([^/]+)/);
    return match ? match[1] : 'all';
  });

  const activeCatObj = categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
  const activeCatName = activeCatObj
    ? getCategoryName(activeCatObj)
    : (selectedCategory === 'all'
        ? (language === 'ru' ? 'Все товары' : 'Barcha mahsulotlar')
        : selectedCategory);

  useSEO({
    title: selectedCategory !== 'all'
      ? `${activeCatName} — ${language === 'ru' ? 'Каталог оптом' : 'Ulgurji Savdo'}`
      : (language === 'ru' ? 'Каталог товаров — Оптовые поставки' : 'Mahsulotlar Katalogi — B2B Ulgurji Savdo'),
    description: language === 'ru'
      ? `Каталог товаров категории ${activeCatName}. Бытовая химия, хозтовары, канцтовары оптом для организаций в Ташкенте — SNABTASH.`
      : `B2B korxonalar uchun ${activeCatName} mahsulotlari katalogi. Maishiy kimyo, xo'jalik mollari va kantselyariya ulgurji savdosi — SNABTASH.`,
  });

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const pathOnly = currentPath.split(/[?#]/)[0];
    const match = pathOnly.match(/^\/catalog\/([^/]+)/);
    if (match) {
      setSelectedCategory(match[1]);
    } else if (pathOnly === '/catalog') {
      setSelectedCategory('all');
    }

    // Sync search query from URL ?q=
    try {
      const searchStr = currentPath.includes('?')
        ? currentPath.slice(currentPath.indexOf('?'))
        : window.location.search;
      const params = new URLSearchParams(searchStr);
      const q = params.get('q');
      if (q !== null && q !== searchQuery) {
        setSearchQuery(q);
      }
    } catch {
      // ignore
    }

    setCurrentPage(1);
  }, [currentPath]);

  // Filters state
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'newest'>('popular');
  const [isMobileFilterDrawer, setIsMobileFilterDrawer] = useState(false);

  // Available brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set);
  }, [products]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter((p) => p.categoryId === selectedCategory || p.slug === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.name_ru && p.name_ru.toLowerCase().includes(q)) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    // In stock filter
    if (inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      list = list.filter((p) => p.brand === selectedBrand);
    }

    // Price range filter
    const minP = parseFloat(priceRange.min);
    const maxP = parseFloat(priceRange.max);
    if (!isNaN(minP)) {
      list = list.filter((p) => p.price >= minP);
    }
    if (!isNaN(maxP)) {
      list = list.filter((p) => p.price <= maxP);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else {
      // Popularity (default)
      list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.reviewsCount - a.reviewsCount);
    }

    return list;
  }, [products, selectedCategory, searchQuery, inStockOnly, selectedBrand, priceRange, sortBy]);

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    inStockOnly ||
    searchQuery.trim() !== '' ||
    priceRange.min !== '' ||
    priceRange.max !== '';

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setInStockOnly(false);
    setSearchQuery('');
    setPriceRange({ min: '', max: '' });
    setSortBy('popular');
    navigate('/catalog');
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      navigate('/catalog');
    } else {
      navigate(`/catalog/${slug}`);
    }
    setIsMobileFilterDrawer(false);
  };

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#64748B] mb-5 font-medium">
        <button onClick={() => navigate('/')} className="hover:text-[#FF5A00] transition-colors cursor-pointer">
          {language === 'ru' ? 'Главная' : 'Bosh sahifa'}
        </button>
        <span>/</span>
        <button
          onClick={() => navigate('/catalog')}
          className={`transition-colors cursor-pointer ${
            selectedCategory === 'all' ? 'text-[#FF5A00] font-bold' : 'hover:text-[#FF5A00]'
          }`}
        >
          {t.header.catalog}
        </button>
        {activeCategoryObj && (
          <>
            <span>/</span>
            <span className="text-[#FF5A00] font-bold">{getCategoryName(activeCategoryObj)}</span>
          </>
        )}
      </div>

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* DESKTOP SIDEBAR (3 cols) - Unified Modern Card (Sticky & Fixed in place) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-[116px] self-start">
          <div
            className="bg-white rounded-3xl border border-[#E5EAF2] p-5 sm:p-6 shadow-xs space-y-6 max-h-[calc(100vh-130px)] overflow-y-auto"
            style={{ scrollbarWidth: 'thin' }}
          >
            {/* Header & Reset Button */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#FF5A00]" />
                <h3 className="font-extrabold text-sm text-[#1E293B] uppercase tracking-wider">
                  {t.catalogPage.filters}
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#FF5A00] hover:text-[#e04f00] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t.catalogPage.resetFilters}</span>
                </button>
              )}
            </div>

            {/* Category Navigation */}
            <div>
              <span className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2.5">
                {t.catalogPage.categories}
              </span>
              <div className="space-y-1">
                <button
                  id="btn-catalog-cat-all"
                  onClick={() => handleCategorySelect('all')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                    selectedCategory === 'all'
                      ? 'bg-[#FFF7ED] text-[#FF5A00] border border-[#FF5A00]/25 shadow-xs'
                      : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#FF5A00]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-[#FF5A00]" />
                    <span>{t.catalogPage.allProducts}</span>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      selectedCategory === 'all'
                        ? 'bg-[#FF5A00] text-white'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    {products.length}
                  </span>
                </button>

                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
                  const count =
                    products.filter((p) => p.categoryId === cat.slug || p.categoryId === cat.id).length ||
                    cat.count ||
                    0;

                  return (
                    <button
                      key={cat.id}
                      id={`btn-catalog-cat-${cat.slug}`}
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[#FFF7ED] text-[#FF5A00] font-bold border border-[#FF5A00]/25 shadow-xs'
                          : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#FF5A00]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={`w-4 h-4 rounded overflow-hidden flex items-center justify-center shrink-0 ${isSelected ? 'text-[#FF5A00]' : 'text-[#64748B]'}`}>
                          {cat.image ? (
                            <img src={getMediaUrl(cat.image)} alt={getCategoryName(cat)} className="w-full h-full object-cover rounded" />
                          ) : (
                            iconMap[cat.icon] || <Sparkles className="w-4 h-4" />
                          )}
                        </span>
                        <span className="truncate">{getCategoryName(cat)}</span>
                      </div>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                          isSelected
                            ? 'bg-[#FF5A00] text-white'
                            : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* In-Stock Filter Toggle */}
            <div className="pt-2 border-t border-[#F1F5F9]">
              <label className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                <span className="text-xs font-bold text-[#1E293B]">
                  {t.catalogPage.inStockOnly}
                </span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#FF5A00] accent-[#FF5A00] focus:ring-[#FF5A00] border-[#E2E8F0] cursor-pointer"
                />
              </label>
            </div>

            {/* Price Range Filter */}
            <div className="pt-2 border-t border-[#F1F5F9]">
              <span className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                {t.catalogPage.price} ({t.productCard.sum})
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder={language === 'ru' ? 'От' : 'Dan'}
                  value={priceRange.min}
                  onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                  className="w-full h-9 px-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A00] focus:bg-white"
                />
                <input
                  type="number"
                  placeholder={language === 'ru' ? 'До' : 'Gacha'}
                  value={priceRange.max}
                  onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                  className="w-full h-9 px-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A00] focus:bg-white"
                />
              </div>
            </div>

            {/* Brand Filter */}
            {brands.length > 0 && (
              <div className="pt-2 border-t border-[#F1F5F9]">
                <span className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                  {language === 'ru' ? 'По бренду' : 'Brend bo‘yicha'}
                </span>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full h-10 px-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#FF5A00] focus:bg-white cursor-pointer"
                >
                  <option value="all">
                    {language === 'ru' ? 'Все бренды' : 'Barcha brendlar'} ({brands.length})
                  </option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </aside>

        {/* PRODUCTS AREA (9 cols) */}
        <main className="lg:col-span-9 space-y-5">
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex items-center justify-between gap-3">
            <button
              id="btn-mobile-filter-open"
              onClick={() => setIsMobileFilterDrawer(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#081B4B] text-white font-bold text-xs shadow-md shadow-[#081B4B]/20 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#FF5A00]" />
              <span>
                {language === 'ru' ? 'Категории и фильтры' : 'Kategoriyalar va Filtrlar'} ({filteredProducts.length})
              </span>
            </button>
          </div>

          {/* Catalog Top Bar: Title, Count, Active Filters & Sort */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E5EAF2] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1E293B] tracking-tight">
                  {activeCategoryObj ? getCategoryName(activeCategoryObj) : t.catalogPage.allProducts}
                </h1>
                <span className="text-xs font-bold text-[#FF5A00] bg-[#FFF7ED] border border-[#FF5A00]/20 px-2.5 py-1 rounded-full">
                  {filteredProducts.length} {language === 'ru' ? 'товаров' : 'ta tovar'}
                </span>
              </div>

              {/* Modern Sort Select */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <span className="text-xs font-medium text-[#64748B] hidden sm:inline">{t.catalogPage.sortBy}:</span>
                <div className="relative">
                  <select
                    id="select-product-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="h-10 pl-3.5 pr-8 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#FF5A00] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="popular">{t.catalogPage.sortPopular}</option>
                    <option value="price-asc">{t.catalogPage.sortPriceAsc}</option>
                    <option value="price-desc">{t.catalogPage.sortPriceDesc}</option>
                    <option value="newest">
                      {language === 'ru' ? 'Сначала новинки' : 'Yangi qo‘shilgan'}
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#F1F5F9]">
                <span className="text-xs text-[#94A3B8] font-medium">
                  {language === 'ru' ? 'Активные:' : 'Faol:'}
                </span>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => handleCategorySelect('all')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF7ED] text-[#FF5A00] text-xs font-bold border border-[#FF5A00]/25 hover:bg-[#FFE8D6] transition-colors"
                  >
                    <span>{activeCategoryObj ? getCategoryName(activeCategoryObj) : selectedCategory}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
                {inStockOnly && (
                  <button
                    onClick={() => setInStockOnly(false)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#16A34A] text-xs font-bold border border-[#16A34A]/25 hover:bg-[#BBF7D0] transition-colors"
                  >
                    <span>{language === 'ru' ? 'В наличии' : 'Faqat omborda'}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
                {selectedBrand !== 'all' && (
                  <button
                    onClick={() => setSelectedBrand('all')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#334155] text-xs font-bold border border-[#E2E8F0] hover:bg-[#E2E8F0] transition-colors"
                  >
                    <span>Brend: {selectedBrand}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#334155] text-xs font-bold border border-[#E2E8F0] hover:bg-[#E2E8F0] transition-colors"
                  >
                    <span>"{searchQuery}"</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#94A3B8] hover:text-[#FF5A00] font-semibold underline ml-1 cursor-pointer"
                >
                  {t.catalogPage.resetFilters}
                </button>
              </div>
            )}
          </div>

          {/* Product Grid: 4-5 compact columns on desktop, 2-3 on mobile/tablet */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5 sm:gap-3.5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E5EAF2] p-12 sm:p-16 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-[#FFF7ED] text-[#FF5A00] flex items-center justify-center mx-auto border border-[#FF5A00]/20">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#1E293B]">
                {t.catalogPage.noProducts}
              </h3>
              <p className="text-sm text-[#64748B] max-w-md mx-auto">
                {t.catalogPage.noProductsDesc}
              </p>
              <button
                id="btn-reset-filters-empty"
                onClick={resetFilters}
                className="px-6 py-3 rounded-2xl bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-bold transition-all shadow-md shadow-[#FF5A00]/25 cursor-pointer"
              >
                {t.catalogPage.resetFilters}
              </button>
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="flex items-center justify-center gap-2 pt-6 pb-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-10 h-10 rounded-2xl border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#FFF7ED] hover:text-[#FF5A00] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                aria-label="Oldingi sahifa"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#FF5A00] text-white shadow-md shadow-[#FF5A00]/25'
                      : 'border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                className="w-10 h-10 rounded-2xl border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#FFF7ED] hover:text-[#FF5A00] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                aria-label="Keyingi sahifa"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer */}
      {isMobileFilterDrawer && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterDrawer(false)}
          />
          <div className="fixed inset-x-0 bottom-0 max-h-[88vh] bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col z-[71]">
            <div className="flex items-center justify-between p-5 border-b border-[#E5EAF2] shrink-0">
              <h3 className="text-lg font-bold text-[#1E293B]">
                {language === 'ru' ? 'Категории и фильтры' : 'Kategoriyalar va Filtrlar'}
              </h3>
              <button
                onClick={() => setIsMobileFilterDrawer(false)}
                className="w-8 h-8 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
                aria-label="Yopish"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <div>
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-2">
                  {t.catalogPage.categories}
                </span>
                <div className="space-y-1.5">
                  <button
                    onClick={() => handleCategorySelect('all')}
                    className={`w-full p-3 rounded-2xl text-xs font-bold text-left flex items-center justify-between transition-colors cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-[#FFF7ED] text-[#FF5A00] border border-[#FF5A00]/25'
                        : 'bg-[#F8FAFC] text-[#1E293B]'
                    }`}
                  >
                    <span>{t.catalogPage.allProducts}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-white text-[#64748B]">
                      {products.length}
                    </span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`w-full p-3 rounded-2xl text-xs font-bold text-left flex items-center justify-between transition-colors cursor-pointer ${
                        selectedCategory === cat.slug
                          ? 'bg-[#FFF7ED] text-[#FF5A00] border border-[#FF5A00]/25'
                          : 'bg-[#F8FAFC] text-[#1E293B]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded overflow-hidden flex items-center justify-center shrink-0">
                          {cat.image ? (
                            <img src={getMediaUrl(cat.image)} alt={getCategoryName(cat)} className="w-full h-full object-cover rounded" />
                          ) : (
                            iconMap[cat.icon] || <Sparkles className="w-4 h-4" />
                          )}
                        </span>
                        <span>{getCategoryName(cat)}</span>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-white text-[#64748B]">
                        {products.filter((p) => p.categoryId === cat.slug || p.categoryId === cat.id).length ||
                          cat.count ||
                          0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E5EAF2] bg-white shrink-0 flex gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
              <button
                onClick={resetFilters}
                className="py-3 px-4 rounded-2xl border border-[#CBD5E1] text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                {t.catalogPage.resetFilters}
              </button>
              <button
                onClick={() => setIsMobileFilterDrawer(false)}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#FF5A00] text-white text-xs font-bold transition-all shadow-md shadow-[#FF5A00]/25 cursor-pointer text-center"
              >
                {language === 'ru' ? 'Показать результаты' : 'Natijalarni ko‘rish'} ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
