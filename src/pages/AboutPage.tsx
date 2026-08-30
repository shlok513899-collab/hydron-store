import React from 'react';
import { ShieldCheck, Award, Recycle, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface AboutPageProps {
  onNavigateToShop: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateToShop }) => {
  const { cmsPages } = useStore();
  const pageData = cmsPages['about-us'] || {
    title: 'CRAFTED FOR LIFETIME HYDRATION',
    eyebrow: 'THE HYDRON MANIFESTO',
    subtitle: 'We reject the disposable era. Hydron engineers thermal drinkware with heavy-gauge materials, architectural minimalism, and relentless functional discipline.',
    content: 'Hydron was founded with a straightforward conviction: that the objects we interact with every day should be built to outlive us. In a market crowded with flimsy plastic bottles and substandard coatings, we set out to craft an uncompromising vessel.\n\nFrom the curvature of our flex handle to the internal electropolishing that prevents flavor transfer between matcha, espresso, and ice water, every detail of a Hydron bottle is engineered with purpose.',
    sections: [
      {
        heading: 'Pro-Grade 18/8 Steel',
        content: 'Medical grade stainless steel that never rusts, pits, or leaves a metallic aftertaste.'
      },
      {
        heading: 'TempLock™ Vacuum',
        content: 'Triple-wall insulation with reflective copper barrier holding ice for over 24 hours.'
      },
      {
        heading: 'Zero Plastic Impact',
        content: 'Designed to replace thousands of single-use disposable bottles over its lifetime.'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=85'
    ]
  };

  const icons = [ShieldCheck, Award, Recycle];

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-[#050507] text-white py-16 sm:py-24 px-4 sm:px-8 border-b border-zinc-800 text-left">
        <div className="max-w-4xl mx-auto space-y-4">
          {pageData.eyebrow && (
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400">
              {pageData.eyebrow}
            </span>
          )}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-heading">
            {pageData.title}
          </h1>
          {pageData.subtitle && (
            <p className="text-sm sm:text-lg text-zinc-300 max-w-2xl leading-relaxed">
              {pageData.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-16 text-left">
        
        {/* Story / Main content */}
        {pageData.content && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-black font-heading">
              OUR GENESIS & PHILOSOPHY
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 leading-relaxed space-y-3 font-normal whitespace-pre-line">
              {pageData.content}
            </div>
          </div>
        )}

        {/* Dynamic Sections */}
        {pageData.sections && pageData.sections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pageData.sections.map((sec, idx) => {
              const IconComp = icons[idx % icons.length] || ShieldCheck;
              return (
                <div key={idx} className="p-6 bg-zinc-50 border border-zinc-200 space-y-3">
                  <IconComp className="w-8 h-8 text-black" />
                  <h3 className="text-sm font-bold uppercase text-black font-heading">{sec.heading}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">{sec.content}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Gallery Visuals */}
        {pageData.images && pageData.images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pageData.images.map((imgUrl, idx) => (
              <div key={idx} className="aspect-[4/3] bg-zinc-100 overflow-hidden border border-zinc-200">
                <img 
                  src={imgUrl} 
                  alt={`About hydron ${idx + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Call to action */}
        <div className="p-8 bg-black text-white text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight font-heading">
            EXPERIENCE THE HYDRON DIFFERENCE
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto">
            Choose your size and finish today with complimentary delivery and a 2-year warranty.
          </p>
          <button
            onClick={onNavigateToShop}
            className="inline-flex items-center gap-2 bg-white text-black text-xs font-bold uppercase tracking-wider px-8 py-3.5 hover:bg-zinc-200 transition-colors"
          >
            <span>SHOP ALL HYDRON BOTTLES</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
