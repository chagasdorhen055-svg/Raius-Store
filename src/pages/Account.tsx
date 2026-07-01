import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Package, User, LogOut } from 'lucide-react';
import { useStore } from '@/store';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';

type AccountTab = 'overview' | 'orders' | 'wishlist' | 'settings';

export default function Account() {
  const { user, isAuthenticated, login, logout, orders, wishlist } = useStore();
  const [activeTab, setActiveTab] = useState<AccountTab>('overview');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login({
        id: 'user-1',
        email,
        firstName: 'Alex',
        lastName: 'Chen',
        addresses: [],
      });
    } else {
      login({
        id: 'user-1',
        email,
        firstName,
        lastName,
        addresses: [],
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-raius-bg flex items-center justify-center pt-20">
        <div className="w-full max-w-md px-6">
          <h1 className="font-display text-3xl text-raius-text text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-raius-text-secondary text-center mt-2">
            {isLogin ? 'Sign in to your RAIUS account' : 'Join the RAIUS community'}
          </p>

          <form onSubmit={handleAuth} className="mt-8 space-y-4">
            {!isLogin && (
              <>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  required
                  className="w-full bg-raius-elevated border border-raius-glass-border text-raius-text placeholder:text-raius-text-tertiary px-4 py-3 outline-none focus:border-raius-warm"
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  required
                  className="w-full bg-raius-elevated border border-raius-glass-border text-raius-text placeholder:text-raius-text-tertiary px-4 py-3 outline-none focus:border-raius-warm"
                />
              </>
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full bg-raius-elevated border border-raius-glass-border text-raius-text placeholder:text-raius-text-tertiary px-4 py-3 outline-none focus:border-raius-warm"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-raius-elevated border border-raius-glass-border text-raius-text placeholder:text-raius-text-tertiary px-4 py-3 outline-none focus:border-raius-warm"
            />
            <button
              type="submit"
              className="w-full py-4 bg-raius-warm text-raius-bg text-micro tracking-[0.1em] hover:brightness-110 transition-all"
            >
              {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p className="text-center text-sm text-raius-text-secondary mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-raius-warm hover:underline">
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </main>
    );
  }

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const tabs: { id: AccountTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <User size={18} /> },
    { id: 'orders', label: 'Orders', icon: <Package size={18} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} /> },
  ];

  return (
    <main className="min-h-screen bg-raius-bg pt-20 md:pt-24">
      <div className="container-rai max-w-[1000px] mx-auto py-8 md:py-12">
        <h1 className="font-display text-3xl md:text-4xl text-raius-text">My Account</h1>
        <p className="text-raius-text-secondary mt-2">Welcome back, {user?.firstName}</p>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 mt-8">
          {/* Sidebar */}
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  activeTab === tab.id ? 'bg-raius-elevated text-raius-text' : 'text-raius-text-secondary hover:text-raius-text'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-raius-text-secondary hover:text-raius-burgundy transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>

          {/* Content */}
          <div>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-raius-elevated p-6">
                  <h3 className="text-micro text-raius-text mb-4">ACCOUNT DETAILS</h3>
                  <p className="text-raius-text">{user?.firstName} {user?.lastName}</p>
                  <p className="text-raius-text-secondary text-sm mt-1">{user?.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-raius-elevated p-6">
                    <p className="text-3xl font-display text-raius-text">{orders.length}</p>
                    <p className="text-micro text-raius-text-secondary mt-1">ORDERS</p>
                  </div>
                  <div className="bg-raius-elevated p-6">
                    <p className="text-3xl font-display text-raius-text">{wishlist.length}</p>
                    <p className="text-micro text-raius-text-secondary mt-1">SAVED ITEMS</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={40} className="text-raius-text-tertiary mx-auto mb-4" />
                    <p className="text-raius-text-secondary">No orders yet</p>
                    <Link to="/shop" className="text-micro text-raius-warm mt-2 inline-block hover:underline">
                      START SHOPPING
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-raius-elevated p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-raius-text font-medium">{order.id}</p>
                            <p className="text-xs text-raius-text-tertiary mt-1">
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-raius-text">{formatPrice(order.total)}</p>
                            <span className="text-micro text-raius-warm">{order.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart size={40} className="text-raius-text-tertiary mx-auto mb-4" />
                    <p className="text-raius-text-secondary">Your wishlist is empty</p>
                    <Link to="/shop" className="text-micro text-raius-warm mt-2 inline-block hover:underline">
                      EXPLORE PRODUCTS
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {wishlistProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
