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
  MapPin,
  ShieldCheck,
  Phone,
  ChevronDown,
  ArrowRight,
  Clock,
  Globe,
  Building2,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentPath,
    navigate,
    cartCount,
    favorites,
    isCatalogOpen,
    setIsCatalogOpen,
    searchQuery,
    setSearchQuery,
    products,
    siteSettings,
    language,
    setLanguage,
    t,
    getProductName,
    profile,
    customerOrders,
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when search is toggled open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for live search preview
  const searchResults = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleSelectProduct = (slug: string) => {
    navigate(`/product/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-[#F1F5F9] shrink-0 shadow-2xs">
      {/* 1. Top B2B Corporate Utility Bar */}
      <div className="bg-[#081B4B] text-[#94A3B8] text-[11px] sm:text-[12px] border-b border-[#1E293B]/60">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-8 h-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0 text-white font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-[#FF5A00] shrink-0" />
              <span className="truncate">{t.header.deliveryRegion}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 shrink-0 text-[#93C5FD]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#009B5A]" />
              <span>{t.header.contractGuarantee}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <a
              href={`tel:${(siteSettings?.phone1 || '+998870349779').replace(/\s+/g, '')}`}
              className="flex items-center gap-1 text-white hover:text-[#FF5A00] transition-colors font-semibold whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span>{siteSettings?.phone1 || '+998 87 034 97 79'}</span>
            </a>
            <span className="hidden sm:inline text-[#64748B]">|</span>
            <span className="hidden lg:inline text-[#94A3B8] items-center gap-1">
              <Clock className="w-3 h-3 inline mr-1 text-[#64748B]" />
              {siteSettings?.workHours ? siteSettings.workHours : t.header.workHours}
            </span>

            {/* Language Switcher UZ | RU */}
            <div className="flex items-center bg-white/10 hover:bg-white/15 rounded-md p-0.5 border border-white/10 text-[11px] font-bold ml-1">
              <button
                type="button"
                id="btn-lang-uz"
                onClick={() => setLanguage('uz')}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  language === 'uz'
                    ? 'bg-[#FF5A00] text-white shadow-2xs font-black'
                    : 'text-gray-300 hover:text-white'
                }`}
                title="O‘zbekcha"
              >
                UZ
              </button>
              <button
                type="button"
                id="btn-lang-ru"
                onClick={() => setLanguage('ru')}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  language === 'ru'
                    ? 'bg-[#FF5A00] text-white shadow-2xs font-black'
                    : 'text-gray-300 hover:text-white'
                }`}
                title="Русский язык"
              >
                RU
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main FreshDirect-Style Minimalist Navigation Bar */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-[68px] sm:h-[72px] gap-4 lg:gap-8">
          {/* Left: Brand Logo & Inline Navigation */}
          <div className="flex items-center gap-6 xl:gap-10 min-w-0">
            {/* Logo */}
            <div className="shrink-0">
              <Logo />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-semibold text-[#1E293B]">
              {/* Katalog Dropdown Toggle */}
              <button
                id="btn-header-catalog-toggle"
                onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  isCatalogOpen
                    ? 'bg-[#081B4B] text-white shadow-xs'
                    : 'text-[#1E293B] hover:text-[#FF5A00] hover:bg-[#FFF7ED]'
                }`}
                aria-expanded={isCatalogOpen}
                aria-label={t.header.catalog}
              >
                <Menu className="w-4 h-4 text-[#FF5A00]" />
                <span>{t.header.catalog}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isCatalogOpen ? 'rotate-180 text-white' : 'text-[#64748B]'
                  }`}
                />
              </button>

              <button
                onClick={() => navigate('/')}
                className={`hover:text-[#FF5A00] transition-colors cursor-pointer py-1 ${
                  currentPath === '/' ? 'text-[#FF5A00] font-bold' : ''
                }`}
              >
                {language === 'ru' ? 'Главная' : 'Bosh sahifa'}
              </button>

              <button
                onClick={() => navigate('/delivery-payment')}
                className={`hover:text-[#FF5A00] transition-colors cursor-pointer py-1 ${
                  currentPath === '/delivery-payment' ? 'text-[#FF5A00] font-bold' : ''
                }`}
              >
                {t.footer.deliveryPayment}
              </button>

              <button
                onClick={() => navigate('/about')}
                className={`hover:text-[#FF5A00] transition-colors cursor-pointer py-1 ${
                  currentPath === '/about' ? 'text-[#FF5A00] font-bold' : ''
                }`}
              >
                {t.footer.aboutUs}
              </button>

              <button
                onClick={() => navigate('/contacts')}
                className={`hover:text-[#FF5A00] transition-colors cursor-pointer py-1 ${
                  currentPath === '/contacts' ? 'text-[#FF5A00] font-bold' : ''
                }`}
              >
                {t.footer.contacts}
              </button>
            </nav>
          </div>

          {/* Right: FreshDirect Action Elements */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Trigger (Icon or Expandable Box) */}
            <div ref={searchContainerRef} className="relative">
              <button
                id="btn-header-search-toggle"
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isSearchOpen
                    ? 'bg-[#FF5A00] text-white shadow-sm shadow-[#FF5A00]/30'
                    : 'text-[#1E293B] hover:text-[#FF5A00] hover:bg-[#FFF7ED]'
                }`}
                aria-label={t.header.searchPlaceholder}
                title={t.header.searchPlaceholder}
              >
                {isSearchOpen ? <X className="w-4.5 h-4.5" /> : <Search className="w-4.5 h-4.5 stroke-[2.2]" />}
              </button>

              {/* Floating Expandable Search Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full right-0 mt-3 w-[340px] sm:w-[420px] bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 p-4">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      ref={searchInputRef}
                      id="input-header-search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.header.searchPlaceholder}
                      className="w-full h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full pl-4 pr-11 text-xs sm:text-sm font-semibold text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A00] focus:bg-white focus:ring-2 focus:ring-[#FF5A00]/15 transition-all shadow-2xs"
                    />
                    <button
                      type="submit"
                      className="absolute right-3.5 top-3 text-[#94A3B8] hover:text-[#FF5A00] cursor-pointer"
                      aria-label="Search"
                    >
                      <Search className="w-4.5 h-4.5" />
                    </button>
                  </form>

                  {/* Popular tags or search results */}
                  <div className="mt-3.5">
                    {searchQuery.trim() === '' ? (
                      <div>
                        <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                          {language === 'ru' ? 'Популярные запросы' : 'Ommabop so‘rovlar'}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(language === 'ru'
                            ? ['Перчатки', 'Grass', 'Tellux', 'Жидкое мыло 5L', 'Бумага A4']
                            : ['Qo‘lqoplar', 'Grass', 'Tellux', 'Suyuq sovun 5L', 'A4 qog‘oz']
                          ).map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                setSearchQuery(tag);
                                navigate(`/catalog?q=${encodeURIComponent(tag)}`);
                                setIsSearchOpen(false);
                              }}
                              className="px-3 py-1 text-xs bg-[#F8FAFC] hover:bg-[#FFF7ED] hover:text-[#FF5A00] text-[#334155] rounded-full transition-colors border border-[#E2E8F0] font-medium cursor-pointer"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="divide-y divide-[#F1F5F9]">
                        <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                          {language === 'ru' ? 'Результаты поиска' : 'Qidiruv natijalari'}
                        </div>
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => handleSelectProduct(product.slug)}
                            className="w-full py-2.5 flex items-center gap-3 hover:bg-[#F8FAFC] text-left transition-colors cursor-pointer group rounded-xl px-2"
                          >
                            <img
                              src={product.images[0]}
                              alt={getProductName(product)}
                              className="w-10 h-10 object-contain bg-white rounded-xl border border-[#E2E8F0] p-0.5 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[#1E293B] group-hover:text-[#FF5A00] truncate">
                                {getProductName(product)}
                              </p>
                              <p className="text-[11px] font-black text-[#FF5A00]">
                                {formatPrice(product.price)} {t.productCard.sum}
                              </p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#CBD5E1] group-hover:text-[#FF5A00] group-hover:translate-x-0.5 transition-all shrink-0" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#94A3B8] py-4 text-center">
                        {language === 'ru'
                          ? 'Ничего не найдено. Попробуйте другой запрос.'
                          : 'Hech narsa topilmadi. Boshqa so‘z bilan qidirib ko‘ring.'}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sevimlilar (Favorites Heart Button) */}
            <button
              id="btn-header-favorites"
              onClick={() => navigate('/favorites')}
              className="relative w-10 h-10 rounded-full border border-[#E2E8F0] hover:border-[#FF5A00] text-[#334155] hover:text-[#FF5A00] hover:bg-[#FFF7ED]/50 flex items-center justify-center transition-all cursor-pointer shrink-0"
              title={t.header.favorites}
              aria-label={t.header.favorites}
            >
              <Heart
                className={`w-4.5 h-4.5 transition-transform ${
                  favorites.length > 0 ? 'text-[#FF5A00] fill-[#FF5A00]' : ''
                }`}
              />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF5A00] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* FreshDirect Style Circular Cart Button */}
            <button
              id="btn-header-cart"
              onClick={() => navigate('/cart')}
              className="relative w-10 h-10 rounded-full border border-[#CBD5E1] hover:border-[#FF5A00] text-[#1E293B] hover:text-[#FF5A00] hover:bg-[#FFF7ED]/50 flex items-center justify-center transition-all cursor-pointer shrink-0"
              title={t.header.cart}
              aria-label={t.header.cart}
            >
              <ShoppingCart className="w-4.5 h-4.5 stroke-[1.9]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF5A00] text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* FreshDirect Style Solid Pill Action Button */}
            <button
              id="btn-header-quick-request"
              onClick={() => navigate('/request')}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#FF5A00] hover:bg-[#E54A00] shadow-sm hover:shadow-md hover:shadow-[#FF5A00]/25 transition-all cursor-pointer shrink-0 active:scale-97"
              title={t.header.quickRequest}
            >
              <FileText className="w-4 h-4 stroke-[2.2]" />
              <span>{t.header.quickRequest}</span>
            </button>

            {/* Zayavkalar tarixi / Mijoz hisobi */}
            <button
              id="btn-header-orders-history"
              onClick={() => navigate('/requests')}
              className={`hidden xl:inline-flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer px-2.5 py-1.5 rounded-xl ${
                profile?.phone
                  ? 'bg-[#FFF1E8] text-[#FF5A00] hover:bg-[#FFE4D4] border border-[#FFD8BF]'
                  : 'text-[#64748B] hover:text-[#FF5A00]'
              }`}
              title={profile?.phone ? `${profile.company || profile.name || profile.phone} - Zayavkalarim` : t.header.ordersHistory}
            >
              {profile?.phone ? (
                <>
                  <Building2 className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span className="max-w-[120px] truncate">{profile.company || profile.name || profile.phone}</span>
                  {customerOrders.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#FF5A00] text-white text-[10px] font-bold flex items-center justify-center">
                      {customerOrders.length}
                    </span>
                  )}
                </>
              ) : (
                <span>{t.header.ordersHistory}</span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              id="btn-header-mobile-menu-toggle"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full border border-[#E2E8F0] hover:border-[#FF5A00] text-[#1E293B] flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Menyu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-5 pt-2 border-t border-[#F1F5F9] animate-in fade-in slide-in-from-top-2 duration-150 space-y-4">
            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
              <span className="text-xs font-bold text-[#64748B] flex items-center gap-1.5 pl-1">
                <Globe className="w-4 h-4 text-[#FF5A00]" />
                {language === 'ru' ? 'Язык сайта:' : 'Sayt tili:'}
              </span>
              <div className="flex items-center bg-white rounded-xl p-0.5 border border-[#E2E8F0] text-xs font-bold shadow-2xs">
                <button
                  type="button"
                  onClick={() => setLanguage('uz')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    language === 'uz'
                      ? 'bg-[#FF5A00] text-white font-black shadow-2xs'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  O‘zbek
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ru')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    language === 'ru'
                      ? 'bg-[#FF5A00] text-white font-black shadow-2xs'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  Русский
                </button>
              </div>
            </div>

            {/* Quick Katalog button */}
            <button
              onClick={() => {
                setIsCatalogOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#081B4B] text-white font-bold text-sm cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <Menu className="w-5 h-5 text-[#FF5A00]" />
                <span>{t.header.catalog}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/70" />
            </button>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-1 font-semibold text-sm text-[#1E293B]">
              <button
                onClick={() => {
                  navigate('/');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2 px-3 rounded-xl text-left hover:bg-[#F8FAFC] transition-colors ${
                  currentPath === '/' ? 'text-[#FF5A00] font-bold bg-[#FFF7ED]' : ''
                }`}
              >
                {language === 'ru' ? 'Главная' : 'Bosh sahifa'}
              </button>

              <button
                onClick={() => {
                  navigate('/delivery-payment');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2 px-3 rounded-xl text-left hover:bg-[#F8FAFC] transition-colors ${
                  currentPath === '/delivery-payment' ? 'text-[#FF5A00] font-bold bg-[#FFF7ED]' : ''
                }`}
              >
                {t.footer.deliveryPayment}
              </button>

              <button
                onClick={() => {
                  navigate('/about');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2 px-3 rounded-xl text-left hover:bg-[#F8FAFC] transition-colors ${
                  currentPath === '/about' ? 'text-[#FF5A00] font-bold bg-[#FFF7ED]' : ''
                }`}
              >
                {t.footer.aboutUs}
              </button>

              <button
                onClick={() => {
                  navigate('/contacts');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2 px-3 rounded-xl text-left hover:bg-[#F8FAFC] transition-colors ${
                  currentPath === '/contacts' ? 'text-[#FF5A00] font-bold bg-[#FFF7ED]' : ''
                }`}
              >
                {t.footer.contacts}
              </button>

              <button
                onClick={() => {
                  navigate('/requests');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2 px-3 rounded-xl text-left hover:bg-[#F8FAFC] transition-colors flex items-center justify-between ${
                  profile?.phone || currentPath === '/requests' ? 'text-[#FF5A00] font-bold bg-[#FFF7ED]' : 'text-[#475569]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{profile?.phone ? (profile.company || profile.name || profile.phone) : t.header.ordersHistory}</span>
                </div>
                {profile?.phone && customerOrders.length > 0 && (
                  <span className="text-[10px] bg-[#FF5A00] text-white px-2 py-0.5 rounded-full font-bold">
                    {customerOrders.length} ta
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Tezkor zayavka pill button */}
            <button
              onClick={() => {
                navigate('/request');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold text-white bg-[#FF5A00] shadow-md shadow-[#FF5A00]/25 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{t.header.quickRequest}</span>
            </button>
          </div>
        )}
      </div>

      {/* Desktop Mega Menu */}
      <CatalogMegaMenu />
    </header>
  );
};
