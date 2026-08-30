import { Category, CMSPage, FAQ, HomepageContent, Product, Review, StoreSettings } from '../types';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'HYDRON',
  storeTagline: 'Water Bottles Built For Life.',
  currencySymbol: '₹',
  currencyCode: 'INR',
  whatsappNumber: '919876543210',
  supportEmail: 'care@hydronlife.com',
  supportPhone: '+91 98765 43210',
  storeAddress: 'Hydron Innovation Studio, DLF Cyber City, Sector 24, Gurugram, Haryana 122002, India',
  businessHours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
  freeShippingThreshold: 999,
  flatShippingRate: 99,
  instagramUrl: 'https://instagram.com/hydronlife',
  twitterUrl: 'https://twitter.com/hydronlife',
  youtubeUrl: 'https://youtube.com/@hydronlife',
  facebookUrl: 'https://facebook.com/hydronlife',
  linkedinUrl: 'https://linkedin.com/company/hydron-life',
};

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-insulated',
    name: 'Insulated Series',
    slug: 'insulated-series',
    description: 'Triple-wall vacuum sealed 18/8 stainless steel flasks keeping drinks ice cold for 24h and piping hot for 12h.',
    image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=800&q=80',
    itemCount: 4,
    displayOrder: 1,
  },
  {
    id: 'cat-tumblers',
    name: 'Tumblers & Travel',
    slug: 'tumblers-travel',
    description: 'Sleek ergonomic tumblers with ceramic-shield interiors and splash-proof magnetic slider lids for daily commutes.',
    image: 'https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&w=800&q=80',
    itemCount: 2,
    displayOrder: 2,
  },
  {
    id: 'cat-titanium',
    name: 'Titanium & Ultra-Light',
    slug: 'titanium-ultralight',
    description: 'Aerospace-grade Grade 1 Titanium vessels engineered for peak performance expeditions and featherlight EDC.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    itemCount: 2,
    displayOrder: 3,
  },
  {
    id: 'cat-gym',
    name: 'Active & Sport',
    slug: 'active-sport',
    description: 'High-flow silicone spout lids with durable paracord handles built for intense gym routines and outdoor treks.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    itemCount: 2,
    displayOrder: 4,
  },
];

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'hydron-onyx-flask',
    name: 'Hydron Onyx Pro Vacuum Flask',
    slug: 'hydron-onyx-pro-vacuum-flask',
    category: 'Insulated Series',
    price: 1499,
    compareAtPrice: 1999,
    shortDescription: 'Our flagship matte-black thermal vessel engineered with TempLock™ triple-wall insulation.',
    description: 'The Hydron Onyx Pro is designed from food-grade 18/8 pro-grade stainless steel with our proprietary TempLock™ copper-core vacuum barrier. It guarantees up to 24 hours of glacial chill and 12 hours of steaming heat. The rugged ultra-matte textured powder coat resists abrasions, condensation, and sweat, while the ergonomic integrated flex-carry handle makes everyday hydration effortless.',
    coverImage: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85',
    ],
    badge: 'BESTSELLER',
    inStock: true,
    stockCount: 48,
    sku: 'HYD-ONX-750',
    rating: 4.9,
    reviewCount: 128,
    capacities: ['500ml', '750ml', '1000ml'],
    colors: [
      { name: 'Matte Onyx', hex: '#18181b', image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Arctic Chalk', hex: '#f4f4f5', image: 'https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Gunmetal Slate', hex: '#52525b', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85' },
    ],
    specifications: [
      { label: 'Material', value: '18/8 Pro-Grade Stainless Steel' },
      { label: 'Insulation', value: 'TempLock™ Triple-Wall Copper Core' },
      { label: 'Cold Retention', value: 'Up to 24 Hours' },
      { label: 'Hot Retention', value: 'Up to 12 Hours' },
      { label: 'Coating', value: 'HydroShield™ Scratch-Resistant Matte Powder' },
      { label: 'Cap Type', value: '100% Leak-Proof Stainless Steel Flex Handle Cap' },
      { label: 'BPA Status', value: '100% BPA, BPS & Phthalate-Free' },
      { label: 'Warranty', value: '2-Year Hydron Craftsmanship Warranty' },
    ],
    features: [
      'TempLock™ triple-wall vacuum insulation with inner copper lining',
      'Zero exterior condensation or sweat build-up',
      '18/8 pro-grade stainless steel ensures zero flavor transfer',
      'Wide mouth opening accommodates standard ice cubes and easy brush cleaning',
      'Heavy-duty silicone gasket leak-proof guarantee',
    ],
    careInstructions: [
      'Hand wash with warm soapy water and bottle brush recommended',
      'Lid is top-rack dishwasher safe',
      'Do not place bottle in freezer or microwave',
    ],
    isFeatured: true,
  },
  {
    id: 'hydron-apex-commuter',
    name: 'Hydron Apex Commuter Tumbler',
    slug: 'hydron-apex-commuter-tumbler',
    category: 'Tumblers & Travel',
    price: 1299,
    compareAtPrice: 1699,
    shortDescription: 'Ceramic-lined travel tumbler with splash-proof magnetic slider lid designed for vehicle cup holders.',
    description: 'Engineered for metropolitan professionals, the Hydron Apex Commuter blends the pure taste of ceramic with the indestructible toughness of stainless steel. Features a TrueTaste™ ceramic interior coating that protects the nuanced aromas of specialty espresso and cold brew, paired with a tapered base that fits standard car cup holders seamlessly.',
    coverImage: 'https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=1000&q=85',
    ],
    badge: 'NEW',
    inStock: true,
    stockCount: 35,
    sku: 'HYD-APX-500',
    rating: 4.8,
    reviewCount: 84,
    capacities: ['500ml', '650ml'],
    colors: [
      { name: 'Matte Onyx', hex: '#18181b', image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Desert Sand', hex: '#d4d4d8', image: 'https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Arctic Chalk', hex: '#fafafa', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85' },
    ],
    specifications: [
      { label: 'Material', value: 'Double-wall 18/8 Steel + Pure Ceramic Core' },
      { label: 'Cold Retention', value: 'Up to 18 Hours' },
      { label: 'Hot Retention', value: 'Up to 8 Hours' },
      { label: 'Lid Type', value: 'Magnetic Slider Splash-Resistant Cap' },
      { label: 'Cup Holder Friendly', value: 'Yes (Tapered 70mm Base)' },
      { label: 'Warranty', value: '2-Year Craftsmanship Warranty' },
    ],
    features: [
      'TrueTaste™ ceramic interior prevents metallic aftertaste',
      'Effortless slide-to-sip magnetic lid mechanism',
      'Tapered slim base fits standard car cup holders',
      'Comfort-grip textured matte exterior',
    ],
    isFeatured: true,
  },
  {
    id: 'hydron-titanium-zenith',
    name: 'Hydron Zenith Grade-1 Titanium Flask',
    slug: 'hydron-zenith-titanium-flask',
    category: 'Titanium & Ultra-Light',
    price: 3499,
    compareAtPrice: 4499,
    shortDescription: 'Aerospace-grade Grade 1 pure titanium flask. Ultra-light, biocompatible and corrosion-proof.',
    description: 'The pinnacle of materials engineering. Crafted from 99.8% pure medical Grade 1 Titanium, the Hydron Zenith weighs 45% less than stainless steel while delivering extreme structural rigidity. Naturally biocompatible and non-reactive with acids, citrus, carbonated water, and single malts.',
    coverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=85',
    ],
    badge: 'LIMITED',
    inStock: true,
    stockCount: 14,
    sku: 'HYD-TI-600',
    rating: 5.0,
    reviewCount: 42,
    capacities: ['600ml', '800ml'],
    colors: [
      { name: 'Raw Sandblasted Titanium', hex: '#71717a', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Black Oxide Titanium', hex: '#09090b', image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1000&q=85' },
    ],
    specifications: [
      { label: 'Material', value: '99.8% Medical-Grade 1 Titanium' },
      { label: 'Weight', value: 'Only 185 grams (Featherlight)' },
      { label: 'Insulation', value: 'Double-Wall Micro Vacuum Chamber' },
      { label: 'Corrosion Resistance', value: 'Immune to Saltwater, Citrus, Alcohol' },
      { label: 'Warranty', value: 'Lifetime Guarantee' },
    ],
    features: [
      'Featherlight weight for long treks and alpine climbs',
      'Zero taste interference across coffee, electrolyte mixes and spirits',
      'Laser-etched numbered edition marking',
      'Solid CNC-machined titanium cap with silicone seal',
    ],
    isFeatured: true,
  },
  {
    id: 'hydron-tactical-canteen',
    name: 'Hydron Tactical Expedition Flask',
    slug: 'hydron-tactical-expedition-flask',
    category: 'Active & Sport',
    price: 1899,
    compareAtPrice: 2299,
    shortDescription: 'Heavy-duty 1000ml adventure flask with rugged silicone bumper and dual-port spout cap.',
    description: 'Built for rigorous outdoor demands, trail running, and gym sessions. The Tactical Expedition flask features a reinforced 1.0mm heavy-gauge steel shell, shock-absorbing silicone base bumper, and our dual-port SportSpout™ cap for rapid one-handed chug or sipping.',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&w=1000&q=85',
    ],
    badge: 'BESTSELLER',
    inStock: true,
    stockCount: 60,
    sku: 'HYD-TAC-1000',
    rating: 4.9,
    reviewCount: 95,
    capacities: ['1000ml', '1200ml'],
    colors: [
      { name: 'Matte Stealth Black', hex: '#18181b', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Granite Slate', hex: '#3f3f46', image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1000&q=85' },
    ],
    specifications: [
      { label: 'Capacity', value: '1000ml / 1200ml' },
      { label: 'Material', value: 'Extra Thick 1.0mm 18/8 Stainless Steel' },
      { label: 'Cold Retention', value: 'Up to 30 Hours with Ice' },
      { label: 'Base Guard', value: 'Removable High-Density Silicone Bumper' },
      { label: 'Warranty', value: '2-Year Warranty' },
    ],
    features: [
      'High-velocity chug spout with magnetic lock flap',
      'Removable base boot prevents dents and eliminates clinking on desks',
      'Reinforced paracord-braided carry strap',
      '30-hour extreme cold retention with wide ice chute',
    ],
    isFeatured: true,
  },
  {
    id: 'hydron-minimalist-matte-white',
    name: 'Hydron Arctic Pure Thermal Bottle',
    slug: 'hydron-arctic-pure-thermal-bottle',
    category: 'Insulated Series',
    price: 1399,
    compareAtPrice: 1799,
    shortDescription: 'Monochromatic architectural white finish with fingerprint-resistant ceramic-powder coating.',
    description: 'Clean, sculptural, and functional. The Arctic Pure series pairs crisp architectural minimalism with rigorous thermal performance. Every contour is precision-balanced to rest comfortably in hand, whether in the boardroom or yoga studio.',
    coverImage: 'https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85',
    ],
    badge: 'NEW',
    inStock: true,
    stockCount: 22,
    sku: 'HYD-ARC-500',
    rating: 4.8,
    reviewCount: 56,
    capacities: ['500ml', '750ml'],
    colors: [
      { name: 'Arctic Chalk', hex: '#fafafa', image: 'https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Matte Onyx', hex: '#18181b', image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1000&q=85' },
    ],
    specifications: [
      { label: 'Material', value: 'Food-Grade 18/8 Stainless Steel' },
      { label: 'Finish', value: 'Ultra-Fine Architectural Ceramic Powder' },
      { label: 'Cold Retention', value: '24 Hours' },
      { label: 'Hot Retention', value: '12 Hours' },
      { label: 'Warranty', value: '2-Year Warranty' },
    ],
    features: [
      'Seamless laser-welded body with zero rough interior seams',
      'Odor and stain resistant electropolished interior',
      'Minimalist flush stainless steel loop cap',
    ],
    isFeatured: false,
  },
  {
    id: 'hydron-studio-shaker',
    name: 'Hydron Studio Silent Shaker',
    slug: 'hydron-studio-silent-shaker',
    category: 'Active & Sport',
    price: 1599,
    compareAtPrice: 2099,
    shortDescription: 'Whisper-quiet curved base shaker with internal stainless aerator mesh. Zero clumps, zero noise.',
    description: 'Say goodbye to loud plastic shaker balls. The Hydron Studio Silent Shaker uses a fluid-dynamic dome base and an integrated laser-cut stainless mixing grid to blend whey, collagen, and greens into a smooth, frothy shake in seconds without rattling noise.',
    coverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=1000&q=85',
    ],
    badge: 'FEATURED',
    inStock: true,
    stockCount: 40,
    sku: 'HYD-SHK-700',
    rating: 4.9,
    reviewCount: 71,
    capacities: ['700ml'],
    colors: [
      { name: 'Matte Onyx', hex: '#18181b' },
      { name: 'Carbon Gray', hex: '#3f3f46' },
    ],
    specifications: [
      { label: 'Capacity', value: '700ml (With Internal Measuring Lines)' },
      { label: 'Material', value: 'Pro-Grade 18/8 Stainless Steel' },
      { label: 'Mixing Tech', value: 'Laser-Cut Fluid Dynamic Agitator Mesh' },
      { label: 'Lid Lock', value: 'Snap-Tight Leakproof Silicone Seal' },
      { label: 'Warranty', value: '2-Year Warranty' },
    ],
    features: [
      'Silent vortex dissolution without rattling balls',
      'Laser-etched ml/oz fill indicators inside the vessel',
      'Wide spout for easy drinking on workout floors',
      'Rounded interior base prevents protein residue buildup in corners',
    ],
    isFeatured: true,
  },
];

export const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  announcementText: 'FREE SHIPPING ON ORDERS ABOVE ₹999 | 10% OFF ON FIRST ORDER',
  announcementLinkText: 'USE CODE: HYDRON10',
  showAnnouncement: true,
  heroEyebrow: 'HYDRATE. PERFORM. REPEAT.',
  heroHeadline: 'WATER BOTTLES BUILT FOR LIFE.',
  heroSubheadline: 'Premium quality. Sleek design. All-day hydration for every pursuit.',
  heroCtaText: 'EXPLORE COLLECTION',
  heroCtaLink: '/shop',
  heroImageUrl: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1200&q=85',
  heroBadges: [
    { icon: 'ShieldCheck', label: 'PREMIUM QUALITY' },
    { icon: 'Leaf', label: 'BPA FREE & SAFE' },
    { icon: 'Snowflake', label: '24H COLD / 12H HOT' },
  ],
  valueItems: [
    {
      icon: 'Award',
      title: 'PREMIUM MATERIALS',
      subtitle: '18/8 Pro-Grade Stainless Steel & Grade 1 Titanium',
    },
    {
      icon: 'Thermometer',
      title: 'TEMPERATURE LOCK TECHNOLOGY',
      subtitle: 'Triple-wall copper barrier maintains ideal temps',
    },
    {
      icon: 'Droplet',
      title: 'LEAK PROOF DESIGN',
      subtitle: 'Precision silicone seals tested under high pressure',
    },
    {
      icon: 'Hand',
      title: 'EASY TO CARRY ANYWHERE',
      subtitle: 'Ergonomic loop handles & cup-holder friendly base',
    },
  ],
  featuredBottlesTitle: 'FLAGSHIP HYDRON VESSELS',
  featuredBottlesSubtitle: 'Engineered with relentless attention to detail, thermal precision, and tactile minimalism.',
  showcaseTitle: 'ENGINEERED FOR EXTREME DURABILITY',
  showcaseSubtitle: 'TempLock™ Triple-Wall Technology',
  showcaseDescription: 'Between the two layers of 18/8 pro-grade stainless steel lies an airtight vacuum chamber enhanced with an inner reflective copper layer. This prevents thermal radiation, ensuring your cold brew stays chilled for 24 hours and herbal tea remains piping hot for 12 hours.',
  showcaseImageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85',
  storyTitle: 'THE HYDRON PHILOSOPHY',
  storyContent: 'We started Hydron with a singular mandate: to purge single-use plastic from everyday life through uncompromising design and architectural durability. Every bottle we build is intended to accompany you for decades—from daily city commutes to remote summit trails.',
  storyImageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=85',
};

export const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'hydron-onyx-flask',
    productName: 'Hydron Onyx Pro Vacuum Flask',
    userName: 'Aarav Malhotra',
    rating: 5,
    title: 'Keeps ice frozen for over 24 hours in Delhi heat',
    comment: 'I put ice cubes and cold water at 7 AM before heading to the office and the gym. Even at 10 PM, the ice was intact. The matte black finish feels substantial and looks incredible on my desk.',
    verifiedBuyer: true,
    status: 'APPROVED',
    createdAt: '2026-08-15T10:30:00.000Z',
  },
  {
    id: 'rev-2',
    productId: 'hydron-apex-commuter',
    productName: 'Hydron Apex Commuter Tumbler',
    userName: 'Rhea Sen',
    rating: 5,
    title: 'The ceramic interior makes coffee taste pure',
    comment: 'Most steel mugs leave an unpleasant metallic tang with black coffee. The ceramic lining on this tumbler solved that completely. Plus, it fits my car cup holder smoothly.',
    verifiedBuyer: true,
    status: 'APPROVED',
    createdAt: '2026-08-20T14:15:00.000Z',
  },
  {
    id: 'rev-3',
    productId: 'hydron-tactical-canteen',
    productName: 'Hydron Tactical Expedition Flask',
    userName: 'Vikramaditya Rana',
    rating: 5,
    title: 'Indestructible on Himalayan treks',
    comment: 'Took this on a 6-day trek in Ladakh. Survived drops on sharp rocks with just minor surface dust. The silicone boot is a great touch. High quality craftsmanship.',
    verifiedBuyer: true,
    status: 'APPROVED',
    createdAt: '2026-08-22T09:45:00.000Z',
  },
];

export const DEFAULT_CMS_PAGES: CMSPage[] = [
  {
    id: 'page-about',
    slug: 'about-us',
    title: 'About Hydron',
    eyebrow: 'THE HYDRON MANIFESTO',
    subtitle: 'Pursuing the apex of hydration hardware through engineering and refined minimalism.',
    lastUpdated: 'August 2026',
    content: `
      <h2>The Hydron Mission</h2>
      <p>Hydron was founded on the principle that everyday tools should possess the structural integrity of aerospace hardware and the refined restraint of minimalist modern design.</p>
      <p>We craft high-performance reusable drinkware that elevates your daily hydration rituals while eliminating reliance on disposable plastic containers.</p>
      
      <h2>Precision Engineering</h2>
      <p>Every Hydron vessel begins with medical and food-grade 18/8 Pro-Grade Stainless Steel or aerospace Grade 1 Titanium. We utilize advanced laser welding and dual-chamber copper vacuum sealing to deliver unprecedented thermal efficiency.</p>
      
      <h2>Sustainability by Longevity</h2>
      <p>True sustainability is not built on disposable eco-gimmicks. It is built on products so durable and timeless that you never need to replace them. A single Hydron bottle prevents thousands of single-use bottles from polluting oceans and landfills over its lifetime.</p>
    `,
    images: [
      'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'page-faq',
    slug: 'faq',
    title: 'Frequently Asked Questions',
    eyebrow: 'HELP & KNOWLEDGE BASE',
    subtitle: 'Everything you need to know about Hydron products, care, shipping, and warranty.',
    lastUpdated: 'August 2026',
    content: 'Answers to the most common questions regarding our hydration gear and ordering.',
    faqs: [
      {
        question: 'How long do Hydron bottles keep water cold or hot?',
        answer: 'Our TempLock™ triple-wall vacuum bottles maintain chilled temperatures for up to 24 hours (with ice lasting over 30 hours) and keep hot beverages piping hot for up to 12 hours.',
        category: 'Performance',
      },
      {
        question: 'How does ordering via WhatsApp work?',
        answer: 'When you click "Buy Now via WhatsApp" on any product or cart, our system instantly opens WhatsApp with a pre-formatted message detailing your selected model, color, capacity, quantity, total price, and product link. Our support team will confirm your order details and provide instant payment / delivery updates.',
        category: 'Ordering & WhatsApp',
      },
      {
        question: 'Are Hydron bottles BPA-free and safe?',
        answer: 'Yes, 100%. All Hydron products are certified free from BPA, BPS, lead, phthalates, and harmful chemicals. The inner surface is electropolished food-grade 18/8 stainless steel that will never leach flavors or odors.',
        category: 'Materials & Safety',
      },
      {
        question: 'How do I clean and care for my Hydron bottle?',
        answer: 'We recommend hand washing your bottle with warm water, mild soap, and a soft bottle brush. Do not put the flask body in the microwave, freezer, or oven. The lids and silicone gaskets are top-rack dishwasher safe.',
        category: 'Care & Cleaning',
      },
      {
        question: 'What is your shipping timeframe?',
        answer: 'Orders placed before 2 PM are dispatched on the same business day. Metro deliveries arrive in 2-3 business days, and other regions within 3-6 business days.',
        category: 'Shipping & Delivery',
      },
      {
        question: 'What does the Hydron 2-Year Warranty cover?',
        answer: 'Our warranty covers loss of thermal insulation vacuum seal, defective caps, broken handles, or factory craftsmanship flaws. It does not cover normal cosmetic scratches or dents from drops.',
        category: 'Warranty & Care',
      },
      {
        question: 'What is your Return, Refund & RTO policy?',
        answer: 'To guarantee strict food-grade sterile hygiene for every customer, Hydron enforces a strict No Return, No Refund, and No RTO (Return to Origin) policy once orders are dispatched. All sales are final. In the rare event of transit damage, an uncut unboxing video submitted within 24 hours of delivery qualifies for an immediate factory replacement unit.',
        category: 'Warranty & Care',
      },
    ],
  },
  {
    id: 'page-contact',
    slug: 'contact-us',
    title: 'Contact & Concierge',
    eyebrow: 'ALWAYS AT YOUR SERVICE',
    subtitle: 'Have a question about sizing, custom corporate laser engraving, or order status? Our concierge team is here to assist.',
    lastUpdated: 'August 2026',
    content: `
      <h2>Direct Customer Concierge</h2>
      <p>We believe in fast, human-centric support. Connect directly with our studio specialists via WhatsApp or email for immediate assistance with orders, customized corporate gifting, and product inquiries.</p>
    `,
  },
  {
    id: 'page-shop',
    slug: 'shop',
    title: 'The Hydron Catalog',
    eyebrow: 'FULL COLLECTION',
    subtitle: 'Explore our complete roster of vacuum flasks, insulated travel tumblers, and ultralight titanium vessels.',
    lastUpdated: 'August 2026',
    content: 'Discover engineered thermal drinkware designed for every pursuit.',
  },
  {
    id: 'page-collections',
    slug: 'collections',
    title: 'Curated Categories',
    eyebrow: 'SERIES & PURSUITS',
    subtitle: 'Vessels tailored for high-output training, urban transit, and alpine exploration.',
    lastUpdated: 'August 2026',
    content: 'Browse our specialized category lineups.',
  },
  {
    id: 'page-shipping',
    slug: 'shipping-policy',
    title: 'Shipping & Delivery Policy',
    eyebrow: 'FULFILLMENT DETAILS',
    subtitle: 'Transparent dispatch timelines, free shipping thresholds, and real-time courier tracking.',
    lastUpdated: 'August 2026',
    content: `
      <h2>Order Processing & Same-Day Dispatch</h2>
      <p>All orders placed before 2:00 PM IST (Monday through Saturday) are dispatched on the same business day from our central warehouse. Orders placed on Sundays or public holidays are dispatched on the following business day.</p>
      
      <h2>Shipping Rates & Free Shipping</h2>
      <p>We offer <strong>FREE Standard Shipping</strong> on all domestic orders above ₹999. For orders below ₹999, a flat delivery fee of ₹99 is applied at checkout.</p>
      
      <h2>Estimated Delivery Timelines</h2>
      <ul>
        <li><strong>Tier 1 Metros (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata):</strong> 2 to 3 Business Days</li>
        <li><strong>Rest of India:</strong> 3 to 6 Business Days</li>
        <li><strong>Remote / North East Regions:</strong> 5 to 8 Business Days</li>
      </ul>
      
      <h2>Real-Time Tracking</h2>
      <p>Once your order is shipped, you will receive an SMS and WhatsApp notification containing your airway bill (AWB) tracking number and direct courier tracking link.</p>
    `,
  },
  {
    id: 'page-returns',
    slug: 'returns-exchange',
    title: 'No Return, Refund & RTO Policy',
    eyebrow: 'HYGIENE & DISPATCH PROTOCOLS',
    subtitle: 'To maintain pristine food-grade sterile hygiene, all Hydron drinkware sales are final with zero return/RTO acceptance.',
    lastUpdated: 'August 2026',
    content: `
      <h2>1. Uncompromising Hygiene & Food Safety Mandate</h2>
      <p>Due to the personal oral contact nature of thermal flasks and tumblers, Hydron does not accept returns, refunds, or exchanges for change of mind or personal preference once an order has been confirmed and dispatched. All sales are final.</p>
      
      <h2>2. Zero RTO (Return to Origin) Acceptance</h2>
      <p>To eliminate logistical waste and keep product prices competitive, customer cancellations upon arrival, doorstep refusals, or unauthorized return shipments marked as RTO are strictly non-refundable.</p>
      
      <h2>3. In-Transit Damage Replacement (Unboxing Video Required)</h2>
      <p>If your package arrives visibly crushed, dented, or defective, notify our WhatsApp Concierge at <strong>+91 98765 43210</strong> within 24 hours of delivery with a continuous, uncut unboxing video showing the shipping label and the defect. Verified transit defects receive an immediate direct replacement at zero cost.</p>

      <h2>4. 2-Year TempShield™ Craftsmanship Warranty</h2>
      <p>Every bottle is covered by our 2-Year warranty against vacuum insulation breakdown and factory craftsmanship flaws.</p>
    `,
  },
  {
    id: 'page-warranty',
    slug: 'warranty-care',
    title: '2-Year Warranty & Care Guide',
    eyebrow: 'BUILT FOR LIFE',
    subtitle: 'Our craftsmanship commitment and guidelines to keep your vessel performing for decades.',
    lastUpdated: 'August 2026',
    content: `
      <h2>2-Year TempShield Craftsmanship Guarantee</h2>
      <p>Every Hydron stainless steel and titanium bottle is backed by our comprehensive 2-Year Warranty covering vacuum insulation integrity and manufacturer defects.</p>
      
      <h2>What is Covered</h2>
      <ul>
        <li>Loss of thermal insulation performance (bottle feeling hot on the exterior when filled with hot liquids).</li>
        <li>Defective cap threading, seals, or leak-proof silicone gaskets.</li>
        <li>Welding or manufacturing structural defects.</li>
      </ul>
      
      <h2>Recommended Daily Care</h2>
      <ul>
        <li>Hand wash bottle body with warm water, mild soap, and a soft bottle brush.</li>
        <li>Do not place stainless steel or titanium flasks in the microwave, freezer, or oven.</li>
        <li>Caps and silicone gaskets are top-rack dishwasher safe.</li>
      </ul>
    `,
  },
  {
    id: 'page-privacy',
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    eyebrow: 'YOUR TRUST & DATA',
    subtitle: 'How Hydron protects and handles your personal information with strict confidentiality.',
    lastUpdated: 'August 2026',
    content: `
      <h2>Data Protection Commitment</h2>
      <p>At Hydron, we strictly respect your privacy. We collect only the information necessary to fulfill your orders, provide customer support via WhatsApp or email, and improve your shopping experience.</p>
      
      <h2>Information We Collect</h2>
      <p>When you place an order, register an account, or contact us, we collect your name, email address, mobile phone number, and delivery address. We never sell, rent, or trade your personal information to third-party advertisers or data brokers.</p>
      
      <h2>Secure Authentication & Storage</h2>
      <p>User accounts are secured with Firebase Authentication industry-standard encryption protocols. Passwords and credentials are never stored in plain text or accessible to store staff.</p>
      
      <h2>Contact Us Regarding Privacy</h2>
      <p>For any questions or data deletion requests, email privacy@hydronlife.com.</p>
    `,
  },
  {
    id: 'page-terms',
    slug: 'terms-of-service',
    title: 'Terms of Service',
    eyebrow: 'LEGAL TERMS',
    subtitle: 'Legal agreement, checkout conditions, and usage policies.',
    lastUpdated: 'August 2026',
    content: `
      <h2>Agreement to Terms</h2>
      <p>By accessing the Hydron website or purchasing any Hydron product, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
      
      <h2>Product Pricing & Accuracy</h2>
      <p>All prices are quoted in Indian Rupees (INR) and are inclusive of applicable GST taxes. We strive for exact accuracy in product descriptions and specifications; however, we reserve the right to correct typographical errors or stock discrepancies.</p>
      
      <h2>Limitation of Liability</h2>
      <p>Hydron products are designed for beverage containment. We are not liable for damages resulting from improper usage, unauthorized modifications, or placement in freezing or microwave appliances.</p>
    `,
  },
];

export const DEFAULT_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How long do Hydron bottles keep water cold or hot?',
    answer: 'Our TempLock™ triple-wall vacuum bottles maintain chilled temperatures for up to 24 hours (with ice lasting over 30 hours) and keep hot beverages piping hot for up to 12 hours.',
    category: 'Insulation',
  },
  {
    id: 'faq-2',
    question: 'How does ordering via WhatsApp work?',
    answer: 'When you click "Buy Now via WhatsApp" on any product or cart, our system instantly opens WhatsApp with a pre-formatted message detailing your selected model, color, capacity, quantity, total price, and product link. Our support team will confirm your order details and provide instant payment / delivery updates.',
    category: 'Ordering',
  },
  {
    id: 'faq-3',
    question: 'Are Hydron bottles BPA-free and safe?',
    answer: 'Yes, 100%. All Hydron products are certified free from BPA, BPS, lead, phthalates, and harmful chemicals. The inner surface is electropolished food-grade 18/8 stainless steel that will never leach flavors or odors.',
    category: 'Materials',
  },
  {
    id: 'faq-4',
    question: 'How do I clean and care for my Hydron bottle?',
    answer: 'We recommend hand washing your bottle with warm water, mild soap, and a soft bottle brush. Do not put the flask body in the microwave, freezer, or oven. The lids and silicone gaskets are top-rack dishwasher safe.',
    category: 'Care',
  },
  {
    id: 'faq-5',
    question: 'What is your shipping timeframe?',
    answer: 'Orders are processed within 24 hours. Metro deliveries typically arrive within 2-4 business days, while other regions take 4-6 business days. Express tracking numbers are provided upon dispatch.',
    category: 'Shipping',
  },
  {
    id: 'faq-6',
    question: 'What is the Hydron Warranty policy?',
    answer: 'All Hydron stainless steel and titanium bottles come with our 2-Year Craftsmanship Guarantee covering thermal insulation performance and manufacturer defects.',
    category: 'Warranty',
  },
];

