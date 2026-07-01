import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useStore } from '@/store';
import { TextScramble } from '@/lib/textScramble';

export default function Navigation() {
  const navigate = useNavigate();
  const { cartCount, isCartOpen, setCartOpen, isSearchOpen, setSearchOpen, isMobileMenuOpen, setMobileMenuOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const logoRef = useRef<HTMLSpanElement>(null);
  const scrambleRef = useRef<TextScramble | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (logoRef.current && !scrambleRef.current) {
      scrambleRef.current = new TextScramble(logoRef.current);
    }
  }, []);

  const handleLogoClick = () => {
    if (scrambleRef.current) {
      scrambleRef.current.setText('RADIUS OF INFLUENCE').then(() => {
        setTimeout(() => {
          scrambleRef.current?.setText('RAIUS');
        }, 1500);
      });
    }
  };

  const navLinks = [
    { label: 'Shop', path: '/shop' },
    { label: 'Collections', path: '/collections' },
    { label: 'New In', path: '/shop?filter=new' },
    { label: 'About', path: '/about' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-raius-bg/90 backdrop-blur-md' : 'bg-transparent'
        }`}
        style={{ mixBlendMode: scrolled ? 'normal' : 'difference' }}
      >
        <div className="container-rai flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="text-micro tracking-[0.2em] text-raius-text hover:opacity-80 transition-opacity"
            onDoubleClick={() => navigate('/')}
          >
            <span ref={logoRef}>RAIUS</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.label} to={link.path} label={link.label} />
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setSearchOpen(!isSearchOpen)}
              className="text-raius-text hover:opacity-70 transition-opacity"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link
              to="/account/wishlist"
              className="text-raius-text hover:opacity-70 transition-opacity hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart size={20} strokeWidth={1.5} />
            </Link>
            <button
              onClick={() => setCartOpen(!isCartOpen)}
              className="text-raius-text hover:opacity-70 transition-opacity relative"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-raius-warm rounded-full" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-raius-text hover:opacity-70 transition-opacity md:hidden"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-raius-bg flex flex-col items-center justify-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="font-display text-3xl md:text-4xl text-raius-text hover:text-raius-warm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function NavLink({ to, label }: { to: string; label: string }) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const scrambleRef = useRef<TextScramble | null>(null);

  useEffect(() => {
    if (linkRef.current && !scrambleRef.current) {
      scrambleRef.current = new TextScramble(linkRef.current);
    }
  }, []);

  const handleMouseEnter = () => {
    scrambleRef.current?.setText(label);
  };

  return (
    <Link
      ref={linkRef}
      to={to}
      className="text-micro tracking-[0.1em] text-raius-text hover:opacity-80 transition-opacity"
      onMouseEnter={handleMouseEnter}
    >
      {label}
    </Link>
  );
}
