import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, CheckCircle, ArrowRight, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { storeSettings, submitEnquiry, cmsPages } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'GENERAL' | 'ORDER_INQUIRY' | 'CUSTOM_ENGRAVING' | 'CORPORATE'>('GENERAL');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const cmsData = cmsPages['contact-us'] || {
    title: 'CONTACT & CONCIERGE',
    eyebrow: 'CONNECT WITH HYDRON STUDIO',
    subtitle: 'Whether you need custom corporate laser-engraving or express WhatsApp order support, we are here to assist.'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);

    try {
      await submitEnquiry({
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        subject: subject.trim() || 'Hydron Studio Message',
        message: message.trim(),
        type,
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setMobile('');
      setSubject('');
      setMessage('');
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectWhatsApp = () => {
    const num = storeSettings.whatsappNumber.replace(/[^0-9]/g, '') || '919876543210';
    const text = encodeURIComponent('Hi Hydron! I have an enquiry regarding bottle specifications, corporate gifting, or placing an order.');
    window.open(`https://wa.me/${num}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Top Banner */}
      <div className="bg-[#050507] text-white py-14 sm:py-20 px-4 sm:px-8 border-b border-zinc-800 text-left">
        <div className="max-w-7xl mx-auto space-y-2">
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          
          {/* Left Column: Direct Info & WhatsApp (Col 1-5) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-tight text-black font-heading">
                DIRECT HYDRON CONCIERGE
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                For the fastest support, chat with our hardware specialists directly via WhatsApp. Typical response time is under 15 minutes.
              </p>
            </div>

            {/* WhatsApp Direct Action Box */}
            <div className="p-6 bg-zinc-950 text-white border border-zinc-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-none bg-emerald-600 text-white">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">WhatsApp Live Desk</h4>
                  <p className="text-[11px] text-zinc-400 font-mono">+{storeSettings.whatsappNumber}</p>
                </div>
              </div>
              <p className="text-xs text-zinc-300">
                Tap below to launch a pre-formatted chat with our product fulfillment team.
              </p>
              <button
                onClick={handleDirectWhatsApp}
                className="w-full bg-white text-black text-xs font-bold uppercase tracking-wider py-3 flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
              >
                <span>OPEN WHATSAPP CHAT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Studio Contact Details */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 text-xs text-zinc-700">
                <Mail className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase text-black block">Email Support</span>
                  <span className="font-mono text-zinc-500">{storeSettings.supportEmail}</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-xs text-zinc-700">
                <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase text-black block">Studio & Headquarters</span>
                  <span className="text-zinc-500">{storeSettings.storeAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-xs text-zinc-700">
                <Clock className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase text-black block">Operating Hours</span>
                  <span className="text-zinc-500">Mon - Sat: 9:00 AM – 8:00 PM IST</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact & Inquiry Form (Col 6-12) */}
          <div className="lg:col-span-7 bg-zinc-50 border border-zinc-200 p-6 sm:p-10">
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-black font-heading mb-1">
              SEND A MESSAGE TO THE HYDRON TEAM
            </h3>
            <p className="text-xs text-zinc-500 mb-6">
              Fill out the form below. Messages are logged directly to our support ticket system.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-3 bg-white border border-zinc-200 p-8">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold uppercase text-black font-heading">
                  MESSAGE DISPATCHED SUCCESSFULLY
                </h4>
                <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                  Thank you for reaching out. A Hydron specialist will follow up via email or phone shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Sen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs bg-white border border-zinc-300 p-2.5 focus:outline-hidden focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. maya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs bg-white border border-zinc-300 p-2.5 focus:outline-hidden focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 9876543210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full text-xs bg-white border border-zinc-300 p-2.5 focus:outline-hidden focus:border-black font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full text-xs bg-white border border-zinc-300 p-2.5 focus:outline-hidden focus:border-black font-medium"
                    >
                      <option value="GENERAL">General Inquiry</option>
                      <option value="ORDER_INQUIRY">Order Status & Tracking</option>
                      <option value="CUSTOM_ENGRAVING">Custom Laser Engraving</option>
                      <option value="CORPORATE">Corporate & Bulk Gifting</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bulk order for 50 Hydron Onyx Pro bottles"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs bg-white border border-zinc-300 p-2.5 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Provide details about your query, desired bottle volumes, or delivery requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs bg-white border border-zinc-300 p-2.5 focus:outline-hidden focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-3.5 hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {loading ? 'DISPATCHING MESSAGE...' : 'SUBMIT MESSAGE'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
