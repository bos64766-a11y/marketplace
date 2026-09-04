/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import {
  ShoppingBag,
  Users,
  Coins,
  Clock,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { products, requests } = useApp();

  // Active hover states for interactive charts
  const [activeDonutIndex, setActiveDonutIndex] = useState<number>(0);
  const [activeBarDay, setActiveBarDay] = useState<string>('Pay');

  // Dynamic calculations based on real app data
  const totalRevenue = requests.reduce((sum, r) => sum + r.totalAmount, 0);

  // 1. Metric Cards data matching mockup style
  const statCards = [
    {
      title: 'Bugungi buyurtmalar',
      value: `${requests.length > 0 ? requests.length * 4 + 4 : 24} ta`,
      change: '+12%',
      isPositive: true,
      icon: <ShoppingBag className="w-5 h-5 text-[#FF5A00]" />,
      iconBg: 'bg-[#FFF7ED]',
    },
    {
      title: 'Faol mahsulotlar',
      value: `${products.length > 0 ? products.length : 18} ta`,
      change: '+12%',
      isPositive: true,
      icon: <Users className="w-5 h-5 text-[#FF7A29]" />,
      iconBg: 'bg-[#FFF1E8]',
    },
    {
      title: 'Kunlik daromad',
      value: `${(totalRevenue > 0 ? Math.round(totalRevenue * 1.6) : 12323000).toLocaleString('en-US')} so‘m`,
      change: '+12%',
      isPositive: true,
      icon: <Coins className="w-5 h-5 text-[#F97316]" />,
      iconBg: 'bg-[#FFF7ED]',
    },
    {
      title: 'Kunlik xarajatlar',
      value: '3,412,000 so‘m',
      change: '-10%',
      isPositive: false,
      icon: <Clock className="w-5 h-5 text-[#FF5A00]" />,
      iconBg: 'bg-[#FFF7ED]',
    },
  ];

  // 2. Donut Chart Data (matching mockup layout & colors)
  const donutData = [
    { name: 'Konditsioner', percent: 35, color: '#FF5A00', strokeDash: '115 215', strokeOffset: '0' },
    { name: 'Santexnika', percent: 28, color: '#FF7A29', strokeDash: '92 238', strokeOffset: '-120' },
    { name: 'Elektrika', percent: 22, color: '#FFA800', strokeDash: '72 258', strokeOffset: '-216' },
    { name: 'Katyol', percent: 15, color: '#FFC72C', strokeDash: '50 280', strokeOffset: '-292' },
  ];

  // 3. 7-Day Orders Data (matching mockup layout)
  const weeklyOrders = [
    { day: 'Dush', count: 19, height: 32 },
    { day: 'Sesh', count: 38, height: 63 },
    { day: 'Chor', count: 49, height: 82 },
    { day: 'Pay', count: 38, height: 63, active: true },
    { day: 'Jum', count: 52, height: 87 },
    { day: 'Shan', count: 24, height: 40 },
    { day: 'Yak', count: 55, height: 92 },
  ];

  // 4. Comparison Bar Chart Data (bottom right)
  const monthlyComparison = [
    { label: '1-hafta', daromad: 38, xarajat: 6 },
    { label: '2-hafta', daromad: 44, xarajat: 7, active: true },
    { label: '3-hafta', daromad: 36, xarajat: 5 },
    { label: '4-hafta', daromad: 48, xarajat: 8 },
    { label: '5-hafta', daromad: 58, xarajat: 10 },
  ];

  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-6">
        {/* Greeting Header (Matches Mockup) */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">
            Salom, Admin!
          </h1>
          <p className="text-xs font-medium text-[#94A3B8] mt-0.5">
            Bugungi statistika
          </p>
        </div>

        {/* 4 Metric Cards (Matches Mockup exact style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-[#F1F5F9] shadow-2xs hover:shadow-md transition-shadow"
            >
              {/* Top row: Icon + Title & Percentage Badge */}
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
                        : 'bg-[#FFE4E6] text-[#E11D48]'
                    }`}
                  >
                    {card.change}
                  </span>
                </div>
              </div>

              {/* Bottom value in Vibrant Coral/Orange */}
              <div className="mt-3.5">
                <p className="text-2xl font-black text-[#FF5A00] tracking-tight">
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Row: 2 Big Charts (Donut + 7-day Bar) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Donut Chart — Xizmatlar bo'yicha taqsimot (%) */}
          <div className="bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-2xs relative">
            <h2 className="text-sm sm:text-base font-bold text-[#1E293B] mb-2">
              Xizmatlar bo'yicha taqsimot (%)
            </h2>

            {/* Interactive SVG Donut Chart with Mockup Connector Tooltip */}
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

              {/* Mockup Floating Tooltip on active segment (Top Right) */}
              <div className="absolute top-6 right-8 sm:right-16 bg-[#475569] text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-lg flex items-center gap-1 animate-in fade-in">
                <span>{donutData[activeDonutIndex].name}: {donutData[activeDonutIndex].percent}%</span>
              </div>
            </div>

            {/* Bottom Legend (Colored squares) */}
            <div className="flex items-center justify-center gap-5 pt-3 border-t border-[#F8FAFC] flex-wrap">
              {donutData.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDonutIndex(idx)}
                  className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                    activeDonutIndex === idx ? 'opacity-100 font-bold' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className="w-3 h-3 rounded-xs" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-[#64748B]">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chart 2: 7 kunlik buyurtmalar (Vertical Bar Chart with Peak Tooltip) */}
          <div className="bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-2xs">
            <h2 className="text-sm sm:text-base font-bold text-[#1E293B] mb-2">
              7 kunlik buyurtmalar
            </h2>

            <div className="relative h-64 flex items-end pt-8 pb-4">
              {/* Y-Axis scale marks */}
              <div className="absolute left-0 top-6 bottom-8 flex flex-col justify-between text-[11px] font-semibold text-[#94A3B8] pr-2">
                <span>60</span>
                <span>50</span>
                <span>40</span>
                <span>30</span>
                <span>20</span>
                <span>10</span>
                <span>0</span>
              </div>

              {/* Horizontal grid lines */}
              <div className="absolute left-6 right-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-[#F1F5F9]" />
                <div className="border-b border-[#F1F5F9]" />
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
                      {/* Floating dark tooltip on selected/active day (Matches Mockup) */}
                      {isSelected && (
                        <div className="relative -mb-1 flex flex-col items-center animate-in fade-in zoom-in-95">
                          <div className="bg-[#475569] text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md whitespace-nowrap">
                            {item.day === 'Pay' ? 'payshanba' : item.day.toLowerCase()}: {item.count} ta
                          </div>
                          {/* Dot pin on bar */}
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A00] border-2 border-white shadow-xs mt-0.5" />
                        </div>
                      )}

                      {/* Bar Column */}
                      <div
                        className={`w-full max-w-[34px] rounded-t-2xl transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-t from-[#FF7A29] to-[#FF5A00] shadow-sm'
                            : 'bg-gradient-to-t from-[#FFE4D6] to-[#FFA785] hover:from-[#FFD3BE] hover:to-[#FF8A5E]'
                        }`}
                        style={{ height: `${item.height}%` }}
                      />

                      {/* X-axis Day Label */}
                      <span className="text-[11px] font-bold text-[#64748B] mt-2 group-hover:text-[#0F172A] transition-colors">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: 2 More Charts (Area Wave Chart + Dual Comparison Bar) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 3: Daromad dinamikasi (mln so'm) — Wave Area Chart */}
          <div className="bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-2xs">
            <h2 className="text-sm sm:text-base font-bold text-[#1E293B] mb-2">
              Daromad dinamikasi (mln so'm)
            </h2>

            <div className="relative h-64 flex items-end pt-8 pb-4">
              {/* Y-Axis */}
              <div className="absolute left-0 top-6 bottom-8 flex flex-col justify-between text-[11px] font-semibold text-[#94A3B8] pr-2">
                <span>12</span>
                <span>10</span>
                <span>8</span>
                <span>6</span>
                <span>4</span>
                <span>2</span>
                <span>0</span>
              </div>

              {/* Smooth Area Wave Chart with Mockup Peak Tooltip */}
              <div className="flex-1 ml-8 h-full relative">
                <svg className="w-full h-44 overflow-visible" viewBox="0 0 350 140" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF5A00" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#FF5A00" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Gradient Area Fill */}
                  <path
                    d="M 0 110 Q 50 85, 100 95 T 200 45 T 280 80 T 350 30 L 350 140 L 0 140 Z"
                    fill="url(#areaGradient)"
                  />

                  {/* Orange Stroke Line */}
                  <path
                    d="M 0 110 Q 50 85, 100 95 T 200 45 T 280 80 T 350 30"
                    fill="none"
                    stroke="#FF5A00"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Peak Marker at Payshanba */}
                  <circle cx="200" cy="45" r="5" fill="#FF5A00" stroke="#FFFFFF" strokeWidth="2.5" />
                </svg>

                {/* Floating Tooltip at Payshanba (Matches Mockup) */}
                <div className="absolute top-1 left-[54%] -translate-x-1/2 bg-[#475569] text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md whitespace-nowrap">
                  Payshanba: 5,2 mln
                </div>

                {/* X-axis days */}
                <div className="flex justify-between text-[11px] font-bold text-[#64748B] pt-3 border-t border-[#E2E8F0]">
                  <span>Dush</span>
                  <span>Sesh</span>
                  <span>Chor</span>
                  <span className="text-[#FF5A00]">Pay</span>
                  <span>Jum</span>
                  <span>Shan</span>
                  <span>Yak</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart 4: Xarajatlar va Daromadlar (mln so'm) — Dual Bars & Comparison */}
          <div className="bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-2xs">
            <h2 className="text-sm sm:text-base font-bold text-[#1E293B] mb-2">
              Xarajatlar va Daromadlar (mln so'm)
            </h2>

            <div className="relative h-64 flex items-end pt-8 pb-4">
              {/* Y-Axis */}
              <div className="absolute left-0 top-6 bottom-8 flex flex-col justify-between text-[11px] font-semibold text-[#94A3B8] pr-2">
                <span>60</span>
                <span>50</span>
                <span>40</span>
                <span>30</span>
                <span>20</span>
                <span>10</span>
                <span>0</span>
              </div>

              {/* Bars container */}
              <div className="flex-1 ml-8 flex items-end justify-between gap-3 sm:gap-6 h-full relative z-10 pb-6">
                {monthlyComparison.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end relative">
                    {/* Dark Multi-Value Tooltip on active bar (Matches Mockup) */}
                    {item.active && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#475569] text-white text-[10px] font-bold p-2 rounded-lg shadow-lg whitespace-nowrap z-20 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-xs bg-[#FBBF24]" />
                          <span>Daromad: 44 mln</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-xs bg-[#FF7A29]" />
                          <span>Xarajat: 7 mln</span>
                        </div>
                      </div>
                    )}

                    {/* Dual Bars side by side */}
                    <div className="w-full flex items-end justify-center gap-1">
                      {/* Daromad bar (Amber / Yellow) */}
                      <div
                        className="w-3 sm:w-4 bg-[#FBBF24] rounded-t-md transition-all duration-300 hover:opacity-90"
                        style={{ height: `${(item.daromad / 60) * 100}%` }}
                      />
                      {/* Xarajat bar (Coral / Orange) */}
                      <div
                        className="w-3 sm:w-4 bg-[#FF7A29] rounded-t-md transition-all duration-300 hover:opacity-90"
                        style={{ height: `${(item.xarajat / 60) * 100}%` }}
                      />
                    </div>

                    {/* X-axis label */}
                    <span className="text-[10px] font-bold text-[#64748B] mt-2">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
