import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, MessageSquare } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface FAQSectionProps {
  onNavigateToFAQ?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onNavigateToFAQ }) => {
  const { faqs = [], storeSettings } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const displayFaqs = (faqs || []).length > 0 ? (faqs || []).slice(0, 5) : [];

  const handleWhatsAppHelp = () => {
    const num = storeSettings.whatsappNumber.replace(/[^0-9]/g, '') || '919876543210';
    const text = encodeURIComponent('Hi Hydron! I have a question about bottle specs, insulation, or placing a WhatsApp order.');
    window.open(`https://wa.me/${num}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="w-full bg-[#fbfbfc] py-16 sm:py-24 border-b border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400 font-mono">
            CLARITY & PRECISION
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-black font-heading">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            Answers on thermal retention, material safety, dishwashing, and warranty support.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {displayFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className="bg-white border border-zinc-200 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-zinc-50 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wide text-black font-heading">
                    {faq.question}
                  </span>
                  <span className="p-1 rounded-none bg-zinc-100 text-black shrink-0">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 text-left">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Callout */}
        <div className="mt-12 p-6 bg-black text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-bold uppercase tracking-wider font-heading">
              Have a specific sizing or engraving question?
            </h4>
            <p className="text-xs text-zinc-400">
              Our engineering team responds in minutes on WhatsApp.
            </p>
          </div>
          <button
            onClick={handleWhatsAppHelp}
            className="bg-white text-black text-xs font-bold uppercase tracking-wider px-6 py-3 hover:bg-zinc-200 transition-colors shrink-0"
          >
            CHAT ON WHATSAPP
          </button>
        </div>

      </div>
    </section>
  );
};
