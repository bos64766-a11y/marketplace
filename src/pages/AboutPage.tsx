import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { useApp } from '../context/AppContext';
import { Building2, ShieldCheck, Truck, Users, Award, Target, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate, partners } = useApp();
  const displayPartners = partners && partners.length > 0 ? partners : [];

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#0B2E73] to-[#08245A] rounded-3xl p-8 sm:p-12 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A00] bg-white/10 px-3 py-1 rounded-full border border-white/20">
            SNABTASH B2B Ta’minot
          </span>
          <h1 className="text-[28px] sm:text-[36px] md:text-[40px] font-extrabold tracking-[-0.025em] leading-[1.15]">
            Korxonalar va tashkilotlar uchun ishonchli ta’minot hamkori
          </h1>
          <p className="text-[15px] sm:text-[16px] text-white/85 leading-[1.6] font-normal">
            Biz O‘zbekistondagi yuzlab kompaniyalar, ofislar, restoranlar, fabrikalar va klinikalarga sifatli tozalash, gigiyena, kanselyariya va xo‘jalik mahsulotlarini uzluksiz yetkazib beramiz.
          </p>
        </div>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#E5EAF2] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#0B2E73]">Yagona ta’minotchi</h3>
          <p className="text-xs text-[#667085] leading-relaxed">
            Barcha xo‘jalik va kimyoviy ehtiyojlarni 10 xil do‘kondan emas, aynan bitta joydan, yagona hisob-faktura bilan xarid qiling.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E5EAF2] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#0B2E73]">Tezkor logistika</h3>
          <p className="text-xs text-[#667085] leading-relaxed">
            O‘zimizning avtoparkimiz va tajribali haydovchilarimiz orqali Toshkent bo‘ylab buyurtmalarni ertasi kuniyoq yetkazib beramiz.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E5EAF2] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#0B2E73]">100% Sertifikatlangan</h3>
          <p className="text-xs text-[#667085] leading-relaxed">
            Barcha professional kimyo va gigiyena vositalari gigiyenik va sifat sertifikatlariga ega.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E5EAF2] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#0B2E73]">Qulay B2B narxlar</h3>
          <p className="text-xs text-[#667085] leading-relaxed">
            To‘g‘ridan-to‘g‘ri ishlab chiqaruvchilardan olib kelinganligi sababli bozor narxlaridan arzon va ulgurji tariflar.
          </p>
        </div>
      </div>

      {/* Partners showcase */}
      <div className="bg-[#F7F9FC] rounded-3xl border border-[#E5EAF2] p-8 sm:p-10 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-[#0B2E73]">Bizga ishonch bildirgan brendlar</h2>
          <p className="text-xs sm:text-sm text-[#667085]">
            Yirik ishlab chiqaruvchilar, korporatsiyalar va xalqaro brendlar bilan uzoq muddatli shartnomalar asosida ishlaymiz.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {displayPartners.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl bg-white border border-[#E5EAF2] hover:border-[#0B2E73]/30 hover:shadow-xs transition-all text-center flex flex-col items-center justify-center min-h-[90px]"
            >
              {p.logo ? (
                <img
                  src={p.logo}
                  alt={p.name}
                  className="max-h-8 max-w-[90px] object-contain mb-1.5"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="font-extrabold text-xs text-[#0B2E73] block truncate max-w-full">
                  {p.name}
                </span>
              )}
              <span className="font-bold text-[11px] text-[#1E293B] block truncate max-w-full">
                {p.name}
              </span>
              {p.category && (
                <span className="text-[10px] text-[#667085] truncate block mt-0.5 max-w-full">
                  {p.category}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center p-8 bg-white rounded-3xl border border-[#E5EAF2] shadow-xs space-y-4">
        <h3 className="text-xl font-bold text-[#0B2E73]">Hamkorlik qilishga tayyormisiz?</h3>
        <p className="text-xs sm:text-sm text-[#667085] max-w-md mx-auto">
          Kompaniyangiz ehtiyojlari uchun eng maqbul narxlar va qulay yetkazib berish jadvalini tuzib beramiz.
        </p>
        <button
          onClick={() => navigate('/request')}
          className="px-8 py-3.5 rounded-xl bg-[#FF5A00] hover:bg-[#e04f00] text-white font-bold text-sm transition-colors cursor-pointer shadow-md shadow-[#FF5A00]/25"
        >
          Korporativ zayavka qoldirish
        </button>
      </div>
    </div>
  );
};
