/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  Search,
  Package,
  Layers,
  RotateCcw,
  Check,
  ExternalLink,
  ArrowRight,
  Eye,
  ShoppingBag,
} from 'lucide-react';
import type { HomeShowcaseSection, Product } from '../../types';

export const AdminShowcaseSections: React.FC = () => {
  const {
    showcaseSections,
    addShowcaseSection,
    updateShowcaseSection,
    deleteShowcaseSection,
    resetDefaultShowcaseSections,
    products,
    categories,
    navigate,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<HomeShowcaseSection | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<HomeShowcaseSection, 'id'>>({
    title: '',
    subtitle: '',
    badge: '',
    icon: '',
    link: '/catalog',
    productIds: [],
    order: showcaseSections.length + 1,
    isActive: true,
  });

  // Product picker search & filter
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategory, setPickerCategory] = useState<string>('all');

  // Filtered products for the picker inside modal
  const filteredPickerProducts = useMemo(() => {
    let list = products;
    if (pickerCategory !== 'all') {
      list = list.filter((p) => p.categoryId === pickerCategory || p.categoryName === pickerCategory);
    }
    if (pickerSearch.trim()) {
      const q = pickerSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, pickerCategory, pickerSearch]);

  const openAddModal = () => {
    setEditingSection(null);
    setPickerSearch('');
    setPickerCategory('all');
    setFormData({
      title: '',
      subtitle: '',
      badge: '',
      icon: '',
      link: '/catalog',
      productIds: [],
      order: showcaseSections.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sec: HomeShowcaseSection) => {
    setEditingSection(sec);
    setPickerSearch('');
    setPickerCategory('all');
    setFormData({
      title: sec.title || '',
      subtitle: sec.subtitle || '',
      badge: '',
      icon: '',
      link: sec.link || '/catalog',
      productIds: sec.productIds || [],
      order: sec.order || 1,
      isActive: sec.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const toggleProductSelection = (productId: string) => {
    setFormData((prev) => {
      const current = prev.productIds || [];
      if (current.includes(productId)) {
        return { ...prev, productIds: current.filter((id) => id !== productId) };
      } else {
        return { ...prev, productIds: [...current, productId] };
      }
    });
  };

  const selectAllFiltered = () => {
    const idsToAdd = filteredPickerProducts.map((p) => p.id);
    setFormData((prev) => {
      const set = new Set([...(prev.productIds || []), ...idsToAdd]);
      return { ...prev, productIds: Array.from(set) };
    });
  };

  const deselectAllFiltered = () => {
    const idsToRemove = new Set(filteredPickerProducts.map((p) => p.id));
    setFormData((prev) => ({
      ...prev,
      productIds: (prev.productIds || []).filter((id) => !idsToRemove.has(id)),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingSection) {
      await updateShowcaseSection(editingSection.id, formData);
    } else {
      await addShowcaseSection(formData);
    }
    setIsModalOpen(false);
  };

  const toggleSectionActive = async (sec: HomeShowcaseSection) => {
    await updateShowcaseSection(sec.id, { isActive: sec.isActive === false ? true : false });
  };

  const activeCount = showcaseSections.filter((s) => s.isActive !== false).length;
  const totalAssignedProducts = showcaseSections.reduce((acc, s) => acc + (s.productIds?.length || 0), 0);

  return (
    <AdminLayout activeTab="sections">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">
              Bosh Sahifa Bo‘limlari ("Biz kimlar uchun")
            </h1>
            <p className="text-xs font-medium text-[#64748B] mt-0.5">
              Bosh sahifadagi sohaviy bo‘limlar va ularga biriktirilgan mahsulotlar boshqaruvi
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs font-bold text-[#475569] cursor-pointer shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Saytda ko‘rish</span>
            </button>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-bold cursor-pointer shadow-md shadow-[#FF5A00]/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Yangi Bo‘lim Qo‘shish</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-[#F1F5F9] shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Jami Bo‘limlar</p>
              <p className="text-xl font-black text-[#1E293B] mt-0.5">{showcaseSections.length} ta</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5A00] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#F1F5F9] shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Faol Bo‘limlar</p>
              <p className="text-xl font-black text-[#10B981] mt-0.5">{activeCount} ta</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#F1F5F9] shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Biriktirilgan Mahsulotlar</p>
              <p className="text-xl font-black text-[#FF5A00] mt-0.5">{totalAssignedProducts} ta</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5A00] flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-4">
          {showcaseSections.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#F1F5F9] shadow-2xs">
              <Layers className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#1E293B]">Hozircha bo‘limlar mavjud emas</h3>
              <p className="text-xs text-[#64748B] mt-1">
                Yangi bo‘lim qo‘shishingiz yoki standart 4 ta sohani tiklashingiz mumkin
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={openAddModal}
                  className="px-4 py-2.5 bg-[#FF5A00] hover:bg-[#e04f00] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Bo‘lim qo‘shish</span>
                </button>
                <button
                  onClick={resetDefaultShowcaseSections}
                  className="px-4 py-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Standart sohalarni tiklash</span>
                </button>
              </div>
            </div>
          ) : (
            showcaseSections.map((sec, index) => {
              const isActive = sec.isActive !== false;
              const assignedCount = sec.productIds?.length || 0;
              const assignedProductObjs = (sec.productIds || [])
                .map((id) => products.find((p) => p.id === id))
                .filter((p): p is Product => Boolean(p));

              return (
                <div
                  key={sec.id}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-2xs hover:shadow-md ${
                    isActive ? 'border-[#F1F5F9]' : 'border-gray-200 bg-gray-50/60 opacity-80'
                  }`}
                >
                  {/* Row Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#F8FAFC] text-[#64748B] font-bold text-xs shrink-0 border border-[#E2E8F0]">
                        #{index + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-gray-100 text-gray-500 border border-gray-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}
                            />
                            {isActive ? 'Bosh sahifada ko‘rinadi' : 'Yashirilgan'}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-[#1E293B]">{sec.title}</h3>
                        {sec.subtitle && <p className="text-xs text-[#64748B] font-medium">{sec.subtitle}</p>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => toggleSectionActive(sec)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {isActive ? 'Faol' : 'Faollashtirish'}
                      </button>

                      <button
                        onClick={() => openEditModal(sec)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF7ED] hover:bg-[#ffeedd] text-[#FF5A00] border border-[#FF5A00]/30 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Tahrirlash & Mahsulotlar</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(sec.id)}
                        className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-[#EF4444] border border-red-200 flex items-center justify-center transition-colors cursor-pointer"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Inline Delete Confirmation */}
                  {deleteConfirmId === sec.id && (
                    <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                      <p className="text-xs text-red-700 font-bold">
                        Haqiqatan ham "{sec.title}" bo‘limini o‘chirmoqchimisiz?
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-3 py-1 rounded-lg bg-white border border-[#CBD5E1] text-[#475569] text-xs font-bold hover:bg-gray-50 cursor-pointer"
                        >
                          Bekor qilish
                        </button>
                        <button
                          onClick={async () => {
                            await deleteShowcaseSection(sec.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-3 py-1 rounded-lg bg-[#EF4444] hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
                        >
                          Ha, o‘chirilsin
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Assigned Products Horizontal Thumbnails */}
                  <div className="mt-4 pt-3 border-t border-[#F8FAFC]">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-[#FF5A00]" />
                        Biriktirilgan tovarlar ({assignedCount} ta)
                      </span>
                      <button
                        onClick={() => openEditModal(sec)}
                        className="text-[11px] font-bold text-[#FF5A00] hover:underline cursor-pointer"
                      >
                        + Mahsulot qo‘shish / almashtirish
                      </button>
                    </div>

                    {assignedCount === 0 ? (
                      <div className="rounded-xl border border-dashed border-[#CBD5E1] p-3 text-center bg-[#F8FAFC]">
                        <p className="text-xs text-[#94A3B8]">
                          Hozircha birorta mahsulot biriktirilmagan. "Tahrirlash & Mahsulotlar" tugmasi orqali
                          mahsulotlarni tanlang.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                        {assignedProductObjs.map((prod) => (
                          <div
                            key={prod.id}
                            className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] shrink-0 max-w-[240px]"
                          >
                            <img
                              src={prod.images?.[0] || '/hero-supply-pack.jpg'}
                              alt={prod.name}
                              className="w-10 h-10 rounded-lg object-contain bg-white border border-[#CBD5E1] p-0.5 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-[#1E293B] truncate">{prod.name}</p>
                              <p className="text-[10px] font-extrabold text-[#FF5A00]">
                                {prod.price.toLocaleString('uz-UZ')} so‘m
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add / Edit Section Modal with Product Multi-Picker */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-5">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col z-10 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between shrink-0 bg-white">
              <div>
                <h3 className="text-lg font-black text-[#1E293B]">
                  {editingSection ? 'Bo‘limni tahrirlash' : 'Yangi soha bo‘limi qo‘shish'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  Bosh sahifada ushbu bo‘lim o‘z nomi va tanlangan mahsulotlari bilan karusel bo‘lib chiqadi
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4 text-[#64748B]" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Section Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E293B] mb-1.5">Bo‘lim nomi *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00]"
                    placeholder="Masalan: Ofislar uchun"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] mb-1.5">Katalog havolasi</label>
                  <input
                    type="text"
                    value={formData.link || ''}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00]"
                    placeholder="/catalog yoki /catalog/kanselyariya"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1E293B] mb-1.5">Quyi tavsif (Subtitle - ixtiyoriy)</label>
                  <input
                    type="text"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A00]"
                    placeholder="Masalan: Kantselyariya, gigiyena va kundalik sarflov tovarlari"
                  />
                  <div className="flex items-center gap-4 mt-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 accent-[#FF5A00] rounded"
                      />
                      <span className="text-xs font-bold text-[#1E293B]">Bosh sahifada faol bo‘lsin</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Product Multi-Picker Section */}
              <div className="pt-4 border-t border-[#F1F5F9] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-extrabold text-[#1E293B] flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#FF5A00]" />
                      Ushbu bo‘limga tovarlarni biriktirish
                      <span className="px-2 py-0.5 rounded-full bg-[#FF5A00] text-white text-xs font-bold">
                        {formData.productIds?.length || 0} ta tanlandi
                      </span>
                    </h4>
                    <p className="text-[11px] text-[#64748B]">
                      Bosh sahifadagi karuselda faqat siz tanlagan tovarlar ko‘rinadi
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={selectAllFiltered}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold hover:bg-emerald-100 cursor-pointer"
                    >
                      Filtrdagilarni tanlash ({filteredPickerProducts.length})
                    </button>
                    <button
                      type="button"
                      onClick={deselectAllFiltered}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 text-[11px] font-bold hover:bg-gray-200 cursor-pointer"
                    >
                      Filtrdagilarni bekor qilish
                    </button>
                  </div>
                </div>

                {/* Filter & Search Toolbar */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={pickerSearch}
                      onChange={(e) => setPickerSearch(e.target.value)}
                      placeholder="Mahsulot nomi yoki artikulini qidiring..."
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#FF5A00]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
                    <button
                      type="button"
                      onClick={() => setPickerCategory('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer border ${
                        pickerCategory === 'all'
                          ? 'bg-[#FF5A00] text-white border-[#FF5A00]'
                          : 'bg-white text-[#64748B] border-[#CBD5E1] hover:bg-gray-50'
                      }`}
                    >
                      Barchasi ({products.length})
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setPickerCategory(c.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer border ${
                          pickerCategory === c.id
                            ? 'bg-[#FF5A00] text-white border-[#FF5A00]'
                            : 'bg-white text-[#64748B] border-[#CBD5E1] hover:bg-gray-50'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto p-1 border border-[#E2E8F0] rounded-2xl bg-[#F8FAFC]">
                  {filteredPickerProducts.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-xs text-[#94A3B8]">
                      Qidiruv bo‘yicha mahsulot topilmadi
                    </div>
                  ) : (
                    filteredPickerProducts.map((p) => {
                      const isSelected = (formData.productIds || []).includes(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => toggleProductSelection(p.id)}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer select-none ${
                            isSelected
                              ? 'bg-orange-50/80 border-[#FF5A00] shadow-xs'
                              : 'bg-white border-[#E2E8F0] hover:border-gray-300'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                              isSelected
                                ? 'bg-[#FF5A00] border-[#FF5A00] text-white'
                                : 'border-[#CBD5E1] bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <img
                            src={p.images?.[0] || '/hero-supply-pack.jpg'}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-contain bg-white border border-[#CBD5E1] p-0.5 shrink-0"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-[#1E293B] truncate">{p.name}</p>
                            <p className="text-[10px] text-[#64748B] truncate">
                              {p.sku} • {p.price.toLocaleString('uz-UZ')} so‘m
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#475569] hover:bg-gray-50 cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={!formData.title.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#FF5A00] hover:bg-[#e04f00] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#FF5A00]/25 cursor-pointer"
                >
                  {editingSection ? 'Saqlash' : 'Bo‘limni qo‘shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
