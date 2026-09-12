import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShoppingBag,
  Info
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartCount,
    navigate,
    language,
    t,
    getProductName,
  } = useApp();

  if (cart.length === 0) {
    return (
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 py-16">
        <div className="max-w-md mx-auto bg-white rounded-[20px] border border-[#E5EAF2] p-8 sm:p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B2E73] tracking-tight mb-2">
            {t.cart.emptyTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mb-6">
            {t.cart.emptyDesc}
          </p>
          <button
            id="btn-cart-empty-catalog"
            onClick={() => navigate('/catalog')}
            className="w-full py-3 px-6 rounded-[10px] font-bold text-sm text-white bg-[#0B2E73] hover:bg-[#08245A] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{t.cart.toCatalog}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#667085] mb-4">
        <button onClick={() => navigate('/')} className="hover:text-[#0B2E73] cursor-pointer">
          {language === 'ru' ? 'Главная' : 'Bosh sahifa'}
        </button>
        <span>/</span>
        <span className="text-[#FF5A00] font-bold">{t.cart.title}</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between mb-6 pb-2">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold text-[#14213D]">
            {t.cart.title}
          </h1>
          <span className="text-xs text-[#667085]">
            {cartCount} {language === 'ru' ? 'товаров' : 'ta mahsulot'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-[16px] border border-[#E5EAF2] divide-y divide-[#E5EAF2] overflow-hidden">
            {cart.map(({ product, quantity }) => {
              const itemTotal = product.price * quantity;
              const productName = getProductName(product);

              return (
                <div
                  key={product.id}
                  id={`cart-item-${product.id}`}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#F7F9FC]/50 transition-colors"
                >
                  {/* Image + Info */}
                  <div
                    onClick={() => navigate(`/product/${product.slug}`)}
                    className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer group"
                  >
                    <img
                      src={product.images[0]}
                      alt={productName}
                      className="w-16 h-16 sm:w-18 sm:h-18 rounded-[12px] object-cover border border-[#E5EAF2] shrink-0 bg-[#F7F9FC]"
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-[#14213D] group-hover:text-[#0B2E73] transition-colors line-clamp-1">
                        {productName}
                      </h3>
                      <div className="text-xs text-[#667085] mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <span>{product.brand} • {product.price.toLocaleString('uz-UZ')} {t.productCard.sum}</span>
                        {product.minOrder && product.minOrder > 1 && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200">
                            min: {product.minOrder} {product.unit || (language === 'ru' ? 'шт' : 'ta')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity + Subtotal + Trash */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5EAF2]/60">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-[#E5EAF2] rounded-[8px] bg-[#F7F9FC]">
                      <button
                        onClick={() => {
                          const minQty = product.minOrder || 1;
                          if (quantity <= minQty) {
                            removeFromCart(product.id);
                          } else {
                            updateCartQuantity(product.id, quantity - 1);
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center text-[#667085] hover:text-[#0B2E73] hover:bg-[#E5EAF2] rounded-l-[8px] transition-colors cursor-pointer"
                        aria-label="Kamaytirish"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-[#14213D]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(product.id, quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#667085] hover:text-[#0B2E73] hover:bg-[#E5EAF2] rounded-r-[8px] transition-colors cursor-pointer"
                        aria-label="Ko‘paytirish"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[90px]">
                      <div className="text-sm font-extrabold text-[#14213D]">
                        {itemTotal.toLocaleString('uz-UZ')} {t.productCard.sum}
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-1.5 text-[#667085] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title={t.common.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Row: Savatni tozalash & Katalogga qaytish */}
          <div className="flex items-center justify-between pt-2">
            <button
              id="btn-clear-cart"
              onClick={clearCart}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.cart.clearCart}</span>
            </button>

            <button
              onClick={() => navigate('/catalog')}
              className="text-xs font-bold text-[#0B2E73] hover:text-[#FF5A00] transition-colors cursor-pointer"
            >
              {language === 'ru' ? '← Назад в каталог' : '← Katalogga qaytish'}
            </button>
          </div>
        </div>

        {/* Right: Summary Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-[16px] border border-[#E5EAF2] p-6 space-y-5">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-[15px] sm:text-[16px] text-[#14213D]">{t.cart.total}:</span>
              <span className="text-[22px] sm:text-[24px] font-bold text-[#14213D]">
                {cartTotal.toLocaleString('uz-UZ')} {t.productCard.sum}
              </span>
            </div>

            <p className="text-xs text-[#667085] italic">
              {language === 'ru'
                ? '* Окончательная цена согласуется с менеджером'
                : '* Yakuniy narx menejer bilan kelishiladi'}
            </p>

            {/* Primary Orange Button: Zayavka yuborish */}
            <button
              id="btn-cart-submit-request-cta"
              onClick={() => navigate('/request')}
              className="w-full py-3.5 px-6 rounded-[10px] font-bold text-sm text-white bg-[#FF5A00] hover:bg-[#e04f00] shadow-md shadow-[#FF5A00]/25 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{t.cart.checkout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
