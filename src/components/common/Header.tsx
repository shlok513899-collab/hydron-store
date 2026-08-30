import React, { useState } from 'react';
import { 
  Search, 
  User as UserIcon, 
  ShoppingBag, 
  Menu, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  LogOut, 
  LayoutDashboard, 
  PackageCheck, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Logo } from './Logo';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const { 
    homepageContent, 
    cartCount, 
    setIsCartOpen, 
    setIsSearchOpen 
  } = useStore();
  
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'SHOP', path: '/shop' },
    { label: 'COLLECTIONS', path: '/collections' },
    { label: 'ABOUT US', path: '/about' },
    { label: 'CONTACT', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
      {/* 1. Top Announcement Bar (Matching reference: Black bar with white uppercase text & icons) */}
      {homepageContent.showAnnouncement && (
        <div className="w-full bg-black text-white text-xs sm:text-[13px] font-medium tracking-wider py-2.5 px-4 sm:px-8 border-b border-zinc-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Center Announcement Text */}
            <div className="flex-1 text-center md:text-left tracking-widest uppercase font-semibold">
              <span>{homepageContent.announcementText}</span>
              {homepageContent.announcementLinkText && (
                <span className="hidden sm:inline-block ml-3 px-2 py-0.5 bg-zinc-800 text-[11px] rounded text-zinc-300 font-mono">
                  {homepageContent.announcementLinkText}
                </span>
              )}
            </div>

            {/* Quick Header Icons on Top Bar (User, Search, Cart) */}
            <div className="hidden md:flex items-center gap-6 text-zinc-300">
              {/* Search Icon */}
              <button 
                id="header-search-btn"
                onClick={() => setIsSearchOpen(true)}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Search Hydron Products"
              >
                <Search className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider hidden lg:inline">Search</span>
              </button>

              {/* User Account / Profile */}
              <div className="relative">
                <button
                  id="header-user-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Account"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider hidden lg:inline">
                    {currentUser ? (userProfile?.name?.split(' ')[0] || 'Account') : 'Sign In'}
                  </span>
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-950 text-white rounded-lg shadow-2xl border border-zinc-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {currentUser ? (
                      <>
                        <div className="px-4 py-2 border-b border-zinc-800">
                          <p className="text-xs text-zinc-400 font-mono">Signed in as</p>
                          <p className="text-sm font-semibold truncate text-white">{userProfile?.name || currentUser.email}</p>
                          {isAdmin && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-zinc-800 text-white text-[10px] uppercase tracking-wider rounded font-mono border border-zinc-700">
                              <ShieldCheck className="w-3 h-3" /> Admin
                            </span>
                          )}
                        </div>

                        {isAdmin && (
                          <button
                            onClick={() => handleNavClick('/admin')}
                            className="w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-900 transition-colors font-bold text-white"
                          >
                            <LayoutDashboard className="w-4 h-4" /> Admin Console
                          </button>
                        )}

                        <button
                          onClick={() => handleNavClick('/account')}
                          className="w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white"
                        >
                          <UserIcon className="w-4 h-4" /> My Profile & Orders
                        </button>

                        <button
                          onClick={() => handleNavClick('/track-order')}
                          className="w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white"
                        >
                          <PackageCheck className="w-4 h-4" /> Track Shipment
                        </button>

                        <div className="border-t border-zinc-800 my-1"></div>

                        <button
                          onClick={async () => {
                            await logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-red-950/40 text-red-400 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 text-xs text-zinc-400">
                          Access your orders, saved addresses & concierge support.
                        </div>
                        <button
                          onClick={() => handleNavClick('/auth')}
                          className="w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-zinc-900 text-white flex items-center justify-between"
                        >
                          <span>Sign In / Register</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleNavClick('/track-order')}
                          className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                        >
                          Quick Order Tracking
                        </button>
                        <div className="border-t border-zinc-800 my-1"></div>
                        <button
                          onClick={() => handleNavClick('/admin')}
                          className="w-full text-left px-4 py-2 text-[11px] uppercase tracking-wider text-zinc-500 hover:text-zinc-300"
                        >
                          Admin Access Portal
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart Counter */}
              <button 
                id="header-cart-btn"
                onClick={() => setIsCartOpen(true)}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer relative"
                title="View Bag"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-xs font-mono font-bold tracking-tight">({cartCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar (Clean White Background matching reference) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        {/* Left: Hydron Geometric Logo */}
        <div 
          onClick={() => handleNavClick('/')}
          className="cursor-pointer flex items-center gap-3"
          id="brand-logo-container"
        >
          <Logo variant="dark" size="md" showText={true} />
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`text-xs lg:text-[13px] font-bold tracking-[0.18em] uppercase transition-colors relative py-1 cursor-pointer ${
                  isActive ? 'text-black font-extrabold' : 'text-zinc-700 hover:text-black'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: SHOP NOW Solid Black CTA Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Search & Cart Icons */}
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 text-black hover:opacity-75"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 text-black relative"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Desktop SHOP NOW Button (Exact match to reference image) */}
          <button
            id="nav-shop-now-btn"
            onClick={() => handleNavClick('/shop')}
            className="hidden sm:inline-flex items-center gap-2.5 bg-black text-white text-xs lg:text-[13px] font-bold uppercase tracking-[0.15em] px-6 py-3 rounded-none hover:bg-zinc-800 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            <span>SHOP NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-black md:hidden focus:outline-hidden"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-zinc-200 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`text-left text-sm font-bold tracking-widest uppercase py-2 border-b border-zinc-100 ${
                  currentPath === link.path ? 'text-black' : 'text-zinc-600'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick(currentUser ? '/account' : '/auth')}
              className="text-left text-sm font-bold tracking-widest uppercase py-2 border-b border-zinc-100 text-zinc-600 flex items-center justify-between"
            >
              <span>{currentUser ? 'My Account' : 'Sign In / Register'}</span>
              <UserIcon className="w-4 h-4 text-zinc-400" />
            </button>
            {isAdmin && (
              <button
                onClick={() => handleNavClick('/admin')}
                className="text-left text-sm font-bold tracking-widest uppercase py-2 border-b border-zinc-100 text-black flex items-center justify-between"
              >
                <span>Admin Console</span>
                <ShieldCheck className="w-4 h-4 text-black" />
              </button>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleNavClick('/shop')}
              className="w-full flex items-center justify-center gap-2 bg-black text-white text-xs font-bold uppercase tracking-widest py-3.5"
            >
              <span>EXPLORE ALL BOTTLES</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
