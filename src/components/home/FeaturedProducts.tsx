import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface FeaturedProductsProps {
  onNavigateToProduct: (slug: string) => void;
  onNavigateToShop: () => void;
  onQuickView: (product: Product) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  onNavigateToProduct,
  onNavigateToShop,
  onQuickView,
}) => {
  const { products, homepageContent } = useStore();
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'BESTSELLER' | 'INSULATED' | 'SPORT'>('ALL');

  const filtered = products.filter((p) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'BESTSELLER') return p.badge === 'BESTSELLER' || p.isFeatured;
    if (selectedFilter === 'INSULATED') return p.category === 'Insulated Series';
    if (selectedFilter === 'SPORT') return p.category === 'Active & Sport' || p.category === 'Tumblers & Travel';
    return true;
  });

  return (
    <section className="w-full bg-white py-16 sm:py-24 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400 font-mono">
              CURATED CRAFTSMANSHIP
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-black font-heading">
              {homepageContent.featuredBottlesTitle || 'FLAGSHIP HYDRON VESSELS'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-xl">
              {homepageContent.featuredBottlesSubtitle || 'Engineered with relentless attention to detail, thermal precision, and tactile minimalism.'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'ALL GEAR' },
              { id: 'BESTSELLER', label: 'BESTSELLERS' },
              { id: 'INSULATED', label: 'INSULATED FLASKS' },
              { id: 'SPORT', label: 'ACTIVE & TRAVEL' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-2 border transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-black text-white border-black'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-black hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigateToProduct={onNavigateToProduct}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* Bottom Explore All CTA */}
        <div className="mt-12 text-center pt-8 border-t border-zinc-100">
          <button
            onClick={onNavigateToShop}
            className="inline-flex items-center gap-3 bg-black text-white text-xs sm:text-sm font-bold uppercase tracking-[0.2em] px-8 py-4 hover:bg-zinc-800 transition-all cursor-pointer shadow-md"
          >
            <span>VIEW COMPLETE CATALOG ({products.length} PRODUCTS)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
