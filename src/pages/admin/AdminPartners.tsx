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
  UploadCloud,
  Loader2,
  Handshake,
  RotateCcw,
  Search,
  Check,
  Link as LinkIcon,
  Building2,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import type { Partner } from '../../types';

export const AdminPartners: React.FC = () => {
  const { partners, addPartner, updatePartner, deletePartner, resetDefaultPartners } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [formData, setFormData] = useState<Partner>({
    id: '',
    name: '',
    logo: '',
    category: '',
  });

  const filteredPartners = partners.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Faqat rasm formatidagi fayllarni yuklash mumkin (PNG, JPG, SVG, WEBP)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Fayl hajmi 10MB dan oshmasligi kerak');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    try {
      const res = await api.uploadImage(file);
      if (res && res.url) {
        setFormData((prev) => ({ ...prev, logo: res.url }));
      } else {
        throw new Error('URL olinmadi');
      }
    } catch {
      // Local Base64 fallback ensures immediate reliable local display & persistence
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const openAddModal = () => {
    setEditingPartner(null);
    setUploadError('');
    setShowUrlInput(false);
    setFormData({
      id: '',
      name: '',
      logo: '',
      category: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (partner: Partner) => {
    setEditingPartner(partner);
    setUploadError('');
    setShowUrlInput(false);
    setFormData({ ...partner });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingPartner) {
      await updatePartner(editingPartner.id, formData);
    } else {
      await addPartner({
        name: formData.name.trim(),
        logo: formData.logo.trim(),
        category: formData.category.trim(),
      });
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      await deletePartner(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleResetConfirm = async () => {
    await resetDefaultPartners();
    setIsResetConfirmOpen(false);
  };

  const partnersWithLogoCount = partners.filter((p) => Boolean(p.logo)).length;

  return (
    <AdminLayout activeTab="partners">
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7ED] text-[#FF5A00] text-xs font-bold mb-1.5 border border-[#FF5A00]/20">
              <Handshake className="w-3.5 h-3.5" />
              <span>Hamkor kompaniyalar karuseli</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">Hamkorlar Boshqaruvi</h1>
            <p className="text-xs font-medium text-[#94A3B8] mt-0.5">
              Bosh sahifadagi uzluksiz aylanuvchi hamkor brendlar va kompaniyalar ro‘yxati ({partners.length} ta)
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#475569] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Standart hamkorlar (Pepsi, Coca-Cola, Artel va boshqalar)ni qayta tiklash"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Standartga qaytarish</span>
            </button>

            <button
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi hamkor qo‘shish</span>
            </button>
          </div>
        </div>

        {/* Stats & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] text-[#FF5A00] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[20px] font-black text-[#1E293B] leading-none">{partners.length}</div>
              <div className="text-xs text-[#64748B] font-medium mt-1">Jami hamkorlar</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[20px] font-black text-[#1E293B] leading-none">{partnersWithLogoCount}</div>
              <div className="text-xs text-[#64748B] font-medium mt-1">Logotipli brendlar</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[20px] font-black text-[#1E293B] leading-none">
                {partners.length - partnersWithLogoCount}
              </div>
              <div className="text-xs text-[#64748B] font-medium mt-1">Matnli kartalar</div>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="bg-white rounded-2xl p-3 border border-[#E2E8F0] shadow-2xs">
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Hamkor nomi yoki sohasi bo‘yicha izlash (masalan: Pepsi, Qurilish)..."
              className="w-full pl-10 pr-4 py-2 text-xs font-medium text-[#1E293B] bg-[#F8FAFC] rounded-xl border border-transparent focus:border-[#FF5A00] focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#CBD5E1] p-4 flex flex-col items-center text-center transition-all shadow-2xs hover:shadow-md group relative"
            >
              {/* Actions Header */}
              <div className="w-full flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#64748B]">
                  {partner.logo ? 'Logotip bor' : 'Faqat nom'}
                </span>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(partner)}
                    className="w-7 h-7 rounded-lg bg-[#F8FAFC] hover:bg-[#FFF7ED] text-[#64748B] hover:text-[#FF5A00] flex items-center justify-center transition-colors cursor-pointer"
                    title="Tahrirlash"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(partner.id)}
                    className="w-7 h-7 rounded-lg bg-[#F8FAFC] hover:bg-red-50 text-[#64748B] hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Large Logo Display (matches home card) */}
              <div className="w-32 h-32 rounded-2xl bg-white p-2.5 flex items-center justify-center mb-3.5 overflow-hidden border border-[#E2E8F0] shadow-2xs">
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo-icon.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-[#FFF7ED] text-[#FF5A00] flex items-center justify-center font-black text-3xl">
                    {partner.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Company Info */}
              <h3 className="font-extrabold text-[#1E293B] text-[15px] line-clamp-1 leading-snug">
                {partner.name}
              </h3>
              <p className="text-xs text-[#64748B] font-medium mt-1 line-clamp-1">
                {partner.category || 'Soha ko‘rsatilmagan'}
              </p>

              {/* Edit Quick Link */}
              <button
                onClick={() => openEditModal(partner)}
                className="mt-4 w-full py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#FFF7ED] text-[#475569] hover:text-[#FF5A00] text-xs font-bold transition-colors border border-[#E2E8F0] cursor-pointer"
              >
                Tahrirlash
              </button>
            </div>
          ))}

          {/* Add Partner Card placeholder */}
          <button
            onClick={openAddModal}
            className="border-2 border-dashed border-[#CBD5E1] hover:border-[#FF5A00] rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all bg-white/60 hover:bg-[#FFF7ED]/30 min-h-[260px] cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#E2E8F0] text-[#94A3B8] group-hover:text-[#FF5A00] group-hover:border-[#FF5A00]/40 flex items-center justify-center mb-3 transition-colors shadow-2xs">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-sm text-[#1E293B] group-hover:text-[#FF5A00] transition-colors">
              Yangi hamkor qo‘shish
            </span>
            <span className="text-xs text-[#94A3B8] font-medium mt-1">
              Logotip yuklang yoki URL kiriting
            </span>
          </button>
        </div>

        {filteredPartners.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#E2E8F0] p-6">
            <p className="text-sm font-bold text-[#64748B]">Qidiruv bo‘yicha hech qanday hamkor topilmadi</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs font-bold text-[#FF5A00] hover:underline cursor-pointer"
            >
              Qidiruvni tozalash
            </button>
          </div>
        )}

        {/* Add / Edit Partner Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
                <div>
                  <h3 className="text-lg font-black text-[#1E293B]">
                    {editingPartner ? 'Hamkorni tahrirlash' : 'Yangi hamkor qo‘shish'}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Bosh sahifadagi hamkorlar karuselida ko‘rinadi
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#1E293B] mb-1.5">
                    Kompaniya / Brend nomi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Masalan: Pepsi, Coca-Cola, Artel Electronics"
                    className="w-full px-3.5 py-2.5 text-xs font-medium text-[#1E293B] bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] focus:border-[#FF5A00] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#1E293B] mb-1.5">
                    Soha / Kategoriya <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Masalan: Ichimliklar & Oziq-ovqat, Xalqaro brend, Maishiy texnika"
                    className="w-full px-3.5 py-2.5 text-xs font-medium text-[#1E293B] bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] focus:border-[#FF5A00] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                {/* Logo Upload Section */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-extrabold text-[#1E293B]">
                      Hamkor logotipi (Katta format)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="text-[11px] font-bold text-[#FF5A00] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <LinkIcon className="w-3 h-3" />
                      {showUrlInput ? 'Fayl yuklashga o‘tish' : 'URL orqali kiritish'}
                    </button>
                  </div>

                  {showUrlInput ? (
                    <div>
                      <input
                        type="text"
                        value={formData.logo}
                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        placeholder="https://example.com/logo.png yoki /partners/pepsi.png"
                        className="w-full px-3.5 py-2.5 text-xs font-medium text-[#1E293B] bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] focus:border-[#FF5A00] focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                  ) : (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                      />

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
                            ? 'border-[#FF5A00] bg-[#FFF7ED]'
                            : 'border-[#CBD5E1] hover:border-[#FF5A00] bg-[#FAFBFD]'
                        }`}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center justify-center py-3">
                            <Loader2 className="w-8 h-8 text-[#FF5A00] animate-spin mb-2" />
                            <span className="text-xs font-bold text-[#475569]">Rasm yuklanmoqda...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <UploadCloud className="w-9 h-9 text-[#94A3B8] mb-1.5" />
                            <span className="text-xs font-extrabold text-[#1E293B]">
                              Logotip rasmini tanlang yoki bu yerga tashlang
                            </span>
                            <span className="text-[11px] text-[#94A3B8] mt-0.5">
                              PNG, JPG, SVG yoki WEBP (Tavsiya: shaffof fonli yoki toza kvadrat)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {uploadError && (
                    <p className="text-xs text-red-600 font-bold mt-1.5">{uploadError}</p>
                  )}

                  {/* Logo Preview box (big size matching actual card) */}
                  {formData.logo && (
                    <div className="mt-3 p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-xl bg-white p-1.5 border border-[#E2E8F0] flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                          <img
                            src={formData.logo}
                            alt="Logo preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#1E293B] block">Logotip tayyor</span>
                          <span className="text-[11px] text-[#64748B] block truncate max-w-[200px]">
                            {formData.logo}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, logo: '' })}
                        className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] text-red-600 hover:bg-red-50 text-xs font-bold cursor-pointer"
                        title="Logotipni tozalash"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#475569] text-xs font-bold transition-all cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingPartner ? 'O‘zgarishlarni saqlash' : 'Hamkorni qo‘shish'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E2E8F0] text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-[#1E293B]">Hamkorni o‘chirishni tasdiqlaysizmi?</h3>
              <p className="text-xs text-[#64748B] mt-1">
                Ushbu hamkor bosh sahifadagi karuseldan butunlay olib tashlanadi.
              </p>
              <div className="flex items-center justify-center gap-2.5 mt-5">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-[#475569] text-xs font-bold hover:bg-[#F8FAFC] cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Ha, o‘chirish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E2E8F0] text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#FF5A00] mx-auto flex items-center justify-center mb-3">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-[#1E293B]">Standart hamkorlarni tiklash?</h3>
              <p className="text-xs text-[#64748B] mt-1">
                Pepsi, Coca-Cola, Artel va boshqa boshlang‘ich korxonalar qayta tiklanadi.
              </p>
              <div className="flex items-center justify-center gap-2.5 mt-5">
                <button
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-[#475569] text-xs font-bold hover:bg-[#F8FAFC] cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleResetConfirm}
                  className="px-4 py-2 rounded-xl bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Ha, tiklansin
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
