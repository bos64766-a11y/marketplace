import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CONTACT_INFO } from '../data/content';
import { Phone, Send, Clock, MapPin, Mail, MessageSquare, Check, ArrowRight, Loader2 } from 'lucide-react';

export const ContactsPage: React.FC = () => {
  const { showToast, siteSettings, submitRequest } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const phone1 = siteSettings?.phone1 || CONTACT_INFO.phones[0] || '+998 87 034 97 79';
  const phone2 = siteSettings?.phone2 || CONTACT_INFO.phones[1] || '+998 90 123 45 67';
  const telegramBot = siteSettings?.telegramBot || CONTACT_INFO.telegram || '@snabtash_bot';
  const workHours = siteSettings?.workHours || CONTACT_INFO.workHours || 'Dush - Shan: 08:30 - 18:30';
  const address = siteSettings?.address || CONTACT_INFO.address || 'Toshkent sh., Chilonzor tumani, Bunyodkor shox ko‘chasi, 42-uy';
  const email = siteSettings?.email || CONTACT_INFO.email || 'info@snabtash.uz';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, '').length < 9) {
      showToast('Ism va telefon raqamni to‘liq kiriting', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      submitRequest({
        items: [],
        totalAmount: 0,
        contact: {
          name: name.trim(),
          phone: phone.trim(),
          comment: `[Aloqa / Murojaat so‘rovi]: ${message.trim() || 'Mijoz aloqa va maslahat so‘radi.'}`,
        },
      });

      setSent(true);
      showToast('Xabaringiz qabul qilindi! Menejerimiz tez orada bog‘lanadi.', 'success');
    } catch (err) {
      showToast('Xabar yuborishda xatolik yuz berdi. Iltimos qaytadan urinib ko‘ring.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A00] bg-[#FFF1E8] px-3 py-1 rounded-full border border-[#FF5A00]/20">
          Aloqa va manzil
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2E73] tracking-tight">
          Biz bilan bog‘laning
        </h1>
        <p className="text-xs sm:text-sm text-[#667085]">
          B2B ta’minot, mahsulotlar mavjudligi va maxsus shartnomalar bo‘yicha savollaringiz bormi?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Phone */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5EAF2] shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0B2E73] uppercase tracking-wider">Telefonlar</h3>
              <div className="mt-1.5 space-y-1">
                <a
                  href={`tel:${phone1.replace(/\s+/g, '')}`}
                  className="text-sm sm:text-base font-bold text-[#14213D] hover:text-[#FF5A00] block"
                >
                  {phone1}
                </a>
                {phone2 && (
                  <a
                    href={`tel:${phone2.replace(/\s+/g, '')}`}
                    className="text-sm font-semibold text-[#667085] hover:text-[#FF5A00] block"
                  >
                    {phone2}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Telegram */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5EAF2] shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center shrink-0">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0B2E73] uppercase tracking-wider">Telegram Menejer</h3>
              <a
                href={`https://t.me/${telegramBot.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base font-bold text-[#14213D] hover:text-[#FF5A00] block mt-1.5"
              >
                {telegramBot}
              </a>
              <span className="text-xs text-[#667085]">Tezkor savol-javob va narxlar</span>
            </div>
          </div>

          {/* Card 3: Working Hours */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5EAF2] shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F9FC] text-[#0B2E73] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0B2E73] uppercase tracking-wider">Ish vaqti</h3>
              <p className="text-sm font-bold text-[#14213D] mt-1.5">{workHours}</p>
              <p className="text-xs text-[#667085]">Buyurtmalar 24/7 qabul qilinadi</p>
            </div>
          </div>

          {/* Card 4: Address */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5EAF2] shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F9FC] text-[#0B2E73] flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0B2E73] uppercase tracking-wider">Bosh ofis & Ombor</h3>
              <p className="text-xs sm:text-sm text-[#14213D] font-semibold mt-1.5 leading-relaxed">
                {address}
              </p>
            </div>
          </div>

          {/* Card 5: Email */}
          {email && (
            <div className="p-6 rounded-3xl bg-white border border-[#E5EAF2] shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F7F9FC] text-[#0B2E73] flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#0B2E73] uppercase tracking-wider">Elektron pochta</h3>
                <a
                  href={`mailto:${email}`}
                  className="text-sm font-bold text-[#14213D] hover:text-[#FF5A00] block mt-1.5"
                >
                  {email}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Right: Interactive Consultation / Message Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E5EAF2] p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-[#0B2E73] mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#FF5A00]" />
            <span>Murojaat yoki savol qoldirish</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] mb-6">
            Bizga xabar qoldiring, korporativ mutaxassisimiz siz bilan qisqa vaqt ichida bog‘lanadi.
          </p>

          {sent ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-emerald-900">Rahmat! Xabaringiz yuborildi</h3>
              <p className="text-xs text-emerald-700">
                Mutaxassisimiz ko‘rsatilgan raqamga qo‘ng‘iroq qiladi yoki Telegram orqali javob beradi.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setName('');
                  setMessage('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-semibold text-emerald-800"
              >
                Yana xabar yuborish
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                  Ismingiz <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ismingizni kiriting"
                  className="w-full h-11 px-4 rounded-xl bg-[#F7F9FC] text-sm text-[#14213D] border border-[#E5EAF2] focus:outline-none focus:border-[#0B2E73] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                  Telefon raqamingiz <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 __ ___ __ __"
                  className="w-full h-11 px-4 rounded-xl bg-[#F7F9FC] text-sm text-[#14213D] border border-[#E5EAF2] focus:outline-none focus:border-[#0B2E73] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                  Xabaringiz yoki savolingiz
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Qanday mahsulotlar yoki shartnomalar haqida ma’lumot olmoqchisiz?..."
                  className="w-full p-4 rounded-xl bg-[#F7F9FC] text-sm text-[#14213D] border border-[#E5EAF2] focus:outline-none focus:border-[#0B2E73] focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#0B2E73] hover:bg-[#08245A] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Yuborilmoqda...</span>
                  </>
                ) : (
                  <>
                    <span>Xabarni yuborish</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Map Preview Card */}
          <div className="mt-8 pt-6 border-t border-[#E5EAF2]">
            <div className="rounded-2xl bg-[#F7F9FC] border border-[#E5EAF2] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#FF5A00]" />
                <div>
                  <h4 className="text-xs font-bold text-[#0B2E73]">Tashkent Index A3-blok</h4>
                  <p className="text-[11px] text-[#667085]">Sergeli tumani, Yangi Sergeli ko‘chasi</p>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=Tashkent+Index"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E5EAF2] text-xs font-semibold text-[#0B2E73] hover:bg-[#FFF1E8] hover:text-[#FF5A00] transition-colors"
              >
                Xaritada ochish ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
