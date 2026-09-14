/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { api, getMediaUrl } from '../../services/api';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  ToggleLeft,
  ToggleRight,
  UploadCloud,
  Loader2,
  Image as ImageIcon,
  Star,
  Check,
  Link as LinkIcon,
  Download,
  HardDrive,
  RefreshCw,
} from 'lucide-react';
import type { Product } from '../../types';

const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const ITEMS_PER_PAGE = 15;

const EMPTY_PRODUCT: Omit<Product, 'id'> = {
  slug: '',
  name: '',
  name_ru: '',
  categoryId: '',
  categoryName: '',
  brand: '',
  sku: '',
  rating: 4.5,
  reviewsCount: 0,
  price: 0,
  inStock: true,
  images: [],
  description: '',
  description_ru: '',
  specifications: {},
  unit: 'dona',
  minOrder: 1,
  tag: '',
  tag_ru: '',
};

export const AdminProducts: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    toggleProductStock,
    exportBackupJSON,
    restoreFromArchive,
    archiveStats,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>(EMPTY_PRODUCT);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [dismissRescue, setDismissRescue] = useState(false);
  const [specsInput, setSpecsInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Multi-Image Upload States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [singleUrlInput, setSingleUrlInput] = useState('');

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);

    for (const f of fileList) {
      const isImg = f.type.startsWith('image/') || /\.(jpe?g|png|webp|svg|gif|jfif|avif|heic|bmp)$/i.test(f.name);
      if (!isImg) {
        setUploadError('Faqat rasm formatidagi fayllarni yuklash mumkin (JPG, PNG, WEBP, SVG, JFIF)');
        return;
      }
      if (f.size > 20 * 1024 * 1024) {
        setUploadError('Har bir fayl hajmi 20MB dan oshmasligi kerak');
        return;
      }
    }

    setIsUploading(true);
    setUploadError('');
    try {
      const uploadedUrls: string[] = [];
      for (const f of fileList) {
        try {
          const res = await api.uploadImage(f, 'products');
          uploadedUrls.push(res.url);
        } catch (apiErr: any) {
          console.warn('API upload failed, using local FileReader fallback:', apiErr);
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(f);
          });
          uploadedUrls.push(dataUrl);
        }
      }
      setFormData((prev) => {
        const nextImages = [...(prev.images || []), ...uploadedUrls];
        setImageUrlInput(nextImages.join('\n'));
        return { ...prev, images: nextImages };
      });
    } catch (err: any) {
      setUploadError(err.message || 'Rasm yuklashda xatolik yuz berdi');
    } finally {
      setIsUploading(false);
    }
  };

  const removeProductImage = (idxToRemove: number) => {
    setFormData((prev) => {
      const nextImages = (prev.images || []).filter((_, idx) => idx !== idxToRemove);
      setImageUrlInput(nextImages.join('\n'));
      return { ...prev, images: nextImages };
    });
  };

  const makePrimaryImage = (idxToPromote: number) => {
    setFormData((prev) => {
      const images = prev.images || [];
      const item = images[idxToPromote];
      if (!item) return prev;
      const nextImages = [item, ...images.filter((_, idx) => idx !== idxToPromote)];
      setImageUrlInput(nextImages.join('\n'));
      return { ...prev, images: nextImages };
    });
  };

  const addImageFromUrl = () => {
    const url = singleUrlInput.trim();
    if (!url) return;
    setFormData((prev) => {
      const nextImages = [...(prev.images || []), url];
      setImageUrlInput(nextImages.join('\n'));
      return { ...prev, images: nextImages };
    });
    setSingleUrlInput('');
  };

  // Filtered & paginated products
  const filteredProducts = useMemo(() => {
    let result = products;
    if (filterCategory !== 'all') {
      result = result.filter((p) => p.categoryId === filterCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.name_ru && p.name_ru.toLowerCase().includes(q)) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, filterCategory, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Open modal for add
  const openAddModal = () => {
    setEditingProduct(null);
    setUploadError('');
    setShowUrlInput(false);
    setSingleUrlInput('');
    setFormData(EMPTY_PRODUCT);
    setSpecsInput('');
    setImageUrlInput('');
    setIsModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setUploadError('');
    setShowUrlInput(false);
    setSingleUrlInput('');
    setFormData({
      slug: product.slug,
      name: product.name,
      name_ru: product.name_ru || '',
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      brand: product.brand,
      sku: product.sku,
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      price: product.price,
      oldPrice: product.oldPrice,
      inStock: product.inStock,
      images: product.images,
      description: product.description,
      description_ru: product.description_ru || '',
      specifications: product.specifications,
      unit: product.unit,
      minOrder: product.minOrder,
      isPopular: product.isPopular,
      isNew: product.isNew,
      tag: product.tag,
      tag_ru: product.tag_ru || '',
      stockCount: product.stockCount,
    });
    setSpecsInput(
      Object.entries(product.specifications || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n')
    );
    setImageUrlInput((product.images || []).join('\n'));
    setIsModalOpen(true);
  };

  // Save handler
  const handleSave = async () => {
    // Parse specs
    const specs: Record<string, string> = {};
    specsInput.split('\n').forEach((line) => {
      const [key, ...rest] = line.split(':');
      if (key?.trim() && rest.length > 0) {
        specs[key.trim()] = rest.join(':').trim();
      }
    });

    const images =
      formData.images && formData.images.length > 0
        ? formData.images
        : imageUrlInput
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean);

    const catObj = categories.find((c) => c.id === formData.categoryId || c.slug === formData.categoryId);

    const productData: Omit<Product, 'id'> = {
      ...formData,
      specifications: specs,
      images,
      categoryName: catObj?.name || formData.categoryName || '',
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch {
      // Modal ochiq qoladi, foydalanuvchi kiritgan ma'lumotlar yo'qolmaydi va xatolik ko'rinadi
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      await deleteProduct(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <AdminLayout activeTab="products">
      <div className="space-y-5">
        {/* Header with Mockup Typography */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">Mahsulotlar Boshqaruvi</h1>
            <p className="text-xs font-medium text-[#94A3B8] mt-0.5">
              Barcha tovarlar, narxlar va ombor holati ({products.length} ta mahsulot)
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {products.length > 0 && (
              <button
                onClick={() => setIsClearAllModalOpen(true)}
                title="Barcha mahsulotlarni o'chirish (tozalash)"
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl border border-rose-200 hover:border-rose-400 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Tozalash (0 ta qilish)</span>
              </button>
            )}
            <button
              onClick={exportBackupJSON}
              title="Barcha tovarlar zaxirasini yuklab olish"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-[#E2E8F0] hover:border-[#FF5A00] bg-white text-[#475569] hover:text-[#FF5A00] text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Zaxira (.json)</span>
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-bold transition-all shadow-md shadow-[#FF5A00]/25 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              Yangi Mahsulot
            </button>
          </div>
        </div>

        {/* Rescue Card if Archive has more products than active list and not dismissed */}
        {archiveStats.productsCount > products.length && !dismissRescue && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs relative">
            <div className="flex items-center gap-3 pr-8">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950">
                  Eski zaxirada {archiveStats.productsCount} ta mahsulot topildi (hozir ro'yxatda {products.length} ta)
                </h4>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Agar eski tovarlarni qaytarmoqchi bo'lsangiz tiklashingiz mumkin. Yangi tovarlarni noldan kiritayotgan bo'lsangiz buni yopib qo'yishingiz mumkin.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={restoreFromArchive}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Qayta Tiklash</span>
              </button>
              <button
                onClick={() => setDismissRescue(true)}
                className="px-3 py-2 rounded-xl bg-white border border-amber-300 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-all cursor-pointer"
                title="Yopish"
              >
                Yopish
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-[#F1F5F9] shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Jami Mahsulotlar</p>
              <p className="text-xl font-black text-[#FF5A00] mt-0.5">{products.length} ta</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] flex items-center justify-center">
              <Package className="w-5 h-5 text-[#FF5A00]" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#F1F5F9] shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Omborda Bor</p>
              <p className="text-xl font-black text-[#16A34A] mt-0.5">
                {products.filter((p) => p.inStock).length} ta
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#16A34A]">Mavjud</span>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#F1F5F9] shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Tugagan / Buyurtmaga</p>
              <p className="text-xl font-black text-[#E11D48] mt-0.5">
                {products.filter((p) => !p.inStock).length} ta
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFE4E6] text-[#E11D48]">Tugagan</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Nom, SKU yoki brend bo'yicha qidiring..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E2E8F0] text-xs font-medium text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A00] transition-colors"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors cursor-pointer"
          >
            <option value="all">Barcha kategoriyalar</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-2xs border border-[#F1F5F9] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Mahsulot</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">SKU</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Kategoriya</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider text-right">Narx</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider text-center">Ombor</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="border-b border-[#F8FAFC] hover:bg-[#FAFBFD] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden shrink-0 flex items-center justify-center">
                          {product.images?.[0] ? (
                            <img src={getMediaUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-[#94A3B8]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#0F172A] truncate max-w-[200px]">{product.name}</p>
                          {product.name_ru && (
                            <p className="text-[11px] text-[#64748B] truncate max-w-[200px] italic">RU: {product.name_ru}</p>
                          )}
                          <p className="text-[10px] font-medium text-[#94A3B8]">{product.brand || 'SNABTASH'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#64748B]">{product.sku}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#64748B]">{product.categoryName}</td>
                    <td className="px-4 py-3 text-xs font-black text-[#FF5A00] text-right whitespace-nowrap">
                      {formatPrice(product.price)} so'm
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleProductStock(product.id)}
                        className="cursor-pointer inline-flex items-center transition-transform active:scale-95"
                        title={product.inStock ? 'Holatni o‘zgartirish' : 'Holatni o‘zgartirish'}
                      >
                        {product.inStock ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#16A34A]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                            Omborda bor
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FFE4E6] text-[#E11D48]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
                            Tugagan
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(product)}
                          className="w-8 h-8 rounded-xl bg-[#F8FAFC] hover:bg-[#FFF1E8] text-[#64748B] hover:text-[#FF5A00] flex items-center justify-center transition-colors cursor-pointer"
                          title="Tahrirlash"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(product.id)}
                          className="w-8 h-8 rounded-xl bg-[#F8FAFC] hover:bg-[#FFE4E6] text-[#64748B] hover:text-[#E11D48] flex items-center justify-center transition-colors cursor-pointer"
                          title="O'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <Package className="w-8 h-8 text-[#CBD5E1] mx-auto mb-2" />
                      <p className="text-xs text-[#94A3B8]">Mahsulot topilmadi</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#F1F5F9]">
              <span className="text-[11px] text-[#94A3B8]">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} / {filteredProducts.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 text-[#475569]" />
                </button>
                <span className="px-3 text-xs font-bold text-[#0F172A]">{currentPage}</span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 text-[#475569]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center pt-8 sm:pt-16 px-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto z-10">
            <div className="sticky top-0 bg-white border-b border-[#E2E8F0] p-5 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="text-base font-bold text-[#0F172A]">
                {editingProduct ? 'Mahsulotni Tahrirlash' : "Yangi Mahsulot Qo'shish"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4 text-[#64748B]" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Row: Name (UZ) + Name (RU) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Mahsulot nomi (O‘zbekcha) *</span>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">UZ</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors"
                    placeholder="Mahsulot nomi"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Mahsulot nomi (Ruscha)</span>
                    <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-bold">RU (ixtiyoriy)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name_ru || ''}
                    onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors"
                    placeholder="Название товара (на русском)"
                  />
                </div>
              </div>

              {/* Row: SKU + Tag (UZ) + Tag (RU) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors"
                    placeholder="SNB-001"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Tag (UZ)</label>
                  <input
                    type="text"
                    value={formData.tag || ''}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors"
                    placeholder="Xit, Yangilik"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Tag (RU)</label>
                  <input
                    type="text"
                    value={formData.tag_ru || ''}
                    onChange={(e) => setFormData({ ...formData, tag_ru: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors"
                    placeholder="Хит, Новинка"
                  />
                </div>
              </div>

              {/* Row: Category + Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Kategoriya *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors cursor-pointer"
                  >
                    <option value="">Kategoriyani tanlang</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name} {cat.name_ru ? `(${cat.name_ru})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Brend</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors"
                    placeholder="Brend nomi"
                  />
                </div>
              </div>

              {/* Row: Price + Old Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Narx (so'm) *</label>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors"
                    placeholder="25000"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Eski narx</label>
                  <input
                    type="number"
                    value={formData.oldPrice || ''}
                    onChange={(e) => setFormData({ ...formData, oldPrice: Number(e.target.value) || undefined })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors"
                    placeholder="30000"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                    O'lchov Birligi
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors"
                    placeholder="dona / litr / kg"
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {[
                      { key: 'dona', label: 'dona (шт.)' },
                      { key: 'pachka', label: 'pachka (пач.)' },
                      { key: 'quti', label: 'quti (кор.)' },
                      { key: 'qadoq', label: 'qadoq (упак.)' },
                      { key: 'blok', label: 'blok (блок)' },
                      { key: 'rulon', label: 'rulon (рул.)' },
                      { key: 'juft', label: 'juft (пар)' },
                      { key: 'kanistra', label: 'kanistra (канистра)' },
                      { key: 'kg', label: 'kg (кг)' },
                      { key: 'litr', label: 'litr (л)' },
                      { key: 'to‘plam', label: 'to‘plam (компл.)' },
                      { key: 'metr', label: 'metr (м)' },
                    ].map((preset) => (
                      <button
                        key={preset.key}
                        type="button"
                        onClick={() => setFormData({ ...formData, unit: preset.key })}
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border transition-all cursor-pointer ${
                          formData.unit?.toLowerCase() === preset.key.toLowerCase()
                            ? 'bg-[#FF5A00] text-white border-[#FF5A00]'
                            : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Min Order + Stock toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Min buyurtma</label>
                  <input
                    type="number"
                    value={formData.minOrder}
                    onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors"
                    placeholder="1"
                  />
                </div>
                <div className="flex items-end gap-3 pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="w-4 h-4 rounded accent-[#FF5A00]"
                    />
                    <span className="text-xs font-semibold text-[#0F172A]">Omborda bor</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPopular || false}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="w-4 h-4 rounded accent-[#FF5A00]"
                    />
                    <span className="text-xs font-semibold text-[#0F172A]">Ommabop</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNew || false}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="w-4 h-4 rounded accent-[#FF5A00]"
                    />
                    <span className="text-xs font-semibold text-[#0F172A]">Yangi</span>
                  </label>
                </div>
              </div>

              {/* Descriptions: UZ & RU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Ta'rif (O‘zbekcha)</span>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">UZ</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors resize-none"
                    placeholder="Mahsulot haqida qisqacha..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Ta'rif (Ruscha)</span>
                    <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-bold">RU (ixtiyoriy)</span>
                  </label>
                  <textarea
                    value={formData.description_ru || ''}
                    onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors resize-none"
                    placeholder="Краткое описание товара на русском..."
                  />
                </div>
              </div>

              {/* Multi-Image Upload & Gallery */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Mahsulot Rasmlari ({formData.images?.length || 0} ta)
                  </label>
                  <span className="text-[10px] text-[#94A3B8]">
                    Birinchi rasm — asosiy muqova rasmi
                  </span>
                </div>

                {uploadError && (
                  <div className="mb-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                    {uploadError}
                  </div>
                )}

                {/* Hidden Multi-file Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.jfif,.avif,.heic"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handleFileUpload(e.target.files);
                    e.target.value = '';
                  }}
                />

                {/* Gallery of Uploaded Images */}
                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mb-3">
                    {formData.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-square rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] overflow-hidden shadow-2xs"
                      >
                        <img
                          src={getMediaUrl(imgUrl)}
                          alt={`Product preview ${idx + 1}`}
                          className="w-full h-full object-contain p-1"
                        />
                        {/* Primary Badge */}
                        {idx === 0 ? (
                          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-[#FF5A00] text-white text-[9px] font-black uppercase tracking-wider shadow-xs flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-white" /> Bosh
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => makePrimaryImage(idx)}
                            className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 px-1.5 py-0.5 rounded-md bg-white/90 hover:bg-white text-[#1E293B] text-[9px] font-bold shadow-xs transition-opacity cursor-pointer flex items-center gap-0.5"
                            title="Bosh rasm qilish"
                          >
                            <Star className="w-2.5 h-2.5 text-[#FF5A00]" /> Bosh qilish
                          </button>
                        )}

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => removeProductImage(idx)}
                          className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-xs transition-opacity cursor-pointer"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Drag & Drop Upload Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files) handleFileUpload(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#FF5A00] bg-orange-50/50'
                      : 'border-[#CBD5E1] hover:border-[#FF5A00]/50 hover:bg-[#F8FAFC]'
                  }`}
                >
                  {isUploading ? (
                    <div className="py-2 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-7 h-7 text-[#FF5A00] animate-spin" />
                      <p className="text-xs font-bold text-[#1E293B]">Rasmlar yuklanmoqda...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5A00] flex items-center justify-center">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1E293B]">
                          Kompyuterdan rasm yuklash uchun bosing yoki sudrab keling
                        </p>
                        <p className="text-[11px] text-[#94A3B8] mt-0.5">
                          Bir nechta rasm tanlashingiz mumkin (JPG, PNG, WEBP, SVG)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Secondary URL toggle */}
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[#64748B] hover:text-[#FF5A00] font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>{showUrlInput ? 'URL orqali qo‘shishni yashirish' : 'URL orqali rasm qo‘shish'}</span>
                  </button>
                </div>

                {showUrlInput && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={singleUrlInput}
                      onChange={(e) => setSingleUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addImageFromUrl();
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors"
                      placeholder="https://example.com/product-photo.jpg"
                    />
                    <button
                      type="button"
                      onClick={addImageFromUrl}
                      disabled={!singleUrlInput.trim()}
                      className="px-3.5 py-2 bg-[#FF5A00] hover:bg-[#e04f00] disabled:opacity-50 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0"
                    >
                      + Qo‘shish
                    </button>
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Xususiyatlar (kalit: qiymat formatida)
                </label>
                <textarea
                  value={specsInput}
                  onChange={(e) => setSpecsInput(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors resize-none font-mono"
                  placeholder={"Hajmi: 5L\nRangi: Shaffof\nIshlab chiqaruvchi: Grass"}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[#E2E8F0] p-5 flex items-center justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name.trim() || !formData.price}
                className="px-5 py-2.5 rounded-xl bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-bold transition-colors shadow-md shadow-[#FF5A00]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {editingProduct ? 'Saqlash' : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full z-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5 text-[#EF4444]" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-1">Mahsulotni o'chirish</h3>
            <p className="text-xs text-[#64748B] mb-5">Bu amalni ortga qaytarib bo'lmaydi. Davom ettirasizmi?</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
              >
                Yo'q
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Ha, o'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {isClearAllModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsClearAllModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full z-10 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-1">Barcha mahsulotlarni tozalash</h3>
            <p className="text-xs text-[#64748B] mb-5">
              Haqiqatan ham barcha {products.length} ta mahsulotni bazadan butunlay o'chirib, ro'yxatni 0 ta qilmoqchimisiz?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsClearAllModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={async () => {
                  setIsClearAllModalOpen(false);
                  await clearAllProducts();
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Ha, barchasini tozalash
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
