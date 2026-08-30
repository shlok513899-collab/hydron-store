import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface CollectionsSectionProps {
  onSelectCategory: (categoryName: string) => void;
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({ onSelectCategory }) => {
  const { categories } = useStore();

  return (
    <section className="w-full bg-[#0a0a0c] text-white py-16 sm:py-24 border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400 font-mono">
            ARCHITECTURAL SERIES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-heading">
            SHOP BY COLLECTION
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Engineered drinkware tailored for high-altitude expeditions, studio workouts, urban commutes, and minimalist desks.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="group relative aspect-[3/4] overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-white transition-all duration-500 cursor-pointer flex flex-col justify-end p-6"
            >
              {/* Category Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-90"
              />

              {/* Gradient Mask */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

              {/* Content */}
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-300">
                    SERIES 0{cat.displayOrder || 1}
                  </span>
                  <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-1.5 transition-transform" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white font-heading">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed opacity-90">
                  {cat.description}
                </p>
                <div className="pt-2">
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-white underline underline-offset-4 decoration-zinc-500 group-hover:decoration-white transition-colors">
                    EXPLORE SERIES
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
