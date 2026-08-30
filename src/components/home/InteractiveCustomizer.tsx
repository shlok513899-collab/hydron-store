import React, { useState } from 'react';
import { ArrowRight, Check, ShieldCheck, Thermometer, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const InteractiveCustomizer: React.FC = () => {
  const { storeSettings, addToCart, generateProductWhatsAppUrl, products } = useStore();

  const [capacity, setCapacity] = useState<'500ml' | '750ml' | '1000ml'>('750ml');
  const [color, setColor] = useState({ name: 'Matte Onyx', hex: '#18181b', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85' });
  const [capType, setCapType] = useState<'Flex Loop' | 'Chug Spout' | 'Magnetic Straw'>('Flex Loop');

  const colorOptions = [
    { name: 'Matte Onyx', hex: '#18181b', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Arctic Chalk', hex: '#fafafa', image: 'https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Gunmetal Titanium', hex: '#52525b', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85' },
  ];

  const priceMap = {
    '500ml': 1299,
    '750ml': 1499,
    '1000ml': 1899,
  };

  const currentPrice = priceMap[capacity];

  const handleCustomWhatsApp = () => {
    const num = storeSettings.whatsappNumber.replace(/[^0-9]/g, '') || '919876543210';
    const text = 
`*CUSTOM VESSEL ORDER | HYDRON LAB*
────────────────────────
*Configuration:* Hydron Custom Vacuum Flask
*Capacity:* ${capacity}
*Color Finish:* ${color.name}
*Cap Style:* ${capType}
*Estimated Price:* ${storeSettings.currencySymbol}${currentPrice.toLocaleString('en-IN')}
────────────────────────
Hi Hydron Team! I would like to order this custom configured bottle. Please confirm availability and share payment link!`;

    window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCartCustom = () => {
    const baseProd = products[0];
    if (baseProd) {
      addToCart(
        {
          ...baseProd,
          name: `Hydron Custom Vessel (${capacity})`,
          price: currentPrice,
        },
        1,
        color,
        capacity
      );
    }
  };

  return (
    <section className="w-full bg-[#f9f9fb] py-16 sm:py-24 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400 font-mono">
            HYDRON STUDIO CONFIGURATOR
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-black font-heading">
            CUSTOMIZE YOUR HYDRATION
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            Tailor volume, matte finish, and cap ergonomics to your exact daily routine.
          </p>
        </div>

        {/* Configurator Box */}
        <div className="bg-white border border-zinc-300 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Visual Preview (Col 1-7) */}
          <div className="lg:col-span-7 p-8 sm:p-12 bg-zinc-950 text-white flex flex-col justify-between items-center relative overflow-hidden">
            <div className="w-full flex items-center justify-between z-10">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                LIVE SPECIFICATION
              </span>
              <span className="text-xs font-mono px-2.5 py-1 bg-white text-black font-extrabold uppercase">
                {capacity} • {color.name}
              </span>
            </div>

            {/* Centered Large Bottle Render */}
            <div className="my-8 relative w-full max-w-xs sm:max-w-sm aspect-[3/4] flex items-center justify-center">
              <img 
                src={color.image} 
                alt="Custom Bottle Preview" 
                className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] transform hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="w-full flex items-center justify-between z-10 text-zinc-400 text-xs font-mono border-t border-zinc-800 pt-4">
              <span>Cap: {capType}</span>
              <span>24h Cold / 12h Hot</span>
              <span>18/8 Steel Core</span>
            </div>
          </div>

          {/* Controls & Options (Col 8-12) */}
          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              {/* 1. Capacity Option */}
              <div className="space-y-2.5 text-left">
                <label className="text-xs font-extrabold uppercase tracking-wider text-black flex justify-between">
                  <span>1. Select Volume:</span>
                  <span className="font-mono text-zinc-500">{capacity}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['500ml', '750ml', '1000ml'] as const).map((cap) => (
                    <button
                      key={cap}
                      onClick={() => setCapacity(cap)}
                      className={`py-3 text-xs font-mono font-bold uppercase border transition-all cursor-pointer ${
                        capacity === cap
                          ? 'bg-black text-white border-black shadow-sm'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-black'
                      }`}
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Color Selection */}
              <div className="space-y-2.5 text-left">
                <label className="text-xs font-extrabold uppercase tracking-wider text-black flex justify-between">
                  <span>2. Select Matte Coat:</span>
                  <span className="text-zinc-500 font-normal">{color.name}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c)}
                      className={`p-2 border flex items-center gap-2 text-left transition-all cursor-pointer ${
                        color.name === c.name 
                          ? 'border-black ring-1 ring-black bg-zinc-50 font-bold' 
                          : 'border-zinc-200 hover:border-zinc-400 bg-white'
                      }`}
                    >
                      <span 
                        className="w-4 h-4 rounded-full border border-zinc-300 shrink-0" 
                        style={{ backgroundColor: c.hex }} 
                      />
                      <span className="text-[11px] truncate text-black">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Cap Mechanism */}
              <div className="space-y-2.5 text-left">
                <label className="text-xs font-extrabold uppercase tracking-wider text-black flex justify-between">
                  <span>3. Lid Mechanism:</span>
                  <span className="text-zinc-500 font-normal">{capType}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Flex Loop', 'Chug Spout', 'Magnetic Straw'] as const).map((cap) => (
                    <button
                      key={cap}
                      onClick={() => setCapType(cap)}
                      className={`p-2.5 text-[11px] font-bold uppercase border transition-all cursor-pointer ${
                        capType === cap
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-black'
                      }`}
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price summary */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">Total Price</span>
                  <span className="text-2xl font-black text-black font-heading">
                    {storeSettings.currencySymbol}{currentPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">Includes GST & Free Express Metro Shipping</p>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-zinc-200">
              <button
                onClick={handleCustomWhatsApp}
                className="w-full bg-black text-white text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] py-4 flex items-center justify-center gap-2 hover:bg-zinc-800 active:scale-[0.99] transition-all cursor-pointer shadow-lg"
              >
                <span>ORDER CUSTOM SETUP ON WA</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleAddToCartCustom}
                className="w-full bg-white text-black border border-black text-xs font-bold uppercase tracking-widest py-3 hover:bg-zinc-100 transition-colors"
              >
                ADD TO BAG
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
