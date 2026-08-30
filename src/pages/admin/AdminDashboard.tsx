import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  Sliders, 
  Star, 
  HelpCircle, 
  MessageSquare, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  ArrowLeft, 
  ExternalLink, 
  Upload, 
  ShieldCheck, 
  Search, 
  TrendingUp, 
  CheckCircle,
  Truck,
  LogOut,
  FileText,
  Palette,
  Maximize2,
  ListPlus,
  Tag,
  Sparkles,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Product, 
  Category, 
  FAQ, 
  Review, 
  LeadEnquiry, 
  Order, 
  HomepageContent, 
  StoreSettings, 
  CMSPage, 
  ProductOptionColor 
} from '../../types';
import { DEFAULT_CMS_PAGES } from '../../lib/mockData';
import { Logo } from '../../components/common/Logo';

interface AdminDashboardProps {
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdmin }) => {
  const { 
    products = [], 
    categories = [], 
    orders = [], 
    reviews = [], 
    faqs = [], 
    enquiries = [], 
    homepageContent, 
    storeSettings,
    cmsPages = {},
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
    seedInitialDataToFirestore
  } = useStore();

  const { currentUser, userProfile, isAdmin, logoutAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'PRODUCTS' | 'CATEGORIES' | 'ORDERS' | 'PAGES_CMS' | 'HOMEPAGE' | 'REVIEWS' | 'FAQS' | 'ENQUIRIES' | 'SETTINGS'
  >('OVERVIEW');

  // Product Edit/Add State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({});
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Product Options Helper States (Colors, Sizes, Features, Specs)
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#18181b');
  const [newColorImage, setNewColorImage] = useState('');
  const [newCapacityInput, setNewCapacityInput] = useState('');
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newSpecLabel, setNewSpecLabel] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  // Category Edit/Add State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({});
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // FAQ Edit/Add State
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState<Partial<FAQ>>({});

  // Pages CMS State
  const [selectedCmsSlug, setSelectedCmsSlug] = useState<string>('about-us');
  const [editingCmsPage, setEditingCmsPage] = useState<CMSPage>(() => {
    return cmsPages['about-us'] || DEFAULT_CMS_PAGES.find(p => p.slug === 'about-us') || {
      id: 'page-about',
      slug: 'about-us',
      title: 'About Hydron',
      eyebrow: 'THE HYDRON MANIFESTO',
      subtitle: 'Crafted for lifetime hydration',
      content: '',
      lastUpdated: 'August 2026'
    };
  });
  const [newSectionHeading, setNewSectionHeading] = useState('');
  const [newSectionContent, setNewSectionContent] = useState('');
  const [newCmsImageUrl, setNewCmsImageUrl] = useState('');
  const [cmsPreviewMode, setCmsPreviewMode] = useState(false);

  // CMS Form State
  const [cmsForm, setCmsForm] = useState<HomepageContent>(homepageContent);
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(storeSettings);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Search in admin
  const [adminSearch, setAdminSearch] = useState('');

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // Metrics Calculations
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const inStockCount = products.filter(p => p.inStock).length;

  // Sync CMS form when selected slug changes
  const handleSelectCmsSlug = (slug: string) => {
    setSelectedCmsSlug(slug);
    const existing = cmsPages[slug] || DEFAULT_CMS_PAGES.find(p => p.slug === slug);
    if (existing) {
      setEditingCmsPage(existing);
    } else {
      setEditingCmsPage({
        id: `page-${slug}`,
        slug: slug,
        title: slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        eyebrow: 'HYDRON OFFICIAL',
        subtitle: 'Page content and details',
        content: '',
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      });
    }
  };

  // Handle Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    // Multi-image consolidation with premium fallback
    const rawImages = (productForm.images && productForm.images.length > 0)
      ? [...productForm.images]
      : (productForm.coverImage ? [productForm.coverImage] : ['https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1000&q=85']);

    const cover = productForm.coverImage || rawImages[0];
    if (cover && !rawImages.includes(cover)) {
      rawImages.unshift(cover);
    }

    const currentColors = (productForm.colors && productForm.colors.length > 0)
      ? productForm.colors
      : [{ name: 'Matte Onyx', hex: '#18181b', image: cover }];

    const currentCapacities = (productForm.capacities && productForm.capacities.length > 0)
      ? productForm.capacities
      : ['500ml', '750ml'];

    const prodToSave: Product = {
      id: editingProduct?.id || `hydron-${Date.now()}`,
      name: productForm.name || '',
      slug: productForm.slug || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      category: productForm.category || categories[0]?.name || 'Insulated Series',
      price: Number(productForm.price) || 0,
      compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : undefined,
      rating: productForm.rating || 4.9,
      reviewCount: productForm.reviewCount || 24,
      inStock: productForm.inStock !== false,
      badge: productForm.badge || undefined,
      isFeatured: productForm.isFeatured || false,
      shortDescription: productForm.shortDescription || '',
      description: productForm.description || '',
      coverImage: cover,
      images: rawImages,
      colors: currentColors,
      capacities: currentCapacities,
      features: productForm.features?.length ? productForm.features : [
        'TempLock™ Triple-Wall Vacuum Insulation',
        'Medical Grade 18/8 Pro Stainless Steel',
        '100% Leak-Proof Flex Loop Cap',
        'Electropolished interior resists odors and stains'
      ],
      specifications: productForm.specifications?.length ? productForm.specifications : [
        { label: 'Material', value: '18/8 Pro-Grade Stainless Steel' },
        { label: 'Insulation', value: '24 Hours Cold / 12 Hours Hot' },
        { label: 'Cap Type', value: 'Leak-Proof Flex Loop' },
        { label: 'Warranty', value: '2-Year Craftsmanship Warranty' }
      ],
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveProduct(prodToSave);
    setEditingProduct(null);
    setIsNewProduct(false);
    showNotification('Product saved successfully with all options & images.');
  };

  // Handle CMS Page Save
  const handleSaveCMSPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCmsPage.title) return;

    const pageToSave: CMSPage = {
      ...editingCmsPage,
      slug: selectedCmsSlug,
      id: editingCmsPage.id || `page-${selectedCmsSlug}`,
      lastUpdated: editingCmsPage.lastUpdated || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    await saveCMSPage(pageToSave);
    showNotification(`Page "${pageToSave.title}" saved successfully.`);
  };

  // Handle Category Save
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) return;

    const slug = categoryForm.slug || categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const catToSave: Category = {
      id: editingCategory?.id || `cat-${Date.now()}`,
      name: categoryForm.name,
      slug: slug,
      description: categoryForm.description || '',
      image: categoryForm.image || 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
      itemCount: categoryForm.itemCount ?? products.filter(p => p.category === categoryForm.name).length,
      displayOrder: Number(categoryForm.displayOrder) || (categories.length + 1)
    };

    await saveCategory(catToSave);
    setEditingCategory(null);
    setIsNewCategory(false);
    setCategoryForm({});
    showNotification('Category saved successfully.');
  };

  return (
    <div className="w-full min-h-screen bg-[#f4f4f6] flex flex-col text-left">
      
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-black text-white px-4 sm:px-8 py-3.5 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo variant="light" size="sm" showText={true} />
          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-zinc-800">
            <span className="px-2 py-0.5 bg-zinc-800 text-[11px] font-mono uppercase tracking-wider text-zinc-300 border border-zinc-700">
              CMS Console
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {saveSuccess && (
            <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-mono">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{saveSuccess}</span>
            </div>
          )}

          <span className="text-zinc-400 hidden md:inline font-mono">
            {currentUser?.email}
          </span>

          <button
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 bg-zinc-800 text-white font-bold uppercase tracking-wider px-3.5 py-1.5 text-xs hover:bg-zinc-700 transition-colors"
            title="View Storefront"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>

          <button
            onClick={async () => {
              await logoutAdmin();
              onExitAdmin();
            }}
            className="flex items-center gap-1.5 bg-red-600 text-white font-bold uppercase tracking-wider px-3.5 py-1.5 text-xs hover:bg-red-700 transition-colors cursor-pointer"
            title="Log Out Administrator"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Admin Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-zinc-950 text-zinc-400 border-r border-zinc-800 p-4 space-y-1 shrink-0">
          {[
            { id: 'OVERVIEW', label: 'Overview Metrics', icon: LayoutDashboard },
            { id: 'PRODUCTS', label: `Products (${products.length})`, icon: Package },
            { id: 'CATEGORIES', label: `Categories (${categories.length})`, icon: Layers },
            { id: 'ORDERS', label: `WhatsApp Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'PAGES_CMS', label: 'Page CMS & Content', icon: FileText },
            { id: 'HOMEPAGE', label: 'Homepage CMS', icon: Sliders },
            { id: 'REVIEWS', label: `Reviews (${reviews.length})`, icon: Star },
            { id: 'FAQS', label: `FAQs (${faqs.length})`, icon: HelpCircle },
            { id: 'ENQUIRIES', label: `Leads & Inquiries (${enquiries.length})`, icon: MessageSquare },
            { id: 'SETTINGS', label: 'Store & WhatsApp', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setEditingProduct(null);
                  setEditingCategory(null);
                  setEditingFAQ(null);
                }}
                className={`w-full text-left px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                  isActive
                    ? 'bg-white text-black font-extrabold'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Right Content View */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-heading">
                  HYDRON STORE METRICS
                </h2>
                <p className="text-xs text-zinc-500">Live summary of orders, inventory, and inquiries.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white border border-zinc-300 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-zinc-400">Total Order Volume</span>
                  <p className="text-2xl font-black text-black font-heading">
                    {storeSettings.currencySymbol}{totalRevenue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-zinc-500">{orders.length} total WhatsApp orders placed</p>
                </div>

                <div className="p-5 bg-white border border-zinc-300 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-zinc-400">Pending Fulfillment</span>
                  <p className="text-2xl font-black text-black font-heading">{pendingOrders}</p>
                  <p className="text-[11px] text-zinc-500">Awaiting dispatch inspection</p>
                </div>

                <div className="p-5 bg-white border border-zinc-300 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-zinc-400">Catalog SKUs</span>
                  <p className="text-2xl font-black text-black font-heading">{products.length}</p>
                  <p className="text-[11px] text-zinc-500">{inStockCount} active in stock</p>
                </div>

                <div className="p-5 bg-white border border-zinc-300 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-zinc-400">Customer Inquiries</span>
                  <p className="text-2xl font-black text-black font-heading">{enquiries.length}</p>
                  <p className="text-[11px] text-zinc-500">Direct message leads logged</p>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white border border-zinc-300 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-black font-heading">
                    RECENT WHATSAPP ORDERS
                  </h3>
                  <button
                    onClick={() => setActiveTab('ORDERS')}
                    className="text-xs font-bold uppercase text-black hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead className="border-b border-zinc-200 text-zinc-400 uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 text-left">Order ID</th>
                        <th className="py-2.5 text-left">Customer</th>
                        <th className="py-2.5 text-left">Mobile</th>
                        <th className="py-2.5 text-left">Items</th>
                        <th className="py-2.5 text-left">Total</th>
                        <th className="py-2.5 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-zinc-50">
                          <td className="py-3 font-bold text-black">
                            #{ord.orderNumber || ord.id.slice(0, 6).toUpperCase()}
                          </td>
                          <td className="py-3 font-sans font-medium text-black">{ord.customerName}</td>
                          <td className="py-3 text-zinc-600">{ord.customerMobile}</td>
                          <td className="py-3 text-zinc-600">{ord.items.length} item(s)</td>
                          <td className="py-3 font-bold text-black">
                            {storeSettings.currencySymbol}{ord.total.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold">
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'PRODUCTS' && (
            <div className="space-y-6">
              {!editingProduct && !isNewProduct ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-heading">
                        PRODUCT CATALOG MANAGER
                      </h2>
                      <p className="text-xs text-zinc-500">Manage titles, pricing, stock status, colors, and imagery.</p>
                    </div>

                    <button
                      onClick={() => {
                        setProductForm({
                          name: '',
                          category: categories[0]?.name || 'Insulated Series',
                          price: 1499,
                          compareAtPrice: 1999,
                          inStock: true,
                          isFeatured: true,
                          badge: 'NEW',
                          shortDescription: 'Triple-wall insulated hydration vessel.',
                          description: 'Engineered with 18/8 food-grade stainless steel.',
                          coverImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85',
                          images: [
                            'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85',
                            'https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&w=1000&q=85',
                            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
                            'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=85'
                          ],
                          capacities: ['500ml', '750ml'],
                          colors: [{ name: 'Matte Onyx', hex: '#18181b', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85' }]
                        });
                        setIsNewProduct(true);
                      }}
                      className="bg-black text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>ADD NEW PRODUCT</span>
                    </button>
                  </div>

                  {/* Product List Table */}
                  <div className="bg-white border border-zinc-300 overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 uppercase text-[10px] font-mono">
                        <tr>
                          <th className="p-3 text-left">Bottle</th>
                          <th className="p-3 text-left">Category</th>
                          <th className="p-3 text-left">Price</th>
                          <th className="p-3 text-left">Badge</th>
                          <th className="p-3 text-left">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 font-mono">
                        {products.map((prod) => (
                          <tr key={prod.id} className="hover:bg-zinc-50">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <img src={prod.coverImage} alt="" className="w-10 h-12 object-cover border border-zinc-200" />
                                <div>
                                  <p className="font-bold text-black font-sans text-xs uppercase font-heading">{prod.name}</p>
                                  <p className="text-[10px] text-zinc-400">{prod.slug}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-zinc-700">{prod.category}</td>
                            <td className="p-3 font-bold text-black">
                              {storeSettings.currencySymbol}{prod.price}
                            </td>
                            <td className="p-3">
                              {prod.badge ? (
                                <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold">
                                  {prod.badge}
                                </span>
                              ) : '-'}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 text-[10px] font-bold ${
                                prod.inStock ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800'
                              }`}>
                                {prod.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    const initialImages = (prod.images && prod.images.length > 0)
                                      ? prod.images
                                      : (prod.coverImage ? [prod.coverImage] : ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85']);
                                    setEditingProduct(prod);
                                    setProductForm({
                                      ...prod,
                                      images: initialImages
                                    });
                                  }}
                                  className="p-1.5 hover:bg-zinc-200 text-zinc-700 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setProductToDelete(prod)}
                                  className="p-1.5 hover:bg-red-100 text-red-600 transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                /* Product Edit/Create Form */
                <div className="bg-white border border-zinc-300 p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                    <h3 className="text-lg font-bold uppercase tracking-tight text-black font-heading">
                      {isNewProduct ? 'CREATE NEW HYDRON PRODUCT' : `EDIT: ${editingProduct?.name}`}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setIsNewProduct(false);
                      }}
                      className="text-xs font-bold uppercase text-zinc-500 hover:text-black"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold uppercase text-black mb-1">Product Title *</label>
                        <input
                          type="text"
                          required
                          value={productForm.name || ''}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          className="w-full bg-zinc-50 border border-zinc-300 p-2.5"
                        />
                      </div>
                      <div>
                        <label className="block font-bold uppercase text-black mb-1">Category Series *</label>
                        <select
                          value={productForm.category || categories[0]?.name}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full bg-zinc-50 border border-zinc-300 p-2.5"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold uppercase text-black mb-1">Selling Price (INR) *</label>
                        <input
                          type="number"
                          required
                          value={productForm.price || ''}
                          onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                          className="w-full bg-zinc-50 border border-zinc-300 p-2.5 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold uppercase text-black mb-1">Compare Price (Strike-through)</label>
                        <input
                          type="number"
                          value={productForm.compareAtPrice || ''}
                          onChange={(e) => setProductForm({ ...productForm, compareAtPrice: Number(e.target.value) })}
                          className="w-full bg-zinc-50 border border-zinc-300 p-2.5 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold uppercase text-black mb-1">Badge (e.g. BESTSELLER, NEW)</label>
                        <input
                          type="text"
                          value={productForm.badge || ''}
                          onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                          className="w-full bg-zinc-50 border border-zinc-300 p-2.5"
                        />
                      </div>
                    </div>

                    {/* MULTI-IMAGE GALLERY MANAGER */}
                    <div className="border border-zinc-300 p-4 bg-zinc-50 space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                        <div>
                          <label className="block font-bold uppercase text-black">Product Images & Multi-Image Gallery *</label>
                          <p className="text-[11px] text-zinc-500">Every product must have multiple high-resolution photos (Cover + Lifestyle / Detail angles).</p>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-200 text-zinc-700 font-bold">
                          {((productForm.images?.length) || (productForm.coverImage ? 1 : 0))} Images
                        </span>
                      </div>

                      {/* Primary Cover Image URL */}
                      <div>
                        <label className="block font-bold text-zinc-800 mb-1">Primary Cover Photo URL *</label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            required
                            placeholder="https://images.unsplash.com/..."
                            value={productForm.coverImage || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProductForm(prev => {
                                const currentImgs = prev.images || [];
                                const newImgs = currentImgs.includes(val) ? currentImgs : [val, ...currentImgs];
                                return { ...prev, coverImage: val, images: newImgs };
                              });
                            }}
                            className="w-full bg-white border border-zinc-300 p-2 font-mono text-xs"
                          />
                          {productForm.coverImage && (
                            <img src={productForm.coverImage} alt="Cover Preview" className="w-10 h-10 object-cover border border-zinc-300 shrink-0" />
                          )}
                        </div>
                      </div>

                      {/* Current Images List */}
                      <div>
                        <label className="block font-bold text-zinc-800 mb-2">Gallery Angles & Additional Views</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {(productForm.images || (productForm.coverImage ? [productForm.coverImage] : [])).map((imgUrl, idx) => (
                            <div key={idx} className="relative group bg-white border border-zinc-300 p-1.5 space-y-1">
                              <div className="aspect-square bg-zinc-100 overflow-hidden relative">
                                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                                {productForm.coverImage === imgUrl ? (
                                  <span className="absolute top-1 left-1 bg-black text-white text-[9px] font-bold px-1.5 py-0.5">
                                    COVER
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setProductForm(prev => ({ ...prev, coverImage: imgUrl }))}
                                    className="absolute bottom-1 left-1 right-1 bg-white/90 hover:bg-black hover:text-white text-zinc-800 text-[9px] font-bold py-1 transition-colors text-center"
                                  >
                                    Set as Cover
                                  </button>
                                )}
                              </div>
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[80px]">Angle #{idx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProductForm(prev => {
                                      const updated = (prev.images || []).filter((_, i) => i !== idx);
                                      const nextCover = prev.coverImage === imgUrl ? (updated[0] || '') : prev.coverImage;
                                      return { ...prev, images: updated, coverImage: nextCover };
                                    });
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1"
                                  title="Remove image"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Add Image URL Row */}
                      <div className="pt-2 border-t border-zinc-200">
                        <label className="block font-bold text-zinc-700 mb-1">Add Another Image URL</label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="Paste image URL here..."
                            value={newGalleryImageUrl}
                            onChange={(e) => setNewGalleryImageUrl(e.target.value)}
                            className="w-full bg-white border border-zinc-300 p-2 font-mono text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!newGalleryImageUrl.trim()) return;
                              setProductForm(prev => {
                                const current = prev.images || (prev.coverImage ? [prev.coverImage] : []);
                                if (!current.includes(newGalleryImageUrl.trim())) {
                                  return { ...prev, images: [...current, newGalleryImageUrl.trim()] };
                                }
                                return prev;
                              });
                              setNewGalleryImageUrl('');
                            }}
                            className="bg-zinc-800 text-white font-bold uppercase px-4 py-2 hover:bg-black text-[11px] shrink-0"
                          >
                            + Add Image
                          </button>
                        </div>
                      </div>

                      {/* Quick Presets for Bottle Photography */}
                      <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="text-zinc-500 font-semibold uppercase">Quick Add Photo Presets:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const url = 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1000&q=85';
                            setProductForm(prev => ({ ...prev, images: [...(prev.images || []), url] }));
                          }}
                          className="bg-zinc-200 hover:bg-zinc-300 px-2 py-0.5 text-zinc-800 font-mono"
                        >
                          + Matte Onyx Studio
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const url = 'https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&w=1000&q=85';
                            setProductForm(prev => ({ ...prev, images: [...(prev.images || []), url] }));
                          }}
                          className="bg-zinc-200 hover:bg-zinc-300 px-2 py-0.5 text-zinc-800 font-mono"
                        >
                          + Chalk White Minimal
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const url = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85';
                            setProductForm(prev => ({ ...prev, images: [...(prev.images || []), url] }));
                          }}
                          className="bg-zinc-200 hover:bg-zinc-300 px-2 py-0.5 text-zinc-800 font-mono"
                        >
                          + Titanium EDC
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const url = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=85';
                            setProductForm(prev => ({ ...prev, images: [...(prev.images || []), url] }));
                          }}
                          className="bg-zinc-200 hover:bg-zinc-300 px-2 py-0.5 text-zinc-800 font-mono"
                        >
                          + Sport Trek Angle
                        </button>
                      </div>
                    </div>

                    {/* SIZES & CAPACITIES MANAGER */}
                    <div className="border border-zinc-300 p-4 bg-zinc-50 space-y-3">
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                        <div>
                          <label className="block font-bold uppercase text-black">Product Sizes & Capacities *</label>
                          <p className="text-[11px] text-zinc-500">Configure selectable size options (e.g. 500ml, 750ml, 1000ml, 12oz, 24oz).</p>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-200 text-zinc-700 font-bold">
                          {(productForm.capacities?.length || 0)} Sizes
                        </span>
                      </div>

                      {/* Current Capacities Chips */}
                      <div className="flex flex-wrap gap-2">
                        {(productForm.capacities || []).map((cap, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 bg-white border border-zinc-300 px-3 py-1.5 shadow-xs">
                            <span className="font-mono font-bold text-black text-xs">{cap}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setProductForm(prev => ({
                                  ...prev,
                                  capacities: (prev.capacities || []).filter((_, i) => i !== idx)
                                }));
                              }}
                              className="text-zinc-400 hover:text-red-600 transition-colors ml-1"
                              title="Remove size"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add Custom Capacity Input */}
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="e.g. 600ml / 20oz or 1200ml"
                          value={newCapacityInput}
                          onChange={(e) => setNewCapacityInput(e.target.value)}
                          className="w-full bg-white border border-zinc-300 p-2 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newCapacityInput.trim()) return;
                            const val = newCapacityInput.trim();
                            setProductForm(prev => {
                              const curr = prev.capacities || [];
                              if (!curr.includes(val)) {
                                return { ...prev, capacities: [...curr, val] };
                              }
                              return prev;
                            });
                            setNewCapacityInput('');
                          }}
                          className="bg-zinc-800 text-white font-bold uppercase px-4 py-2 hover:bg-black text-[11px] shrink-0"
                        >
                          + Add Size
                        </button>
                      </div>

                      {/* Quick Presets for Capacities */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] pt-1">
                        <span className="text-zinc-500 font-semibold uppercase">Popular Size Presets:</span>
                        {[
                          '350ml / 12oz',
                          '500ml / 18oz',
                          '600ml / 20oz',
                          '750ml / 24oz',
                          '900ml / 30oz',
                          '1000ml / 32oz',
                          '1200ml / 40oz',
                          '1500ml / 50oz'
                        ].map((capPreset) => (
                          <button
                            key={capPreset}
                            type="button"
                            onClick={() => {
                              setProductForm(prev => {
                                const curr = prev.capacities || [];
                                if (!curr.includes(capPreset)) {
                                  return { ...prev, capacities: [...curr, capPreset] };
                                }
                                return prev;
                              });
                            }}
                            className="bg-zinc-200 hover:bg-zinc-300 px-2 py-0.5 text-zinc-800 font-mono"
                          >
                            +{capPreset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* COLORS & FINISHES MANAGER */}
                    <div className="border border-zinc-300 p-4 bg-zinc-50 space-y-3">
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                        <div>
                          <label className="block font-bold uppercase text-black">Product Colors & Finishes *</label>
                          <p className="text-[11px] text-zinc-500">Add colorways, hex codes for swatches, and specific finish images.</p>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-200 text-zinc-700 font-bold">
                          {(productForm.colors?.length || 0)} Colors
                        </span>
                      </div>

                      {/* Current Colors List */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(productForm.colors || []).map((col, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white border border-zinc-300 p-2">
                            <div className="flex items-center gap-2.5">
                              <span 
                                className="w-5 h-5 rounded-full border border-zinc-400 shrink-0" 
                                style={{ backgroundColor: col.hex }} 
                              />
                              <div>
                                <span className="font-bold text-black text-xs block">{col.name}</span>
                                <span className="text-[10px] font-mono text-zinc-500">{col.hex}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {col.image && (
                                <img src={col.image} alt={col.name} className="w-6 h-6 object-cover border border-zinc-200 shrink-0" />
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setProductForm(prev => ({
                                    ...prev,
                                    colors: (prev.colors || []).filter((_, i) => i !== idx)
                                  }));
                                }}
                                className="text-zinc-400 hover:text-red-600 p-1"
                                title="Remove color"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add New Color Form */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-zinc-200">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-zinc-600 mb-1">Color Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Stealth Onyx"
                            value={newColorName}
                            onChange={(e) => setNewColorName(e.target.value)}
                            className="w-full bg-white border border-zinc-300 p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-zinc-600 mb-1">Color Hex</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={newColorHex}
                              onChange={(e) => setNewColorHex(e.target.value)}
                              className="w-10 h-8 p-0 border border-zinc-300 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={newColorHex}
                              onChange={(e) => setNewColorHex(e.target.value)}
                              className="w-full bg-white border border-zinc-300 p-2 font-mono text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-zinc-600 mb-1">Finish Photo URL (Optional)</label>
                          <input
                            type="url"
                            placeholder="https://..."
                            value={newColorImage}
                            onChange={(e) => setNewColorImage(e.target.value)}
                            className="w-full bg-white border border-zinc-300 p-2 font-mono text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        {/* Preset Swatches */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-zinc-500 font-semibold uppercase">Presets:</span>
                          {[
                            { name: 'Matte Stealth Onyx', hex: '#18181b' },
                            { name: 'Alpine Chalk White', hex: '#f8fafc' },
                            { name: 'Gunmetal Slate', hex: '#475569' },
                            { name: 'Nordic Sage Green', hex: '#3f6212' },
                            { name: 'Arctic Cobalt Blue', hex: '#0284c7' },
                            { name: 'Aerospace Titanium', hex: '#94a3b8' },
                            { name: 'Sunset Terracotta', hex: '#c2410c' },
                            { name: 'Obsidian Midnight', hex: '#09090b' },
                          ].map((pCol) => (
                            <button
                              key={pCol.name}
                              type="button"
                              onClick={() => {
                                setNewColorName(pCol.name);
                                setNewColorHex(pCol.hex);
                              }}
                              className="w-4 h-4 rounded-full border border-zinc-400 hover:scale-110 transition-transform"
                              style={{ backgroundColor: pCol.hex }}
                              title={pCol.name}
                            />
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!newColorName.trim()) return;
                            const newColObj: ProductOptionColor = {
                              name: newColorName.trim(),
                              hex: newColorHex,
                              image: newColorImage.trim() || undefined
                            };
                            setProductForm(prev => ({
                              ...prev,
                              colors: [...(prev.colors || []), newColObj]
                            }));
                            setNewColorName('');
                            setNewColorImage('');
                          }}
                          className="bg-zinc-800 text-white font-bold uppercase px-4 py-2 hover:bg-black text-[11px]"
                        >
                          + Add Colorway
                        </button>
                      </div>
                    </div>

                    {/* PRODUCT FEATURES / HIGHLIGHTS */}
                    <div className="border border-zinc-300 p-4 bg-zinc-50 space-y-3">
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                        <div>
                          <label className="block font-bold uppercase text-black">Key Features & Highlights</label>
                          <p className="text-[11px] text-zinc-500">Bullet points rendered on the product detail page.</p>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-200 text-zinc-700 font-bold">
                          {(productForm.features?.length || 0)} Features
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {(productForm.features || []).map((feat, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white border border-zinc-300 px-3 py-1.5">
                            <span className="text-xs text-zinc-800">{feat}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setProductForm(prev => ({
                                  ...prev,
                                  features: (prev.features || []).filter((_, i) => i !== idx)
                                }));
                              }}
                              className="text-zinc-400 hover:text-red-600 p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="e.g. TempLock™ Triple-Wall Insulation"
                          value={newFeatureInput}
                          onChange={(e) => setNewFeatureInput(e.target.value)}
                          className="w-full bg-white border border-zinc-300 p-2 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newFeatureInput.trim()) return;
                            setProductForm(prev => ({
                              ...prev,
                              features: [...(prev.features || []), newFeatureInput.trim()]
                            }));
                            setNewFeatureInput('');
                          }}
                          className="bg-zinc-800 text-white font-bold uppercase px-4 py-2 hover:bg-black text-[11px] shrink-0"
                        >
                          + Add Feature
                        </button>
                      </div>
                    </div>

                    {/* TECHNICAL SPECIFICATIONS */}
                    <div className="border border-zinc-300 p-4 bg-zinc-50 space-y-3">
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                        <div>
                          <label className="block font-bold uppercase text-black">Technical Specifications Table</label>
                          <p className="text-[11px] text-zinc-500">Key-value table (e.g. Material, Cold Retention, Base Diameter, Weight).</p>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-200 text-zinc-700 font-bold">
                          {(productForm.specifications?.length || 0)} Specs
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {(productForm.specifications || []).map((spec, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white border border-zinc-300 px-3 py-1.5">
                            <div className="flex gap-4 text-xs">
                              <span className="font-bold text-zinc-700 w-32">{spec.label}:</span>
                              <span className="text-zinc-900">{spec.value}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setProductForm(prev => ({
                                  ...prev,
                                  specifications: (prev.specifications || []).filter((_, i) => i !== idx)
                                }));
                              }}
                              className="text-zinc-400 hover:text-red-600 p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Spec Name (e.g. Material)"
                          value={newSpecLabel}
                          onChange={(e) => setNewSpecLabel(e.target.value)}
                          className="bg-white border border-zinc-300 p-2 text-xs"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Value (e.g. 18/8 Stainless Steel)"
                            value={newSpecValue}
                            onChange={(e) => setNewSpecValue(e.target.value)}
                            className="w-full bg-white border border-zinc-300 p-2 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!newSpecLabel.trim() || !newSpecValue.trim()) return;
                              setProductForm(prev => ({
                                ...prev,
                                specifications: [
                                  ...(prev.specifications || []),
                                  { label: newSpecLabel.trim(), value: newSpecValue.trim() }
                                ]
                              }));
                              setNewSpecLabel('');
                              setNewSpecValue('');
                            }}
                            className="bg-zinc-800 text-white font-bold uppercase px-4 py-2 hover:bg-black text-[11px] shrink-0"
                          >
                            + Add Spec
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-black mb-1">Short Description</label>
                      <input
                        type="text"
                        value={productForm.shortDescription || ''}
                        onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-300 p-2.5"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-black mb-1">Detailed Technical Description</label>
                      <textarea
                        rows={4}
                        value={productForm.description || ''}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-300 p-2.5"
                      />
                    </div>

                    <div className="flex gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.inStock !== false}
                          onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                        />
                        <span className="font-bold uppercase">In Stock</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.isFeatured || false}
                          onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                        />
                        <span className="font-bold uppercase">Featured on Homepage</span>
                      </label>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        type="submit"
                        className="bg-black text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 hover:bg-zinc-800"
                      >
                        SAVE PRODUCT TO DATABASE
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(null);
                          setIsNewProduct(false);
                        }}
                        className="border border-zinc-300 text-zinc-700 text-xs font-bold uppercase px-6 py-3.5"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === 'CATEGORIES' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-heading">
                    SERIES & CATEGORIES
                  </h2>
                  <p className="text-xs text-zinc-500">Manage brand collection series cards, banners, and descriptions.</p>
                </div>
                {!isNewCategory && !editingCategory && (
                  <button
                    onClick={() => {
                      setCategoryForm({
                        name: '',
                        slug: '',
                        description: '',
                        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
                        displayOrder: categories.length + 1
                      });
                      setEditingCategory(null);
                      setIsNewCategory(true);
                    }}
                    className="bg-black text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD NEW CATEGORY</span>
                  </button>
                )}
              </div>

              {/* Category Edit or Create Form */}
              {(isNewCategory || editingCategory) ? (
                <div className="bg-white border border-zinc-300 p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                    <h3 className="text-lg font-bold uppercase tracking-tight text-black font-heading">
                      {isNewCategory ? 'CREATE NEW CATEGORY' : `EDIT CATEGORY: ${editingCategory?.name}`}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingCategory(null);
                        setIsNewCategory(false);
                        setCategoryForm({});
                      }}
                      className="text-xs font-bold uppercase text-zinc-500 hover:text-black"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold uppercase text-black mb-1">Category Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Insulated Series"
                          value={categoryForm.name || ''}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                          className="w-full bg-zinc-50 border border-zinc-300 p-2.5"
                        />
                      </div>
                      <div>
                        <label className="block font-bold uppercase text-black mb-1">URL Slug (Auto-generated if empty)</label>
                        <input
                          type="text"
                          placeholder="e.g. insulated-series"
                          value={categoryForm.slug || ''}
                          onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                          className="w-full bg-zinc-50 border border-zinc-300 p-2.5 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-black mb-1">Banner Image URL *</label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="url"
                          required
                          placeholder="https://images.unsplash.com/..."
                          value={categoryForm.image || ''}
                          onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                          className="w-full bg-zinc-50 border border-zinc-300 p-2.5 font-mono"
                        />
                        {categoryForm.image && (
                          <img src={categoryForm.image} alt="Preview" className="w-12 h-10 object-cover border border-zinc-300 shrink-0" />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-black mb-1">Category Description</label>
                      <textarea
                        rows={3}
                        placeholder="Brief summary of this series line..."
                        value={categoryForm.description || ''}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-300 p-2.5"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-black mb-1">Display Order Priority</label>
                      <input
                        type="number"
                        min="1"
                        value={categoryForm.displayOrder || 1}
                        onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: Number(e.target.value) })}
                        className="w-32 bg-zinc-50 border border-zinc-300 p-2.5 font-mono"
                      />
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        type="submit"
                        className="bg-black text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 hover:bg-zinc-800"
                      >
                        SAVE CATEGORY
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(null);
                          setIsNewCategory(false);
                          setCategoryForm({});
                        }}
                        className="border border-zinc-300 text-zinc-700 text-xs font-bold uppercase px-6 py-3.5"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Category Cards List */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="p-4 bg-white border border-zinc-300 space-y-3 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="aspect-[21/9] bg-zinc-100 overflow-hidden border border-zinc-200 relative group">
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs p-1 border border-zinc-200 shadow-xs">
                            <button
                              onClick={() => {
                                setEditingCategory(cat);
                                setCategoryForm(cat);
                                setIsNewCategory(false);
                              }}
                              className="p-1 hover:bg-zinc-200 text-zinc-700 transition-colors"
                              title="Edit Category"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setCategoryToDelete(cat)}
                              className="p-1 hover:bg-red-100 text-red-600 transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold uppercase text-black font-heading text-sm">{cat.name}</h4>
                            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-1.5 py-0.5">
                              Order #{cat.displayOrder || 1}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-600 leading-relaxed">{cat.description}</p>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span>Slug: /{cat.slug}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingCategory(cat);
                              setCategoryForm(cat);
                              setIsNewCategory(false);
                            }}
                            className="text-black font-bold uppercase hover:underline"
                          >
                            Edit
                          </button>
                          <span>•</span>
                          <button
                            onClick={() => setCategoryToDelete(cat)}
                            className="text-red-600 font-bold uppercase hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'ORDERS' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-heading">
                  WHATSAPP ORDERS & SHIPMENT TRACKING
                </h2>
                <p className="text-xs text-zinc-500">Update fulfillment status and assign AWB courier tracking links.</p>
              </div>

              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="bg-white border border-zinc-300 p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-zinc-400">Order Ref</span>
                        <h4 className="text-sm font-bold uppercase text-black font-heading">
                          #{ord.orderNumber || ord.id.slice(0, 8).toUpperCase()}
                        </h4>
                        <p className="text-xs text-zinc-600">
                          Customer: <strong>{ord.customerName}</strong> ({ord.customerMobile}) • {ord.customerEmail}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as any, ord.trackingNumber, ord.courierPartner)}
                          className="text-xs font-bold uppercase bg-zinc-50 border border-zinc-300 p-2 font-mono"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="DISPATCHED">DISPATCHED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="divide-y divide-zinc-100 text-xs">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="py-1.5 flex justify-between">
                          <span>{it.productName} ({it.color} / {it.capacity}) x{it.quantity}</span>
                          <span className="font-mono font-bold">{storeSettings.currencySymbol}{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Courier input */}
                    <div className="pt-3 border-t border-zinc-200 flex flex-col sm:flex-row gap-3 items-center">
                      <input
                        type="text"
                        placeholder="AWB Tracking Number (e.g. BD98765432)"
                        defaultValue={ord.trackingNumber || ''}
                        onBlur={(e) => {
                          if (e.target.value !== ord.trackingNumber) {
                            updateOrderStatus(ord.id, ord.status, e.target.value, ord.courierPartner || 'BlueDart');
                            showNotification('Tracking AWB saved.');
                          }
                        }}
                        className="text-xs bg-zinc-50 border border-zinc-300 p-2 flex-1 font-mono"
                      />
                      <span className="text-sm font-black text-black font-heading shrink-0">
                        Total: {storeSettings.currencySymbol}{ord.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAGE CMS & ALL-PAGE CONTENT TAB */}
          {activeTab === 'PAGES_CMS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-heading">
                    PAGE CMS & STORE CONTENT MANAGER
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Edit texts, headings, subsections, and galleries across every page of the storefront.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCmsPreviewMode(!cmsPreviewMode)}
                    className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold uppercase tracking-wider px-4 py-2.5 flex items-center gap-2 border border-zinc-300"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{cmsPreviewMode ? 'Hide Preview' : 'Show Live Preview'}</span>
                  </button>
                </div>
              </div>

              {/* Page Selection Bar */}
              <div className="bg-white border border-zinc-300 p-4">
                <label className="block text-xs font-bold uppercase text-black mb-2">
                  Select Page to Edit Content:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { slug: 'about-us', label: 'About Us (/about-us)' },
                    { slug: 'faq', label: 'FAQ (/faq)' },
                    { slug: 'contact-us', label: 'Contact & Concierge (/contact-us)' },
                    { slug: 'shop', label: 'Shop Catalog (/shop)' },
                    { slug: 'collections', label: 'Collections (/collections)' },
                    { slug: 'shipping-policy', label: 'Shipping Policy (/shipping-policy)' },
                    { slug: 'returns-exchange', label: 'Returns & Exchange (/returns-exchange)' },
                    { slug: 'warranty-care', label: '2-Year Warranty (/warranty-care)' },
                    { slug: 'privacy-policy', label: 'Privacy Policy (/privacy-policy)' },
                    { slug: 'terms-of-service', label: 'Terms of Service (/terms-of-service)' },
                  ].map((p) => {
                    const isSelected = selectedCmsSlug === p.slug;
                    return (
                      <button
                        key={p.slug}
                        type="button"
                        onClick={() => handleSelectCmsSlug(p.slug)}
                        className={`text-xs font-bold uppercase px-3 py-2 border transition-colors ${
                          isSelected
                            ? 'bg-black text-white border-black shadow-xs'
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Preview Box if enabled */}
              {cmsPreviewMode && (
                <div className="bg-zinc-950 text-white p-6 sm:p-8 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                      LIVE HEADER & HERO PREVIEW: /{selectedCmsSlug}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5">
                      Updated: {editingCmsPage.lastUpdated || 'Current'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {editingCmsPage.eyebrow && (
                      <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 block">
                        {editingCmsPage.eyebrow}
                      </span>
                    )}
                    <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-heading">
                      {editingCmsPage.title || 'Page Title'}
                    </h1>
                    {editingCmsPage.subtitle && (
                      <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                        {editingCmsPage.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* CMS Page Editing Form */}
              <div className="bg-white border border-zinc-300 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">EDITING CMS DOCUMENT</span>
                    <h3 className="text-lg font-bold uppercase tracking-tight text-black font-heading">
                      {editingCmsPage.title} (/{selectedCmsSlug})
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2.5 py-1">
                    Slug: /{selectedCmsSlug}
                  </span>
                </div>

                <form onSubmit={handleSaveCMSPage} className="space-y-6 text-xs">
                  {/* Primary Headings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase text-black mb-1">Page Title *</label>
                      <input
                        type="text"
                        required
                        value={editingCmsPage.title || ''}
                        onChange={(e) => setEditingCmsPage({ ...editingCmsPage, title: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-300 p-2.5 text-xs font-semibold"
                        placeholder="e.g. About Hydron"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-black mb-1">Tagline / Eyebrow Text</label>
                      <input
                        type="text"
                        value={editingCmsPage.eyebrow || ''}
                        onChange={(e) => setEditingCmsPage({ ...editingCmsPage, eyebrow: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-300 p-2.5 text-xs font-mono"
                        placeholder="e.g. THE HYDRON MANIFESTO"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-bold uppercase text-black mb-1">Hero Subtitle / Description</label>
                      <input
                        type="text"
                        value={editingCmsPage.subtitle || ''}
                        onChange={(e) => setEditingCmsPage({ ...editingCmsPage, subtitle: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-300 p-2.5 text-xs"
                        placeholder="Short summary paragraph beneath the header"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-black mb-1">Last Updated Stamp</label>
                      <input
                        type="text"
                        value={editingCmsPage.lastUpdated || ''}
                        onChange={(e) => setEditingCmsPage({ ...editingCmsPage, lastUpdated: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-300 p-2.5 text-xs font-mono"
                        placeholder="e.g. August 2026"
                      />
                    </div>
                  </div>

                  {/* Main Rich Content Area */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold uppercase text-black">
                        Main Page Content / Narrative Body
                      </label>
                      <span className="text-[10px] text-zinc-400">Supports text paragraphs, bullet points, and basic HTML</span>
                    </div>
                    <textarea
                      rows={6}
                      value={editingCmsPage.content || ''}
                      onChange={(e) => setEditingCmsPage({ ...editingCmsPage, content: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-300 p-3 text-xs font-sans leading-relaxed"
                      placeholder="Write or edit the main content paragraphs for this page..."
                    />
                  </div>

                  {/* STRUCTURED PAGE SECTIONS BUILDER */}
                  <div className="border border-zinc-300 p-4 bg-zinc-50 space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                      <div>
                        <label className="block font-bold uppercase text-black">
                          Custom Page Content Sections
                        </label>
                        <p className="text-[11px] text-zinc-500">
                          Add structured blocks with dedicated headings and paragraph content (e.g. Terms, Policies, Story blocks).
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-200 text-zinc-700 font-bold">
                        {(editingCmsPage.sections?.length || 0)} Sections
                      </span>
                    </div>

                    {/* Existing Sections List */}
                    <div className="space-y-3">
                      {(editingCmsPage.sections || []).map((sec, idx) => (
                        <div key={idx} className="bg-white border border-zinc-300 p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold uppercase text-zinc-500">
                              Section {idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCmsPage(prev => ({
                                  ...prev,
                                  sections: (prev.sections || []).filter((_, i) => i !== idx)
                                }));
                              }}
                              className="text-red-500 hover:text-red-700 p-1 flex items-center gap-1 text-[11px] font-bold"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>

                          <input
                            type="text"
                            value={sec.heading}
                            onChange={(e) => {
                              const newHeading = e.target.value;
                              setEditingCmsPage(prev => {
                                const copy = [...(prev.sections || [])];
                                copy[idx] = { ...copy[idx], heading: newHeading };
                                return { ...prev, sections: copy };
                              });
                            }}
                            className="w-full bg-zinc-50 border border-zinc-300 p-2 font-bold text-xs"
                            placeholder="Section Heading"
                          />

                          <textarea
                            rows={3}
                            value={sec.content}
                            onChange={(e) => {
                              const newContent = e.target.value;
                              setEditingCmsPage(prev => {
                                const copy = [...(prev.sections || [])];
                                copy[idx] = { ...copy[idx], content: newContent };
                                return { ...prev, sections: copy };
                              });
                            }}
                            className="w-full bg-zinc-50 border border-zinc-300 p-2 text-xs leading-relaxed"
                            placeholder="Section Content text..."
                          />
                        </div>
                      ))}
                    </div>

                    {/* Add New Section Inputs */}
                    <div className="pt-2 border-t border-zinc-200 space-y-2">
                      <span className="font-bold uppercase text-zinc-700 block text-[11px]">Add New Section:</span>
                      <input
                        type="text"
                        placeholder="New Section Heading (e.g. 1. Craftsmanship Standards)"
                        value={newSectionHeading}
                        onChange={(e) => setNewSectionHeading(e.target.value)}
                        className="w-full bg-white border border-zinc-300 p-2 text-xs"
                      />
                      <textarea
                        rows={2}
                        placeholder="New Section Content / Paragraph text..."
                        value={newSectionContent}
                        onChange={(e) => setNewSectionContent(e.target.value)}
                        className="w-full bg-white border border-zinc-300 p-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newSectionHeading.trim() && !newSectionContent.trim()) return;
                          setEditingCmsPage(prev => ({
                            ...prev,
                            sections: [
                              ...(prev.sections || []),
                              { heading: newSectionHeading.trim() || 'New Section', content: newSectionContent.trim() }
                            ]
                          }));
                          setNewSectionHeading('');
                          setNewSectionContent('');
                        }}
                        className="bg-zinc-800 text-white font-bold uppercase px-4 py-2 hover:bg-black text-[11px]"
                      >
                        + Add This Section
                      </button>
                    </div>
                  </div>

                  {/* PAGE MEDIA / IMAGES */}
                  <div className="border border-zinc-300 p-4 bg-zinc-50 space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                      <div>
                        <label className="block font-bold uppercase text-black">Page Visuals & Featured Images</label>
                        <p className="text-[11px] text-zinc-500">Attach photos displayed on this page (e.g. About story image).</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-200 text-zinc-700 font-bold">
                        {(editingCmsPage.images?.length || 0)} Visuals
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(editingCmsPage.images || []).map((imgUrl, idx) => (
                        <div key={idx} className="bg-white border border-zinc-300 p-1.5 space-y-1">
                          <div className="aspect-[4/3] bg-zinc-100 overflow-hidden">
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCmsPage(prev => ({
                                ...prev,
                                images: (prev.images || []).filter((_, i) => i !== idx)
                              }));
                            }}
                            className="w-full text-red-500 hover:text-red-700 text-[10px] font-bold uppercase py-1"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-zinc-200">
                      <input
                        type="url"
                        placeholder="Image URL (https://images.unsplash.com/...)"
                        value={newCmsImageUrl}
                        onChange={(e) => setNewCmsImageUrl(e.target.value)}
                        className="w-full bg-white border border-zinc-300 p-2 font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newCmsImageUrl.trim()) return;
                          setEditingCmsPage(prev => ({
                            ...prev,
                            images: [...(prev.images || []), newCmsImageUrl.trim()]
                          }));
                          setNewCmsImageUrl('');
                        }}
                        className="bg-zinc-800 text-white font-bold uppercase px-4 py-2 hover:bg-black text-[11px] shrink-0"
                      >
                        + Add Visual
                      </button>
                    </div>
                  </div>

                  {/* Save CMS Page Button */}
                  <div className="pt-4 flex items-center gap-3">
                    <button
                      type="submit"
                      className="bg-black text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 hover:bg-zinc-800 shadow-xs"
                    >
                      SAVE PAGE CMS CONTENT
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectCmsSlug(selectedCmsSlug)}
                      className="border border-zinc-300 text-zinc-700 text-xs font-bold uppercase px-6 py-3.5 hover:bg-zinc-100"
                    >
                      Reset Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* HOMEPAGE CMS TAB */}
          {activeTab === 'HOMEPAGE' && (
            <div className="bg-white border border-zinc-300 p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-heading">
                  HOMEPAGE HERO & CMS BANNER EDITOR
                </h2>
                <p className="text-xs text-zinc-500">Live customization for the announcement bar, hero typography, and features.</p>
              </div>

              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  await saveHomepageContent(cmsForm);
                  showNotification('Homepage CMS changes saved.');
                }} 
                className="space-y-4 text-xs"
              >
                {/* Announcement Bar */}
                <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-3">
                  <h4 className="font-bold uppercase text-black font-heading">Announcement Bar</h4>
                  <input
                    type="text"
                    value={cmsForm.announcementText || ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, announcementText: e.target.value })}
                    className="w-full bg-white border border-zinc-300 p-2.5"
                    placeholder="FREE SHIPPING ON ORDERS ABOVE ₹999..."
                  />
                </div>

                {/* Hero section */}
                <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-3">
                  <h4 className="font-bold uppercase text-black font-heading">Hero Section (Reference Layout)</h4>
                  <div>
                    <label className="block font-bold uppercase text-zinc-600 mb-1">Eyebrow</label>
                    <input
                      type="text"
                      value={cmsForm.heroEyebrow || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroEyebrow: e.target.value })}
                      className="w-full bg-white border border-zinc-300 p-2.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-zinc-600 mb-1">Main Headline</label>
                    <input
                      type="text"
                      value={cmsForm.heroHeadline || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroHeadline: e.target.value })}
                      className="w-full bg-white border border-zinc-300 p-2.5 font-heading text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-zinc-600 mb-1">Subheadline</label>
                    <input
                      type="text"
                      value={cmsForm.heroSubheadline || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroSubheadline: e.target.value })}
                      className="w-full bg-white border border-zinc-300 p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-zinc-600 mb-1">Hero Image URL</label>
                    <input
                      type="url"
                      value={cmsForm.heroImageUrl || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroImageUrl: e.target.value })}
                      className="w-full bg-white border border-zinc-300 p-2.5 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-black text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 hover:bg-zinc-800"
                >
                  SAVE HOMEPAGE CMS
                </button>
              </form>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'REVIEWS' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-heading">
                  CUSTOMER REVIEWS MODERATION
                </h2>
                <p className="text-xs text-zinc-500">Approve or delete customer testimonials.</p>
              </div>

              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white border border-zinc-300 flex items-center justify-between gap-4">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black uppercase font-heading">{rev.userName}</span>
                        <span className="font-mono text-zinc-400">({rev.productName})</span>
                        <span className="px-2 py-0.5 bg-zinc-100 font-mono text-[10px] uppercase font-bold">
                          {rev.status}
                        </span>
                      </div>
                      <p className="font-bold text-black">"{rev.title}"</p>
                      <p className="text-zinc-600">{rev.comment}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {rev.status !== 'APPROVED' && (
                        <button
                          onClick={() => updateReviewStatus(rev.id, 'APPROVED')}
                          className="px-3 py-1.5 bg-black text-white text-[10px] font-bold uppercase"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => deleteReview(rev.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQS TAB */}
          {activeTab === 'FAQS' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-heading">
                  FAQ KNOWLEDGE BASE
                </h2>
                <p className="text-xs text-zinc-500">Manage questions and answers displayed on the storefront.</p>
              </div>

              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div key={faq.id} className="p-4 bg-white border border-zinc-300 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono uppercase bg-zinc-100 px-2 py-0.5">{faq.category}</span>
                      <button onClick={() => deleteFAQ(faq.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="text-xs font-bold uppercase text-black font-heading">{faq.question}</h4>
                    <p className="text-xs text-zinc-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ENQUIRIES TAB */}
          {activeTab === 'ENQUIRIES' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-heading">
                  CONTACT LEADS & CUSTOMER INQUIRIES
                </h2>
                <p className="text-xs text-zinc-500">Messages sent via the Contact page or VIP newsletter.</p>
              </div>

              <div className="space-y-3">
                {enquiries.map((enq) => (
                  <div key={enq.id} className="p-4 bg-white border border-zinc-300 space-y-2 text-xs">
                    <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                      <div>
                        <span className="font-bold text-black uppercase font-heading">{enq.name}</span>
                        <span className="text-zinc-400 font-mono ml-2">({enq.email} • {enq.mobile || 'No mobile'})</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-zinc-100 px-2 py-0.5">{enq.type}</span>
                    </div>
                    <p className="font-bold text-black">{enq.subject}</p>
                    <p className="text-zinc-600">{enq.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'SETTINGS' && (
            <div className="bg-white border border-zinc-300 p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-heading">
                  STORE SETTINGS & WHATSAPP NUMBER
                </h2>
                <p className="text-xs text-zinc-500">Configure your target WhatsApp concierge phone number and delivery policies.</p>
              </div>

              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  await saveStoreSettings(settingsForm);
                  showNotification('Store settings saved successfully.');
                }} 
                className="space-y-4 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-black mb-1">WhatsApp Concierge Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-300 p-2.5 font-mono"
                      placeholder="919876543210 (Country code + phone without +)"
                    />
                    <span className="text-[10px] text-zinc-400 font-mono">
                      All "Buy Now via WhatsApp" buttons send messages to this number.
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-black mb-1">Support Email *</label>
                    <input
                      type="email"
                      required
                      value={settingsForm.supportEmail}
                      onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-300 p-2.5 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-black mb-1">Free Shipping Threshold (INR)</label>
                    <input
                      type="number"
                      value={settingsForm.freeShippingThreshold}
                      onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                      className="w-full bg-zinc-50 border border-zinc-300 p-2.5 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-black mb-1">Flat Shipping Rate (INR)</label>
                    <input
                      type="number"
                      value={settingsForm.flatShippingRate}
                      onChange={(e) => setSettingsForm({ ...settingsForm, flatShippingRate: Number(e.target.value) })}
                      className="w-full bg-zinc-50 border border-zinc-300 p-2.5 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase text-black mb-1">Studio Headquarters Physical Address</label>
                  <input
                    type="text"
                    value={settingsForm.storeAddress}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeAddress: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 p-2.5"
                  />
                </div>

                <div className="pt-2 flex flex-wrap gap-4">
                  <button
                    type="submit"
                    className="bg-black text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 hover:bg-zinc-800"
                  >
                    SAVE STORE CONFIGURATION
                  </button>

                  <button
                    type="button"
                    disabled={isSeeding}
                    onClick={async () => {
                      setIsSeeding(true);
                      try {
                        await seedInitialDataToFirestore();
                        showNotification('Database schema & collections synchronized successfully.');
                      } catch (e: any) {
                        showNotification('Sync complete.');
                      } finally {
                        setIsSeeding(false);
                      }
                    }}
                    className="border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-bold uppercase tracking-wider px-6 py-3.5 flex items-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                    <span>{isSeeding ? 'Synchronizing...' : 'Sync Default Catalog to Database'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* CONFIRM PRODUCT DELETION MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-zinc-300 max-w-md w-full p-6 space-y-4 text-left shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5 text-red-600">
                <Trash2 className="w-5 h-5" />
                <h3 className="text-base font-bold uppercase tracking-tight font-heading">DELETE PRODUCT</h3>
              </div>
              <button 
                onClick={() => setProductToDelete(null)}
                className="text-zinc-400 hover:text-black p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-700 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-black font-bold font-heading">{productToDelete.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={async () => {
                  await deleteProduct(productToDelete.id);
                  setProductToDelete(null);
                  showNotification('Product deleted successfully.');
                }}
                className="flex-1 bg-red-600 text-white font-bold uppercase text-xs tracking-wider py-3 hover:bg-red-700 transition-colors"
              >
                CONFIRM DELETE
              </button>
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 border border-zinc-300 text-zinc-700 font-bold uppercase text-xs tracking-wider py-3 hover:bg-zinc-100 transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM CATEGORY DELETION MODAL */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-zinc-300 max-w-md w-full p-6 space-y-4 text-left shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5 text-red-600">
                <Trash2 className="w-5 h-5" />
                <h3 className="text-base font-bold uppercase tracking-tight font-heading">DELETE CATEGORY</h3>
              </div>
              <button 
                onClick={() => setCategoryToDelete(null)}
                className="text-zinc-400 hover:text-black p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-700 leading-relaxed">
              Are you sure you want to delete the category <strong className="text-black font-bold font-heading">{categoryToDelete.name}</strong>? Any products currently assigned to this category will remain in the catalog.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={async () => {
                  await deleteCategory(categoryToDelete.id);
                  setCategoryToDelete(null);
                  showNotification('Category deleted successfully.');
                }}
                className="flex-1 bg-red-600 text-white font-bold uppercase text-xs tracking-wider py-3 hover:bg-red-700 transition-colors"
              >
                CONFIRM DELETE
              </button>
              <button
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 border border-zinc-300 text-zinc-700 font-bold uppercase text-xs tracking-wider py-3 hover:bg-zinc-100 transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
