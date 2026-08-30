import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { Product } from '../types';

interface CollectionsPageProps {
  onSelectProduct: (slug: string) => void;
  onQuickView: (product: Product) => void;
  onNavigateToShopWithCategory: (categoryName: string) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  onSelectProduct,
  onQuickView,
  onNavigateToShopWithCategory,
}) => {
  const { categories, products, cmsPages } = useStore();

  const cmsData = cmsPages['collections'] || {
    title: 'CURATED COLLECTIONS',
    eyebrow: 'HYDRON PRODUCT FAMILIES',
    subtitle: 'Explore dedicated series built for mountain ascents, yoga sessions, desk focus, and ultra-light travel.'
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-[#050507] text-white py-14 sm:py-20 px-4 sm:px-8 border-b border-zinc-800 text-left">
        <div className="max-w-7xl mx-auto space-y-2">
          {cmsData.eyebrow && (
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400">
              {cmsData.eyebrow}
            </span>
          )}
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-heading">
            {cmsData.title}
          </h1>
          {cmsData.subtitle && (
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              {cmsData.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Collection Series Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 space-y-20 text-left">
        {categories.map((cat, idx) => {
          const catProducts = products.filter(p => p.category === cat.name);
          return (
            <div key={cat.id} className="space-y-8 border-b border-zinc-200 pb-16 last:border-b-0">
              
              {/* Category Header Card */}
              <div className="relative aspect-[21/7] sm:aspect-[21/6] overflow-hidden bg-zinc-900 border border-zinc-800 flex items-end p-6 sm:p-10 text-white">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover object-center brightness-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                <div className="relative z-10 max-w-2xl space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-300">
                    SERIES 0{cat.displayOrder || idx + 1}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight font-heading">
                    {cat.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Products in this category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {catProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onNavigateToProduct={onSelectProduct}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>

              {/* View all in category button */}
              <div className="pt-2">
                <button
                  onClick={() => onNavigateToShopWithCategory(cat.name)}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:underline"
                >
                  <span>SHOP ALL {cat.name.toUpperCase()} ({catProducts.length} ITEMS)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
