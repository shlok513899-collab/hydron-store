import React, { useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface SearchModalProps {
  onSelectProduct: (slug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onSelectProduct }) => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    searchQuery, 
    setSearchQuery, 
    products, 
    storeSettings 
  } = useStore();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = searchQuery.trim() === '' 
    ? products.slice(0, 4) 
    : products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.features?.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const handleSelect = (slug: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    onSelectProduct(slug);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 md:p-20 flex justify-center items-start animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-white shadow-2xl overflow-hidden border border-zinc-300 mt-6 sm:mt-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="p-4 sm:p-6 border-b border-zinc-200 flex items-center gap-3">
          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search insulated bottles, titanium flasks, tumblers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-base sm:text-lg font-medium text-black focus:outline-hidden placeholder:text-zinc-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs text-zinc-400 hover:text-black uppercase font-mono px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-zinc-500 hover:text-black transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Tag Pills */}
        <div className="px-6 py-3 bg-zinc-50 border-b border-zinc-200 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-500 font-mono text-[11px] uppercase">Trending:</span>
          {['Onyx Pro', 'Vacuum Flask', 'Titanium', 'Tumbler', 'Gym Shaker'].map(term => (
            <button
              key={term}
              onClick={() => setSearchQuery(term)}
              className="px-2.5 py-1 bg-white border border-zinc-200 text-zinc-700 hover:border-black hover:text-black transition-colors rounded-none font-medium"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3 font-mono">
            {searchQuery.trim() === '' ? 'Featured Suggestions' : `Found (${filteredProducts.length}) Results`}
          </p>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <p className="text-sm font-semibold uppercase tracking-wider text-black">No matching bottles found</p>
              <p className="text-xs text-zinc-500 mt-1">Try searching for "Onyx", "750ml", or "Titanium"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => handleSelect(prod.slug)}
                  className="flex items-center gap-4 p-3 border border-zinc-200 hover:border-black bg-white transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-zinc-100 shrink-0 overflow-hidden border border-zinc-200">
                    <img 
                      src={prod.coverImage} 
                      alt={prod.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-mono text-zinc-400">{prod.category}</span>
                    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-tight text-black truncate group-hover:underline font-heading">
                      {prod.name}
                    </h4>
                    <p className="text-xs font-black text-black font-heading mt-0.5">
                      {storeSettings.currencySymbol}{prod.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-zinc-100 border-t border-zinc-200 text-xs text-zinc-500 flex justify-between font-mono">
          <span>Press ESC to close</span>
          <span>Click any product for WhatsApp purchase</span>
        </div>
      </div>
    </div>
  );
};
