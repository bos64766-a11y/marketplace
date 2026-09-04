/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { siteSettings, updateSiteSettings, navigate } = useApp();
  const [formData, setFormData] = useState({ ...siteSettings });
  const [isSaved, setIsSaved] = useState(false);

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
