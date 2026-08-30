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
  Award
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
  const { products, storeSettings, addToCart, generateProductWhatsAppUrl, reviews } = useStore();

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
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedCapacity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 3);

  const productReviews = reviews.filter(r => r.productId === product.id && r.status === 'APPROVED');

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
    : 0;

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="border-b border-zinc-200 bg-[#fbfbfc] py-3.5 px-4 sm:px-8 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <button onClick={() => onNavigate('/')} className="hover:text-black transition-colors">HOME</button>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <button onClick={() => onNavigate('/shop')} className="hover:text-black transition-colors">SHOP</button>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-zinc-400">{product.category.toUpperCase()}</span>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-black font-bold uppercase truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Gallery (Col 1-7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Image Box */}
            <div className="relative aspect-[4/4.8] w-full overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center group">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.badge && (
                  <span className="bg-black text-white text-[11px] font-extrabold uppercase tracking-widest px-3 py-1">
                    {product.badge}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-zinc-900 text-white text-[11px] font-mono font-bold px-2.5 py-0.5 border border-zinc-700">
                    SAVE {discountPercent}%
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1 text-[11px] font-mono uppercase text-zinc-800 border border-zinc-200">
                18/8 STEEL • TEMPLOCK™ CORE
              </div>
            </div>

            {/* Thumbnails Row */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setActiveImageUrl(img);
                    }}
                    className={`aspect-square border overflow-hidden transition-all cursor-pointer ${
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
                  <span className="text-zinc-400">({product.reviewCount} reviews)</span>
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
                  <span className="text-base text-zinc-400 line-through font-mono">
                    {storeSettings.currencySymbol}{product.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  {product.inStock ? 'IN STOCK • DISPATCHES IN 24H' : 'BACKORDER'}
                </span>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-zinc-600 mt-4 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Color Finish Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-black">
                    <span>Selected Finish:</span>
                    <span className="text-zinc-600 font-medium font-mono">{selectedColor.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          setSelectedColor(c);
                          if (c.image) {
                            setActiveImageUrl(c.image);
                          }
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 border transition-all cursor-pointer ${
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
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-black">
                    <span>Selected Capacity:</span>
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
              <div className="mt-6 flex items-center gap-4">
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

            {/* Action Buttons: WhatsApp Direct Buy + Bag */}
            <div className="space-y-3 pt-6 border-t border-zinc-200">
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

            {/* Quick Guarantees Strip */}
            <div className="p-4 bg-zinc-50 border border-zinc-200 grid grid-cols-3 gap-2 text-center text-zinc-600 text-[11px] font-mono uppercase">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>2-Yr Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-x border-zinc-200">
                <Truck className="w-4 h-4 text-black" />
                <span>Free Ship &gt; ₹999</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-black" />
                <span>30-Day Transit Cover</span>
              </div>
            </div>

          </div>

        </div>

        {/* Technical Specs & Details Tabs */}
        <div className="mt-16 sm:mt-24 pt-10 border-t border-zinc-200 text-left">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-zinc-200 gap-8 overflow-x-auto">
            {[
              { id: 'SPECS', label: 'SPECIFICATIONS' },
              { id: 'FEATURES', label: 'ENGINEERING & MATERIALS' },
              { id: 'CARE', label: 'CARE INSTRUCTIONS' },
              { id: 'WARRANTY', label: 'LIFETIME PROMISE' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-xs sm:text-[13px] font-bold uppercase tracking-wider transition-all relative shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-black border-b-2 border-black font-extrabold'
                    : 'text-zinc-400 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'SPECS' && (
              <div className="max-w-3xl">
                <table className="w-full text-xs font-mono divide-y divide-zinc-200 border border-zinc-200">
                  <tbody className="divide-y divide-zinc-200">
                    <tr className="bg-zinc-50">
                      <td className="p-3.5 font-bold uppercase text-zinc-600 w-1/3">Body Material</td>
                      <td className="p-3.5 text-black">{product.specifications.material}</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold uppercase text-zinc-600">Insulation Rating</td>
                      <td className="p-3.5 text-black">{product.specifications.insulation}</td>
                    </tr>
                    <tr className="bg-zinc-50">
                      <td className="p-3.5 font-bold uppercase text-zinc-600">Weight</td>
                      <td className="p-3.5 text-black">{product.specifications.weight}</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold uppercase text-zinc-600">Dimensions</td>
                      <td className="p-3.5 text-black">{product.specifications.dimensions}</td>
                    </tr>
                    <tr className="bg-zinc-50">
                      <td className="p-3.5 font-bold uppercase text-zinc-600">Mouth Opening</td>
                      <td className="p-3.5 text-black">{product.specifications.mouthDiameter}</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold uppercase text-zinc-600">Leak Proof Rating</td>
                      <td className="p-3.5 text-black">{product.specifications.leakProof ? '100% Pressurized Silicone Airtight Seal' : 'Standard Cap'}</td>
                    </tr>
                    <tr className="bg-zinc-50">
                      <td className="p-3.5 font-bold uppercase text-zinc-600">BPA & Toxin Free</td>
                      <td className="p-3.5 text-black">{product.specifications.bpaFree ? 'Yes — FDA Certified 100% Non-Toxic' : 'No'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'FEATURES' && (
              <div className="max-w-3xl space-y-4">
                <div className="prose text-xs sm:text-sm text-zinc-600 leading-relaxed space-y-3">
                  <p>{product.description}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  {product.features?.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 bg-zinc-50 border border-zinc-200">
                      <Check className="w-4 h-4 text-black shrink-0 mt-0.5" />
                      <span className="text-xs text-zinc-800 font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'CARE' && (
              <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                <p>
                  To maintain the pristine thermal retention and powder-coat finish of your Hydron bottle:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-zinc-700">
                  <li>Hand wash with warm soapy water and a soft bottle brush.</li>
                  <li>Do not microwave or place in freezer (the vacuum seal prevents thermal exchange).</li>
                  <li>Lids and silicone gaskets are top-rack dishwasher safe.</li>
                  <li>Avoid bleach or chlorine-based cleansers to preserve the electropolished inner lining.</li>
                </ul>
              </div>
            )}

            {activeTab === 'WARRANTY' && (
              <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                <p>
                  Hydron warrants all vacuum-insulated steel and titanium hardware against manufacturing defects and loss of insulation for a full period of 2 years from purchase.
                </p>
                <p>
                  If your bottle ever stops keeping drinks icy cold or scalding hot under normal usage, our WhatsApp Concierge will issue a replacement unit promptly.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Customer Reviews for this specific product */}
        <div className="mt-16 pt-10 border-t border-zinc-200 text-left">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-heading">
              REVIEWS FOR {product.name} ({productReviews.length})
            </h3>
          </div>

          {productReviews.length === 0 ? (
            <p className="text-xs text-zinc-500 font-mono">No customer reviews yet. Be the first to review this flagship model!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {productReviews.map((rev) => (
                <div key={rev.id} className="p-5 bg-zinc-50 border border-zinc-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex text-black">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-black text-black' : 'text-zinc-300'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">{rev.userName}</span>
                  </div>
                  <h4 className="text-xs font-bold uppercase text-black font-heading">"{rev.title}"</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-zinc-200 text-left">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-heading mb-8">
              COMPLETE YOUR HYDRON KIT
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onNavigateToProduct={onSelectProduct}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
