import React, { useState } from 'react';
import { 
  Star, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Thermometer, 
  Check, 
  ChevronRight, 
  MessageSquare,
  Sparkles,
  Info,
  Droplet,
  Layers,
  Award,
  ChevronDown
} from 'lucide-react';
import { Product, ProductOptionColor } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { useStore } from '../context/StoreContext';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  onSelectProduct: (slug: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slug,
  onNavigate,
  onSelectProduct,
}) => {
  const { products, storeSettings, addToCart, generateProductWhatsAppUrl, trackAndOpenWhatsApp, reviews } = useStore();

  const product = products.find(p => p.slug === slug) || products[0];

  const [selectedColor, setSelectedColor] = useState<ProductOptionColor>(
    product?.colors?.[0] || { name: 'Matte Onyx', hex: '#18181b' }
  );
  const [selectedCapacity, setSelectedCapacity] = useState<string>(
    product?.capacities?.[0] || '750ml'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState<'SPECS' | 'FEATURES' | 'CARE' | 'WARRANTY'>('SPECS');

  if (!product) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-bold">Product not found</p>
        <button onClick={() => onNavigate('/shop')} className="mt-4 bg-black text-white px-6 py-2 text-xs font-bold uppercase">
          Back to Shop
        </button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.coverImage];
  const activeImage = activeImageUrl || images[activeImageIndex] || product.coverImage;

  const handleWhatsAppBuy = () => {
    const url = generateProductWhatsAppUrl(product, quantity, selectedColor, selectedCapacity);
    trackAndOpenWhatsApp(url, 'PRODUCT_BUY_NOW', {
      productId: product.id,
      productName: product.name,
    });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedCapacity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 4);

  const productReviews = reviews.filter(r => r.productId === product.id && r.status === 'APPROVED');

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
    : 0;

  return (
    <div className="w-full bg-white min-h-screen pb-24 md:pb-16">
      {/* Breadcrumbs */}
      <div className="border-b border-zinc-200 bg-[#fbfbfc] py-3 px-4 sm:px-8 text-[11px] sm:text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
          <button onClick={() => onNavigate('/')} className="hover:text-black transition-colors shrink-0">HOME</button>
          <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
          <button onClick={() => onNavigate('/shop')} className="hover:text-black transition-colors shrink-0">SHOP</button>
          <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
          <span className="text-zinc-400 shrink-0 truncate max-w-[120px]">{product.category.toUpperCase()}</span>
          <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
          <span className="text-black font-bold uppercase truncate max-w-[160px] sm:max-w-[240px]">{product.name}</span>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          
          {/* Left Column: Gallery (Col 1-7) */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            {/* Primary Main Image Box */}
            <div className="relative aspect-[4/4.8] w-full overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center group">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 z-10">
                {product.badge && (
                  <span className="bg-black text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-1">
                    {product.badge}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-zinc-900 text-white text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 border border-zinc-700">
                    SAVE {discountPercent}%
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[10px] sm:text-[11px] font-mono uppercase text-zinc-800 border border-zinc-200">
                18/8 STEEL • TEMPLOCK™
              </div>
            </div>

            {/* Thumbnails Row */}
            {images.length > 1 && (
              <div className="flex sm:grid sm:grid-cols-5 gap-2.5 overflow-x-auto no-scrollbar py-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setActiveImageUrl(img);
                    }}
                    className={`w-16 h-16 sm:w-auto sm:aspect-square border overflow-hidden transition-all shrink-0 cursor-pointer ${
                      activeImage === img 
                        ? 'border-black ring-2 ring-black' 
                        : 'border-zinc-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Buying Interface & Details (Col 8-12) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-left">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-2 font-mono">
                <span className="uppercase tracking-widest">{product.category}</span>
                <div className="flex items-center gap-1.5 text-black font-semibold">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-black text-black" />
                    ))}
                  </div>
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-zinc-400 font-normal">({product.reviewCount})</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-black font-heading leading-tight">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl sm:text-3xl font-black text-black font-heading">
                  {storeSettings.currencySymbol}{product.price.toLocaleString('en-IN')}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm sm:text-base text-zinc-400 line-through font-mono">
                    {storeSettings.currencySymbol}{product.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[10px] sm:text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  {product.inStock ? 'IN STOCK • DISPATCHES IN 24H' : 'PRE-ORDER'}
                </span>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-zinc-600 mt-3 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Color Finish Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-black">
                    <span>Finish Colorway:</span>
                    <span className="text-zinc-600 font-medium font-mono">{selectedColor.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          setSelectedColor(c);
                          if (c.image) {
                            setActiveImageUrl(c.image);
                          }
                        }}
                        className={`flex items-center gap-2 px-3 py-2 border transition-all cursor-pointer ${
                          selectedColor.name === c.name 
                            ? 'border-black ring-1 ring-black bg-zinc-50 font-bold' 
                            : 'border-zinc-200 hover:border-zinc-400 bg-white'
                        }`}
                      >
                        <span 
                          className="w-4 h-4 rounded-full border border-zinc-300 shrink-0" 
                          style={{ backgroundColor: c.hex }} 
                        />
                        <span className="text-xs text-black">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Capacity / Volume Selection */}
              {product.capacities && product.capacities.length > 0 && (
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-black">
                    <span>Capacity / Size:</span>
                    <span className="text-zinc-600 font-mono">{selectedCapacity}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {product.capacities.map((cap) => (
                      <button
                        key={cap}
                        onClick={() => setSelectedCapacity(cap)}
                        className={`py-2.5 text-xs font-mono font-bold uppercase border transition-all cursor-pointer ${
                          selectedCapacity === cap
                            ? 'bg-black text-white border-black shadow-xs'
                            : 'bg-white text-zinc-700 border-zinc-200 hover:border-black'
                        }`}
                      >
                        {cap}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Counter */}
              <div className="mt-5 flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-black">Quantity:</span>
                <div className="flex items-center border border-zinc-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 hover:bg-zinc-100 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-mono font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 hover:bg-zinc-100 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons: WhatsApp Direct Buy + Bag */}
            <div className="space-y-3 pt-6 border-t border-zinc-200 hidden sm:block">
              {/* WhatsApp Checkout Button */}
              <button
                id="pdp-buy-whatsapp-btn"
                onClick={handleWhatsAppBuy}
                className="w-full bg-black text-white text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] py-4 flex items-center justify-center gap-2 hover:bg-zinc-800 active:scale-[0.99] transition-all cursor-pointer shadow-lg"
              >
                <span>BUY NOW VIA WHATSAPP</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 text-xs font-bold uppercase tracking-wider border border-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  addedAnimation ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
                }`}
              >
                {addedAnimation ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                <span>{addedAnimation ? 'ADDED TO BAG' : 'ADD TO BAG'}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-100 text-zinc-600 text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-black shrink-0" />
                <span>Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                <span>2-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-black shrink-0" />
                <span>100% Quality Inspected</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-black shrink-0" />
                <span>24h Cold / 12h Hot</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs / Accordions */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-zinc-200 text-left">
          {/* Tab Selector */}
          <div className="flex border-b border-zinc-200 overflow-x-auto no-scrollbar gap-4 sm:gap-8">
            {[
              { key: 'SPECS', label: 'SPECIFICATIONS' },
              { key: 'FEATURES', label: 'KEY HIGHLIGHTS' },
              { key: 'CARE', label: 'CARE & USAGE' },
              { key: 'WARRANTY', label: 'WARRANTY & CRAFTSMANSHIP' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap relative cursor-pointer ${
                  activeTab === tab.key ? 'text-black font-extrabold' : 'text-zinc-500 hover:text-black'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
                )}
              </button>
            ))}
          </div>

          <div className="py-6 sm:py-8">
            {activeTab === 'SPECS' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
                {(product.specifications || []).map((spec, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-zinc-100 text-xs">
                    <span className="font-bold text-zinc-600 uppercase font-heading">{spec.label}</span>
                    <span className="font-mono text-black">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'FEATURES' && (
              <ul className="space-y-2.5 max-w-2xl text-xs sm:text-sm text-zinc-700">
                {(product.features || []).map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-black shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'CARE' && (
              <div className="space-y-3 max-w-2xl text-xs sm:text-sm text-zinc-700 leading-relaxed">
                <p>• Hand wash recommended with warm, soapy water before first use.</p>
                <p>• Do not place bottle in microwave or deep freezer.</p>
                <p>• Flex cap is top-rack dishwasher safe for easy sanitization.</p>
                <p>• For thorough cleaning, soak lid gasket in vinegar-water solution every month.</p>
              </div>
            )}

            {activeTab === 'WARRANTY' && (
              <div className="space-y-3 max-w-2xl text-xs sm:text-sm text-zinc-700 leading-relaxed">
                <p>• Every Hydron vessel carries our signature <strong>2-Year Limited Craftsmanship Warranty</strong>.</p>
                <p>• Covers vacuum insulation failure, defective threading, and manufacturing flaws.</p>
                <p>• <strong>Strict No-Return / No-RTO Policy:</strong> To ensure sterile, uncompromised food-grade hygiene for every customer, all drinkware sales are final with zero return or RTO acceptance.</p>
                <p>• In the rare event of transit damage, share an uncut unboxing video within 24 hours via WhatsApp for an immediate factory replacement.</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        {productReviews.length > 0 && (
          <div className="mt-12 sm:mt-16 pt-8 border-t border-zinc-200 text-left space-y-6">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-heading">
              VERIFIED OWNER EXPERIENCES ({productReviews.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {productReviews.map((rev) => (
                <div key={rev.id} className="p-5 bg-zinc-50 border border-zinc-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-black text-black" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">{rev.createdAt.slice(0, 10)}</span>
                  </div>
                  <h4 className="text-xs font-bold uppercase text-black font-heading">"{rev.title}"</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">{rev.comment}</p>
                  <p className="text-[11px] font-bold text-black pt-1">— {rev.userName} (Verified Buyer)</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-20 pt-8 border-t border-zinc-200 text-left space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-heading">
                YOU MAY ALSO LIKE
              </h3>
              <button 
                onClick={() => onNavigate('/shop')}
                className="text-xs font-bold uppercase tracking-wider text-black hover:underline"
              >
                View Full Catalog →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-5">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onNavigateToProduct={onSelectProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE STICKY BOTTOM ACTION BAR (Floating right above MobileBottomNav on small screens) */}
      <div className="sm:hidden fixed bottom-[52px] left-0 right-0 z-35 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-3 shadow-2xl flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-black font-heading">
              {storeSettings.currencySymbol}{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono truncate">
              {selectedColor.name} • {selectedCapacity}
            </span>
          </div>
        </div>

        {/* 1-Tap Add to Bag */}
        <button
          onClick={handleAddToCart}
          className={`px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider border border-black transition-all shrink-0 ${
            addedAnimation ? 'bg-black text-white' : 'bg-white text-black'
          }`}
        >
          {addedAnimation ? <Check className="w-3.5 h-3.5 inline" /> : <ShoppingBag className="w-3.5 h-3.5 inline" />}
        </button>

        {/* 1-Tap WhatsApp Checkout */}
        <button
          onClick={handleWhatsAppBuy}
          className="flex-1 bg-black text-white text-[11px] font-bold uppercase tracking-wider py-2.5 px-3 flex items-center justify-center gap-1.5 shadow-md active:scale-95"
        >
          <span>BUY ON WHATSAPP</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
