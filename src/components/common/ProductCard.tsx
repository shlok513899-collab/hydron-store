import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Star, 
  Eye, 
  Check, 
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { Product, ProductOptionColor } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onNavigateToProduct: (slug: string) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onNavigateToProduct,
  onQuickView 
}) => {
  const { 
    storeSettings, 
    addToCart, 
    generateProductWhatsAppUrl 
  } = useStore();

  const [selectedColor, setSelectedColor] = useState<ProductOptionColor>(
    product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'Onyx', hex: '#18181b' }
  );
  const [selectedCapacity, setSelectedCapacity] = useState<string>(
    product.capacities && product.capacities.length > 0 ? product.capacities[0] : 'Standard'
  );
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const displayImage = selectedColor?.image || (isHovered && product.images?.[1] ? product.images[1] : product.coverImage);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, selectedColor, selectedCapacity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleWhatsAppBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateProductWhatsAppUrl(product, 1, selectedColor, selectedCapacity);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
    : 0;

  return (
    <div 
      className="group flex flex-col bg-white border border-zinc-200 hover:border-black transition-all duration-300 relative cursor-pointer select-none rounded-none"
      onClick={() => onNavigateToProduct(product.slug)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id={`product-card-${product.id}`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/4.6] w-full overflow-hidden bg-zinc-100 flex items-center justify-center">
        {/* Product Image */}
        <img 
          src={displayImage} 
          alt={product.name} 
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="bg-black text-white text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 sm:px-2.5 sm:py-1">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-zinc-900 text-white text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.5 border border-zinc-700">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick View Button (Desktop Hover) */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white/90 text-black hover:bg-black hover:text-white transition-colors opacity-0 group-hover:opacity-100 z-10 hidden sm:flex items-center justify-center"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        {/* Stock status indicator */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1.5 border border-white">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* Product Details Content */}
      <div className="p-3 sm:p-4.5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-zinc-500 mb-1">
            <span className="uppercase tracking-wider font-mono truncate max-w-[100px] sm:max-w-none">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-black font-semibold shrink-0">
              <Star className="w-3 h-3 fill-black text-black" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-zinc-400 font-normal text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-bold sm:font-extrabold text-xs sm:text-base uppercase tracking-tight text-black font-heading line-clamp-1 group-hover:underline">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-[11px] sm:text-xs text-zinc-600 line-clamp-2 mt-1 font-normal leading-relaxed hidden sm:block">
            {product.shortDescription}
          </p>
        </div>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="pt-1.5 border-t border-zinc-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5" onClick={(e) => e.stopPropagation()}>
            <span className="text-[9px] sm:text-[10px] uppercase font-mono text-zinc-400 shrink-0">Finish:</span>
            <div className="flex items-center gap-1">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(c);
                  }}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-all shrink-0 ${
                    selectedColor.name === c.name 
                      ? 'ring-2 ring-black ring-offset-1 scale-110' 
                      : 'border-zinc-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pricing & CTA Buttons */}
        <div className="pt-2 border-t border-zinc-100 flex flex-col space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-lg font-black text-black font-heading">
                {storeSettings.currencySymbol}{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-[10px] sm:text-xs text-zinc-400 line-through font-mono">
                  {storeSettings.currencySymbol}{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">
              {product.inStock ? 'IN STOCK' : 'PRE-ORDER'}
            </span>
          </div>

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-0.5">
            {/* Primary Buy Now via WhatsApp Button */}
            <button
              onClick={handleWhatsAppBuy}
              className="flex items-center justify-center gap-1 bg-black text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider py-2 sm:py-2.5 px-1 hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer truncate"
              title="Direct purchase via WhatsApp concierge"
            >
              <span className="truncate">BUY WA</span>
              <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
            </button>

            {/* Secondary Add to Cart */}
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider py-2 sm:py-2.5 px-1 border border-black transition-all cursor-pointer truncate ${
                addedAnimation 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black hover:bg-zinc-100'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span className="truncate">ADDED</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span className="truncate">BAG</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
