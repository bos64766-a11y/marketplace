/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { api } from '../../services/api';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
  CheckCircle2,
  Eye,
  ArrowRight,
  Layers,
  Sparkles,
  UploadCloud,
  Loader2,
  Link as LinkIcon,
  FolderHeart,
  Check,
  RotateCcw,
} from 'lucide-react';
import type { BannerSlide } from '../../types';

const IMAGE_PRESETS = [
  {
    name: 'Asosiy B2B Paket',
    url: '/hero-supply-pack.jpg',
  },
  {
    name: 'Ombor & Logistika',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'Professional Klining',
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'Himoya & Xavfsizlik',
    url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'B2B Rasmiy Shartnoma',
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&auto=format&fit=crop&q=80',
  },
];

const LINK_PRESETS = [
  { label: 'Katalog (/catalog)', value: '/catalog' },
  { label: 'Maishiy kimyo (/catalog/maishiy-kimyo)', value: '/catalog/maishiy-kimyo' },
  { label: 'Himoya vositalari (/catalog/himoya-vositalari)', value: '/catalog/himoya-vositalari' },
  { label: 'Xo‘jalik mollari (/catalog/xojalik-mollari)', value: '/catalog/xojalik-mollari' },
  { label: 'Zayavka qoldirish (/request)', value: '/request' },
  { label: 'To‘lov va yetkazish (/delivery-payment)', value: '/delivery-payment' },
  { label: 'Aloqa markazi (/contacts)', value: '/contacts' },
];

export const AdminBanners: React.FC = () => {
  const { banners, addBanner, updateBanner, deleteBanner, resetDefaultBanners, navigate } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerSlide | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);
  const [previewBanner, setPreviewBanner] = useState<BannerSlide | null>(null);

  // Upload States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [imageTab, setImageTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState<Omit<BannerSlide, 'id'>>({
    badge: 'KORXONALAR UCHUN',
    title: '',
    description: '',
    btnText: 'Katalogni ko‘rish',
    btnLink: '/catalog',
    image: '/hero-supply-pack.jpg',
    imageAlt: '',
    order: banners.length + 1,
    isActive: true,
  });

  const openAddModal = () => {
    setEditingBanner(null);
    setUploadError('');
    setImageTab('upload');
    setFormData({
      badge: 'YANGI TAKLIF',
      title: '',
      description: '',
      btnText: 'Katalogni ko‘rish',
      btnLink: '/catalog',
      image: '/hero-supply-pack.jpg',
      imageAlt: '',
      order: banners.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (banner: BannerSlide) => {
    setEditingBanner(banner);
    setUploadError('');
    setImageTab(banner.image?.startsWith('/media/') ? 'upload' : 'upload');
    setFormData({
      badge: banner.badge || 'KORXONALAR UCHUN',
      title: banner.title || '',
      description: banner.description || banner.subtitle || '',
      btnText: banner.btnText || banner.ctaText || 'Katalogni ko‘rish',
      btnLink: banner.btnLink || banner.ctaLink || '/catalog',
      image: banner.image || '/hero-supply-pack.jpg',
      imageAlt: banner.imageAlt || banner.title || '',
      order: banner.order ?? 1,
      isActive: banner.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Check size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Fayl hajmi 10MB dan oshmasligi kerak');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const res = await api.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        image: res.url,
        imageAlt: prev.imageAlt || file.name.replace(/\.[^/.]+$/, ''),
      }));
    } catch (err: any) {
      setUploadError(err.message || 'Rasm yuklashda xatolik yuz berdi');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return;

    if (editingBanner) {
      await updateBanner(editingBanner.id, formData);
    } else {
      await addBanner(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string | number) => {
    await deleteBanner(id);
    setDeleteConfirmId(null);
  };

  const toggleActive = async (banner: BannerSlide) => {
    await updateBanner(banner.id, { isActive: !banner.isActive });
  };

  const activeCount = banners.filter((b) => b.isActive !== false).length;

  return (
    <AdminLayout activeTab="banners">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight">
              Bannerlar Boshqaruvi
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium">
              Bosh sahifadagi qahramon (hero) slaydlariga kompyuterdan rasm yuklash, alishtirish va o‘chirish
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Saytda ko‘rish</span>
            </button>
            <button
              id="btn-add-banner"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF5A00] hover:bg-[#E54A00] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FF5A00]/25 transition-all cursor-pointer active:scale-97"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Banner Qo‘shish</span>
            </button>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-[#F1F5F9] shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#94A3B8] uppercase">Jami Bannerlar</p>
              <p className="text-xl font-black text-[#1E293B] mt-0.5">{banners.length} ta</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-[#FF5A00] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#F1F5F9] shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#94A3B8] uppercase">Faol Slaydlar</p>
              <p className="text-xl font-black text-[#10B981] mt-0.5">{activeCount} ta</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#F1F5F9] shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#94A3B8] uppercase">Rasm formati</p>
              <p className="text-xl font-black text-[#64748B] mt-0.5">JPG, PNG, WEBP</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5A00] flex items-center justify-center font-bold">
              <UploadCloud className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Banners List */}
        <div className="space-y-4">
          {banners.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#F1F5F9] shadow-2xs">
              <ImageIcon className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#1E293B]">Hozircha bannerlar mavjud emas</h3>
              <p className="text-xs text-[#64748B] mt-1">Yangi banner qo‘shishingiz yoki standart namunalarni tiklashingiz mumkin</p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={openAddModal}
                  className="px-4 py-2.5 bg-[#FF5A00] hover:bg-[#e04f00] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Banner qo‘shish</span>
                </button>
                <button
                  onClick={resetDefaultBanners}
                  className="px-4 py-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Standart namunalarni tiklash</span>
                </button>
              </div>
            </div>
          ) : (
            banners.map((banner, index) => {
              const isActive = banner.isActive !== false;
              const desc = banner.description || banner.subtitle || '';
              const btn = banner.btnText || banner.ctaText || 'Katalogni ko‘rish';
              const link = banner.btnLink || banner.ctaLink || '/catalog';
              const isUploaded = banner.image?.startsWith('/media/');

              return (
                <div
                  key={banner.id}
                  className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-2xs hover:shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 ${
                    isActive ? 'border-[#E2E8F0]' : 'border-dashed border-[#CBD5E1] opacity-75'
                  }`}
                >
                  {/* Left: Order index & Image Thumbnail */}
                  <div className="flex items-center gap-3.5 shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-xs font-black text-[#64748B]">
                      #{index + 1}
                    </div>
                    <div className="w-20 h-16 sm:w-28 sm:h-20 rounded-xl bg-[#FFF8F4] border border-[#FF5A00]/20 overflow-hidden flex items-center justify-center p-1 relative group">
                      <img
                        src={banner.image || '/hero-supply-pack.jpg'}
                        alt={banner.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/hero-supply-pack.jpg';
                        }}
                      />
                      {isUploaded && (
                        <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[9px] font-bold px-1 rounded shadow-xs">
                          Yuklangan
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle: Content details */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFF7ED] border border-[#FF5A00]/25 text-[10px] font-extrabold text-[#FF5A00] uppercase tracking-wider">
                        {banner.badge || 'KORXONALAR UCHUN'}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {isActive ? 'Faol' : 'Nofaol'}
                      </span>
                      {isUploaded && (
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Serverda saqlangan rasm
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-[#1E293B] truncate">
                      {banner.title}
                    </h3>
                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      {desc}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF5A00] bg-[#FFF7ED] px-2 py-0.5 rounded">
                        Tugma: <b>{btn}</b> → <i>{link}</i>
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions or Inline Delete Confirm */}
                  {deleteConfirmId === banner.id ? (
                    <div className="flex items-center gap-2 bg-red-50 p-2 rounded-2xl border border-red-200 self-end lg:self-center shrink-0 animate-in fade-in">
                      <span className="text-xs font-bold text-red-700 px-1">O‘chirilsinmi?</span>
                      <button
                        id={`btn-confirm-delete-${banner.id}`}
                        onClick={() => handleDelete(banner.id)}
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        Ha, o‘chirish
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                      >
                        Bekor qilish
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                      {/* Toggle Active Button */}
                      <button
                        onClick={() => toggleActive(banner)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          isActive
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                        title={isActive ? 'Nofaol qilish' : 'Faollashtirish'}
                      >
                        {isActive ? 'Faol' : 'Nofaol'}
                      </button>

                      {/* Preview Button */}
                      <button
                        onClick={() => setPreviewBanner(banner)}
                        className="p-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                        title="Slayd ko‘rinishini tekshirish"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit / Replace Button */}
                      <button
                        id={`btn-edit-banner-${banner.id}`}
                        onClick={() => openEditModal(banner)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FF5A00]/10 hover:bg-[#FF5A00] text-[#FF5A00] hover:text-white text-xs font-bold transition-all cursor-pointer"
                        title="Alishtirish / Tahrirlash"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Alishtirish</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        id={`btn-delete-banner-${banner.id}`}
                        onClick={() => setDeleteConfirmId(banner.id)}
                        className="p-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white transition-colors cursor-pointer"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal: Add or Edit / Replace Banner with File Upload */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#F1F5F9] my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
                <div>
                  <h3 className="text-lg font-black text-[#1E293B]">
                    {editingBanner ? 'Bannerni Alishtirish / Tahrirlash' : 'Yangi Banner Qo‘shish'}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Bosh sahifadagi qahramon (hero) slayd ma’lumotlarini to‘ldiring va rasm yuklang
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 pt-5">
                {/* Live Preview Card */}
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                    Jonli Ko‘rinish (Oldindan Ko‘rish)
                  </label>
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white via-[#FFFBF8] to-[#F8FAFC] border border-[#FF5A00]/20 shadow-xs flex items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFF7ED] border border-[#FF5A00]/20 text-[#FF5A00] font-extrabold text-[10px] uppercase">
                        {formData.badge || 'BADGE'}
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-[#1E293B] truncate">
                        {formData.title || 'Sarlavha kiritilmagan'}
                      </h4>
                      <p className="text-xs text-[#64748B] line-clamp-2">
                        {formData.description || 'Tavsif matni...'}
                      </p>
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF5A00] text-white text-xs font-bold shadow-xs">
                          <span>{formData.btnText || 'Katalogni ko‘rish'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                    <div className="w-24 h-20 sm:w-32 sm:h-24 rounded-xl bg-white border border-[#E2E8F0] p-1 flex items-center justify-center shrink-0 overflow-hidden relative">
                      <img
                        src={formData.image || '/hero-supply-pack.jpg'}
                        alt={formData.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/hero-supply-pack.jpg';
                        }}
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-[#FF5A00] animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sarlavha & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1.5">
                      Sarlavha *
                    </label>
                    <input
                      id="input-banner-title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Masalan: Kompleks ta’minot yechimi"
                      className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF5A00] focus:bg-white text-xs sm:text-sm font-semibold text-[#0F172A] transition-all focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1.5">
                      Badge Matni (Kichik tegi)
                    </label>
                    <input
                      id="input-banner-badge"
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="KORXONALAR UCHUN, 100% RASMIY..."
                      className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF5A00] focus:bg-white text-xs sm:text-sm font-semibold text-[#0F172A] transition-all focus:outline-none"
                    />
                  </div>
                </div>

                {/* Tavsif */}
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1.5">
                    Tavsif (Batafsil matn) *
                  </label>
                  <textarea
                    id="input-banner-desc"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Biz sizning biznesingizga kerakli barcha mahsulotlarni bir joyda jamlaymiz..."
                    className="w-full p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF5A00] focus:bg-white text-xs sm:text-sm font-medium text-[#0F172A] transition-all focus:outline-none resize-none"
                  />
                </div>

                {/* Tugma matni & havolasi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1.5">
                      Tugma Matni
                    </label>
                    <input
                      id="input-banner-btn-text"
                      type="text"
                      value={formData.btnText}
                      onChange={(e) => setFormData({ ...formData, btnText: e.target.value })}
                      placeholder="Katalogni ko‘rish, Zayavka qoldirish..."
                      className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF5A00] focus:bg-white text-xs sm:text-sm font-semibold text-[#0F172A] transition-all focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1.5">
                      Tugma Havolasi
                    </label>
                    <div className="space-y-1.5">
                      <input
                        id="input-banner-btn-link"
                        type="text"
                        value={formData.btnLink}
                        onChange={(e) => setFormData({ ...formData, btnLink: e.target.value })}
                        placeholder="/catalog yoki /request"
                        className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF5A00] focus:bg-white text-xs sm:text-sm font-semibold text-[#0F172A] transition-all focus:outline-none"
                      />
                      <div className="flex flex-wrap gap-1">
                        {LINK_PRESETS.slice(0, 4).map((lp) => (
                          <button
                            type="button"
                            key={lp.value}
                            onClick={() => setFormData({ ...formData, btnLink: lp.value })}
                            className={`text-[10px] px-2 py-0.5 rounded cursor-pointer transition-colors ${
                              formData.btnLink === lp.value
                                ? 'bg-[#FF5A00] text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {lp.label.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── BANNER RASMI UPLOAD & TANLASH ─── */}
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#1E293B]">
                      Banner Rasmi
                    </label>

                    {/* Mode Selector Tabs */}
                    <div className="flex items-center bg-white p-1 rounded-xl border border-[#E2E8F0] gap-1">
                      <button
                        type="button"
                        id="tab-mode-upload"
                        onClick={() => setImageTab('upload')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          imageTab === 'upload'
                            ? 'bg-[#FF5A00] text-white shadow-xs'
                            : 'text-[#64748B] hover:text-[#0F172A]'
                        }`}
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Fayl Yuklash</span>
                      </button>
                      <button
                        type="button"
                        id="tab-mode-preset"
                        onClick={() => setImageTab('preset')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          imageTab === 'preset'
                            ? 'bg-[#FF5A00] text-white shadow-xs'
                            : 'text-[#64748B] hover:text-[#0F172A]'
                        }`}
                      >
                        <FolderHeart className="w-3.5 h-3.5" />
                        <span>Tayyor Rasmlar</span>
                      </button>
                      <button
                        type="button"
                        id="tab-mode-url"
                        onClick={() => setImageTab('url')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          imageTab === 'url'
                            ? 'bg-[#FF5A00] text-white shadow-xs'
                            : 'text-[#64748B] hover:text-[#0F172A]'
                        }`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>URL</span>
                      </button>
                    </div>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="input-file-banner-upload"
                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />

                  {/* TAB 1: FILE UPLOAD ZONE */}
                  {imageTab === 'upload' && (
                    <div>
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all bg-white ${
                          isDragging
                            ? 'border-[#FF5A00] bg-[#FFF7ED]'
                            : 'border-[#CBD5E1] hover:border-[#FF5A00] hover:bg-[#FFFBF8]'
                        }`}
                      >
                        {isUploading ? (
                          <div className="py-4 space-y-2">
                            <Loader2 className="w-8 h-8 text-[#FF5A00] animate-spin mx-auto" />
                            <p className="text-xs font-bold text-[#1E293B]">Rasm serverga yuklanmoqda...</p>
                            <p className="text-[11px] text-[#94A3B8]">Biroz kuting</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#FF5A00] flex items-center justify-center mx-auto shadow-2xs border border-[#FF5A00]/20">
                              <UploadCloud className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-bold text-[#1E293B]">
                                Rasmni bu yerga tashlang yoki <span className="text-[#FF5A00] underline">tanlang</span>
                              </p>
                              <p className="text-[11px] text-[#64748B] mt-0.5">
                                PNG, JPG, WEBP, SVG • 10MB gacha
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Current Image Status & Info */}
                      {formData.image && (
                        <div className="mt-3 flex items-center justify-between bg-white p-3 rounded-xl border border-[#E2E8F0]">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-0.5 shrink-0 overflow-hidden">
                              <img
                                src={formData.image}
                                alt="Preview"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#1E293B] truncate max-w-[280px]">
                                {formData.image}
                              </p>
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                                <Check className="w-3 h-3" />
                                Rasm tayyor
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#FF5A00] hover:bg-[#FFF7ED] transition-colors cursor-pointer shrink-0"
                          >
                            Alishtirish
                          </button>
                        </div>
                      )}

                      {uploadError && (
                        <p className="text-xs text-red-600 font-semibold mt-2 bg-red-50 p-2.5 rounded-xl border border-red-200">
                          {uploadError}
                        </p>
                      )}
                    </div>
                  )}

                  {/* TAB 2: TAYYOR PRESETLAR */}
                  {imageTab === 'preset' && (
                    <div className="space-y-2">
                      <p className="text-[11px] text-[#64748B]">B2B ta'minot uchun moslashtirilgan sifatli rasmlardan birini tanlang:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {IMAGE_PRESETS.map((preset) => (
                          <button
                            type="button"
                            key={preset.url}
                            onClick={() => setFormData({ ...formData, image: preset.url })}
                            className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border flex items-center gap-3 bg-white ${
                              formData.image === preset.url
                                ? 'border-[#FF5A00] ring-2 ring-[#FF5A00]/20 bg-[#FFFBF8]'
                                : 'border-[#E2E8F0] hover:border-[#FF5A00]/40'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-12 h-10 object-contain rounded-lg bg-slate-50 p-0.5 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-[#1E293B] truncate">{preset.name}</p>
                              <p className="text-[10px] text-[#94A3B8] truncate">{preset.url}</p>
                            </div>
                            {formData.image === preset.url && (
                              <Check className="w-4 h-4 text-[#FF5A00] shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: URL ORQALI */}
                  {imageTab === 'url' && (
                    <div className="space-y-2">
                      <p className="text-[11px] text-[#64748B]">Internetdagi rasmning to‘g‘ridan-to‘g‘ri havolasini kiriting:</p>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://images.unsplash.com/... yoki /hero-supply-pack.jpg"
                        className="w-full h-11 px-4 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#FF5A00] text-xs sm:text-sm font-medium text-[#0F172A] transition-all focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Tartib raqami & Faollik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1.5">
                      Tartib Raqami
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                      className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF5A00] focus:bg-white text-xs sm:text-sm font-semibold text-[#0F172A] transition-all focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      id="checkbox-banner-active"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 accent-[#FF5A00] rounded cursor-pointer"
                    />
                    <label htmlFor="checkbox-banner-active" className="text-xs font-bold text-[#334155] cursor-pointer">
                      Slayderda ko‘rsatilsin (Faol holatda)
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  id="btn-save-banner"
                  type="button"
                  onClick={handleSave}
                  disabled={!formData.title.trim() || isUploading}
                  className="px-6 py-2.5 rounded-xl bg-[#FF5A00] hover:bg-[#E54A00] text-white text-xs font-bold shadow-md shadow-[#FF5A00]/25 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingBanner ? 'O‘zgarishlarni Saqlash' : 'Bannerni Qo‘shish'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Delete Confirmation */}
        {deleteConfirmId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-[#F1F5F9] animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-[#1E293B]">Bannerni o‘chirmoqchimisiz?</h3>
              <p className="text-xs text-[#64748B] mt-1.5">
                Ushbu slayd bosh sahifadagi qahramon slayderidan to‘liq o‘chiriladi.
              </p>

              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  id="btn-confirm-delete-banner"
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Ha, o‘chirilsin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Full Preview */}
        {previewBanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#F1F5F9] animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <h4 className="text-sm font-bold text-[#1E293B]">Bosh sahifadagi to‘liq ko‘rinishi</h4>
                <button
                  onClick={() => setPreviewBanner(null)}
                  className="p-1 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 rounded-3xl bg-gradient-to-br from-white via-[#FFFBF8] to-[#F8FAFC] border border-[#E5EAF2] p-6 sm:p-10 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7 space-y-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#FF5A00]/20 text-[#FF5A00] font-extrabold text-[11px] uppercase">
                      {previewBanner.badge || 'KORXONALAR UCHUN'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#1E293B]">
                      {previewBanner.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                      {previewBanner.description || previewBanner.subtitle}
                    </p>
                    <div className="pt-2">
                      <button className="bg-[#FF5A00] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl inline-flex items-center gap-2 shadow-md shadow-[#FF5A00]/25">
                        <span>{previewBanner.btnText || previewBanner.ctaText || 'Katalogni ko‘rish'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-5 flex items-center justify-center">
                    <img
                      src={previewBanner.image || '/hero-supply-pack.jpg'}
                      alt={previewBanner.title}
                      className="max-h-52 object-contain drop-shadow-md"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setPreviewBanner(null)}
                  className="px-4 py-2 bg-[#1E293B] text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
