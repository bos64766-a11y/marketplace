import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, LayoutGrid, Heart, ShoppingBag, FileText } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentPath, navigate, cartCount, favorites } = useApp();

  const navItems = [
    {
      id: 'home',
      label: 'Bosh',
      path: '/',
      icon: Home,
    },
    {
      id: 'catalog',
      label: 'Katalog',
      path: '/catalog',
      icon: LayoutGrid,
    },
    {
      id: 'favorites',
      label: 'Sevimli',
      path: '/favorites',
      icon: Heart,
      badge: favorites.length > 0 ? favorites.length : null,
    },
    {
      id: 'cart',
      label: 'Savat',
      path: '/cart',
      icon: ShoppingBag,
      badge: cartCount > 0 ? cartCount : null,
      isPrimaryBadge: true,
    },
    {
      id: 'requests',
      label: 'Zayavkalar',
      path: '/requests',
      icon: FileText,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#F1F5F9] px-2 py-1.5 shadow-lg safe-area-pb">
      <div className="grid grid-cols-5 items-center w-full">
        {navItems.map((item) => {
          const isActive =
            item.path === '/'
              ? currentPath === '/'
              : currentPath.startsWith(item.path);

          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              id={`btn-mobile-nav-${item.id}`}
              onClick={() => {
                navigate(item.path);
              }}
              className="relative flex flex-col items-center justify-center py-0.5 px-0.5 transition-colors cursor-pointer"
            >
              <div
                className={`relative flex items-center justify-center w-11 h-7 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-[#FFF7ED] text-[#FF5A00]'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                <IconComponent
                  className={`w-4.5 h-4.5 ${
                    isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'
                  } ${item.id === 'favorites' && favorites.length > 0 && isActive ? 'fill-[#FF5A00]' : ''}`}
                />
                {item.badge && (
                  <span
                    className={`absolute -top-1 -right-1 min-w-[15px] h-4 px-1 rounded-full text-[9px] font-black text-white flex items-center justify-center border-2 border-white shadow-xs ${
                      item.isPrimaryBadge ? 'bg-[#FF5A00]' : 'bg-[#1E293B]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 leading-tight ${
                  isActive ? 'font-black text-[#FF5A00]' : 'font-semibold text-[#64748B]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
