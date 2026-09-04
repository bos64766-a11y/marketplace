import React from 'react';
import { PARTNERS } from '../data/content';
import { ShieldCheck } from 'lucide-react';

export const PartnersSection: React.FC = () => {
  return (
    <section className="max-w-[1536px] mx-auto px-4 sm:px-8 py-8 border-t border-[#EEF2F6]">
      <div className="text-center max-w-xl mx-auto mb-6">
        <h3 className="text-[13px] sm:text-[14px] font-semibold text-[#64748B] uppercase tracking-wider">
          500+ yetakchi korxonalar va kompaniyalar ishonchi
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {PARTNERS.map((partner) => (
          <div
            key={partner.id}
            id={`partner-card-${partner.id}`}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0B2E73]/40 hover:shadow-xs transition-all duration-200 text-center group cursor-default min-h-[75px]"
          >
            <span className="font-bold text-[14px] text-[#0B2E73] group-hover:text-[#FF5A00] transition-colors">
              {partner.name}
            </span>
            <span className="text-[12px] text-[#64748B] font-normal mt-0.5">
              {partner.category}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
