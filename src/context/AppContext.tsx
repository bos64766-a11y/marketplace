import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Product, Category, CartItem, RequestOrder, UserProfile, ToastNotification, SiteSettings, BannerSlide, HomeShowcaseSection, Partner, Language } from '../types';
import { translations, Translations, formatUnit as formatUnitHelper, CATEGORY_FALLBACK_TRANSLATIONS } from '../i18n/translations';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { CATEGORIES as INITIAL_CATEGORIES } from '../data/categories';
import { PARTNERS as DEFAULT_PARTNERS } from '../data/content';
import { api } from '../services/api';

interface AppContextType {
  // Navigation
  currentPath: string;
  navigate: (path: string) => void;

  // Products (Dynamic Store & Admin)
  products: Product[];
  addProduct: (productData: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, updated: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearAllProducts: () => Promise<void>;
  toggleProductStock: (id: string) => void;
  resetProductsToDefault: () => void;

  // Categories (Dynamic Store & Admin)
  categories: Category[];
  addCategory: (categoryData: Category) => Promise<void>;
  updateCategory: (id: string, updated: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Banners (Dynamic Store & Admin)
  banners: BannerSlide[];
  addBanner: (bannerData: Omit<BannerSlide, 'id'>) => Promise<void>;
  updateBanner: (id: string | number, updated: Partial<BannerSlide>) => Promise<void>;
  deleteBanner: (id: string | number) => Promise<void>;
  resetDefaultBanners: () => Promise<void>;

  // Showcase Sections (Biz kimlar uchun xizmat qilamiz)
  showcaseSections: HomeShowcaseSection[];
  addShowcaseSection: (data: Omit<HomeShowcaseSection, 'id'>) => Promise<void>;
  updateShowcaseSection: (id: string | number, updated: Partial<HomeShowcaseSection>) => Promise<void>;
  deleteShowcaseSection: (id: string | number) => Promise<void>;
  resetDefaultShowcaseSections: () => Promise<void>;

  // Partners (Hamkorlar - Dynamic Store & Admin)
  partners: Partner[];
  addPartner: (partnerData: Omit<Partner, 'id'>) => Promise<void>;
  updatePartner: (id: string, updated: Partial<Partner>) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  resetDefaultPartners: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // Favorites
  favorites: string[]; // product IDs
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Requests history & Admin Zayavkalar
  requests: RequestOrder[];
  submitRequest: (orderData: Omit<RequestOrder, 'id' | 'date' | 'status'>) => RequestOrder;
  updateRequestStatus: (id: string, status: RequestOrder['status']) => void;
  deleteRequest: (id: string) => void;
  addManualRequest: (order: RequestOrder) => void;

  // Site Settings & Content
  siteSettings: SiteSettings;
  updateSiteSettings: (updated: Partial<SiteSettings>) => void;

  // User Profile & Customer Account
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  loginCustomer: (phone: string, company?: string, name?: string, inn?: string) => Promise<boolean>;
  logoutCustomer: () => void;
  customerOrders: RequestOrder[];

  // Toast
  toast: ToastNotification | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Search & Catalog state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCatalogOpen: boolean;
  setIsCatalogOpen: (open: boolean) => void;
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (open: boolean) => void;

  // Admin Auth
  isAdminAuthenticated: boolean;
  loginAdmin: (login: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => void;

  // Language & i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  getProductName: (product: Product) => string;
  formatUnit: (unit?: string | null, customLang?: Language) => string;

  // Backup & Permanent Recovery
  exportBackupJSON: () => void;
  importBackupJSON: (jsonData: any) => Promise<boolean>;
  restoreFromArchive: () => Promise<void>;
  archiveStats: { productsCount: number; sectionsCount: number };
}

const DEFAULT_SETTINGS: SiteSettings = {
  companyName: 'SNABTASH B2B',
  phone1: '+998 87 034 97 79',
  phone2: '+998 90 123 45 67',
  email: 'info@snabtash.uz',
  telegramBot: '@snabtash_bot',
  telegramChannel: 'https://t.me/snabtash',
  address: 'Toshkent sh., Chilonzor tumani, Bunyodkor shox ko‘chasi, 42-uy',
  workHours: 'Dush - Shan: 08:30 - 18:30',
  inn: '309871234',
  mfo: '00440',
  bankAccount: '20208000900123456001',
  bankName: 'ATB "Kapitalbank" Chilonzor filiali',
  freeDeliveryThreshold: 500000,
  deliveryCost: 35000,
  bannerHeadline: 'Korxonangiz Uchun Barcha Ta’minot',
  bannerSubtitle: 'Ishingiz uchun sifatli klining kimyolari, xo‘jalik mollari va gigiyena tovarlarini to‘g‘ridan-to‘g‘ri ombordan oling.',
  bannerDiscountBadge: 'Maxsus B2B Taklif • 20% Chegirma',
};

const DEFAULT_BANNERS: BannerSlide[] = [
  {
    id: 1,
    title: 'Tozalik yechimlari aksiyasi',
    image: '/banners/banner-clean-promo.webp',
    btnLink: '/catalog/maishiy-kimyo',
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    title: 'ChatGPT Image Sep 6, 2026, 03_34_04 PM',
    image: '/banners/banner-second.webp',
    btnLink: '/catalog',
    order: 2,
    isActive: true,
  },
];

const DEFAULT_SHOWCASE_SECTIONS: HomeShowcaseSection[] = [
  {
    id: '1',
    title: 'Ofislar uchun',
    subtitle: 'Kantselyariya, gigiyena va ofis kundalik sarflov vositalari',
    link: '/catalog/kanselyariya',
    productIds: [
      'snb-012',
      'snb-004',
      'snb-001',
      'snb-tellux-zz2-comfort',
      'snb-tellux-z2-towels',
      'snb-glade-aerosol-300',
    ],
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    title: 'Restoran va mehmonxonalar uchun',
    subtitle: 'HoReCa professional tozalash, idish yuvish va SanPiN talablariga mos vositalar',
    link: '/catalog/maishiy-kimyo',
    productIds: [
      'snb-napkins-elma-33',
      'snb-toilet-paper-mini-2ply',
      'snb-toilet-paper-giant-roll',
      'snb-grass-dos-toilet-block',
      'snb-grass-steel-cleaner',
      'snb-001',
    ],
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    title: 'Klining kompaniyalari uchun',
    subtitle: 'Professional tozalash kimyolari, konsentratlar va mikrofibra inventarlari',
    link: '/catalog/maishiy-kimyo',
    productIds: [
      'snb-grass-antigraffiti',
      'snb-vanish-carpet-gold',
      'snb-grass-polyrole-matte',
      'snb-vanish-oxi-500',
      'snb-plastic-bucket',
      'snb-gloves-latex-korea',
    ],
    order: 3,
    isActive: true,
  },
  {
    id: '4',
    title: 'Zavod va fabrikalar uchun',
    subtitle: 'Individual himoya vositalari, ishchi qo‘lqoplar va sanoat tozalovchilari',
    link: '/catalog/himoya-vositalari',
    productIds: [
      'snb-gloves-orange',
      'snb-gloves-insulated-300',
      'snb-gloves-cotton-45g',
      'snb-gloves-nitrile-coating',
      'snb-gloves-latex-zebra',
      'snb-plastic-barrel',
    ],
    order: 4,
    isActive: true,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state (SPA with browser history sync)
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return (window.location.pathname + window.location.search) || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const full = (window.location.pathname + window.location.search) || '/';
      setCurrentPath(full);
      try {
        const params = new URLSearchParams(window.location.search);
        setSearchQuery(params.get('q') || '');
      } catch {
        // ignore
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const currentFull = window.location.pathname + window.location.search;
    if (currentFull !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    setIsCatalogOpen(false);
  };

  // Toast state
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3000);
  };

  // Language & i18n state
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('snabtash_lang');
      if (saved === 'ru' || saved === 'uz') return saved;
    } catch {}
    return 'uz';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('snabtash_lang', lang);
    } catch {}
  };

  const t = useMemo(() => translations[language], [language]);

  const getProductName = (p: Product): string => {
    if (language === 'ru' && p.name_ru?.trim()) {
      return p.name_ru.trim();
    }
    return p.name;
  };

  const formatUnit = (unit?: string | null, customLang?: Language): string => {
    return formatUnitHelper(unit, customLang || language);
  };

  const getCategoryName = (categoryOrId?: Category | string | null): string => {
    if (!categoryOrId) return '';
    let cat: Category | undefined;
    if (typeof categoryOrId === 'string') {
      const cleanStr = categoryOrId.trim();
      cat = categories.find(
        (c) => c.id === cleanStr || c.slug === cleanStr || c.name.toLowerCase() === cleanStr.toLowerCase()
      );
      if (!cat) {
        const cleanLower = cleanStr.toLowerCase();
        if (language === 'ru' && CATEGORY_FALLBACK_TRANSLATIONS[cleanLower]) {
          return CATEGORY_FALLBACK_TRANSLATIONS[cleanLower].ru;
        }
        return cleanStr;
      }
    } else {
      cat = categoryOrId;
    }

    if (language === 'ru') {
      if (cat.name_ru?.trim() && !cat.name_ru.includes('?')) {
        return cat.name_ru.trim();
      }
      const slugKey = (cat.slug || cat.id || '').toLowerCase().trim();
      if (CATEGORY_FALLBACK_TRANSLATIONS[slugKey]) {
        return CATEGORY_FALLBACK_TRANSLATIONS[slugKey].ru;
      }
      const nameKey = cat.name.toLowerCase().trim();
      if (CATEGORY_FALLBACK_TRANSLATIONS[nameKey]) {
        return CATEGORY_FALLBACK_TRANSLATIONS[nameKey].ru;
      }
    }
    return cat.name;
  };

  const getProductDesc = (p: Product): string => {
    if (language === 'ru' && p.description_ru?.trim()) {
      return p.description_ru.trim();
    }
    return p.description;
  };

  const getProductTag = (p: Product): string | undefined => {
    if (language === 'ru' && p.tag_ru?.trim()) {
      return p.tag_ru.trim();
    }
    return p.tag;
  };

  // Deleted IDs tracking to prevent deleted items from reappearing
  const getDeletedIds = (key: string): Set<string> => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return new Set(JSON.parse(raw));
    } catch {}
    return new Set();
  };

  const markIdDeleted = (key: string, id: string | number) => {
    try {
      const set = getDeletedIds(key);
      set.add(String(id));
      localStorage.setItem(key, JSON.stringify(Array.from(set)));
    } catch {}
  };

  const unmarkIdDeleted = (key: string, id: string | number) => {
    try {
      const set = getDeletedIds(key);
      set.delete(String(id));
      localStorage.setItem(key, JSON.stringify(Array.from(set)));
    } catch {}
  };

  // Dynamic Products state (persisted to localStorage, server is source of truth)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('snabtash_admin_products');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Archive Stats state for UI
  const [archiveStats, setArchiveStats] = useState(() => {
    try {
      const pRaw = localStorage.getItem('snabtash_products_archive');
      const sRaw = localStorage.getItem('snabtash_sections_archive');
      return {
        productsCount: pRaw ? JSON.parse(pRaw).length : INITIAL_PRODUCTS.length,
        sectionsCount: sRaw ? JSON.parse(sRaw).length : 0,
      };
    } catch {
      return { productsCount: INITIAL_PRODUCTS.length, sectionsCount: 0 };
    }
  });

  const updateArchiveStats = () => {
    try {
      const pRaw = localStorage.getItem('snabtash_products_archive');
      const sRaw = localStorage.getItem('snabtash_sections_archive');
      setArchiveStats({
        productsCount: pRaw ? JSON.parse(pRaw).length : INITIAL_PRODUCTS.length,
        sectionsCount: sRaw ? JSON.parse(sRaw).length : 0,
      });
    } catch {}
  };

  // Cross-tab and Cross-window broadcast sync
  const syncChannelRef = useRef<BroadcastChannel | null>(null);

  const notifySync = useCallback(() => {
    try {
      syncChannelRef.current?.postMessage({ type: 'DATA_CHANGED', timestamp: Date.now() });
    } catch {}
  }, []);

  // Helper to re-sync all live data from Django backend with smart merge protection
  const refreshFromBackend = useCallback(async () => {
    try {
      const [prodsRes, catsRes, ordsRes, settRes, banRes, sectRes, partRes] = await Promise.allSettled([
        api.getProducts(),
        api.getCategories(),
        api.getOrders(),
        api.getSettings(),
        api.getBanners(),
        api.getShowcaseSections(),
        api.getPartners(),
      ]);

      if (prodsRes.status === 'fulfilled' && Array.isArray(prodsRes.value) && prodsRes.value.length > 0) {
        const serverProducts = prodsRes.value;
        setProducts(serverProducts);
        try {
          localStorage.setItem('snabtash_admin_products', JSON.stringify(serverProducts));
          localStorage.setItem('snabtash_products_archive', JSON.stringify(serverProducts));
        } catch {}
        updateArchiveStats();
      } else {
        // If backend is offline or sleeping or suspended (503), ensure fresh browsers never show 0 products!
        setProducts((current) => {
          if (!current || current.length === 0) {
            try {
              localStorage.setItem('snabtash_admin_products', JSON.stringify(INITIAL_PRODUCTS));
              localStorage.setItem('snabtash_products_archive', JSON.stringify(INITIAL_PRODUCTS));
            } catch {}
            return INITIAL_PRODUCTS;
          }
          return current;
        });
      }

      if (catsRes.status === 'fulfilled' && Array.isArray(catsRes.value) && catsRes.value.length > 0) {
        setCategories(catsRes.value);
        try {
          localStorage.setItem('snabtash_admin_categories', JSON.stringify(catsRes.value));
        } catch {}
      } else {
        setCategories((current) => {
          if (!current || current.length === 0) {
            try {
              localStorage.setItem('snabtash_admin_categories', JSON.stringify(INITIAL_CATEGORIES));
            } catch {}
            return INITIAL_CATEGORIES;
          }
          return current;
        });
      }

      if (ordsRes.status === 'fulfilled' && Array.isArray(ordsRes.value)) {
        setRequests(ordsRes.value);
      }

      if (settRes.status === 'fulfilled' && settRes.value && settRes.value.companyName) {
        setSiteSettings(settRes.value);
      }

      if (banRes.status === 'fulfilled' && Array.isArray(banRes.value) && banRes.value.length > 0) {
        setBanners(banRes.value);
        try {
          localStorage.setItem('snabtash_admin_banners', JSON.stringify(banRes.value));
        } catch {}
      }

      if (sectRes.status === 'fulfilled' && Array.isArray(sectRes.value) && sectRes.value.length > 0) {
        const serverSections = sectRes.value;
        setShowcaseSections(serverSections);
        try {
          localStorage.setItem('snabtash_showcase_sections', JSON.stringify(serverSections));
        } catch {}
        updateArchiveStats();
      }

      if (partRes.status === 'fulfilled' && Array.isArray(partRes.value) && partRes.value.length > 0) {
        setPartners(partRes.value);
        try {
          localStorage.setItem('snabtash_partners', JSON.stringify(partRes.value));
        } catch {}
      }
    } catch {
      // ignore
    }
  }, []);

  // Load initial live data from Django API on startup
  useEffect(() => {
    refreshFromBackend();
  }, [refreshFromBackend]);

  // Real-time synchronization across different browser windows, tabs, and focus changes
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('snabtash_sync_channel');
        syncChannelRef.current = bc;
        bc.onmessage = (event) => {
          if (event.data?.type === 'DATA_CHANGED') {
            refreshFromBackend();
          }
        };
      } catch {}
    }

    const handleFocus = () => {
      refreshFromBackend();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshFromBackend();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Periodic polling (every 6 seconds) ensures 2 distinct browsers (e.g. Chrome & Edge)
    // stay in sync automatically without requiring manual page reload!
    const interval = setInterval(refreshFromBackend, 6000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
      try {
        syncChannelRef.current?.close();
      } catch {}
    };
  }, [refreshFromBackend]);

  useEffect(() => {
    try {
      localStorage.setItem('snabtash_admin_products', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    const tempId = `snb-${Date.now()}`;
    const generatedSku = productData.sku?.trim() || `SNB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const generatedSlug = productData.slug?.trim() || productData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `prod-${Date.now()}`;

    const resolvedCatId = productData.categoryId?.trim() || categories[0]?.id || categories[0]?.slug || 'maishiy-kimyo';
    const catObj = categories.find((c) => c.id === resolvedCatId || c.slug === resolvedCatId);
    const resolvedCatName = catObj?.name || productData.categoryName || '';

    const enrichedProductData: Omit<Product, 'id'> = {
      ...productData,
      categoryId: resolvedCatId,
      categoryName: resolvedCatName,
    };

    const localProduct: Product = {
      ...enrichedProductData,
      id: tempId,
      sku: generatedSku,
      slug: generatedSlug,
    };

    try {
      const serverProduct = await api.createProduct({
        ...enrichedProductData,
        sku: generatedSku,
        slug: generatedSlug,
        category_id: resolvedCatId,
        images_list: productData.images,
      } as any);

      if (serverProduct && serverProduct.id) {
        unmarkIdDeleted('snabtash_deleted_product_ids', serverProduct.id);
        unmarkIdDeleted('snabtash_deleted_product_ids', tempId);
        setProducts((prev) => {
          const next = [serverProduct, ...prev.filter((p) => p.id !== serverProduct.id)];
          try {
            localStorage.setItem('snabtash_admin_products', JSON.stringify(next));
            localStorage.setItem('snabtash_products_archive', JSON.stringify(next));
          } catch {}
          updateArchiveStats();
          return next;
        });
        showToast(`✓ Yangi mahsulot "${serverProduct.name}" muvaffaqiyatli saqlandi`, 'success');
        notifySync();
        return serverProduct;
      }
      throw new Error('Serverdan kutilmagan javob qaytdi');
    } catch (err: any) {
      console.error('API product create error:', err);
      // Agar Vercel yoki statik hostda backend yo'q bo'lsa (405 Method Not Allowed / 404):
      if (err?.message?.includes('405') || err?.message?.includes('404') || err?.message?.includes('Failed to fetch')) {
        unmarkIdDeleted('snabtash_deleted_product_ids', tempId);
        setProducts((prev) => {
          const next = [localProduct, ...prev];
          try {
            localStorage.setItem('snabtash_admin_products', JSON.stringify(next));
            localStorage.setItem('snabtash_products_archive', JSON.stringify(next));
          } catch {}
          updateArchiveStats();
          return next;
        });
        notifySync();
        showToast(`✓ Mahsulot saqlandi (Faqat ushbu brauzerda. Sababi: Serverda Django backend ulanmagan: ${err.message})`, 'info');
        return localProduct;
      }
      const errMsg = err?.message || 'Serverga ulanishda xatolik yuz berdi';
      showToast(`Xatolik: Mahsulot serverda saqlanmadi (${errMsg})`, 'error');
      throw err;
    }
  };

  const updateProduct = async (id: string, updated: Partial<Product>) => {
    try {
      const payload: any = {
        ...updated,
        images_list: updated.images,
      };
      if (updated.categoryId && updated.categoryId.trim()) {
        payload.category_id = updated.categoryId.trim();
      }
      const serverProduct = await api.updateProduct(id, payload);
      setProducts((prev) => {
        const next = prev.map((item) => (item.id === id ? { ...item, ...serverProduct } : item));
        try {
          localStorage.setItem('snabtash_admin_products', JSON.stringify(next));
          localStorage.setItem('snabtash_products_archive', JSON.stringify(next));
        } catch {}
        return next;
      });
      showToast('✓ Mahsulot ma’lumotlari muvaffaqiyatli yangilandi', 'success');
      notifySync();
    } catch (err: any) {
      console.error('API product update error:', err);
      if (err?.message?.includes('405') || err?.message?.includes('404') || err?.message?.includes('Failed to fetch')) {
        setProducts((prev) => {
          const next = prev.map((item) => (item.id === id ? { ...item, ...updated } : item));
          try {
            localStorage.setItem('snabtash_admin_products', JSON.stringify(next));
            localStorage.setItem('snabtash_products_archive', JSON.stringify(next));
          } catch {}
          return next;
        });
        notifySync();
        showToast('✓ Mahsulot yangilandi (mahalliy xotirada)', 'info');
        return;
      }
      const errMsg = err?.message || 'Serverda xatolik yuz berdi';
      showToast(`Xatolik: Mahsulot yangilanmadi (${errMsg})`, 'error');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    const target = products.find((p) => p.id === id);
    markIdDeleted('snabtash_deleted_product_ids', id);
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem('snabtash_admin_products', JSON.stringify(next));
        localStorage.setItem('snabtash_products_archive', JSON.stringify(next));
      } catch {}
      updateArchiveStats();
      return next;
    });

    try {
      await api.deleteProduct(id);
      showToast(`Mahsulot "${target?.name || id}" o‘chirildi`, 'info');
      notifySync();
    } catch (err: any) {
      console.error('API product delete error:', err);
      showToast(`Mahsulot "${target?.name || id}" o‘chirildi (mahalliy)`, 'info');
      notifySync();
    }
  };

  const clearAllProducts = async () => {
    const toDelete = [...products];
    setProducts([]);
    try {
      localStorage.setItem('snabtash_admin_products', '[]');
      localStorage.removeItem('snabtash_products_archive');
    } catch {}
    updateArchiveStats();
    notifySync();

    try {
      await Promise.allSettled(toDelete.map((p) => api.deleteProduct(p.id)));
      showToast("Barcha mahsulotlar tozalandi (0 ta qoldi)", 'info');
    } catch (err: any) {
      showToast(`Xatolik: ${err.message}`, 'error');
    }
  };

  const toggleProductStock = async (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
    try {
      await api.toggleStock(id);
      showToast('Ombor holati yangilandi', 'info');
      notifySync();
    } catch (err) {
      console.warn('API sync warning:', err);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
      );
      showToast('Xatolik: Ombor holati o‘zgarmadi', 'error');
    }
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    try {
      localStorage.setItem('snabtash_admin_products', JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem('snabtash_products_archive', JSON.stringify(INITIAL_PRODUCTS));
    } catch {}
    updateArchiveStats();
    notifySync();
    showToast(`✓ Mahsulotlar asl holatiga qaytarildi (${INITIAL_PRODUCTS.length} ta tovar)`, 'info');
  };

  // Dynamic Categories state
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('snabtash_admin_categories');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_CATEGORIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('snabtash_admin_categories', JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [categories]);

  const addCategory = async (catData: Category) => {
    setCategories((prev) => [...prev, catData]);
    try {
      await api.createCategory(catData);
      showToast(`✓ Yangi kategoriya "${catData.name}" qo‘shildi`, 'success');
      notifySync();
    } catch (err) {
      console.warn('API category create warning:', err);
      showToast(`✓ Yangi kategoriya "${catData.name}" qo‘shildi`, 'success');
    }
  };

  const updateCategory = async (id: string, updated: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    try {
      await api.updateCategory(id, updated);
      showToast('Kategoriya yangilandi', 'success');
      notifySync();
    } catch (err) {
      console.warn('API category update warning:', err);
      showToast('Kategoriya yangilandi', 'success');
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    try {
      await api.deleteCategory(id);
      notifySync();
    } catch (err) {
      console.warn('API category delete warning:', err);
    }
    showToast('Kategoriya o‘chirildi', 'info');
  };

  // Dynamic Banners state
  const [banners, setBanners] = useState<BannerSlide[]>(() => {
    try {
      const saved = localStorage.getItem('snabtash_admin_banners');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_BANNERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('snabtash_admin_banners', JSON.stringify(banners));
    } catch {
      // ignore
    }
  }, [banners]);

  const addBanner = async (bannerData: Omit<BannerSlide, 'id'>) => {
    try {
      const created = await api.createBanner(bannerData);
      setBanners((prev) => {
        const next = [...prev, created];
        try {
          localStorage.setItem('snabtash_admin_banners', JSON.stringify(next));
        } catch {}
        return next;
      });
      notifySync();
      showToast('✓ Yangi banner muvaffaqiyatli qo‘shildi', 'success');
    } catch (err) {
      console.log('API banner create error, using local fallback:', err);
      const newBanner: BannerSlide = { ...bannerData, id: Date.now() };
      setBanners((prev) => {
        const next = [...prev, newBanner];
        try {
          localStorage.setItem('snabtash_admin_banners', JSON.stringify(next));
        } catch {}
        return next;
      });
      notifySync();
      showToast('✓ Yangi banner saqlandi', 'success');
    }
  };

  const updateBanner = async (id: string | number, updated: Partial<BannerSlide>) => {
    const idStr = String(id);
    setBanners((prev) => {
      const next = prev.map((b) => (String(b.id) === idStr ? { ...b, ...updated } : b));
      try {
        localStorage.setItem('snabtash_admin_banners', JSON.stringify(next));
      } catch {}
      return next;
    });

    try {
      const saved = await api.updateBanner(id, updated);
      setBanners((prev) => {
        const next = prev.map((b) => (String(b.id) === idStr ? { ...b, ...saved } : b));
        try {
          localStorage.setItem('snabtash_admin_banners', JSON.stringify(next));
        } catch {}
        return next;
      });
      notifySync();
      showToast('✓ Banner muvaffaqiyatli yangilandi', 'success');
    } catch (err) {
      console.log('API banner update error, using local fallback:', err);
      notifySync();
      showToast('✓ Banner yangilandi', 'success');
    }
  };

  const deleteBanner = async (id: string | number) => {
    const idStr = String(id);
    setBanners((prev) => {
      const next = prev.filter((b) => String(b.id) !== idStr);
      try {
        localStorage.setItem('snabtash_admin_banners', JSON.stringify(next));
      } catch {}
      return next;
    });

    try {
      await api.deleteBanner(id);
      notifySync();
    } catch (err) {
      console.log('API banner delete error:', err);
    }
    showToast('Banner o‘chirildi', 'info');
  };

  const resetDefaultBanners = async () => {
    const createdList: BannerSlide[] = [];
    for (const item of DEFAULT_BANNERS) {
      try {
        const { id, ...data } = item;
        const res = await api.createBanner(data);
        createdList.push(res);
      } catch {
        createdList.push(item);
      }
    }
    setBanners(createdList);
    try {
      localStorage.setItem('snabtash_admin_banners', JSON.stringify(createdList));
    } catch {}
    notifySync();
    showToast('✓ Standart bannerlar qayta tiklandi', 'success');
  };

  // Dynamic Showcase Sections state (Biz kimlar uchun xizmat qilamiz)
  const [showcaseSections, setShowcaseSections] = useState<HomeShowcaseSection[]>(() => {
    try {
      const saved = localStorage.getItem('snabtash_showcase_sections');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SHOWCASE_SECTIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('snabtash_showcase_sections', JSON.stringify(showcaseSections));
    } catch {}
  }, [showcaseSections]);

  const addShowcaseSection = async (data: Omit<HomeShowcaseSection, 'id'>) => {
    try {
      const created = await api.createShowcaseSection(data);
      unmarkIdDeleted('snabtash_deleted_section_ids', created.id);
      setShowcaseSections((prev) => {
        const next = [...prev, created];
        try {
          localStorage.setItem('snabtash_showcase_sections', JSON.stringify(next));
          localStorage.setItem('snabtash_sections_archive', JSON.stringify(next));
        } catch {}
        updateArchiveStats();
        return next;
      });
      notifySync();
      showToast('✓ Yangi bo‘lim muvaffaqiyatli qo‘shildi', 'success');
    } catch (err) {
      console.log('API showcase create error, using local fallback:', err);
      const newSec: HomeShowcaseSection = { ...data, id: `section-${Date.now()}` };
      unmarkIdDeleted('snabtash_deleted_section_ids', newSec.id);
      setShowcaseSections((prev) => {
        const next = [...prev, newSec];
        try {
          localStorage.setItem('snabtash_showcase_sections', JSON.stringify(next));
          localStorage.setItem('snabtash_sections_archive', JSON.stringify(next));
        } catch {}
        updateArchiveStats();
        return next;
      });
      notifySync();
      showToast('✓ Yangi bo‘lim saqlandi', 'success');
    }
  };

  const updateShowcaseSection = async (id: string | number, updated: Partial<HomeShowcaseSection>) => {
    const idStr = String(id);
    setShowcaseSections((prev) => {
      const next = prev.map((s) => (String(s.id) === idStr ? { ...s, ...updated } : s));
      try {
        localStorage.setItem('snabtash_showcase_sections', JSON.stringify(next));
        localStorage.setItem('snabtash_sections_archive', JSON.stringify(next));
      } catch {}
      return next;
    });

    try {
      const saved = await api.updateShowcaseSection(id, updated);
      if (saved && saved.id) {
        setShowcaseSections((prev) => prev.map((s) => (String(s.id) === idStr ? saved : s)));
      }
      notifySync();
    } catch (err) {
      console.log('API showcase update error, using local state:', err);
    }
    showToast('Bo‘lim maʼlumotlari yangilandi', 'info');
  };

  const deleteShowcaseSection = async (id: string | number) => {
    const idStr = String(id);
    markIdDeleted('snabtash_deleted_section_ids', id);
    setShowcaseSections((prev) => {
      const next = prev.filter((s) => String(s.id) !== idStr);
      try {
        localStorage.setItem('snabtash_showcase_sections', JSON.stringify(next));
        localStorage.setItem('snabtash_sections_archive', JSON.stringify(next));
      } catch {}
      updateArchiveStats();
      return next;
    });

    try {
      await api.deleteShowcaseSection(id);
      notifySync();
    } catch (err) {
      console.log('API showcase delete error:', err);
    }
    showToast('Bo‘lim o‘chirildi', 'info');
  };

  const resetDefaultShowcaseSections = async () => {
    const createdList: HomeShowcaseSection[] = [];
    for (const item of DEFAULT_SHOWCASE_SECTIONS) {
      try {
        const { id, ...data } = item;
        const res = await api.createShowcaseSection(data);
        createdList.push(res);
      } catch {
        createdList.push(item);
      }
    }
    setShowcaseSections(createdList);
    try {
      localStorage.setItem('snabtash_showcase_sections', JSON.stringify(createdList));
    } catch {}
    notifySync();
    showToast('✓ Standart sohaviy bo‘limlar qayta tiklandi', 'success');
  };

  // Partners State (Hamkorlar)
  const [partners, setPartners] = useState<Partner[]>(() => {
    try {
      const saved = localStorage.getItem('snabtash_partners');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_PARTNERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('snabtash_partners', JSON.stringify(partners));
    } catch {}
  }, [partners]);

  const addPartner = async (data: Omit<Partner, 'id'>) => {
    try {
      const created = await api.createPartner(data);
      setPartners((prev) => {
        const next = [...prev, created];
        try {
          localStorage.setItem('snabtash_partners', JSON.stringify(next));
        } catch {}
        return next;
      });
      notifySync();
      showToast('✓ Yangi hamkor muvaffaqiyatli qo‘shildi', 'success');
    } catch (err) {
      console.warn('API create partner error:', err);
      // Fallback local creation
      const newPartner: Partner = {
        ...data,
        id: `partner-${Date.now()}`,
      };
      setPartners((prev) => {
        const next = [...prev, newPartner];
        try {
          localStorage.setItem('snabtash_partners', JSON.stringify(next));
        } catch {}
        return next;
      });
      notifySync();
      showToast('✓ Yangi hamkor qo‘shildi', 'success');
    }
  };

  const updatePartner = async (id: string, updated: Partial<Partner>) => {
    setPartners((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...updated } : p));
      try {
        localStorage.setItem('snabtash_partners', JSON.stringify(next));
      } catch {}
      return next;
    });
    try {
      await api.updatePartner(id, updated);
      notifySync();
    } catch (err) {
      console.warn('API update partner warning:', err);
    }
    showToast('✓ Hamkor ma’lumotlari yangilandi', 'success');
  };

  const deletePartner = async (id: string) => {
    setPartners((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem('snabtash_partners', JSON.stringify(next));
      } catch {}
      return next;
    });
    try {
      await api.deletePartner(id);
      notifySync();
    } catch (err) {
      console.warn('API delete partner warning:', err);
    }
    showToast('Hamkor o‘chirildi', 'info');
  };

  const resetDefaultPartners = async () => {
    setPartners(DEFAULT_PARTNERS);
    try {
      localStorage.setItem('snabtash_partners', JSON.stringify(DEFAULT_PARTNERS));
    } catch {}
    // Re-fetch or re-seed on API if needed
    api.getPartners().then((res) => {
      if (res && res.length > 0) setPartners(res);
    }).catch(() => {});
    notifySync();
    showToast('✓ Standart hamkorlar qayta tiklandi', 'success');
  };

  // Site Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('snabtash_site_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  const updateSiteSettings = (updated: Partial<SiteSettings>) => {
    setSiteSettings((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('snabtash_site_settings', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    api.updateSettings(updated).then(() => {
      notifySync();
    }).catch((err) => console.log('API sync warning:', err));
    showToast('✓ Sayt sozlamalari muvaffaqiyatli saqlandi', 'success');
  };

  // Cart state persisted to localStorage (v2 clean isolated cart per browser)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('snabtash_cart_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('snabtash_cart_v2', JSON.stringify(cart));
      // Clean up legacy v1 demo cart with 8 mock items if present
      localStorage.removeItem('snabtash_cart');
    } catch {
      // ignore
    }
  }, [cart]);

  // Favorites state persisted to localStorage (v2 clean isolated favorites)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('snabtash_favs_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('snabtash_favs_v2', JSON.stringify(favorites));
      // Clean up legacy v1 demo favorites if present
      localStorage.removeItem('snabtash_favs');
    } catch {
      // ignore
    }
  }, [favorites]);

  // Requests state (Zayavkalar - clean real orders only, no mock demo items)
  const [requests, setRequests] = useState<RequestOrder[]>(() => {
    try {
      const saved = localStorage.getItem('snabtash_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out legacy hardcoded mock demo orders (1042, 1041, 1040, 1039, 1038)
          return parsed.filter((o) => !['1042', '1041', '1040', '1039', '1038'].includes(String(o.id)));
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('snabtash_requests', JSON.stringify(requests));
    } catch {
      // ignore
    }
  }, [requests]);

  const updateRequestStatus = (id: string, status: RequestOrder['status']) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    api.updateOrderStatus(id, status).catch((err) => console.log('API sync warning:', err));
    showToast(`Zayavka #${id} holati "${status}" ga o‘zgartirildi`, 'success');
  };

  const deleteRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    api.deleteOrder(id).catch((err) => console.log('API sync warning:', err));
    showToast(`Zayavka #${id} o‘chirildi`, 'info');
  };

  const addManualRequest = (order: RequestOrder) => {
    setRequests((prev) => [order, ...prev]);
    showToast(`Yangi zayavka #${order.id} muvaffaqiyatli qo‘shildi`, 'success');
  };

  // Customer Contact & Profile state (Automatically persisted across orders)
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('snabtash_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          hasOrderedBefore: parsed.hasOrderedBefore ?? Boolean(parsed.phone && parsed.name),
        };
      }
    } catch {
      // ignore
    }
    return {
      name: '',
      phone: '',
      company: '',
      inn: '',
      email: '',
      hasOrderedBefore: false,
    };
  });

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('snabtash_profile', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Helper to normalize phone digits for flexible matching
  const normalizePhone = (phoneStr?: string): string => {
    return (phoneStr || '').replace(/\D/g, '');
  };

  // Filter orders belonging exclusively to the currently identified customer
  const customerOrders = useMemo(() => {
    const userPhoneDigits = normalizePhone(profile.phone);
    if (!userPhoneDigits || userPhoneDigits.length < 7) {
      return [];
    }
    const last7 = userPhoneDigits.slice(-7);
    return requests.filter((ord) => {
      const ordPhoneDigits = normalizePhone(ord.contact?.phone);
      if (!ordPhoneDigits) return false;
      return ordPhoneDigits.endsWith(last7) || userPhoneDigits.endsWith(ordPhoneDigits.slice(-7));
    });
  }, [requests, profile.phone]);

  // Customer B2B Phone Login / Identification
  const loginCustomer = async (phone: string, company?: string, name?: string, inn?: string): Promise<boolean> => {
    const cleanPhone = phone.trim();
    if (!cleanPhone) return false;

    try {
      // 1. Lookup existing customer records from Django API
      const lookupRes = await api.lookupCustomer(cleanPhone);
      let customerName = name || '';
      let customerCompany = company || '';
      let customerInn = inn || '';

      if (lookupRes.found && lookupRes.customer) {
        customerName = customerName || lookupRes.customer.name || '';
        customerCompany = customerCompany || lookupRes.customer.company || '';
        customerInn = customerInn || lookupRes.customer.inn || '';
      }

      // 2. Save profile
      updateProfile({
        phone: cleanPhone,
        name: customerName,
        company: customerCompany,
        inn: customerInn,
        hasOrderedBefore: true,
      });

      // 3. Fetch orders for this customer from backend
      try {
        const remoteOrders = await api.getOrders({ phone: cleanPhone });
        if (Array.isArray(remoteOrders) && remoteOrders.length > 0) {
          setRequests((prev) => {
            const existingIds = new Set(prev.map((o) => String(o.id)));
            const newOrders = remoteOrders.filter((o) => !existingIds.has(String(o.id)));
            return [...newOrders, ...prev];
          });
        }
      } catch (ordErr) {
        console.warn('Could not fetch customer orders from server:', ordErr);
      }

      showToast(`Xush kelibsiz! ${customerCompany ? customerCompany + ' hisobi' : cleanPhone} faollashtirildi`, 'success');
      return true;
    } catch (err) {
      console.error('Customer login error:', err);
      // Local fallback
      updateProfile({
        phone: cleanPhone,
        name: name || '',
        company: company || '',
        inn: inn || '',
        hasOrderedBefore: true,
      });
      showToast('Hisob faollashtirildi', 'success');
      return true;
    }
  };

  const logoutCustomer = () => {
    setProfile({
      name: '',
      phone: '',
      company: '',
      inn: '',
      email: '',
      hasOrderedBefore: false,
    });
    try {
      localStorage.removeItem('snabtash_profile');
    } catch {}
    showToast('Hisobdan chiqildi', 'info');
  };

  // Auto-sync customer orders on mount or when profile.phone changes
  useEffect(() => {
    const clean = normalizePhone(profile.phone);
    if (clean.length >= 7) {
      api.getOrders({ phone: profile.phone }).then((remoteOrders) => {
        if (Array.isArray(remoteOrders) && remoteOrders.length > 0) {
          setRequests((prev) => {
            const existingIds = new Set(prev.map((o) => String(o.id)));
            const newOrders = remoteOrders.filter((o) => !existingIds.has(String(o.id)));
            return [...newOrders, ...prev];
          });
        }
      }).catch((err) => console.log('Auto order sync note:', err));
    }
  }, [profile.phone]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`✓ ${product.name} savatga qo‘shildi`, 'success');
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      showToast(`${item.product.name} savatdan olib tashlandi`, 'info');
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  // Favorites operations
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Mahsulot sevimlilardan olib tashlandi', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('♡ Sevimlilarga saqlandi', 'success');
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Submit request from checkout
  const submitRequest = (orderData: Omit<RequestOrder, 'id' | 'date' | 'status'>) => {
    const newId = (Math.floor(1000 + Math.random() * 9000)).toString();
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(
      today.getMonth() + 1
    ).padStart(2, '0')}.${today.getFullYear()}`;

    const newOrder: RequestOrder = {
      ...orderData,
      id: newId,
      date: formattedDate,
      status: 'Ko‘rib chiqilmoqda',
    };

    setRequests((prev) => [newOrder, ...prev]);
    clearCart();

    // Automatically remember contact details and activate customer session
    if (orderData.contact && orderData.contact.phone) {
      updateProfile({
        name: orderData.contact.name || '',
        phone: orderData.contact.phone || '',
        company: orderData.contact.company || '',
        inn: orderData.contact.inn || '',
        hasOrderedBefore: true,
      });
    }

    // Sync with Django REST API
    api.createOrder({
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      contact: orderData.contact,
    }).then((createdServerOrder) => {
      if (createdServerOrder && createdServerOrder.id) {
        setRequests((prev) => prev.map((ord) => (ord.id === newId ? createdServerOrder : ord)));
      }
    }).catch((err) => console.log('API create order warning:', err));

    return newOrder;
  };

  // Search and Drawer States
  const [searchQuery, setSearchQuery] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('q') || '';
    } catch {
      return '';
    }
  });
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Admin Auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('snabtash_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const loginAdmin = async (login: string, pass: string): Promise<boolean> => {
    const cleanLogin = login.trim().toLowerCase();
    if ((cleanLogin === 'admin' && pass === 'admin123') || (cleanLogin === 'admin' && pass === 'admin')) {
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem('snabtash_admin_auth', 'true');
      } catch {
        // ignore
      }
      showToast('Xush kelibsiz! Boshqaruv paneliga muvaffaqiyatli kirildi', 'success');
      return true;
    }
    showToast('Login yoki parol noto‘g‘ri', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem('snabtash_admin_auth');
    } catch {
      // ignore
    }
    navigate('/admin/login');
    showToast('Tizimdan muvaffaqiyatli chiqildi', 'info');
  };

  // Backup & Permanent Recovery
  const exportBackupJSON = () => {
    try {
      const backupData = {
        app: 'snabtash-marketplace',
        version: '1.1',
        exportedAt: new Date().toISOString(),
        productsCount: products.length,
        sectionsCount: showcaseSections.length,
        ordersCount: requests.length,
        products,
        categories,
        showcaseSections,
        banners,
        partners,
        requests,
        orders: requests,
        siteSettings,
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `snabtash_database_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`✓ Barcha ma'lumotlar zaxira fayli yuklab olindi (${products.length} ta tovar, ${requests.length} ta zayavka)`, 'success');
    } catch (err: any) {
      showToast(`Xatolik: Zaxira faylini yaratib bo'lmadi (${err.message})`, 'error');
    }
  };

  const importBackupJSON = async (jsonData: any): Promise<boolean> => {
    try {
      if (!jsonData || typeof jsonData !== 'object') {
        throw new Error('Fayl formati noto‘g‘ri (JSON kutilgan)');
      }

      let restoredProducts = 0;
      let restoredSections = 0;
      let restoredOrders = 0;

      if (Array.isArray(jsonData.products) && jsonData.products.length > 0) {
        setProducts(jsonData.products);
        try {
          localStorage.setItem('snabtash_admin_products', JSON.stringify(jsonData.products));
          localStorage.setItem('snabtash_products_archive', JSON.stringify(jsonData.products));
        } catch {}
        restoredProducts = jsonData.products.length;

        // Sync to backend in batches
        jsonData.products.forEach((p: any) => {
          api.createProduct({
            ...p,
            category_id: p.categoryId,
            images_list: p.images,
          } as any).catch(() => {});
        });
      }

      if (Array.isArray(jsonData.showcaseSections) && jsonData.showcaseSections.length > 0) {
        setShowcaseSections(jsonData.showcaseSections);
        try {
          localStorage.setItem('snabtash_showcase_sections', JSON.stringify(jsonData.showcaseSections));
          localStorage.setItem('snabtash_sections_archive', JSON.stringify(jsonData.showcaseSections));
        } catch {}
        restoredSections = jsonData.showcaseSections.length;

        jsonData.showcaseSections.forEach((s: any) => {
          api.createShowcaseSection(s).catch(() => {});
        });
      }

      const incomingRequests = jsonData.requests || jsonData.orders;
      if (Array.isArray(incomingRequests) && incomingRequests.length > 0) {
        setRequests(incomingRequests);
        try {
          localStorage.setItem('snabtash_requests', JSON.stringify(incomingRequests));
        } catch {}
        restoredOrders = incomingRequests.length;
      }

      if (Array.isArray(jsonData.categories) && jsonData.categories.length > 0) {
        setCategories(jsonData.categories);
        try {
          localStorage.setItem('snabtash_admin_categories', JSON.stringify(jsonData.categories));
        } catch {}
      }

      if (Array.isArray(jsonData.banners) && jsonData.banners.length > 0) {
        setBanners(jsonData.banners);
        try {
          localStorage.setItem('snabtash_admin_banners', JSON.stringify(jsonData.banners));
        } catch {}
      }

      if (jsonData.siteSettings && typeof jsonData.siteSettings === 'object') {
        setSiteSettings(jsonData.siteSettings);
        try {
          localStorage.setItem('snabtash_site_settings', JSON.stringify(jsonData.siteSettings));
        } catch {}
      }

      updateArchiveStats();
      notifySync();
      showToast(`✓ Zaxiradan muvaffaqiyatli tiklandi: ${restoredProducts} ta tovar, ${restoredOrders} ta zayavka, ${restoredSections} ta bo'lim`, 'success');
      return true;
    } catch (err: any) {
      showToast(`Xatolik: Zaxirani tiklashda xatolik yuz berdi (${err.message})`, 'error');
      return false;
    }
  };

  const restoreFromArchive = async () => {
    try {
      const pRaw = localStorage.getItem('snabtash_products_archive');
      const sRaw = localStorage.getItem('snabtash_sections_archive');
      let pCount = 0;
      let sCount = 0;

      if (pRaw) {
        const parsedP = JSON.parse(pRaw);
        if (Array.isArray(parsedP) && parsedP.length > 0) {
          setProducts(parsedP);
          localStorage.setItem('snabtash_admin_products', pRaw);
          pCount = parsedP.length;
          parsedP.forEach((p: any) => {
            api.createProduct({
              ...p,
              category_id: p.categoryId,
              images_list: p.images,
            } as any).catch(() => {});
          });
        }
      }

      if (sRaw) {
        const parsedS = JSON.parse(sRaw);
        if (Array.isArray(parsedS) && parsedS.length > 0) {
          setShowcaseSections(parsedS);
          localStorage.setItem('snabtash_showcase_sections', sRaw);
          sCount = parsedS.length;
          parsedS.forEach((s: any) => {
            api.createShowcaseSection(s).catch(() => {});
          });
        }
      }

      updateArchiveStats();
      notifySync();
      showToast(`✓ Arxivdan ${pCount} ta tovar va ${sCount} ta bo'lim tiklandi!`, 'success');
    } catch (err: any) {
      showToast(`Arxivdan tiklashda xatolik: ${err.message}`, 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts,
        toggleProductStock,
        resetProductsToDefault,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        resetDefaultBanners,
        showcaseSections,
        addShowcaseSection,
        updateShowcaseSection,
        deleteShowcaseSection,
        resetDefaultShowcaseSections,
        partners,
        addPartner,
        updatePartner,
        deletePartner,
        resetDefaultPartners,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotal,
        favorites,
        toggleFavorite,
        isFavorite,
        requests,
        submitRequest,
        updateRequestStatus,
        deleteRequest,
        addManualRequest,
        siteSettings,
        updateSiteSettings,
        profile,
        updateProfile,
        loginCustomer,
        logoutCustomer,
        customerOrders,
        toast,
        showToast,
        searchQuery,
        setSearchQuery,
        isCatalogOpen,
        setIsCatalogOpen,
        isMobileFilterOpen,
        setIsMobileFilterOpen,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        language,
        setLanguage,
        t,
        getProductName,
        getCategoryName,
        getProductDesc,
        getProductTag,
        formatUnit,
        exportBackupJSON,
        importBackupJSON,
        restoreFromArchive,
        archiveStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
