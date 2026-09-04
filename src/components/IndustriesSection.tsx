import React from 'react';
import { useApp } from '../context/AppContext';
import { INDUSTRIES } from '../data/content';
import {
  Building2,
  UtensilsCrossed,
  Sparkles,
  Factory,
  Car,
  GraduationCap,
  Hospital,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-6 h-6" />,
  UtensilsCrossed: <UtensilsCrossed className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Factory: <Factory className="w-6 h-6" />,
  Car: <Car className="w-6 h-6" />,
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  Hospital: <Hospital className="w-6 h-6" />,
};

export const IndustriesSection: React.FC = () => {
  const { navigate } = useApp();

  return (
    <section className="max-w-[1536px] mx-auto px-4 sm:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[24px] sm:text-[26px] md:text-[30px] lg:text-[32px] font-bold text-[#14213D] tracking-[-0.02em] leading-[1.25]">
          Biz kimlar uchun ishlaymiz?
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {INDUSTRIES.map((ind) => (
          <button
            key={ind.id}
            id={`industry-card-${ind.id}`}
            onClick={() => {
              if (ind.slug) {
                navigate(`/catalog/${ind.slug}`);
              } else {
                navigate('/catalog');
              }
            }}
            className="group bg-white rounded-[16px] border border-[#E5EAF2] hover:border-[#FF5A00] p-4 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center text-center gap-3"
          >
            <div className="w-14 h-14 rounded-[12px] bg-[#EBF3FF] text-[#0B2E73] group-hover:bg-[#FF5A00] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
              {iconMap[ind.icon] || <Building2 className="w-6 h-6" />}
            </div>

            <h3 className="font-semibold text-xs sm:text-sm text-[#14213D] group-hover:text-[#0B2E73] transition-colors line-clamp-2">
              {ind.title}
            </h3>
          </button>
        ))}
      </div>
    </section>
  );
};
