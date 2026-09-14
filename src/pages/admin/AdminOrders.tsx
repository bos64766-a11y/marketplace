/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Phone,
  Building2,
  MessageSquare,
  Package,
  Download,
} from 'lucide-react';
import type { RequestOrder } from '../../types';

const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const STATUS_OPTIONS: RequestOrder['status'][] = [
  "Ko\u2018rib chiqilmoqda",
  'Tasdiqlangan',
  'Yetkazilmoqda',
  'Bajarildi',
];

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  "Ko\u2018rib chiqilmoqda": { bg: '#FEF3C7', text: '#D97706', dot: '#F59E0B' },
  'Tasdiqlangan': { bg: '#DBEAFE', text: '#2563EB', dot: '#3B82F6' },
  'Yetkazilmoqda': { bg: '#EDE9FE', text: '#7C3AED', dot: '#8B5CF6' },
  'Bajarildi': { bg: '#D1FAE5', text: '#059669', dot: '#10B981' },
};

type FilterTab = 'all' | RequestOrder['status'];

export const AdminOrders: React.FC = () => {
  const { requests, updateRequestStatus, exportBackupJSON } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let result = requests;
    if (activeTab !== 'all') {
      result = result.filter((r) => r.status === activeTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.contact.name.toLowerCase().includes(q) ||
          (r.contact.company && r.contact.company.toLowerCase().includes(q))
      );
    }
    return result;
  }, [requests, activeTab, searchQuery]);

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'Hammasi', count: requests.length },
    { key: "Ko\u2018rib chiqilmoqda", label: "Ko\u2018rib chiqilmoqda", count: requests.filter((r) => r.status === "Ko\u2018rib chiqilmoqda").length },
    { key: 'Tasdiqlangan', label: 'Tasdiqlangan', count: requests.filter((r) => r.status === 'Tasdiqlangan').length },
    { key: 'Yetkazilmoqda', label: 'Yetkazilmoqda', count: requests.filter((r) => r.status === 'Yetkazilmoqda').length },
    { key: 'Bajarildi', label: 'Bajarildi', count: requests.filter((r) => r.status === 'Bajarildi').length },
  ];

  const toggleExpand = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  return (
    <AdminLayout activeTab="orders">
      <div className="space-y-5">
        {/* Header with Mockup Typography */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">Zayavkalar Boshqaruvi</h1>
            <p className="text-xs font-medium text-[#94A3B8] mt-0.5">
              Barcha kelib tushgan B2B buyurtmalar va so'rovlar ({requests.length} ta)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportBackupJSON}
              className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              title="Barcha zayavkalar, tovarlar va sozlamalarni .json zaxira fayliga yuklab olish"
            >
              <Download className="w-4 h-4 text-gray-500" />
              <span>Zaxira (.json)</span>
            </button>
          </div>
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2
                  ${activeTab === tab.key
                    ? 'bg-[#FF5A00] text-white shadow-md shadow-[#FF5A00]/25'
                    : 'bg-white text-[#475569] hover:bg-[#F8FAFC] border border-[#E2E8F0]'
                  }
                `}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeTab === tab.key ? 'bg-white text-[#FF5A00]' : 'bg-[#F1F5F9] text-[#64748B]'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ID, mijoz yoki kompaniya..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E2E8F0] text-xs font-medium text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A00] transition-colors"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const sc = STATUS_COLORS[order.status] || STATUS_COLORS['Bajarildi'];

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-2xs border border-[#F1F5F9] overflow-hidden transition-all hover:shadow-md"
              >
                {/* Order Header Row */}
                <button
                  onClick={() => toggleExpand(order.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-[#FAFBFD] transition-colors text-left"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#FF5A00] flex items-center justify-center shrink-0 border border-[#FF5A00]/20">
                      <ClipboardList className="w-5 h-5 text-[#475569]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-[#0B2E73]">#{order.id}</span>
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ backgroundColor: sc.bg, color: sc.text }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sc.dot }} />
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-[#94A3B8]">
                        <span>{order.date}</span>
                        <span>•</span>
                        <span className="font-medium text-[#475569]">{order.contact.name}</span>
                        {order.contact.company && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">{order.contact.company}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold text-[#0F172A] hidden sm:block">
                      {formatPrice(order.totalAmount)} so'm
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-[#F1F5F9] p-4 sm:p-5 bg-[#FAFBFD]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {/* Left: Order Items */}
                      <div>
                        <h4 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                          Buyurtma Mahsulotlari ({order.items.length})
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#E2E8F0]/60">
                              <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] overflow-hidden shrink-0">
                                {item.product.images?.[0] && (
                                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-[#0F172A] truncate">{item.product.name}</p>
                                <p className="text-[10px] text-[#94A3B8]">
                                  {item.quantity} × {formatPrice(item.product.price)} so'm
                                </p>
                              </div>
                              <span className="text-xs font-bold text-[#FF5A00] shrink-0">
                                {formatPrice(item.quantity * item.product.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#64748B]">Jami:</span>
                          <span className="text-sm font-extrabold text-[#0F172A]">{formatPrice(order.totalAmount)} so'm</span>
                        </div>
                      </div>

                      {/* Right: Contact Info + Status Change */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                            Mijoz Ma'lumotlari
                          </h4>
                          <div className="space-y-2.5 p-3.5 rounded-xl bg-white border border-[#E2E8F0]/60">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-[#0B2E73]">
                                  {order.contact.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-[#0F172A]">{order.contact.name}</p>
                                {order.contact.inn && (
                                  <p className="text-[10px] text-[#94A3B8]">INN: {order.contact.inn}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#475569]">
                              <Phone className="w-3.5 h-3.5 text-[#94A3B8]" />
                              <span className="font-medium">{order.contact.phone}</span>
                            </div>
                            {order.contact.company && (
                              <div className="flex items-center gap-2 text-xs text-[#475569]">
                                <Building2 className="w-3.5 h-3.5 text-[#94A3B8]" />
                                <span className="font-medium">{order.contact.company}</span>
                              </div>
                            )}
                            {order.contact.comment && (
                              <div className="flex items-start gap-2 text-xs text-[#475569]">
                                <MessageSquare className="w-3.5 h-3.5 text-[#94A3B8] mt-0.5 shrink-0" />
                                <span className="font-medium">{order.contact.comment}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Change */}
                        <div>
                          <h4 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                            Holatni O'zgartirish
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map((status) => {
                              const colors = STATUS_COLORS[status];
                              const isActive = order.status === status;
                              return (
                                <button
                                  key={status}
                                  onClick={() => updateRequestStatus(order.id, status)}
                                  className={`
                                    px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer border
                                    ${isActive
                                      ? 'shadow-md scale-105'
                                      : 'opacity-60 hover:opacity-100'
                                    }
                                  `}
                                  style={{
                                    backgroundColor: isActive ? colors.bg : '#F8FAFC',
                                    color: isActive ? colors.text : '#64748B',
                                    borderColor: isActive ? colors.dot : '#E2E8F0',
                                  }}
                                >
                                  {status}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center shadow-xs border border-[#E2E8F0]/60">
              <Package className="w-10 h-10 text-[#CBD5E1] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#64748B]">Zayavka topilmadi</p>
              <p className="text-xs text-[#94A3B8] mt-1">Qidiruv yoki filterni o'zgartiring</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
