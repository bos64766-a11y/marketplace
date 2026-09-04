export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  image?: string;
  imageUrl?: string;
  description: string;
  count: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  sku: string;
  rating: number;
  reviewsCount: number;
  price: number;
  oldPrice?: number;
  isPopular?: boolean;
  isNew?: boolean;
  tag?: string;
  inStock: boolean;
  stockCount?: number;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  unit: string;
  minOrder: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface RequestOrder {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Ko‘rib chiqilmoqda' | 'Tasdiqlangan' | 'Yetkazilmoqda' | 'Bajarildi';
  contact: {
    name: string;
    phone: string;
    company?: string;
    inn?: string;
    comment?: string;
  };
}

export interface UserProfile {
  name: string;
  phone: string;
  company: string;
  inn: string;
  email: string;
  hasOrderedBefore?: boolean;
}

export interface BannerSlide {
  id: string | number;
  title: string;
  badge?: string;
  description?: string;
  subtitle?: string;
  btnText?: string;
  ctaText?: string;
  btnLink?: string;
  ctaLink?: string;
  image: string;
  imageAlt?: string;
  bullets?: string[];
  tag?: string;
  order?: number;
  isActive?: boolean;
}

export interface Industry {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  slug?: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  category: string;
}

export interface BundlePackage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  itemsList: string;
  itemsCount: number;
  price: number;
  oldPrice?: number;
  image: string;
  tag?: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  comment: string;
}

export interface SiteSettings {
  companyName: string;
  phone1: string;
  phone2?: string;
  email: string;
  telegramBot: string;
  telegramChannel?: string;
  address: string;
  workHours: string;
  inn: string;
  mfo: string;
  bankAccount: string;
  bankName: string;
  freeDeliveryThreshold: number;
  deliveryCost: number;
  bannerHeadline: string;
  bannerSubtitle: string;
  bannerDiscountBadge: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}
