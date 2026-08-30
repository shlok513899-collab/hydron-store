import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Thermometer, 
  Droplet,
  ExternalLink 
} from 'lucide-react';
import { Product, ProductOptionColor } from '../../types';
import { useStore } from '../../context/StoreContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewFullDetails: (slug: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ 
  product, 
  onClose,
  onViewFullDetails 
}) => {
  const { storeSettings, addToCart, generateProductWhatsAppUrl } = useStore();

  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState<ProductOptionColor>(
    product.colors?.[0] || { name: 'Matte Onyx', hex: '#18181b' }
  );
  const [selectedCapacity, setSelectedCapacity] = useState<string>(
    product.capacities?.[0] || '750ml'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isAdded, setIsAdded] = useState(false);

  const images = product.images?.length ? product.images : [product.coverImage];
  const currentImage = selectedColor?.image || images[activeImageIndex] || product.coverImage;

  const handleWhatsApp = () => {
    const url = generateProductWhatsAppUrl(product, quantity, selectedColor, selectedCapacity);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedCapacity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs p-4 sm:p-6 md:p-10 flex items-center justify-center animate-in fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white shadow-2xl border border-zinc-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white text-black hover:bg-black hover:text-white transition-colors border border-zinc-200 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image Gallery */}
          <div className="bg-zinc-100 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-200">
            <div className="relative aspect-square overflow-hidden bg-white border border-zinc-200 flex items-center justify-center">
              <img 
                src={currentImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail switcher */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 shrink-0 border overflow-hidden transition-all ${
                      activeImageIndex === idx ? 'border-black ring-1 ring-black' : 'border-zinc-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Buying Flow */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                <span className="uppercase font-mono tracking-widest">{product.category}</span>
                <div className="flex items-center gap-1 text-black font-semibold">
                  <Star className="w-4 h-4 fill-black text-black" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-zinc-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-heading leading-tight">
                {product.name}
              </h2>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl sm:text-3xl font-black text-black font-heading">
                  {storeSettings.currencySymbol}{product.price.toLocaleString('en-IN')}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-zinc-400 line-through font-mono">
                    {storeSettings.currencySymbol}{product.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  IN STOCK • SHIPS TODAY
                </span>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-zinc-600 mt-4 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-5 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-black flex justify-between">
                    <span>Finish / Color:</span>
                    <span className="text-zinc-500 font-normal">{selectedColor.name}</span>
                  </label>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c)}
                        className={`w-7 h-7 rounded-full border transition-all ${
                          selectedColor.name === c.name 
                            ? 'ring-2 ring-black ring-offset-2 scale-110' 
                            : 'border-zinc-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Capacity Selection */}
              {product.capacities && product.capacities.length > 0 && (
                <div className="mt-5 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-black flex justify-between">
                    <span>Capacity / Volume:</span>
                    <span className="text-zinc-500 font-normal">{selectedCapacity}</span>
                  </label>
                  <div className="flex gap-2">
                    {product.capacities.map((cap) => (
                      <button
                        key={cap}
                        onClick={() => setSelectedCapacity(cap)}
                        className={`text-xs font-mono font-bold px-3 py-1.5 border transition-all ${
                          selectedCapacity === cap
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-zinc-700 border-zinc-300 hover:border-black'
                        }`}
                      >
                        {cap}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-5 flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-black">Quantity:</span>
                <div className="flex items-center border border-zinc-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 hover:bg-zinc-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-mono font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 hover:bg-zinc-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4 border-t border-zinc-200">
              {/* WhatsApp Prominent Buy Button */}
              <button
                onClick={handleWhatsApp}
                className="w-full bg-black text-white text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] py-3.5 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all cursor-pointer shadow-md"
              >
                <span>BUY NOW VIA WHATSAPP</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Add to Bag & View Details */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3 text-xs font-bold uppercase tracking-wider border border-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isAdded ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
                  }`}
                >
                  {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  <span>{isAdded ? 'ADDED TO BAG' : 'ADD TO BAG'}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onViewFullDetails(product.slug);
                  }}
                  className="w-full py-3 text-xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-800 hover:bg-zinc-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>FULL DETAILS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
