import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import {
  Heart,
  ShoppingCart,
  Check,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Share2,
  ChevronRight,
  Boxes,
  Minus,
  Plus,
  Sparkles,
  FileText,
  Download
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { navigate, addToCart, isFavorite, toggleFavorite, showToast, products } = useApp();

  const product = products.find((p) => p.slug === slug || p.id === slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(product?.minOrder || 1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'delivery'>('desc');
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    return (
      <div className="max-w-[1536px] mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FFF1E8] text-[#FF5A00] flex items-center justify-center mx-auto mb-4">
          <Boxes className="w-8 h-8" />
        </div>
        <h2 className="text-[24px] sm:text-[28px] font-bold text-[#0B2E73] mb-2">Mahsulot topilmadi</h2>
        <p className="text-[14px] text-[#667085] max-w-md mx-auto mb-6 leading-[1.55] font-normal">
          Siz qidirgan tovar mavjud emas yoki nomi o‘zgargan bo‘lishi mumkin. Katalogni ko‘rib chiqishingizni tavsiya qilamiz.
        </p>
        <button
          onClick={() => navigate('/catalog')}
          className="bg-[#FF5A00] hover:bg-[#e04f00] text-white px-6 py-2.5 rounded-xl font-semibold text-[14px] cursor-pointer shadow-xs transition-all"
        >
          Katalogga qaytish
        </button>
      </div>
    );
  }

  const favorite = isFavorite(product.id);

  // Related products from same category
  const relatedProducts = products.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Havola nusxalandi', 'info');
    }
  };

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-8 py-6">
      {/* Breadcrumb matching mockup */}
      <nav className="flex items-center gap-2 text-xs text-[#667085] mb-6 overflow-x-auto whitespace-nowrap pb-1">
        <button onClick={() => navigate('/')} className="hover:text-[#0B2E73] cursor-pointer">
          Bosh sahifa
        </button>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <button
          onClick={() => navigate(`/catalog/${product.categoryId}`)}
          className="hover:text-[#0B2E73] cursor-pointer"
        >
          {product.categoryName}
        </button>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[#FF5A00] font-semibold truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Box */}
      <div className="bg-white rounded-[20px] border border-[#E5EAF2] p-6 sm:p-8 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Gallery (6 cols) */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails list */}
            {product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[420px] pb-2 sm:pb-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[12px] overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-[#F7F9FC] ${
                      selectedImage === idx
                        ? 'border-[#FF5A00] shadow-xs'
                        : 'border-[#E5EAF2] hover:border-slate-400'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Large Product Image */}
            <div className="flex-1 relative aspect-square rounded-[16px] overflow-hidden bg-[#F7F9FC] border border-[#E5EAF2] flex items-center justify-center group">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.tag && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-bold bg-[#FFF1E8] text-[#FF5A00] border border-[#FF5A00]/20 shadow-xs">
                  {product.tag}
                </span>
              )}
            </div>
          </div>

          {/* Right: Product Info & Order Controls (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Product Title + In Stock Tag */}
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] tracking-tight">
                  {product.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                  Mavjud
                </span>
              </div>

              {/* Tag / Subtitle */}
              <p className="text-sm text-[#667085] font-medium">
                {product.brand} • {product.tag || 'Antibakterial formula'}
              </p>

              {/* Rating and SKU Row */}
              <div className="flex items-center gap-4 text-xs text-[#667085] pb-3 border-b border-[#E5EAF2]">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-[#14213D]">{product.rating}</span>
                  <span>({product.reviewsCount} ta baho)</span>
                </div>
                <span>|</span>
                <span>Artikul: <strong className="text-[#14213D]">{product.sku}</strong></span>
              </div>

              {/* Price */}
              <div className="py-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] sm:text-[34px] font-bold text-[#14213D] tracking-tight">
                    {product.price.toLocaleString('uz-UZ')}
                  </span>
                  <span className="text-[18px] font-semibold text-[#667085]">so‘m / {product.unit || 'dona'}</span>
                  <span className="text-[11px] font-semibold text-[#009B5A] bg-[#EBF7F0] px-2 py-0.5 rounded-md ml-2">
                    100% QQS bilan
                  </span>
                </div>
              </div>

              {/* Wholesale Pricing Tiers (B2B Hajmga qarab narxlar shkalasi) */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 sm:p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0B2E73] uppercase tracking-wider">
                    Ulgurji (Optom) narxlar shkalasi
                  </span>
                  <span className="text-[11px] text-[#64748B]">
                    Min buyurtma: <strong>{product.minOrder || 1} {product.unit || 'dona'}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2.5 rounded-xl border border-[#EEF2F6]">
                    <p className="text-[11px] text-[#64748B] font-medium">1 – 9 dona</p>
                    <p className="text-[13px] font-bold text-[#14213D] mt-0.5">
                      {product.price.toLocaleString('uz-UZ')}
                    </p>
                    <span className="text-[10px] text-[#94A3B8]">Baza narx</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#EEF2F6] relative overflow-hidden">
                    <span className="absolute top-0 right-0 bg-[#FF5A00] text-white text-[8px] font-bold px-1.5 py-0.2 rounded-bl">
                      -5%
                    </span>
                    <p className="text-[11px] text-[#64748B] font-medium">10 – 49 dona</p>
                    <p className="text-[13px] font-bold text-[#0B2E73] mt-0.5">
                      {Math.round(product.price * 0.95).toLocaleString('uz-UZ')}
                    </p>
                    <span className="text-[10px] text-[#009B5A] font-semibold">Tejamkor</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#FF5A00]/40 bg-[#FFFBF8] relative overflow-hidden">
                    <span className="absolute top-0 right-0 bg-[#009B5A] text-white text-[8px] font-bold px-1.5 py-0.2 rounded-bl">
                      -10%
                    </span>
                    <p className="text-[11px] text-[#FF5A00] font-bold">50+ dona</p>
                    <p className="text-[13px] font-bold text-[#FF5A00] mt-0.5">
                      {Math.round(product.price * 0.90).toLocaleString('uz-UZ')}
                    </p>
                    <span className="text-[10px] text-[#009B5A] font-semibold">Maksimal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector + Add to Cart Button + Favorite */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#E5EAF2] rounded-[10px] bg-[#F7F9FC]">
                  <button
                    id="btn-qty-minus"
                    onClick={() => setQuantity((q) => Math.max(product.minOrder || 1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#667085] hover:text-[#0B2E73] hover:bg-[#E5EAF2] rounded-l-[10px] transition-colors cursor-pointer"
                    aria-label="Kamaytirish"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-[#14213D]">
                    {quantity}
                  </span>
                  <button
                    id="btn-qty-plus"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[#667085] hover:text-[#0B2E73] hover:bg-[#E5EAF2] rounded-r-[10px] transition-colors cursor-pointer"
                    aria-label="Ko‘paytirish"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Savatga qo'shish (Orange CTA) */}
                <button
                  id="btn-product-detail-add-cart"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`flex-1 py-3 px-6 rounded-[10px] font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md active:scale-98 ${
                    isAdding
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#FF5A00] hover:bg-[#e04f00] text-white shadow-[#FF5A00]/25'
                  }`}
                >
                  {isAdding ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Savatga qo‘shildi</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Savatga qo‘shish</span>
                    </>
                  )}
                </button>

                {/* Heart Button */}
                <button
                  id="btn-product-detail-favorite"
                  onClick={() => toggleFavorite(product.id)}
                  className={`w-11 h-11 rounded-[10px] flex items-center justify-center border transition-colors cursor-pointer ${
                    favorite
                      ? 'bg-[#FFF1E8] border-[#FF5A00] text-[#FF5A00]'
                      : 'bg-white border-[#E5EAF2] hover:bg-[#F7F9FC] text-[#667085]'
                  }`}
                  aria-label="Sevimlilar"
                >
                  <Heart className={`w-5 h-5 ${favorite ? 'fill-[#FF5A00]' : ''}`} />
                </button>
              </div>

              {/* B2B Action Buttons */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  onClick={() => navigate('/request')}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[#0B2E73] text-[#0B2E73] hover:bg-[#0B2E73] hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span>Hisob-faktura so‘rash</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="py-2.5 px-3 rounded-xl border border-[#CBD5E1] hover:border-[#0B2E73] text-[#475569] hover:text-[#0B2E73] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-white"
                >
                  <Download className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span>Tijorat taklifi (PDF)</span>
                </button>
              </div>

              {/* 3 Service badges matching mockup */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E5EAF2]">
                <div className="flex items-center gap-2.5 text-xs text-[#667085]">
                  <Truck className="w-4 h-4 text-[#0B2E73] shrink-0" />
                  <div>
                    <span className="font-bold text-[#14213D] block">Yetkazib berish</span>
                    <span>Toshkent bo‘yicha bepul</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#667085]">
                  <Boxes className="w-4 h-4 text-[#0B2E73] shrink-0" />
                  <div>
                    <span className="font-bold text-[#14213D] block">Minimal zayavka</span>
                    <span>42 000 so‘m</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#667085]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-[#14213D] block">Mavjudligi</span>
                    <span>Omborda bor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Description Details Area */}
      <div className="mt-8 bg-white rounded-[20px] border border-[#E5EAF2] p-6 sm:p-8 shadow-2xs">
        {/* Tabs Bar */}
        <div className="flex items-center gap-8 border-b border-[#E5EAF2] pb-3 mb-6">
          {[
            { id: 'desc', label: 'Tavsif' },
            { id: 'specs', label: 'Xususiyatlar' },
            { id: 'delivery', label: 'Yetkazib berish' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-sm font-bold pb-3 relative transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'text-[#0B2E73]'
                  : 'text-[#667085] hover:text-[#14213D]'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-[-13px] left-0 right-0 h-[3px] bg-[#FF5A00] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Description & 4 Feature Bullets */}
        {activeTab === 'desc' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-[#475467] leading-relaxed">
              <p>{product.description}</p>
              <p>
                Ushbu vosita korporativ mijozlar talablariga to‘liq mos keladi. Yuqori konsentratsiya sarf-xarajatlarni tejash imkonini beradi. Har qanday sirtlar va sanuzellar uchun xavfsiz.
              </p>
            </div>

            {/* 4 Feature diamonds matching mockup */}
            <div className="lg:col-span-5 bg-[#F7F9FC] rounded-[16px] p-5 border border-[#E5EAF2] space-y-3">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#0B2E73]">
                <span className="text-[#FF5A00]">◆</span>
                <span>Antibakterial himoya</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#0B2E73]">
                <span className="text-[#FF5A00]">◆</span>
                <span>Yoqimli hid</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#0B2E73]">
                <span className="text-[#FF5A00]">◆</span>
                <span>Sarf tejamkor</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#0B2E73]">
                <span className="text-[#FF5A00]">◆</span>
                <span>Professional sifat</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Specifications */}
        {activeTab === 'specs' && (
          <div className="max-w-2xl overflow-hidden rounded-[12px] border border-[#E5EAF2]">
            <table className="w-full text-xs sm:text-sm text-left">
              <tbody className="divide-y divide-[#E5EAF2]">
                <tr className="bg-[#F7F9FC]">
                  <td className="py-3 px-4 font-semibold text-[#0B2E73] w-1/3">Mahsulot nomi</td>
                  <td className="py-3 px-4 text-[#14213D]">{product.name}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#0B2E73]">Brend</td>
                  <td className="py-3 px-4 text-[#14213D]">{product.brand}</td>
                </tr>
                <tr className="bg-[#F7F9FC]">
                  <td className="py-3 px-4 font-semibold text-[#0B2E73]">Kategoriya</td>
                  <td className="py-3 px-4 text-[#14213D]">{product.categoryName}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#0B2E73]">Artikul (SKU)</td>
                  <td className="py-3 px-4 text-[#14213D]">{product.sku}</td>
                </tr>
                {Object.entries(product.specifications).map(([key, val], idx) => (
                  <tr key={key} className={idx % 2 === 0 ? 'bg-[#F7F9FC]' : ''}>
                    <td className="py-3 px-4 font-semibold text-[#0B2E73]">{key}</td>
                    <td className="py-3 px-4 text-[#14213D]">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Delivery */}
        {activeTab === 'delivery' && (
          <div className="space-y-4 text-xs sm:text-sm text-[#475467] leading-relaxed max-w-2xl">
            <p>
              Toshkent shahri bo‘ylab 500 000 so‘mdan yuqori bo‘lgan barcha zayavkalar keyingi kuniyoq to‘g‘ridan-to‘g‘ri ofis yoki korxona omboriga bepul yetkazib beriladi.
            </p>
            <p>
              Barcha rasmiy hujjatlar (shartnoma, hisob-faktura / E-Faktura, ishonchnoma) mahsulot bilan birga yoki elektron tizim orqali taqdim etiladi.
            </p>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#14213D]">O‘xshash mahsulotlar</h3>
            <button
              onClick={() => navigate(`/catalog/${product.categoryId}`)}
              className="text-xs font-semibold text-[#FF5A00] hover:underline cursor-pointer"
            >
              Barchasini ko‘rish →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
