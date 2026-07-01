import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Search, Heart, User } from 'lucide-react';
import { useStore } from '@/store';

export default function BottomNav() {
  const location = useLocation();
  const { setSearchOpen, cartCount } = useStore();

  const navItems = [
    { icon: <Home size={22} strokeWidth={1.5} />, label: 'Home', path: '/' },
    { icon: <ShoppingBag size={22} strokeWidth={1.5} />, label: 'Shop', path: '/shop' },
    { icon: <Search size={22} strokeWidth={1.5} />, label: 'Search', action: () => setSearchOpen(true) },
    { icon: <Heart size={22} strokeWidth={1.5} />, label: 'Wishlist', path: '/account/wishlist' },
    { icon: <User size={22} strokeWidth={1.5} />, label: 'Account', path: '/account' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-raius-bg/95 backdrop-blur-md border-t border-raius-glass-border md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = item.path && location.pathname === item.path;

          if (item.action) {
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="flex flex-col items-center gap-1 text-raius-text-secondary"
              >
                {item.icon}
                <span className="text-[10px] tracking-wide">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.path || '#'}
              className={`flex flex-col items-center gap-1 relative ${
                isActive ? 'text-raius-warm' : 'text-raius-text-secondary'
              }`}
            >
              {item.label === 'Shop' && cartCount() > 0 ? (
                <div className="relative">
                  {item.icon}
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-raius-warm rounded-full" />
                </div>
              ) : (
                item.icon
              )}
              <span className="text-[10px] tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
