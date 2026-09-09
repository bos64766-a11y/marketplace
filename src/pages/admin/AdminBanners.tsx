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
  Eye,
  ArrowRight,
  UploadCloud,
  Loader2,
  Link as LinkIcon,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import type { BannerSlide } from '../../types';

const LINK_PRESETS = [
  { label: 'Katalog (/catalog)', value: '/catalog' },
  { label: 'Maishiy kimyo (/catalog/maishiy-kimyo)', value: '/catalog/maishiy-kimyo' },
  { label: 'Himoya vositalari (/catalog/himoya-vositalari)', value: '/catalog/himoya-vositalari' },
  { label: 'Kantselyariya (/catalog/kanselyariya)', value: '/catalog/kanselyariya' },
  { label: 'Xo‘jalik mollari (/catalog/xojalik-mollari)', value: '/catalog/xojalik-mollari' },
  { label: 'Zayavka qoldirish (/request)', value: '/request' },
  { label: 'Aloqa markazi (/contacts)', value: '/contacts' },
];

const PRESET_BANNERS = [
  {
    name: 'Tozalik yechimlari aksiyasi (SNABTASH)',
    url: '/banners/banner-clean-promo.png',
  },
  {
    name: 'Asosiy B2B Paket',
    url: '/hero-supply-pack.jpg',
  },
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
    title: '',
    image: '/banners/banner-clean-promo.png',
    btnLink: '/catalog',
    order: (banners?.length || 0) + 1,
    isActive: true,
  });

  const openAddModal = () => {
    setEditingBanner(null);
    setUploadError('');
    setImageTab('upload');
    setFormData({
      title: '',
      image: '/banners/banner-clean-promo.png',
      btnLink: '/catalog',
      order: (banners?.length || 0) + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (banner: BannerSlide) => {
    setEditingBanner(banner);
    setUploadError('');
    setImageTab('upload');
    setFormData({
      title: banner.title || '',
      image: banner.image || '/banners/banner-clean-promo.png',
      btnLink: banner.btnLink || banner.ctaLink || '/catalog',
      order: banner.order ?? 1,
      isActive: banner.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Fayl hajmi 15MB dan oshmasligi kerak');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const res = await api.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        image: res.url,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
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
    if (!formData.image.trim()) {
      setUploadError('Iltimos, banner rasmini yuklang');
      return;
    }

    const payload = {
      ...formData,
      title: (formData.title || '').trim() || 'Grafik Banner',
    };

    if (editingBanner) {
      await updateBanner(editingBanner.id, payload);
    } else {
      await addBanner(payload);
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

  const activeCount = (banners || []).filter((b) => b.isActive !== false).length;

  return (
    <AdminLayout activeTab="banners">
      <div className="space-y-6">
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#E2E8F0] shadow-2xs">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FF5A00]/10 flex items-center justify-center text-[#FF5A00]">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#1E293B]">
                  Bosh sahifa bannerlari
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] font-medium mt-0.5">
                  Grafik bannerlarni yuklash va boshqarish (barcha matn va aksiyalar rasm ichida bo‘ladi)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={openAddModal}
              id="btn-add-banner"
              className="bg-[#FF5A00] hover:bg-[#e04f00] text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-[#FF5A00]/25 transition-all flex items-center gap-2 cursor-pointer active:scale-97"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Banner Yuklash</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#1E293B] border border-[#E2E8F0] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-[#64748B]" />
              <span>Saytda ko‘rish</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Jami bannerlar</span>
              <p className="text-2xl font-black text-[#1E293B] mt-1">{banners?.length || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-black">
              {banners?.length || 0}
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Faol bannerlar</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              {activeCount}
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Format</span>
              <p className="text-sm font-extrabold text-[#FF5A00] mt-1">To‘liq grafik rasm (Mobil moslashuvchan)</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-[#FF5A00] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Banners List */}
        <div className="space-y-4">
          {!banners || banners.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-[#CBD5E1] p-12 text-center">
              <div className="w-16 h-16 rounded-3xl bg-[#FFF7ED] text-[#FF5A00] flex items-center justify-center mx-auto mb-4 border border-[#FF5A00]/20">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#1E293B]">Hozircha bannerlar mavjud emas</h3>
              <p className="text-xs text-[#64748B] mt-1">Yangi grafik banner yuklang yoki standart namunani tiklang</p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={openAddModal}
                  className="px-4 py-2.5 bg-[#FF5A00] hover:bg-[#e04f00] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Banner yuklash</span>
                </button>
                <button
                  onClick={resetDefaultBanners}
                  className="px-4 py-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Standart namunani tiklash</span>
                </button>
              </div>
            </div>
          ) : (
            banners.map((banner, index) => {
              const isActive = banner.isActive !== false;
              const link = banner.btnLink || banner.ctaLink || '/catalog';
              const isUploaded = banner.image?.startsWith('/media/');

              return (
                <div
                  key={banner.id}
                  className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-2xs hover:shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 ${
                    isActive ? 'border-[#E2E8F0]' : 'border-dashed border-[#CBD5E1] opacity-75'
                  }`}
                >
                  {/* Left: Order index & Wide Banner Thumbnail */}
                  <div className="flex items-center gap-4 shrink-0 w-full lg:w-auto">
                    <div className="w-8 h-8 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-xs font-black text-[#64748B] shrink-0">
                      #{banner.order ?? index + 1}
                    </div>
                    <div className="w-48 sm:w-64 aspect-[2.4/1] rounded-xl bg-[#FFF8F4] border border-[#FF5A00]/20 overflow-hidden flex items-center justify-center relative group shrink-0">
                      <img
                        src={banner.image || '/banners/banner-clean-promo.png'}
                        alt={banner.title || 'Banner'}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/banners/banner-clean-promo.png';
                        }}
                      />
                      {isUploaded && (
                        <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                          Serverda yuklangan
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle: Content details */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {isActive ? 'Faol (Saytda ko‘rinadi)' : 'Nofaol'}
                      </span>
                      <span className="text-[10px] text-[#64748B] bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        Tartib: #{banner.order ?? index + 1}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-[#1E293B] truncate">
                      {banner.title || `Grafik Banner #${index + 1}`}
                    </h3>

                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-lg">
                        <LinkIcon className="w-3.5 h-3.5 text-[#FF5A00]" />
                        <span>Bosganda o‘tish:</span>
                        <b className="text-[#1E293B]">{link}</b>
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
                        title="To‘liq o‘lchamda ko‘rish"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit / Replace Button */}
                      <button
                        id={`btn-edit-banner-${banner.id}`}
                        onClick={() => openEditModal(banner)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FF5A00]/10 hover:bg-[#FF5A00] text-[#FF5A00] hover:text-white text-xs font-bold transition-all cursor-pointer"
                        title="Rasmni alishtirish"
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

        {/* Modal: Add or Edit Pure Image Banner */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-[#F1F5F9] my-6 animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#1E293B]">
                    {editingBanner ? 'Bannerni alishtirish' : 'Yangi grafik banner yuklash'}
                  </h3>
                  <p className="text-xs text-[#64748B] font-medium mt-0.5">
                    Faqat rasm yuklanadi. Saytda kompyuter va telefonlarda avtomatik moslashadi.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="space-y-5 pt-5">
                {/* 1. UPLOAD IMAGE ZONE (PRIMARY) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#1E293B]">
                      Banner Rasmi (Tavsiya etiladi: 1200x500 yoki 1280x550) *
                    </label>

                    {/* Mode Selector Tabs */}
                    <div className="flex items-center bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0] gap-1">
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
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Namuna</span>
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
                        className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all bg-white ${
                          isDragging
                            ? 'border-[#FF5A00] bg-[#FFF7ED]'
                            : 'border-[#CBD5E1] hover:border-[#FF5A00] hover:bg-[#FFFBF8]'
                        }`}
                      >
                        {isUploading ? (
                          <div className="py-5 space-y-2">
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
                              <p className="text-sm font-bold text-[#1E293B]">
                                Rasmni bu yerga tashlang yoki <span className="text-[#FF5A00] underline">tanlang</span>
                              </p>
                              <p className="text-xs text-[#64748B] mt-0.5">
                                PNG, JPG, WEBP • 15MB gacha
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: PRESET BANNERS */}
                  {imageTab === 'preset' && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 gap-2">
                        {PRESET_BANNERS.map((preset) => (
                          <button
                            type="button"
                            key={preset.url}
                            onClick={() => setFormData({ ...formData, image: preset.url, title: preset.name })}
                            className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border flex items-center gap-3 bg-white ${
                              formData.image === preset.url
                                ? 'border-[#FF5A00] ring-2 ring-[#FF5A00]/20 bg-[#FFFBF8]'
                                : 'border-[#E2E8F0] hover:border-[#FF5A00]/40'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-20 h-10 object-cover rounded-lg bg-slate-50 shrink-0"
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

                  {/* TAB 3: URL INPUT */}
                  {imageTab === 'url' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://... yoki /banners/banner-clean-promo.png"
                        className="w-full h-11 px-4 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#FF5A00] text-xs sm:text-sm font-medium text-[#0F172A] transition-all focus:outline-none"
                      />
                    </div>
                  )}

                  {uploadError && (
                    <p className="text-xs text-red-600 font-semibold bg-red-50 p-2.5 rounded-xl border border-red-200">
                      {uploadError}
                    </p>
                  )}

                  {/* Live Banner Preview inside Modal */}
                  {formData.image && (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
                        <span>Saytdagi ko‘rinishi (Jonli oldindan ko‘rish):</span>
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Rasm tanlangan
                        </span>
                      </div>
                      <div className="w-full rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xs bg-slate-50">
                        <img
                          src={formData.image}
                          alt="Live Preview"
                          className="w-full h-auto object-cover block"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/banners/banner-clean-promo.png';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. LINK INPUT (WHERE BANNER LEADS) */}
                <div>
                  <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                    Havola (Bannerni bosganda ochiladigan sahifa)
                  </label>
                  <div className="space-y-2">
                    <input
                      id="input-banner-btn-link"
                      type="text"
                      value={formData.btnLink}
                      onChange={(e) => setFormData({ ...formData, btnLink: e.target.value })}
                      placeholder="/catalog/maishiy-kimyo yoki /catalog"
                      className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF5A00] focus:bg-white text-xs sm:text-sm font-semibold text-[#0F172A] transition-all focus:outline-none"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {LINK_PRESETS.map((lp) => (
                        <button
                          type="button"
                          key={lp.value}
                          onClick={() => setFormData({ ...formData, btnLink: lp.value })}
                          className={`text-[11px] px-2.5 py-1 rounded-lg cursor-pointer transition-colors font-medium ${
                            formData.btnLink === lp.value
                              ? 'bg-[#FF5A00] text-white font-bold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {lp.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. OPTIONAL NAME & ORDER */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1.5">
                      Banner Nomi (Admin paneldagi eslatma)
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Masalan: Tozalik yechimlari aksiyasi"
                      className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF5A00] focus:bg-white text-xs sm:text-sm font-semibold text-[#0F172A] transition-all focus:outline-none"
                    />
                  </div>

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
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="checkbox-banner-active"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 accent-[#FF5A00] rounded cursor-pointer"
                  />
                  <label htmlFor="checkbox-banner-active" className="text-xs font-bold text-[#334155] cursor-pointer">
                    Slayderda faol ko‘rsatilsin
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-5 mt-6 border-t border-[#F1F5F9]">
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
                  disabled={!formData.image || isUploading}
                  className="px-6 py-2.5 rounded-xl bg-[#FF5A00] hover:bg-[#E54A00] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FF5A00]/25 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingBanner ? 'O‘zgarishlarni Saqlash' : 'Bannerni Saqlash'}</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border border-[#F1F5F9] animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B]">
                    {previewBanner.title || 'Grafik Banner'}
                  </h4>
                  <p className="text-xs text-[#64748B]">
                    Havola: {previewBanner.btnLink || previewBanner.ctaLink || '/catalog'}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewBanner(null)}
                  className="p-1 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 rounded-2xl overflow-hidden border border-[#E5EAF2] shadow-sm bg-slate-50">
                <img
                  src={previewBanner.image || '/banners/banner-clean-promo.png'}
                  alt={previewBanner.title || 'Banner'}
                  className="w-full h-auto object-contain block"
                />
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setPreviewBanner(null)}
                  className="px-5 py-2 bg-[#1E293B] text-white rounded-xl text-xs font-bold cursor-pointer"
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
