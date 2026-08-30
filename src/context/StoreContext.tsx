import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  increment 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  CartItem, 
  Category, 
  CMSPage, 
  FAQ,
  HomepageContent, 
  LeadEnquiry, 
  Order, 
  Product, 
  ProductOptionColor, 
  Review, 
  StoreSettings,
  WhatsAppAnalytics,
  WhatsAppClickEvent 
} from '../types';
import { 
  DEFAULT_CATEGORIES, 
  DEFAULT_CMS_PAGES, 
  DEFAULT_FAQS, 
  DEFAULT_HOMEPAGE_CONTENT, 
  DEFAULT_REVIEWS, 
  DEFAULT_STORE_SETTINGS, 
  DEMO_PRODUCTS 
} from '../lib/mockData';
import { sanitizeForFirestore } from '../lib/firestoreUtils';
import { useAuth } from './AuthContext';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  enquiries: LeadEnquiry[];
  reviews: Review[];
  faqs: FAQ[];
  homepageContent: HomepageContent;
  storeSettings: StoreSettings;
  cmsPages: Record<string, CMSPage>;
  whatsappClicks: WhatsAppClickEvent[];
  whatsappAnalytics: WhatsAppAnalytics;
  isLoading: boolean;
  
  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: ProductOptionColor, capacity?: string) => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, newQty: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // WhatsApp helpers & tracking
  generateProductWhatsAppUrl: (product: Product, quantity?: number, color?: ProductOptionColor, capacity?: string) => string;
  generateCartWhatsAppUrl: (customerDetails?: { name?: string; address?: string; mobile?: string }) => string;
  createWhatsAppOrder: (order: Partial<Order>) => Promise<string>;
  trackWhatsAppClick: (source: string, metadata?: { productId?: string; productName?: string; orderNumber?: string; customerName?: string; customerMobile?: string }) => Promise<void>;
  trackAndOpenWhatsApp: (url: string, source: string, metadata?: { productId?: string; productName?: string; orderNumber?: string; customerName?: string; customerMobile?: string }) => void;
  
  // Interactions
  submitEnquiry: (enquiry: Omit<LeadEnquiry, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  submitReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  
  // Admin Operations
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  saveCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status'], courier?: string, trackingNum?: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  updateEnquiryStatus: (id: string, status: LeadEnquiry['status']) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
  updateReviewStatus: (id: string, status: Review['status']) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  saveFAQ: (faq: FAQ) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;
  saveHomepageContent: (content: HomepageContent) => Promise<void>;
  saveStoreSettings: (settings: StoreSettings) => Promise<void>;
  saveCMSPage: (page: CMSPage) => Promise<void>;
  seedInitialDataToFirestore: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();

  // Initialize from LocalStorage or empty state - NEVER auto-load demo products for fresh database
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('hydron_products_v4');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('hydron_categories_v4');
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('hydron_orders_v4');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [enquiries, setEnquiries] = useState<LeadEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem('hydron_enquiries_v4');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('hydron_reviews_v4');
      return saved ? JSON.parse(saved) : DEFAULT_REVIEWS;
    } catch {
      return DEFAULT_REVIEWS;
    }
  });

  const [faqs, setFaqs] = useState<FAQ[]>(() => {
    try {
      const saved = localStorage.getItem('hydron_faqs_v4');
      return saved ? JSON.parse(saved) : DEFAULT_FAQS;
    } catch {
      return DEFAULT_FAQS;
    }
  });

  const [homepageContent, setHomepageContent] = useState<HomepageContent>(() => {
    try {
      const saved = localStorage.getItem('hydron_homepage_cms_v4');
      return saved ? JSON.parse(saved) : DEFAULT_HOMEPAGE_CONTENT;
    } catch {
      return DEFAULT_HOMEPAGE_CONTENT;
    }
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('hydron_settings_v4');
      return saved ? JSON.parse(saved) : DEFAULT_STORE_SETTINGS;
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  });

  const [cmsPages, setCmsPages] = useState<Record<string, CMSPage>>(() => {
    try {
      const saved = localStorage.getItem('hydron_cms_pages_v4');
      if (saved) return JSON.parse(saved);
    } catch {}
    const map: Record<string, CMSPage> = {};
    DEFAULT_CMS_PAGES.forEach(p => { map[p.slug] = p; });
    return map;
  });

  const [whatsappClicks, setWhatsappClicks] = useState<WhatsAppClickEvent[]>([]);
  const [whatsappAnalytics, setWhatsappAnalytics] = useState<WhatsAppAnalytics>({
    totalClicks: 0,
    productClicks: 0,
    cartClicks: 0,
    floatingClicks: 0,
    contactClicks: 0,
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cart State with LocalStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('hydron_cart_v4');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Synchronize localStorage caches
  useEffect(() => {
    try {
      localStorage.setItem('hydron_cart_v4', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_products_v4', JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_categories_v4', JSON.stringify(categories));
    } catch {}
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_reviews_v4', JSON.stringify(reviews));
    } catch {}
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_faqs_v4', JSON.stringify(faqs));
    } catch {}
  }, [faqs]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_homepage_cms_v4', JSON.stringify(homepageContent));
    } catch {}
  }, [homepageContent]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_settings_v4', JSON.stringify(storeSettings));
    } catch {}
  }, [storeSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_cms_pages_v4', JSON.stringify(cmsPages));
    } catch {}
  }, [cmsPages]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_orders_v4', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_enquiries_v4', JSON.stringify(enquiries));
    } catch {}
  }, [enquiries]);

  // 1. Load / listen to Products in Real Time from Firestore
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
        const items: Product[] = [];
        snapshot.forEach((d) => {
          items.push({ id: d.id, ...d.data() } as Product);
        });
        setProducts(items);
      }, (error) => {
        console.warn('Products real-time sync notice:', error.message);
      });
    } catch (err) {
      console.warn('Products listener error:', err);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 2. Load / listen to Categories in Real Time
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
        if (!snapshot.empty) {
          const items: Category[] = [];
          snapshot.forEach((d) => {
            items.push({ id: d.id, ...d.data() } as Category);
          });
          setCategories(items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
        }
      }, (error) => {
        console.warn('Categories sync notice:', error.message);
      });
    } catch (err) {
      console.warn('Categories listener error:', err);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 3. Load / listen to Reviews in Real Time
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onSnapshot(collection(db, 'reviews'), (snapshot) => {
        if (!snapshot.empty) {
          const items: Review[] = [];
          snapshot.forEach((d) => {
            items.push({ id: d.id, ...d.data() } as Review);
          });
          setReviews(items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        }
      }, (error) => {
        console.warn('Reviews sync notice:', error.message);
      });
    } catch (err) {
      console.warn('Reviews listener error:', err);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 4. Load / listen to FAQs in Real Time
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onSnapshot(collection(db, 'faqs'), (snapshot) => {
        if (!snapshot.empty) {
          const items: FAQ[] = [];
          snapshot.forEach((d) => {
            items.push({ id: d.id, ...d.data() } as FAQ);
          });
          setFaqs(items.sort((a, b) => (a.order || 0) - (b.order || 0)));
        }
      }, (error) => {
        console.warn('FAQs sync notice:', error.message);
      });
    } catch (err) {
      console.warn('FAQs listener error:', err);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 5. Load / listen to Store Settings, Homepage CMS & Pages in Real Time
  useEffect(() => {
    let unsubSettings: (() => void) | undefined;
    let unsubCMS: (() => void) | undefined;
    let unsubPages: (() => void) | undefined;

    try {
      unsubSettings = onSnapshot(doc(db, 'store_settings', 'general'), (snap) => {
        if (snap.exists()) {
          setStoreSettings({ ...DEFAULT_STORE_SETTINGS, ...snap.data() } as StoreSettings);
        }
      }, (err) => console.warn('Settings sync:', err.message));

      unsubCMS = onSnapshot(doc(db, 'store_settings', 'homepage_cms'), (snap) => {
        if (snap.exists()) {
          setHomepageContent({ ...DEFAULT_HOMEPAGE_CONTENT, ...snap.data() } as HomepageContent);
        }
      }, (err) => console.warn('Homepage CMS sync:', err.message));

      unsubPages = onSnapshot(collection(db, 'cms_pages'), (snap) => {
        if (!snap.empty) {
          const pagesMap: Record<string, CMSPage> = {};
          DEFAULT_CMS_PAGES.forEach(p => { pagesMap[p.slug] = p; });
          snap.forEach((d) => {
            const page = { id: d.id, ...d.data() } as CMSPage;
            if (page.slug) pagesMap[page.slug] = page;
          });
          setCmsPages(pagesMap);
        }
      }, (err) => console.warn('CMS Pages sync:', err.message));

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }

    return () => {
      if (unsubSettings) unsubSettings();
      if (unsubCMS) unsubCMS();
      if (unsubPages) unsubPages();
    };
  }, []);

  // 6. Load / listen to Orders in Real Time
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const ordersCol = collection(db, 'orders');
      unsubscribe = onSnapshot(ordersCol, (snapshot) => {
        const items: Order[] = [];
        snapshot.forEach((d) => {
          items.push({ id: d.id, ...d.data() } as Order);
        });
        const sorted = items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(sorted);
      }, (err) => {
        console.warn('Orders sync notice:', err.message);
      });
    } catch (e) {
      console.warn('Orders listener setup notice:', e);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser, isAdmin]);

  // 7. Load / listen to Enquiries in Real Time
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onSnapshot(collection(db, 'enquiries'), (snapshot) => {
        const items: LeadEnquiry[] = [];
        snapshot.forEach((d) => {
          items.push({ id: d.id, ...d.data() } as LeadEnquiry);
        });
        setEnquiries(items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }, (err) => {
        console.warn('Enquiries sync notice:', err.message);
      });
    } catch (e) {
      console.warn('Enquiries listener notice:', e);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 8. Load / listen to WhatsApp Clicks & Analytics in Real Time
  useEffect(() => {
    let unsubClicks: (() => void) | undefined;
    let unsubStats: (() => void) | undefined;

    try {
      unsubClicks = onSnapshot(collection(db, 'whatsapp_clicks'), (snapshot) => {
        const clicks: WhatsAppClickEvent[] = [];
        snapshot.forEach((d) => {
          clicks.push({ id: d.id, ...d.data() } as WhatsAppClickEvent);
        });
        clicks.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setWhatsappClicks(clicks);
      }, (err) => console.warn('WhatsApp clicks sync:', err.message));

      unsubStats = onSnapshot(doc(db, 'analytics', 'whatsapp_stats'), (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setWhatsappAnalytics({
            totalClicks: d.totalClicks || 0,
            productClicks: d.productClicks || 0,
            cartClicks: d.cartClicks || 0,
            floatingClicks: d.floatingClicks || 0,
            contactClicks: d.contactClicks || 0,
            lastClickTimestamp: d.lastClickTimestamp || undefined
          });
        }
      }, (err) => console.warn('WhatsApp stats sync:', err.message));
    } catch (err) {
      console.warn('WhatsApp analytics setup error:', err);
    }

    return () => {
      if (unsubClicks) unsubClicks();
      if (unsubStats) unsubStats();
    };
  }, []);

  // Track WhatsApp Click and log in Firestore
  const trackWhatsAppClick = async (
    source: string, 
    metadata?: { 
      productId?: string; 
      productName?: string; 
      orderNumber?: string; 
      customerName?: string; 
      customerMobile?: string; 
    }
  ) => {
    const clickId = `wa-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const eventData: WhatsAppClickEvent = {
      id: clickId,
      source: source || 'UNKNOWN',
      productId: metadata?.productId,
      productName: metadata?.productName,
      orderNumber: metadata?.orderNumber,
      customerName: metadata?.customerName || currentUser?.displayName || undefined,
      customerMobile: metadata?.customerMobile || undefined,
      timestamp: new Date().toISOString(),
      pageUrl: typeof window !== 'undefined' ? window.location.pathname : '',
    };

    // Update local state optimistically
    setWhatsappClicks(prev => [eventData, ...prev]);
    setWhatsappAnalytics(prev => {
      const isProduct = source.includes('PRODUCT');
      const isCart = source.includes('CART') || source.includes('CHECKOUT');
      const isFloating = source.includes('FLOATING');
      const isContact = source.includes('CONTACT');
      return {
        ...prev,
        totalClicks: prev.totalClicks + 1,
        productClicks: isProduct ? prev.productClicks + 1 : prev.productClicks,
        cartClicks: isCart ? prev.cartClicks + 1 : prev.cartClicks,
        floatingClicks: isFloating ? prev.floatingClicks + 1 : prev.floatingClicks,
        contactClicks: isContact ? prev.contactClicks + 1 : prev.contactClicks,
        lastClickTimestamp: new Date().toISOString()
      };
    });

    // Write event doc to Firestore
    try {
      const cleanEvent = sanitizeForFirestore(eventData);
      await setDoc(doc(db, 'whatsapp_clicks', clickId), cleanEvent);
      
      // Update analytics counter doc
      const isProduct = source.includes('PRODUCT');
      const isCart = source.includes('CART') || source.includes('CHECKOUT');
      const isFloating = source.includes('FLOATING');
      const isContact = source.includes('CONTACT');

      const statsUpdates: Record<string, any> = {
        totalClicks: increment(1),
        lastClickTimestamp: new Date().toISOString(),
      };
      if (isProduct) statsUpdates.productClicks = increment(1);
      if (isCart) statsUpdates.cartClicks = increment(1);
      if (isFloating) statsUpdates.floatingClicks = increment(1);
      if (isContact) statsUpdates.contactClicks = increment(1);

      await setDoc(doc(db, 'analytics', 'whatsapp_stats'), statsUpdates, { merge: true });
    } catch (e: any) {
      console.warn('WhatsApp click sync note:', e?.message || e);
    }
  };

  const trackAndOpenWhatsApp = (
    url: string, 
    source: string, 
    metadata?: { 
      productId?: string; 
      productName?: string; 
      orderNumber?: string; 
      customerName?: string; 
      customerMobile?: string; 
    }
  ) => {
    // Fire tracking in background
    trackWhatsAppClick(source, metadata);
    // Open WhatsApp
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, color?: ProductOptionColor, capacity?: string) => {
    const chosenColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'Matte Onyx', hex: '#18181b' });
    const chosenCapacity = capacity || (product.capacities && product.capacities.length > 0 ? product.capacities[0] : '750ml');

    setCartItems(prev => {
      const existingIdx = prev.findIndex(
        item => 
          item.product.id === product.id && 
          item.selectedColor.name === chosenColor.name &&
          item.selectedCapacity === chosenCapacity
      );

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      }
      return [...prev, { product, quantity, selectedColor: chosenColor, selectedCapacity: chosenCapacity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }
    setCartItems(prev => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index].quantity = newQty;
      }
      return copy;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // WhatsApp Order Link Generator
  const generateProductWhatsAppUrl = (
    product: Product, 
    quantity = 1, 
    color?: ProductOptionColor, 
    capacity?: string
  ): string => {
    const phone = storeSettings.whatsappNumber.replace(/[^0-9]/g, '') || '919876543210';
    const chosenColor = color?.name || (product.colors?.[0]?.name || 'Standard');
    const chosenCap = capacity || (product.capacities?.[0] || 'Standard');
    const total = product.price * quantity;

    const message = [
      `*HYDRON VIP BOTTLE INQUIRY & DIRECT ORDER*`,
      `---------------------------------------`,
      `*Item:* ${product.name}`,
      `*SKU:* ${product.sku || product.id}`,
      `*Color:* ${chosenColor}`,
      `*Capacity:* ${chosenCap}`,
      `*Quantity:* ${quantity}`,
      `*Unit Price:* ${storeSettings.currencySymbol}${product.price.toLocaleString('en-IN')}`,
      `*Total Amount:* ${storeSettings.currencySymbol}${total.toLocaleString('en-IN')}`,
      `---------------------------------------`,
      `Hi Hydron Concierge! I want to purchase this flask with express insured shipping. Please share payment instructions and confirm dispatch availability.`,
      `Product URL: ${typeof window !== 'undefined' ? `${window.location.origin}/product/${product.slug}` : ''}`
    ].join('\n');

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const generateCartWhatsAppUrl = (customerDetails?: { name?: string; address?: string; mobile?: string }): string => {
    const phone = storeSettings.whatsappNumber.replace(/[^0-9]/g, '') || '919876543210';
    const shipping = cartSubtotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.flatShippingRate;
    const finalTotal = cartSubtotal + shipping;

    const itemLines = cartItems.map((it, idx) => 
      `${idx + 1}. *${it.product.name}* (${it.selectedColor.name} | ${it.selectedCapacity}) x${it.quantity} - ${storeSettings.currencySymbol}${(it.product.price * it.quantity).toLocaleString('en-IN')}`
    ).join('\n');

    const message = [
      `*HYDRON OFFICIAL STORE - NEW CART ORDER*`,
      `=======================================`,
      `*ORDER SUMMARY:*`,
      itemLines,
      `---------------------------------------`,
      `*Subtotal:* ${storeSettings.currencySymbol}${cartSubtotal.toLocaleString('en-IN')}`,
      `*Shipping:* ${shipping === 0 ? 'FREE EXPRESS SHIPPING' : `${storeSettings.currencySymbol}${shipping}`}`,
      `*ESTIMATED TOTAL:* ${storeSettings.currencySymbol}${finalTotal.toLocaleString('en-IN')}`,
      `=======================================`,
      customerDetails?.name ? `*Customer Name:* ${customerDetails.name}` : '',
      customerDetails?.mobile ? `*Contact Mobile:* ${customerDetails.mobile}` : '',
      customerDetails?.address ? `*Delivery Address:* ${customerDetails.address}` : '',
      `=======================================`,
      `Hi Hydron Concierge! I am ready to confirm this order. Please share UPI / Card payment details and dispatch window.`
    ].filter(Boolean).join('\n');

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  // Create an order record
  const createWhatsAppOrder = async (orderData: Partial<Order>): Promise<string> => {
    const orderNumber = `HYD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      id: orderNumber,
      orderNumber,
      userId: currentUser?.uid || 'guest',
      customerName: orderData.customerName || 'Guest Patron',
      customerEmail: orderData.customerEmail || currentUser?.email || 'unregistered@hydron.com',
      customerMobile: orderData.customerMobile || '',
      shippingAddress: orderData.shippingAddress || {
        street: 'Not specified',
        city: 'India',
        state: 'IN',
        pincode: '000000',
        country: 'India'
      },
      items: orderData.items || cartItems.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        productImage: i.product.coverImage,
        price: i.product.price,
        quantity: i.quantity,
        color: i.selectedColor.name,
        capacity: i.selectedCapacity
      })),
      subtotal: orderData.subtotal || cartSubtotal,
      shippingFee: orderData.shippingFee || (cartSubtotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.flatShippingRate),
      total: orderData.total || (cartSubtotal + (cartSubtotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.flatShippingRate)),
      status: 'PENDING',
      paymentMethod: 'WHATSAPP_ORDER',
      orderNote: orderData.orderNote || 'Order initiated via WhatsApp Checkout',
      createdAt: new Date().toISOString()
    };

    // Track WhatsApp conversion event
    trackWhatsAppClick('CART_CHECKOUT_ORDER', {
      orderNumber,
      customerName: newOrder.customerName,
      customerMobile: newOrder.customerMobile
    });

    // Save in Firestore orders collection & optimistic update
    try {
      const cleanOrder = sanitizeForFirestore(newOrder);
      await setDoc(doc(db, 'orders', orderNumber), cleanOrder);
    } catch (err: any) {
      console.warn('Order saved note:', err?.message || err);
    }

    setOrders(prev => [newOrder, ...prev]);

    // Return the WhatsApp URL
    const fullAddress = `${newOrder.shippingAddress.street}, ${newOrder.shippingAddress.city}, ${newOrder.shippingAddress.state} - ${newOrder.shippingAddress.pincode}`;
    return generateCartWhatsAppUrl({
      name: newOrder.customerName,
      mobile: newOrder.customerMobile,
      address: fullAddress.length > 5 ? fullAddress : undefined
    });
  };

  // Submit Lead Enquiry
  const submitEnquiry = async (enquiryData: Omit<LeadEnquiry, 'id' | 'createdAt' | 'status'>) => {
    const enquiryId = `enq-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newDoc: LeadEnquiry = {
      ...enquiryData,
      id: enquiryId,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };
    try {
      const cleanDoc = sanitizeForFirestore(newDoc);
      await setDoc(doc(db, 'enquiries', enquiryId), cleanDoc);
    } catch (err: any) {
      console.warn('Enquiry fallback:', err?.message || err);
    }
    setEnquiries(prev => [newDoc, ...prev]);
  };

  // Submit Review
  const submitReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    const reviewId = `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newReview: Review = {
      ...reviewData,
      id: reviewId,
      status: 'APPROVED',
      createdAt: new Date().toISOString()
    };
    try {
      const cleanRev = sanitizeForFirestore(newReview);
      await setDoc(doc(db, 'reviews', reviewId), cleanRev);
    } catch (err: any) {
      console.warn('Review save fallback:', err?.message || err);
    }
    setReviews(prev => [newReview, ...prev]);
  };

  // Admin: Save product
  const saveProduct = async (product: Product) => {
    const prodToSave = {
      ...product,
      updatedAt: new Date().toISOString(),
      createdAt: product.createdAt || new Date().toISOString()
    };

    // 1. Optimistic Local State Update
    setProducts(prev => {
      const exists = prev.some(p => p.id === prodToSave.id);
      if (exists) {
        return prev.map(p => p.id === prodToSave.id ? prodToSave : p);
      }
      return [prodToSave, ...prev];
    });

    // 2. Persistent Firestore Write with sanitized payload
    try {
      const cleanProd = sanitizeForFirestore(prodToSave);
      const prodRef = doc(db, 'products', product.id);
      await setDoc(prodRef, cleanProd, { merge: true });
    } catch (e: any) {
      console.warn('Product saved to local storage (Firestore sync note):', e?.message || e);
    }
  };

  // Admin: Delete product
  const deleteProduct = async (id: string) => {
    // 1. Optimistic Local Delete
    setProducts(prev => prev.filter(p => p.id !== id));

    // 2. Persistent Firestore Delete
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e: any) {
      console.warn('Product deleted from local storage (Firestore sync note):', e?.message || e);
    }
  };

  // Admin: Save Category
  const saveCategory = async (category: Category) => {
    const cat = { ...category, id: category.id || `cat-${Date.now()}` };
    setCategories(prev => {
      const exists = prev.some(c => c.id === cat.id);
      if (exists) return prev.map(c => c.id === cat.id ? cat : c);
      return [...prev, cat];
    });

    try {
      const cleanCat = sanitizeForFirestore(cat);
      const catRef = doc(db, 'categories', cat.id);
      await setDoc(catRef, cleanCat, { merge: true });
    } catch (e: any) {
      console.warn('Category saved to local storage (Firestore sync note):', e?.message || e);
    }
  };

  // Admin: Delete Category
  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (e: any) {
      console.warn('Category deleted from local storage (Firestore sync note):', e?.message || e);
    }
  };

  // Admin: Update order
  const updateOrderStatus = async (id: string, status: Order['status'], courier?: string, trackingNum?: string) => {
    const updates: Partial<Order> = { status, updatedAt: new Date().toISOString() };
    if (courier) updates.trackingCourier = courier;
    if (trackingNum) updates.trackingNumber = trackingNum;

    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));

    try {
      const cleanUpdates = sanitizeForFirestore(updates);
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, cleanUpdates);
    } catch (e: any) {
      console.warn('Order updated in local storage (Firestore sync note):', e?.message || e);
    }
  };

  // Admin: Delete Order
  const deleteOrder = async (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    try {
      await deleteDoc(doc(db, 'orders', id));
    } catch (e: any) {
      console.warn('Order deleted from local storage (Firestore sync note):', e?.message || e);
    }
  };

  // Admin: Update Enquiry Status
  const updateEnquiryStatus = async (id: string, status: LeadEnquiry['status']) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    try {
      const enqRef = doc(db, 'enquiries', id);
      await updateDoc(enqRef, { status });
    } catch (e: any) {
      console.warn('Enquiry status updated in local storage (Firestore sync note):', e?.message || e);
    }
  };

  const deleteEnquiry = async (id: string) => {
    setEnquiries(prev => prev.filter(e => e.id !== id));
    try {
      await deleteDoc(doc(db, 'enquiries', id));
    } catch (e: any) {
      console.warn('Enquiry deleted from local storage (Firestore sync note):', e?.message || e);
    }
  };

  // Admin: Update Review Status
  const updateReviewStatus = async (id: string, status: Review['status']) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try {
      const revRef = doc(db, 'reviews', id);
      await updateDoc(revRef, { status });
    } catch (e: any) {
      console.warn('Review status updated in local storage (Firestore sync note):', e?.message || e);
    }
  };

  const deleteReview = async (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (e: any) {
      console.warn('Review deleted from local storage (Firestore sync note):', e?.message || e);
    }
  };

  // Admin: Save FAQ
  const saveFAQ = async (faq: FAQ) => {
    const faqId = faq.id || `faq-${Date.now()}`;
    const cleanFaq = { ...faq, id: faqId };

    setFaqs(prev => {
      const exists = prev.some(f => f.id === faqId);
      if (exists) return prev.map(f => f.id === faqId ? cleanFaq : f);
      return [...prev, cleanFaq];
    });

    try {
      const sanitized = sanitizeForFirestore(cleanFaq);
      await setDoc(doc(db, 'faqs', faqId), sanitized, { merge: true });
    } catch (e: any) {
      console.warn('FAQ saved to local storage (Firestore sync note):', e?.message || e);
    }
  };

  const deleteFAQ = async (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    try {
      await deleteDoc(doc(db, 'faqs', id));
    } catch (e: any) {
      console.warn('FAQ deleted from local storage (Firestore sync note):', e?.message || e);
    }
  };

  // Admin: Save Homepage CMS
  const saveHomepageContent = async (content: HomepageContent) => {
    setHomepageContent(content);
    try {
      const cleanContent = sanitizeForFirestore(content);
      const ref = doc(db, 'store_settings', 'homepage_cms');
      await setDoc(ref, cleanContent, { merge: true });
    } catch (e: any) {
      console.warn('Homepage content saved to local storage (Firestore sync note):', e?.message || e);
    }
  };

  // Admin: Save Store Settings
  const saveStoreSettings = async (settings: StoreSettings) => {
    setStoreSettings(settings);
    try {
      const cleanSettings = sanitizeForFirestore(settings);
      const ref = doc(db, 'store_settings', 'general');
      await setDoc(ref, cleanSettings, { merge: true });
    } catch (e: any) {
      console.warn('Store settings saved to local storage (Firestore sync note):', e?.message || e);
    }
  };

  // Admin: Save CMS Page
  const saveCMSPage = async (page: CMSPage) => {
    setCmsPages(prev => ({ ...prev, [page.slug]: page }));
    try {
      const cleanPage = sanitizeForFirestore(page);
      const ref = doc(db, 'cms_pages', page.slug);
      await setDoc(ref, cleanPage, { merge: true });
    } catch (e: any) {
      console.warn('CMS page saved to local storage (Firestore sync note):', e?.message || e);
    }
  };

  const seedInitialDataToFirestore = async () => {
    try {
      // 1. Seed store settings & Homepage CMS
      await setDoc(doc(db, 'store_settings', 'general'), sanitizeForFirestore(DEFAULT_STORE_SETTINGS));
      await setDoc(doc(db, 'store_settings', 'homepage_cms'), sanitizeForFirestore(DEFAULT_HOMEPAGE_CONTENT));

      // 2. Seed products
      for (const prod of DEMO_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), sanitizeForFirestore(prod));
      }

      // 3. Seed categories
      for (const cat of DEFAULT_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), sanitizeForFirestore(cat));
      }

      // 4. Seed reviews
      for (const rev of DEFAULT_REVIEWS) {
        await setDoc(doc(db, 'reviews', rev.id), sanitizeForFirestore(rev));
      }

      // 5. Seed FAQs
      for (const faq of DEFAULT_FAQS) {
        await setDoc(doc(db, 'faqs', faq.id), sanitizeForFirestore(faq));
      }

      // 6. Seed CMS pages
      for (const page of DEFAULT_CMS_PAGES) {
        await setDoc(doc(db, 'cms_pages', page.slug), sanitizeForFirestore(page));
      }

      console.log('Successfully synchronized Hydron catalog & CMS to Firestore!');
    } catch (error: any) {
      console.warn('Seeding note (local data active):', error?.message || error);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        enquiries,
        reviews,
        faqs,
        homepageContent,
        storeSettings,
        cmsPages,
        whatsappClicks,
        whatsappAnalytics,
        isLoading,

        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,

        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,

        generateProductWhatsAppUrl,
        generateCartWhatsAppUrl,
        createWhatsAppOrder,
        trackWhatsAppClick,
        trackAndOpenWhatsApp,

        submitEnquiry,
        submitReview,

        saveProduct,
        deleteProduct,
        saveCategory,
        deleteCategory,
        updateOrderStatus,
        deleteOrder,
        updateEnquiryStatus,
        deleteEnquiry,
        updateReviewStatus,
        deleteReview,
        saveFAQ,
        deleteFAQ,
        saveHomepageContent,
        saveStoreSettings,
        saveCMSPage,
        seedInitialDataToFirestore,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
