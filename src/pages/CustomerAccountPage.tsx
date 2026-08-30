import React, { useState, useEffect } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  MessageSquare, 
  LogOut, 
  ShieldCheck, 
  Clock, 
  Check, 
  ArrowRight,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

interface CustomerAccountPageProps {
  onNavigateToShop: () => void;
  onNavigateToAdmin: () => void;
  onNavigateToTrack: () => void;
}

export const CustomerAccountPage: React.FC<CustomerAccountPageProps> = ({
  onNavigateToShop,
  onNavigateToAdmin,
  onNavigateToTrack,
}) => {
  const { currentUser, userProfile, isAdmin, logout, updateUserProfile } = useAuth();
  const { orders, storeSettings, enquiries, trackAndOpenWhatsApp } = useStore();

  const [activeTab, setActiveTab] = useState<'ORDERS' | 'PROFILE' | 'ADDRESS' | 'ENQUIRIES'>('ORDERS');
  
  // Profile edit form state
  const [profileName, setProfileName] = useState(userProfile?.name || currentUser?.displayName || '');
  const [profileMobile, setProfileMobile] = useState(userProfile?.mobile || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Address form
  const [street, setStreet] = useState(userProfile?.address?.street || '');
  const [city, setCity] = useState(userProfile?.address?.city || '');
  const [state, setState] = useState(userProfile?.address?.state || '');
  const [pincode, setPincode] = useState(userProfile?.address?.pincode || '');
  const [addressSaved, setAddressSaved] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);

  // Sync state if userProfile changes
  useEffect(() => {
    if (userProfile) {
      if (userProfile.name) setProfileName(userProfile.name);
      if (userProfile.mobile) setProfileMobile(userProfile.mobile);
      if (userProfile.address) {
        setStreet(userProfile.address.street || '');
        setCity(userProfile.address.city || '');
        setState(userProfile.address.state || '');
        setPincode(userProfile.address.pincode || '');
      }
    }
  }, [userProfile]);

  if (!currentUser) {
    return (
      <div className="py-24 text-center space-y-4">
        <p className="text-sm font-bold uppercase text-black">You must sign in to view your account dashboard.</p>
        <button onClick={onNavigateToShop} className="bg-black text-white text-xs font-bold uppercase px-6 py-3">
          Sign In Now
        </button>
      </div>
    );
  }

  // Filter orders by current user's email or mobile
  const userOrders = orders.filter(
    (o) =>
      o.userId === currentUser.uid ||
      o.customerId === currentUser.uid ||
      o.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
      (userProfile?.mobile && o.customerMobile?.replace(/[^0-9]/g, '') === userProfile.mobile.replace(/[^0-9]/g, ''))
  );

  const userEnquiries = enquiries.filter(
    (e) => e.email?.toLowerCase() === currentUser.email?.toLowerCase()
  );

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError(null);
    try {
      await updateUserProfile({
        name: profileName.trim(),
        mobile: profileMobile.trim(),
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch (err: any) {
      setProfileError(err?.message || 'Failed to update profile in database');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressSaving(true);
    try {
      await updateUserProfile({
        address: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          country: 'India',
        }
      });
      setAddressSaved(true);
      setTimeout(() => setAddressSaved(false), 2500);
    } catch (err) {
      console.warn('Address update error:', err);
    } finally {
      setAddressSaving(false);
    }
  };

  const handleWhatsAppOrderInquiry = (orderNumber: string) => {
    const num = storeSettings.whatsappNumber.replace(/[^0-9]/g, '') || '919876543210';
    const text = encodeURIComponent(`Hi Hydron Concierge! Inquiring about my Order #${orderNumber}.`);
    const waUrl = `https://wa.me/${num}?text=${text}`;
    trackAndOpenWhatsApp(waUrl, 'ACCOUNT_ORDER_INQUIRY', {
      orderNumber,
      customerName: userProfile?.name || currentUser.displayName || undefined,
      customerMobile: userProfile?.mobile || undefined
    });
  };

  return (
    <div className="w-full bg-[#f9f9fb] min-h-screen py-10 sm:py-16 px-4 sm:px-8 text-left">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Profile Header Banner */}
        <div className="bg-black text-white p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white font-bold text-xl font-heading">
              {userProfile?.name?.charAt(0) || currentUser.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-heading">
                  {userProfile?.name || 'Hydron Member'}
                </h1>
                {isAdmin && (
                  <span className="px-2 py-0.5 bg-zinc-800 text-[10px] uppercase tracking-wider font-mono border border-zinc-700">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                {currentUser.email} • {userProfile?.mobile || 'No mobile linked'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="bg-white text-black text-xs font-bold uppercase tracking-wider px-5 py-2.5 hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Console</span>
              </button>
            )}
            <button
              onClick={logout}
              className="border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 text-xs font-bold uppercase tracking-wider px-4 py-2.5 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Navigation (Col 1-4) */}
          <div className="lg:col-span-4 bg-white border border-zinc-200 p-4 space-y-1">
            {[
              { id: 'ORDERS', label: `My Orders (${userOrders.length})`, icon: Package },
              { id: 'PROFILE', label: 'Account Profile', icon: User },
              { id: 'ADDRESS', label: 'Default Shipping Address', icon: MapPin },
              { id: 'ENQUIRIES', label: `My Inquiries (${userEnquiries.length})`, icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-black'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Content Area (Col 5-12) */}
          <div className="lg:col-span-8 bg-white border border-zinc-200 p-6 sm:p-8">
            
            {/* Orders Tab */}
            {activeTab === 'ORDERS' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                  <h3 className="text-base font-bold uppercase tracking-tight text-black font-heading">
                    ORDER HISTORY & WHATSAPP TRANSCRIPTS
                  </h3>
                  <button
                    onClick={onNavigateToShop}
                    className="text-xs font-bold uppercase tracking-wider text-black hover:underline"
                  >
                    + New Bottle
                  </button>
                </div>

                {userOrders.length === 0 ? (
                  <div className="py-16 text-center text-zinc-500 space-y-3">
                    <ShoppingBag className="w-10 h-10 text-zinc-400 mx-auto" />
                    <p className="text-sm font-bold uppercase text-black font-heading">No order records yet</p>
                    <p className="text-xs text-zinc-500">Orders placed via WhatsApp or checkout will reflect here.</p>
                    <button
                      onClick={onNavigateToShop}
                      className="mt-2 bg-black text-white text-xs font-bold uppercase px-6 py-2.5"
                    >
                      BROWSE SHOP
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((ord) => (
                      <div key={ord.id} className="border border-zinc-200 p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-zinc-400">ORDER NO</span>
                            <p className="text-sm font-bold uppercase text-black font-heading">
                              #{ord.orderNumber || ord.id.slice(0, 8).toUpperCase()}
                            </p>
                            <span className="text-[11px] text-zinc-500 font-mono">
                              {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 bg-black text-white text-[11px] font-mono uppercase font-bold">
                              {ord.status}
                            </span>
                            <button
                              onClick={() => handleWhatsAppOrderInquiry(ord.orderNumber || ord.id)}
                              className="text-xs font-bold uppercase text-black hover:underline flex items-center gap-1"
                              title="Ask status on WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="divide-y divide-zinc-100">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="py-2 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-12 bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0">
                                  <img src={it.image} alt={it.productName} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="font-bold text-black font-heading">{it.productName}</p>
                                  <p className="text-[11px] text-zinc-500 font-mono">
                                    {it.color} • {it.capacity} (x{it.quantity})
                                  </p>
                                </div>
                              </div>
                              <span className="font-mono font-bold text-black">
                                {storeSettings.currencySymbol}{(it.price * it.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Total */}
                        <div className="border-t border-zinc-100 pt-3 flex justify-between items-center text-xs">
                          <span className="text-zinc-500 font-mono">
                            {ord.trackingNumber ? `AWB: ${ord.trackingNumber} (${ord.courierPartner})` : 'Preparing dispatch'}
                          </span>
                          <span className="text-sm font-black text-black font-heading">
                            Total: {storeSettings.currencySymbol}{ord.total.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'PROFILE' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                  <h3 className="text-base font-bold uppercase tracking-tight text-black font-heading">
                    HYDRON ACCOUNT PROFILE & PREFERENCES
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-400">DATABASE SYNCED</span>
                </div>

                {profileError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                    {profileError}
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                        Full Name / Display Name
                      </label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="Your Full Name"
                        className="w-full text-xs bg-zinc-50 border border-zinc-300 p-3 focus:outline-hidden focus:border-black font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                        Email Address (Read Only)
                      </label>
                      <input
                        type="email"
                        disabled
                        value={currentUser.email || ''}
                        className="w-full text-xs bg-zinc-100 border border-zinc-200 p-3 text-zinc-500 font-mono cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                        WhatsApp Contact Mobile
                      </label>
                      <input
                        type="tel"
                        value={profileMobile}
                        onChange={(e) => setProfileMobile(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full text-xs bg-zinc-50 border border-zinc-300 p-3 focus:outline-hidden focus:border-black font-mono"
                      />
                      <span className="text-[10px] text-zinc-400 font-mono mt-1 block">Used to auto-fill your WhatsApp checkout orders.</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                        Account Status & Tier
                      </label>
                      <div className="p-3 bg-zinc-50 border border-zinc-200 text-xs font-mono text-black font-bold flex items-center justify-between">
                        <span>Hydron Verified Patron</span>
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {profileSaving ? 'SAVING TO DATABASE...' : 'SAVE PROFILE CHANGES'}
                    </button>
                    {profileSaved && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> Profile Successfully Saved to Database
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === 'ADDRESS' && (
              <div className="space-y-6">
                <h3 className="text-base font-bold uppercase tracking-tight text-black font-heading border-b border-zinc-200 pb-4">
                  DEFAULT DELIVERY ADDRESS
                </h3>

                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                      Street Address & Building / Apt
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 402, Highline Towers, Indiranagar"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full text-xs bg-zinc-50 border border-zinc-300 p-2.5 focus:outline-hidden focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Bengaluru"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full text-xs bg-zinc-50 border border-zinc-300 p-2.5 focus:outline-hidden focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Karnataka"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full text-xs bg-zinc-50 border border-zinc-300 p-2.5 focus:outline-hidden focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="560038"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full text-xs bg-zinc-50 border border-zinc-300 p-2.5 focus:outline-hidden focus:border-black font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-4">
                    <button
                      type="submit"
                      className="bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 hover:bg-zinc-800 transition-colors"
                    >
                      SAVE ADDRESS
                    </button>
                    {addressSaved && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Address Updated
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Enquiries Tab */}
            {activeTab === 'ENQUIRIES' && (
              <div className="space-y-6">
                <h3 className="text-base font-bold uppercase tracking-tight text-black font-heading border-b border-zinc-200 pb-4">
                  CUSTOMER SERVICE INQUIRIES
                </h3>

                {userEnquiries.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6">You have no pending support tickets.</p>
                ) : (
                  <div className="space-y-3">
                    {userEnquiries.map((enq) => (
                      <div key={enq.id} className="p-4 bg-zinc-50 border border-zinc-200 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-black uppercase font-heading">{enq.subject}</span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600">{enq.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
