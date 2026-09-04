import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { HeroSection } from '../components/HeroSection';
import { CategoryPillsSection } from '../components/CategoryPillsSection';
import { B2BInfoCards } from '../components/B2BInfoCards';
import { ProductRowSection } from '../components/ProductRowSection';
import { BundlePacksSection } from '../components/BundlePacksSection';
import { IndustriesSection } from '../components/IndustriesSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { PartnersSection } from '../components/PartnersSection';

export const HomePage: React.FC = () => {
  const { products } = useApp();
  const [popularTab, setPopularTab] = useState<'all' | 'hit'>('all');

  // 1. Ommabop mahsulotlar (Popular Products matching mockup)
  const popularProducts = useMemo(() => {
    if (popularTab === 'hit') {
      return products.filter((p) => p.isPopular && (p.reviewsCount > 100 || p.tag?.includes('savdo')));
    }
    return products.filter((p) => p.isPopular);
  }, [products, popularTab]);

  // 2. Individual himoya vositalari (PPE / Gloves)
  const ppeProducts = useMemo(() => {
    return products.filter((p) => p.categoryId === 'himoya-vositalari');
  }, [products]);

  // 3. Maishiy kimyo va klining vositalari (Chemicals & Detergents)
  const chemicalProducts = useMemo(() => {
    return products.filter((p) => p.categoryId === 'maishiy-kimyo');
  }, [products]);

  // 4. Yangi kelgan gigiyena tovarlari (New Arrivals)
  const newArrivals = useMemo(() => {
    return products.filter((p) => p.isNew);
  }, [products]);

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* 1. Modern Hero Canvas */}
      <HeroSection />

      {/* 2. Minimalist Categories with Arrows Carousel */}
      <CategoryPillsSection />

      {/* 3. B2B Kafolat va Afzalliklar Kartochkalari */}
      <B2BInfoCards />

      {/* 4. Ommabop Mahsulotlar (Popular Product Row) */}
      <ProductRowSection
        id="section-popular-products"
        title="Ommabop mahsulotlar"
        categoryLink="/catalog"
        products={popularProducts}
        tabs={[
          { id: 'all', label: 'Barcha xitlar' },
          { id: 'hit', label: 'Eng ko‘p sotilgan' },
        ]}
        activeTab={popularTab}
        onTabChange={(tabId) => setPopularTab(tabId as 'all' | 'hit')}
        autoScrollSpeed={0.6}
      />

      {/* 5. Tayyor B2B To‘plamlar (#section-bundle-packs) with Soft Contrast Band */}
      <div className="bg-[#F8FAFC] py-3 border-y border-[#EEF2F6]">
        <BundlePacksSection />
      </div>

      {/* 6. Individual himoya vositalari va qo‘lqoplar */}
      <ProductRowSection
        id="section-ppe-products"
        title="Individual himoya vositalari"
        categoryLink="/catalog/himoya-vositalari"
        products={ppeProducts}
        autoScrollSpeed={0.6}
      />

      {/* 7. Biz kimlar uchun ishlaymiz? (Industries) */}
      <IndustriesSection />

      {/* 8. Maishiy kimyo va tozalash vositalari */}
      <ProductRowSection
        id="section-chemicals-products"
        title="Maishiy kimyo va tozalash"
        categoryLink="/catalog/maishiy-kimyo"
        products={chemicalProducts}
        autoScrollSpeed={0.6}
      />

      {/* 9. Yangi kelgan tovarlar (New Arrivals) */}
      <ProductRowSection
        id="section-new-arrivals"
        title="Yangi kelgan tovarlar"
        categoryLink="/catalog"
        products={newArrivals}
        autoScrollSpeed={0.6}
      />

      {/* 10. Mijozlarimiz fikrlari with Soft Contrast Band */}
      <div className="bg-[#F8FAFC] py-4 border-y border-[#EEF2F6]">
        <TestimonialsSection />
      </div>

      {/* 12. Bizning hamkorlarimiz */}
      <PartnersSection />
    </div>
  );
};
