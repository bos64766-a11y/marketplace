import React, { useMemo } from 'react';
import { useApp, DEFAULT_SHOWCASE_SECTIONS } from '../context/AppContext';
import { HeroSection } from '../components/HeroSection';
import { CategoryPillsSection } from '../components/CategoryPillsSection';
import { B2BInfoCards } from '../components/B2BInfoCards';
import { ProductRowSection } from '../components/ProductRowSection';
import { PartnersSection } from '../components/PartnersSection';

export const HomePage: React.FC = () => {
  const { products, showcaseSections, t, language } = useApp();

  // 1. Ommabop mahsulotlar (Popular Products)
  const popularProducts = useMemo(() => {
    return products.filter((p) => p.isPopular);
  }, [products]);

  // 2. Dynamic Active Showcase Sections (Industry-focused sections)
  const activeShowcaseSections = useMemo(() => {
    return (showcaseSections || [])
      .filter((s) => s.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [showcaseSections]);

  // Map each section to its resolved products
  const sectionsWithProducts = useMemo(() => {
    const productMap = new Map(products.map((p) => [p.id, p]));
    return activeShowcaseSections.map((section) => {
      let sectionProds = (section.productIds || [])
        .map((id) => productMap.get(id))
        .filter((p): p is typeof products[0] => Boolean(p));

      // Fallback: If section has no matched productIds, populate with matching category products
      if (sectionProds.length === 0 && products.length > 0) {
        const linkSlug = section.link ? section.link.replace('/catalog/', '').replace('/catalog', '').trim() : '';
        if (linkSlug) {
          sectionProds = products.filter(
            (p) => p.categoryId === linkSlug || p.categoryName?.toLowerCase().includes(linkSlug)
          );
        }
        if (sectionProds.length === 0) {
          sectionProds = products.slice(0, 6);
        }
      }

      return {
        section,
        products: sectionProds,
      };
    });
  }, [activeShowcaseSections, products]);

  // 3. Yangi kelgan gigiyena tovarlari (New Arrivals)
  const newArrivals = useMemo(() => {
    return products.filter((p) => p.isNew);
  }, [products]);

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* 1. Modern Hero Canvas */}
      <HeroSection />

      {/* 2. Minimalist Categories with Arrows Carousel */}
      <CategoryPillsSection />

      {/* 4. Ommabop Mahsulotlar (Popular Product Row) */}
      <ProductRowSection
        id="section-popular-products"
        title={t.home.popularProducts}
        categoryLink="/catalog"
        products={popularProducts}
        autoScrollSpeed={0.6}
      />

      {/* 6. Dynamic Admin-Controlled Industry Showcase Sections */}
      {sectionsWithProducts.map(({ section, products: secProducts }) => {
        if (!secProducts || secProducts.length === 0) return null;

        const fallback = DEFAULT_SHOWCASE_SECTIONS.find(
          (d) =>
            String(d.id) === String(section.id) ||
            d.title.toLowerCase().trim() === (section.title || '').toLowerCase().trim()
        );
        const displayTitle = language === 'ru'
          ? (section.title_ru || fallback?.title_ru || section.title)
          : section.title;
        const displaySubtitle = language === 'ru'
          ? (section.subtitle_ru || fallback?.subtitle_ru || section.subtitle)
          : section.subtitle;

        return (
          <ProductRowSection
            key={section.id}
            id={`section-${section.id}`}
            title={displayTitle}
            subtitle={displaySubtitle}
            categoryLink={section.link || '/catalog'}
            products={secProducts}
            autoScrollSpeed={0.6}
          />
        );
      })}

      {/* 7. Yangi kelgan tovarlar (New Arrivals) */}
      <ProductRowSection
        id="section-new-arrivals"
        title={t.home.newProducts}
        categoryLink="/catalog"
        products={newArrivals}
        autoScrollSpeed={0.6}
      />

      {/* B2B Kafolat va Afzalliklar Kartochkalari */}
      <B2BInfoCards />

      {/* 9. Bizning hamkorlarimiz */}
      <PartnersSection />
    </div>
  );
};

