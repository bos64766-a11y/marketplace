import React from 'react';
import { useApp } from '../context/AppContext';
import { Truck, Boxes, CreditCard, Sparkles } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Truck: <Truck className="w-7 h-7" />,
  Boxes: <Boxes className="w-7 h-7" />,
  CreditCard: <CreditCard className="w-7 h-7" />,
  Sparkles: <Sparkles className="w-7 h-7" />,
};

export const B2BInfoCards: React.FC = () => {
  const { t } = useApp();

  return (
    <section className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {t.b2bInfoCards.items.map((card) => (
          <div
            key={card.id}
            id={`b2b-info-card-${card.id}`}
            className="p-5 sm:p-6 rounded-2xl bg-white border border-[#F1F5F9] hover:border-[#FF5A00]/40 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Ambient top border accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5A00] to-[#FF8A00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#FF5A00] flex items-center justify-center mb-4 group-hover:bg-[#FF5A00] group-hover:text-white transition-all shadow-2xs border border-[#FF5A00]/20">
                {iconMap[card.icon]}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF5A00]">
                {card.badge}
              </span>
              <h3 className="text-[16px] sm:text-[17px] font-extrabold text-[#1E293B] mt-1 group-hover:text-[#FF5A00] transition-colors leading-[1.3]">
                {card.title}
              </h3>
              <p className="text-[13px] text-[#64748B] mt-2 leading-[1.55] font-medium">
                {card.description}
              </p>
            </div>

            <div className="mt-4 pt-3.5 border-t border-[#F8FAFC] flex items-center justify-between text-[11px] font-bold text-[#1E293B]">
              <span>{t.b2bInfoCards.guarantee}</span>
              <span className="text-[#16A34A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full text-xs font-bold">
                {t.b2bInfoCards.b2bStandard}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
