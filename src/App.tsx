import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SearchOverlay from '@/components/SearchOverlay';
import BottomNav from '@/components/BottomNav';
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Collections from '@/pages/Collections';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Checkout from '@/pages/Checkout';
import Account from '@/pages/Account';
import Admin from '@/pages/Admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navigation />}
      {!isAdmin && <CartDrawer />}
      {!isAdmin && <SearchOverlay />}
      {children}
      {!isAdmin && <Footer />}
      {!isAdmin && <BottomNav />}
      {/* Bottom padding for mobile bottom nav */}
      <div className="h-16 md:hidden" />
    </>
  );
}

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:slug" element={<Collections />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/wishlist" element={<Account />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AppLayout>
  );
}
