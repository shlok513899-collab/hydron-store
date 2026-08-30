import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  Search, 
  X, 
  Check,
  ChevronDown,
  LayoutGrid,
  Square
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
  const [gridColumns, setGridColumns] = useState<2 | 1>(2);

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

  const activeFiltersCount = (selectedCategory !== 'ALL' ? 1 : 0) + 
                             (selectedCapacity !== 'ALL' ? 1 : 0) + 
                             (inStockOnly ? 1 : 0) + 
                             (searchFilter.trim() !== '' ? 1 : 0);

  return (
    <div className="w-full bg-white min-h-screen pb-20 md:pb-12">
      {/* Top Banner */}
      <div className="bg-[#08080a] text-white py-8 sm:py-14 px-4 sm:px-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto text-left space-y-2">
          {cmsData.eyebrow && (
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-400">
              {cmsData.eyebrow}
            </span>
          )}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-heading">
            {cmsData.title}
          </h1>
          {cmsData.subtitle && (
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl line-clamp-2">
              {cmsData.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Mobile Horizontal Category Filter Strip */}
      <div className="lg:hidden sticky top-[52px] sm:top-[60px] z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-4 py-2.5 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 whitespace-nowrap transition-colors border ${
              selectedCategory === 'ALL'
                ? 'bg-black text-white border-black'
                : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter(p => p.category === cat.name).length;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 whitespace-nowrap transition-colors border ${
                  isSelected
                    ? 'bg-black text-white border-black'
                    : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
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

            {/* Capacities */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-black font-heading">
                CAPACITY / VOLUME
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setSelectedCapacity('ALL')}
                  className={`py-1.5 px-2 text-xs font-mono border text-center transition-colors ${
                    selectedCapacity === 'ALL'
                      ? 'bg-black text-white border-black font-bold'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  ALL SIZES
                </button>
                {capacities.map((cap) => (
                  <button
                    key={cap}
                    onClick={() => setSelectedCapacity(cap)}
                    className={`py-1.5 px-2 text-xs font-mono border text-center transition-colors ${
                      selectedCapacity === cap
                        ? 'bg-black text-white border-black font-bold'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    {cap}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-black font-heading">
                AVAILABILITY
              </h3>
              <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded-none border-zinc-300 text-black focus:ring-black"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Reset Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="w-full text-xs font-bold uppercase tracking-wider py-2 border border-zinc-300 text-zinc-700 hover:bg-zinc-100 flex items-center justify-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          {/* Right Main Content Area */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            {/* Top Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-50 border border-zinc-200 p-2.5 sm:p-3">
              {/* Filter button & count */}
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 bg-black text-white text-[11px] font-bold uppercase tracking-wider px-3 py-2"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                </button>

                <p className="text-[11px] sm:text-xs font-mono text-zinc-500 uppercase">
                  Showing <strong className="text-black font-bold font-mono">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'bottle' : 'bottles'}
                </p>
              </div>

              {/* Sort By & View toggle */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile Grid Layout Toggle */}
                <div className="lg:hidden flex items-center border border-zinc-300 bg-white">
                  <button
                    onClick={() => setGridColumns(2)}
                    className={`p-1.5 ${gridColumns === 2 ? 'bg-black text-white' : 'text-zinc-500'}`}
                    title="2 Column Grid"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridColumns(1)}
                    className={`p-1.5 ${gridColumns === 1 ? 'bg-black text-white' : 'text-zinc-500'}`}
                    title="1 Column View"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-zinc-500 font-mono hidden sm:inline uppercase text-[11px]">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-[11px] sm:text-xs font-bold uppercase bg-white border border-zinc-300 px-2 sm:px-3 py-1.5 focus:outline-hidden focus:border-black font-mono cursor-pointer"
                  >
                    <option value="FEATURED">Featured</option>
                    <option value="PRICE_LOW">Price: Low to High</option>
                    <option value="PRICE_HIGH">Price: High to Low</option>
                    <option value="RATING">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filter Badges */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-zinc-400 font-mono text-[10px] uppercase">Active:</span>
                {selectedCategory !== 'ALL' && (
                  <span className="inline-flex items-center gap-1 bg-zinc-100 border border-zinc-300 px-2 py-0.5 text-[11px] font-mono">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('ALL')} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedCapacity !== 'ALL' && (
                  <span className="inline-flex items-center gap-1 bg-zinc-100 border border-zinc-300 px-2 py-0.5 text-[11px] font-mono">
                    Size: {selectedCapacity}
                    <button onClick={() => setSelectedCapacity('ALL')} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 bg-zinc-100 border border-zinc-300 px-2 py-0.5 text-[11px] font-mono">
                    In Stock Only
                    <button onClick={() => setInStockOnly(false)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {searchFilter && (
                  <span className="inline-flex items-center gap-1 bg-zinc-100 border border-zinc-300 px-2 py-0.5 text-[11px] font-mono">
                    Query: "{searchFilter}"
                    <button onClick={() => setSearchFilter('')} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-xs text-red-600 font-bold uppercase hover:underline ml-1"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className={`grid ${gridColumns === 1 ? 'grid-cols-1' : 'grid-cols-2'} sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-2.5 sm:gap-5`}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onNavigateToProduct={onSelectProduct}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center border border-zinc-200 bg-zinc-50 space-y-4 p-8">
                <p className="text-base font-bold uppercase tracking-tight text-black font-heading">
                  No bottles match the selected filter criteria
                </p>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Try clearing some filter options or searching for a different bottle series or capacity.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-up Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in">
          <div className="bg-white w-full max-h-[85vh] overflow-y-auto rounded-t-2xl p-6 space-y-6 shadow-2xl animate-in slide-in-from-bottom duration-300 text-left">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-black" />
                <h3 className="text-sm font-black uppercase tracking-wider text-black font-heading">
                  FILTER & REFINE CATALOG
                </h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-zinc-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-black font-heading">Category</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className={`p-2.5 text-xs font-bold uppercase border text-center transition-colors ${
                    selectedCategory === 'ALL'
                      ? 'bg-black text-white border-black'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                  }`}
                >
                  All ({products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`p-2.5 text-xs font-bold uppercase border text-center transition-colors truncate ${
                      selectedCategory === cat.name
                        ? 'bg-black text-white border-black'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Capacities */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-black font-heading">Capacity</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedCapacity('ALL')}
                  className={`py-2 text-xs font-mono font-bold uppercase border text-center ${
                    selectedCapacity === 'ALL' ? 'bg-black text-white border-black' : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                  }`}
                >
                  ALL
                </button>
                {capacities.map((cap) => (
                  <button
                    key={cap}
                    onClick={() => setSelectedCapacity(cap)}
                    className={`py-2 text-xs font-mono font-bold uppercase border text-center ${
                      selectedCapacity === cap ? 'bg-black text-white border-black' : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {cap}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Switch */}
            <div className="pt-2">
              <label className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 text-xs font-bold uppercase">
                <span>In Stock Products Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-black border-zinc-300 rounded-none focus:ring-black"
                />
              </label>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-zinc-200 flex gap-3">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 bg-black text-white font-bold uppercase text-xs tracking-wider py-3.5 text-center"
              >
                SHOW {filteredProducts.length} PRODUCTS
              </button>
              <button
                onClick={() => {
                  resetFilters();
                }}
                className="border border-zinc-300 text-zinc-700 font-bold uppercase text-xs px-4 py-3.5"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
