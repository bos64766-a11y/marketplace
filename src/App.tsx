/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Toast } from './components/Toast';

// Lazy loaded pages for performance & code-splitting
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const CatalogPage = lazy(() => import('./pages/CatalogPage').then((m) => ({ default: m.CatalogPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import('./pages/CartPage').then((m) => ({ default: m.CartPage })));
const RequestPage = lazy(() => import('./pages/RequestPage').then((m) => ({ default: m.RequestPage })));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage })));
const RequestsPage = lazy(() => import('./pages/RequestsPage').then((m) => ({ default: m.RequestsPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const DeliveryPaymentPage = lazy(() => import('./pages/DeliveryPaymentPage').then((m) => ({ default: m.DeliveryPaymentPage })));
const ContactsPage = lazy(() => import('./pages/ContactsPage').then((m) => ({ default: m.ContactsPage })));

// Admin pages (lazy loaded)
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts').then((m) => ({ default: m.AdminProducts })));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories').then((m) => ({ default: m.AdminCategories })));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders').then((m) => ({ default: m.AdminOrders })));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners').then((m) => ({ default: m.AdminBanners })));
const AdminShowcaseSections = lazy(() => import('./pages/admin/AdminShowcaseSections').then((m) => ({ default: m.AdminShowcaseSections })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then((m) => ({ default: m.AdminSettings })));

const PageLoader: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
    <div className="w-9 h-9 border-3 border-[#0B2E73]/20 border-t-[#FF5A00] rounded-full animate-spin" />
    <span className="text-xs font-semibold text-[#667085]">Yuklanmoqda...</span>
  </div>
);

const MainRouter: React.FC = () => {
  const { currentPath, isAdminAuthenticated } = useApp();

  // Strip query string and hash from path for accurate route matching
  const pathOnly = currentPath.split(/[?#]/)[0] || '/';

  // ── Admin Routes ──
  if (pathOnly.startsWith('/admin')) {
    if (pathOnly === '/admin/login' || !isAdminAuthenticated) {
      return <AdminLoginPage />;
    }

    switch (pathOnly) {
      case '/admin/products':
        return <AdminProducts />;
      case '/admin/categories':
        return <AdminCategories />;
      case '/admin/orders':
        return <AdminOrders />;
      case '/admin/sections':
        return <AdminShowcaseSections />;
      case '/admin/banners':
        return <AdminBanners />;
      case '/admin/settings':
        return <AdminSettings />;
      case '/admin':
      default:
        return <AdminDashboard />;
    }
  }

  // Match /product/:slug
  const productMatch = pathOnly.match(/^\/product\/([^/]+)/);
  if (productMatch) {
    return <ProductDetailPage slug={productMatch[1]} />;
  }

  // Match /catalog or /catalog/:category
  const catalogMatch = pathOnly.match(/^\/catalog(?:\/([^/]+))?/);
  if (catalogMatch && (pathOnly.startsWith('/catalog') || pathOnly === '/catalog')) {
    return <CatalogPage initialCategory={catalogMatch[1]} />;
  }

  // Match exact routes
  switch (pathOnly) {
    case '/cart':
      return <CartPage />;
    case '/request':
      return <RequestPage />;
    case '/favorites':
      return <FavoritesPage />;
    case '/requests':
      return <RequestsPage />;
    case '/profile':
      return <ProfilePage />;
    case '/about':
      return <AboutPage />;
    case '/delivery-payment':
      return <DeliveryPaymentPage />;
    case '/contacts':
      return <ContactsPage />;
    case '/':
    default:
      return <HomePage />;
  }
};

const AppContent: React.FC = () => {
  const { currentPath } = useApp();
  const pathOnly = currentPath.split(/[?#]/)[0] || '/';
  const isHomePage = pathOnly === '/';
  const isAdminPage = pathOnly.startsWith('/admin');

  // Admin pages get their own layout — no Header, Footer, or MobileBottomNav
  if (isAdminPage) {
    return (
      <Suspense fallback={<PageLoader />}>
        <MainRouter />
        <Toast />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#14213D] font-sans antialiased selection:bg-[#FF5A00]/20 selection:text-[#0B2E73]">
      <Header />
      <main className="flex-1 w-full">
        <Suspense fallback={<PageLoader />}>
          <MainRouter />
        </Suspense>
      </main>
      {isHomePage && <Footer />}
      <MobileBottomNav />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
