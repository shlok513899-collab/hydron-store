import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Check, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

export const CartDrawer: React.FC = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    cartSubtotal, 
    cartCount, 
    isCartOpen, 
    setIsCartOpen, 
    storeSettings,
    createWhatsAppOrder 
  } = useStore();

  const { currentUser, userProfile } = useAuth();

  const [customerName, setCustomerName] = useState(userProfile?.name || '');
  const [customerMobile, setCustomerMobile] = useState(userProfile?.mobile || '');
  const [customerAddress, setCustomerAddress] = useState(
    userProfile?.address ? `${userProfile.address.street}, ${userProfile.address.city}` : ''
  );
  const [orderNote, setOrderNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = storeSettings.freeShippingThreshold || 999;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const shippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const shippingFee = isFreeShipping ? 0 : storeSettings.flatShippingRate;
  const grandTotal = cartSubtotal + shippingFee;

  const handleWhatsAppCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);

    try {
      const waUrl = await createWhatsAppOrder({
        customerName: customerName.trim() || userProfile?.name || 'Hydron Customer',
        customerMobile: customerMobile.trim() || userProfile?.mobile || '',
        customerEmail: userProfile?.email || currentUser?.email || 'customer@hydron.com',
        shippingAddress: {
          street: customerAddress.trim() || '',
          city: '',
          state: '',
          pincode: '',
          country: 'India'
        },
        orderNote,
        subtotal: cartSubtotal,
        shippingFee,
        total: grandTotal,
      });

      // Open WhatsApp in new tab
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      setIsCartOpen(false);
    } catch (e) {
      console.error('Error placing WhatsApp order:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 bg-black text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-white" />
              <h2 className="text-sm font-extrabold uppercase tracking-[0.18em] font-heading">
                YOUR BAG ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-6 py-3.5 bg-zinc-50 border-b border-zinc-200">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-800 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-black" />
                <span>
                  {isFreeShipping ? (
                    <strong className="text-black uppercase">YOU UNLOCKED FREE SHIPPING!</strong>
                  ) : (
                    <span>
                      Add <strong className="text-black">{storeSettings.currencySymbol}{amountNeededForFreeShipping}</strong> more for <strong>FREE SHIPPING</strong>
                    </span>
                  )}
                </span>
              </div>
              <span className="font-mono text-[11px] text-zinc-500">{Math.round(shippingProgress)}%</span>
            </div>
            <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-black h-full transition-all duration-500 rounded-full" 
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-zinc-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-zinc-500 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-base font-extrabold uppercase text-black tracking-wider font-heading">
                    YOUR BAG IS EMPTY
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                    Explore our engineered insulated bottles and add your favorite vessel.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-zinc-800 transition-colors"
                >
                  START SHOPPING
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div key={`${item.product.id}-${index}`} className="pt-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0">
                    <img 
                      src={item.selectedColor.image || item.product.coverImage} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-tight text-black line-clamp-1 font-heading">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-zinc-400 hover:text-red-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500 font-mono">
                        <span>{item.selectedColor.name}</span>
                        <span>•</span>
                        <span>{item.selectedCapacity}</span>
                      </div>
                    </div>

                    {/* Quantity Selector & Price */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-zinc-300">
                        <button
                          onClick={() => updateCartQuantity(index, item.quantity - 1)}
                          className="p-1 hover:bg-zinc-100 text-zinc-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-black min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(index, item.quantity + 1)}
                          className="p-1 hover:bg-zinc-100 text-zinc-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right font-mono font-bold text-xs sm:text-sm text-black">
                        {storeSettings.currencySymbol}{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Customer Delivery Details (Optional for faster WhatsApp order dispatch) */}
          {cartItems.length > 0 && (
            <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-200 text-left space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                Optional: Pre-fill WhatsApp Order Info
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs bg-white border border-zinc-300 px-2.5 py-1.5 focus:border-black focus:outline-hidden"
                />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                  className="w-full text-xs bg-white border border-zinc-300 px-2.5 py-1.5 focus:border-black focus:outline-hidden font-mono"
                />
              </div>
              <input
                type="text"
                placeholder="Delivery City / Address (Optional)"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full text-xs bg-white border border-zinc-300 px-2.5 py-1.5 focus:border-black focus:outline-hidden"
              />
            </div>
          )}

          {/* Footer & WhatsApp Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-zinc-200 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-mono">{storeSettings.currencySymbol}{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Estimated Shipping</span>
                  <span className="font-mono">
                    {isFreeShipping ? 'FREE' : `${storeSettings.currencySymbol}${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-black pt-2 border-t border-zinc-200 font-heading">
                  <span>Total Amount</span>
                  <span className="font-mono">{storeSettings.currencySymbol}{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Master Checkout Button */}
              <button
                id="cart-whatsapp-checkout-btn"
                onClick={handleWhatsAppCheckout}
                disabled={isSubmitting}
                className="w-full bg-black text-white text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] py-4 flex items-center justify-center gap-2 hover:bg-zinc-800 active:scale-[0.99] transition-all cursor-pointer shadow-lg disabled:opacity-50"
              >
                <span>ORDER VIA WHATSAPP</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-black" /> 100% Genuine
                </span>
                <span>•</span>
                <span>2-Year Warranty</span>
                <span>•</span>
                <span>Instant Confirmation</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
