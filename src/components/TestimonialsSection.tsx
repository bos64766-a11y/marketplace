import React from 'react';
import { TESTIMONIALS } from '../data/content';
import { Star, Quote, CheckCircle } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="section-testimonials" className="max-w-[1536px] mx-auto px-4 sm:px-8 py-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <h2 className="text-[24px] sm:text-[26px] md:text-[30px] lg:text-[32px] font-bold text-[#0B2E73] tracking-[-0.02em] leading-[1.25]">
          Mijozlarimiz biz haqimizda
        </h2>
        <p className="text-[14px] sm:text-[15px] text-[#64748B] font-normal leading-[1.5] mt-1.5">
          O‘zbekistonning yetakchi korxonalari va kompaniyalari nega aynan SNABTASH’ni tanlashadi?
        </p>
      </div>

      {/* Testimonials 3-Card Grid (Mockup Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#0B2E73]/30 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 relative group"
          >
            <Quote className="absolute top-5 right-5 w-8 h-8 text-[#0B2E73]/10 group-hover:text-[#FF5A00]/20 transition-colors" />

            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]"
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-[14px] sm:text-[15px] text-[#334155] leading-[1.55] font-normal italic mb-6">
                “{t.comment}”
              </p>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#F1F5F9]">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-[#E2E8F0]"
              />
              <div>
                <h4 className="text-[14px] font-semibold text-[#0F172A]">{t.name}</h4>
                <p className="text-[12px] font-normal text-[#64748B]">{t.role}</p>
                <p className="text-[12px] font-medium text-[#0B2E73]">{t.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
