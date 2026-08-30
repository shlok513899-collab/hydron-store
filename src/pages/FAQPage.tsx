import React, { useState } from 'react';
import { Search, Plus, Minus, MessageSquare, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FAQPage: React.FC = () => {
  const { faqs = [], storeSettings, cmsPages } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [openId, setOpenId] = useState<string | null>(faqs?.[0]?.id || null);

  const cmsData = cmsPages['faq'] || {
    title: 'FREQUENTLY ASKED QUESTIONS',
    eyebrow: 'KNOWLEDGE BASE & SUPPORT',
    subtitle: 'Everything you need to know about TempLock™ thermal retention, food-grade steel metallurgy, dishwashing, and warranty claims.'
  };

  const categories = ['ALL', 'Insulation', 'Materials', 'Care', 'Shipping', 'Warranty'];

  const safeFaqs = faqs || [];
  const filteredFaqs = safeFaqs.filter((f) => {
    if (selectedCategory !== 'ALL' && (f.category || '').toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return (f.question || '').toLowerCase().includes(q) || (f.answer || '').toLowerCase().includes(q);
    }
    return true;
  });

  const handleWhatsApp = () => {
    const num = storeSettings.whatsappNumber.replace(/[^0-9]/g, '') || '919876543210';
    const text = encodeURIComponent('Hi Hydron! I looked through the FAQs and have an additional question.');
    window.open(`https://wa.me/${num}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Top Banner */}
      <div className="bg-[#050507] text-white py-14 sm:py-20 px-4 sm:px-8 border-b border-zinc-800 text-left">
        <div className="max-w-4xl mx-auto space-y-4">
          {cmsData.eyebrow && (
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400">
              {cmsData.eyebrow}
            </span>
          )}
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-heading">
            {cmsData.title}
          </h1>
          {cmsData.subtitle && (
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              {cmsData.subtitle}
            </p>
          )}

          {/* Search bar inside hero */}
          <div className="pt-2 max-w-xl relative">
            <input
              type="text"
              placeholder="Search questions (e.g. coffee, dishwasher, warranty)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs sm:text-sm px-4 py-3 pr-10 focus:outline-hidden focus:border-white"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3.5" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16 text-left space-y-8">
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold uppercase tracking-wider px-4 py-2 border transition-all ${
                selectedCategory === cat
                  ? 'bg-black text-white border-black'
                  : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-black hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs list */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              <p className="text-sm font-bold uppercase text-black">No FAQs found matching your query.</p>
              <p className="text-xs mt-1">Chat directly with our team on WhatsApp for an immediate answer.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-zinc-200 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-zinc-50 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                        {faq.category}
                      </span>
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-tight text-black font-heading">
                        {faq.question}
                      </span>
                    </div>
                    <span className="p-1 bg-zinc-100 text-black shrink-0">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* WhatsApp Help Banner */}
        <div className="p-8 bg-zinc-950 text-white border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider font-heading">
              Still have questions about your bottle?
            </h3>
            <p className="text-xs text-zinc-400">
              Our engineering support team is online on WhatsApp.
            </p>
          </div>
          <button
            onClick={handleWhatsApp}
            className="bg-white text-black text-xs font-bold uppercase tracking-wider px-6 py-3 hover:bg-zinc-200 transition-colors shrink-0 flex items-center gap-2"
          >
            <span>WHATSAPP SUPPORT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
