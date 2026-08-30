import React from 'react';
import { useStore } from '../context/StoreContext';

interface PolicyPageProps {
  type: 'shipping' | 'returns' | 'privacy' | 'terms';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ type }) => {
  const { storeSettings, cmsPages } = useStore();

  const slugMap: Record<string, string> = {
    shipping: 'shipping-policy',
    returns: 'returns-exchange',
    privacy: 'privacy-policy',
    terms: 'terms-of-service',
  };

  const currentSlug = slugMap[type] || 'shipping-policy';
  const customCms = cmsPages[currentSlug];

  const getDefaultPolicyContent = () => {
    switch (type) {
      case 'shipping':
        return {
          title: 'SHIPPING & FULFILLMENT POLICY',
          eyebrow: 'LEGAL & OPERATIONAL GUIDELINES',
          subtitle: 'Complimentary shipping above ₹999 across India with real-time WhatsApp tracking dispatch.',
          lastUpdated: 'August 2026',
          content: '',
          sections: [
            {
              heading: '1. Dispatch & Processing Times',
              content: 'All orders confirmed via our WhatsApp Concierge desk are inspected, laser-tested, and dispatched within 24 business hours from our central fulfillment warehouse. Orders placed before 2:00 PM IST on working days are prioritized for same-day dispatch.'
            },
            {
              heading: '2. Shipping Rates & Delivery Timeframes',
              content: `• Standard Express (Metro Cities): 2–4 business days.\n• Regional & Rest of India: 4–6 business days.\n• Shipping Fee: Complimentary FREE SHIPPING on all orders with cart value above ${storeSettings.currencySymbol}${storeSettings.freeShippingThreshold}. For orders below this amount, a flat rate of ${storeSettings.currencySymbol}${storeSettings.flatShippingRate} is applied at checkout.`
            },
            {
              heading: '3. Real-Time Tracking Dispatches',
              content: 'Once your Hydron shipment is handed to our premium courier partners (BlueDart, Delhivery, or DTDC), an automated WhatsApp message with your tracking AWB link is sent directly to your registered mobile number.'
            },
            {
              heading: '4. Packaging Integrity',
              content: 'Every Hydron vessel is shipped in 100% recyclable, impact-resistant honeycomb kraft paper packaging to eliminate plastic bubble wrap while guaranteeing zero denting during high-speed transit.'
            }
          ]
        };

      case 'returns':
        return {
          title: 'RETURNS & 30-DAY EXCHANGE POLICY',
          eyebrow: 'LEGAL & OPERATIONAL GUIDELINES',
          subtitle: 'Our ironclad guarantee against transit damage, manufacturing flaws, or insulation failure.',
          lastUpdated: 'August 2026',
          content: '',
          sections: [
            {
              heading: '1. 30-Day Transit Protection',
              content: 'If your Hydron bottle arrives with any cosmetic defect, denting, or missing lid component, notify our WhatsApp Concierge within 48 hours of delivery with a quick photograph. We will dispatch an immediate replacement unit with zero return shipping cost to you.'
            },
            {
              heading: '2. 2-Year TempShield™ Warranty Claim',
              content: 'All Hydron stainless steel and titanium vessels include a 2-Year TempLock™ insulation warranty. If the vacuum seal fails and the exterior of the bottle begins sweating or heating up under normal usage, we will replace the bottle body.'
            },
            {
              heading: '3. Return Eligibility Requirements',
              content: 'To be eligible for an exchange or refund:\n• The item must be unused, unwashed, and in the original Hydron kraft packaging.\n• Proof of purchase (WhatsApp order transcript or order ID) must be provided.\n• Custom laser-engraved personalized bottles are non-refundable unless defective.'
            },
            {
              heading: '4. Fast Refund Processing',
              content: 'Approved refunds are returned to your original payment method (UPI / Bank Transfer / Card) within 3–5 business days following return inspection.'
            }
          ]
        };

      case 'privacy':
        return {
          title: 'PRIVACY & DATA PROTECTION POLICY',
          eyebrow: 'LEGAL & OPERATIONAL GUIDELINES',
          subtitle: 'How Hydron safeguards your personal information, mobile credentials, and transaction data.',
          lastUpdated: 'August 2026',
          content: '',
          sections: [
            {
              heading: '1. Information We Collect',
              content: 'We collect your name, email address, mobile phone number, and physical shipping address solely to process your orders, send WhatsApp delivery tracking notifications, and respond to your customer service queries.'
            },
            {
              heading: '2. Zero Third-Party Data Selling',
              content: 'Hydron does not sell, rent, or lease your personal identification data to advertising brokers or third-party marketing networks. Your mobile number is used exclusively for order fulfillment and direct concierge communications.'
            },
            {
              heading: '3. Secure Firebase Infrastructure',
              content: 'Our database and customer authentication systems are hosted on Google Cloud Firebase with end-to-end encryption in transit (TLS 1.3) and at rest (AES-256).'
            },
            {
              heading: '4. Your Data Rights',
              content: `You may request a copy of your stored order history or ask for complete deletion of your account records at any time by emailing ${storeSettings.supportEmail}.`
            }
          ]
        };

      case 'terms':
        return {
          title: 'TERMS OF SERVICE & PURCHASE AGREEMENT',
          eyebrow: 'LEGAL & OPERATIONAL GUIDELINES',
          subtitle: 'Guidelines governing your use of the Hydron digital storefront and product purchases.',
          lastUpdated: 'August 2026',
          content: '',
          sections: [
            {
              heading: '1. Storefront Usage',
              content: 'By accessing or placing an order on hydron.com or via our WhatsApp shopping concierge, you agree to be bound by these terms, our Shipping Policy, and our Privacy Policy.'
            },
            {
              heading: '2. Product Pricing & Accuracy',
              content: 'All prices listed on the storefront are denominated in Indian Rupees (INR) and include applicable Goods and Services Tax (GST). Hydron reserves the right to adjust pricing or discontinue models at our discretion.'
            },
            {
              heading: '3. WhatsApp Ordering Flow',
              content: 'When you initiate a purchase via the "Buy Now via WhatsApp" or "Order via WhatsApp" buttons, you will be connected directly with an authorized Hydron representative who will verify stock, confirm your address, and provide secure payment links.'
            },
            {
              heading: '4. Intellectual Property',
              content: 'The Hydron geometric "H" mark, TempLock™ trademark, bottle industrial designs, and photographic assets are the exclusive intellectual property of Hydron Life Inc.'
            }
          ]
        };
    }
  };

  const defaultData = getDefaultPolicyContent();
  const data = {
    title: customCms?.title || defaultData.title,
    eyebrow: customCms?.eyebrow || defaultData.eyebrow,
    subtitle: customCms?.subtitle || defaultData.subtitle,
    lastUpdated: customCms?.lastUpdated || defaultData.lastUpdated,
    content: customCms?.content || defaultData.content,
    sections: (customCms?.sections && customCms.sections.length > 0) ? customCms.sections : defaultData.sections,
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Hero Header */}
      <div className="bg-[#050507] text-white py-14 sm:py-20 px-4 sm:px-8 border-b border-zinc-800 text-left">
        <div className="max-w-4xl mx-auto space-y-3">
          {data.eyebrow && (
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400">
              {data.eyebrow}
            </span>
          )}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-heading">
            {data.title}
          </h1>
          {data.subtitle && (
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
              {data.subtitle}
            </p>
          )}
          {data.lastUpdated && (
            <p className="text-[11px] font-mono text-zinc-500 pt-2">
              Last Updated: {data.lastUpdated}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16 text-left space-y-10">
        {data.content && (
          <div className="text-xs sm:text-sm text-zinc-600 leading-relaxed whitespace-pre-line pb-4 border-b border-zinc-100">
            {data.content}
          </div>
        )}

        {data.sections.map((sec, idx) => (
          <div key={idx} className="space-y-2 border-b border-zinc-100 pb-8 last:border-b-0">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-tight text-black font-heading">
              {sec.heading}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
              {sec.content}
            </div>
          </div>
        ))}

        {/* Contact Strip */}
        <div className="p-6 bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-2">
          <p className="font-bold uppercase text-black font-heading">Have a specific policy or claim question?</p>
          <p>
            Contact our compliance desk at <strong className="text-black">{storeSettings.supportEmail}</strong> or message WhatsApp <strong className="text-black">+{storeSettings.whatsappNumber}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
