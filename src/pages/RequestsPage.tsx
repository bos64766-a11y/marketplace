import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, ChevronDown, ChevronUp, Clock, CheckCircle2, ArrowRight, Building2, Phone } from 'lucide-react';

export const RequestsPage: React.FC = () => {
  const { requests, navigate } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(requests[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5EAF2]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2E73] tracking-tight">
            Mening zayavkalarim
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Yuborilgan barcha B2B ta’minot so‘rovlari va ularning holati
          </p>
        </div>

        <button
          onClick={() => navigate('/request')}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF5A00] text-white text-xs font-bold hover:bg-[#e04f00] transition-colors cursor-pointer shadow-xs"
        >
          <span>Yangi zayavka</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {requests.length > 0 ? (
        <div className="space-y-4 max-w-4xl">
          {requests.map((order) => {
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

                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
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
                            <img
                              src={product.images[0]}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover border border-[#E5EAF2]"
                            />
                            <div>
                              <strong className="text-[#14213D] block">{product.name}</strong>
                              <span className="text-[#667085]">
                                {quantity} x {product.price.toLocaleString('uz-UZ')} so‘m
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
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-[#E5EAF2] p-8 text-center shadow-xs my-8">
          <div className="w-16 h-16 rounded-full bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#0B2E73] mb-2">Hozircha zayavkalar yo‘q</h2>
          <p className="text-xs sm:text-sm text-[#667085] mb-6">
            Katalogdan kerakli tovarlarni tanlab, birinchi B2B zayavkangizni qoldiring.
          </p>
          <button
            onClick={() => navigate('/catalog')}
            className="w-full py-3 rounded-xl bg-[#0B2E73] text-white font-bold text-xs"
          >
            Katalogga o‘tish
          </button>
        </div>
      )}
    </div>
  );
};
