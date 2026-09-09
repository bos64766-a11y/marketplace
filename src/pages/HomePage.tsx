import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { HeroSection } from '../components/HeroSection';
import { CategoryPillsSection } from '../components/CategoryPillsSection';
import { B2BInfoCards } from '../components/B2BInfoCards';
import { ProductRowSection } from '../components/ProductRowSection';
import { PartnersSection } from '../components/PartnersSection';
import {
  Building2,
  Utensils,
  Sparkles,
  Factory,
  HardHat,
  Briefcase,
  Shield,
  Package,
} from 'lucide-react';

const getSectionIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Building2':
      return <Building2 className="w-5 h-5" />;
    case 'Utensils':
      return <Utensils className="w-5 h-5" />;
    case 'Sparkles':
      return <Sparkles className="w-5 h-5" />;
    case 'Factory':
      return <Factory className="w-5 h-5" />;
    case 'HardHat':
      return <HardHat className="w-5 h-5" />;
    case 'Briefcase':
      return <Briefcase className="w-5 h-5" />;
    case 'Shield':
      return <Shield className="w-5 h-5" />;
    default:
      return <Package className="w-5 h-5" />;
  }
};

export const HomePage: React.FC = () => {
  const { products, showcaseSections } = useApp();

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
      const sectionProds = (section.productIds || [])
        .map((id) => productMap.get(id))
        .filter((p): p is typeof products[0] => Boolean(p));

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
        title="Ommabop mahsulotlar"
        categoryLink="/catalog"
        products={popularProducts}
        autoScrollSpeed={0.6}
      />

      {/* 6. Dynamic Admin-Controlled Industry Showcase Sections */}
      {sectionsWithProducts.map(({ section, products: secProducts }) => {
        if (!secProducts || secProducts.length === 0) return null;

        return (
          <ProductRowSection
            key={section.id}
            id={`section-${section.id}`}
            title={section.title}
            subtitle={section.subtitle}
            badge={section.badge}
            icon={getSectionIcon(section.icon)}
            categoryLink={section.link || '/catalog'}
            products={secProducts}
            autoScrollSpeed={0.6}
          />
        );
      })}

      {/* 7. Yangi kelgan tovarlar (New Arrivals) */}
      <ProductRowSection
        id="section-new-arrivals"
        title="Yangi kelgan tovarlar"
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

