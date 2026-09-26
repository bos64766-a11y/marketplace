import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { useApp } from '../context/AppContext';
import { Truck, CreditCard, Clock, ShieldCheck, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';

export const DeliveryPaymentPage: React.FC = () => {
  const { navigate, siteSettings, t, language } = useApp();
  const freeThreshold = (siteSettings?.freeDeliveryThreshold || 500000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  useSEO({
    title: language === 'ru' ? 'Доставка и Оплата • B2B Снабжение SNABTASH' : 'To‘lov va Yetkazib berish • SNABTASH B2B Ta’minot',
    description: t.deliveryPaymentPage.subtitle,
  });

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A00] bg-[#FFF1E8] px-3 py-1 rounded-full border border-[#FF5A00]/20">
          {t.deliveryPaymentPage.badge}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2E73] tracking-tight">
          {t.deliveryPaymentPage.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#667085]">
          {t.deliveryPaymentPage.subtitle}
        </p>
      </div>

      {/* 2 Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: Yetkazib berish */}
        <div className="bg-white rounded-3xl border border-[#E5EAF2] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E5EAF2]">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0B2E73]">{t.deliveryPaymentPage.deliveryTitle}</h2>
              <p className="text-xs text-[#667085]">{t.deliveryPaymentPage.deliverySubtitle}</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF2] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#0B2E73]">
                <Clock className="w-4 h-4 text-[#FF5A00]" />
                <span>{t.deliveryPaymentPage.deliveryTimeTitle}</span>
              </div>
              <p className="text-[#667085] leading-relaxed">
                {t.deliveryPaymentPage.deliveryTimeDesc}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF2] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#0B2E73]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t.deliveryPaymentPage.deliveryTashkentTitle}</span>
              </div>
              <p className="text-[#667085] leading-relaxed">
                {t.deliveryPaymentPage.deliveryTashkentDescPre} <strong>{freeThreshold} {language === 'ru' ? 'сум' : 'so‘m'}</strong> {t.deliveryPaymentPage.deliveryTashkentDescPost}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF2] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#0B2E73]">
                <Truck className="w-4 h-4 text-[#0B2E73]" />
                <span>{t.deliveryPaymentPage.deliveryRegionsTitle}</span>
              </div>
              <p className="text-[#667085] leading-relaxed">
                {t.deliveryPaymentPage.deliveryRegionsDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: To‘lov usullari */}
        <div className="bg-white rounded-3xl border border-[#E5EAF2] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E5EAF2]">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0B2E73]">{t.deliveryPaymentPage.paymentTitle}</h2>
              <p className="text-xs text-[#667085]">{t.deliveryPaymentPage.paymentSubtitle}</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF2] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#0B2E73]">
                <FileSpreadsheet className="w-4 h-4 text-[#0B2E73]" />
                <span>{t.deliveryPaymentPage.paymentTransferTitle}</span>
              </div>
              <p className="text-[#667085] leading-relaxed">
                {t.deliveryPaymentPage.paymentTransferDesc}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF2] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#0B2E73]">
                <CreditCard className="w-4 h-4 text-[#0B2E73]" />
                <span>{t.deliveryPaymentPage.paymentCardTitle}</span>
              </div>
              <p className="text-[#667085] leading-relaxed">
                {t.deliveryPaymentPage.paymentCardDesc}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF2] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#0B2E73]">
                <ShieldCheck className="w-4 h-4 text-[#0B2E73]" />
                <span>{t.deliveryPaymentPage.paymentCashTitle}</span>
              </div>
              <p className="text-[#667085] leading-relaxed">
                {t.deliveryPaymentPage.paymentCashDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Order Banner */}
      <div className="p-6 rounded-3xl bg-[#FFF1E8] border border-[#FF5A00]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-8 h-8 text-[#FF5A00] shrink-0" />
          <div>
            <h4 className="font-bold text-sm text-[#0B2E73]">
              {language === 'ru' ? 'Минимальная сумма заявки: 500 000 сум' : 'Minimal zayavka miqdori: 500 000 so‘m'}
            </h4>
            <p className="text-xs text-[#667085]">
              {t.deliveryPaymentPage.minOrderDesc}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/catalog')}
          className="px-6 py-3 rounded-xl bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-bold whitespace-nowrap cursor-pointer transition-colors shadow-xs"
        >
          {t.deliveryPaymentPage.toCatalog}
        </button>
      </div>
    </div>
  );
};
