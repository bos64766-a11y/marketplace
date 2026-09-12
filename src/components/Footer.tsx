import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { CONTACT_INFO } from '../data/content';
import { Phone, Send, MapPin, Clock, ShieldCheck, Mail, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, siteSettings, t } = useApp();

  return (
    <footer className="bg-[#0B1E48] text-white pt-14 pb-24 md:pb-12 mt-16 border-t border-[#1E356D]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="w-fit">
              <Logo variant="dark" size="lg" />
            </div>
            <p className="text-[14px] text-gray-300 font-normal leading-[1.55]">
              {t.footer.aboutDesc}
            </p>
            <div className="flex items-center gap-2 text-[12px] font-medium text-white bg-white/10 px-3.5 py-2 rounded-xl border border-white/15 w-fit">
              <ShieldCheck className="w-4 h-4 text-[#FF5A00]" />
              <span>{t.footer.b2bContractEfactura}</span>
            </div>
          </div>

          {/* Col 2: Kompaniya */}
          <div>
            <h4 className="font-bold text-[14px] text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
              <span>{t.footer.companyTitle}</span>
            </h4>
            <ul className="space-y-2.5 text-[14px] font-normal">
              <li>
                <button
                  id="footer-link-about"
                  onClick={() => navigate('/about')}
                  className="text-gray-300 hover:text-[#FF5A00] transition-colors cursor-pointer"
                >
                  {t.footer.aboutUs}
                </button>
              </li>
              <li>
                <button
                  id="footer-link-delivery"
                  onClick={() => navigate('/delivery-payment')}
                  className="text-gray-300 hover:text-[#FF5A00] transition-colors cursor-pointer"
                >
                  {t.footer.deliveryPayment}
                </button>
              </li>
              <li>
                <button
                  id="footer-link-contacts"
                  onClick={() => navigate('/contacts')}
                  className="text-gray-300 hover:text-[#FF5A00] transition-colors cursor-pointer"
                >
                  {t.footer.contacts}
                </button>
              </li>
              <li>
                <button
                  id="footer-link-profile"
                  onClick={() => navigate('/requests')}
                  className="text-gray-300 hover:text-[#FF5A00] transition-colors cursor-pointer"
                >
                  {t.footer.ordersHistory}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Xizmatlar & To'plamlar */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#009B5A]" />
              <span>{t.footer.servicesTitle}</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  id="footer-link-catalog"
                  onClick={() => navigate('/catalog')}
                  className="text-gray-300 hover:text-[#FF5A00] transition-colors cursor-pointer"
                >
                  {t.footer.allCatalog}
                </button>
              </li>
              <li>
                <button
                  id="footer-link-request"
                  onClick={() => navigate('/request')}
                  className="text-gray-300 hover:text-[#FF5A00] transition-colors cursor-pointer"
                >
                  {t.footer.leaveRequest}
                </button>
              </li>
              <li>
                <button
                  id="footer-link-my-requests"
                  onClick={() => navigate('/requests')}
                  className="text-gray-300 hover:text-[#FF5A00] transition-colors cursor-pointer"
                >
                  {t.footer.myRequests}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Aloqa (Synced with Admin Settings) */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{t.footer.contactCenter}</span>
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#FF5A00] shrink-0 mt-0.5" />
                <div>
                  <a href={`tel:${(siteSettings?.phone1 || '+998870349779').replace(/\s+/g, '')}`} className="hover:text-white font-semibold block">
                    {siteSettings?.phone1 || '+998 87 034 97 79'}
                  </a>
                  {siteSettings?.phone2 && (
                    <a href={`tel:${siteSettings.phone2.replace(/\s+/g, '')}`} className="hover:text-white font-semibold block">
                      {siteSettings.phone2}
                    </a>
                  )}
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-[#FF5A00] shrink-0" />
                <a
                  href={`https://t.me/${(siteSettings?.telegramBot || 'snabtash_bot').replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white font-medium"
                >
                  {siteSettings?.telegramBot || '@snabtash_bot'}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>
                  {siteSettings?.workHours || 'Dush - Shan: 08:30 - 18:30'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>{siteSettings?.address || 'Toshkent sh., Chilonzor tumani, Bunyodkor shox ko‘chasi, 42-uy'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & Admin portal link */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 font-medium text-white">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              {t.footer.availableProducts}
            </span>
            <span>Toshkent shahri, Sergeli tumani, Index A3</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="text-gray-400 hover:text-[#FF5A00] transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span>{t.footer.adminLogin}</span>
            </button>
            <span>© 2026 SNABTASH. {t.footer.rights}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
