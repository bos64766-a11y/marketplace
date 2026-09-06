/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ClipboardList,
  Settings,
  ChevronLeft,
  Menu,
  X,
  Store,
  Bell,
  ExternalLink,
  LogOut,
  Image as ImageIcon,
  LayoutGrid,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'ASOSIY',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin' },
      { id: 'orders', label: 'Zayavkalar', icon: <ClipboardList className="w-5 h-5" />, path: '/admin/orders' },
    ],
  },
  {
    title: 'BOSHQARISH',
    items: [
      { id: 'products', label: 'Mahsulotlar', icon: <Package className="w-5 h-5" />, path: '/admin/products' },
      { id: 'categories', label: 'Kategoriyalar', icon: <FolderOpen className="w-5 h-5" />, path: '/admin/categories' },
      { id: 'sections', label: 'Bo‘limlar', icon: <LayoutGrid className="w-5 h-5" />, path: '/admin/sections' },
      { id: 'banners', label: 'Bannerlar', icon: <ImageIcon className="w-5 h-5" />, path: '/admin/banners' },
    ],
  },
  {
    title: 'TIZIM',
    items: [
      { id: 'settings', label: 'Sozlamalar', icon: <Settings className="w-5 h-5" />, path: '/admin/settings' },
    ],
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab }) => {
  const { navigate, requests, products, logoutAdmin } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Find active nav item
  const currentNav = NAV_SECTIONS.flatMap((s) => s.items).find((n) => n.id === activeTab);
  const pendingRequestsCount = requests.filter((r) => r.status === "Ko\u2018rib chiqilmoqda").length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Modern Light Sidebar (Matches User Reference) — Full screen height */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50 bg-white border-r border-[#E5EAF2] flex flex-col transition-all duration-300 shadow-sm
          ${isSidebarCollapsed ? 'lg:w-[80px]' : 'lg:w-[268px]'}
          ${isSidebarOpen ? 'w-[268px] translate-x-0' : 'w-[268px] -translate-x-full'}
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen shrink-0
        `}
      >
        {/* Sidebar Header with Official SNABTASH Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#F1F5F9] shrink-0">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-2.5">
              <img
                src="/logo-horizontal.png"
                alt="SNABTASH"
                className="h-8 w-auto object-contain"
              />
              <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold tracking-widest bg-[#FFF1E8] text-[#FF5A00] border border-[#FF5A00]/20 uppercase">
                Admin
              </span>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <img
                src="/logo-icon.png"
                alt="SNABTASH"
                className="w-8 h-8 object-contain"
              />
            </div>
          )}

          {/* Close button for mobile drawer */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden w-8 h-8 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation grouped into sections */}
        <nav className="flex-1 py-4 px-3.5 space-y-5 overflow-y-auto">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              {/* Section Header */}
              {!isSidebarCollapsed && (
                <span className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-3 mb-2">
                  {section.title}
                </span>
              )}

              {/* Section Items */}
              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const isActive = item.id === activeTab;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setIsSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer group relative
                        ${isActive
                          ? 'bg-[#FF5A00] text-white shadow-md shadow-[#FF5A00]/25 font-bold'
                          : 'bg-[#F8FAFC] text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                        }
                        ${isSidebarCollapsed ? 'justify-center px-0 h-11' : ''}
                      `}
                      title={isSidebarCollapsed ? item.label : undefined}
                    >
                      <span className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#334155] group-hover:text-[#0F172A]'}`}>
                        {item.icon}
                      </span>

                      {!isSidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>

                          {/* Dynamic Item Badges */}
                          {item.id === 'orders' && pendingRequestsCount > 0 && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                                isActive
                                  ? 'bg-white text-[#FF5A00]'
                                  : 'bg-[#FF5A00] text-white shadow-xs'
                              }`}
                            >
                              {pendingRequestsCount}
                            </span>
                          )}

                          {item.id === 'products' && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                                isActive ? 'bg-white/20 text-white' : 'bg-white text-[#64748B] border border-[#E2E8F0]'
                              }`}
                            >
                              {products.length}
                            </span>
                          )}
                        </>
                      )}

                      {/* Active indicator dot when collapsed */}
                      {isSidebarCollapsed && isActive && (
                        <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer — Collapse Toggle at the very bottom */}
        <div className="p-3 border-t border-[#F1F5F9] shrink-0 mt-auto bg-white">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] transition-colors text-xs font-semibold cursor-pointer"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
            {!isSidebarCollapsed && <span>Panelni yig'ish</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-[#E5EAF2] flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Menyuni ochish"
            >
              <Menu className="w-5 h-5 text-[#475569]" />
            </button>

            {/* Current Section Title */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center shrink-0 border border-[#FF5A00]/20">
                {currentNav?.icon}
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-[#0F172A] leading-tight">
                  {currentNav?.label || 'Dashboard'}
                </h1>
                <p className="text-[11px] font-medium text-[#94A3B8] hidden sm:block">
                  SNABTASH boshqaruv tizimi
                </p>
              </div>
            </div>

            {/* Live Status Badge */}
            <div className="hidden xl:flex items-center gap-1.5 ml-4 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] font-medium text-[#059669]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>Tizim faol</span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Notifications Bell */}
            <button
              onClick={() => navigate('/admin/orders')}
              className="relative w-9 h-9 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
              title="Zayavkalar"
            >
              <Bell className="w-4 h-4" />
              {pendingRequestsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF5A00] text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            {/* Do'konga O'tish Button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F8FAFC] hover:bg-[#FFF1E8] border border-[#E2E8F0] hover:border-[#FF5A00]/30 text-xs font-bold text-[#334155] hover:text-[#FF5A00] transition-all shadow-2xs group cursor-pointer"
            >
              <Store className="w-4 h-4 text-[#64748B] group-hover:text-[#FF5A00] transition-colors" />
              <span className="hidden sm:inline">Do'konga o'tish</span>
              <ExternalLink className="w-3 h-3 text-[#94A3B8] group-hover:text-[#FF5A00] transition-colors" />
            </button>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#E2E8F0]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#081B4B] to-[#FF5A00] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                A
              </div>
              <div className="hidden lg:block text-left leading-tight">
                <p className="text-xs font-bold text-[#0F172A]">Administrator</p>
                <p className="text-[10px] font-medium text-[#10B981]">Online</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              id="btn-admin-logout"
              onClick={logoutAdmin}
              className="w-9 h-9 rounded-xl bg-[#F8FAFC] hover:bg-red-50 text-[#64748B] hover:text-red-600 border border-[#E2E8F0] hover:border-red-200 flex items-center justify-center transition-colors cursor-pointer"
              title="Tizimdan chiqish"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
