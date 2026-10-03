/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import {
  ShoppingBag,
  Package,
  Coins,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  ClipboardList,
} from 'lucide-react';

const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const AdminDashboard: React.FC = () => {
  const { products, requests, categories, navigate } = useApp();

  // Active hover states for interactive charts
  const [activeDonutIndex, setActiveDonutIndex] = useState<number>(0);
  const [activeBarDay, setActiveBarDay] = useState<string>('Dush');

  // 1. Real Dynamic Calculations
  const totalRevenue = useMemo(() => {
    return requests.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  }, [requests]);

  const pendingOrders = useMemo(() => {
    return requests.filter((r) => r.status === "Ko‘rib chiqilmoqda");
  }, [requests]);

  const confirmedOrders = useMemo(() => {
    return requests.filter((r) => r.status === 'Tasdiqlangan');
  }, [requests]);

  const deliveringOrders = useMemo(() => {
    return requests.filter((r) => r.status === 'Yetkazilmoqda');
  }, [requests]);

  const completedOrders = useMemo(() => {
    return requests.filter((r) => r.status === 'Bajarildi');
  }, [requests]);

  const completedRevenue = useMemo(() => {
    return completedOrders.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  }, [completedOrders]);

  const inStockProducts = useMemo(() => {
    return products.filter((p) => p.inStock);
  }, [products]);

  const averageOrder = useMemo(() => {
    return requests.length > 0 ? Math.round(totalRevenue / requests.length) : 0;
  }, [requests, totalRevenue]);

  // 2. Real Metric Cards Data (100% genuine dynamic values)
  const statCards = [
    {
      title: 'Jami zayavkalar',
      value: `${requests.length} ta`,
      badge: pendingOrders.length > 0 ? `${pendingOrders.length} ta kutilmoqda` : 'Barchasi ko‘rib chiqilgan',
      isPositive: pendingOrders.length === 0,
      icon: <ShoppingBag className="w-5 h-5 text-[#FF5A00]" />,
      iconBg: 'bg-[#FFF7ED]',
    },
    {
      title: 'Faol mahsulotlar',
      value: `${products.length} ta`,
      badge: `${inStockProducts.length} ta omborda mavjud`,
      isPositive: inStockProducts.length > 0,
      icon: <Package className="w-5 h-5 text-[#FF7A29]" />,
      iconBg: 'bg-[#FFF1E8]',
    },
    {
      title: 'Jami buyurtmalar summasi',
      value: `${formatPrice(totalRevenue)} so‘m`,
      badge: completedRevenue > 0 ? `${formatPrice(completedRevenue)} so‘m bajarilgan` : 'Tushum statistikasi',
      isPositive: true,
      icon: <Coins className="w-5 h-5 text-[#F97316]" />,
      iconBg: 'bg-[#FFF7ED]',
    },
    {
      title: 'O‘rtacha buyurtma cheki',
      value: `${formatPrice(averageOrder)} so‘m`,
      badge: `${completedOrders.length} ta yetkazilgan`,
      isPositive: true,
      icon: <TrendingUp className="w-5 h-5 text-[#FF5A00]" />,
      iconBg: 'bg-[#FFF7ED]',
    },
  ];

  // 3. Real Dynamic Category Distribution for Donut Chart
  const donutData = useMemo(() => {
    const catMap = new Map<string, { name: string; count: number }>();

    // If real requests exist, calculate category popularity by ordered items
    requests.forEach((ord) => {
      ord.items?.forEach((item) => {
        const catName = item.product?.categoryName || 'Boshqa';
        const cur = catMap.get(catName) || { name: catName, count: 0 };
        cur.count += item.quantity || 1;
        catMap.set(catName, cur);
      });
    });

    // If requests don't cover all categories, populate from current product catalog
    if (catMap.size === 0) {
      products.forEach((p) => {
        const catObj = categories.find((c) => c.id === p.categoryId || c.slug === p.categoryId);
        const catName = catObj ? catObj.name : (p.categoryName || 'Boshqa');
        const cur = catMap.get(catName) || { name: catName, count: 0 };
        cur.count += 1;
        catMap.set(catName, cur);
      });
    }

    const sorted = Array.from(catMap.values())
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count);

    const totalCount = sorted.reduce((sum, item) => sum + item.count, 0);
    if (totalCount === 0) {
      return [];
    }

    const topItems = sorted.slice(0, 4);
    const others = sorted.slice(4);
    const othersCount = others.reduce((sum, item) => sum + item.count, 0);

    const finalSegments = [...topItems];
    if (othersCount > 0) {
      finalSegments.push({ name: 'Boshqalar', count: othersCount });
    }

    const colors = ['#FF5A00', '#FF7A29', '#FFA800', '#FFC72C', '#3B82F6'];
    const circumference = 2 * Math.PI * 45; // ~282.74

    let accumulatedOffset = 0;
    return finalSegments.map((item, idx) => {
      const percent = Math.round((item.count / totalCount) * 100);
      const dashLength = (percent / 100) * circumference;
      const strokeDash = `${dashLength.toFixed(1)} ${(circumference - dashLength).toFixed(1)}`;
      const strokeOffset = (-accumulatedOffset).toFixed(1);
      accumulatedOffset += dashLength;

      return {
        name: item.name,
        count: item.count,
        percent,
        color: colors[idx % colors.length],
        strokeDash,
        strokeOffset,
      };
    });
  }, [requests, products, categories]);

  // 4. Real 7-Day Weekly Orders Distribution
  const weeklyOrders = useMemo(() => {
    const daysConfig = [
      { key: 1, day: 'Dush', fullName: 'Dushanba' },
      { key: 2, day: 'Sesh', fullName: 'Seshanba' },
      { key: 3, day: 'Chor', fullName: 'Chorshanba' },
      { key: 4, day: 'Pay', fullName: 'Payshanba' },
      { key: 5, day: 'Jum', fullName: 'Juma' },
      { key: 6, day: 'Shan', fullName: 'Shanba' },
      { key: 0, day: 'Yak', fullName: 'Yakshanba' },
    ];

    const dayCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const dayAmounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    requests.forEach((r) => {
      let d: Date | null = null;
      if (r.created_at) {
        d = new Date(r.created_at);
      } else if (r.date) {
        const parts = r.date.split('.');
        if (parts.length === 3) {
          d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        }
      }
      if (d && !isNaN(d.getTime())) {
        const dayIdx = d.getDay();
        dayCounts[dayIdx] = (dayCounts[dayIdx] || 0) + 1;
        dayAmounts[dayIdx] = (dayAmounts[dayIdx] || 0) + (r.totalAmount || 0);
      }
    });

    const maxCount = Math.max(...Object.values(dayCounts), 1);

    return daysConfig.map((c) => {
      const count = dayCounts[c.key] || 0;
      const amount = dayAmounts[c.key] || 0;
      const height = count > 0 ? Math.max(Math.round((count / maxCount) * 88), 12) : 5;
      return {
        day: c.day,
        fullName: c.fullName,
        count,
        amount,
        height,
      };
    });
  }, [requests]);

  // Max weekly count for dynamic Y-axis
  const maxWeeklyCount = useMemo(() => {
    const rawMax = Math.max(...weeklyOrders.map((w) => w.count), 0);
    return rawMax === 0 ? 5 : Math.max(rawMax, 4);
  }, [weeklyOrders]);

  // 5. Dynamic Revenue Dynamics (Wave Area Points)
  const revenueCurveData = useMemo(() => {
    const amounts = weeklyOrders.map((w) => w.amount);
    const maxAmount = Math.max(...amounts, 0);

    const points = weeklyOrders.map((item, idx) => {
      const x = (idx / 6) * 350;
      // y ranges from 125 (bottom) to 15 (peak)
      const y = maxAmount > 0 ? 125 - Math.round((item.amount / maxAmount) * 105) : 125;
      return { x, y, day: item.day, fullName: item.fullName, amount: item.amount };
    });

    // Generate smooth SVG path
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const cpX = (current.x + next.x) / 2;
      pathD += ` C ${cpX} ${current.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
    }

    const areaD = `${pathD} L 350 140 L 0 140 Z`;

    // Find peak point
    let peakIndex = 0;
    let highestAmount = -1;
    points.forEach((p, idx) => {
      if (p.amount > highestAmount) {
        highestAmount = p.amount;
        peakIndex = idx;
      }
    });

    return {
      points,
      pathD,
      areaD,
      peakPoint: points[peakIndex],
      maxAmount,
    };
  }, [weeklyOrders]);

  // 6. Real Order Status Breakdown Data
  const statusStats = [
    {
      name: "Ko‘rib chiqilmoqda",
      count: pendingOrders.length,
      amount: pendingOrders.reduce((sum, r) => sum + (r.totalAmount || 0), 0),
      color: '#F59E0B',
      bgColor: 'bg-amber-500',
      icon: <Clock className="w-4 h-4 text-amber-600" />,
      tagBg: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      name: 'Tasdiqlangan',
      count: confirmedOrders.length,
      amount: confirmedOrders.reduce((sum, r) => sum + (r.totalAmount || 0), 0),
      color: '#3B82F6',
      bgColor: 'bg-blue-500',
      icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
      tagBg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      name: 'Yetkazilmoqda',
      count: deliveringOrders.length,
      amount: deliveringOrders.reduce((sum, r) => sum + (r.totalAmount || 0), 0),
      color: '#8B5CF6',
      bgColor: 'bg-purple-500',
      icon: <Truck className="w-4 h-4 text-purple-600" />,
      tagBg: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      name: 'Bajarildi',
      count: completedOrders.length,
      amount: completedOrders.reduce((sum, r) => sum + (r.totalAmount || 0), 0),
      color: '#10B981',
      bgColor: 'bg-emerald-500',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      tagBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  // Recent 5 real orders
  const recentOrders = useMemo(() => {
    return [...requests].slice(0, 5);
  }, [requests]);

  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-6">
        {/* Greeting Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">
              Salom, Admin!
            </h1>
            <p className="text-xs font-medium text-[#94A3B8] mt-0.5">
              Haqiqiy tahliliy statistika va zayavkalar holati
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="self-start sm:self-auto px-4 py-2 bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#FF5A00] font-bold text-xs rounded-xl border border-[#FF5A00]/20 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Zayavkalarni ko‘rish ({requests.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Metric Cards (100% Real Calculations) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-[#F1F5F9] shadow-2xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0`}>
                  {card.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#1E293B] truncate leading-tight">
                    {card.title}
                  </p>
                  <span
                    className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      card.isPositive
                        ? 'bg-[#DCFCE7] text-[#16A34A]'
                        : 'bg-[#FFF7ED] text-[#EA580C]'
                    }`}
                  >
                    {card.badge}
                  </span>
                </div>
              </div>

              <div className="mt-3.5">
                <p className="text-2xl font-black text-[#FF5A00] tracking-tight">
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Row: 2 Big Real Charts (Donut + 7-Day Weekly Bar) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Donut Chart — Kategoriyalar bo‘yicha taqsimot (%) */}
          <div className="bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-2xs relative">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm sm:text-base font-bold text-[#1E293B]">
                Kategoriyalar bo‘yicha taqsimot (%)
              </h2>
              <span className="text-[11px] font-semibold text-[#94A3B8]">
                {products.length} ta mahsulot
              </span>
            </div>

            {donutData.length > 0 ? (
              <>
                <div className="relative flex items-center justify-center py-6 h-64">
                  <svg className="w-56 h-56 -rotate-90 transform" viewBox="0 0 120 120">
                    {donutData.map((slice, index) => (
                      <circle
                        key={index}
                        cx="60"
                        cy="60"
                        r="45"
                        fill="transparent"
                        stroke={slice.color}
                        strokeWidth="18"
                        strokeDasharray={slice.strokeDash}
                        strokeDashoffset={slice.strokeOffset}
                        strokeLinecap="round"
                        className="transition-all duration-300 cursor-pointer hover:opacity-85"
                        onMouseEnter={() => setActiveDonutIndex(index)}
                      />
                    ))}
                  </svg>

                  {/* Active segment tooltip */}
                  {donutData[activeDonutIndex] && (
                    <div className="absolute top-6 right-6 sm:right-12 bg-[#475569] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 animate-in fade-in">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: donutData[activeDonutIndex].color }}
                      />
                      <span>
                        {donutData[activeDonutIndex].name}: {donutData[activeDonutIndex].percent}% ({donutData[activeDonutIndex].count} ta)
                      </span>
                    </div>
                  )}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 pt-3 border-t border-[#F8FAFC] flex-wrap">
                  {donutData.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveDonutIndex(idx)}
                      className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                        activeDonutIndex === idx ? 'opacity-100 font-bold' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-xs shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-[#64748B]">
                        {item.name} ({item.percent}%)
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6">
                <Package className="w-10 h-10 text-[#CBD5E1] mb-2" />
                <p className="text-xs font-semibold text-[#64748B]">Katalog ma‘lumotlari yetarli emas</p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">Mahsulotlar qo‘shilgach, taqsimot bu yerda ko‘rinadi</p>
              </div>
            )}
          </div>

          {/* Chart 2: 7-kunlik buyurtmalar (Hafta kunlari bo‘yicha real soni) */}
          <div className="bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm sm:text-base font-bold text-[#1E293B]">
                7 kunlik buyurtmalar (Hafta kunlari)
              </h2>
              <span className="text-[11px] font-semibold text-[#94A3B8]">
                {requests.length} ta buyurtma
              </span>
            </div>

            <div className="relative h-64 flex items-end pt-8 pb-4">
              {/* Dynamic Y-Axis scale marks */}
              <div className="absolute left-0 top-6 bottom-8 flex flex-col justify-between text-[11px] font-semibold text-[#94A3B8] pr-2">
                <span>{maxWeeklyCount}</span>
                <span>{Math.round(maxWeeklyCount * 0.75)}</span>
                <span>{Math.round(maxWeeklyCount * 0.5)}</span>
                <span>{Math.round(maxWeeklyCount * 0.25)}</span>
                <span>0</span>
              </div>

              {/* Horizontal grid lines */}
              <div className="absolute left-6 right-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-[#F1F5F9]" />
                <div className="border-b border-[#F1F5F9]" />
                <div className="border-b border-[#F1F5F9]" />
                <div className="border-b border-[#F1F5F9]" />
                <div className="border-b border-[#E2E8F0]" />
              </div>

              {/* Bars container */}
              <div className="flex-1 ml-8 flex items-end justify-between gap-2 sm:gap-4 h-full relative z-10 pb-6">
                {weeklyOrders.map((item) => {
                  const isSelected = activeBarDay === item.day;
                  return (
                    <div
                      key={item.day}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                      onClick={() => setActiveBarDay(item.day)}
                    >
                      {/* Floating tooltip */}
                      {isSelected && (
                        <div className="relative -mb-1 flex flex-col items-center animate-in fade-in zoom-in-95 z-20">
                          <div className="bg-[#475569] text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md whitespace-nowrap">
                            {item.fullName}: {item.count} ta {item.amount > 0 ? `(${formatPrice(item.amount)} so‘m)` : ''}
                          </div>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A00] border-2 border-white shadow-xs mt-0.5" />
                        </div>
                      )}

                      {/* Bar Column */}
                      <div
                        className={`w-full max-w-[34px] rounded-t-2xl transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-t from-[#FF7A29] to-[#FF5A00] shadow-sm'
                            : item.count > 0
                            ? 'bg-gradient-to-t from-[#FFE4D6] to-[#FFA785] hover:from-[#FFD3BE] hover:to-[#FF8A5E]'
                            : 'bg-[#F1F5F9] hover:bg-[#E2E8F0]'
                        }`}
                        style={{ height: `${item.height}%` }}
                      />

                      {/* X-axis Day Label */}
                      <span className={`text-[11px] font-bold mt-2 transition-colors ${isSelected ? 'text-[#FF5A00]' : 'text-[#64748B] group-hover:text-[#0F172A]'}`}>
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Real Dynamic Area Wave Chart + Order Status Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 3: Daromad dinamikasi (so‘mda) — Real Wave Area Chart */}
          <div className="bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm sm:text-base font-bold text-[#1E293B]">
                Daromad dinamikasi (hafta kunlari)
              </h2>
              <span className="text-[11px] font-bold text-[#FF5A00]">
                {formatPrice(totalRevenue)} so‘m
              </span>
            </div>

            <div className="relative h-64 flex items-end pt-8 pb-4">
              {/* Dynamic Y-Axis scale */}
              <div className="absolute left-0 top-6 bottom-8 flex flex-col justify-between text-[10px] font-semibold text-[#94A3B8] pr-2">
                <span>{revenueCurveData.maxAmount > 0 ? `${(revenueCurveData.maxAmount / 1000).toFixed(0)}k` : '100k'}</span>
                <span>{revenueCurveData.maxAmount > 0 ? `${((revenueCurveData.maxAmount * 0.5) / 1000).toFixed(0)}k` : '50k'}</span>
                <span>0</span>
              </div>

              {/* Smooth Area Wave Chart with Dynamic Peak Tooltip */}
              <div className="flex-1 ml-8 h-full relative">
                <svg className="w-full h-44 overflow-visible" viewBox="0 0 350 140" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF5A00" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#FF5A00" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Gradient Area Fill */}
                  <path d={revenueCurveData.areaD} fill="url(#areaGradient)" />

                  {/* Orange Stroke Line */}
                  <path
                    d={revenueCurveData.pathD}
                    fill="none"
                    stroke="#FF5A00"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Peak Marker */}
                  {revenueCurveData.peakPoint && revenueCurveData.peakPoint.amount > 0 && (
                    <circle
                      cx={revenueCurveData.peakPoint.x}
                      cy={revenueCurveData.peakPoint.y}
                      r="5"
                      fill="#FF5A00"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />
                  )}
                </svg>

                {/* Floating Tooltip at Peak Day */}
                {revenueCurveData.peakPoint && revenueCurveData.peakPoint.amount > 0 ? (
                  <div
                    className="absolute bg-[#475569] text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md whitespace-nowrap -translate-x-1/2"
                    style={{
                      left: `${Math.min(Math.max((revenueCurveData.peakPoint.x / 350) * 100, 15), 85)}%`,
                      top: `${Math.max(revenueCurveData.peakPoint.y - 30, 2)}px`,
                    }}
                  >
                    {revenueCurveData.peakPoint.fullName}: {formatPrice(revenueCurveData.peakPoint.amount)} so‘m
                  </div>
                ) : (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#F1F5F9] text-[#64748B] text-[10px] font-semibold px-3 py-1 rounded-md">
                    Zayavkalar tushumi kutilmoqda
                  </div>
                )}

                {/* X-axis days */}
                <div className="flex justify-between text-[11px] font-bold text-[#64748B] pt-3 border-t border-[#E2E8F0]">
                  {weeklyOrders.map((w) => (
                    <span
                      key={w.day}
                      className={w.day === revenueCurveData.peakPoint?.day && w.amount > 0 ? 'text-[#FF5A00] font-black' : ''}
                    >
                      {w.day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chart 4: Zayavkalar holati bo‘yicha tahlil (Real Status Breakdown) */}
          <div className="bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm sm:text-base font-bold text-[#1E293B]">
                Zayavkalar holati bo‘yicha taqsimot
              </h2>
              <span className="text-[11px] font-semibold text-[#10B981] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                {requests.length > 0
                  ? `${Math.round((completedOrders.length / requests.length) * 100)}% bajarildi`
                  : '0% faol'}
              </span>
            </div>

            {/* Status bars list */}
            <div className="space-y-3.5 my-auto">
              {statusStats.map((item, idx) => {
                const percent = requests.length > 0 ? Math.round((item.count / requests.length) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span className="font-bold text-[#334155]">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#94A3B8]">
                          {formatPrice(item.amount)} so‘m
                        </span>
                        <span className="font-extrabold text-[#0F172A] w-12 text-right">
                          {item.count} ta ({percent}%)
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${item.bgColor}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick summary note */}
            <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
              <span>Kutilayotgan: <strong className="text-[#EA580C]">{pendingOrders.length} ta</strong></span>
              <span>Yetkazilgan: <strong className="text-[#10B981]">{completedOrders.length} ta</strong></span>
              <span>Jami qiymat: <strong className="text-[#FF5A00]">{formatPrice(totalRevenue)} so‘m</strong></span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Oxirgi kelib tushgan zayavkalar (Real Recent Orders) */}
        <div className="bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1E293B]">
                So‘nggi kelib tushgan zayavkalar
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Oxirgi 5 ta qabul qilingan B2B so‘rovlar
              </p>
            </div>
            {requests.length > 5 && (
              <button
                onClick={() => navigate('/admin/orders')}
                className="text-xs font-bold text-[#FF5A00] hover:text-[#FF7A29] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Barchasini ko‘rish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {recentOrders.length > 0 ? (
            <div className="divide-y divide-[#F1F5F9]">
              {recentOrders.map((ord) => {
                const statusColor =
                  ord.status === "Ko‘rib chiqilmoqda"
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : ord.status === 'Tasdiqlangan'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : ord.status === 'Yetkazilmoqda'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                return (
                  <div
                    key={ord.id}
                    onClick={() => navigate('/admin/orders')}
                    className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-[#FAFBFD] rounded-xl px-2.5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#FFF7ED] text-[#FF5A00] flex items-center justify-center shrink-0 border border-[#FF5A00]/20 font-bold text-xs">
                        #{ord.id}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-[#0F172A] truncate">
                            {ord.contact.name || 'Mijoz'}
                          </p>
                          {ord.contact.company && (
                            <span className="text-[11px] text-[#64748B] truncate">
                              • {ord.contact.company}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#94A3B8]">
                          {ord.date} {ord.items?.length ? `• ${ord.items.length} ta tovar` : ''} • {ord.contact.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <span className="text-xs font-extrabold text-[#0F172A]">
                        {formatPrice(ord.totalAmount)} so‘m
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                        {ord.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <ClipboardList className="w-10 h-10 text-[#CBD5E1] mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#64748B]">Hozircha buyurtmalar yo‘q</p>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Mijozlar buyurtma berganda, ular bu yerda to‘liq avtomatik tarzda aks etadi
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
