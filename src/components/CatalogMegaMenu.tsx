import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import {
  Sparkles,
  HeartHandshake,
  FileSpreadsheet,
  Car,
  HardHat,
  Shirt,
  ArrowRight,
  Boxes,
  PhoneCall
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5 stroke-[1.8]" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5 stroke-[1.8]" />,
  HandHeart: <HeartHandshake className="w-5 h-5 stroke-[1.8]" />,
  FileSpreadsheet: <FileSpreadsheet className="w-5 h-5 stroke-[1.8]" />,
  FileText: <FileSpreadsheet className="w-5 h-5 stroke-[1.8]" />,
  Car: <Car className="w-5 h-5 stroke-[1.8]" />,
  HardHat: <HardHat className="w-5 h-5 stroke-[1.8]" />,
  ShieldCheck: <HardHat className="w-5 h-5 stroke-[1.8]" />,
  Shirt: <Shirt className="w-5 h-5 stroke-[1.8]" />,
};

export const CatalogMegaMenu: React.FC = () => {
  const { isCatalogOpen, setIsCatalogOpen, navigate, categories } = useApp();

  if (!isCatalogOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 top-[100px] sm:top-[104px] bg-black/40 z-40 backdrop-blur-[2px] transition-opacity"
        onClick={() => setIsCatalogOpen(false)}
      />

      {/* Menu Container */}
      <div className="fixed top-[100px] sm:top-[104px] left-0 w-full bg-white border-b border-[#E5EAF2] shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="max-w-[1536px] mx-auto px-6 py-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5EAF2]">
            <div>
              <h2 className="text-xl font-extrabold text-[#1E293B]">Mahsulotlar katalogi</h2>
              <p className="text-sm text-[#64748B]">
                Korxonangiz uchun kerakli bo‘limni tanlang
              </p>
            </div>
            <button
              id="btn-view-all-catalog"
              onClick={() => {
                navigate('/catalog');
                setIsCatalogOpen(false);
              }}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#FF5A00] hover:text-[#e04f00] transition-colors cursor-pointer"
            >
              <span>Barcha mahsulotlarni ko‘rish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`btn-mega-category-${cat.slug}`}
                onClick={() => {
                  navigate(`/catalog/${cat.slug}`);
                  setIsCatalogOpen(false);
                }}
                className="flex items-start gap-3.5 p-4 rounded-2xl border border-[#F1F5F9] hover:border-[#FF5A00]/40 hover:bg-[#FFF7ED]/30 transition-all text-left group cursor-pointer bg-white shadow-2xs hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#FF5A00] border border-[#FF5A00]/20 p-1 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    iconMap[cat.icon] || <Boxes className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-[#1E293B] group-hover:text-[#FF5A00] transition-colors truncate">
                      {cat.name}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FFF7ED] text-[#FF5A00] font-bold shrink-0">
                      {cat.count}+
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] font-medium line-clamp-2 mt-1">
                    {cat.description}
                  </p>
                </div>
              </button>
            ))}

            {/* Quick Contact & Consultation CTA in Menu */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#0B2E73] to-[#08245A] text-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5A00]">
                  B2B Menejer
                </span>
                <h4 className="font-bold text-sm mt-1">Maxsus buyurtma bormi?</h4>
                <p className="text-xs text-white/80 mt-1">
                  Katalogda yo‘q mahsulotlar bo‘yicha to‘g‘ridan-to‘g‘ri menejerga so‘rov yuboring.
                </p>
              </div>
              <button
                id="btn-mega-request-consult"
                onClick={() => {
                  navigate('/contacts');
                  setIsCatalogOpen(false);
                }}
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#FF5A00] bg-white px-3 py-2 rounded-lg hover:bg-[#FFF1E8] transition-colors cursor-pointer w-fit"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Menejer bilan bog‘lanish</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
