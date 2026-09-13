/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { api, getMediaUrl } from '../../services/api';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  FolderOpen,
  Package,
  UploadCloud,
  Loader2,
  Image as ImageIcon,
  Check,
  Link as LinkIcon,
} from 'lucide-react';
import type { Category } from '../../types';

const ICON_OPTIONS = [
  'Car', 'Sparkles', 'HeartHandshake', 'FileSpreadsheet', 'HardHat', 'Shirt',
  'Droplets', 'Brush', 'Shield', 'Wrench', 'Flame', 'Leaf',
];

export const AdminCategories: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [formData, setFormData] = useState<Category>({
    id: '',
    slug: '',
    name: '',
    name_ru: '',
    icon: 'Sparkles',
    image: '',
    description: '',
    description_ru: '',
    count: 0,
  });

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    const isImg = file.type.startsWith('image/') || /\.(jpe?g|png|webp|svg|gif|jfif|avif|heic|bmp)$/i.test(file.name);
    if (!isImg) {
      setUploadError('Faqat rasm formatidagi fayllarni yuklash mumkin (JPG, PNG, WEBP, JFIF)');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError('Fayl hajmi 20MB dan oshmasligi kerak');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    try {
      const res = await api.uploadImage(file, 'categories');
      setFormData((prev) => ({ ...prev, image: res.url }));
    } catch (err: any) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setUploadError('');
    setShowUrlInput(false);
    setFormData({
      id: '',
      slug: '',
      name: '',
      name_ru: '',
      icon: 'Sparkles',
      image: '',
      description: '',
      description_ru: '',
      count: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setUploadError('');
    setShowUrlInput(false);
    setFormData({
      ...cat,
      name_ru: cat.name_ru || '',
      description_ru: cat.description_ru || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const id = formData.id || slug;

    const catData: Category = {
      ...formData,
      id: editingCategory ? editingCategory.id : id,
      slug: editingCategory ? editingCategory.slug : slug,
    };

    if (editingCategory) {
      await updateCategory(editingCategory.id, catData);
    } else {
      await addCategory(catData);
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      await deleteCategory(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const getCategoryProductCount = (cat: Category): number => {
    return products.filter((p) => p.categoryId === cat.slug || p.categoryId === cat.id).length;
  };

  return (
    <AdminLayout activeTab="categories">
      <div className="space-y-5">
        {/* Header with Mockup Typography */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">Kategoriyalar Boshqaruvi</h1>
            <p className="text-xs font-medium text-[#94A3B8] mt-0.5">
              Katalog bo'limlari, guruhlar va mahsulotlar taqsimoti ({categories.length} ta)
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-bold transition-all shadow-md shadow-[#FF5A00]/25 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Yangi Kategoriya
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const productCount = getCategoryProductCount(cat);
            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl p-5 border border-[#F1F5F9] shadow-2xs hover:shadow-md transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3.5">
                  <div className="flex items-center gap-3">
                    {cat.image ? (
                      <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-[#E2E8F0] bg-[#F8FAFC] group-hover:scale-105 transition-transform flex items-center justify-center">
                        <img
                          src={getMediaUrl(cat.image)}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#FF5A00] flex items-center justify-center shrink-0 border border-[#FF5A00]/20 group-hover:scale-105 transition-transform">
                        <FolderOpen className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-[#1E293B]">{cat.name}</h3>
                      {cat.name_ru ? (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            RU: {cat.name_ru}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            RU nomi kiritilmagan
                          </span>
                        </div>
                      )}
                      <p className="text-[10px] font-medium text-[#94A3B8] mt-1">/{cat.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="w-8 h-8 rounded-xl bg-[#F8FAFC] hover:bg-[#FFF1E8] text-[#64748B] hover:text-[#FF5A00] flex items-center justify-center transition-colors cursor-pointer"
                      title="Tahrirlash"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(cat.id)}
                      className="w-8 h-8 rounded-xl bg-[#F8FAFC] hover:bg-[#FFE4E6] text-[#64748B] hover:text-[#E11D48] flex items-center justify-center transition-colors cursor-pointer"
                      title="O'chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2 mb-3.5">
                  {cat.description || "Ta'rif kiritilmagan"}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between pt-3 border-t border-[#F8FAFC]">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF7ED] text-[#FF5A00]">
                    <Package className="w-3.5 h-3.5" />
                    {productCount} mahsulot
                  </span>
                  <span className="text-[11px] font-medium text-[#94A3B8]">Icon: {cat.icon}</span>
                </div>

                {/* Image preview */}
                {cat.image && (
                  <div className="mt-3.5 h-24 rounded-xl overflow-hidden bg-[#F8FAFC] border border-[#F1F5F9]">
                    <img src={getMediaUrl(cat.image)} alt={cat.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                  </div>
                )}
              </div>
            );
          })}

          {categories.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FolderOpen className="w-10 h-10 text-[#CBD5E1] mx-auto mb-3" />
              <p className="text-xs text-[#94A3B8]">Hali kategoriya yo'q</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10">
            <div className="border-b border-[#E2E8F0] p-5 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0F172A]">
                {editingCategory ? 'Kategoriyani Tahrirlash' : 'Yangi Kategoriya'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4 text-[#64748B]" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Row: Category Name UZ & RU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Kategoriya nomi (O‘zbekcha) *</span>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">UZ</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors"
                    placeholder="Kategoriya nomi"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Kategoriya nomi (Ruscha)</span>
                    <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-bold">RU (ixtiyoriy)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name_ru || ''}
                    onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors"
                    placeholder="Название категории (на русском)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors"
                    placeholder="avtokimyo"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors cursor-pointer"
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
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
                    placeholder="Kategoriya haqida qisqacha..."
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
                    placeholder="Краткое описание на русском..."
                  />
                </div>
              </div>

              {/* Image Upload Zone */}
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Kategoriya Rasmi
                </label>

                {uploadError && (
                  <div className="mb-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                    {uploadError}
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                    e.target.value = '';
                  }}
                />

                {formData.image ? (
                  <div className="relative rounded-2xl border border-[#E2E8F0] p-3 bg-[#F8FAFC] flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#CBD5E1] bg-white shrink-0 flex items-center justify-center">
                      <img
                        src={getMediaUrl(formData.image)}
                        alt="Category Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1E293B] truncate">
                        {formData.image.split('/').pop()}
                      </p>
                      <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                        <Check className="w-3.5 h-3.5" /> Rasm yuklangan
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#475569] hover:text-[#FF5A00] text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                      >
                        Alishtirish
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                        className="w-8 h-8 rounded-lg bg-white border border-[#CBD5E1] text-[#EF4444] hover:bg-red-50 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleFileUpload(file);
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
                        <p className="text-xs font-bold text-[#1E293B]">Rasm yuklanmoqda...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5A00] flex items-center justify-center">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1E293B]">
                            Kompyuterdan rasm yuklash uchun bosing yoki sudrab keling
                          </p>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5">
                            Formatlar: JPG, PNG, WEBP, SVG (maks. 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Secondary URL toggle */}
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[#64748B] hover:text-[#FF5A00] font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>{showUrlInput ? 'URL kiritishni yashirish' : 'URL orqali rasm kiritish'}</span>
                  </button>
                </div>

                {showUrlInput && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors"
                      placeholder="https://example.com/category.jpg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-[#E2E8F0] p-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-bold transition-colors shadow-md shadow-[#FF5A00]/20 disabled:opacity-50 cursor-pointer"
              >
                {editingCategory ? 'Saqlash' : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full z-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5 text-[#EF4444]" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-1">Kategoriyani o'chirish</h3>
            <p className="text-xs text-[#64748B] mb-5">Shu kategoriyaga tegishli mahsulotlar ham ta'sirlanishi mumkin.</p>
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
    </AdminLayout>
  );
};
