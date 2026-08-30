import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot 
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
  StoreSettings 
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

  // WhatsApp helpers
  generateProductWhatsAppUrl: (product: Product, quantity?: number, color?: ProductOptionColor, capacity?: string) => string;
  generateCartWhatsAppUrl: (customerDetails?: { name?: string; address?: string; mobile?: string }) => string;
  createWhatsAppOrder: (order: Partial<Order>) => Promise<string>;
  
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
  const hasSeededRef = useRef(false);

  // Initialize from LocalStorage or Fallbacks for zero-flicker startup
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('hydron_products_v2');
      return saved ? JSON.parse(saved) : DEMO_PRODUCTS;
    } catch {
      return DEMO_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('hydron_categories_v2');
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('hydron_orders_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [enquiries, setEnquiries] = useState<LeadEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem('hydron_enquiries_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('hydron_reviews_v2');
      return saved ? JSON.parse(saved) : DEFAULT_REVIEWS;
    } catch {
      return DEFAULT_REVIEWS;
    }
  });

  const [faqs, setFaqs] = useState<FAQ[]>(() => {
    try {
      const saved = localStorage.getItem('hydron_faqs_v2');
      return saved ? JSON.parse(saved) : DEFAULT_FAQS;
    } catch {
      return DEFAULT_FAQS;
    }
  });

  const [homepageContent, setHomepageContent] = useState<HomepageContent>(() => {
    try {
      const saved = localStorage.getItem('hydron_homepage_cms_v2');
      return saved ? JSON.parse(saved) : DEFAULT_HOMEPAGE_CONTENT;
    } catch {
      return DEFAULT_HOMEPAGE_CONTENT;
    }
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('hydron_settings_v2');
      return saved ? JSON.parse(saved) : DEFAULT_STORE_SETTINGS;
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  });

  const [cmsPages, setCmsPages] = useState<Record<string, CMSPage>>(() => {
    try {
      const saved = localStorage.getItem('hydron_cms_pages_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    const map: Record<string, CMSPage> = {};
    DEFAULT_CMS_PAGES.forEach(p => { map[p.slug] = p; });
    return map;
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cart State with LocalStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('hydron_cart_v2');
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
      localStorage.setItem('hydron_cart_v2', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_products_v2', JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_categories_v2', JSON.stringify(categories));
    } catch {}
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_reviews_v2', JSON.stringify(reviews));
    } catch {}
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_faqs_v2', JSON.stringify(faqs));
    } catch {}
  }, [faqs]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_homepage_cms_v2', JSON.stringify(homepageContent));
    } catch {}
  }, [homepageContent]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_settings_v2', JSON.stringify(storeSettings));
    } catch {}
  }, [storeSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_cms_pages_v2', JSON.stringify(cmsPages));
    } catch {}
  }, [cmsPages]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_orders_v2', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_enquiries_v2', JSON.stringify(enquiries));
    } catch {}
  }, [enquiries]);

  // Seed default data if database is fresh
  const autoSeedIfEmpty = async () => {
    if (hasSeededRef.current) return;
    try {
      const prodSnap = await getDocs(collection(db, 'products'));
      if (prodSnap.empty) {
        hasSeededRef.current = true;
        console.log('Seeding initial Hydron catalog to Firestore...');
        await seedInitialDataToFirestore();
      }
    } catch (e) {
      console.warn('Auto-seed check note:', e);
    }
  };

  // 1. Load / listen to Products in Real Time
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
        if (!snapshot.empty) {
          const items: Product[] = [];
          snapshot.forEach((d) => {
            items.push({ id: d.id, ...d.data() } as Product);
          });
          setProducts(items);
        } else {
          // If empty in database, trigger auto-seed once
          autoSeedIfEmpty();
        }
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
      console.warn('Enquiries listener setup notice:', e);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Cart operations
  const addToCart = (
    product: Product, 
    quantity = 1, 
    color?: ProductOptionColor, 
    capacity?: string
  ) => {
    const selectedColor = color || (product.colors && product.colors[0]) || { name: 'Standard', hex: '#000000' };
    const selectedCapacity = capacity || (product.capacities && product.capacities[0]) || 'Standard';

    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && 
                item.selectedColor.name === selectedColor.name && 
                item.selectedCapacity === selectedCapacity
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, selectedColor, selectedCapacity }];
      }
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
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // WhatsApp URL Builders
  const generateProductWhatsAppUrl = (
    product: Product, 
    quantity = 1, 
    color?: ProductOptionColor, 
    capacity?: string
  ) => {
    const num = storeSettings.whatsappNumber.replace(/[^0-9]/g, '') || '919876543210';
    const selColor = color ? color.name : (product.colors[0]?.name || 'Standard');
    const selCap = capacity || (product.capacities[0] || 'Standard');
    const total = product.price * quantity;
    const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/product/${product.slug}` : `https://hydronlife.com/product/${product.slug}`;

    const text = 
`*NEW ORDER ENQUIRY | HYDRON STORE*
────────────────────────
*Product:* ${product.name}
*Option / Color:* ${selColor}
*Capacity:* ${selCap}
*Unit Price:* ${storeSettings.currencySymbol}${product.price.toLocaleString('en-IN')}
*Quantity:* ${quantity}
*Total Amount:* ${storeSettings.currencySymbol}${total.toLocaleString('en-IN')}

*Product Link:* ${currentUrl}
────────────────────────
Hi Hydron Team! I would like to purchase this product. Please share the order confirmation and payment details.`;

    return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  };

  const generateCartWhatsAppUrl = (customerDetails?: { name?: string; address?: string; mobile?: string }) => {
    const num = storeSettings.whatsappNumber.replace(/[^0-9]/g, '') || '919876543210';
    const freeShipping = cartSubtotal >= storeSettings.freeShippingThreshold;
    const shipping = freeShipping ? 0 : storeSettings.flatShippingRate;
    const grandTotal = cartSubtotal + shipping;

    let itemsList = '';
    cartItems.forEach((item, index) => {
      const itemTotal = item.product.price * item.quantity;
      itemsList += `\n${index + 1}. *${item.product.name}*\n   • Color: ${item.selectedColor.name} | Size: ${item.selectedCapacity}\n   • Qty: ${item.quantity} × ${storeSettings.currencySymbol}${item.product.price} = *${storeSettings.currencySymbol}${itemTotal}*\n`;
    });

    let custInfo = '';
    if (customerDetails?.name) {
      custInfo = `\n*CUSTOMER DETAILS:*\n• Name: ${customerDetails.name}\n• Mobile: ${customerDetails.mobile || 'N/A'}\n• Delivery Address: ${customerDetails.address || 'N/A'}\n`;
    }

    const text = 
`*NEW CART ORDER | HYDRON PREMIUM STORE*
────────────────────────
*ITEMS ORDERED:*${itemsList}
────────────────────────
*Subtotal:* ${storeSettings.currencySymbol}${cartSubtotal.toLocaleString('en-IN')}
*Shipping:* ${freeShipping ? 'FREE' : `${storeSettings.currencySymbol}${shipping}`}
*Grand Total:* ${storeSettings.currencySymbol}${grandTotal.toLocaleString('en-IN')}${custInfo}
────────────────────────
Hi Hydron Team! I would like to place this order now. Please provide invoice and payment link/UPI!`;

    return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  };

  const createWhatsAppOrder = async (orderData: Partial<Order>): Promise<string> => {
    const orderNumber = `HYD-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: orderNumber,
      orderNumber,
      userId: currentUser?.uid || '',
      customerName: orderData.customerName || 'Guest Customer',
      customerEmail: orderData.customerEmail || 'guest@hydron.com',
      customerMobile: orderData.customerMobile || '',
      shippingAddress: orderData.shippingAddress || {
        street: '',
        city: '',
        state: '',
        pincode: '',
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
      orderNote: orderData.orderNote || '',
      createdAt: new Date().toISOString(),
    };

    // Save in Firestore orders collection & optimistic update
    try {
      const cleanOrder = sanitizeForFirestore(newOrder);
      await setDoc(doc(db, 'orders', orderNumber), cleanOrder);
    } catch (err) {
      console.warn('Order saved to local state:', err);
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

  const submitEnquiry = async (enquiry: Omit<LeadEnquiry, 'id' | 'createdAt' | 'status'>) => {
    const enquiryId = `ENQ-${Date.now()}`;
    const newDoc: LeadEnquiry = {
      ...enquiry,
      id: enquiryId,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };
    try {
      const cleanDoc = sanitizeForFirestore(newDoc);
      await setDoc(doc(db, 'enquiries', enquiryId), cleanDoc);
    } catch (err) {
      console.warn('Enquiry fallback:', err);
    }
    setEnquiries(prev => [newDoc, ...prev]);
  };

  const submitReview = async (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    const reviewId = `REV-${Date.now()}`;
    const newReview: Review = {
      ...review,
      id: reviewId,
      status: 'APPROVED',
      createdAt: new Date().toISOString()
    };
    try {
      const cleanRev = sanitizeForFirestore(newReview);
      await setDoc(doc(db, 'reviews', reviewId), cleanRev);
    } catch (err) {
      console.warn('Review save fallback:', err);
    }
    setReviews(prev => [newReview, ...prev]);
  };

  // Admin CMS & CRUD Functions (Persistent Real-Time Sync)
  const saveProduct = async (product: Product) => {
    const prodToSave = {
      ...product,
      updatedAt: new Date().toISOString()
    };

    // 1. Optimistic local state update
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = prodToSave;
        return copy;
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

  const deleteProduct = async (id: string) => {
    // 1. Optimistic local state update
    setProducts(prev => prev.filter(p => p.id !== id));

    // 2. Persistent Firestore Delete
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e: any) {
      console.warn('Product deleted from local storage (Firestore sync note):', e?.message || e);
    }
  };

  const saveCategory = async (cat: Category) => {
    setCategories(prev => {
      const idx = prev.findIndex(c => c.id === cat.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = cat;
        return copy;
      }
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

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (e: any) {
      console.warn('Category deleted from local storage (Firestore sync note):', e?.message || e);
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status'], courier?: string, trackingNum?: string) => {
    const updates: Partial<Order> = { status, updatedAt: new Date().toISOString() };
    if (courier !== undefined) updates.trackingCourier = courier;
    if (trackingNum !== undefined) updates.trackingNumber = trackingNum;

    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));

    try {
      const cleanUpdates = sanitizeForFirestore(updates);
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, cleanUpdates);
    } catch (e: any) {
      console.warn('Order updated in local storage (Firestore sync note):', e?.message || e);
    }
  };

  const deleteOrder = async (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    try {
      await deleteDoc(doc(db, 'orders', id));
    } catch (e: any) {
      console.warn('Order deleted from local storage (Firestore sync note):', e?.message || e);
    }
  };

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

  const saveFAQ = async (faq: FAQ) => {
    const faqId = faq.id || `faq-${Date.now()}`;
    const cleanFaq = { ...faq, id: faqId };

    setFaqs(prev => {
      const idx = prev.findIndex(f => f.id === faqId);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = cleanFaq;
        return copy;
      }
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

  // 1-Click Seed Data to Firestore
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
