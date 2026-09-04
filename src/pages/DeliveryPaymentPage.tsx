import React from 'react';
import { useApp } from '../context/AppContext';
import { Truck, CreditCard, Clock, ShieldCheck, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';

export const DeliveryPaymentPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A00] bg-[#FFF1E8] px-3 py-1 rounded-full border border-[#FF5A00]/20">
          Shartlar va qoidalar
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2E73] tracking-tight">
          To‘lov va Yetkazib berish
        </h1>
        <p className="text-xs sm:text-sm text-[#667085]">
          Yuridik va jismoniy shaxslar uchun eng qulay hisob-kitob hamda logistika shartlari
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
              <h2 className="text-xl font-bold text-[#0B2E73]">Yetkazib berish shartlari</h2>
              <p className="text-xs text-[#667085]">Tezkor va aniq rejalashtirilgan logistika</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF2] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#0B2E73]">
                <Clock className="w-4 h-4 text-[#FF5A00]" />
                <span>Yetkazib berish vaqti:</span>
              </div>
              <p className="text-[#667085] leading-relaxed">
                Soat 16:00 ga qadar tasdiqlangan zayavkalar <strong>ertasi kuniyoq (24 soat ichida)</strong> to‘g‘ridan-to‘g‘ri ofisingiz yoki omboringiz eshigigacha yetkaziladi.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF2] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#0B2E73]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Toshkent shahri bo‘ylab:</span>
              </div>
              <p className="text-[#667085] leading-relaxed">
                Minimal <strong>500 000 so‘m</strong> miqdoridagi B2B buyurtmalarda yetkazib berish mutlaqo <strong>bepul</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF2] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#0B2E73]">
                <Truck className="w-4 h-4 text-[#0B2E73]" />
                <span>Viloyatlarga yetkazish:</span>
              </div>
              <p className="text-[#667085] leading-relaxed">
                Toshkent viloyati va O‘zbekistonning barcha viloyatlariga kuryerlik yoki transport kompaniyalari (BTS, Fargo) orqali yetkazib beriladi.
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
              <h2 className="text-xl font-bold text-[#0B2E73]">B2B To‘lov usullari</h2>
              <p className="text-xs text-[#667085]">To‘liq qonuniy va shaffof hisob-kitob</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF2] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#0B2E73]">
                <FileSpreadsheet className="w-4 h-4 text-[#0B2E73]" />
                <span>Pul o‘tkazish (Bank hisob-raqami / Перечисление):</span>
              </div>
              <p className="text-[#667085] leading-relaxed">
                Yuridik shaxslar uchun shartnoma, hisob-kitob varaqasi (schet-faktura) va elektron hujjat aylanishi (Didox, Soliq) orqali E-Faktura.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF2] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#0B2E73]">
                <CreditCard className="w-4 h-4 text-[#0B2E73]" />
                <span>Korporativ karta va terminal:</span>
              </div>
              <p className="text-[#667085] leading-relaxed">
                Korxona korporativ kartasi (Uzcard / Humo) orqali to‘lov qilish imkoniyati.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF2] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#0B2E73]">
                <ShieldCheck className="w-4 h-4 text-[#0B2E73]" />
                <span>Naqd pul / Elektron to‘lovlar:</span>
              </div>
              <p className="text-[#667085] leading-relaxed">
                Kassa cheki bilan naqd pul yoki Click, Payme ilovalari orqali to‘lov.
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
            <h4 className="font-bold text-sm text-[#0B2E73]">Minimal zayavka miqdori: 500 000 so‘m</h4>
            <p className="text-xs text-[#667085]">
              Saytda zayavka shakllantirilgandan so‘ng, yakuniy narx va yetkazib berish korporativ menejer bilan kelishiladi.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/catalog')}
          className="px-6 py-3 rounded-xl bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-bold whitespace-nowrap cursor-pointer transition-colors shadow-xs"
        >
          Katalogga o‘tish
        </button>
      </div>
    </div>
  );
};
