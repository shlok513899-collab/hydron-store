import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin,
  CheckCircle2
} from 'lucide-react';
import { Logo } from './Logo';
import { useStore } from '../../context/StoreContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { storeSettings, submitEnquiry, trackAndOpenWhatsApp } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleWhatsAppClick = () => {
    const num = storeSettings.whatsappNumber.replace(/[^0-9]/g, '') || '919876543210';
    const text = encodeURIComponent('Hi Hydron! Inquiring from the store website footer.');
    const waUrl = `https://wa.me/${num}?text=${text}`;
    trackAndOpenWhatsApp(waUrl, 'FOOTER_CONCIERGE_LINK');
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;

    try {
      await submitEnquiry({
        name: 'Newsletter VIP Subscriber',
        email: newsletterEmail.trim(),
        subject: 'VIP Club Newsletter Signup',
        message: 'Subscribed to Hydron product releases & VIP member perks.',
        type: 'NEWSLETTER',
      });
      setSubscribed(true);
      setNewsletterEmail('');
    } catch {
      setSubscribed(true);
    }
  };

  return (
    <footer className="w-full bg-black text-white border-t border-zinc-900">
      {/* 1. Top Trust Ribbon */}
      <div className="border-b border-zinc-800 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <ShieldCheck className="w-6 h-6 text-white shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">2-YEAR TEMPSHIELD WARRANTY</p>
              <p className="text-[11px] text-zinc-400">Guaranteed craftsmanship on all insulated drinkware</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <Truck className="w-6 h-6 text-white shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">COMPLIMENTARY SHIPPING</p>
              <p className="text-[11px] text-zinc-400">Free domestic delivery on orders over ₹999</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">100% QUALITY INSPECTED</p>
              <p className="text-[11px] text-zinc-400">Every vessel vacuum tested before dispatch</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Brand & Manifesto (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="cursor-pointer" onClick={() => onNavigate('/')}>
              <Logo variant="light" size="md" showText={true} />
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Hydron engineers high-durability thermal hydration hardware. Built from 18/8 food-grade stainless steel and aerospace Grade 1 Titanium to eliminate single-use plastics from modern life.
            </p>
            <div className="pt-2 flex items-center gap-3 text-zinc-400">
              {storeSettings.instagramUrl && (
                <a href={storeSettings.instagramUrl} target="_blank" rel="noreferrer" className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {storeSettings.twitterUrl && (
                <a href={storeSettings.twitterUrl} target="_blank" rel="noreferrer" className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {storeSettings.youtubeUrl && (
                <a href={storeSettings.youtubeUrl} target="_blank" rel="noreferrer" className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {storeSettings.linkedinUrl && (
                <a href={storeSettings.linkedinUrl} target="_blank" rel="noreferrer" className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links (Col 5-6) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white font-heading">
              STOREFRONT
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button onClick={() => onNavigate('/shop')} className="hover:text-white transition-colors">
                  All Water Bottles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/collections')} className="hover:text-white transition-colors">
                  Collections & Series
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">
                  About Hydron
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">
                  Contact Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/track-order')} className="hover:text-white transition-colors">
                  Track My Shipment
                </button>
              </li>
            </ul>
          </div>

          {/* Client Policies & Care (Col 7-8) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white font-heading">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button onClick={() => onNavigate('/faq')} className="hover:text-white transition-colors">
                  FAQ & Care Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shipping')} className="hover:text-white transition-colors">
                  Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/returns')} className="hover:text-white transition-colors">
                  No-Return & Order Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Support & VIP Newsletter (Col 9-12) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white font-heading">
              DIRECT WHATSAPP CONCIERGE
            </h4>
            <p className="text-xs text-zinc-400">
              Need personalized sizing advice or corporate custom engraving? Speak directly with our product team.
            </p>

            <div className="text-xs text-zinc-300 space-y-1.5 font-mono">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer text-left"
                title="Chat with WhatsApp Concierge"
              >
                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                <span>WA: +{storeSettings.whatsappNumber}</span>
              </button>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <span>{storeSettings.supportEmail}</span>
              </p>
              <p className="flex items-start gap-2 text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                <span className="font-sans text-[11px]">{storeSettings.storeAddress}</span>
              </p>
            </div>

            {/* Newsletter Input */}
            <div className="pt-2">
              <form onSubmit={handleNewsletter} className="flex">
                <input
                  type="email"
                  placeholder="Enter email for drops & secret sales"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-xs px-3 py-2.5 text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-white flex-1"
                />
                <button
                  type="submit"
                  className="bg-white text-black text-xs font-bold px-4 py-2.5 uppercase tracking-wider hover:bg-zinc-200 transition-colors shrink-0"
                >
                  JOIN
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-zinc-300 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Welcome to the Hydron VIP list.
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Bottom copyright & Admin portal link */}
        <div className="pt-10 mt-10 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p className="font-mono text-[11px]">
            © {new Date().getFullYear()} HYDRON LIFE INC. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-wider font-mono">
            <span>GST INVOICED</span>
            <span>•</span>
            <span>SECURE ENCRYPTED</span>
            <span>•</span>
            <button
              onClick={() => onNavigate('/admin')}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              ADMIN PORTAL
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
