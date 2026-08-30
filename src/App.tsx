import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { SearchModal } from './components/common/SearchModal';
import { QuickViewModal } from './components/common/QuickViewModal';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';
import { MobileBottomNav } from './components/common/MobileBottomNav';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { PolicyPage } from './pages/PolicyPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AuthPage } from './pages/AuthPage';
import { CustomerAccountPage } from './pages/CustomerAccountPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { Product } from './types';

function MainRouter() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [productSlug, setProductSlug] = useState<string>('hydron-onyx-pro-flask');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>(undefined);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { currentUser, isAdmin } = useAuth();

  // Scroll to top when path changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath, productSlug]);

  const handleNavigate = (path: string) => {
    if (path.startsWith('/product/')) {
      const slug = path.replace('/product/', '');
      setProductSlug(slug);
      setCurrentPath('/product');
    } else {
      setCurrentPath(path);
    }
  };

  const handleSelectProduct = (slug: string) => {
    setProductSlug(slug);
    setCurrentPath('/product');
  };

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategoryFilter(categoryName);
    setCurrentPath('/shop');
  };

  // Render Page Content based on currentPath
  const renderPage = () => {
    if (currentPath === '/admin-login') {
      if (isAdmin) {
        return <AdminDashboard onExitAdmin={() => setCurrentPath('/')} />;
      }
      return (
        <AdminLoginPage
          onLoginSuccess={() => setCurrentPath('/admin')}
          onReturnHome={() => setCurrentPath('/')}
          onNavigateToCustomerAuth={() => setCurrentPath('/auth')}
        />
      );
    }

    if (currentPath === '/admin') {
      if (!isAdmin) {
        return (
          <AdminLoginPage
            onLoginSuccess={() => setCurrentPath('/admin')}
            onReturnHome={() => setCurrentPath('/')}
            onNavigateToCustomerAuth={() => setCurrentPath('/auth')}
          />
        );
      }
      return <AdminDashboard onExitAdmin={() => setCurrentPath('/')} />;
    }

    switch (currentPath) {
      case '/':
        return (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onSelectCategory={handleSelectCategory}
          />
        );

      case '/shop':
        return (
          <ShopPage
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            initialCategory={selectedCategoryFilter}
          />
        );

      case '/collections':
        return (
          <CollectionsPage
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onNavigateToShopWithCategory={handleSelectCategory}
          />
        );

      case '/product':
        return (
          <ProductDetailPage
            slug={productSlug}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        );

      case '/about':
        return <AboutPage onNavigateToShop={() => setCurrentPath('/shop')} />;

      case '/contact':
        return <ContactPage />;

      case '/faq':
        return <FAQPage />;

      case '/shipping':
        return <PolicyPage type="shipping" />;

      case '/returns':
        return <PolicyPage type="returns" />;

      case '/privacy':
        return <PolicyPage type="privacy" />;

      case '/terms':
        return <PolicyPage type="terms" />;

      case '/track-order':
        return <TrackOrderPage />;

      case '/auth':
        return (
          <AuthPage
            onSuccess={() => setCurrentPath('/account')}
            onNavigateToAdmin={() => setCurrentPath('/admin-login')}
          />
        );

      case '/account':
        return (
          <CustomerAccountPage
            onNavigateToShop={() => setCurrentPath('/shop')}
            onNavigateToAdmin={() => setCurrentPath(isAdmin ? '/admin' : '/admin-login')}
            onNavigateToTrack={() => setCurrentPath('/track-order')}
          />
        );

      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onSelectCategory={handleSelectCategory}
          />
        );
    }
  };

  const isAdminView = currentPath === '/admin' || currentPath === '/admin-login';

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 selection:bg-black selection:text-white font-sans antialiased">
      {/* Non-Admin Header */}
      {!isAdminView && (
        <Header currentPath={currentPath} onNavigate={handleNavigate} />
      )}

      {/* Main Page Area */}
      <main className="flex-1 w-full">
        {renderPage()}
      </main>

      {/* Non-Admin Footer & Floating Buttons */}
      {!isAdminView && (
        <>
          <Footer onNavigate={handleNavigate} />
          <WhatsAppFloatingButton />
          <MobileBottomNav currentPath={currentPath} onNavigate={handleNavigate} />
        </>
      )}

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <SearchModal onSelectProduct={handleSelectProduct} />
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFullDetails={handleSelectProduct}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <MainRouter />
      </StoreProvider>
    </AuthProvider>
  );
}
