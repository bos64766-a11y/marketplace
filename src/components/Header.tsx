import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { CatalogMegaMenu } from './CatalogMegaMenu';
import {
  Menu,
  X,
  Search,
  FileText,
  Heart,
  ShoppingCart,
  User,
  ArrowRight,
  Package,
  Layers,
  Smartphone,
  MapPin,
  ShieldCheck,
  Phone,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentPath,
    navigate,
    cartCount,
    cartTotal,
    favorites,
    requests,
    isCatalogOpen,
    setIsCatalogOpen,
    searchQuery,
    setSearchQuery,
    profile,
    products,
    siteSettings,
  } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        // keep open if focused on input
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for live search preview
  const searchResults = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
      setIsMobileSearchOpen(false);
    }
  };

  const handleSelectProduct = (slug: string) => {
    navigate(`/product/${slug}`);
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    setSearchQuery('');
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shrink-0">
      {/* Top B2B Corporate Utility Bar */}
      <div className="bg-[#081B4B] text-[#94A3B8] text-[11px] sm:text-[12px] border-b border-[#1E293B] overflow-hidden">
        <div className="max-w-[1536px] mx-auto px-3 sm:px-8 h-7 sm:h-8 flex items-center justify-between gap-2 overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-6 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5 min-w-0 text-white font-medium truncate">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF5A00] shrink-0" />
              <span className="truncate">Yetkazib berish: Butun O‘zbekiston</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 shrink-0 text-[#93C5FD]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#009B5A]" />
              <span>100% rasmiy shartnoma, QQS va Didox e-faktura</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-6 shrink-0">
            <a
              href={`tel:${(siteSettings?.phone1 || '+998870349779').replace(/\s+/g, '')}`}
              className="flex items-center gap-1 text-white hover:text-[#FF5A00] transition-colors font-semibold whitespace-nowrap"
            >
              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF5A00]" />
              <span>{siteSettings?.phone1 || '+998 87 034 97 79'}</span>
            </a>
            <span className="hidden sm:inline text-[#64748B]">|</span>
            <span className="hidden sm:inline text-[#94A3B8]">
              {siteSettings?.workHours ? `Ish vaqti: ${siteSettings.workHours}` : 'Ish vaqti: 09:00 — 18:00'}
            </span>
          </div>
        </div>
      </div>

      {/* Top Primary Bar */}
      <div className="max-w-[1536px] mx-auto px-3 sm:px-8">
        <div className="flex items-center justify-between h-[60px] sm:h-[74px] gap-2 sm:gap-6">
          {/* Left: Logo & Dark Blue Katalog Button */}
          <div className="flex items-center gap-2 sm:gap-5 shrink-0">
            <Logo />

            {/* Katalog Button */}
            <button
              id="btn-header-catalog-toggle"
              onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md ${isCatalogOpen
                ? 'bg-[#081B4B] text-white ring-2 ring-[#FF5A00]'
                : 'bg-[#081B4B] hover:bg-[#0F2D6B] text-white shadow-[#081B4B]/20'
                }`}
              aria-expanded={isCatalogOpen}
              aria-label="Katalogni ochish"
            >
              {isCatalogOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF5A00]" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
              <span>Katalog</span>
            </button>
          </div>

          {/* Center: Navigation without duplicate Katalog link */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-semibold text-[#1E293B] leading-[1.3]">
            <button
              onClick={() => navigate('/')}
              className={`hover:text-[#FF5A00] transition-colors cursor-pointer py-1 ${
                currentPath === '/' ? 'text-[#FF5A00] font-bold border-b-2 border-[#FF5A00]' : ''
              }`}
            >
              Bosh sahifa
            </button>

            <button
              onClick={() => navigate('/delivery-payment')}
              className={`hover:text-[#FF5A00] transition-colors cursor-pointer py-1 ${
                currentPath === '/delivery-payment' ? 'text-[#FF5A00] font-bold border-b-2 border-[#FF5A00]' : ''
              }`}
            >
              To‘lov & Yetkazish
            </button>
            <button
              onClick={() => navigate('/about')}
              className={`hover:text-[#FF5A00] transition-colors cursor-pointer py-1 ${
                currentPath === '/about' ? 'text-[#FF5A00] font-bold border-b-2 border-[#FF5A00]' : ''
              }`}
            >
              Biz haqimizda
            </button>
            <button
              onClick={() => navigate('/contacts')}
              className={`hover:text-[#FF5A00] transition-colors cursor-pointer py-1 ${
                currentPath === '/contacts' ? 'text-[#FF5A00] font-bold border-b-2 border-[#FF5A00]' : ''
              }`}
            >
              Aloqa
            </button>
          </nav>

          {/* Right: Search, Favorites, Cart & User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Search Input - Expanded and refined */}
            <div ref={searchContainerRef} className="relative hidden md:block w-52 lg:w-64 xl:w-80">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  id="input-header-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="2,400+ tovardan qidirish..."
                  className="w-full h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl pl-3.5 pr-9 text-xs font-semibold text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A00] focus:bg-white focus:ring-2 focus:ring-[#FF5A00]/15 transition-all shadow-2xs"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-3 text-[#94A3B8] hover:text-[#FF5A00] cursor-pointer"
                  aria-label="Qidirish"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Live Search Dropdown */}
              {isSearchFocused && (
                <div className="absolute top-full right-0 w-80 mt-2 bg-white rounded-2xl border border-[#F1F5F9] shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3">
                    <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                      {searchQuery ? 'Qidiruv natijalari' : 'Ommabop so‘rovlar'}
                    </div>

                    {searchQuery.trim() === '' ? (
                      <div className="flex flex-wrap gap-1.5">
                        {['Qo‘lqoplar', 'Grass', 'Tellux', 'Suyuq sovun 5L', 'A4 qog‘oz'].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              setSearchQuery(tag);
                              navigate(`/catalog?q=${encodeURIComponent(tag)}`);
                              setIsSearchFocused(false);
                            }}
                            className="px-2.5 py-1 text-xs bg-[#F8FAFC] hover:bg-[#FFF7ED] hover:text-[#FF5A00] text-[#334155] rounded-xl transition-colors border border-[#E2E8F0] font-medium"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="divide-y divide-[#F1F5F9]">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => handleSelectProduct(product.slug)}
                            className="w-full py-2 flex items-center gap-2.5 hover:bg-[#F8FAFC] text-left transition-colors cursor-pointer group rounded-xl px-2"
                          >
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-9 h-9 object-cover rounded-xl border border-[#E2E8F0] shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[#1E293B] group-hover:text-[#FF5A00] truncate">
                                {product.name}
                              </p>
                              <p className="text-[11px] font-black text-[#FF5A00]">
                                {formatPrice(product.price)} so‘m
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#94A3B8] py-2 text-center">Mahsulot topilmadi</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              id="btn-header-mobile-search-toggle"
              type="button"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className={`md:hidden relative w-9 h-9 rounded-2xl flex items-center justify-center transition-colors cursor-pointer shrink-0 border ${isMobileSearchOpen
                ? 'bg-[#081B4B] text-white border-[#081B4B]'
                : 'bg-[#F8FAFC] hover:bg-[#FFF7ED] text-[#475569] hover:text-[#FF5A00] border-[#E2E8F0]'
                }`}
              aria-label="Qidiruvni ochish"
            >
              {isMobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>

            {/* Sevimlilar (Favorites Heart Badge) */}
            <button
              id="btn-header-favorites"
              onClick={() => navigate('/favorites')}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#F8FAFC] hover:bg-[#FFF7ED] text-[#475569] hover:text-[#FF5A00] border border-[#E2E8F0] hover:border-[#FF5A00]/30 flex items-center justify-center transition-all cursor-pointer shrink-0"
              title="Sevimlilar"
              aria-label="Sevimlilar"
            >
              <Heart
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform ${favorites.length > 0 ? 'text-[#FF5A00] fill-[#FF5A00]' : ''
                  }`}
              />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF5A00] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Savat (Cart Basket Badge) */}
            <button
              id="btn-header-cart"
              onClick={() => navigate('/cart')}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#F8FAFC] hover:bg-[#FFF7ED] text-[#475569] hover:text-[#FF5A00] border border-[#E2E8F0] hover:border-[#FF5A00]/30 flex items-center justify-center transition-all cursor-pointer shrink-0"
              title="Savat"
              aria-label="Savat"
            >
              <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF5A00] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Quick RFQ / Tezkor zayavka button */}
            <button
              id="btn-header-quick-request"
              onClick={() => navigate('/request')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-[#FF5A00] hover:bg-[#e04f00] shadow-md shadow-[#FF5A00]/25 transition-all cursor-pointer shrink-0 active:scale-97"
              title="Yuridik shaxslar uchun tezkor zayavka"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tezkor zayavka</span>
            </button>

            {/* Zayavkalar tarixi / Orders History button */}
            <button
              id="btn-header-orders-history"
              onClick={() => navigate('/requests')}
              className="hidden md:flex items-center gap-1.5 bg-[#F8FAFC] hover:bg-[#FFF7ED] border border-[#E2E8F0] hover:border-[#FF5A00]/30 px-3 h-10 rounded-2xl text-xs font-bold text-[#1E293B] hover:text-[#FF5A00] transition-all cursor-pointer shrink-0"
              title="Mening zayavkalarim tarixi"
            >
              <FileText className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span className="hidden lg:inline">Zayavkalarim</span>
            </button>
          </div>
        </div>

        {/* Expandable Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div ref={mobileSearchRef} className="md:hidden pb-3 pt-1 animate-in fade-in slide-in-from-top-2 duration-150">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                id="input-mobile-search"
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mahsulot nomi yoki brend bo‘yicha qidiring..."
                className="w-full bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl py-2.5 pl-4 pr-10 text-xs font-medium text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0B2E73] focus:bg-white shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 text-[#0B2E73] cursor-pointer"
                aria-label="Qidirish"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Quick search tags on mobile */}
            {searchQuery.trim() === '' ? (
              <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-[#F1F5F9]">
                <span className="text-[10px] text-[#94A3B8] font-semibold w-full block">Ommabop:</span>
                {['Qo‘lqoplar', 'Grass', 'Tellux', 'Suyuq sovun 5L', 'A4 qog‘oz'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tag);
                      navigate(`/catalog?q=${encodeURIComponent(tag)}`);
                      setIsMobileSearchOpen(false);
                    }}
                    className="px-2 py-0.5 text-[11px] bg-[#F1F5F9] text-[#334155] rounded-md border border-[#E2E8F0]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="mt-2 bg-white rounded-xl border border-[#E2E8F0] shadow-md divide-y divide-[#F1F5F9] max-h-60 overflow-y-auto">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSelectProduct(product.slug)}
                    className="w-full p-2.5 flex items-center gap-2.5 hover:bg-[#F8FAFC] text-left transition-colors cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-8 h-8 object-cover rounded-lg border border-[#E2E8F0] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#0F172A] truncate">
                        {product.name}
                      </p>
                      <p className="text-[11px] font-bold text-[#FF5A00]">
                        {formatPrice(product.price)} so‘m
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Desktop Mega Menu */}
      <CatalogMegaMenu />
    </header>
  );
};
