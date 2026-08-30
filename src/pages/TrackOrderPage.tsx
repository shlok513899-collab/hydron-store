import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, ArrowRight, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

export const TrackOrderPage: React.FC = () => {
  const { orders, storeSettings } = useStore();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const cleanQuery = query.trim().toLowerCase();
    const match = orders.find(
      (o) =>
        o.id.toLowerCase() === cleanQuery ||
        o.orderNumber?.toLowerCase() === cleanQuery ||
        o.customerMobile?.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, '') ||
        o.trackingNumber?.toLowerCase() === cleanQuery
    );

    setFoundOrder(match || null);
    setSearched(true);
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 1;
      case 'CONFIRMED':
        return 2;
      case 'DISPATCHED':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = foundOrder ? getStatusStep(foundOrder.status) : 1;

  const handleWhatsAppHelp = () => {
    const num = storeSettings.whatsappNumber.replace(/[^0-9]/g, '') || '919876543210';
    const text = encodeURIComponent(`Hi Hydron! I am inquiring about shipment tracking for Order #${foundOrder?.orderNumber || query}`);
    window.open(`https://wa.me/${num}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Hero Header */}
      <div className="bg-[#050507] text-white py-14 sm:py-20 px-4 sm:px-8 border-b border-zinc-800 text-left">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400">
            SHIPMENT DISPATCH CONSOLE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-heading">
            TRACK YOUR SHIPMENT
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Enter your Hydron Order ID (e.g. HYD-8921) or your 10-digit registered WhatsApp mobile number.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="pt-4 max-w-xl flex">
            <input
              type="text"
              required
              placeholder="Enter Order ID or Mobile Number"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs sm:text-sm px-4 py-3 focus:outline-hidden focus:border-white font-mono"
            />
            <button
              type="submit"
              className="bg-white text-black text-xs font-bold uppercase tracking-wider px-6 py-3 hover:bg-zinc-200 transition-colors shrink-0"
            >
              TRACK
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16 text-left">
        {searched && !foundOrder && (
          <div className="p-8 bg-zinc-50 border border-zinc-200 text-center space-y-3">
            <Package className="w-12 h-12 text-zinc-400 mx-auto" />
            <h3 className="text-base font-bold uppercase text-black font-heading">
              NO ACTIVE SHIPMENT FOUND FOR "{query}"
            </h3>
            <p className="text-xs text-zinc-600 max-w-md mx-auto">
              Please ensure you entered the exact Order ID or phone number used during WhatsApp order placement.
            </p>
            <button
              onClick={handleWhatsAppHelp}
              className="mt-2 inline-flex items-center gap-2 bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>VERIFY WITH WHATSAPP DESK</span>
            </button>
          </div>
        )}

        {foundOrder && (
          <div className="bg-white border border-zinc-300 p-6 sm:p-8 space-y-8 shadow-sm">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400">ORDER TRACKING</span>
                <h3 className="text-xl font-black uppercase tracking-tight text-black font-heading">
                  ORDER #{foundOrder.orderNumber || foundOrder.id.slice(0, 8).toUpperCase()}
                </h3>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">
                  Placed on {new Date(foundOrder.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block px-3 py-1 bg-black text-white text-xs font-mono font-bold uppercase tracking-wider">
                  STATUS: {foundOrder.status}
                </span>
                {foundOrder.trackingNumber && (
                  <p className="text-xs font-mono text-zinc-600 mt-1">
                    AWB: <strong>{foundOrder.trackingNumber}</strong> ({foundOrder.courierPartner || 'Express Air'})
                  </p>
                )}
              </div>
            </div>

            {/* Stepper Visualization */}
            <div className="py-4">
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                {[
                  { step: 1, label: 'Order Placed', desc: 'Received in system' },
                  { step: 2, label: 'Confirmed', desc: 'Laser inspected' },
                  { step: 3, label: 'In Transit', desc: 'Courier dispatched' },
                  { step: 4, label: 'Delivered', desc: 'Handed to client' },
                ].map((s) => (
                  <div key={s.step} className="space-y-2">
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                          currentStep >= s.step
                            ? 'bg-black text-white'
                            : 'bg-zinc-100 text-zinc-400 border border-zinc-300'
                        }`}
                      >
                        {currentStep > s.step ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                      </div>
                    </div>
                    <div>
                      <p className={`font-bold uppercase ${currentStep >= s.step ? 'text-black' : 'text-zinc-400'}`}>
                        {s.label}
                      </p>
                      <p className="text-[10px] text-zinc-500 hidden sm:block">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-zinc-200 pt-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-black font-heading">
                ITEMS IN THIS PACKAGE ({foundOrder.items.length})
              </h4>
              <div className="divide-y divide-zinc-100">
                {foundOrder.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold uppercase text-black font-heading">{item.productName}</p>
                        <p className="text-[11px] text-zinc-500 font-mono">
                          {item.color} • {item.capacity} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-black">
                      {storeSettings.currencySymbol}{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer & Total info */}
            <div className="border-t border-zinc-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-400">Recipient Details:</span>
                <p className="font-bold text-black">{foundOrder.customerName}</p>
                <p className="text-zinc-600 font-mono">{foundOrder.customerMobile}</p>
                {foundOrder.shippingAddress?.street && (
                  <p className="text-zinc-500">{foundOrder.shippingAddress.street}</p>
                )}
              </div>

              <div className="space-y-1 text-left sm:text-right">
                <span className="text-[10px] font-mono uppercase text-zinc-400">Payment Status:</span>
                <p className="font-bold uppercase text-black">{foundOrder.paymentStatus}</p>
                <p className="text-sm font-black text-black font-heading pt-1">
                  Grand Total: {storeSettings.currencySymbol}{foundOrder.total.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-zinc-200 pt-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <button
                onClick={handleWhatsAppHelp}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:underline"
              >
                <MessageSquare className="w-4 h-4" />
                <span>NEED HELP WITH THIS SHIPMENT?</span>
              </button>
            </div>
          </div>
        )}

        {!searched && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-left">
            <div className="p-5 bg-zinc-50 border border-zinc-200 space-y-2">
              <Clock className="w-5 h-5 text-black" />
              <h4 className="text-xs font-bold uppercase text-black font-heading">24H Dispatch</h4>
              <p className="text-xs text-zinc-600">All orders undergo laser leak-testing before dispatch.</p>
            </div>
            <div className="p-5 bg-zinc-50 border border-zinc-200 space-y-2">
              <Truck className="w-5 h-5 text-black" />
              <h4 className="text-xs font-bold uppercase text-black font-heading">Air Express</h4>
              <p className="text-xs text-zinc-600">Partnered with BlueDart & Delhivery for fast metro delivery.</p>
            </div>
            <div className="p-5 bg-zinc-50 border border-zinc-200 space-y-2">
              <MessageSquare className="w-5 h-5 text-black" />
              <h4 className="text-xs font-bold uppercase text-black font-heading">WhatsApp Alerts</h4>
              <p className="text-xs text-zinc-600">Live delivery link pinged directly to your WhatsApp.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
