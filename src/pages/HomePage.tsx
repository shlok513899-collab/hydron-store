import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ValueStrip } from '../components/home/ValueStrip';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { CollectionsSection } from '../components/home/CollectionsSection';
import { ProductShowcase } from '../components/home/ProductShowcase';
import { InteractiveCustomizer } from '../components/home/InteractiveCustomizer';
import { BrandStorySection } from '../components/home/BrandStorySection';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { FAQSection } from '../components/home/FAQSection';
import { Product } from '../types';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectProduct: (slug: string) => void;
  onQuickView: (product: Product) => void;
  onSelectCategory: (categoryName: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProduct,
  onQuickView,
  onSelectCategory,
}) => {
  return (
    <div className="w-full flex flex-col bg-white">
      {/* 1. Hero Section (Recreated from Reference Image) */}
      <HeroSection onExplore={() => onNavigate('/shop')} />

      {/* 2. 4-Column Value Strip (Recreated from Reference Image) */}
      <ValueStrip />

      {/* 3. Flagship Products Grid with WhatsApp CTAs */}
      <FeaturedProducts
        onNavigateToProduct={onSelectProduct}
        onNavigateToShop={() => onNavigate('/shop')}
        onQuickView={onQuickView}
      />

      {/* 4. Series & Collections */}
      <CollectionsSection onSelectCategory={onSelectCategory} />

      {/* 5. Material & Thermodynamics Showcase */}
      <ProductShowcase onExploreTech={() => onNavigate('/shop')} />

      {/* 6. Interactive Live Customizer */}
      <InteractiveCustomizer />

      {/* 7. Brand Manifesto */}
      <BrandStorySection onNavigateToAbout={() => onNavigate('/about')} />

      {/* 8. Verified Buyer Reviews */}
      <ReviewsSection />

      {/* 9. Frequently Asked Questions */}
      <FAQSection onNavigateToFAQ={() => onNavigate('/faq')} />
    </div>
  );
};
