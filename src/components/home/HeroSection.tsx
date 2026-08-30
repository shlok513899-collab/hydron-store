import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Leaf, 
  Snowflake, 
  Thermometer, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface HeroSectionProps {
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore }) => {
  const { homepageContent } = useStore();

  return (
    <section className="relative w-full bg-[#050507] text-white overflow-hidden border-b border-zinc-900">
      {/* Subtle Studio Lighting Gradients for authentic luxury depth */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-700/20 via-transparent to-transparent"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-zinc-800/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 lg:py-24 min-h-[620px] flex items-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">
          
          {/* Left Column: Hero Text & Badges (Matching Reference) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-zinc-400 uppercase font-mono">
                {homepageContent.heroEyebrow || 'HYDRATE. PERFORM. REPEAT.'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.05] font-heading">
              {homepageContent.heroHeadline || 'WATER BOTTLES BUILT FOR LIFE.'}
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg lg:text-xl text-zinc-300 max-w-xl font-normal leading-relaxed">
              {homepageContent.heroSubheadline || 'Premium quality. Sleek design. All-day hydration for every pursuit.'}
            </p>

            {/* CTA Button (Crisp White with Black Text matching reference) */}
            <div className="pt-2">
              <button
                id="hero-explore-btn"
                onClick={onExplore}
                className="inline-flex items-center gap-3 bg-white text-black font-extrabold text-xs sm:text-sm uppercase tracking-[0.18em] px-8 py-4 rounded-none hover:bg-zinc-200 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-xl"
              >
                <span>{homepageContent.heroCtaText || 'EXPLORE COLLECTION'}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>

            {/* 3 Hero Feature Badges (Matching reference exactly) */}
            <div className="pt-6 sm:pt-8 border-t border-zinc-800/80 grid grid-cols-3 gap-3 sm:gap-6">
              {/* Badge 1: Premium Quality */}
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-sm bg-zinc-900 border border-zinc-700/60 text-white shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
                    PREMIUM
                  </p>
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-400">
                    QUALITY
                  </p>
                </div>
              </div>

              {/* Badge 2: BPA Free & Safe */}
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-sm bg-zinc-900 border border-zinc-700/60 text-white shrink-0">
                  <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
                    BPA FREE
                  </p>
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-400">
                    & SAFE
                  </p>
                </div>
              </div>

              {/* Badge 3: 24H Cold 12H Hot */}
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-sm bg-zinc-900 border border-zinc-700/60 text-white shrink-0">
                  <Snowflake className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
                    24H COLD
                  </p>
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-400">
                    12H HOT
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Product Photography on Mineral Wet Rocks */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Architectural Frame with Matte Hydron Bottle Photography */}
            <div className="relative w-full max-w-md lg:max-w-none aspect-[4/4.5] sm:aspect-[4/4] lg:aspect-[4/4.5] overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 shadow-2xl group">
              <img 
                src={homepageContent.heroImageUrl || 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=85'} 
                alt="Hydron Onyx Pro Insulated Vacuum Bottle" 
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 brightness-95"
                loading="eager"
              />

              {/* Editorial Bottle Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

              {/* Floating Specification Pill */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md border border-zinc-700 p-3 sm:p-4 rounded-none flex items-center justify-between text-white">
                <div>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">FLAGSHIP EDITION</p>
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-wider">HYDRON ONYX PRO 750ML</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-1 bg-white text-black text-[10px] font-mono font-extrabold uppercase tracking-wider">
                    ₹1,499
                  </span>
                </div>
              </div>

              {/* Hydron Monogram Tag */}
              <div className="absolute top-4 right-4 bg-black/80 border border-zinc-700 px-2.5 py-1 text-[10px] uppercase font-mono tracking-widest text-zinc-300">
                18/8 STEEL • TEMPLOCK™
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
