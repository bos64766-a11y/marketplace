import { Product, Category, RequestOrder, SiteSettings, BannerSlide, HomeShowcaseSection, Partner } from '../types';

const API_BASE = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errMsg = `API error: ${response.status} ${response.statusText}`;
    try {
      const errData = await response.json();
      errMsg = errData.message || errData.error || JSON.stringify(errData);
    } catch {
      // ignore
    }
    throw new Error(errMsg);
  }

  // 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // --- PRODUCTS ---
  getProducts: async (params?: Record<string, string>): Promise<Product[]> => {
    const searchParams = new URLSearchParams(params);
    const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request<Product[]>(`/products/${queryStr}`);
  },

  getProduct: async (id: string): Promise<Product> => {
    return request<Product>(`/products/${id}/`);
  },

  createProduct: async (data: Partial<Product>): Promise<Product> => {
    return request<Product>('/products/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    return request<Product>(`/products/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteProduct: async (id: string): Promise<void> => {
    return request<void>(`/products/${id}/`, {
      method: 'DELETE',
    });
  },

  toggleStock: async (id: string): Promise<{ id: string; inStock: boolean; message: string }> => {
    return request<{ id: string; inStock: boolean; message: string }>(`/products/${id}/toggle-stock/`, {
      method: 'POST',
    });
  },

  // --- CATEGORIES ---
  getCategories: async (): Promise<Category[]> => {
    return request<Category[]>('/categories/');
  },

  createCategory: async (data: Partial<Category>): Promise<Category> => {
    return request<Category>('/categories/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCategory: async (slug: string, data: Partial<Category>): Promise<Category> => {
    return request<Category>(`/categories/${slug}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteCategory: async (slug: string): Promise<void> => {
    return request<void>(`/categories/${slug}/`, {
      method: 'DELETE',
    });
  },

  // --- ORDERS / ZAYAVKALAR ---
  getOrders: async (params?: Record<string, string>): Promise<RequestOrder[]> => {
    const searchParams = new URLSearchParams(params);
    const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request<RequestOrder[]>(`/orders/${queryStr}`);
  },

  createOrder: async (payload: {
    items: { product: any; quantity: number }[];
    totalAmount: number;
    contact: {
      name: string;
      phone: string;
      company?: string;
      inn?: string;
      comment?: string;
    };
  }): Promise<RequestOrder> => {
    return request<RequestOrder>('/orders/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateOrderStatus: async (id: string, newStatus: string): Promise<{ id: string; status: string; message: string }> => {
    return request<{ id: string; status: string; message: string }>(`/orders/${id}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
  },

  deleteOrder: async (id: string): Promise<void> => {
    return request<void>(`/orders/${id}/`, {
      method: 'DELETE',
    });
  },

  lookupCustomer: async (phone: string): Promise<{ found: boolean; customer?: any; message?: string }> => {
    return request<{ found: boolean; customer?: any; message?: string }>(`/customer/lookup/?phone=${encodeURIComponent(phone)}`);
  },

  // --- SITE SETTINGS ---
  getSettings: async (): Promise<SiteSettings> => {
    return request<SiteSettings>('/settings/');
  },

  updateSettings: async (data: Partial<SiteSettings>): Promise<SiteSettings> => {
    return request<SiteSettings>('/settings/', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // --- BANNERS ---
  getBanners: async (activeOnly = false): Promise<BannerSlide[]> => {
    const q = activeOnly ? '?active=true' : '';
    return request<BannerSlide[]>(`/banners/${q}`);
  },

  createBanner: async (data: Partial<BannerSlide>): Promise<BannerSlide> => {
    return request<BannerSlide>('/banners/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateBanner: async (id: string | number, data: Partial<BannerSlide>): Promise<BannerSlide> => {
    return request<BannerSlide>(`/banners/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteBanner: async (id: string | number): Promise<void> => {
    return request<void>(`/banners/${id}/`, {
      method: 'DELETE',
    });
  },

  // --- SHOWCASE SECTIONS (Biz kimlar uchun xizmat qilamiz) ---
  getShowcaseSections: async (activeOnly = false): Promise<HomeShowcaseSection[]> => {
    const q = activeOnly ? '?active=true' : '';
    return request<HomeShowcaseSection[]>(`/showcase-sections/${q}`);
  },

  createShowcaseSection: async (data: Partial<HomeShowcaseSection>): Promise<HomeShowcaseSection> => {
    return request<HomeShowcaseSection>('/showcase-sections/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateShowcaseSection: async (id: string | number, data: Partial<HomeShowcaseSection>): Promise<HomeShowcaseSection> => {
    return request<HomeShowcaseSection>(`/showcase-sections/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteShowcaseSection: async (id: string | number): Promise<void> => {
    return request<void>(`/showcase-sections/${id}/`, {
      method: 'DELETE',
    });
  },

  // --- PARTNERS (Hamkor brendlar) ---
  getPartners: async (): Promise<Partner[]> => {
    const data = await request<any[]>('/partners/');
    return data.map((p) => ({
      id: String(p.id),
      name: p.name,
      logo: p.logo || '',
      category: p.category || '',
      order: p.order ?? 0,
    }));
  },

  createPartner: async (data: Partial<Partner>): Promise<Partner> => {
    const p = await request<any>('/partners/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return {
      id: String(p.id),
      name: p.name,
      logo: p.logo || '',
      category: p.category || '',
      order: p.order ?? 0,
    };
  },

  updatePartner: async (id: string | number, data: Partial<Partner>): Promise<Partner> => {
    const p = await request<any>(`/partners/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return {
      id: String(p.id),
      name: p.name,
      logo: p.logo || '',
      category: p.category || '',
      order: p.order ?? 0,
    };
  },

  deletePartner: async (id: string | number): Promise<void> => {
    return request<void>(`/partners/${id}/`, {
      method: 'DELETE',
    });
  },

  // --- FILE UPLOAD ---
  uploadImage: async (file: File, type: 'products' | 'banners' | 'categories' | 'uploads' = 'uploads'): Promise<{ url: string; filename: string; original_name?: string; size?: number }> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`/api/upload/?type=${type}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let msg = 'Rasm yuklashda xatolik yuz berdi';
      try {
        const err = await response.json();
        msg = err.error || err.message || err.detail || msg;
      } catch {
        try {
          const text = await response.text();
          if (text) msg = text.slice(0, 120);
        } catch {}
      }
      throw new Error(msg);
    }

    return response.json();
  },

  // --- DASHBOARD ANALYTICS ---
  getAnalyticsDashboard: async (): Promise<any> => {
    return request<any>('/analytics/dashboard/');
  },
};
