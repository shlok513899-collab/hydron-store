export interface ProductOptionColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  shortDescription: string;
  description: string;
  images: string[];
  coverImage: string;
  badge?: 'BESTSELLER' | 'NEW' | 'LIMITED' | 'FEATURED' | 'SALE';
  inStock: boolean;
  stockCount?: number;
  sku?: string;
  rating: number;
  reviewCount: number;
  capacities: string[]; // e.g. ['500ml', '750ml', '1000ml']
  colors: ProductOptionColor[];
  specifications?: any;
  features?: string[];
  careInstructions?: string[];
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount?: number;
  displayOrder?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: ProductOptionColor;
  selectedCapacity: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  color: string;
  capacity: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: 'WHATSAPP_ORDER' | 'ONLINE' | 'COD';
  trackingNumber?: string;
  trackingCourier?: string;
  orderNote?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LeadEnquiry {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  subject: string;
  message: string;
  productId?: string;
  productName?: string;
  type: 'CONTACT_FORM' | 'PRODUCT_ENQUIRY' | 'NEWSLETTER' | 'CUSTOM_ORDER';
  status: 'NEW' | 'CONTACTED' | 'RESOLVED';
  createdAt: string;
}

export interface CustomerProfile {
  uid: string;
  name: string;
  email: string;
  mobile: string;
  role: 'customer' | 'admin';
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  totalOrders?: number;
  totalSpent?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  userName: string;
  userEmail?: string;
  rating: number;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  createdAt: string;
}

export interface HeroBadge {
  icon: string;
  label: string;
}

export interface ValueItem {
  icon: string;
  title: string;
  subtitle: string;
}

export interface HomepageContent {
  announcementText: string;
  announcementLinkText: string;
  showAnnouncement: boolean;
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroImageUrl: string;
  heroBadges: HeroBadge[];
  valueItems: ValueItem[];
  featuredBottlesTitle: string;
  featuredBottlesSubtitle: string;
  showcaseTitle: string;
  showcaseSubtitle: string;
  showcaseDescription: string;
  showcaseImageUrl: string;
  storyTitle: string;
  storyContent: string;
  storyImageUrl: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export type Enquiry = LeadEnquiry;

export interface CMSPageSection {
  heading: string;
  content: string;
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  lastUpdated?: string;
  content?: string;
  sections?: CMSPageSection[];
  images?: string[];
  meta?: Record<string, any>;
  faqs?: Array<{ question: string; answer: string; category?: string }>;
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  currencySymbol: string;
  currencyCode: string;
  whatsappNumber: string; // E.g. "+919876543210" or "919876543210"
  supportEmail: string;
  supportPhone: string;
  storeAddress: string;
  businessHours: string;
  freeShippingThreshold: number;
  flatShippingRate: number;
  instagramUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  facebookUrl?: string;
  linkedinUrl?: string;
}
