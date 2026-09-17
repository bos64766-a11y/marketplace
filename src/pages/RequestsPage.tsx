import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Building2,
  Phone,
  LogOut,
  Loader2,
  ShieldCheck,
  User,
  Hash
} from 'lucide-react';

export const RequestsPage: React.FC = () => {
  const {
    customerOrders,
    profile,
    loginCustomer,
    logoutCustomer,
    navigate,
    getProductName,
    formatUnit,
    showToast
  } = useApp();

  const [expandedId, setExpandedId] = useState<string | null>(customerOrders[0]?.id || null);
  const [phoneInput, setPhoneInput] = useState('+998 ');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const isIdentified = Boolean(profile.phone && profile.phone.trim().length >= 9);

  const toggleExpand = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const handlePhoneInputChange = (val: string) => {
    let clean = val;
    if (!clean.startsWith('+998')) {
      clean = '+998 ';
    }
    setPhoneInput(clean);
    if (phoneError) setPhoneError('');
  };

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digitsOnly = phoneInput.replace(/\D/g, '');
    if (digitsOnly.length < 9) {
      setPhoneError('Telefon raqamingizni to‘liq kiriting (+998 __ ___ __ __)');
      return;
    }

    setIsLoading(true);
    try {
      await loginCustomer(phoneInput);
    } catch (err) {
      console.error('Lookup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Tasdiqlangan':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Yetkazilmoqda':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Bajarildi':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Bekor qilindi':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E5EAF2]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2E73] tracking-tight flex items-center gap-3">
            <span>Mening zayavkalarim</span>
            {isIdentified && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF3FF] text-[#0B2E73] border border-[#BFDBFE]">
                B2B Hisob
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Yuborilgan barcha B2B ta’minot zayavkalari va ularning holati
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => navigate('/request')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5A00] text-white text-xs sm:text-sm font-bold hover:bg-[#e04f00] transition-colors cursor-pointer shadow-xs"
          >
            <span>Yangi zayavka</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isIdentified ? (
        /* IDENTIFIED CUSTOMER VIEW */
        <div className="space-y-6 max-w-4xl">
          {/* Customer Profile Banner */}
          <div className="bg-white rounded-3xl border border-[#E5EAF2] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0B2E73] text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-bold text-base sm:text-lg text-[#14213D]">
                    {profile.company || profile.name || 'B2B Mijoz'}
                  </h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Faol
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#667085] mt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#FF5A00]" />
                    <strong className="text-[#14213D]">{profile.phone}</strong>
                  </span>
                  {profile.name && profile.company && (
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#0B2E73]" />
                      <span>{profile.name}</span>
                    </span>
                  )}
                  {profile.inn && (
                    <span className="flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-[#667085]" />
                      <span>STIR: {profile.inn}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={logoutCustomer}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#667085] hover:text-rose-600 hover:bg-rose-50 border border-[#E5EAF2] hover:border-rose-200 transition-colors cursor-pointer self-end md:self-auto"
              title="Hisobdan chiqish"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish</span>
            </button>
          </div>

          {/* Customer's Orders List */}
          {customerOrders.length > 0 ? (
            <div className="space-y-4">
              {customerOrders.map((order) => {
                const isExpanded = expandedId === order.id;

                return (
                  <div
                    key={order.id}
                    id={`request-card-${order.id}`}
                    className="bg-white rounded-3xl border border-[#E5EAF2] overflow-hidden shadow-xs hover:border-[#0B2E73] transition-all"
                  >
                    {/* Main Card Header */}
                    <div
                      onClick={() => toggleExpand(order.id)}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#F7F9FC]/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center font-bold text-[14px] shrink-0">
                          #{order.id}
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h3 className="font-bold text-base text-[#0B2E73]">
                              Zayavka #{order.id}
                            </h3>
                            <span className="text-xs text-[#667085]">
                              {order.date}
                            </span>
                          </div>
                          <p className="text-xs text-[#667085] mt-0.5">
                            {order.items.reduce((s, i) => s + i.quantity, 0)} ta mahsulot birligi
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5EAF2]">
                        <div className="text-left sm:text-right">
                          <span className="text-xs text-[#667085] block">Summa:</span>
                          <strong className="text-base font-extrabold text-[#14213D]">
                            {order.totalAmount.toLocaleString('uz-UZ')} so‘m
                          </strong>
                        </div>

                        <span className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>

                        <button
                          type="button"
                          className="w-8 h-8 rounded-full bg-[#F7F9FC] flex items-center justify-center text-[#667085]"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="p-5 sm:p-6 bg-[#F7F9FC]/60 border-t border-[#E5EAF2] space-y-4 animate-in fade-in duration-200">
                        <h4 className="text-xs font-bold text-[#0B2E73] uppercase tracking-wider">
                          Zayavka tarkibi:
                        </h4>

                        <div className="divide-y divide-[#E5EAF2] bg-white rounded-2xl border border-[#E5EAF2] overflow-hidden">
                          {order.items.map(({ product, quantity }, idx) => (
                            <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-3">
                                {product.images && product.images[0] ? (
                                  <img
                                    src={product.images[0]}
                                    alt=""
                                    className="w-10 h-10 rounded-lg object-cover border border-[#E5EAF2]"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                )}
                                <div>
                                  <strong className="text-[#14213D] block">{getProductName(product)}</strong>
                                  <span className="text-[#667085]">
                                    {quantity} {formatUnit(product.unit)} x {product.price.toLocaleString('uz-UZ')} so‘m
                                  </span>
                                </div>
                              </div>
                              <span className="font-bold text-[#0B2E73]">
                                {(product.price * quantity).toLocaleString('uz-UZ')} so‘m
                              </span>
                            </div>
                          ))}
                        </div>

                        {order.contact && (
                          <div className="p-3.5 rounded-xl bg-white border border-[#E5EAF2] text-xs text-[#667085] space-y-1">
                            <div className="flex justify-between">
                              <span>Aloqa qiluvchi shaxs:</span>
                              <strong className="text-[#14213D]">{order.contact.name} ({order.contact.phone})</strong>
                            </div>
                            {order.contact.company && (
                              <div className="flex justify-between">
                                <span>Kompaniya:</span>
                                <strong className="text-[#14213D]">{order.contact.company}</strong>
                              </div>
                            )}
                            {order.contact.comment && (
                              <div className="pt-1 border-t border-[#E5EAF2]">
                                <span className="block font-medium">Izoh:</span>
                                <p className="text-[#14213D] italic mt-0.5">{order.contact.comment}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E5EAF2] p-8 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-[#0B2E73] mb-2">Hozircha zayavkalar yo‘q</h2>
              <p className="text-xs sm:text-sm text-[#667085] mb-6 max-w-md mx-auto">
                Ushbu telefon raqamiga biriktirilgan zayavkalar hali mavjud emas. Katalogdan tovarlarni tanlab, birinchi zayavkani yuboring.
              </p>
              <button
                onClick={() => navigate('/catalog')}
                className="py-3 px-6 rounded-xl bg-[#0B2E73] text-white font-bold text-xs hover:bg-[#082255] transition-colors cursor-pointer"
              >
                Katalogga o‘tish
              </button>
            </div>
          )}
        </div>
      ) : (
        /* UNIDENTIFIED CUSTOMER LOOKUP CARD */
        <div className="max-w-xl mx-auto my-8">
          <div className="bg-white rounded-3xl border border-[#E5EAF2] p-6 sm:p-10 shadow-sm text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center mx-auto mb-5 shadow-xs">
              <Building2 className="w-8 h-8" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B2E73] tracking-tight mb-2">
              Zayavkalaringizni ko‘rish
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] max-w-md mx-auto mb-6 leading-relaxed">
              Kompaniyangiz yuborgan zayavkalar va buyurtma holatini ko‘rish uchun telefon raqamingizni kiriting. Murakkab parol kerak emas.
            </p>

            <form onSubmit={handleLookupSubmit} className="space-y-4 max-w-sm mx-auto text-left">
              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                  Telefon raqamingiz <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    id="input-customer-lookup-phone"
                    value={phoneInput}
                    onChange={(e) => handlePhoneInputChange(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/20 text-sm font-semibold text-[#14213D] outline-hidden transition-all"
                  />
                </div>
                {phoneError && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{phoneError}</p>
                )}
              </div>

              <button
                type="submit"
                id="btn-customer-lookup-submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#0B2E73] hover:bg-[#082255] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#0B2E73]/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Qidirilmoqda...</span>
                  </>
                ) : (
                  <>
                    <span>Zayavkalarni ko‘rish</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#F1F5F9] text-xs text-[#667085] space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Ma’lumotlar xavfsizligi kafolatlangan</span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Birinchi marta zayavka berayotgan bo‘lsangiz, buyurtma yuborishingiz bilan hisobingiz avtomatik saqlanadi.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
