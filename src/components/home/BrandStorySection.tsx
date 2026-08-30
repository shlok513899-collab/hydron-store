import React from 'react';
import { ArrowRight, ShieldCheck, Recycle, Award } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface BrandStorySectionProps {
  onNavigateToAbout: () => void;
}

export const BrandStorySection: React.FC<BrandStorySectionProps> = ({ onNavigateToAbout }) => {
  const { homepageContent } = useStore();

  return (
    <section className="w-full bg-black text-white py-16 sm:py-24 border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Brand Story Content (Col 1-7) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400 font-mono">
              PURPOSE & INTEGRITY
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-heading">
              {homepageContent.storyTitle || 'THE HYDRON PHILOSOPHY'}
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {homepageContent.storyContent || 'We started Hydron with a singular mandate: to purge single-use plastic from everyday life through uncompromising design and architectural durability.'}
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 text-white">
                  <Recycle className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold uppercase tracking-wider">Zero Disposable Waste</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Each Hydron flask prevents an estimated 1,400 single-use plastic bottles from landfills each year.
                </p>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 text-white">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold uppercase tracking-wider">Enduring Craftsmanship</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Engineered with heavy-gauge 18/8 steel to withstand drops, high altitudes, and decades of daily use.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onNavigateToAbout}
                className="inline-flex items-center gap-3 bg-white text-black text-xs sm:text-sm font-bold uppercase tracking-[0.18em] px-8 py-4 hover:bg-zinc-200 transition-all cursor-pointer shadow-lg"
              >
                <span>READ THE HYDRON MANIFESTO</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>

          {/* Right Column: High Quality Lifestyle Shot (Col 8-12) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
              <img
                src={homepageContent.storyImageUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=85'}
                alt="Hydron Lifestyle & Active Routine"
                className="w-full h-full object-cover brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">DESIGNED FOR LIFE</p>
                <p className="text-sm font-bold uppercase tracking-wider">Metropolitan Commutes • Alpine Expeditions</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
