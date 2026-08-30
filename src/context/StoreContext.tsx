import React, { createContext, useContext, useEffect, useState } from 'react';
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
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
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
  updateEnquiryStatus: (id: string, status: LeadEnquiry['status']) => Promise<void>;
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

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('hydron_products');
      return saved ? JSON.parse(saved) : DEMO_PRODUCTS;
    } catch {
      return DEMO_PRODUCTS;
    }
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('hydron_categories');
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [enquiries, setEnquiries] = useState<LeadEnquiry[]>([]);
  const [reviews, setReviews] = useState<Review[]>(DEFAULT_REVIEWS);
  const [faqs, setFaqs] = useState<FAQ[]>(DEFAULT_FAQS);
  const [homepageContent, setHomepageContent] = useState<HomepageContent>(DEFAULT_HOMEPAGE_CONTENT);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [cmsPages, setCmsPages] = useState<Record<string, CMSPage>>(() => {
    const map: Record<string, CMSPage> = {};
    DEFAULT_CMS_PAGES.forEach(p => { map[p.slug] = p; });
    return map;
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cart State with LocalStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('hydron_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem('hydron_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('hydron_categories', JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to localStorage', e);
    }
  }, [categories]);

  // Load / listen to Products
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
        if (!snapshot.empty) {
          const items: Product[] = [];
          snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as Product);
          });
          setProducts(items);
        }
      }, (error) => {
        console.warn('Firestore products listener fallback to local data:', error.message);
      });
      return () => unsubscribe();
    } catch {
      // Keep local state
    }
  }, []);

  // Load / listen to Categories
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
        if (!snapshot.empty) {
          const items: Category[] = [];
          snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as Category);
          });
          setCategories(items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
        }
      }, (error) => {
        console.warn('Firestore categories listener fallback to local data:', error.message);
      });
      return () => unsubscribe();
    } catch {
      // Keep local state
    }
  }, []);

  // Load / listen to Reviews
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'reviews'), (snapshot) => {
        if (!snapshot.empty) {
          const items: Review[] = [];
          snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as Review);
          });
          setReviews(items);
        } else {
          setReviews(DEFAULT_REVIEWS);
        }
      }, (error) => {
        console.warn('Firestore reviews listener fallback:', error.message);
        setReviews(DEFAULT_REVIEWS);
      });
      return () => unsubscribe();
    } catch {
      setReviews(DEFAULT_REVIEWS);
    }
  }, []);

  // Load / listen to FAQs
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'faqs'), (snapshot) => {
        if (!snapshot.empty) {
          const items: FAQ[] = [];
          snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as FAQ);
          });
          setFaqs(items);
        } else {
          setFaqs(DEFAULT_FAQS);
        }
      }, (error) => {
        console.warn('Firestore faqs listener fallback:', error.message);
        setFaqs(DEFAULT_FAQS);
      });
      return () => unsubscribe();
    } catch {
      setFaqs(DEFAULT_FAQS);
    }
  }, []);

  // Load Store Settings and Homepage CMS
  useEffect(() => {
    try {
      const unsubSettings = onSnapshot(doc(db, 'store_settings', 'general'), (snap) => {
        if (snap.exists()) {
          setStoreSettings({ ...DEFAULT_STORE_SETTINGS, ...snap.data() } as StoreSettings);
        }
      }, () => {});

      const unsubCMS = onSnapshot(doc(db, 'store_settings', 'homepage_cms'), (snap) => {
        if (snap.exists()) {
          setHomepageContent({ ...DEFAULT_HOMEPAGE_CONTENT, ...snap.data() } as HomepageContent);
        }
      }, () => {});

      const unsubPages = onSnapshot(collection(db, 'cms_pages'), (snap) => {
        if (!snap.empty) {
          const pagesMap: Record<string, CMSPage> = {};
          DEFAULT_CMS_PAGES.forEach(p => { pagesMap[p.slug] = p; });
          snap.forEach((d) => {
            const page = { id: d.id, ...d.data() } as CMSPage;
            if (page.slug) pagesMap[page.slug] = page;
          });
          setCmsPages(pagesMap);
        }
      }, () => {});

      setIsLoading(false);
      return () => {
        unsubSettings();
        unsubCMS();
        unsubPages();
      };
    } catch {
      setIsLoading(false);
    }
  }, []);

  // Load Orders (for Admin or Authenticated User)
  useEffect(() => {
    if (!currentUser && !isAdmin) {
      setOrders([]);
      return;
    }

    try {
      const ordersCol = collection(db, 'orders');
      const q = isAdmin 
        ? query(ordersCol, orderBy('createdAt', 'desc'))
        : query(ordersCol, where('userId', '==', currentUser?.uid || ''));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items: Order[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(items);
      }, (err) => {
        console.warn('Orders query permission or offline:', err.message);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Orders fetching error:', e);
    }
  }, [currentUser, isAdmin]);

  // Load Enquiries (Admin only)
  useEffect(() => {
    if (!isAdmin) {
      setEnquiries([]);
      return;
    }

    try {
      const unsubscribe = onSnapshot(collection(db, 'enquiries'), (snapshot) => {
        const items: LeadEnquiry[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as LeadEnquiry);
        });
        setEnquiries(items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }, (err) => {
        console.warn('Enquiries fetching error:', err.message);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Enquiries listener error:', e);
    }
  }, [isAdmin]);

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

    // Save in Firestore orders collection
    try {
      await setDoc(doc(db, 'orders', orderNumber), newOrder);
    } catch (err) {
      console.warn('Could not write order to Firestore, will still open WhatsApp:', err);
    }

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
      await setDoc(doc(db, 'enquiries', enquiryId), newDoc);
    } catch (err) {
      console.warn('Enquiry logged locally or Firestore offline', err);
    }
  };

  const submitReview = async (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    const reviewId = `REV-${Date.now()}`;
    const newReview: Review = {
      ...review,
      id: reviewId,
      status: 'APPROVED', // auto approve for immediate feedback or admin can moderate
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'reviews', reviewId), newReview);
      setReviews(prev => [newReview, ...prev]);
    } catch (err) {
      setReviews(prev => [newReview, ...prev]);
    }
  };

  // Admin CMS Functions
  const saveProduct = async (product: Product) => {
    try {
      const prodRef = doc(db, 'products', product.id);
      await setDoc(prodRef, {
        ...product,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Error saving product to Firestore:', e);
    }
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = product;
        return copy;
      }
      return [product, ...prev];
    });
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.warn('Error deleting from Firestore:', e);
    }
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const saveCategory = async (cat: Category) => {
    try {
      const catRef = doc(db, 'categories', cat.id);
      await setDoc(catRef, cat);
    } catch (e) {
      console.warn('Error saving category to Firestore:', e);
    }
    setCategories(prev => {
      const idx = prev.findIndex(c => c.id === cat.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = cat;
        return copy;
      }
      return [...prev, cat];
    });
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (e) {
      console.warn('Error deleting category from Firestore:', e);
    }
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const updateOrderStatus = async (id: string, status: Order['status'], courier?: string, trackingNum?: string) => {
    const orderRef = doc(db, 'orders', id);
    const updates: Partial<Order> = { status, updatedAt: new Date().toISOString() };
    if (courier) updates.trackingCourier = courier;
    if (trackingNum) updates.trackingNumber = trackingNum;

    try {
      await updateDoc(orderRef, updates);
    } catch (e) {
      console.warn('Error updating order:', e);
    }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const updateEnquiryStatus = async (id: string, status: LeadEnquiry['status']) => {
    const enqRef = doc(db, 'enquiries', id);
    try {
      await updateDoc(enqRef, { status });
    } catch (e) {
      console.warn('Error updating enquiry:', e);
    }
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  const updateReviewStatus = async (id: string, status: Review['status']) => {
    const revRef = doc(db, 'reviews', id);
    try {
      await updateDoc(revRef, { status });
    } catch (e) {
      console.warn('Error updating review:', e);
    }
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const deleteReview = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (e) {
      console.warn('Error deleting review:', e);
    }
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const saveFAQ = async (faq: FAQ) => {
    const faqId = faq.id || `faq-${Date.now()}`;
    const cleanFaq = { ...faq, id: faqId };
    try {
      await setDoc(doc(db, 'faqs', faqId), cleanFaq);
    } catch (e) {
      console.warn('Error saving FAQ:', e);
    }
    setFaqs(prev => {
      const idx = prev.findIndex(f => f.id === faqId);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = cleanFaq;
        return copy;
      }
      return [...prev, cleanFaq];
    });
  };

  const deleteFAQ = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'faqs', id));
    } catch (e) {
      console.warn('Error deleting FAQ:', e);
    }
    setFaqs(prev => prev.filter(f => f.id !== id));
  };

  const saveHomepageContent = async (content: HomepageContent) => {
    try {
      const ref = doc(db, 'store_settings', 'homepage_cms');
      await setDoc(ref, content);
    } catch (e) {
      console.warn('Error saving homepage content to Firestore:', e);
    }
    setHomepageContent(content);
  };

  const saveStoreSettings = async (settings: StoreSettings) => {
    try {
      const ref = doc(db, 'store_settings', 'general');
      await setDoc(ref, settings);
    } catch (e) {
      console.warn('Error saving store settings to Firestore:', e);
    }
    setStoreSettings(settings);
  };

  const saveCMSPage = async (page: CMSPage) => {
    try {
      const ref = doc(db, 'cms_pages', page.slug);
      await setDoc(ref, page);
    } catch (e) {
      console.warn('Error saving CMS page to Firestore:', e);
    }
    setCmsPages(prev => ({ ...prev, [page.slug]: page }));
  };

  // 1-Click Seed Data to Firestore
  const seedInitialDataToFirestore = async () => {
    try {
      // 1. Seed store settings
      await setDoc(doc(db, 'store_settings', 'general'), DEFAULT_STORE_SETTINGS);
      await setDoc(doc(db, 'store_settings', 'homepage_cms'), DEFAULT_HOMEPAGE_CONTENT);

      // 2. Seed products
      for (const prod of DEMO_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }

      // 3. Seed categories
      for (const cat of DEFAULT_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }

      // 4. Seed reviews
      for (const rev of DEFAULT_REVIEWS) {
        await setDoc(doc(db, 'reviews', rev.id), rev);
      }

      // 5. Seed FAQs
      for (const faq of DEFAULT_FAQS) {
        await setDoc(doc(db, 'faqs', faq.id), faq);
      }

      // 6. Seed CMS pages
      for (const page of DEFAULT_CMS_PAGES) {
        await setDoc(doc(db, 'cms_pages', page.slug), page);
      }

      console.log('Successfully seeded pristine Hydron catalog & CMS to Firestore!');
    } catch (error) {
      console.error('Error seeding data:', error);
      throw error;
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
        updateEnquiryStatus,
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
