import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  Search, 
  X, 
  Sparkles, 
  Check,
  ChevronDown
} from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ShopPageProps {
  onSelectProduct: (slug: string) => void;
  onQuickView: (product: Product) => void;
  initialCategory?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onSelectProduct,
  onQuickView,
  initialCategory,
}) => {
  const { products, categories, storeSettings, cmsPages } = useStore();

  const cmsData = cmsPages['shop'] || {
    title: 'THE HYDRON CATALOG',
    eyebrow: 'ALL-TERRAIN HYDRATION HARDWARE',
    subtitle: 'Precision vacuum insulated flasks, high-capacity tumblers, and aerospace grade titanium bottles.'
  };

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'ALL');
  const [selectedCapacity, setSelectedCapacity] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'FEATURED' | 'PRICE_LOW' | 'PRICE_HIGH' | 'RATING'>('FEATURED');
  const [searchFilter, setSearchFilter] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const capacities = ['500ml', '600ml', '750ml', '900ml', '1000ml', '1200ml'];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category check
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) {
        return false;
      }
      // Capacity check
      if (selectedCapacity !== 'ALL' && !p.capacities?.includes(selectedCapacity)) {
        return false;
      }
      // Stock check
      if (inStockOnly && !p.inStock) {
        return false;
      }
      // Search term
      if (searchFilter.trim() !== '') {
        const query = searchFilter.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        const matchesDesc = p.shortDescription.toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'PRICE_LOW') return a.price - b.price;
      if (sortBy === 'PRICE_HIGH') return b.price - a.price;
      if (sortBy === 'RATING') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedCapacity, inStockOnly, searchFilter, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('ALL');
    setSelectedCapacity('ALL');
    setSearchFilter('');
    setInStockOnly(false);
    setSortBy('FEATURED');
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Top Banner */}
      <div className="bg-[#08080a] text-white py-12 sm:py-16 px-4 sm:px-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto text-left space-y-2">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar Filters (Desktop) */}
          <div className="hidden lg:block w-64 shrink-0 space-y-8 text-left">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filter catalog..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full text-xs bg-zinc-50 border border-zinc-300 p-2.5 pr-8 focus:outline-hidden focus:border-black"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute right-2.5 top-3" />
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-black font-heading">
                SERIES & COLLECTIONS
              </h3>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className={`w-full text-left py-1.5 px-2 rounded-none transition-colors flex justify-between ${
                    selectedCategory === 'ALL'
                      ? 'bg-black text-white font-bold'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  <span>All Categories</span>
                  <span>({products.length})</span>
                </button>
                {categories.map((cat) => {
                  const count = products.filter(p => p.category === cat.name).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full text-left py-1.5 px-2 rounded-none transition-colors flex justify-between ${
                        selectedCategory === cat.name
                          ? 'bg-black text-white font-bold'
                          : 'text-zinc-600 hover:text-black'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span>({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume / Capacity Filter */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-black font-heading">
                CAPACITY / VOLUME
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => setSelectedCapacity('ALL')}
                  className={`py-1.5 px-2 border text-center transition-colors ${
                    selectedCapacity === 'ALL'
                      ? 'bg-black text-white border-black font-bold'
                      : 'bg-white text-zinc-700 border-zinc-200 hover:border-black'
                  }`}
                >
                  All Sizes
                </button>
                {capacities.map((cap) => (
                  <button
                    key={cap}
                    onClick={() => setSelectedCapacity(cap)}
                    className={`py-1.5 px-2 border text-center transition-colors ${
                      selectedCapacity === cap
                        ? 'bg-black text-white border-black font-bold'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-black'
                    }`}
                  >
                    {cap}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-3 pt-2 border-t border-zinc-200">
              <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded-none text-black focus:ring-0"
                />
                <span className="font-semibold uppercase tracking-wider">In Stock Only</span>
              </label>
            </div>

            {/* Reset */}
            {(selectedCategory !== 'ALL' || selectedCapacity !== 'ALL' || searchFilter || inStockOnly) && (
              <button
                onClick={resetFilters}
                className="w-full text-xs font-mono uppercase tracking-wider py-2 bg-zinc-100 text-zinc-600 hover:text-black hover:bg-zinc-200 transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* Main Product Area */}
          <div className="flex-1 space-y-6">
            
            {/* Top Toolbar (Sort & Count) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
              <div className="text-xs font-mono text-zinc-500 text-left">
                Showing <strong className="text-black">{filteredProducts.length}</strong> of {products.length} hydration vessels
              </div>

              <div className="flex items-center gap-4 justify-between sm:justify-end">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider border border-zinc-300 px-3 py-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-400 uppercase hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs font-bold uppercase bg-white border border-zinc-300 px-3 py-2 text-black focus:outline-hidden focus:border-black cursor-pointer font-heading"
                  >
                    <option value="FEATURED">Featured & Popular</option>
                    <option value="PRICE_LOW">Price: Low to High</option>
                    <option value="PRICE_HIGH">Price: High to Low</option>
                    <option value="RATING">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Filters Dropdown panel */}
            {mobileFilterOpen && (
              <div className="lg:hidden p-4 bg-zinc-50 border border-zinc-200 space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-black">Filter by Category:</span>
                  <button onClick={() => setMobileFilterOpen(false)}><X className="w-4 h-4" /></button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCategory('ALL')}
                    className={`text-xs px-2.5 py-1 border ${selectedCategory === 'ALL' ? 'bg-black text-white' : 'bg-white'}`}
                  >
                    All
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.name)}
                      className={`text-xs px-2.5 py-1 border ${selectedCategory === c.name ? 'bg-black text-white' : 'bg-white'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <p className="text-base font-bold uppercase text-black font-heading">
                  No Hydron vessels match your filter criteria.
                </p>
                <p className="text-xs text-zinc-500">
                  Try selecting a different volume, category or clearing your search term.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-2 bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3"
                >
                  CLEAR FILTERS
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onNavigateToProduct={onSelectProduct}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
