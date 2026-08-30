import React, { useState } from 'react';
import { MessageCircle, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const WhatsAppFloatingButton: React.FC = () => {
  const { storeSettings } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const num = storeSettings.whatsappNumber.replace(/[^0-9]/g, '') || '919876543210';
  const defaultText = encodeURIComponent('Hi Hydron Team! I am browsing the store and have a question about your insulated bottles.');
  const waUrl = `https://wa.me/${num}?text=${defaultText}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Floating Popup Card */}
      {isOpen && (
        <div className="mb-3 w-80 bg-zinc-950 text-white rounded-lg shadow-2xl border border-zinc-800 p-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                H
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">HYDRON CONCIERGE</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online • Instant WhatsApp
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-zinc-300 py-3 leading-relaxed">
            Welcome to Hydron! Have a question about bottle capacities, materials, or placing a direct custom order?
          </p>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="w-full bg-white text-black text-xs font-bold uppercase tracking-wider py-2.5 px-3 flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
          >
            <span>START WHATSAPP CHAT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-black hover:bg-zinc-900 text-white px-4 py-3 shadow-2xl border border-zinc-700 transition-all active:scale-95 cursor-pointer rounded-full"
        title="Chat on WhatsApp"
        id="floating-whatsapp-btn"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline font-mono">
          Order on WhatsApp
        </span>
      </button>
    </div>
  );
};
