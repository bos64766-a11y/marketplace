import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, Category, CartItem, RequestOrder, UserProfile, ToastNotification, SiteSettings, BannerSlide, HomeShowcaseSection, Partner, Language } from '../types';
import { translations, Translations } from '../i18n/translations';
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

  // User Profile
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;

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
  getCategoryName: (category: Category) => string;
  getProductDesc: (product: Product) => string;
  getProductTag: (product: Product) => string | undefined;
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
    image: '/banners/banner-clean-promo.png',
    btnLink: '/catalog/maishiy-kimyo',
    order: 1,
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

  const getCategoryName = (c: Category): string => {
    if (language === 'ru' && c.name_ru?.trim()) {
      return c.name_ru.trim();
    }
    return c.name;
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

  // Dynamic Products state (persisted to localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('snabtash_admin_products');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Load initial live data from Django API on startup
  useEffect(() => {
    let isMounted = true;

    api.getProducts().then((data) => {
      if (isMounted && data && data.length > 0) setProducts(data);
    }).catch(() => {});

    api.getCategories().then((data) => {
      if (isMounted && data && data.length > 0) setCategories(data);
    }).catch(() => {});

    api.getOrders().then((data) => {
      if (isMounted && data && data.length > 0) setRequests(data);
    }).catch(() => {});

    api.getSettings().then((data) => {
      if (isMounted && data && data.companyName) setSiteSettings(data);
    }).catch(() => {});

    api.getBanners().then((data) => {
      if (isMounted && Array.isArray(data)) {
        setBanners(data);
        try {
          localStorage.setItem('snabtash_admin_banners', JSON.stringify(data));
        } catch {}
      }
    }).catch(() => {});

    api.getShowcaseSections().then((data) => {
      if (isMounted && Array.isArray(data)) {
        setShowcaseSections(data);
        try {
          localStorage.setItem('snabtash_showcase_sections', JSON.stringify(data));
        } catch {}
      }
    }).catch(() => {});

    api.getPartners().then((data) => {
      if (isMounted && Array.isArray(data)) {
        setPartners(data);
        try {
          localStorage.setItem('snabtash_partners', JSON.stringify(data));
        } catch {}
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

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

    const newProduct: Product = {
      ...productData,
      id: tempId,
      sku: generatedSku,
      slug: generatedSlug,
    };

    setProducts((prev) => [newProduct, ...prev]);

    try {
      const serverProduct = await api.createProduct({
        ...newProduct,
        sku: generatedSku,
        slug: generatedSlug,
        category_id: newProduct.categoryId,
        images_list: newProduct.images,
      } as any);

      if (serverProduct && serverProduct.id) {
        setProducts((prev) =>
          prev.map((p) => (p.id === tempId ? { ...newProduct, ...serverProduct } : p))
        );
        showToast(`✓ Yangi mahsulot "${serverProduct.name}" muvaffaqiyatli saqlandi`, 'success');
        return serverProduct;
      }
    } catch (err: any) {
      console.warn('API product create warning (saqlanmoqda):', err);
      showToast(`✓ Yangi mahsulot "${newProduct.name}" qo‘shildi`, 'success');
    }

    return newProduct;
  };

  const updateProduct = async (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    try {
      await api.updateProduct(id, {
        ...updated,
        category_id: updated.categoryId,
        images_list: updated.images,
      } as any);
      showToast('✓ Mahsulot ma’lumotlari muvaffaqiyatli yangilandi', 'success');
    } catch (err) {
      console.warn('API product update warning:', err);
      showToast('✓ Mahsulot ma’lumotlari yangilandi', 'success');
    }
  };

  const deleteProduct = async (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await api.deleteProduct(id);
    } catch (err) {
      console.warn('API product delete warning:', err);
    }
    showToast(`Mahsulot "${target?.name || id}" o‘chirildi`, 'info');
  };

  const toggleProductStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
    api.toggleStock(id).catch((err) => console.log('API sync warning:', err));
    showToast('Ombor holati yangilandi', 'info');
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    showToast('Mahsulotlar asl holatiga qaytarildi', 'info');
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
    } catch (err) {
      console.warn('API category update warning:', err);
      showToast('Kategoriya yangilandi', 'success');
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    try {
      await api.deleteCategory(id);
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
      showToast('✓ Banner muvaffaqiyatli yangilandi', 'success');
    } catch (err) {
      console.log('API banner update error, using local fallback:', err);
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
      setShowcaseSections((prev) => {
        const next = [...prev, created];
        try {
          localStorage.setItem('snabtash_showcase_sections', JSON.stringify(next));
        } catch {}
        return next;
      });
      showToast('✓ Yangi bo‘lim muvaffaqiyatli qo‘shildi', 'success');
    } catch (err) {
      console.log('API showcase create error, using local fallback:', err);
      const newSec: HomeShowcaseSection = { ...data, id: `section-${Date.now()}` };
      setShowcaseSections((prev) => {
        const next = [...prev, newSec];
        try {
          localStorage.setItem('snabtash_showcase_sections', JSON.stringify(next));
        } catch {}
        return next;
      });
      showToast('✓ Yangi bo‘lim saqlandi', 'success');
    }
  };

  const updateShowcaseSection = async (id: string | number, updated: Partial<HomeShowcaseSection>) => {
    const idStr = String(id);
    setShowcaseSections((prev) => {
      const next = prev.map((s) => (String(s.id) === idStr ? { ...s, ...updated } : s));
      try {
        localStorage.setItem('snabtash_showcase_sections', JSON.stringify(next));
      } catch {}
      return next;
    });

    try {
      const saved = await api.updateShowcaseSection(id, updated);
      if (saved && saved.id) {
        setShowcaseSections((prev) => prev.map((s) => (String(s.id) === idStr ? saved : s)));
      }
    } catch (err) {
      console.log('API showcase update error, using local state:', err);
    }
    showToast('Bo‘lim maʼlumotlari yangilandi', 'info');
  };

  const deleteShowcaseSection = async (id: string | number) => {
    const idStr = String(id);
    setShowcaseSections((prev) => {
      const next = prev.filter((s) => String(s.id) !== idStr);
      try {
        localStorage.setItem('snabtash_showcase_sections', JSON.stringify(next));
      } catch {}
      return next;
    });

    try {
      await api.deleteShowcaseSection(id);
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
    api.updateSettings(updated).catch((err) => console.log('API sync warning:', err));
    showToast('✓ Sayt sozlamalari muvaffaqiyatli saqlandi', 'success');
  };

  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('snabtash_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    const initialProduct1 = INITIAL_PRODUCTS[0];
    const initialProduct2 = INITIAL_PRODUCTS[1];
    return [
      { product: initialProduct1, quantity: 3 },
      { product: initialProduct2, quantity: 5 },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('snabtash_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Favorites state persisted to localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('snabtash_favs');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['snb-gloves-orange', 'snb-grass-universal'];
  });

  useEffect(() => {
    try {
      localStorage.setItem('snabtash_favs', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  // Requests state (Zayavkalar with rich initial B2B demo requests for analytics)
  const [requests, setRequests] = useState<RequestOrder[]>(() => {
    try {
      const saved = localStorage.getItem('snabtash_requests');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: '1042',
        date: '28.08.2026',
        items: [
          { product: INITIAL_PRODUCTS[0], quantity: 20 },
          { product: INITIAL_PRODUCTS[1], quantity: 15 },
          { product: INITIAL_PRODUCTS[3], quantity: 10 },
        ],
        totalAmount: 1850000,
        status: 'Ko‘rib chiqilmoqda',
        contact: {
          name: 'Javohir Toshmatov',
          phone: '+998 90 987 65 43',
          company: 'Universal Logistic MCHJ',
          inn: '308912445',
          comment: 'Shoshilinch yetkazib berish kerak, e-faktura yuboring',
        },
      },
      {
        id: '1041',
        date: '28.08.2026',
        items: [
          { product: INITIAL_PRODUCTS[2], quantity: 12 },
          { product: INITIAL_PRODUCTS[4], quantity: 8 },
        ],
        totalAmount: 740000,
        status: 'Tasdiqlangan',
        contact: {
          name: 'Shahlo Karimova',
          phone: '+998 93 512 34 56',
          company: 'Grand Med Klinika',
          inn: '304871922',
          comment: 'Gigiyena vositalari sertifikati bilan birga',
        },
      },
      {
        id: '1040',
        date: '27.08.2026',
        items: [
          { product: INITIAL_PRODUCTS[5], quantity: 50 },
          { product: INITIAL_PRODUCTS[0], quantity: 40 },
        ],
        totalAmount: 3250000,
        status: 'Yetkazilmoqda',
        contact: {
          name: 'Ulug‘bek Rustamov',
          phone: '+998 97 123 88 99',
          company: 'Tashkent City Hotel',
          inn: '301982733',
          comment: 'Omborxona qabul qiladi, yuk xati ilova qilinsin',
        },
      },
      {
        id: '1039',
        date: '26.08.2026',
        items: [
          { product: INITIAL_PRODUCTS[1], quantity: 10 },
          { product: INITIAL_PRODUCTS[2], quantity: 6 },
        ],
        totalAmount: 512000,
        status: 'Bajarildi',
        contact: {
          name: 'Nodirbek Quchqarov',
          phone: '+998 90 123 45 67',
          company: 'Artel R&D Center',
          inn: '305128941',
          comment: 'Didox orqali imzolandi',
        },
      },
      {
        id: '1038',
        date: '25.08.2026',
        items: [
          { product: INITIAL_PRODUCTS[3], quantity: 25 },
        ],
        totalAmount: 1125000,
        status: 'Bajarildi',
        contact: {
          name: 'Dilshod Aliyev',
          phone: '+998 91 333 22 11',
          company: 'Pepsi Bottlers Uzbekistan',
          inn: '302819002',
          comment: 'Muntazam oylik xarid',
        },
      },
    ];
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

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
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
