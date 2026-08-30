import React from 'react';
import { 
  ShieldCheck, 
  Thermometer, 
  Layers, 
  Sparkles, 
  Zap, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface ProductShowcaseProps {
  onExploreTech: () => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({ onExploreTech }) => {
  const { homepageContent } = useStore();

  const techFeatures = [
    {
      title: 'TempLock™ Triple-Wall Chamber',
      description: 'Inner 18/8 food-grade stainless layer, an airtight vacuum insulation core, and a protective outer steel shell.',
      stat: '24H COLD / 12H HOT',
    },
    {
      title: 'Reflective Copper Coating',
      description: 'The exterior of the inner chamber is dipped in pure elemental copper to reflect infrared heat radiation back inward.',
      stat: '+35% THERMAL GAIN',
    },
    {
      title: 'HydroShield™ Matte Powder',
      description: 'Electrostatic powder coat cured at 400°F provides an ultra-matte non-slip tactile grip that never sweats or chips.',
      stat: 'SWEAT-FREE & RUGGED',
    },
    {
      title: 'Zero-Flavor Electropolish',
      description: 'Ultra-smooth inner mirror polish repels bacteria, residue, and metallic smells so coffee and water taste pure.',
      stat: '100% TASTE PURITY',
    },
  ];

  return (
    <section className="w-full bg-white py-16 sm:py-24 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Top Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 space-y-3 text-left">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400 font-mono">
            MATERIALS & THERMODYNAMICS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-black font-heading">
            {homepageContent.showcaseTitle || 'ENGINEERED FOR EXTREME DURABILITY'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            {homepageContent.showcaseDescription || 'Between the two layers of 18/8 pro-grade stainless steel lies an airtight vacuum chamber enhanced with an inner reflective copper layer.'}
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Visual Engineering Exploded View */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/4.5] overflow-hidden bg-zinc-950 border border-zinc-200 shadow-xl group">
              <img
                src={homepageContent.showcaseImageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85'}
                alt="Hydron Thermal Engineering"
                className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

              {/* Exploded callout overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/90 backdrop-blur-md border border-zinc-700 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">PATENTED ARCHITECTURE</span>
                  <span className="text-xs font-mono font-bold text-white">GEN-IV CORE</span>
                </div>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider font-heading">
                  Triple-Wall 18/8 Steel + Inner Copper Barrier
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Tech Pillars */}
          <div className="lg:col-span-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {techFeatures.map((feat, idx) => (
                <div 
                  key={idx} 
                  className="p-5 bg-zinc-50 border border-zinc-200 hover:border-black transition-all space-y-2 text-left"
                >
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-black text-white inline-block">
                    {feat.stat}
                  </span>
                  <h4 className="text-sm font-bold uppercase tracking-tight text-black font-heading pt-1">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={onExploreTech}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-black text-white text-xs font-bold uppercase tracking-[0.18em] px-8 py-4 hover:bg-zinc-800 transition-all cursor-pointer"
              >
                <span>SHOP ENGINEERED VESSELS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-xs text-zinc-500 font-mono uppercase">
                Tested to -20°C & +65°C extremes
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
