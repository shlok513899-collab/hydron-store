import React from 'react';
import { Home, ShoppingBag, Search, User, ShieldCheck, Sparkles, Compass } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

interface MobileBottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentPath, onNavigate }) => {
  const { cartCount, setIsCartOpen, setIsSearchOpen } = useStore();
  const { currentUser, isAdmin } = useAuth();

  const isHome = currentPath === '/';
  const isShop = currentPath === '/shop' || currentPath.startsWith('/product');
  const isCollections = currentPath === '/collections';
  const isAccount = currentPath === '/account' || currentPath === '/auth' || currentPath === '/admin';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center">
        {/* Home */}
        <button
          onClick={() => onNavigate('/')}
          className={`flex flex-col items-center justify-center py-1 px-1 transition-colors ${
            isHome ? 'text-black font-extrabold' : 'text-zinc-500 hover:text-black'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {isHome && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full" />
            )}
          </div>
          <span className="text-[10px] uppercase tracking-wider mt-1 font-heading">Home</span>
        </button>

        {/* Shop Catalog */}
        <button
          onClick={() => onNavigate('/shop')}
          className={`flex flex-col items-center justify-center py-1 px-1 transition-colors ${
            isShop ? 'text-black font-extrabold' : 'text-zinc-500 hover:text-black'
          }`}
        >
          <div className="relative">
            <Compass className={`w-5 h-5 ${isShop ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {isShop && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full" />
            )}
          </div>
          <span className="text-[10px] uppercase tracking-wider mt-1 font-heading">Shop</span>
        </button>

        {/* Search Modal Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-1 text-zinc-500 hover:text-black transition-colors"
        >
          <Search className="w-5 h-5 stroke-2" />
          <span className="text-[10px] uppercase tracking-wider mt-1 font-heading">Search</span>
        </button>

        {/* Bag / Cart with Live Badge */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-1 text-zinc-500 hover:text-black transition-colors relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-2" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white animate-in zoom-in">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-wider mt-1 font-heading">Bag</span>
        </button>

        {/* Account / Admin */}
        <button
          onClick={() => onNavigate(isAdmin ? '/admin' : (currentUser ? '/account' : '/auth'))}
          className={`flex flex-col items-center justify-center py-1 px-1 transition-colors ${
            isAccount ? 'text-black font-extrabold' : 'text-zinc-500 hover:text-black'
          }`}
        >
          <div className="relative">
            {isAdmin ? (
              <ShieldCheck className={`w-5 h-5 ${isAccount ? 'stroke-[2.5] text-black' : 'stroke-2'}`} />
            ) : (
              <User className={`w-5 h-5 ${isAccount ? 'stroke-[2.5]' : 'stroke-2'}`} />
            )}
            {isAccount && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full" />
            )}
          </div>
          <span className="text-[10px] uppercase tracking-wider mt-1 font-heading">
            {isAdmin ? 'Admin' : (currentUser ? 'Account' : 'Login')}
          </span>
        </button>
      </div>
    </div>
  );
};
