/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import {
  Save,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  CreditCard,
  Landmark,
  Truck,
  Megaphone,
  ArrowRight,
  Database,
  Download,
  Upload,
  RefreshCw,
  HardDrive,
  ShieldCheck,
  Server,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const {
    siteSettings,
    updateSiteSettings,
    navigate,
    exportBackupJSON,
    importBackupJSON,
    restoreFromArchive,
    archiveStats,
    products,
    showcaseSections,
  } = useApp();
  const [formData, setFormData] = useState({ ...siteSettings });
  const [isSaved, setIsSaved] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setIsRestoring(true);
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        await importBackupJSON(parsed);
      } catch (err: any) {
        alert('Xatolik: Faylni o‘qib bo‘lmadi (' + err.message + ')');
      } finally {
        setIsRestoring(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    updateSiteSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const updateField = (key: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const renderInput = (
    label: string,
    key: keyof typeof formData,
    icon: React.ReactNode,
    placeholder: string,
    type: string = 'text'
  ) => (
    <div>
      <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
        {icon}
        {label}
      </label>
      <input
        type={type}
        value={formData[key]}
        onChange={(e) => updateField(key, type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors bg-[#F8FAFC] focus:bg-white"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <AdminLayout activeTab="settings">
      <div className="space-y-6 max-w-4xl">
        {/* Header with Mockup Typography */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">Sayt Sozlamalari</h1>
            <p className="text-xs font-medium text-[#94A3B8] mt-0.5">
              Kompaniya rekvizitlari, aloqa va yetkazib berish konfiguratsiyasi
            </p>
          </div>
          <button
            onClick={handleSave}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-md shrink-0
              ${isSaved
                ? 'bg-[#10B981] text-white shadow-[#10B981]/25'
                : 'bg-[#FF5A00] hover:bg-[#e04f00] text-white shadow-[#FF5A00]/25'
              }
            `}
          >
            <Save className="w-4 h-4" />
            {isSaved ? 'Saqlandi ✓' : 'Saqlash'}
          </button>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-2xs">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-[#FFF7ED] text-[#FF5A00] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#1E293B]">Kompaniya Ma'lumotlari</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderInput('Kompaniya nomi', 'companyName', <Building2 className="w-3 h-3" />, 'SNABTASH B2B')}
            {renderInput('Telefon 1', 'phone1', <Phone className="w-3 h-3" />, '+998 90 123 45 67')}
            {renderInput('Telefon 2', 'phone2', <Phone className="w-3 h-3" />, '+998 91 765 43 21')}
            {renderInput('Email', 'email', <Mail className="w-3 h-3" />, 'info@snabtash.uz')}
            {renderInput('Telegram Bot', 'telegramBot', <Megaphone className="w-3 h-3" />, '@snabtash_bot')}
            {renderInput('Telegram Kanal', 'telegramChannel', <Megaphone className="w-3 h-3" />, 'https://t.me/snabtash')}
          </div>
          <div className="grid grid-cols-1 gap-4 mt-4">
            {renderInput('Manzil', 'address', <MapPin className="w-3 h-3" />, 'Toshkent sh., ...')}
            {renderInput('Ish vaqti', 'workHours', <Clock className="w-3 h-3" />, 'Dush - Shan: 08:30 - 18:30')}
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-2xs">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-[#FFF7ED] text-[#FF5A00] flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#1E293B]">Bank Rekvizitlari</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderInput('INN', 'inn', <CreditCard className="w-3 h-3" />, '309871234')}
            {renderInput('MFO', 'mfo', <CreditCard className="w-3 h-3" />, '00440')}
            {renderInput('Hisob raqami', 'bankAccount', <CreditCard className="w-3 h-3" />, '20208000900123456001')}
            {renderInput('Bank nomi', 'bankName', <Landmark className="w-3 h-3" />, 'ATB "Kapitalbank"')}
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-2xs">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-[#FFF7ED] text-[#FF5A00] flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#1E293B]">Yetkazib Berish Sozlamalari</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderInput("Bepul yetkazish chegarasi (so'm)", 'freeDeliveryThreshold', <Truck className="w-3 h-3" />, '500000', 'number')}
            {renderInput("Yetkazish narxi (so'm)", 'deliveryCost', <CreditCard className="w-3 h-3" />, '35000', 'number')}
          </div>
        </div>

        {/* Banner Settings */}
        <div className="bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFF7ED] text-[#FF5A00] flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E293B]">Banner Sozlamalari</h3>
                <p className="text-[11px] text-[#64748B]">Bosh sahifadagi qahramon bannerlari</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/admin/banners')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF5A00]/10 hover:bg-[#FF5A00] text-[#FF5A00] hover:text-white text-xs font-bold transition-all cursor-pointer w-fit"
            >
              <span>Bannerlarni Boshqarish (Alishtirish / O‘chirish)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-4">
            {renderInput('Banner Sarlavhasi', 'bannerHeadline', <Megaphone className="w-3 h-3" />, "Korxonangiz Uchun Barcha Ta'minot")}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                <Megaphone className="w-3 h-3" />
                Banner Tavsifi
              </label>
              <textarea
                value={formData.bannerSubtitle}
                onChange={(e) => updateField('bannerSubtitle', e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#FF5A00] transition-colors bg-[#F8FAFC] focus:bg-white resize-none"
                placeholder="Banner ostidagi matn..."
              />
            </div>
            {renderInput('Chegirma Badge Matni', 'bannerDiscountBadge', <Megaphone className="w-3 h-3" />, 'Maxsus B2B Taklif • 20% Chegirma')}
          </div>
        </div>

        {/* Ma'lumotlar Zaxirasi va Qayta Tiklash (Backup & Restore) */}
        <div className="bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E293B]">Ma'lumotlar Zaxirasi va Himoya (Backup & Restore)</h3>
                <p className="text-[11px] text-[#64748B]">
                  Tovarlar ({products.length} ta), Sohaviy bo'limlar ({showcaseSections.length} ta), kategoriyalar va sozlamalar
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold self-start sm:self-auto">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Aqlli Merge Himoyasi Faol</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export Card */}
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Download className="w-4 h-4 text-[#FF5A00]" />
                  <h4 className="text-xs font-bold text-[#0F172A]">Zaxirani Yuklab Olish (.json)</h4>
                </div>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  Saytdagi barcha {products.length} ta tovar, {showcaseSections.length} ta bo'lim va sozlamalarni bitta xavfsiz JSON fayl sifatida kompyuteringizga saqlab oling.
                </p>
              </div>
              <button
                type="button"
                onClick={exportBackupJSON}
                className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Barcha Ma'lumotlarni Yuklab Olish (.json)</span>
              </button>
            </div>

            {/* Import Card */}
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="w-4 h-4 text-[#3B82F6]" />
                  <h4 className="text-xs font-bold text-[#0F172A]">Zaxiradan Qayta Tiklash</h4>
                </div>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  Oldin yuklab olingan zaxira (.json) faylini tanlang. Barcha tovarlar va bo'limlar darhol saytga va serverga qayta yuklanadi.
                </p>
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isRestoring}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isRestoring ? "Tiklanmoqda..." : "Zaxira Faylini Yuklash (.json)"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Local Archive Rescue Pill */}
          {(archiveStats.productsCount > 0 || archiveStats.sectionsCount > 0) && (
            <div className="mt-4 p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <HardDrive className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-amber-900">Brauzer Avtomatik Arxivi</h5>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Mahalliy xotirada <strong>{archiveStats.productsCount} ta tovar</strong> va <strong>{archiveStats.sectionsCount} ta bo'lim</strong> saqlangan. Agar tovarlaringiz kamayib qolgan bo'lsa, ushbu tugma bilan bir zumda tiklashingiz mumkin.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={restoreFromArchive}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Arxivdan Tiklash</span>
              </button>
            </div>
          )}

          {/* Permanent Cloud Database Info */}
          <div className="mt-4 p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F1F5F9]/60 text-[11px] text-[#475569] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#1E293B]">
              <Server className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span>Nega ma'lumotlar qaytib qolgan edi? (Render bepul tarifi sababi)</span>
            </div>
            <p>
              Render bepul tarifida veb-server 15 daqiqa davomida foydalanilmasa "uxlab" qoladi va vaqtinchalik diskidagi SQLite faylini qayta tiklaydi.
            </p>
            <p>
              <strong>100% Doimiy Yechim:</strong> Render boshqaruv panelida bepul <strong>PostgreSQL</strong> bazasini ochib, uning <code className="bg-white px-1.5 py-0.5 rounded border border-[#CBD5E1] text-[#0F172A] font-mono">DATABASE_URL</code> manzilini Environment Variables ga qo'shsangiz, barcha ma'lumotlar server o'chsa ham hech qachon yo'qolmaydi!
            </p>
          </div>
        </div>

        {/* Bottom Save Bar (Mobile Friendly) */}
        <div className="sm:hidden sticky bottom-4">
          <button
            onClick={handleSave}
            className={`
              w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer shadow-lg
              ${isSaved
                ? 'bg-[#10B981] text-white'
                : 'bg-[#FF5A00] text-white'
              }
            `}
          >
            <Save className="w-4 h-4" />
            {isSaved ? 'Saqlandi ✓' : "Barcha O'zgarishlarni Saqlash"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};
