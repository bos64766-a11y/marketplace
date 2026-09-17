import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getMediaUrl } from '../services/api';
import {
  CheckCircle2,
  Check,
  ArrowRight,
  ShoppingBag,
  Building2,
  Phone,
  User,
  Edit3,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

export const RequestPage: React.FC = () => {
  const { cart, cartTotal, submitRequest, profile, updateProfile, navigate, language, t, getProductName, formatUnit } = useApp();

  const hasSavedContact = Boolean(profile?.hasOrderedBefore && profile?.phone && profile?.name);
  const [isEditingContact, setIsEditingContact] = useState(!hasSavedContact);

  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '+998 ');
  const [company, setCompany] = useState(profile?.company || '');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);

  // Phone input formatting helper
  const handlePhoneChange = (val: string) => {
    let clean = val;
    if (!clean.startsWith('+998')) {
      clean = '+998 ';
    }
    setPhone(clean);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) {
      errs.name = language === 'ru' ? 'Введите ваше имя' : 'Ismingizni kiritish majburiy';
    }
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 12) {
      errs.phone = language === 'ru' ? 'Номер телефона не заполнен полностью (+998 __ ___ __ __)' : 'Telefon raqam to‘liq kiritilmadi (+998 __ ___ __ __)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setIsEditingContact(true);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const order = submitRequest({
        items: [...cart],
        totalAmount: cartTotal,
        contact: {
          name,
          phone,
          company: company.trim() || undefined,
          comment: comment.trim() || undefined,
        },
      });

      // Automatically remember contact details for all subsequent orders!
      updateProfile({
        name,
        phone,
        company,
        hasOrderedBefore: true,
      });

      setIsSubmitting(false);
      setSubmittedOrderId(order.id);
    }, 700);
  };

  // SUCCESS SCREEN
  if (submittedOrderId) {
    return (
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 py-16">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-[#E5EAF2] p-8 sm:p-12 text-center shadow-xs">
          <div className="w-20 h-20 rounded-full bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <h1 className="text-2xl font-black text-[#1E293B] tracking-tight mb-2">
            {t.checkout.successTitle}
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6">
            {t.checkout.orderNumber} <span className="font-extrabold text-[#FF5A00]">#{submittedOrderId}</span>. {t.checkout.successDesc}
          </p>

          <div className="space-y-3">
            <button
              id="btn-success-view-orders"
              onClick={() => navigate('/requests')}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-[#FF5A00] hover:bg-[#e04f00] transition-all cursor-pointer shadow-md shadow-[#FF5A00]/25"
            >
              {language === 'ru' ? 'Посмотреть статус заявки' : 'Zayavka holatini ko‘rish'}
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-6 rounded-2xl font-bold text-xs text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition-all cursor-pointer"
            >
              {t.checkout.backHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 py-16">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-[#E5EAF2] p-8 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center mx-auto mb-4 border border-[#FF5A00]/20">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#1E293B] mb-2">
            {t.cart.emptyTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mb-6">
            {t.cart.emptyDesc}
          </p>
          <button
            onClick={() => navigate('/catalog')}
            className="w-full py-3.5 rounded-2xl bg-[#FF5A00] text-white font-bold text-sm shadow-md shadow-[#FF5A00]/25 hover:bg-[#e04f00] transition-all cursor-pointer"
          >
            {t.cart.toCatalog}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#64748B] mb-5 font-medium">
        <button onClick={() => navigate('/')} className="hover:text-[#FF5A00] transition-colors cursor-pointer">
          {language === 'ru' ? 'Главная' : 'Bosh sahifa'}
        </button>
        <span>/</span>
        <span className="text-[#FF5A00] font-bold">{t.checkout.title}</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight">
          {t.checkout.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1">
          {t.checkout.b2bGuarantee}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left: Contact Details (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E5EAF2] p-6 sm:p-8 shadow-xs space-y-5">
          {/* Smart Customer Card for repeat orders */}
          {hasSavedContact && !isEditingContact ? (
            <div className="bg-[#FFF7ED] border border-[#FF5A00]/25 rounded-3xl p-4 sm:p-6 transition-all">
              <div className="flex items-start sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-[#FF5A00] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#FF5A00]/25 mt-0.5 sm:mt-0">
                    <Check className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#1E293B] leading-tight">
                      {language === 'ru' ? 'Данные предыдущего заказа' : 'Oldingi buyurtma ma’lumotlaringiz'}
                    </h3>
                    <p className="text-[10.5px] sm:text-[11px] text-[#64748B] mt-0.5 leading-snug">
                      {language === 'ru'
                        ? 'Ваши данные заполнены автоматически'
                        : 'Ma’lumotlaringiz avtomatik saqlangan holda to‘ldirildi'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingContact(true)}
                  className="px-2.5 sm:px-3.5 py-1.5 rounded-xl sm:rounded-2xl bg-white border border-[#FF5A00]/30 hover:bg-[#FFF7ED] text-[11px] sm:text-xs font-bold text-[#FF5A00] transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 shadow-2xs shrink-0"
                >
                  <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{language === 'ru' ? 'Изменить' : 'O‘zgartirish'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#FF5A00]/15">
                <div>
                  <span className="text-[11px] font-medium text-[#64748B]">
                    {language === 'ru' ? 'Получатель:' : 'Qabul qiluvchi:'}
                  </span>
                  <p className="text-sm font-extrabold text-[#1E293B]">{name}</p>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-[#64748B]">{t.checkout.phone}:</span>
                  <p className="text-sm font-extrabold text-[#1E293B]">{phone}</p>
                </div>
                {company && (
                  <div className="sm:col-span-2">
                    <span className="text-[11px] font-medium text-[#64748B]">{t.checkout.company}:</span>
                    <p className="text-xs font-bold text-[#1E293B]">{company}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div>
                  <h2 className="text-base font-extrabold text-[#1E293B]">
                    {hasSavedContact
                      ? (language === 'ru' ? 'Редактирование данных' : 'Ma’lumotlarni tahrirlash')
                      : t.checkout.contactInfo}
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {hasSavedContact
                      ? (language === 'ru' ? 'Новые данные сохранятся для последующих заказов' : 'Yangi ma’lumotlaringiz keyingi buyurtmalar uchun saqlanadi')
                      : (language === 'ru' ? 'Сохранится при первом заказе и больше не потребуется вводить' : 'Birinchi buyurtmangizda saqlanadi va keyingi safar qayta so‘ralmaydi')}
                  </p>
                </div>

                {hasSavedContact && (
                  <button
                    type="button"
                    onClick={() => setIsEditingContact(false)}
                    className="text-xs font-bold text-[#64748B] hover:text-[#1E293B] cursor-pointer"
                  >
                    {t.common.cancel}
                  </button>
                )}
              </div>

              {/* Ism */}
              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                  {t.checkout.fullName} <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-request-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder={t.checkout.fullNamePlaceholder}
                  className={`w-full h-11 px-4 rounded-2xl bg-[#F8FAFC] text-xs sm:text-sm font-semibold text-[#1E293B] border transition-all focus:outline-none focus:bg-white ${
                    errors.name
                      ? 'border-red-500 ring-2 ring-red-200'
                      : 'border-[#E2E8F0] focus:border-[#FF5A00]'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Telefon */}
              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                  {t.checkout.phone} <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-request-phone"
                  type="text"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="+998 __ ___ __ __"
                  className={`w-full h-11 px-4 rounded-2xl bg-[#F8FAFC] text-xs sm:text-sm font-semibold text-[#1E293B] border transition-all focus:outline-none focus:bg-white ${
                    errors.phone
                      ? 'border-red-500 ring-2 ring-red-200'
                      : 'border-[#E2E8F0] focus:border-[#FF5A00]'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Kompaniya Nomi */}
              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                  {t.checkout.company}
                </label>
                <input
                  id="input-request-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={t.checkout.companyPlaceholder}
                  className="w-full h-11 px-4 rounded-2xl bg-[#F8FAFC] text-xs sm:text-sm font-semibold text-[#1E293B] border border-[#E2E8F0] focus:outline-none focus:border-[#FF5A00] focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          {/* Izoh / Comment for this specific order */}
          <div>
            <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
              {t.checkout.comment}
            </label>
            <textarea
              id="input-request-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t.checkout.commentPlaceholder}
              className="w-full p-4 rounded-2xl bg-[#F8FAFC] text-xs sm:text-sm font-medium text-[#1E293B] border border-[#E2E8F0] focus:outline-none focus:border-[#FF5A00] focus:bg-white transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#16A34A] bg-[#DCFCE7] px-4 py-2.5 rounded-2xl">
            <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span>{t.checkout.b2bGuarantee}</span>
          </div>
        </div>

        {/* Right: Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-[#E5EAF2] p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <h2 className="text-base font-extrabold text-[#1E293B]">
                {language === 'ru' ? 'Состав заявки' : 'Zayavka tarkibi'}
              </h2>
              <span className="text-xs font-bold text-[#FF5A00] bg-[#FFF7ED] px-2.5 py-0.5 rounded-full border border-[#FF5A00]/20">
                {cart.length} {language === 'ru' ? 'наименований' : 'xil tovar'}
              </span>
            </div>

            <div className="divide-y divide-[#F1F5F9] max-h-[320px] overflow-y-auto pr-1">
              {cart.map(({ product, quantity }) => {
                const productName = getProductName(product);

                return (
                  <div key={product.id} className="py-3 flex items-center gap-3">
                    <img
                      src={getMediaUrl(product.images[0])}
                      alt={productName}
                      className="w-12 h-12 rounded-2xl object-contain border border-[#E2E8F0] bg-white shrink-0 p-1"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#1E293B] truncate">
                        {productName}
                      </h4>
                      <span className="text-[11px] font-medium text-[#64748B]">
                        {quantity} {formatUnit(product.unit)} x {product.price.toLocaleString('uz-UZ')} {t.productCard.sum}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-[#FF5A00]">
                        {(product.price * quantity).toLocaleString('uz-UZ')} {t.productCard.sum}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-[#F1F5F9] space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="font-bold text-sm text-[#64748B]">{t.cart.total}:</span>
                <span className="text-2xl font-black text-[#1E293B]">
                  {cartTotal.toLocaleString('uz-UZ')}{' '}
                  <span className="text-sm font-bold text-[#FF5A00]">{t.productCard.sum}</span>
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                {language === 'ru'
                  ? '* Включая НДС, оплата по договору.'
                  : '* QQS kiritilgan, to‘lov shartnoma bo‘yicha amalga oshiriladi.'}
              </p>
            </div>

            {/* Submit Button */}
            <button
              id="btn-submit-request-action"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white bg-[#FF5A00] hover:bg-[#e04f00] shadow-md shadow-[#FF5A00]/25 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t.checkout.submitting}</span>
                </span>
              ) : (
                <>
                  <span>{t.checkout.submit}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
